-- ============================================================================
-- CHRONOS MORPH-GT TELEMETRY PLATFORM
-- High-Performance Aero-Composite Telemetry, Shape-Shifting Memory Alloy & Piezoelectric Actuator Bus DDL
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. VEHICLES TABLE
CREATE TABLE IF NOT EXISTS morph_hypercar_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vin VARCHAR(32) UNIQUE NOT NULL,
    chassis_code VARCHAR(32) NOT NULL,
    model_name VARCHAR(64) NOT NULL DEFAULT 'CHRONOS MORPH-GT',
    spec_edition VARCHAR(128) NOT NULL DEFAULT 'AERO-COMPOSITE STEALTH INTERCEPTOR',
    dry_weight_kg NUMERIC(6,1) NOT NULL DEFAULT 1280.0,
    peak_power_kw INTEGER NOT NULL DEFAULT 1976,
    peak_horsepower INTEGER NOT NULL DEFAULT 2650,
    v_max_kmh NUMERIC(5,1) NOT NULL DEFAULT 442.0,
    alloy_bus_voltage NUMERIC(4,1) NOT NULL DEFAULT 48.0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 2. AERO SURFACE SNAPSHOTS TABLE
CREATE TABLE IF NOT EXISTS aero_surface_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES morph_hypercar_vehicles(id) ON DELETE CASCADE,
    aero_profile VARCHAR(64) NOT NULL,
    speed_kmh NUMERIC(6,2) NOT NULL,
    drag_coefficient_cd NUMERIC(5,3) NOT NULL,
    downforce_kg NUMERIC(6,1) NOT NULL,
    splitter_flex_pct NUMERIC(5,2) NOT NULL,
    bargeboard_flare_pct NUMERIC(5,2) NOT NULL,
    diffuser_tunnel_angle_deg NUMERIC(4,2) NOT NULL,
    rear_wing_camber_deg NUMERIC(4,2) NOT NULL,
    streamline_purge_active BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 3. ACTUATOR THERMAL & HYDRAULIC LOGS TABLE
CREATE TABLE IF NOT EXISTS actuator_thermal_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES morph_hypercar_vehicles(id) ON DELETE CASCADE,
    channel_index INTEGER NOT NULL CHECK (channel_index BETWEEN 1 AND 16),
    channel_name VARCHAR(128) NOT NULL,
    current_amps NUMERIC(5,2) NOT NULL,
    temp_celsius NUMERIC(5,2) NOT NULL,
    hydraulic_bus_bar NUMERIC(5,1) NOT NULL,
    valve_response_ms NUMERIC(4,2) NOT NULL,
    coolant_flow_lpm NUMERIC(5,2) NOT NULL,
    superconducting_temp_k NUMERIC(5,2) NOT NULL,
    inverter_load_pct NUMERIC(5,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 4. MORPH SECTOR RECORDS TABLE (SECTORS 1 TO 14)
CREATE TABLE IF NOT EXISTS morph_sector_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES morph_hypercar_vehicles(id) ON DELETE CASCADE,
    sector_number INTEGER NOT NULL CHECK (sector_number BETWEEN 1 AND 14),
    sector_name VARCHAR(128) NOT NULL,
    entry_speed_kmh NUMERIC(6,2) NOT NULL,
    apex_speed_kmh NUMERIC(6,2) NOT NULL,
    exit_speed_kmh NUMERIC(6,2) NOT NULL,
    active_cd NUMERIC(5,3) NOT NULL,
    downforce_kg NUMERIC(6,1) NOT NULL,
    actuator_cycles INTEGER NOT NULL,
    sector_time_seconds NUMERIC(6,3) NOT NULL,
    morph_state VARCHAR(64) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- 5. ALLOY DIAGNOSTIC & VEHICLE ACTION EVENTS TABLE
CREATE TABLE IF NOT EXISTS alloy_diagnostic_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES morph_hypercar_vehicles(id) ON DELETE CASCADE,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('INFO', 'OPTIMAL', 'WARNING', 'ACTION')),
    event_code VARCHAR(32) NOT NULL,
    title VARCHAR(128) NOT NULL,
    details TEXT NOT NULL,
    voltage_pulse_v NUMERIC(4,1) NOT NULL DEFAULT 48.0,
    operator_id VARCHAR(64) NOT NULL DEFAULT 'PILOT_SYS_AUTO',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================================================
-- INDEXES FOR LOW-LATENCY TELEMETRY TIME-SERIES QUERIES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_aero_snapshots_vehicle_time 
    ON aero_surface_snapshots(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_actuator_logs_vehicle_time 
    ON actuator_thermal_logs(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_sector_records_vehicle_time 
    ON morph_sector_records(vehicle_id, sector_number, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_alloy_events_vehicle_time 
    ON alloy_diagnostic_events(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_vehicles_chassis 
    ON morph_hypercar_vehicles(chassis_code);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE morph_hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aero_surface_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE actuator_thermal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE morph_sector_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alloy_diagnostic_events ENABLE ROW LEVEL SECURITY;

-- Permissive public read for live telemetry telemetry viewers & authenticated telemetry engineers
CREATE POLICY "Public read morph_hypercar_vehicles" 
    ON morph_hypercar_vehicles FOR SELECT 
    USING (true);

CREATE POLICY "Public read aero_surface_snapshots" 
    ON aero_surface_snapshots FOR SELECT 
    USING (true);

CREATE POLICY "Public read actuator_thermal_logs" 
    ON actuator_thermal_logs FOR SELECT 
    USING (true);

CREATE POLICY "Public read morph_sector_records" 
    ON morph_sector_records FOR SELECT 
    USING (true);

CREATE POLICY "Public read alloy_diagnostic_events" 
    ON alloy_diagnostic_events FOR SELECT 
    USING (true);

-- Service-role full access for telemetry ingest pipelines & onboard edge computers
CREATE POLICY "Service-role write morph_hypercar_vehicles" 
    ON morph_hypercar_vehicles FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service-role write aero_surface_snapshots" 
    ON aero_surface_snapshots FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service-role write actuator_thermal_logs" 
    ON actuator_thermal_logs FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service-role write morph_sector_records" 
    ON morph_sector_records FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

CREATE POLICY "Service-role write alloy_diagnostic_events" 
    ON alloy_diagnostic_events FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);
