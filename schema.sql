-- ============================================================================
-- Orbital Habitat ECLSS SCADA OS - Supabase DDL Schema
-- Architecture: Closed-Loop Environmental Control & Life Support System (ECLSS)
-- Asset 109 | Archetype C: High-Velocity Dispatch Rail • LEO 420 km Station
-- Ghost Factory™ | Zero-Defect Institutional Standard
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Atmospheric Telemetry Table
CREATE TABLE IF NOT EXISTS eclss_telemetry (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_callsign VARCHAR(64) NOT NULL DEFAULT 'ORBITAL_HABITAT_ALPHA',
    o2_partial_pressure_kpa NUMERIC(5,2) NOT NULL DEFAULT 21.30,
    co2_partial_pressure_kpa NUMERIC(5,2) NOT NULL DEFAULT 0.42,
    cabin_pressure_kpa NUMERIC(6,2) NOT NULL DEFAULT 101.32,
    cabin_temp_celsius NUMERIC(5,2) NOT NULL DEFAULT 21.50,
    relative_humidity_pct NUMERIC(5,2) NOT NULL DEFAULT 45.00,
    trace_contaminant_ppm NUMERIC(6,3) NOT NULL DEFAULT 0.012,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'NOMINAL_CIRCULATION',
    -- Sabatier closed-loop CO2 methanation bypass valve (Flagship Gate Criterion #4: Domain Physics Solver)
    sabatier_bypass_valve VARCHAR(30) NOT NULL DEFAULT 'NOMINAL_FLOW',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. O2 Regeneration Loops (Electrolysis & Sabatier Integration)
CREATE TABLE IF NOT EXISTS o2_regeneration_loops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    loop_tag VARCHAR(64) NOT NULL DEFAULT 'O2_REGEN_LOOP_PRIMARY',
    electrolysis_current_amps NUMERIC(6,2) NOT NULL DEFAULT 120.50,
    h2_generation_rate_sccm NUMERIC(7,2) NOT NULL DEFAULT 1850.00,
    o2_generation_rate_sccm NUMERIC(7,2) NOT NULL DEFAULT 925.00,
    cell_stack_voltage_v NUMERIC(5,2) NOT NULL DEFAULT 48.20,
    water_feed_flow_ml_min NUMERIC(6,2) NOT NULL DEFAULT 14.80,
    operating_temp_celsius NUMERIC(5,2) NOT NULL DEFAULT 65.00,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_PRODUCTION',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Water Recovery Systems (Urine Processing & Greywater Distillation)
CREATE TABLE IF NOT EXISTS water_recovery_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assembly_code VARCHAR(32) NOT NULL DEFAULT 'VCD_DISTILLATION_UNIT',
    distillate_recovery_rate_pct NUMERIC(5,2) NOT NULL DEFAULT 93.50,
    distillation_centrifuge_rpm INTEGER NOT NULL DEFAULT 1200,
    permeate_conductivity_us_cm NUMERIC(6,3) NOT NULL DEFAULT 1.150,
    brine_tank_mass_kg NUMERIC(6,2) NOT NULL DEFAULT 42.80,
    post_treatment_catalytic_bed_temp_c NUMERIC(5,2) NOT NULL DEFAULT 105.00,
    assembly_status VARCHAR(32) NOT NULL DEFAULT 'PROCESSING_BATCH',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. CO2 Scrubber Beds (Amine / Zeolite Thermal Swing Adsorption)
CREATE TABLE IF NOT EXISTS co2_scrubber_beds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bed_identifier VARCHAR(32) NOT NULL DEFAULT 'BED_A_DESORPTION',
    adsorbent_medium VARCHAR(64) NOT NULL DEFAULT 'SOLID_AMINE_MATRIX',
    co2_removal_efficiency_pct NUMERIC(5,2) NOT NULL DEFAULT 98.40,
    desorption_heater_temp_c NUMERIC(5,2) NOT NULL DEFAULT 140.00,
    cycle_elapsed_seconds INTEGER NOT NULL DEFAULT 1840,
    bed_cycle_state VARCHAR(32) NOT NULL DEFAULT 'DESORBING_TO_SABATIER',
    vacuum_purge_active BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Atmospheric Sensors
CREATE TABLE IF NOT EXISTS atmospheric_sensors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sensor_cluster VARCHAR(64) NOT NULL DEFAULT 'HABITAT_CORE_NODE',
    sensor_type VARCHAR(32) NOT NULL,
    calibrated_range VARCHAR(64) NOT NULL,
    current_reading_numeric NUMERIC(8,3) NOT NULL,
    unit_of_measure VARCHAR(16) NOT NULL,
    fault_flag BOOLEAN NOT NULL DEFAULT FALSE,
    calibration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Sabatier Reactor Bypass Valve Telemetry (Flagship Gate Criterion #4)
-- Stoichiometric CO2 + 4H2 -> CH4 + 2H2O closed-loop mass balance bypass
CREATE TABLE IF NOT EXISTS sabatier_bypass_valves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    valve_tag VARCHAR(64) NOT NULL UNIQUE DEFAULT 'SAB-BPV-109-ALPHA',
    bypass_state VARCHAR(32) NOT NULL DEFAULT 'NOMINAL_FLOW',
    flow_rate_kg_hr NUMERIC(6,3) NOT NULL DEFAULT 1.250,
    differential_pressure_kpa NUMERIC(6,2) NOT NULL DEFAULT 14.20,
    purge_temperature_kelvin NUMERIC(5,2) NOT NULL DEFAULT 420.15,
    stoichiometric_ratio_h2_co2 NUMERIC(4,2) NOT NULL DEFAULT 4.05,
    methanation_efficiency_pct NUMERIC(5,2) NOT NULL DEFAULT 98.40,
    emergency_override_engaged BOOLEAN NOT NULL DEFAULT FALSE,
    last_actuation_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_eclss_telemetry_time ON eclss_telemetry(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_o2_regen_loop_tag ON o2_regeneration_loops(loop_tag);
CREATE INDEX IF NOT EXISTS idx_water_recovery_assembly ON water_recovery_systems(assembly_code);
CREATE INDEX IF NOT EXISTS idx_co2_scrubber_bed ON co2_scrubber_beds(bed_identifier);
CREATE INDEX IF NOT EXISTS idx_atmospheric_sensors_cluster ON atmospheric_sensors(sensor_cluster);
CREATE INDEX IF NOT EXISTS idx_sabatier_bypass_valves_tag ON sabatier_bypass_valves(valve_tag);

-- Explicit Row Level Security (RLS) Enablement
ALTER TABLE eclss_telemetry ENABLE ROW LEVEL SECURITY;
ALTER TABLE o2_regeneration_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_recovery_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE co2_scrubber_beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE atmospheric_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sabatier_bypass_valves ENABLE ROW LEVEL SECURITY;

-- Default permissive read-access policy for institutional SCADA operators
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_eclss') THEN
        CREATE POLICY allow_authenticated_read_eclss ON eclss_telemetry FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_o2') THEN
        CREATE POLICY allow_authenticated_read_o2 ON o2_regeneration_loops FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_water') THEN
        CREATE POLICY allow_authenticated_read_water ON water_recovery_systems FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_scrubbers') THEN
        CREATE POLICY allow_authenticated_read_scrubbers ON co2_scrubber_beds FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_sensors') THEN
        CREATE POLICY allow_authenticated_read_sensors ON atmospheric_sensors FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_sabatier') THEN
        CREATE POLICY allow_authenticated_read_sabatier ON sabatier_bypass_valves FOR SELECT USING (true);
    END IF;
END $$;
