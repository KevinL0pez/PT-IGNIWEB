import { useState } from 'react'
import '../css/searchBar.css'

interface Props {
  onSearch: (symbol: string) => Promise<void> | void
}

export default function SearchBar({ onSearch }: Props) {
  const [symbol, setSymbol] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleaned = symbol.trim().toUpperCase()

    if (!cleaned) {
      setError('Por favor ingrese una crypto')
      return
    }

    try {
      setLoading(true)
      setError('')
      await onSearch(cleaned)
      setSymbol('')
    } catch (err) {
      console.error(err)
      setError('Crypto no encontrada...')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <div className={`search-container ${error ? 'error' : ''}`}>
        <span className="search-icon">🔍</span>

        <input
          value={symbol}
          onChange={(e) => {
            setSymbol(e.target.value)
            setError('')
          }}
          placeholder="Buscar crypto (BTC, USDT, etc...)"
          disabled={loading}
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Agregando...' : 'Agregar'}
        </button>
      </div>

      {error && <p className="search-error">{error}</p>}
    </form>
  )
}