import { Router } from 'express'
import { pool } from '../config/database'

const router = Router()

router.get('/users', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users')
    res.json(result.rows)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router