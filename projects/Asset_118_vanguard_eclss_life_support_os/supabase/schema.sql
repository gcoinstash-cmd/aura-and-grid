-- ============================================================================
-- VANGUARD ORBITAL // NODE-02 CLOSED-LOOP ECLSS RACK
-- INSTITUTIONAL POSTGRESQL AVIONICS SCHEMA
-- ============================================================================

-- Extensions for aerospace telemetry & cryptographic identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order if recreating
DROP TABLE IF EXISTS eclss_maintenance_events CASCADE;
DROP TABLE IF EXISTS eclss_filter_canisters CASCADE;
DROP TABLE IF EXISTS eclss_telemetry_logs CASCADE;
DROP TABLE IF EXISTS eclss_consumable_tanks CASCADE;
DROP TABLE IF EXISTS eclss_subsystems CASCADE;
DROP TABLE IF EXISTS eclss_habitat_nodes CASCADE;

-- ----------------------------------------------------------------------------
-- 1. ECLSS HABITAT NODES & COMPARTMENTS
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_habitat_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    zone_type VARCHAR(64) NOT NULL, -- 'COMMAND', 'LIFE_SUPPORT', 'LABORATORY', 'AIRLOCK', 'CREW_BERTH', 'PROPULSION'
    volume_m3 NUMERIC(8, 2) NOT NULL,
    crew_capacity INTEGER NOT NULL DEFAULT 2,
    is_pressurized BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 2. ECLSS CLOSED-LOOP SUBSYSTEMS (OGA, CRA, UPA, TCCS, CDRA, WPA)
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_subsystems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsystem_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL, -- 'OXYGEN', 'CARBON_DIOXIDE', 'WATER', 'TRACE_CONTAMINANT'
    operational_status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL', -- 'NOMINAL', 'ACTIVE', 'CAUTION', 'STANDBY', 'PURGING'
    power_draw_watts NUMERIC(8, 2) NOT NULL,
    efficiency_pct NUMERIC(5, 2) NOT NULL,
    mass_flow_rate_kgh NUMERIC(8, 3),
    operating_temp_celsius NUMERIC(6, 2),
    last_serviced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_service_due TIMESTAMPTZ NOT NULL DEFAULT (now() + INTERVAL '90 days')
);

-- ----------------------------------------------------------------------------
-- 3. ATMOSPHERIC & ENVIRONMENTAL TELEMETRY LOGS
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID NOT NULL REFERENCES eclss_habitat_nodes(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    total_pressure_kpa NUMERIC(6, 2) NOT NULL,
    o2_partial_kpa NUMERIC(6, 2) NOT NULL,
    co2_partial_kpa NUMERIC(6, 3) NOT NULL,
    humidity_percent NUMERIC(5, 2) NOT NULL,
    temp_celsius NUMERIC(5, 2) NOT NULL,
    hepa_delta_p_pa NUMERIC(6, 2) NOT NULL,
    cabin_fan_rpm INTEGER NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL'
);

-- ----------------------------------------------------------------------------
-- 4. CONSUMABLE STORAGE TANKS & CRYO RESERVES
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_consumable_tanks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tank_code VARCHAR(32) NOT NULL UNIQUE,
    name VARCHAR(128) NOT NULL,
    consumable_type VARCHAR(64) NOT NULL, -- 'POTABLE_H2O', 'CRYO_LOX', 'LIQUID_N2', 'GREYWATER'
    current_level NUMERIC(10, 2) NOT NULL,
    max_capacity NUMERIC(10, 2) NOT NULL,
    unit VARCHAR(16) NOT NULL, -- 'kg', 'L'
    pressure_mpa NUMERIC(6, 2) NOT NULL,
    temp_kelvin NUMERIC(6, 2) NOT NULL,
    consumption_rate_per_hour NUMERIC(8, 3) NOT NULL DEFAULT 0.000,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 5. FILTER CANISTERS, SCRUBBERS & CONSUMABLE BEDS
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_filter_canisters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    serial_number VARCHAR(64) NOT NULL UNIQUE,
    node_id UUID NOT NULL REFERENCES eclss_habitat_nodes(id) ON DELETE CASCADE,
    canister_type VARCHAR(64) NOT NULL, -- 'LIOH_CANISTER', 'HEPA_PARTICULATE', 'ACTIVATED_CHARCOAL', 'CATALYTIC_OXIDIZER'
    saturation_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    max_operating_limit_pct NUMERIC(5, 2) NOT NULL DEFAULT 85.00,
    installed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    estimated_depletion_at TIMESTAMPTZ NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' -- 'ACTIVE', 'DEPLETED', 'STANDBY', 'QUARANTINED'
);

-- ----------------------------------------------------------------------------
-- 6. ECLSS OPERATIONAL MAINTENANCE & INTERLOCK AUDIT LEDGER
-- ----------------------------------------------------------------------------
CREATE TABLE eclss_maintenance_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    node_id UUID REFERENCES eclss_habitat_nodes(id) ON DELETE SET NULL,
    subsystem_id UUID REFERENCES eclss_subsystems(id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL, -- 'CYCLE_SABATIER_BED', 'FLUSH_CONDENSATE_SEPARATOR', 'SWAP_LIOH_CANISTER', 'SERVICE_HEPA', 'RAPID_N2_FLUSH_OVERRIDE'
    operator_callsign VARCHAR(64) NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(32) NOT NULL DEFAULT 'EXECUTED',
    telemetry_snapshot JSONB,
    notes TEXT
);

-- ----------------------------------------------------------------------------
-- INDEXES FOR HIGH-THROUGHPUT AVIONICS TELEMETRY RETRIEVAL
-- ----------------------------------------------------------------------------
CREATE INDEX idx_eclss_telemetry_node_recorded ON eclss_telemetry_logs (node_id, recorded_at DESC);
CREATE INDEX idx_eclss_telemetry_status ON eclss_telemetry_logs (status);
CREATE INDEX idx_eclss_subsystems_code ON eclss_subsystems (subsystem_code);
CREATE INDEX idx_eclss_filter_canisters_node ON eclss_filter_canisters (node_id, canister_type);
CREATE INDEX idx_eclss_maintenance_node_subsys ON eclss_maintenance_events (node_id, subsystem_id, executed_at DESC);
CREATE INDEX idx_eclss_consumables_type ON eclss_consumable_tanks (consumable_type);

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) ACTIVATION
-- ----------------------------------------------------------------------------
ALTER TABLE eclss_habitat_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE eclss_subsystems ENABLE ROW LEVEL SECURITY;
ALTER TABLE eclss_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE eclss_consumable_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE eclss_filter_canisters ENABLE ROW LEVEL SECURITY;
ALTER TABLE eclss_maintenance_events ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- ROW LEVEL SECURITY POLICIES (MISSION CONTROL AVIONICS ACCESS)
-- ----------------------------------------------------------------------------
-- Public read-only access for authenticated mission control stations
CREATE POLICY "Allow read access to all authenticated personnel"
    ON eclss_habitat_nodes FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access to subsystems"
    ON eclss_subsystems FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access to telemetry stream"
    ON eclss_telemetry_logs FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow insert of telemetry frames by avionics daemon"
    ON eclss_telemetry_logs FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow read access to consumable tanks"
    ON eclss_consumable_tanks FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow read access to filter canisters"
    ON eclss_filter_canisters FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow update to filter canisters during maintenance"
    ON eclss_filter_canisters FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access to maintenance ledger"
    ON eclss_maintenance_events FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow recording of maintenance actions"
    ON eclss_maintenance_events FOR INSERT
    TO authenticated
    WITH CHECK (true);
