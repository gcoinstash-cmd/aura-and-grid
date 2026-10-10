-- ============================================================================
-- CHRONOS-TICK ALLOYDB / POSTGRESQL PRODUCTION DDL SCHEMA
-- Asset: GF-T3-141 (FinTech / Quant Execution Core)
-- Engine: Google Cloud AlloyDB for PostgreSQL (v16 Compatible)
-- Optimization: High-Throughput Append-Only Timeseries with Partitioning
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- Enum types for strict type safety
CREATE TYPE mandate_side AS ENUM ('BUY', 'SELL');
CREATE TYPE mandate_algo AS ENUM ('VWAP', 'TWAP', 'ALMGREN_CHRISS', 'POV');
CREATE TYPE mandate_status AS ENUM ('PENDING', 'ACTIVE', 'COMPLETED', 'PAUSED', 'ABORTED');
CREATE TYPE slice_status AS ENUM ('PENDING', 'IN_TRANSIT', 'FILLED', 'REJECTED', 'CANCELLED');
CREATE TYPE venue_id AS ENUM ('COINBASE_PRIME', 'BINANCE_US', 'KRAKEN_INST', 'LMAX_DIGITAL');

-- ----------------------------------------------------------------------------
-- 1. PARENT EXECUTION MANDATES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS execution_mandates (
    mandate_id VARCHAR(64) PRIMARY KEY,
    symbol VARCHAR(32) NOT NULL,
    side mandate_side NOT NULL,
    total_notional_usd NUMERIC(18, 4) NOT NULL CHECK (total_notional_usd > 0),
    total_quantity NUMERIC(18, 8) NOT NULL CHECK (total_quantity > 0),
    duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 1 AND 1440),
    strategy mandate_algo NOT NULL DEFAULT 'ALMGREN_CHRISS',
    risk_aversion_lambda NUMERIC(12, 10) NOT NULL DEFAULT 0.0000010000,
    target_slippage_bps_cap NUMERIC(6, 2) NOT NULL DEFAULT 3.00,
    arrival_price NUMERIC(18, 4) NOT NULL,
    current_vwap NUMERIC(18, 4),
    realized_slippage_bps NUMERIC(8, 4) DEFAULT 0.0000,
    filled_notional_usd NUMERIC(18, 4) DEFAULT 0.0000,
    filled_quantity NUMERIC(18, 8) DEFAULT 0.00000000,
    status mandate_status NOT NULL DEFAULT 'PENDING',
    slices_total INTEGER NOT NULL CHECK (slices_total > 0),
    slices_filled INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mandates_symbol_status ON execution_mandates (symbol, status);
CREATE INDEX idx_mandates_created_at ON execution_mandates (created_at DESC);

-- ----------------------------------------------------------------------------
-- 2. CHILD SLICE ORDERS (Partitioned by Month for Nanosecond Scale)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS slice_orders (
    slice_id UUID DEFAULT uuid_generate_v4(),
    mandate_id VARCHAR(64) NOT NULL REFERENCES execution_mandates(mandate_id) ON DELETE RESTRICT,
    slice_index INTEGER NOT NULL,
    scheduled_timestamp TIMESTAMPTZ NOT NULL,
    executed_timestamp TIMESTAMPTZ,
    venue venue_id NOT NULL,
    target_quantity NUMERIC(18, 8) NOT NULL,
    filled_quantity NUMERIC(18, 8) DEFAULT 0.0,
    limit_price NUMERIC(18, 4),
    executed_price NUMERIC(18, 4),
    arrival_price NUMERIC(18, 4) NOT NULL,
    market_vwap NUMERIC(18, 4),
    slippage_bps NUMERIC(8, 4),
    impact_cost_usd NUMERIC(18, 4),
    poisson_interval_ms INTEGER NOT NULL,
    status slice_status NOT NULL DEFAULT 'PENDING',
    raw_fill_payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (slice_id, scheduled_timestamp)
) PARTITION BY RANGE (scheduled_timestamp);

-- Default sub-partition
CREATE TABLE IF NOT EXISTS slice_orders_2026_q4 PARTITION OF slice_orders
    FOR VALUES FROM ('2026-10-01 00:00:00+00') TO ('2027-01-01 00:00:00+00');

CREATE INDEX idx_slice_mandate_time ON slice_orders (mandate_id, slice_index);
CREATE INDEX idx_slice_venue_status ON slice_orders (venue, status);

-- ----------------------------------------------------------------------------
-- 3. BENCHMARK SLIPPAGE AUDIT LEDGER (Immutable Compliance Trail)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS benchmark_slippage (
    audit_id BIGSERIAL PRIMARY KEY,
    mandate_id VARCHAR(64) NOT NULL REFERENCES execution_mandates(mandate_id),
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    benchmark_name VARCHAR(32) NOT NULL DEFAULT 'ARRIVAL_PRICE_VWAP',
    arrival_price NUMERIC(18, 4) NOT NULL,
    terminal_vwap NUMERIC(18, 4) NOT NULL,
    spread_cost_bps NUMERIC(8, 4) NOT NULL,
    market_impact_bps NUMERIC(8, 4) NOT NULL,
    total_slippage_bps NUMERIC(8, 4) NOT NULL,
    compliance_passed BOOLEAN NOT NULL DEFAULT TRUE,
    hash_signature VARCHAR(64) NOT NULL
);

-- Trigger to update parent mandate updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_mandates_update_timestamp
BEFORE UPDATE ON execution_mandates
FOR EACH ROW EXECUTE FUNCTION trigger_update_timestamp();
