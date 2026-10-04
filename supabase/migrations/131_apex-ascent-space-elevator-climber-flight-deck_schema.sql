-- ==============================================================================
-- APEX-ASCENT ORBITAL TETHER & HEAVY CLIMBER TELEMETRY ENGINE
-- PostgreSQL DDL & Row Level Security (RLS) Blueprint
-- Architecture: Space Elevator Infrastructure & Climber Robotics Command Deck
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running
DROP TABLE IF EXISTS operator_action_logs CASCADE;
DROP TABLE IF EXISTS tether_inspection_events CASCADE;
DROP TABLE IF EXISTS cargo_manifest CASCADE;
DROP TABLE IF EXISTS traction_drive_telemetry CASCADE;
DROP TABLE IF EXISTS photovoltaic_receivers CASCADE;
DROP TABLE IF EXISTS tether_telemetry CASCADE;
DROP TABLE IF EXISTS climbers CASCADE;

-- 1. Climbers Registry
CREATE TABLE climbers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    designation VARCHAR(64) NOT NULL UNIQUE,
    chassis_class VARCHAR(64) NOT NULL DEFAULT 'HEAVY_CARRIAGE_GEN4',
    ascent_status VARCHAR(32) NOT NULL DEFAULT 'ASCENDING' 
        CHECK (ascent_status IN ('STATIONARY', 'ASCENDING', 'DESCENDING', 'DECELERATING', 'STATION_DOCKED', 'EMERGENCY_BRAKE', 'MAINTENANCE_HOLD')),
    current_altitude_km NUMERIC(10, 3) NOT NULL DEFAULT 14280.000,
    ascent_velocity_kmh NUMERIC(8, 2) NOT NULL DEFAULT 220.00,
    beamed_power_mw NUMERIC(6, 2) NOT NULL DEFAULT 4.80,
    tether_strain_gpa NUMERIC(6, 2) NOT NULL DEFAULT 68.40,
    core_temp_c NUMERIC(5, 2) NOT NULL DEFAULT 24.20,
    target_destination VARCHAR(64) NOT NULL DEFAULT 'GEO_APEX_TERMINAL_35786KM',
    ground_laser_array VARCHAR(64) NOT NULL DEFAULT 'GALAPAGOS_EQUATORIAL_820NM',
    emergency_brake_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    power_decouple_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Climber Real-Time Tether Telemetry
CREATE TABLE tether_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    altitude_km NUMERIC(10, 3) NOT NULL,
    axial_strain_gpa NUMERIC(6, 2) NOT NULL,
    coriolis_deflection_m NUMERIC(8, 2) NOT NULL,
    optical_absorption_pct NUMERIC(5, 2) NOT NULL DEFAULT 94.20,
    vibration_frequency_hz NUMERIC(6, 2) NOT NULL DEFAULT 1.84,
    ribbon_temp_k NUMERIC(6, 2) NOT NULL DEFAULT 218.40,
    ambient_plasma_density_cm3 NUMERIC(10, 2) NOT NULL DEFAULT 420.00,
    radiation_flux_rad_h NUMERIC(8, 3) NOT NULL DEFAULT 14.28
);

-- 3. High-Efficiency Photovoltaic Receivers & Thermal Dissipation
CREATE TABLE photovoltaic_receivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    array_voltage_v NUMERIC(8, 2) NOT NULL DEFAULT 1200.00,
    array_current_a NUMERIC(8, 2) NOT NULL DEFAULT 4000.00,
    beam_flux_mw_m2 NUMERIC(6, 3) NOT NULL DEFAULT 8.650,
    optical_alignment_jitter_mrad NUMERIC(5, 3) NOT NULL DEFAULT 0.042,
    heat_pipe_rejection_mw NUMERIC(6, 2) NOT NULL DEFAULT 1.34,
    radiator_temp_k NUMERIC(6, 2) NOT NULL DEFAULT 342.15,
    multi_junction_efficiency_pct NUMERIC(5, 2) NOT NULL DEFAULT 58.40,
    status VARCHAR(32) NOT NULL DEFAULT 'OPTIMAL'
);

-- 4. 8-Wheel Magnetic Pinch Traction Drive Diagnostics
CREATE TABLE traction_drive_telemetry (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    wheel_index INT NOT NULL CHECK (wheel_index BETWEEN 1 AND 8),
    torque_nm NUMERIC(7, 2) NOT NULL DEFAULT 1520.00,
    rpm NUMERIC(7, 2) NOT NULL DEFAULT 318.50,
    slip_ratio_pct NUMERIC(5, 3) NOT NULL DEFAULT 0.020,
    pinch_force_kn NUMERIC(6, 2) NOT NULL DEFAULT 48.50,
    motor_temp_c NUMERIC(5, 2) NOT NULL DEFAULT 41.80,
    regenerative_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL'
);

-- 5. Climber Cargo Manifest & Pressurized Pod Ledger
CREATE TABLE cargo_manifest (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pod_code VARCHAR(32) NOT NULL UNIQUE,
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    payload_name VARCHAR(128) NOT NULL,
    cargo_class VARCHAR(64) NOT NULL CHECK (cargo_class IN ('HABITAT_RING', 'SATELLITE_BUS', 'PROPELLANT_BLADDER', 'SOLAR_ARRAY_SHEET', 'CRYO_GAS', 'ROVER_CHASSIS', 'SPECTROMETER_MODULE', 'METALLURGY_FURNACE')),
    mass_kg NUMERIC(9, 2) NOT NULL,
    atmospheric_integrity_pct NUMERIC(5, 2) NOT NULL DEFAULT 100.00,
    transit_progress_pct NUMERIC(5, 2) NOT NULL DEFAULT 39.90,
    eta_hours NUMERIC(6, 1) NOT NULL,
    power_draw_kwh_km NUMERIC(6, 2) NOT NULL DEFAULT 14.80,
    priority_tier VARCHAR(16) NOT NULL DEFAULT 'TIER_1' CHECK (priority_tier IN ('CRITICAL', 'TIER_1', 'TIER_2', 'BULK_FREIGHT')),
    destination VARCHAR(64) NOT NULL DEFAULT 'GEO_HABITAT_RING_ALPHA',
    status VARCHAR(32) NOT NULL DEFAULT 'IN_TRANSIT' CHECK (status IN ('STAGED', 'IN_TRANSIT', 'TRANSFER_READY', 'DELIVERED', 'QUARANTINE')),
    loaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Tether Ribbon Optical Inspection & Defect Monitor
CREATE TABLE tether_inspection_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    altitude_km NUMERIC(10, 3) NOT NULL,
    defect_type VARCHAR(64) NOT NULL CHECK (defect_type IN ('MICROMETEORITE_PIT', 'CARBON_FIBER_FRAY', 'PLASMA_ETCHING', 'SURFACE_CONTAMINANT', 'LIGHTNING_SINGE', 'NONE')),
    severity VARCHAR(16) NOT NULL DEFAULT 'LOW' CHECK (severity IN ('INFORMATIONAL', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    pitting_depth_um NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    ribbon_coordinate_y_m NUMERIC(10, 2) NOT NULL,
    camera_sensor_id VARCHAR(32) NOT NULL DEFAULT 'CAM_VENTRAL_ULTRA_4K',
    action_taken VARCHAR(128) NOT NULL DEFAULT 'LOGGED_IN_STRUCTURAL_MATRIX',
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE'
);

-- 7. Operator Action Logs & Audit Trail
CREATE TABLE operator_action_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    climber_id UUID NOT NULL REFERENCES climbers(id) ON DELETE CASCADE,
    operator_callsign VARCHAR(64) NOT NULL,
    action_code VARCHAR(64) NOT NULL,
    action_description TEXT NOT NULL,
    parameter_deltas JSONB DEFAULT '{}'::jsonb,
    execution_status VARCHAR(32) NOT NULL DEFAULT 'SUCCESS' CHECK (execution_status IN ('SUCCESS', 'PENDING', 'REJECTED', 'ABORTED')),
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- ==============================================================================
CREATE INDEX idx_tether_telemetry_climber_time ON tether_telemetry(climber_id, recorded_at DESC);
CREATE INDEX idx_pv_receivers_climber_time ON photovoltaic_receivers(climber_id, recorded_at DESC);
CREATE INDEX idx_traction_drive_climber_wheel ON traction_drive_telemetry(climber_id, wheel_index);
CREATE INDEX idx_cargo_manifest_climber_status ON cargo_manifest(climber_id, status);
CREATE INDEX idx_cargo_manifest_priority ON cargo_manifest(priority_tier);
CREATE INDEX idx_inspection_events_climber ON tether_inspection_events(climber_id, detected_at DESC);
CREATE INDEX idx_operator_logs_climber ON operator_action_logs(climber_id, logged_at DESC);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE climbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE tether_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE photovoltaic_receivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE traction_drive_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE cargo_manifest ENABLE ROW LEVEL SECURITY;
ALTER TABLE tether_inspection_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE operator_action_logs ENABLE ROW LEVEL SECURITY;

-- Read policies for institutional operators (authenticated and anon dashboard viewers)
CREATE POLICY "Allow read access to climbers for all authenticated users"
    ON climbers FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow modify access to climbers for authenticated flight controllers"
    ON climbers FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access to tether_telemetry"
    ON tether_telemetry FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow insert tether_telemetry for system telemetry daemons"
    ON tether_telemetry FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow read access to photovoltaic_receivers"
    ON photovoltaic_receivers FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow read access to traction_drive_telemetry"
    ON traction_drive_telemetry FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow read access to cargo_manifest"
    ON cargo_manifest FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow update access to cargo_manifest for controllers"
    ON cargo_manifest FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow read access to tether_inspection_events"
    ON tether_inspection_events FOR SELECT
    TO anon, authenticated
    USING (true);

CREATE POLICY "Allow read and write to operator_action_logs"
    ON operator_action_logs FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);
