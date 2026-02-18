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
      <div className="crypto-table-header">
        <h3 className="crypto-table-title">Criptomonedas</h3>
        <p className="crypto-table-hint">Haz clic en una fila para ver la gráfica</p>
      </div>
      <table className="crypto-table" role="grid" aria-label="Listado de criptomonedas">
        <thead>
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Símbolo</th>
            <th scope="col" className="th-numeric">Precio (USD)</th>
            <th scope="col" className="th-numeric">Cambio 24h</th>
            <th scope="col" className="th-numeric">Volumen 24h</th>
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