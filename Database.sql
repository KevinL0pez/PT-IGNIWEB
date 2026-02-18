CREATE DATABASE crypto_investment;
USE crypto_investment;

CREATE TABLE investor (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE crypto_currency (
    id BIGSERIAL PRIMARY KEY,
    cmc_id INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(20) NOT NULL,
    slug VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE investor_crypto (
    id BIGSERIAL PRIMARY KEY,
    investor_id BIGINT NOT NULL,
    crypto_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_investor
        FOREIGN KEY (investor_id)
        REFERENCES investor(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_crypto
        FOREIGN KEY (crypto_id)
        REFERENCES crypto_currency(id)
        ON DELETE CASCADE,
    CONSTRAINT unique_investor_crypto
        UNIQUE (investor_id, crypto_id)
);

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

CREATE INDEX idx_crypto_date 
ON price_snapshot (crypto_id, recorded_at);

CREATE INDEX idx_symbol 
ON crypto_currency (symbol);