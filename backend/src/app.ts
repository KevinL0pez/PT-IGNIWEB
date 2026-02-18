import express from 'express'
import cors from 'cors'
import cryptoRoutes from './routes/crypto.routes'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/cryptos', cryptoRoutes)

export default app