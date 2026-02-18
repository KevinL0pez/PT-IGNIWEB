import express from 'express'
import cors from 'cors'
import routes from './routes'

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'OK' })
})

// Routes
app.use('/api', routes)

export default app