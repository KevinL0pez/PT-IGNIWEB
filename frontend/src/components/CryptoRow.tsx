import type { Crypto } from '../types/crypto'

interface Props {
  crypto: Crypto
  onSelect: (id: number) => void
  isSelected?: boolean
}

function formatVolume(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}B`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`
  return `$${value.toFixed(0)}`
}

export default function CryptoRow({ crypto, onSelect, isSelected }: Props) {
  const price = Number(crypto.price_usd || 0)
  const volume = Number(crypto.volume_24h || 0)
  const change = Number(crypto.percent_change_24h || 0)

  const isPositive = change >= 0

  return (
    <tr
      className={`crypto-row ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(crypto.id)}
    >
      <td className="crypto-name">{crypto.name}</td>
      <td className="crypto-symbol">{crypto.symbol}</td>
      <td className="td-numeric crypto-price">
        ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </td>
      <td className={`td-numeric ${isPositive ? 'positive' : 'negative'}`}>
        <span className="change-badge">
          {isPositive ? '+' : ''}{change.toFixed(2)}%
        </span>
      </td>
      <td className="td-numeric crypto-volume" title={`$${volume.toLocaleString()}`}>
        {formatVolume(volume)}
      </td>
    </tr>
  )
}