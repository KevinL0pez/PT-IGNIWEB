import 'dotenv/config'
import app from './app'
import { cryptoService } from './services/crypto.service'

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`(-) Server running on port ${PORT}`)
})

// Actualización automática cada 5 min
setInterval(() => {
  console.log('(-) Updating crypto prices...')
  cryptoService.updatePrices()
}, 300000)