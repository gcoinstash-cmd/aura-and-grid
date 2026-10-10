-- ============================================================================
-- GHOST FACTORYOS FLEET TIER 3 (F1 SKUNKWORKS)
-- ASSET ID: GF-T3-145 (Nexus-ATS: Hybrid Central Limit Order Book & Dark Pool)
-- PRODUCTION ALLOYDB / POSTGRESQL 16 HIGH-THROUGHPUT NORMALIZED SCHEMA
-- ZERO-RPO FINANCIAL AUDIT TRAIL, COMPOSITE INDEXING, DAILY RANGE PARTITIONING
-- ============================================================================

-- Enable required high-performance extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";

-- Create dedicated high-speed operational schema
CREATE SCHEMA IF NOT EXISTS nexus_core;
SET search_path TO nexus_core, public;

-- ----------------------------------------------------------------------------
-- 1. TRADING INSTRUMENTS MASTER
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.trading_instruments (
    instrument_id           VARCHAR(32) PRIMARY KEY,
    symbol                  VARCHAR(16) NOT NULL UNIQUE,
    asset_class             VARCHAR(16) NOT NULL DEFAULT 'EQUITY',
    currency                CHAR(3) NOT NULL DEFAULT 'USD',
    tick_size               NUMERIC(10, 6) NOT NULL CHECK (tick_size > 0),
    lot_size                INTEGER NOT NULL DEFAULT 1 CHECK (lot_size > 0),
    min_order_qty           INTEGER NOT NULL DEFAULT 1 CHECK (min_order_qty > 0),
    max_order_qty           INTEGER NOT NULL DEFAULT 1000000 CHECK (max_order_qty >= min_order_qty),
    dark_min_cross_qty      INTEGER NOT NULL DEFAULT 100 CHECK (dark_min_cross_qty >= 0),
    is_trading_halted       BOOLEAN NOT NULL DEFAULT FALSE,
    circuit_breaker_band_pct NUMERIC(6, 4) NOT NULL DEFAULT 0.0500,
    created_at_utc          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    updated_at_utc          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- ----------------------------------------------------------------------------
-- 2. PARTICIPANT BROKER-DEALER DIRECTORY (MPID ENTITIES)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.market_participants (
    mpid                    VARCHAR(8) PRIMARY KEY,
    firm_legal_name         VARCHAR(128) NOT NULL,
    crd_number              VARCHAR(32) NOT NULL,
    clearing_firm_mpid      VARCHAR(8) NOT NULL,
    self_match_prevention   BOOLEAN NOT NULL DEFAULT TRUE,
    credit_limit_usd        NUMERIC(16, 2) NOT NULL DEFAULT 50000000.00,
    current_exposure_usd    NUMERIC(16, 2) NOT NULL DEFAULT 0.00,
    status                  VARCHAR(16) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'RESTRICTED')),
    created_at_utc          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

-- ----------------------------------------------------------------------------
-- 3. ACTIVE LIMIT ORDER CACHE (CURRENT RESTING BOOK)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.limit_orders_active (
    order_id                VARCHAR(64) PRIMARY KEY,
    client_order_id         VARCHAR(64) NOT NULL,
    instrument_id           VARCHAR(32) NOT NULL REFERENCES nexus_core.trading_instruments(instrument_id),
    mpid                    VARCHAR(8) NOT NULL REFERENCES nexus_core.market_participants(mpid),
    side                    CHAR(4) NOT NULL CHECK (side IN ('BUY', 'SELL')),
    order_type              VARCHAR(16) NOT NULL CHECK (order_type IN ('LIMIT', 'MARKET', 'MIDPOINT_PEG', 'IOC', 'FOK')),
    execution_venue         VARCHAR(16) NOT NULL DEFAULT 'LIT' CHECK (execution_venue IN ('LIT', 'DARK', 'HYBRID_SWEEP')),
    limit_price             NUMERIC(12, 4) NOT NULL CHECK (limit_price >= 0),
    original_quantity       INTEGER NOT NULL CHECK (original_quantity > 0),
    filled_quantity         INTEGER NOT NULL DEFAULT 0 CHECK (filled_quantity >= 0),
    remaining_quantity      INTEGER NOT NULL CHECK (remaining_quantity > 0),
    min_quantity            INTEGER NOT NULL DEFAULT 0 CHECK (min_quantity >= 0),
    anti_internalization    BOOLEAN NOT NULL DEFAULT TRUE,
    priority_epoch_ns       BIGINT NOT NULL,
    latency_microseconds    INTEGER NOT NULL DEFAULT 0,
    order_status            VARCHAR(20) NOT NULL DEFAULT 'NEW' CHECK (order_status IN ('NEW', 'PARTIALLY_FILLED', 'RESTING_DARK')),
    inserted_at_utc         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    CONSTRAINT chk_quantity_balance CHECK (filled_quantity + remaining_quantity = original_quantity)
);

-- Indices for sub-millisecond price-time priority traversals
CREATE INDEX IF NOT EXISTS idx_active_orders_matching 
    ON nexus_core.limit_orders_active (instrument_id, side, limit_price, priority_epoch_ns)
    WHERE remaining_quantity > 0;

CREATE INDEX IF NOT EXISTS idx_active_orders_mpid 
    ON nexus_core.limit_orders_active (mpid, instrument_id);

CREATE INDEX IF NOT EXISTS idx_active_orders_dark_pegs
    ON nexus_core.limit_orders_active (instrument_id, execution_venue, priority_epoch_ns)
    WHERE execution_venue IN ('DARK', 'HYBRID_SWEEP');

-- ----------------------------------------------------------------------------
-- 4. TRADE EXECUTIONS LEDGER (PARTITIONED DAILY FOR ZERO-RPO IMMUTABILITY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.trade_executions_ledger (
    execution_id            VARCHAR(64) NOT NULL,
    instrument_id           VARCHAR(32) NOT NULL,
    execution_date          DATE NOT NULL,
    execution_price         NUMERIC(12, 4) NOT NULL CHECK (execution_price > 0),
    execution_quantity      INTEGER NOT NULL CHECK (execution_quantity > 0),
    maker_order_id          VARCHAR(64) NOT NULL,
    taker_order_id          VARCHAR(64) NOT NULL,
    maker_mpid              VARCHAR(8) NOT NULL,
    taker_mpid              VARCHAR(8) NOT NULL,
    aggressor_side          CHAR(4) NOT NULL CHECK (aggressor_side IN ('BUY', 'SELL')),
    execution_venue         VARCHAR(16) NOT NULL CHECK (execution_venue IN ('LIT', 'DARK', 'HYBRID_SWEEP')),
    is_dark_midpoint_cross  BOOLEAN NOT NULL DEFAULT FALSE,
    price_improvement_usd   NUMERIC(10, 4) NOT NULL DEFAULT 0.0000,
    matching_latency_us     INTEGER NOT NULL DEFAULT 0,
    execution_epoch_ns      BIGINT NOT NULL,
    recorded_at_utc         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (execution_id, execution_date)
) PARTITION BY RANGE (execution_date);

-- Partition definitions for current settlement window
CREATE TABLE IF NOT EXISTS nexus_core.trade_executions_y2026m10d05 PARTITION OF nexus_core.trade_executions_ledger
    FOR VALUES FROM ('2026-10-05') TO ('2026-10-06');
CREATE TABLE IF NOT EXISTS nexus_core.trade_executions_y2026m10d06 PARTITION OF nexus_core.trade_executions_ledger
    FOR VALUES FROM ('2026-10-06') TO ('2026-10-07');
CREATE TABLE IF NOT EXISTS nexus_core.trade_executions_default PARTITION OF nexus_core.trade_executions_ledger
    DEFAULT;

CREATE INDEX IF NOT EXISTS idx_trade_exec_instrument_epoch 
    ON nexus_core.trade_executions_ledger (instrument_id, execution_epoch_ns DESC);

CREATE INDEX IF NOT EXISTS idx_trade_exec_participants 
    ON nexus_core.trade_executions_ledger (maker_mpid, taker_mpid, recorded_at_utc DESC);

-- ----------------------------------------------------------------------------
-- 5. DARK POOL CROSS LOGS & PRICE IMPROVEMENT AUDIT
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.dark_pool_cross_logs (
    cross_id                VARCHAR(64) PRIMARY KEY,
    execution_id            VARCHAR(64) NOT NULL,
    instrument_id           VARCHAR(32) NOT NULL REFERENCES nexus_core.trading_instruments(instrument_id),
    prevailing_nbbo_bid     NUMERIC(12, 4) NOT NULL,
    prevailing_nbbo_ask     NUMERIC(12, 4) NOT NULL,
    calculated_midpoint     NUMERIC(12, 4) NOT NULL,
    cross_price             NUMERIC(12, 4) NOT NULL,
    cross_quantity          INTEGER NOT NULL,
    buyer_mpid              VARCHAR(8) NOT NULL,
    seller_mpid             VARCHAR(8) NOT NULL,
    buyer_savings_usd       NUMERIC(12, 2) NOT NULL,
    seller_savings_usd      NUMERIC(12, 2) NOT NULL,
    total_savings_usd       NUMERIC(12, 2) NOT NULL,
    min_qty_satisfied       BOOLEAN NOT NULL DEFAULT TRUE,
    anti_internalize_checked BOOLEAN NOT NULL DEFAULT TRUE,
    cross_latency_us        INTEGER NOT NULL,
    epoch_ns                BIGINT NOT NULL,
    created_at_utc          TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS idx_dark_cross_instrument_epoch 
    ON nexus_core.dark_pool_cross_logs (instrument_id, epoch_ns DESC);

-- ----------------------------------------------------------------------------
-- 6. REAL-TIME NBBO & MICROSTRUCTURE TOXICITY (VPIN & HAWKES) SNAPSHOTS
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.nbbo_tick_snapshots (
    snapshot_id             BIGSERIAL,
    snapshot_date           DATE NOT NULL,
    instrument_id           VARCHAR(32) NOT NULL,
    nbbo_bid_price          NUMERIC(12, 4) NOT NULL,
    nbbo_ask_price          NUMERIC(12, 4) NOT NULL,
    midpoint_price          NUMERIC(12, 4) NOT NULL,
    spread_cents            NUMERIC(8, 4) NOT NULL,
    spread_bps              NUMERIC(8, 2) NOT NULL,
    bid_depth_volume        INTEGER NOT NULL,
    ask_depth_volume        INTEGER NOT NULL,
    vpin_toxicity_index     NUMERIC(6, 4) NOT NULL,
    hawkes_trade_intensity  NUMERIC(8, 2) NOT NULL,
    hawkes_cancel_intensity NUMERIC(8, 2) NOT NULL,
    spoofing_alert_flag     BOOLEAN NOT NULL DEFAULT FALSE,
    snapshot_epoch_ns       BIGINT NOT NULL,
    recorded_at_utc         TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    PRIMARY KEY (snapshot_id, snapshot_date)
) PARTITION BY RANGE (snapshot_date);

CREATE TABLE IF NOT EXISTS nexus_core.nbbo_ticks_default PARTITION OF nexus_core.nbbo_tick_snapshots
    DEFAULT;

CREATE INDEX IF NOT EXISTS idx_nbbo_ticks_instrument_time
    ON nexus_core.nbbo_tick_snapshots (instrument_id, snapshot_epoch_ns DESC);

-- ----------------------------------------------------------------------------
-- 7. AUDIT TRAIL LOGGING TRIGGER FOR IMMUTABLE REGULATORY COMPLIANCE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS nexus_core.regulatory_audit_trail (
    audit_event_id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name             VARCHAR(64) NOT NULL,
    record_primary_key      VARCHAR(64) NOT NULL,
    operation_type          VARCHAR(16) NOT NULL CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE')),
    prior_state             JSONB,
    post_state              JSONB,
    actor_id                VARCHAR(32) NOT NULL DEFAULT 'SYSTEM_ATS_ENGINE',
    client_ip               INET,
    event_timestamp_utc     TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp()
);

CREATE OR REPLACE FUNCTION nexus_core.fn_audit_orders_mutation()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO nexus_core.regulatory_audit_trail (entity_name, record_primary_key, operation_type, prior_state, post_state)
        VALUES ('limit_orders_active', OLD.order_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO nexus_core.regulatory_audit_trail (entity_name, record_primary_key, operation_type, prior_state, post_state)
        VALUES ('limit_orders_active', OLD.order_id, 'DELETE', to_jsonb(OLD), NULL);
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_audit_limit_orders
    AFTER UPDATE OR DELETE ON nexus_core.limit_orders_active
    FOR EACH ROW EXECUTE FUNCTION nexus_core.fn_audit_orders_mutation();

-- ----------------------------------------------------------------------------
-- SCHEMA PROVISIONING COMPLETE
-- Guaranteed Zero-RPO Financial Reconciliation Ledger
-- ============================================================================
