-- ============================================================================
-- CHRONO TACHYON-FX TELEMETRY ENGINE & FLIGHT DATA STORAGE BLUEPRINT
-- Institutional Aerospace Relational Database Schema
-- Vehicle Target: CHRONO TACHYON-FX // HYPERSONIC SCRAMJET HYPERCAR PROTO-16
-- ============================================================================

-- Extensions for high-precision telemetry and uuid generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table 1: Scramjet Hypercar Vehicle Master Fleet
CREATE TABLE IF NOT EXISTS scramjet_hypercar_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chassis_code VARCHAR(32) NOT NULL UNIQUE,
    vehicle_designation VARCHAR(128) NOT NULL,
    powertrain_type VARCHAR(64) NOT NULL DEFAULT 'HYBRID_SCRAMJET_EM_FLUX',
    aerodynamic_inlet_type VARCHAR(64) NOT NULL DEFAULT 'VARIABLE_GEOMETRY_RAMP_3STAGE',
    cryo_loop_coolant VARCHAR(64) NOT NULL DEFAULT 'LN2_SUBCOOLED_77K',
    nominal_drive_kw NUMERIC(8, 2) NOT NULL DEFAULT 2535.00,
    peak_thrust_kn NUMERIC(6, 2) NOT NULL DEFAULT 28.50,
    max_service_mach NUMERIC(4, 2) NOT NULL DEFAULT 0.52,
    commissioned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 2: High-Frequency Hypersonic Telemetry Snapshots
CREATE TABLE IF NOT EXISTS hypersonic_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES scramjet_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ground_speed_kmh NUMERIC(7, 2) NOT NULL,
    mach_number NUMERIC(5, 3) NOT NULL,
    total_power_kw NUMERIC(8, 2) NOT NULL,
    scramjet_thrust_kn NUMERIC(6, 2) NOT NULL,
    dynamic_pressure_q_kpa NUMERIC(7, 2) NOT NULL,
    cowl_deflection_deg NUMERIC(4, 2) NOT NULL,
    oblique_shock_angle_deg NUMERIC(4, 2) NOT NULL,
    combustion_chamber_p_bar NUMERIC(6, 2) NOT NULL,
    fuel_mass_flow_kg_s NUMERIC(5, 3) NOT NULL,
    inlet_compression_ratio NUMERIC(5, 2) NOT NULL,
    bypass_valve_open BOOLEAN NOT NULL DEFAULT FALSE,
    shock_train_stability_pct NUMERIC(5, 2) NOT NULL,
    chassis_g_force NUMERIC(4, 2) NOT NULL
);

-- Table 3: Electromagnetic Skid Levitation & Superconducting Cryo Matrix Logs
CREATE TABLE IF NOT EXISTS mag_skid_telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES scramjet_hypercar_vehicles(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    fl_gap_mm NUMERIC(4, 2) NOT NULL,
    fr_gap_mm NUMERIC(4, 2) NOT NULL,
    rl_gap_mm NUMERIC(4, 2) NOT NULL,
    rr_gap_mm NUMERIC(4, 2) NOT NULL,
    average_gap_mm NUMERIC(4, 2) NOT NULL,
    cryo_temp_kelvin NUMERIC(5, 2) NOT NULL DEFAULT 77.30,
    superconducting_flux_stability_pct NUMERIC(5, 2) NOT NULL DEFAULT 99.60,
    skid_repulsion_force_kn NUMERIC(6, 2) NOT NULL,
    coil_current_amperes NUMERIC(7, 1) NOT NULL,
    vacuum_insulation_torr NUMERIC(10, 6) NOT NULL,
    ground_proximity_alert BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table 4: Velocity Sector Records (Lap Sectors 1 to 14)
CREATE TABLE IF NOT EXISTS velocity_sector_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES scramjet_hypercar_vehicles(id) ON DELETE CASCADE,
    sector_number INT NOT NULL CHECK (sector_number BETWEEN 1 AND 14),
    sector_name VARCHAR(64) NOT NULL,
    mach_speed NUMERIC(5, 3) NOT NULL,
    ground_speed_kmh NUMERIC(7, 2) NOT NULL,
    scramjet_thrust_kn NUMERIC(6, 2) NOT NULL,
    dynamic_pressure_q_kpa NUMERIC(7, 2) NOT NULL,
    inlet_capture_area_ratio NUMERIC(5, 3) NOT NULL,
    skid_repulsion_kn NUMERIC(6, 2) NOT NULL,
    skid_ground_gap_mm NUMERIC(4, 2) NOT NULL,
    shock_status VARCHAR(32) NOT NULL DEFAULT 'LOCKED',
    sector_elapsed_ms INT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table 5: Inlet Diagnostics & Supersonic Vector Action Events
CREATE TABLE IF NOT EXISTS inlet_diagnostic_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID NOT NULL REFERENCES scramjet_hypercar_vehicles(id) ON DELETE CASCADE,
    event_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('INFO', 'NORMAL', 'WARNING', 'CRITICAL', 'ALERT')),
    inlet_mode VARCHAR(64) NOT NULL,
    cowl_position_deg NUMERIC(4, 2) NOT NULL,
    isolator_pressure_kpa NUMERIC(7, 2) NOT NULL,
    action_taken TEXT NOT NULL,
    telemetry_operator VARCHAR(64) NOT NULL DEFAULT 'AUTO_FLIGHT_DIRECTOR_CHRONO'
);

-- Performance Indexes on (vehicle_id, recorded_at) across all telemetry tables
CREATE INDEX IF NOT EXISTS idx_telemetry_snapshots_vehicle_time 
    ON hypersonic_telemetry_snapshots(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_mag_skid_vehicle_time 
    ON mag_skid_telemetry_logs(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_velocity_sector_vehicle_sector 
    ON velocity_sector_records(vehicle_id, sector_number ASC);

CREATE INDEX IF NOT EXISTS idx_velocity_sector_vehicle_time 
    ON velocity_sector_records(vehicle_id, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_inlet_events_vehicle_time 
    ON inlet_diagnostic_events(vehicle_id, event_timestamp DESC);

-- Enable Row Level Security (RLS) on all 5 relational tables
ALTER TABLE scramjet_hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hypersonic_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE mag_skid_telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE velocity_sector_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE inlet_diagnostic_events ENABLE ROW LEVEL SECURITY;

-- Permissive Public Read Policies for Real-Time Flight-Deck Monitors
CREATE POLICY "Public read access for scramjet_hypercar_vehicles"
    ON scramjet_hypercar_vehicles FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read access for hypersonic_telemetry_snapshots"
    ON hypersonic_telemetry_snapshots FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read access for mag_skid_telemetry_logs"
    ON mag_skid_telemetry_logs FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read access for velocity_sector_records"
    ON velocity_sector_records FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Public read access for inlet_diagnostic_events"
    ON inlet_diagnostic_events FOR SELECT
    TO anon, authenticated
    USING (true);

-- Permissive Service-Role Write Policies
CREATE POLICY "Service-role write access for scramjet_hypercar_vehicles"
    ON scramjet_hypercar_vehicles FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service-role write access for hypersonic_telemetry_snapshots"
    ON hypersonic_telemetry_snapshots FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service-role write access for mag_skid_telemetry_logs"
    ON mag_skid_telemetry_logs FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service-role write access for velocity_sector_records"
    ON velocity_sector_records FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service-role write access for inlet_diagnostic_events"
    ON inlet_diagnostic_events FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
