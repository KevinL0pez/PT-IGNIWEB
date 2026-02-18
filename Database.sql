CREATE DATABASE crypto_investment;
USE crypto_investment;

-- -----------------------------------------------
-- Tabla: crypto_currency
-- Almacena las criptomonedas agregadas al sistema.
-- -----------------------------------------------
CREATE TABLE crypto_currency (
    id BIGSERIAL PRIMARY KEY,
    cmc_id INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    slug VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------
-- Tabla: price_snapshot
-- Registra cada captura de precio para el historial
-- de líneas de tiempo.
-- -----------------------------------------------
CREATE TABLE price_snapshot (
    id BIGSERIAL PRIMARY KEY,
    crypto_id BIGINT NOT NULL,
    price_usd NUMERIC(18,8) NOT NULL,
    percent_change_1h NUMERIC(10,4),
    percent_change_24h NUMERIC(10,4),
    percent_change_7d NUMERIC(10,4),
    volume_24h NUMERIC(20,2),
    market_cap NUMERIC(20,2),
    recorded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_price_crypto
        FOREIGN KEY (crypto_id)
        REFERENCES crypto_currency(id)
        ON DELETE CASCADE
);

-- Índice para consultas de historial por rango de tiempo
CREATE INDEX idx_crypto_date 
ON price_snapshot (crypto_id, recorded_at);

CREATE INDEX idx_symbol 
ON crypto_currency (symbol);