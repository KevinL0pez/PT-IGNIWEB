# CryptoInvestment

Aplicación web SPA para seguimiento en tiempo real de criptomonedas. Permite agregar monedas por símbolo, ver precios, cambios porcentuales, volumen y gráficas de historial con rangos de tiempo configurables.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite + Recharts
- **Backend:** Node.js + Express 5 + TypeScript
- **Base de datos:** PostgreSQL 15 (Docker)
- **API externa:** CoinMarketCap API

## Requisitos previos

- Node.js 18+
- Docker y Docker Compose
- API Key de [CoinMarketCap](https://coinmarketcap.com/api/)

## Instalación

```bash
# 1. Levantar la base de datos
docker-compose up -d postgres-db

# 2. Backend
cd backend
cp .env.example .env   # Configurar CMC_API_KEY
npm install
npm run dev

# 3. Frontend
cd frontend
npm install
npm run dev
```

## Estructura del proyecto

```
PT_IGNIWEB/
├── backend/          # API REST (Express + TypeScript)
├── frontend/         # SPA (React + Vite)
├── init-scripts/     # Scripts SQL de inicialización
└── docker-compose.yml
├── /                 # Documentación (RF/RNF, modelo ER, guion, Postman)
```

## Funcionalidades

- Agregar criptomonedas por símbolo (BTC, ETH, etc.)
- Tabla paginada con precio, cambio 24h y volumen
- Gráfica interactiva de historial (1h, 1d, 7d, 30d)
- Actualización automática (backend: 5 min, frontend: 30s)
- Persistencia de datos con historial temporal
- Diseño responsivo (móvil, tablet, escritorio)
