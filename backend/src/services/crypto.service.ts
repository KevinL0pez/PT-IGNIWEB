import { cmcClient } from '../config/coinmarketcap'
import { cryptoRepository } from '../repositories/crypto.repository'

export const cryptoService = {

  async getAll() {
    return cryptoRepository.findAll()
  },

  async addCrypto(symbol: string) {
    const response = await cmcClient.get(
      `/cryptocurrency/quotes/latest?symbol=${symbol}`
    )

    const data = response.data.data[symbol]
    console.log(data);
    
    if (!data) {
      const error: any = new Error('Crypto not found')
      error.status = 404
      throw error
    }

    await cryptoRepository.createCrypto({
      cmc_id: data.id,
      name: data.name,
      symbol: data.symbol,
      slug: data.slug
    })

  },

  async updatePrices() {
    const cryptos = await cryptoRepository.findAll()

    for (const crypto of cryptos as any[]) {
      const response = await cmcClient.get(
        `/cryptocurrency/quotes/latest?symbol=${crypto.symbol}`
      )

      const data = response.data.data[crypto.symbol]

      await cryptoRepository.insertPriceSnapshot({
        crypto_id: crypto.id,
        price: data.quote.USD.price,
        percent_change_1h: data.quote.USD.percent_change_1h,
        percent_change_24h: data.quote.USD.percent_change_24h,
        percent_change_7d: data.quote.USD.percent_change_7d,
        volume_24h: data.quote.USD.volume_24h,
        market_cap: data.quote.USD.market_cap
      })
    }
  },

  async getHistory(id: number, from: string, to: string) {
    return cryptoRepository.getHistory(id, from, to)
  }
}