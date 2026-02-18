import 'dotenv/config'
import app from './app'
import { pool } from './config/database'

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    // Probar conexión a DB antes de levantar servidor
    await pool.query('SELECT 1')
    console.log('(-) Base de datos conectada')

    app.listen(PORT, () => {
      console.log(`(-) Servidor corriendo en http://localhost:${PORT}`)
    })

  } catch (error) {
    console.error('(X) Failed to start server:', error)
    process.exit(1)
  }
}

startServer()