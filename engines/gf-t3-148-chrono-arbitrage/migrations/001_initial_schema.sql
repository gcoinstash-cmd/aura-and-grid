-- ============================================================================
-- CHRONO-ARBITRAGE T3-QUANT-02 RELATIONAL ENGINE DDL
-- Platform: AlloyDB for PostgreSQL / PostgreSQL 16
-- Compliance: Pure ANSI SQL, Strict Check Constraints, Zero Circular Dependencies
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- ENUMS
CREATE TYPE venue_status_enum AS ENUM ('ACTIVE', 'DEGRADED', 'HALTED', 'OFFLINE');
CREATE TYPE execution_status_enum AS ENUM ('PENDING', 'ROUTED', 'FILLED', 'PARTIAL_FILL', 'REJECTED', 'FAILED');
CREATE TYPE order_action_enum AS ENUM ('BUY', 'SELL');

-- 1. VENUES TABLE
CREATE TABLE venues (
    venue_id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    ws_endpoint VARCHAR(255) NOT NULL,
    maker_fee_bps NUMERIC(6, 3) NOT NULL CHECK (maker_fee_bps >= 0.000),
    taker_fee_bps NUMERIC(6, 3) NOT NULL CHECK (taker_fee_bps >= 0.000),
    status venue_status_enum NOT NULL DEFAULT 'ACTIVE',
    average_ping_ms NUMERIC(8, 3) NOT NULL DEFAULT 1.000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. TRADING PAIRS TABLE
CREATE TABLE trading_pairs (
    pair_id VARCHAR(64) PRIMARY KEY,
    venue_id VARCHAR(32) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    base_currency VARCHAR(16) NOT NULL,
    quote_currency VARCHAR(16) NOT NULL,
    min_order_size NUMERIC(24, 8) NOT NULL CHECK (min_order_size > 0),
    max_order_size NUMERIC(24, 8) NOT NULL CHECK (max_order_size >= min_order_size),
    price_tick_size NUMERIC(16, 8) NOT NULL CHECK (price_tick_size > 0),
    lot_step_size NUMERIC(16, 8) NOT NULL CHECK (lot_step_size > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_venue_pair UNIQUE (venue_id, base_currency, quote_currency)
);

-- 3. RAW INGESTION TICKS (HIGH-FREQUENCY PARTITION / BRIN INDEX)
CREATE TABLE raw_market_ticks (
    tick_id BIGSERIAL,
    venue_id VARCHAR(32) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    pair_id VARCHAR(64) NOT NULL REFERENCES trading_pairs(pair_id) ON DELETE RESTRICT,
    bid_price NUMERIC(24, 8) NOT NULL CHECK (bid_price > 0),
    bid_quantity NUMERIC(24, 8) NOT NULL CHECK (bid_quantity >= 0),
    ask_price NUMERIC(24, 8) NOT NULL CHECK (ask_price >= bid_price),
    ask_quantity NUMERIC(24, 8) NOT NULL CHECK (ask_quantity >= 0),
    server_epoch_ns BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (tick_id, created_at)
) PARTITION BY RANGE (created_at);

-- Initial Partition for Current Day
CREATE TABLE raw_market_ticks_default PARTITION OF raw_market_ticks DEFAULT;
CREATE INDEX idx_raw_ticks_brin ON raw_market_ticks USING BRIN (created_at);
CREATE INDEX idx_raw_ticks_venue_pair ON raw_market_ticks (venue_id, pair_id, created_at DESC);

-- 4. ARBITRAGE DETECTED CYCLES
CREATE TABLE arbitrage_detected_cycles (
    cycle_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_path VARCHAR(255) NOT NULL,
    hop_count INT NOT NULL CHECK (hop_count >= 3 AND hop_count <= 8),
    gross_multiplier NUMERIC(12, 8) NOT NULL,
    net_profit_bps NUMERIC(10, 4) NOT NULL,
    cycle_weight_sum NUMERIC(16, 8) NOT NULL,
    detection_latency_us INT NOT NULL CHECK (detection_latency_us >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_arb_cycles_time ON arbitrage_detected_cycles (created_at DESC);
CREATE INDEX idx_arb_cycles_profit ON arbitrage_detected_cycles (net_profit_bps DESC);

-- 5. EXECUTION ORDERS (ATOMIC ROUTE DISPATCH)
CREATE TABLE execution_dispatches (
    dispatch_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_id UUID NOT NULL REFERENCES arbitrage_detected_cycles(cycle_id) ON DELETE RESTRICT,
    allocated_capital_usd NUMERIC(18, 4) NOT NULL CHECK (allocated_capital_usd > 0),
    expected_profit_usd NUMERIC(18, 4) NOT NULL,
    realized_profit_usd NUMERIC(18, 4) DEFAULT 0.0000,
    status execution_status_enum NOT NULL DEFAULT 'PENDING',
    execution_start_ns BIGINT NOT NULL,
    execution_end_ns BIGINT,
    failure_reason VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_exec_dispatches_status ON execution_dispatches (status, created_at DESC);

-- 6. ORDER LEGS (CONCURRENT LEG DISPATCH AUDIT)
CREATE TABLE execution_order_legs (
    leg_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dispatch_id UUID NOT NULL REFERENCES execution_dispatches(dispatch_id) ON DELETE CASCADE,
    leg_index INT NOT NULL CHECK (leg_index >= 0),
    venue_id VARCHAR(32) NOT NULL REFERENCES venues(venue_id) ON DELETE RESTRICT,
    pair_id VARCHAR(64) NOT NULL REFERENCES trading_pairs(pair_id) ON DELETE RESTRICT,
    action order_action_enum NOT NULL,
    requested_price NUMERIC(24, 8) NOT NULL,
    executed_price NUMERIC(24, 8),
    requested_qty NUMERIC(24, 8) NOT NULL,
    executed_qty NUMERIC(24, 8) DEFAULT 0.00000000,
    fee_incurred_usd NUMERIC(16, 6) DEFAULT 0.000000,
    leg_status execution_status_enum NOT NULL DEFAULT 'PENDING',
    client_order_id VARCHAR(64) NOT NULL UNIQUE,
    venue_order_id VARCHAR(128),
    dispatch_latency_us INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_dispatch_leg UNIQUE (dispatch_id, leg_index)
);
CREATE INDEX idx_legs_dispatch ON execution_order_legs (dispatch_id);

-- 7. AUDIT TRIGGER FOR STATUS MUTATIONS
CREATE OR REPLACE FUNCTION audit_execution_dispatch_mutation()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_exec_dispatch_updated_at
BEFORE UPDATE ON execution_dispatches
FOR EACH ROW
EXECUTE FUNCTION audit_execution_dispatch_mutation();