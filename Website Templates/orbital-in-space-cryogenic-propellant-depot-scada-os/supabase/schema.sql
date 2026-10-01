-- ============================================================================
-- Orbital In-Space Cryogenic Propellant Depot SCADA OS - Supabase DDL Schema
-- Architecture: Zero-Boil-Off (ZBO) Methalox Refueling Node • LEO 450 km
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Depot Stations Table
CREATE TABLE IF NOT EXISTS depot_stations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_callsign VARCHAR(64) NOT NULL UNIQUE,
    orbital_regime VARCHAR(64) NOT NULL DEFAULT 'LEO 450 km Circular',
    inclination_deg NUMERIC(5,2) NOT NULL DEFAULT 28.50,
    semi_major_axis_km NUMERIC(8,2) NOT NULL DEFAULT 6828.14,
    eccentricity NUMERIC(6,5) NOT NULL DEFAULT 0.00012,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'AUTONOMOUS_NOMINAL',
    primary_docking_port_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE_CHASER_DOCKED',
    active_power_kw NUMERIC(6,2) NOT NULL DEFAULT 28.40,
    solar_aspect_angle_deg NUMERIC(5,2) NOT NULL DEFAULT 42.00,
    sun_shield_deploy_state VARCHAR(32) NOT NULL DEFAULT 'OPTIMAL_SHADOWED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Cryogenic Propellant Tanks Table
CREATE TABLE IF NOT EXISTS cryo_tanks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES depot_stations(id) ON DELETE CASCADE,
    tank_code VARCHAR(32) NOT NULL,
    fluid_type VARCHAR(16) NOT NULL, -- 'LOX' or 'LCH4'
    capacity_tonnes NUMERIC(6,2) NOT NULL,
    current_mass_tonnes NUMERIC(6,2) NOT NULL,
    fill_fraction_pct NUMERIC(5,2) NOT NULL,
    ullage_pressure_kpa NUMERIC(6,2) NOT NULL,
    liquid_temp_k NUMERIC(5,2) NOT NULL,
    ullage_temp_k NUMERIC(5,2) NOT NULL,
    boil_off_rate_kg_hr NUMERIC(6,3) NOT NULL,
    vacuum_jacket_torr NUMERIC(10,8) NOT NULL,
    mli_layer_count INTEGER NOT NULL DEFAULT 60,
    vent_valve_status VARCHAR(32) NOT NULL DEFAULT 'CLOSED_AUTO',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Thermodynamic Vent System & Cryocooler Subsystems
CREATE TABLE IF NOT EXISTS cryo_cooling_loops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES depot_stations(id) ON DELETE CASCADE,
    subsystem_tag VARCHAR(64) NOT NULL,
    cooling_cycle_type VARCHAR(64) NOT NULL DEFAULT '20K_PULSE_TUBE_BRAYTON',
    cryocooler_power_kw NUMERIC(5,2) NOT NULL DEFAULT 4.20,
    coldhead_temp_k NUMERIC(5,2) NOT NULL DEFAULT 20.40,
    heat_exchanger_delta_t_k NUMERIC(4,2) NOT NULL DEFAULT 1.40,
    jt_expansion_valve_pct NUMERIC(5,2) NOT NULL DEFAULT 38.50,
    tvs_spray_pump_status VARCHAR(32) NOT NULL DEFAULT 'RUNNING',
    reliquefaction_rpm INTEGER NOT NULL DEFAULT 18400,
    compressor_shaft_power_kw NUMERIC(5,2) NOT NULL DEFAULT 4.20,
    settlement_stability_index NUMERIC(5,2) NOT NULL DEFAULT 99.20,
    qd_cryo_seal_temp_k NUMERIC(5,2) NOT NULL DEFAULT 92.00,
    helium_purge_active BOOLEAN NOT NULL DEFAULT FALSE,
    qd_leak_rate_sccm NUMERIC(6,4) NOT NULL DEFAULT 0.0084,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Propellant Transfer Operations Log
CREATE TABLE IF NOT EXISTS propellant_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES depot_stations(id) ON DELETE CASCADE,
    chaser_vehicle_id VARCHAR(64) NOT NULL,
    docking_port_number INTEGER NOT NULL DEFAULT 2,
    propellant_type VARCHAR(16) NOT NULL, -- 'LOX', 'LCH4', 'METHALOX_DUAL'
    planned_mass_tonnes NUMERIC(6,2) NOT NULL,
    transferred_mass_tonnes NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    transfer_rate_kg_min NUMERIC(6,2) NOT NULL DEFAULT 0.00,
    chilldown_stage VARCHAR(64) NOT NULL DEFAULT 'IDLE',
    isolation_valve_state VARCHAR(32) NOT NULL DEFAULT 'ARMED',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Telemetry Time-Series Snaps
CREATE TABLE IF NOT EXISTS telemetry_snaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    station_id UUID NOT NULL REFERENCES depot_stations(id) ON DELETE CASCADE,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lox_pressure_kpa NUMERIC(6,2) NOT NULL,
    lch4_pressure_kpa NUMERIC(6,2) NOT NULL,
    lox_temp_k NUMERIC(5,2) NOT NULL,
    lch4_temp_k NUMERIC(5,2) NOT NULL,
    solar_flux_w_m2 NUMERIC(7,2) NOT NULL,
    sun_aspect_angle_deg NUMERIC(5,2) NOT NULL,
    boil_off_margin_pct NUMERIC(5,2) NOT NULL,
    rcs_settling_accel_g NUMERIC(6,4) NOT NULL,
    log_severity VARCHAR(16) NOT NULL DEFAULT 'NOMINAL',
    audit_notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cryo_tanks_station ON cryo_tanks(station_id);
CREATE INDEX IF NOT EXISTS idx_cooling_loops_station ON cryo_cooling_loops(station_id);
CREATE INDEX IF NOT EXISTS idx_transfers_station ON propellant_transfers(station_id);
CREATE INDEX IF NOT EXISTS idx_telemetry_station_time ON telemetry_snaps(station_id, recorded_at DESC);

-- Explicit Row Level Security (RLS) Enablement
ALTER TABLE depot_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE cryo_tanks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cryo_cooling_loops ENABLE ROW LEVEL SECURITY;
ALTER TABLE propellant_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_snaps ENABLE ROW LEVEL SECURITY;

-- Default permissive read-access policy for institutional SCADA operators
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_stations') THEN
        CREATE POLICY allow_authenticated_read_stations ON depot_stations FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_tanks') THEN
        CREATE POLICY allow_authenticated_read_tanks ON cryo_tanks FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_loops') THEN
        CREATE POLICY allow_authenticated_read_loops ON cryo_cooling_loops FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_transfers') THEN
        CREATE POLICY allow_authenticated_read_transfers ON propellant_transfers FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'allow_authenticated_read_telemetry') THEN
        CREATE POLICY allow_authenticated_read_telemetry ON telemetry_snaps FOR SELECT USING (true);
    END IF;
END $$;
