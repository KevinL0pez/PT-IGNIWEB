# Modelo Entidad-Relación — CryptoInvestment

## 1. Diagrama ER (notación textual)

```
┌─────────────────────────────────┐       ┌─────────────────────────────────────┐
│        crypto_currency          │       │          price_snapshot              │
├─────────────────────────────────┤       ├─────────────────────────────────────┤
│ PK  id        SERIAL            │       │ PK  id                 SERIAL       │
│ UQ  cmc_id    INTEGER NOT NULL  │       │ FK  crypto_id          INTEGER      │
│     name      VARCHAR(100)      │──1:N──│     price_usd          DECIMAL(18,8)│
│     symbol    VARCHAR(20)       │       │     percent_change_1h  DECIMAL(10,4)│
│     slug      VARCHAR(100)      │       │     percent_change_24h DECIMAL(10,4)│
└─────────────────────────────────┘       │     percent_change_7d  DECIMAL(10,4)│
                                          │     volume_24h         DECIMAL(20,2)│
                                          │     market_cap         DECIMAL(20,2)│
                                          │     recorded_at        TIMESTAMP    │
                                          └─────────────────────────────────────┘
```

## 2. Entidades

### 2.1. crypto_currency

Almacena las criptomonedas que los inversores han agregado a su lista de seguimiento.

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| **id** | SERIAL / INT AUTO_INCREMENT | PRIMARY KEY | Identificador único interno |
| **cmc_id** | INTEGER | UNIQUE, NOT NULL | ID de la criptomoneda en CoinMarketCap (evita duplicados) |
| **name** | VARCHAR(100) | NOT NULL | Nombre completo (ej. "Bitcoin", "Ethereum") |
| **symbol** | VARCHAR(20) | NOT NULL | Símbolo de la moneda (ej. "BTC", "ETH") |
| **slug** | VARCHAR(100) | NOT NULL | Slug URL de CoinMarketCap (ej. "bitcoin") |

### 2.2. price_snapshot

Registra cada captura de precio obtenida de la API de CoinMarketCap. Permite reconstruir el historial de precios para cualquier rango de tiempo.

| Atributo | Tipo | Restricción | Descripción |
|----------|------|-------------|-------------|
| **id** | SERIAL / INT AUTO_INCREMENT | PRIMARY KEY | Identificador único del snapshot |
| **crypto_id** | INTEGER | FOREIGN KEY → crypto_currency(id), NOT NULL | Referencia a la criptomoneda |
| **price_usd** | DECIMAL(18,8) | NOT NULL | Precio en USD al momento de la captura |
| **percent_change_1h** | DECIMAL(10,4) | NULLABLE | Cambio porcentual en la última hora |
| **percent_change_24h** | DECIMAL(10,4) | NULLABLE | Cambio porcentual en las últimas 24 horas |
| **percent_change_7d** | DECIMAL(10,4) | NULLABLE | Cambio porcentual en los últimos 7 días |
| **volume_24h** | DECIMAL(20,2) | NULLABLE | Volumen de transacciones en 24h (USD) |
| **market_cap** | DECIMAL(20,2) | NULLABLE | Capitalización de mercado (USD) |
| **recorded_at** | TIMESTAMP | NOT NULL, DEFAULT NOW() | Fecha y hora de la captura |

## 3. Relaciones

| Relación | Tipo | Descripción |
|----------|------|-------------|
| crypto_currency → price_snapshot | **1:N** (uno a muchos) | Una criptomoneda tiene muchos snapshots de precio registrados a lo largo del tiempo. Cada snapshot pertenece a exactamente una criptomoneda. |

**Cardinalidad:**
- Un registro en `crypto_currency` puede tener **0 o más** registros en `price_snapshot`.
- Un registro en `price_snapshot` pertenece a **exactamente 1** registro en `crypto_currency`.

**Regla de integridad referencial:**
- `ON DELETE CASCADE`: Si se elimina una criptomoneda, todos sus snapshots asociados se eliminan automáticamente.

## 4. Índices

| Tabla | Índice | Columnas | Propósito |
|-------|--------|----------|-----------|
| crypto_currency | PK (id) | id | Búsqueda por ID |
| crypto_currency | UQ (cmc_id) | cmc_id | Evitar duplicados de CoinMarketCap |
| price_snapshot | PK (id) | id | Búsqueda por ID |
| price_snapshot | idx_snapshot_crypto_date | crypto_id, recorded_at DESC | Consultas de historial por rango de tiempo (rendimiento) |

## 5. Diagrama ER — Notación Chen simplificada

```
                    ┌──────────────┐
                    │              │
                    │   crypto     │
                    │  _currency   │
                    │              │
                    └──────┬───────┘
                           │
                           │ 1
                           │
                    ┌──────┴───────┐
                    │              │
                    │    TIENE     │
                    │              │
                    └──────┬───────┘
                           │
                           │ N
                           │
                    ┌──────┴───────┐
                    │              │
                    │    price     │
                    │  _snapshot   │
                    │              │
                    └──────────────┘
```

## 6. Justificación del diseño

- **Separación en dos tablas**: Se separa la identidad de la criptomoneda de sus datos de precio para normalizar los datos y permitir almacenar un historial ilimitado de capturas.
- **Snapshots temporales**: Cada ejecución del cron (cada 5 minutos) genera un nuevo registro en `price_snapshot`, construyendo progresivamente una línea de tiempo de precios.
- **Índice compuesto** `(crypto_id, recorded_at DESC)`: Optimiza la consulta principal del historial que filtra por criptomoneda y rango de fechas, ordenando cronológicamente.
- **DECIMAL para valores monetarios**: Evita errores de punto flotante en cálculos financieros.
