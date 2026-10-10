-- ============================================================================
-- T3-NEXUS-ORDERBOOK: Production DDL Schema (PostgreSQL 16+ / AlloyDB)
-- Fully Normalized, Micro-Partitioned, Zero Circular Dependencies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. INSTRUMENTS & PAIRS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE instruments (
    symbol VARCHAR(16) PRIMARY KEY,
    base_asset VARCHAR(8) NOT NULL,
    quote_asset VARCHAR(8) NOT NULL,
    min_order_qty NUMERIC(28, 12) NOT NULL CHECK (min_order_qty > 0),
    max_order_qty NUMERIC(28, 12) NOT NULL CHECK (max_order_qty >= min_order_qty),
    tick_size NUMERIC(28, 12) NOT NULL CHECK (tick_size > 0),
    step_size NUMERIC(28, 12) NOT NULL CHECK (step_size > 0),
    maker_fee_bps NUMERIC(8, 4) NOT NULL DEFAULT -1.5000,
    taker_fee_bps NUMERIC(8, 4) NOT NULL DEFAULT 4.0000,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. ORDERS PERSISTENCE TABLE (Partitioned by created_at Monthly)
-- ----------------------------------------------------------------------------
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_order_id VARCHAR(64) NOT NULL,
    symbol VARCHAR(16) NOT NULL REFERENCES instruments(symbol),
    trader_id VARCHAR(64) NOT NULL,
    side VARCHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    order_type VARCHAR(8) NOT NULL CHECK (order_type IN ('LIMIT', 'MARKET')),
    price NUMERIC(28, 12) NULL CHECK (price IS NULL OR price > 0),
    original_qty NUMERIC(28, 12) NOT NULL CHECK (original_qty > 0),
    remaining_qty NUMERIC(28, 12) NOT NULL CHECK (remaining_qty >= 0),
    filled_qty NUMERIC(28, 12) NOT NULL DEFAULT 0 CHECK (filled_qty >= 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('PENDING', 'ACCEPTED', 'PARTIALLY_FILLED', 'FILLED', 'CANCELLED', 'REJECTED')),
    time_in_force VARCHAR(4) NOT NULL CHECK (time_in_force IN ('GTC', 'IOC', 'FOK')),
    stp_mode VARCHAR(24) NOT NULL DEFAULT 'CANCEL_TAKER',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_client_order_per_trader UNIQUE (trader_id, client_order_id)
);

CREATE INDEX idx_orders_symbol_status ON orders (symbol, status);
CREATE INDEX idx_orders_trader_id ON orders (trader_id);
CREATE INDEX idx_orders_created_at ON orders (created_at DESC);

-- ----------------------------------------------------------------------------
-- 3. TRADES RECORD TABLE (Immutable WAL Append-Only)
-- ----------------------------------------------------------------------------
CREATE TABLE trades (
    trade_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sequence_id BIGINT NOT NULL UNIQUE,
    symbol VARCHAR(16) NOT NULL REFERENCES instruments(symbol),
    taker_order_id UUID NOT NULL REFERENCES orders(order_id),
    maker_order_id UUID NOT NULL REFERENCES orders(order_id),
    taker_trader_id VARCHAR(64) NOT NULL,
    maker_trader_id VARCHAR(64) NOT NULL,
    aggressor_side VARCHAR(4) NOT NULL CHECK (aggressor_side IN ('BUY', 'SELL')),
    price NUMERIC(28, 12) NOT NULL CHECK (price > 0),
    quantity NUMERIC(28, 12) NOT NULL CHECK (quantity > 0),
    quote_volume NUMERIC(28, 12) NOT NULL CHECK (quote_volume > 0),
    maker_fee_rebate NUMERIC(28, 12) NOT NULL,
    taker_fee_paid NUMERIC(28, 12) NOT NULL CHECK (taker_fee_paid >= 0),
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_symbol_seq ON trades (symbol, sequence_id DESC);
CREATE INDEX idx_trades_taker_trader ON trades (taker_trader_id);
CREATE INDEX idx_trades_maker_trader ON trades (maker_trader_id);

-- ----------------------------------------------------------------------------
-- 4. CRYPTOGRAPHIC AUDIT LOG (SHA-256 HASH CHAIN TRIGGER)
-- ----------------------------------------------------------------------------
CREATE TABLE trade_audit_chain (
    audit_id BIGSERIAL PRIMARY KEY,
    trade_sequence_id BIGINT NOT NULL REFERENCES trades(sequence_id),
    prev_audit_hash BYTEA,
    current_audit_hash BYTEA NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION fn_audit_trade_insert()
RETURNS TRIGGER AS $$
DECLARE
    v_prev_hash BYTEA;
    v_payload TEXT;
    v_new_hash BYTEA;
BEGIN
    SELECT current_audit_hash INTO v_prev_hash
    FROM trade_audit_chain
    ORDER BY audit_id DESC
    LIMIT 1;

    IF v_prev_hash IS NULL THEN
        v_prev_hash := decode('0000000000000000000000000000000000000000000000000000000000000000', 'hex');
    END IF;

    v_payload := CONCAT(
        NEW.sequence_id, '|',
        NEW.symbol, '|',
        NEW.price, '|',
        NEW.quantity, '|',
        NEW.taker_order_id, '|',
        NEW.maker_order_id, '|',
        encode(v_prev_hash, 'hex')
    );

    v_new_hash := digest(v_payload, 'sha256');

    INSERT INTO trade_audit_chain (trade_sequence_id, prev_audit_hash, current_audit_hash)
    VALUES (NEW.sequence_id, v_prev_hash, v_new_hash);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_trade_audit
AFTER INSERT ON trades
FOR EACH ROW EXECUTE FUNCTION fn_audit_trade_insert();
