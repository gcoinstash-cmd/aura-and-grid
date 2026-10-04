-- =============================================================================
-- HYDRA LE MANS-24 // LIQUID H2 FUEL-CELL HYPERCAR TELEMETRY DATABASE
-- Schema: endurance_vehicles, h2_telemetry_snapshots, supercapacitor_cycle_logs,
--         stint_strategy_records, and pit_telemetry_events
-- Architecture: Institutional PostgreSQL DDL with RLS & High-Performance Indexes
-- =============================================================================

-- Ensure UUID extension is active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-applying cleanly
DROP TABLE IF EXISTS pit_telemetry_events CASCADE;
DROP TABLE IF EXISTS stint_strategy_records CASCADE;
DROP TABLE IF EXISTS supercapacitor_cycle_logs CASCADE;
DROP TABLE IF EXISTS h2_telemetry_snapshots CASCADE;
DROP TABLE IF EXISTS endurance_vehicles CASCADE;

-- -----------------------------------------------------------------------------
-- 1. Table: endurance_vehicles
-- Primary telemetry registry for hypercar prototypes and endurance chassis
-- -----------------------------------------------------------------------------
CREATE TABLE endurance_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chassis_code VARCHAR(32) NOT NULL UNIQUE,
    vehicle_name VARCHAR(128) NOT NULL,
    racing_number INT NOT NULL DEFAULT 11,
    vehicle_class VARCHAR(32) NOT NULL DEFAULT 'HYPERCAR-H2',
    powertrain_type VARCHAR(64) NOT NULL DEFAULT 'LIQUID_H2_FUEL_CELL_SUPERCAPACITOR',
    h2_capacity_kg NUMERIC(6, 2) NOT NULL DEFAULT 14.50,
    max_stack_kw NUMERIC(6, 1) NOT NULL DEFAULT 450.0,
    max_supercap_kw NUMERIC(6, 1) NOT NULL DEFAULT 600.0,
    system_voltage NUMERIC(5, 1) NOT NULL DEFAULT 800.0,
    chassis_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_STINT',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 2. Table: h2_telemetry_snapshots
-- High-frequency cryogenic H2 storage and PEM fuel cell stack telemetry
-- -----------------------------------------------------------------------------
CREATE TABLE h2_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES endurance_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    ground_speed_kmh NUMERIC(5, 1) NOT NULL,
    stack_output_kw NUMERIC(5, 1) NOT NULL,
    supercap_soc_pct NUMERIC(5, 2) NOT NULL,
    h2_tank_pressure_bar NUMERIC(5, 1) NOT NULL,
    cryo_tank_temp_k NUMERIC(5, 2) NOT NULL,
    anode_mass_flow_g_s NUMERIC(5, 2) NOT NULL,
    cathode_mass_flow_g_s NUMERIC(5, 2) NOT NULL,
    water_exhaust_rate_ml_s NUMERIC(5, 1) NOT NULL,
    membrane_humidity_pct NUMERIC(5, 2) NOT NULL DEFAULT 88.50,
    boiloff_relief_active BOOLEAN NOT NULL DEFAULT FALSE,
    stint_mode VARCHAR(32) NOT NULL DEFAULT 'ENDURANCE_CRUISE'
);

-- -----------------------------------------------------------------------------
-- 3. Table: supercapacitor_cycle_logs
-- 800V Graphene Supercapacitor pack thermals, instant flux, & MGU-K axle splits
-- -----------------------------------------------------------------------------
CREATE TABLE supercapacitor_cycle_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES endurance_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    bus_voltage_v NUMERIC(5, 1) NOT NULL,
    instant_power_kw NUMERIC(6, 1) NOT NULL, -- Negative indicates regen harvest, positive indicates boost discharge
    cell_temp_c NUMERIC(5, 1) NOT NULL,
    front_axle_kw NUMERIC(5, 1) NOT NULL,
    rear_axle_kw NUMERIC(5, 1) NOT NULL,
    front_rotor_temp_c NUMERIC(5, 1) NOT NULL,
    rear_rotor_temp_c NUMERIC(5, 1) NOT NULL,
    state_of_health_pct NUMERIC(5, 2) NOT NULL,
    overtake_boost_active BOOLEAN NOT NULL DEFAULT FALSE
);

-- -----------------------------------------------------------------------------
-- 4. Table: stint_strategy_records
-- Endurance 24-hour race stint degradation, fuel consumption, and pit turnaround ledger
-- -----------------------------------------------------------------------------
CREATE TABLE stint_strategy_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES endurance_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    stint_number INT NOT NULL,
    driver_name VARCHAR(64) NOT NULL,
    laps_completed INT NOT NULL,
    avg_lap_pace VARCHAR(16) NOT NULL,
    avg_lap_seconds NUMERIC(6, 3) NOT NULL,
    h2_consumption_kg_per_lap NUMERIC(4, 3) NOT NULL,
    tire_wear_pct NUMERIC(4, 1) NOT NULL,
    supercap_health_pct NUMERIC(4, 1) NOT NULL,
    energy_delta_pct NUMERIC(4, 2) NOT NULL,
    pit_turnaround_target_s NUMERIC(4, 1) NOT NULL,
    stint_status VARCHAR(32) NOT NULL DEFAULT 'COMPLETED'
);

-- -----------------------------------------------------------------------------
-- 5. Table: pit_telemetry_events
-- Real-time telemetry daemon events, FIA homologation alerts, and subsystem notices
-- -----------------------------------------------------------------------------
CREATE TABLE pit_telemetry_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES endurance_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    stint_number INT,
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL DEFAULT 'INFO', -- 'INFO', 'WARNING', 'CRITICAL', 'OPERATIONAL'
    message TEXT NOT NULL,
    telemetry_payload JSONB DEFAULT '{}'::jsonb
);

-- =============================================================================
-- PERFORMANCE INDEXES (Optimized for vehicle telemetry queries & real-time dash)
-- =============================================================================
CREATE INDEX idx_endurance_vehicles_chassis ON endurance_vehicles(chassis_code);
CREATE INDEX idx_h2_telemetry_snapshots_vehicle_recorded ON h2_telemetry_snapshots(vehicle_id, recorded_at DESC);
CREATE INDEX idx_supercap_cycle_logs_vehicle_recorded ON supercapacitor_cycle_logs(vehicle_id, recorded_at DESC);
CREATE INDEX idx_stint_strategy_records_vehicle_recorded ON stint_strategy_records(vehicle_id, recorded_at DESC);
CREATE INDEX idx_stint_strategy_records_stint_num ON stint_strategy_records(vehicle_id, stint_number);
CREATE INDEX idx_pit_telemetry_events_vehicle_recorded ON pit_telemetry_events(vehicle_id, recorded_at DESC);
CREATE INDEX idx_pit_telemetry_events_severity ON pit_telemetry_events(severity);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Permissive public read for telemetry viewers and service-role write policies
-- =============================================================================

ALTER TABLE endurance_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE h2_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE supercapacitor_cycle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE stint_strategy_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE pit_telemetry_events ENABLE ROW LEVEL SECURITY;

-- 1. endurance_vehicles Policies
CREATE POLICY "Public read endurance_vehicles" 
    ON endurance_vehicles FOR SELECT USING (true);
CREATE POLICY "Service-role write endurance_vehicles" 
    ON endurance_vehicles FOR ALL USING (true) WITH CHECK (true);

-- 2. h2_telemetry_snapshots Policies
CREATE POLICY "Public read h2_telemetry_snapshots" 
    ON h2_telemetry_snapshots FOR SELECT USING (true);
CREATE POLICY "Service-role write h2_telemetry_snapshots" 
    ON h2_telemetry_snapshots FOR ALL USING (true) WITH CHECK (true);

-- 3. supercapacitor_cycle_logs Policies
CREATE POLICY "Public read supercapacitor_cycle_logs" 
    ON supercapacitor_cycle_logs FOR SELECT USING (true);
CREATE POLICY "Service-role write supercapacitor_cycle_logs" 
    ON supercapacitor_cycle_logs FOR ALL USING (true) WITH CHECK (true);

-- 4. stint_strategy_records Policies
CREATE POLICY "Public read stint_strategy_records" 
    ON stint_strategy_records FOR SELECT USING (true);
CREATE POLICY "Service-role write stint_strategy_records" 
    ON stint_strategy_records FOR ALL USING (true) WITH CHECK (true);

-- 5. pit_telemetry_events Policies
CREATE POLICY "Public read pit_telemetry_events" 
    ON pit_telemetry_events FOR SELECT USING (true);
CREATE POLICY "Service-role write pit_telemetry_events" 
    ON pit_telemetry_events FOR ALL USING (true) WITH CHECK (true);
