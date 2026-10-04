-- ============================================================================
-- COMMONWEALTH TOKAMAK ALLIANCE // ARC-02 HIGH-FIELD MAGNETIC CONFINEMENT DECK
-- Database Architecture: PostgreSQL / Supabase Real-Time Confinement Schema
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tokamak Experimental Shots & Confinement Regimes
CREATE TABLE IF NOT EXISTS tokamak_shots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shot_number BIGINT UNIQUE NOT NULL,
    campaign_code TEXT NOT NULL,
    target_plasma_current_ma NUMERIC(5, 2) NOT NULL,
    target_toroidal_field_t NUMERIC(5, 2) NOT NULL,
    auxiliary_power_mw NUMERIC(5, 2) NOT NULL,
    pulse_duration_seconds NUMERIC(6, 2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('PLANNED', 'ARMED', 'RAMP_UP', 'FLAT_TOP', 'RAMP_DOWN', 'COMPLETED', 'QUENCHED', 'ABORTED')),
    confinement_mode TEXT NOT NULL DEFAULT 'H_MODE' CHECK (confinement_mode IN ('L_MODE', 'H_MODE', 'I_MODE', 'ADVANCED_TOKAMAK')),
    peak_core_temp_kev NUMERIC(5, 2),
    fusion_gain_q NUMERIC(5, 2),
    neutron_yield_total NUMERIC(24, 4),
    operator_callsign TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Real-Time Magnetic Equilibrium Snapshots (EFIT Reconstruction)
CREATE TABLE IF NOT EXISTS magnetic_equilibrium_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shot_id UUID NOT NULL REFERENCES tokamak_shots(id) ON DELETE CASCADE,
    time_offset_ms INTEGER NOT NULL,
    plasma_current_ma NUMERIC(5, 2) NOT NULL,
    toroidal_field_t NUMERIC(5, 2) NOT NULL,
    major_radius_r0_m NUMERIC(4, 3) NOT NULL,
    minor_radius_a_m NUMERIC(4, 3) NOT NULL,
    elongation_kappa NUMERIC(4, 2) NOT NULL,
    triangularity_delta NUMERIC(4, 2) NOT NULL,
    safety_factor_q95 NUMERIC(4, 2) NOT NULL,
    normalized_beta_bn NUMERIC(4, 2) NOT NULL,
    greenwald_fraction NUMERIC(4, 3) NOT NULL,
    poloidal_flux_psi_axis NUMERIC(6, 3) NOT NULL,
    shafranov_shift_cm NUMERIC(4, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Divertor Target Plates & Exhaust Heat Flux Telemetry
CREATE TABLE IF NOT EXISTS divertor_target_plates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tile_code TEXT UNIQUE NOT NULL,
    toroidal_sector INTEGER NOT NULL,
    poloidal_zone TEXT NOT NULL CHECK (poloidal_zone IN ('UPPER_OUTER', 'UPPER_INNER', 'DOME', 'LOWER_INNER', 'LOWER_OUTER')),
    material TEXT NOT NULL DEFAULT 'TUNGSTEN_MONOBLOCK',
    max_tolerable_heat_flux_mwm2 NUMERIC(4, 1) NOT NULL DEFAULT 15.0,
    current_heat_flux_mwm2 NUMERIC(4, 2) NOT NULL,
    surface_temp_c NUMERIC(6, 1) NOT NULL,
    electron_density_10e20_m3 NUMERIC(5, 2) NOT NULL,
    electron_temp_ev NUMERIC(5, 1) NOT NULL,
    coolant_mass_flow_kgs NUMERIC(5, 2) NOT NULL,
    thermal_warning_level TEXT NOT NULL CHECK (thermal_warning_level IN ('NOMINAL', 'ELEVATED', 'CRITICAL', 'INTERLOCK_TRIP')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Auxiliary Heating Systems (NBI, ECRH Gyrotrons, ICRH Antennas)
CREATE TABLE IF NOT EXISTS auxiliary_heating_systems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subsystem_code TEXT UNIQUE NOT NULL,
    subsystem_type TEXT NOT NULL CHECK (subsystem_type IN ('NBI', 'ECRH', 'ICRH', 'LHCD')),
    target_power_mw NUMERIC(5, 2) NOT NULL,
    actual_power_mw NUMERIC(5, 2) NOT NULL,
    operational_frequency_ghz NUMERIC(6, 2),
    acceleration_voltage_kv NUMERIC(6, 2),
    injection_pitch_deg NUMERIC(4, 1),
    cooling_circuit_status TEXT NOT NULL CHECK (cooling_circuit_status IN ('NOMINAL', 'DEGRADED', 'FAULT', 'OFFLINE')),
    is_interlocked BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. High-Temperature Superconducting (HTS) Magnet Cryogenics & Quench Protection
CREATE TABLE IF NOT EXISTS hts_cryogenic_monitoring (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    coil_identifier TEXT UNIQUE NOT NULL,
    coil_family TEXT NOT NULL CHECK (coil_family IN ('TOROIDAL_FIELD', 'POLOIDAL_FIELD', 'CENTRAL_SOLENOID', 'CORRECTION_COIL')),
    inlet_temp_k NUMERIC(5, 2) NOT NULL,
    outlet_temp_k NUMERIC(5, 2) NOT NULL,
    superconducting_tape TEXT NOT NULL DEFAULT 'REBCO_YBCO_HIGH_FIELD',
    current_feed_ka NUMERIC(6, 2) NOT NULL,
    quench_bridge_voltage_microvolts NUMERIC(8, 2) NOT NULL,
    quench_protection_armed BOOLEAN NOT NULL DEFAULT true,
    cryostat_vacuum_mbar NUMERIC(14, 10) NOT NULL,
    lorentz_stress_mpa NUMERIC(6, 1) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('SUPERCONDUCTING', 'QUENCH_WARNING', 'THERMAL_RUNAWAY', 'DUMP_ENGAGED')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Plasma Actuator & Control Injections Ledger
CREATE TABLE IF NOT EXISTS plasma_actuator_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shot_id UUID REFERENCES tokamak_shots(id) ON DELETE CASCADE,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
    actuator_type TEXT NOT NULL CHECK (actuator_type IN ('ARGON_PUFF', 'PELLET_INJECTION', 'SOLENOID_RAMP', 'CRYO_PUMP_CYCLE', 'RMP_ELM_COILS', 'MAGNETIC_SWEEP')),
    dosage_or_magnitude TEXT NOT NULL,
    operator_or_system TEXT NOT NULL,
    system_response_latency_ms INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'EXECUTED',
    notes TEXT
);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_tokamak_shots_status ON tokamak_shots(status);
CREATE INDEX IF NOT EXISTS idx_tokamak_shots_shot_number ON tokamak_shots(shot_number);
CREATE INDEX IF NOT EXISTS idx_magnetic_eq_shot_id ON magnetic_equilibrium_snapshots(shot_id);
CREATE INDEX IF NOT EXISTS idx_magnetic_eq_time ON magnetic_equilibrium_snapshots(shot_id, time_offset_ms);
CREATE INDEX IF NOT EXISTS idx_divertor_plates_zone ON divertor_target_plates(poloidal_zone);
CREATE INDEX IF NOT EXISTS idx_divertor_plates_warning ON divertor_target_plates(thermal_warning_level);
CREATE INDEX IF NOT EXISTS idx_aux_heating_type ON auxiliary_heating_systems(subsystem_type);
CREATE INDEX IF NOT EXISTS idx_hts_cryo_status ON hts_cryogenic_monitoring(status);
CREATE INDEX IF NOT EXISTS idx_hts_cryo_family ON hts_cryogenic_monitoring(coil_family);
CREATE INDEX IF NOT EXISTS idx_actuator_events_shot_time ON plasma_actuator_events(shot_id, timestamp);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
ALTER TABLE tokamak_shots ENABLE ROW LEVEL SECURITY;
ALTER TABLE magnetic_equilibrium_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE divertor_target_plates ENABLE ROW LEVEL SECURITY;
ALTER TABLE auxiliary_heating_systems ENABLE ROW LEVEL SECURITY;
ALTER TABLE hts_cryogenic_monitoring ENABLE ROW LEVEL SECURITY;
ALTER TABLE plasma_actuator_events ENABLE ROW LEVEL SECURITY;

-- Institutional Confinement Deck Access Policies (Read/Write for authenticated operators)
CREATE POLICY "Authenticated operators can view tokamak shot logs"
    ON tokamak_shots FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Control systems can insert/update tokamak shots"
    ON tokamak_shots FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated operators can view equilibrium snapshots"
    ON magnetic_equilibrium_snapshots FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Real-time EFIT engine can record equilibrium snapshots"
    ON magnetic_equilibrium_snapshots FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated operators can view divertor target plates"
    ON divertor_target_plates FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Divertor protection loop can update target plate metrics"
    ON divertor_target_plates FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated operators can view auxiliary heating diagnostics"
    ON auxiliary_heating_systems FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Auxiliary power controllers can update diagnostics"
    ON auxiliary_heating_systems FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated operators can view cryogenic HTS monitoring"
    ON hts_cryogenic_monitoring FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Cryogenic DCS can update magnet status"
    ON hts_cryogenic_monitoring FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated operators can view plasma actuator events"
    ON plasma_actuator_events FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Operator deck can record actuator events"
    ON plasma_actuator_events FOR INSERT
    TO authenticated
    WITH CHECK (true);
