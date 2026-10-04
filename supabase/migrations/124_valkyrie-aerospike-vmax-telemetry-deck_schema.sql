-- ==============================================================================
-- VALKYRIE AEROSPIKE-VMAX // FLIGHT TELEMETRY DATABASE SCHEMA (POSTGRESQL DDL)
-- 5 Relational Tables with Foreign Keys, Timestamps, Indexes, and Strict RLS
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. AEROSPIKE HYPERCAR VEHICLES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS aerospike_hypercar_vehicles (
    vehicle_id VARCHAR(64) PRIMARY KEY,
    chassis_code VARCHAR(32) NOT NULL UNIQUE,
    callsign VARCHAR(64) NOT NULL,
    propulsion_architecture VARCHAR(128) NOT NULL,
    dry_mass_kg NUMERIC(8, 2) NOT NULL DEFAULT 1680.00,
    wet_mass_kg NUMERIC(8, 2) NOT NULL DEFAULT 2248.50,
    aerodynamic_drag_cd NUMERIC(5, 4) NOT NULL DEFAULT 0.2845,
    max_thrust_rating_kn NUMERIC(6, 2) NOT NULL DEFAULT 25.00,
    max_electric_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 1200.00,
    lox_tank_capacity_l NUMERIC(6, 2) NOT NULL DEFAULT 420.00,
    ch4_tank_capacity_l NUMERIC(6, 2) NOT NULL DEFAULT 310.00,
    commissioned_date DATE NOT NULL DEFAULT CURRENT_DATE,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'MAINTENANCE', 'TESTBED', 'DECOMMISSIONED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. PROPULSION TELEMETRY SNAPSHOTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS propulsion_telemetry_snapshots (
    snapshot_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id VARCHAR(64) NOT NULL REFERENCES aerospike_hypercar_vehicles(vehicle_id) ON DELETE CASCADE,
    ground_speed_kmh NUMERIC(7, 2) NOT NULL,
    mach_number NUMERIC(4, 3) NOT NULL,
    total_system_power_kw NUMERIC(7, 2) NOT NULL,
    aerospike_thrust_kn NUMERIC(6, 2) NOT NULL,
    chamber_pressure_bar NUMERIC(6, 2) NOT NULL,
    throat_temp_kelvin NUMERIC(6, 1) NOT NULL,
    throat_heat_flux_mw_m2 NUMERIC(5, 2) NOT NULL,
    regen_jacket_flow_kg_s NUMERIC(5, 2) NOT NULL,
    thrust_vector_yaw_deg NUMERIC(4, 2) NOT NULL DEFAULT 0.00,
    ignition_stage_armed BOOLEAN NOT NULL DEFAULT FALSE,
    burn_profile_mode VARCHAR(32) NOT NULL DEFAULT 'ELECTRIC_CRUISE',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. CRYO PROPELLANT LOGS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS cryo_propellant_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id VARCHAR(64) NOT NULL REFERENCES aerospike_hypercar_vehicles(vehicle_id) ON DELETE CASCADE,
    lox_tank_pct NUMERIC(5, 2) NOT NULL,
    ch4_tank_pct NUMERIC(5, 2) NOT NULL,
    lox_tank_temp_kelvin NUMERIC(5, 2) NOT NULL DEFAULT 90.15,
    ch4_tank_temp_kelvin NUMERIC(5, 2) NOT NULL DEFAULT 111.45,
    lox_feed_pressure_bar NUMERIC(5, 2) NOT NULL DEFAULT 18.40,
    ch4_feed_pressure_bar NUMERIC(5, 2) NOT NULL DEFAULT 19.80,
    turbopump_rpm INT NOT NULL DEFAULT 0,
    turbopump_bearing_temp_c NUMERIC(5, 2) NOT NULL DEFAULT 42.0,
    turbopump_vibration_g NUMERIC(4, 2) NOT NULL DEFAULT 0.18,
    recirculation_pump_active BOOLEAN NOT NULL DEFAULT TRUE,
    purge_valve_sealed BOOLEAN NOT NULL DEFAULT TRUE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. VELOCITY RUN RECORDS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS velocity_run_records (
    run_record_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id VARCHAR(64) NOT NULL REFERENCES aerospike_hypercar_vehicles(vehicle_id) ON DELETE CASCADE,
    sector_index INT NOT NULL CHECK (sector_index BETWEEN 1 AND 24),
    sector_label VARCHAR(64) NOT NULL,
    ground_speed_kmh NUMERIC(7, 2) NOT NULL,
    mach_number NUMERIC(4, 3) NOT NULL,
    aerospike_thrust_kn NUMERIC(6, 2) NOT NULL,
    chamber_pressure_bar NUMERIC(6, 2) NOT NULL,
    propellant_flow_rate_kg_s NUMERIC(5, 2) NOT NULL,
    lox_tank_pct NUMERIC(5, 2) NOT NULL,
    ch4_tank_pct NUMERIC(5, 2) NOT NULL,
    braking_parachute_armed BOOLEAN NOT NULL DEFAULT FALSE,
    braking_parachute_deployed BOOLEAN NOT NULL DEFAULT FALSE,
    staged_ignition_active BOOLEAN NOT NULL DEFAULT FALSE,
    shock_wedge_angle_deg NUMERIC(4, 1) NOT NULL DEFAULT 90.0,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. STAGED IGNITION EVENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS staged_ignition_events (
    event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id VARCHAR(64) NOT NULL REFERENCES aerospike_hypercar_vehicles(vehicle_id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    ignition_stage INT NOT NULL DEFAULT 1,
    pyro_exciter_resistance_ohms NUMERIC(4, 3) NOT NULL DEFAULT 1.420,
    combustion_chamber_status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL',
    operator_callsign VARCHAR(64) NOT NULL,
    verification_hash VARCHAR(128) NOT NULL,
    telemetry_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- TIME-SERIES INDEXES ON (vehicle_id, recorded_at)
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_snapshots_vehicle_recorded 
    ON propulsion_telemetry_snapshots (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_cryo_vehicle_recorded 
    ON cryo_propellant_logs (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_velocity_records_vehicle_recorded 
    ON velocity_run_records (vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_velocity_records_sector 
    ON velocity_run_records (vehicle_id, sector_index);

CREATE INDEX IF NOT EXISTS idx_ignition_events_vehicle_recorded 
    ON staged_ignition_events (vehicle_id, recorded_at DESC);

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive public read and service-role write policies
-- ------------------------------------------------------------------------------
ALTER TABLE aerospike_hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE propulsion_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE cryo_propellant_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE velocity_run_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE staged_ignition_events ENABLE ROW LEVEL SECURITY;

-- 1. aerospike_hypercar_vehicles policies
CREATE POLICY "Public permissive read for aerospike hypercar vehicles"
    ON aerospike_hypercar_vehicles FOR SELECT
    USING (true);

CREATE POLICY "Service role write for aerospike hypercar vehicles"
    ON aerospike_hypercar_vehicles FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. propulsion_telemetry_snapshots policies
CREATE POLICY "Public permissive read for propulsion telemetry snapshots"
    ON propulsion_telemetry_snapshots FOR SELECT
    USING (true);

CREATE POLICY "Service role write for propulsion telemetry snapshots"
    ON propulsion_telemetry_snapshots FOR ALL
    USING (true)
    WITH CHECK (true);

-- 3. cryo_propellant_logs policies
CREATE POLICY "Public permissive read for cryo propellant logs"
    ON cryo_propellant_logs FOR SELECT
    USING (true);

CREATE POLICY "Service role write for cryo propellant logs"
    ON cryo_propellant_logs FOR ALL
    USING (true)
    WITH CHECK (true);

-- 4. velocity_run_records policies
CREATE POLICY "Public permissive read for velocity run records"
    ON velocity_run_records FOR SELECT
    USING (true);

CREATE POLICY "Service role write for velocity run records"
    ON velocity_run_records FOR ALL
    USING (true)
    WITH CHECK (true);

-- 5. staged_ignition_events policies
CREATE POLICY "Public permissive read for staged ignition events"
    ON staged_ignition_events FOR SELECT
    USING (true);

CREATE POLICY "Service role write for staged ignition events"
    ON staged_ignition_events FOR ALL
    USING (true)
    WITH CHECK (true);
