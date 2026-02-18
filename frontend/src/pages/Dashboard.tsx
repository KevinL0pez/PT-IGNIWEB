import { useState, useEffect, useCallback } from 'react'
import type { Crypto, PriceHistory } from '../types/crypto'
import { getCryptos, addCrypto, getHistory } from '../services/api'
import { useAutoRefresh } from '../hooks/useAutoRefresh'
import SearchBar from '../components/SearchBar'
import CryptoTable from '../components/CryptoTable'
import CryptoChart from '../components/CryptoChart'

import '../css/dashboard.css'

export default function Dashboard() {
  const [cryptos, setCryptos] = useState<Crypto[]>([])
  const [history, setHistory] = useState<PriceHistory[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const loadCryptos = useCallback(async () => {
    const data = await getCryptos()
    setCryptos(data)
  }, [])

  useEffect(() => {
    let cancelled = false
    getCryptos().then((data) => {
      if (!cancelled) setCryptos(data)
    })
    return () => { cancelled = true }
  }, [])

  useAutoRefresh(loadCryptos, 30000)

  const handleAdd = async (symbol: string) => {
    setLoading(true)
    await addCrypto(symbol)
    await loadCryptos()
    setLoading(false)
  }

  const handleSelect = async (id: number) => {
    setSelectedId(id)
    const today = new Date().toISOString()
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString()
    const data = await getHistory(id, weekAgo, today)
    setHistory(data)
  }

  return (
    <div className="dashboard-container">

      <header className="dashboard-header">
        <h1>📊 Crypto Investment Dashboard</h1>
        <SearchBar onSearch={handleAdd} />
      </header>

      <section className="summary-section">
        <div className="summary-card">
          <h3>Total Cryptos</h3>
          <p>{cryptos.length}</p>
        </div>

        <div className="summary-card">
          <h3>Last Updated</h3>
          <p>{new Date().toLocaleTimeString()}</p>
        </div>
      </section>

      <section className="content-grid">
        <div className="table-container">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <CryptoTable cryptos={cryptos} onSelect={handleSelect} />
          )}
        </div>

        <div className="chart-container">
          {selectedId ? (
            <CryptoChart data={history} />
          ) : (
            <div className="placeholder">
              <p>Select a crypto to see chart 📈</p>
            </div>
          )}
        </div>
      </section>

    </div>
  )
}