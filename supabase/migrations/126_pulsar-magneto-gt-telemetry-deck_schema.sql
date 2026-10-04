-- ============================================================================
-- PULSAR MAGNETO-GT // PLASMA TOKAMAK HYPERCAR TELEMETRY DATABASE
-- Schema: High-Field Fusion Telemetry, Superconducting MagLev, & Sector Ledger
-- ============================================================================

-- Enable pgcrypto for UUID generation if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. FUSION HYPERCAR VEHICLES REGISTRY
CREATE TABLE IF NOT EXISTS fusion_hypercar_vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chassis_code VARCHAR(32) UNIQUE NOT NULL,
    designation VARCHAR(128) NOT NULL,
    core_architecture VARCHAR(64) NOT NULL DEFAULT 'Compact High-Field Tokamak ReBCO',
    max_plasma_temp_mk NUMERIC(5,2) NOT NULL DEFAULT 18.50,
    peak_magnetic_field_tesla NUMERIC(4,2) NOT NULL DEFAULT 14.20,
    total_power_kw INTEGER NOT NULL DEFAULT 1865,
    cryostat_spec VARCHAR(64) NOT NULL DEFAULT 'Supercritical He-4 Loop @ 4.2K',
    chassis_mass_kg INTEGER NOT NULL DEFAULT 1420,
    status VARCHAR(32) NOT NULL DEFAULT 'OPERATIONAL',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PLASMA TELEMETRY SNAPSHOTS (HIGH-FREQUENCY TELEMETRY LOG)
CREATE TABLE IF NOT EXISTS plasma_telemetry_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES fusion_hypercar_vehicles(id) ON DELETE CASCADE,
    speed_kmh NUMERIC(6,2) NOT NULL,
    fusion_output_kw NUMERIC(6,1) NOT NULL,
    toroidal_field_tesla NUMERIC(5,2) NOT NULL,
    poloidal_field_tesla NUMERIC(5,2) NOT NULL,
    plasma_temp_mk NUMERIC(5,2) NOT NULL,
    beta_stability_percent NUMERIC(5,2) NOT NULL,
    neutron_flux_10e14 NUMERIC(6,2) NOT NULL,
    helium_temp_kelvin NUMERIC(4,2) NOT NULL DEFAULT 4.20,
    helium_pressure_bar NUMERIC(4,2) NOT NULL DEFAULT 1.18,
    maglev_clearance_mm NUMERIC(4,1) NOT NULL,
    operational_mode VARCHAR(64) NOT NULL DEFAULT 'TOKAMAK EQUILIBRIUM',
    flux_overdrive_active BOOLEAN NOT NULL DEFAULT FALSE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. MAGLEV COIL & CORNER SUSPENSION LOGS
CREATE TABLE IF NOT EXISTS maglev_coil_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES fusion_hypercar_vehicles(id) ON DELETE CASCADE,
    corner_position VARCHAR(8) NOT NULL CHECK (corner_position IN ('FL', 'FR', 'RL', 'RR')),
    ride_height_mm NUMERIC(4,1) NOT NULL,
    repulsive_force_kn NUMERIC(5,2) NOT NULL,
    damping_mode VARCHAR(32) NOT NULL DEFAULT 'DYNAMIC DAMPING',
    motor_torque_nm NUMERIC(6,1) NOT NULL,
    motor_power_kw NUMERIC(5,1) NOT NULL,
    slip_angle_deg NUMERIC(4,2) NOT NULL DEFAULT 0.00,
    coil_temp_k NUMERIC(4,2) NOT NULL DEFAULT 4.18,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. FUSION SECTOR RECORDS (TRACK LAP STINT ANALYSIS)
CREATE TABLE IF NOT EXISTS fusion_sector_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES fusion_hypercar_vehicles(id) ON DELETE CASCADE,
    stint_number INTEGER NOT NULL DEFAULT 1,
    sector_number INTEGER NOT NULL CHECK (sector_number BETWEEN 1 AND 14),
    sector_name VARCHAR(64) NOT NULL,
    sector_time_sec NUMERIC(6,3) NOT NULL,
    trap_speed_kmh NUMERIC(6,2) NOT NULL,
    peak_temp_mk NUMERIC(5,2) NOT NULL,
    mean_field_tesla NUMERIC(5,2) NOT NULL,
    maglev_clearance_mm NUMERIC(4,1) NOT NULL,
    power_output_kw NUMERIC(6,1) NOT NULL,
    delta_to_optimal_sec NUMERIC(5,3) NOT NULL DEFAULT 0.000,
    status VARCHAR(32) NOT NULL DEFAULT 'OPTIMUM',
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. MAGNETIC QUENCH & ACTION INCIDENT EVENTS
CREATE TABLE IF NOT EXISTS magnetic_quench_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES fusion_hypercar_vehicles(id) ON DELETE CASCADE,
    event_type VARCHAR(64) NOT NULL,
    severity VARCHAR(32) NOT NULL CHECK (severity IN ('CRITICAL', 'WARNING', 'INFO', 'NOMINAL')),
    coil_node_index INTEGER CHECK (coil_node_index BETWEEN 1 AND 12),
    field_divergence_pct NUMERIC(5,2) DEFAULT 0.00,
    description TEXT NOT NULL,
    mitigation_action TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT TRUE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR HIGH-THROUGHPUT FLIGHT DECK TELEMETRY
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_snapshots_veh_time ON plasma_telemetry_snapshots (vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_maglev_veh_time ON maglev_coil_logs (vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sectors_veh_time ON fusion_sector_records (vehicle_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_sectors_stint_num ON fusion_sector_records (vehicle_id, stint_number, sector_number);
CREATE INDEX IF NOT EXISTS idx_quench_veh_time ON magnetic_quench_events (vehicle_id, recorded_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE fusion_hypercar_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plasma_telemetry_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE maglev_coil_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fusion_sector_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE magnetic_quench_events ENABLE ROW LEVEL SECURITY;

-- Permissive public read access for track telemetry consumers
CREATE POLICY "Allow public read fusion_hypercar_vehicles"
    ON fusion_hypercar_vehicles FOR SELECT USING (true);

CREATE POLICY "Allow public read plasma_telemetry_snapshots"
    ON plasma_telemetry_snapshots FOR SELECT USING (true);

CREATE POLICY "Allow public read maglev_coil_logs"
    ON maglev_coil_logs FOR SELECT USING (true);

CREATE POLICY "Allow public read fusion_sector_records"
    ON fusion_sector_records FOR SELECT USING (true);

CREATE POLICY "Allow public read magnetic_quench_events"
    ON magnetic_quench_events FOR SELECT USING (true);

-- Authenticated and Service-Role write access for telemetry ingestion systems
CREATE POLICY "Allow service/auth write fusion_hypercar_vehicles"
    ON fusion_hypercar_vehicles FOR ALL
    USING (auth.role() IN ('authenticated', 'service_role'))
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Allow service/auth write plasma_telemetry_snapshots"
    ON plasma_telemetry_snapshots FOR ALL
    USING (auth.role() IN ('authenticated', 'service_role'))
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Allow service/auth write maglev_coil_logs"
    ON maglev_coil_logs FOR ALL
    USING (auth.role() IN ('authenticated', 'service_role'))
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Allow service/auth write fusion_sector_records"
    ON fusion_sector_records FOR ALL
    USING (auth.role() IN ('authenticated', 'service_role'))
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));

CREATE POLICY "Allow service/auth write magnetic_quench_events"
    ON magnetic_quench_events FOR ALL
    USING (auth.role() IN ('authenticated', 'service_role'))
    WITH CHECK (auth.role() IN ('authenticated', 'service_role'));
