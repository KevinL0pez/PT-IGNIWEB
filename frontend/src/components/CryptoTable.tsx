import type { Crypto } from '../types/crypto'
import CryptoRow from './CryptoRow'
import '../css/cryptoTable.css'

interface Props {
  cryptos: Crypto[]
  onSelect: (id: number) => void
  selectedId?: number
}

export default function CryptoTable({ cryptos, onSelect, selectedId }: Props) {
  return (
    <div className="table-wrapper">
      <table className="crypto-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Crypto</th>
            <th>Precio</th>
            <th>24h %</th>
            <th>Volumen</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map(c => (
            <CryptoRow
              key={c.id}
              crypto={c}
              onSelect={onSelect}
              isSelected={selectedId === c.id}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}