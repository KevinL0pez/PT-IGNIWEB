import { Request, Response } from 'express'
import { cryptoService } from '../services/crypto.service'

export const cryptoController = {

  async getAll(req: Request, res: Response) {
    const data = await cryptoService.getAll()
    res.json(data)
  },

  async create(req: Request, res: Response) {
    try {
      const { symbol } = req.body
      await cryptoService.addCrypto(symbol)
      res.status(201).json({ message: 'Crypto added' })
    } catch (error: any) {
      res.status(error.status || 500).json({ message: error.message })
    }
  },

  async getHistory(req: Request, res: Response) {
    const { id } = req.params
    const { from, to } = req.query

    const data = await cryptoService.getHistory(
      Number(id),
      from as string,
      to as string
    )

    res.json(data)
  }
}