import { useState } from 'react'
import type { Crypto } from '../types/crypto'
import CryptoRow from './CryptoRow'
import '../css/cryptoTable.css'

const PAGE_SIZE_OPTIONS = [5, 10, 25]

interface Props {
  cryptos: Crypto[]
  onSelect: (id: number) => void
  selectedId?: number
}

export default function CryptoTable({ cryptos, onSelect, selectedId }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const total = cryptos.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const page = Math.min(currentPage, totalPages)
  const start = (page - 1) * pageSize
  const end = Math.min(start + pageSize, total)
  const cryptosForPage = cryptos.slice(start, end)

  const goPrev = () => setCurrentPage((p) => Math.max(1, p - 1))
  const goNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1))

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

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
          {cryptosForPage.map((c) => (
            <CryptoRow
              key={c.id}
              crypto={c}
              onSelect={onSelect}
              isSelected={selectedId === c.id}
            />
          ))}
        </tbody>
      </table>

      {total > 0 && (
        <div className="crypto-table-pagination" role="navigation" aria-label="Paginación">
          <div className="pagination-left">
            <span className="pagination-info">
              Mostrando {start + 1}-{end} de {total}
            </span>
            <div className="pagination-size">
              <span className="pagination-size-label">Mostrar:</span>
              {PAGE_SIZE_OPTIONS.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`pagination-size-btn ${pageSize === size ? 'active' : ''}`}
                  onClick={() => handlePageSizeChange(size)}
                  title={`${size} por página`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn"
              onClick={goPrev}
              disabled={page <= 1}
              aria-label="Página anterior"
            >
              Anterior
            </button>
            <span className="pagination-pages" aria-live="polite">
              Página {page} de {totalPages}
            </span>
            <button
              type="button"
              className="pagination-btn"
              onClick={goNext}
              disabled={page >= totalPages}
              aria-label="Página siguiente"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
