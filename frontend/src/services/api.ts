const BASE_URL = 'http://localhost:3000/api'

export async function getCryptos() {
  const res = await fetch(`${BASE_URL}/cryptos`)
  return res.json()
}

export async function addCrypto(symbol: string) {
  const res = await fetch(`${BASE_URL}/cryptos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ symbol })
  })

  if (!res.ok) {
    let message = res.status === 404 ? 'Crypto no encontrada' : 'No se pudo agregar la crypto'
    try {
      const data = await res.json()
      if (data?.message) message = data.message
      else if (data?.error) message = data.error
    } catch {
      // usar mensaje por defecto según status
    }
    throw new Error(message)
  }

  return res.json()
}

export async function getHistory(id: number, from: string, to: string) {
  const res = await fetch(
    `${BASE_URL}/cryptos/${id}/history?from=${from}&to=${to}`
  )
  return res.json()
}