import { pool } from '../config/database'

export const cryptoRepository = {

  async findAll() {
    const result = await pool.query(`
      SELECT c.id, c.name, c.symbol,
             ps.price_usd,
             ps.percent_change_24h,
             ps.volume_24h
      FROM crypto_currency c
      LEFT JOIN price_snapshot ps 
        ON ps.crypto_id = c.id
        AND ps.recorded_at = (
          SELECT MAX(recorded_at)
          FROM price_snapshot
          WHERE crypto_id = c.id
        )
    `)

    return result.rows
  },

  async createCrypto(data: any) {
    const result = await pool.query(
      `INSERT INTO crypto_currency (cmc_id, name, symbol, slug)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (cmc_id) DO NOTHING
       RETURNING *`,
      [data.id, data.name, data.symbol, data.slug]
    )
  
    return result.rows[0]
  },

  async insertPriceSnapshot(snapshot: any) {
    await pool.query(
      `INSERT INTO price_snapshot
       (crypto_id, price_usd, percent_change_1h, percent_change_24h,
        percent_change_7d, volume_24h, market_cap)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        snapshot.crypto_id,
        snapshot.price_usd,
        snapshot.percent_change_1h,
        snapshot.percent_change_24h,
        snapshot.percent_change_7d,
        snapshot.volume_24h,
        snapshot.market_cap
      ]
    )
  },

  async getHistory(cryptoId: number, from: string, to: string) {
    const result = await pool.query(
      `SELECT recorded_at, price_usd
       FROM price_snapshot
       WHERE crypto_id = $1
       AND recorded_at BETWEEN $2 AND $3
       ORDER BY recorded_at ASC`,
      [cryptoId, from, to]
    )

    return result.rows
  }
}

