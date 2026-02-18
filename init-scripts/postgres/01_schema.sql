-- ============================================
-- CryptoInvestment - Schema PostgreSQL
-- ============================================

CREATE TABLE IF NOT EXISTS crypto_currency (
    id        SERIAL PRIMARY KEY,
    cmc_id    INTEGER NOT NULL UNIQUE,
    name      VARCHAR(100) NOT NULL,
    symbol    VARCHAR(20)  NOT NULL,
    slug      VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS price_snapshot (
    id                 SERIAL PRIMARY KEY,
    crypto_id          INTEGER        NOT NULL REFERENCES crypto_currency(id) ON DELETE CASCADE,
    price_usd          DECIMAL(18,8)  NOT NULL,
    percent_change_1h  DECIMAL(10,4),
    percent_change_24h DECIMAL(10,4),
    percent_change_7d  DECIMAL(10,4),
    volume_24h         DECIMAL(20,2),
    market_cap         DECIMAL(20,2),
    recorded_at        TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_snapshot_crypto_date
    ON price_snapshot (crypto_id, recorded_at DESC);
