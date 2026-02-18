import { useState, useEffect, useCallback } from 'react'
import type { Crypto, PriceHistory } from '../types/crypto'
import { getCryptos, addCrypto, getHistory } from '../services/api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import SearchBar from '../components/SearchBar'
import CryptoTable from '../components/CryptoTable'
import CryptoChart from '../components/CryptoChart'

import '../css/dashboard.css'

export type TimeRange = '1h' | '1d' | '7d' | '30d'

const TIME_RANGES: { value: TimeRange; label: string; title: string }[] = [
  { value: '1h', label: 'Última hora', title: 'Ver datos de la última hora' },
  { value: '1d', label: 'Hoy', title: 'Ver datos de hoy (desde las 00:00)' },
  { value: '7d', label: 'Última semana', title: 'Ver datos de los últimos 7 días' },
  { value: '30d', label: 'Último mes', title: 'Ver datos del último mes' },
]

function getRangeDates(range: TimeRange): { from: string; to: string } {
  const now = new Date()
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
  const to = endOfToday.toISOString()
  let from: Date
  switch (range) {
    case '1h':
      from = new Date(Date.now() - 60 * 60 * 1000)
      break
    case '1d':
      from = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)
      break
    case '7d':
      from = new Date(Date.now() - 7 * 86400000)
      break
    case '30d':
      from = new Date(Date.now() - 30 * 86400000)
      break
    default:
      from = new Date(Date.now() - 7 * 86400000)
  }
  return { from: from.toISOString(), to }
}

export default function Dashboard() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')
  const [loading, setLoading] = useState(false)
  const [chartLoading, setChartLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadCryptos = useCallback(async () => {
    const data = await getCryptos()
    setCryptos(data)
    setLastUpdated(new Date())
  }, [])

  useEffect(() => {
    let cancelled = false
    getCryptos().then((data) => {
      if (!cancelled) {
        setCryptos(data)
        setLastUpdated(new Date())
      }
    })
    return () => { cancelled = true }
  }, [])

  useAutoRefresh(loadCryptos, 30000)

  const handleAdd = async (symbol: string) => {
    setLoading(true)
    try {
      await addCrypto(symbol)
      await loadCryptos()
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = useCallback(async (id: number, range: TimeRange) => {
    const { from, to } = getRangeDates(range)
    const data = await getHistory(id, from, to)
    setHistory(data)
  }, [])

  const handleSelect = async (id: number) => {
    setSelectedId(id)
    setChartLoading(true)
    try {
      await fetchHistory(id, timeRange)
    } finally {
      setChartLoading(false)
    }
  }

  const handleTimeRangeChange = async (range: TimeRange) => {
    setTimeRange(range)
    if (selectedId !== null) {
      setChartLoading(true)
      try {
        await fetchHistory(selectedId, range)
      } finally {
        setChartLoading(false)
      }
    }
  }

  const selectedCrypto = cryptos.find(c => c.id === selectedId)

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>CryptoInvestment</h1>
        <SearchBar onSearch={handleAdd} />
      </header>

      <section className="summary-section">
        <div className="summary-card">
          <h3>Total Cryptos</h3>
          <p>{cryptos.length}</p>
        </div>

        <div className="summary-card">
          <h3>Última Actualización</h3>
          <p>{lastUpdated ? lastUpdated.toLocaleTimeString() : '—'}</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-container">
          {loading ? (
            <p className="loading">Cargando...</p>
          ) : (
            <CryptoTable
              cryptos={cryptos}
              onSelect={handleSelect}
              selectedId={selectedId ?? undefined}
            />
          )}
        </div>

        <div className="chart-container">
          {selectedId ? (
            <>
              <div className="chart-header-row">
                {selectedCrypto && (
                  <h2>
                    {selectedCrypto.name} ({selectedCrypto.symbol})
                  </h2>
                )}
                <div className="chart-range-selector" role="group" aria-label="Período de la gráfica">
                  <span className="chart-range-label-text">Período:</span>
                  {TIME_RANGES.map(({ value, label, title }) => (
                    <button
                      key={value}
                      type="button"
                      className={`chart-range-btn ${timeRange === value ? 'active' : ''}`}
                      onClick={() => handleTimeRangeChange(value)}
                      disabled={chartLoading}
                      title={title}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {chartLoading ? (
                <p className="loading">Cargando gráfica...</p>
              ) : (
                <CryptoChart data={history} symbol={selectedCrypto?.symbol} />
              )}
            </>
          ) : (
            <div className="placeholder">
              <p>Selecciona una crypto para ver la grafica 📈</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}