-- =====================================================================
-- CASCADE RANGE CALDERA // SUPERCRITICAL EGS POWER STATION 04
-- Database Schema for Deep-Earth Supercritical Telemetry & Control Deck
-- =====================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Wells Master Table
CREATE TABLE IF NOT EXISTS wells (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    well_code VARCHAR(32) NOT NULL UNIQUE,
    well_type VARCHAR(20) NOT NULL CHECK (well_type IN ('PRODUCTION', 'INJECTION', 'OBSERVATION')),
    depth_meters NUMERIC(7, 2) NOT NULL,
    casing_diameter_mm NUMERIC(6, 2) NOT NULL,
    target_formation VARCHAR(100) NOT NULL,
    bottom_hole_temp_c NUMERIC(5, 2) NOT NULL,
    wellhead_pressure_mpa NUMERIC(5, 2) NOT NULL,
    design_flow_rate_kg_s NUMERIC(6, 2) NOT NULL,
    choke_aperture_pct NUMERIC(5, 2) DEFAULT 100.0,
    calcite_scaling_index NUMERIC(4, 2) DEFAULT 0.50,
    seismic_risk_tier VARCHAR(16) NOT NULL DEFAULT 'GREEN' CHECK (seismic_risk_tier IN ('GREEN', 'AMBER', 'RED')),
    status VARCHAR(24) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'CHOKED', 'FLUSHING', 'STANDBY', 'ISOLATED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Telemetry Logs Table
CREATE TABLE IF NOT EXISTS telemetry_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    well_id UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    temperature_c NUMERIC(6, 2) NOT NULL,
    pressure_mpa NUMERIC(5, 2) NOT NULL,
    flow_rate_kg_s NUMERIC(6, 2) NOT NULL,
    enthalpy_kj_kg NUMERIC(7, 2) NOT NULL,
    quartz_silica_index NUMERIC(4, 2) NOT NULL,
    steam_quality_pct NUMERIC(5, 2) NOT NULL,
    caliper_variance_mm NUMERIC(5, 2) DEFAULT 0.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Micro-Seismic Hypocenter Events Table
CREATE TABLE IF NOT EXISTS microseismic_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    northing_m NUMERIC(8, 2) NOT NULL,
    easting_m NUMERIC(8, 2) NOT NULL,
    depth_meters NUMERIC(7, 2) NOT NULL,
    magnitude_mw NUMERIC(4, 2) NOT NULL,
    seismic_moment_nm NUMERIC(14, 2) NOT NULL,
    corner_frequency_hz NUMERIC(6, 2) NOT NULL,
    fault_strike_deg NUMERIC(5, 1) NOT NULL,
    fault_dip_deg NUMERIC(4, 1) NOT NULL,
    fault_rake_deg NUMERIC(5, 1) NOT NULL,
    cluster_id VARCHAR(32) NOT NULL,
    risk_tier VARCHAR(16) NOT NULL DEFAULT 'GREEN' CHECK (risk_tier IN ('GREEN', 'AMBER', 'RED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Supercritical Turbine & Binary ORC Matrix Table
CREATE TABLE IF NOT EXISTS turbine_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stage_number INT NOT NULL UNIQUE CHECK (stage_number BETWEEN 1 AND 4),
    stage_name VARCHAR(64) NOT NULL,
    cycle_type VARCHAR(32) NOT NULL,
    gross_power_mwe NUMERIC(6, 2) NOT NULL,
    inlet_pressure_mpa NUMERIC(5, 2) NOT NULL,
    inlet_temperature_c NUMERIC(5, 2) NOT NULL,
    rpm INT NOT NULL,
    isentropic_efficiency_pct NUMERIC(4, 1) NOT NULL,
    vibration_rms_mm_s NUMERIC(4, 2) NOT NULL,
    condenser_vacuum_kpa NUMERIC(5, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SYNCHRONIZED',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Hydro-Fracture Stimulation Ledger
CREATE TABLE IF NOT EXISTS hydrofracture_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    well_id UUID NOT NULL REFERENCES wells(id) ON DELETE CASCADE,
    stage_index INT NOT NULL,
    top_depth_m NUMERIC(7, 2) NOT NULL,
    bottom_depth_m NUMERIC(7, 2) NOT NULL,
    breakdown_pressure_mpa NUMERIC(5, 2) NOT NULL,
    instantaneous_shut_in_pressure_mpa NUMERIC(5, 2) NOT NULL,
    proppant_injected_tons NUMERIC(7, 2) NOT NULL,
    stimulated_reservoir_volume_m3 NUMERIC(10, 2) NOT NULL,
    hydraulic_conductivity_d_m NUMERIC(6, 3) NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'CIRCULATING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Well Actions & Safety Override Audit Log
CREATE TABLE IF NOT EXISTS well_actions_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    well_id UUID REFERENCES wells(id) ON DELETE SET NULL,
    action_type VARCHAR(64) NOT NULL,
    initiated_by VARCHAR(64) NOT NULL,
    authorization_tier VARCHAR(32) NOT NULL,
    parameters JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    new_state JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'COMPLETED',
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Plant Safety & BOP Containment Status
CREATE TABLE IF NOT EXISTS plant_safety_systems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_code VARCHAR(32) NOT NULL UNIQUE,
    bop_containment_active BOOLEAN NOT NULL DEFAULT FALSE,
    annular_seal_pressure_mpa NUMERIC(5, 2) NOT NULL,
    blind_shear_rams_armed BOOLEAN NOT NULL DEFAULT TRUE,
    choke_manifold_aperture_pct NUMERIC(5, 2) NOT NULL DEFAULT 82.5,
    acoustic_trip_threshold_mw NUMERIC(4, 2) NOT NULL DEFAULT 1.5,
    hydrogen_sulfide_ppm NUMERIC(5, 2) NOT NULL DEFAULT 0.12,
    emergency_diverter_line_ready BOOLEAN NOT NULL DEFAULT TRUE,
    last_safety_interlock_check TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_wells_type_status ON wells(well_type, status);
CREATE INDEX IF NOT EXISTS idx_telemetry_well_id_recorded_at ON telemetry_logs(well_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_microseismic_depth_time ON microseismic_events(depth_meters, detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_microseismic_magnitude ON microseismic_events(magnitude_mw DESC);
CREATE INDEX IF NOT EXISTS idx_hydrofracture_well ON hydrofracture_stages(well_id);
CREATE INDEX IF NOT EXISTS idx_actions_audit_well ON well_actions_audit(well_id, executed_at DESC);

-- Explicit Row Level Security (RLS) Enablement
ALTER TABLE wells ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE microseismic_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE turbine_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE hydrofracture_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE well_actions_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE plant_safety_systems ENABLE ROW LEVEL SECURITY;

-- Read and Write Policies
CREATE POLICY "Public Read Access for Wells" ON wells FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Telemetry Logs" ON telemetry_logs FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Microseismic Events" ON microseismic_events FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Turbine Stages" ON turbine_stages FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Hydrofracture Stages" ON hydrofracture_stages FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Actions Audit" ON well_actions_audit FOR SELECT USING (true);
CREATE POLICY "Public Read Access for Plant Safety" ON plant_safety_systems FOR SELECT USING (true);

CREATE POLICY "Service Role All Access Wells" ON wells FOR ALL USING (true);
CREATE POLICY "Service Role All Access Telemetry" ON telemetry_logs FOR ALL USING (true);
CREATE POLICY "Service Role All Access Microseismic" ON microseismic_events FOR ALL USING (true);
CREATE POLICY "Service Role All Access Turbines" ON turbine_stages FOR ALL USING (true);
CREATE POLICY "Service Role All Access Hydrofracture" ON hydrofracture_stages FOR ALL USING (true);
CREATE POLICY "Service Role All Access Actions Audit" ON well_actions_audit FOR ALL USING (true);
CREATE POLICY "Service Role All Access Plant Safety" ON plant_safety_systems FOR ALL USING (true);
