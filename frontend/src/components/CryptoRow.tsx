import type { Crypto } from '../types/crypto'

interface Props {
  crypto: Crypto
  onSelect: (id: number) => void
  isSelected?: boolean
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
      <td>${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
      <td className={isPositive ? 'positive' : 'negative'}>
        {isPositive ? '▲' : '▼'} {change.toFixed(2)}%
      </td>
      <td>${volume.toLocaleString()}</td>
    </tr>
  )
}