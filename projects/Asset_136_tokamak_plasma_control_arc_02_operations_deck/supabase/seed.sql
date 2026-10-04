-- ============================================================================
-- COMMONWEALTH TOKAMAK ALLIANCE // ARC-02 HIGH-FIELD MAGNETIC CONFINEMENT DECK
-- Seed Data: Baseline Operational Telemetry & Equilibrium Artifacts
-- ============================================================================

-- 1. Insert Tokamak Shots (Historical & Active Burning Plasma Runs)
INSERT INTO tokamak_shots (
    id,
    shot_number,
    campaign_code,
    target_plasma_current_ma,
    target_toroidal_field_t,
    auxiliary_power_mw,
    pulse_duration_seconds,
    status,
    confinement_mode,
    peak_core_temp_kev,
    fusion_gain_q,
    neutron_yield_total,
    operator_callsign,
    created_at
) VALUES 
('a0000000-0000-0000-0000-000000000001', 4088, 'ARC-Q10-CAMPAIGN-IV', 12.00, 10.50, 25.00, 20.00, 'COMPLETED', 'L_MODE', 8.20, 1.85, 2.4500e19, 'PHYS-VASQUEZ', now() - INTERVAL '3 hours'),
('a0000000-0000-0000-0000-000000000002', 4089, 'ARC-Q10-CAMPAIGN-IV', 13.50, 11.20, 30.00, 35.00, 'COMPLETED', 'H_MODE', 10.40, 4.20, 8.1200e19, 'PHYS-CHEN', now() - INTERVAL '2 hours'),
('a0000000-0000-0000-0000-000000000003', 4090, 'ARC-Q10-CAMPAIGN-IV', 14.80, 12.00, 38.00, 45.00, 'COMPLETED', 'H_MODE', 11.80, 8.60, 1.4200e20, 'PHYS-THORNE', now() - INTERVAL '1 hour'),
('a0000000-0000-0000-0000-000000000004', 4091, 'ARC-Q10-CAMPAIGN-IV', 15.00, 12.20, 42.00, 50.00, 'COMPLETED', 'H_MODE', 12.10, 9.80, 1.6800e20, 'PHYS-OKONKWO', now() - INTERVAL '30 minutes'),
('a0000000-0000-0000-0000-000000000005', 4092, 'ARC-Q10-CAMPAIGN-IV', 15.20, 12.40, 45.00, 60.00, 'FLAT_TOP', 'H_MODE', 12.30, 11.40, 1.8420e20, 'PHYS-VASQUEZ', now())
ON CONFLICT (shot_number) DO NOTHING;

-- 2. Divertor Target Plates (Tungsten Armor Monoblocks DIV-UPPER and DIV-LOWER)
INSERT INTO divertor_target_plates (
    tile_code,
    toroidal_sector,
    poloidal_zone,
    material,
    max_tolerable_heat_flux_mwm2,
    current_heat_flux_mwm2,
    surface_temp_c,
    electron_density_10e20_m3,
    electron_temp_ev,
    coolant_mass_flow_kgs,
    thermal_warning_level,
    updated_at
) VALUES 
('DIV-UPPER-01', 1, 'UPPER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 4.22, 420.5, 1.15, 24.2, 14.80, 'NOMINAL', now()),
('DIV-UPPER-02', 2, 'UPPER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 4.65, 438.0, 1.20, 25.0, 14.80, 'NOMINAL', now()),
('DIV-UPPER-03', 3, 'UPPER_INNER', 'TUNGSTEN_MONOBLOCK', 15.0, 3.80, 395.2, 0.95, 19.8, 14.50, 'NOMINAL', now()),
('DIV-UPPER-04', 4, 'UPPER_INNER', 'TUNGSTEN_MONOBLOCK', 15.0, 3.94, 402.1, 0.98, 20.4, 14.50, 'NOMINAL', now()),
('DIV-LOWER-01', 1, 'LOWER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 9.85, 785.4, 3.82, 38.6, 22.40, 'ELEVATED', now()),
('DIV-LOWER-02', 2, 'LOWER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 10.42, 814.0, 4.10, 41.2, 22.40, 'ELEVATED', now()),
('DIV-LOWER-03', 3, 'LOWER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 11.18, 862.9, 4.45, 44.5, 23.10, 'CRITICAL', now()),
('DIV-LOWER-04', 4, 'LOWER_OUTER', 'TUNGSTEN_MONOBLOCK', 15.0, 10.85, 845.2, 4.28, 42.8, 22.80, 'ELEVATED', now()),
('DIV-LOWER-05', 1, 'DOME',        'TUNGSTEN_MONOBLOCK', 12.0, 2.15, 310.8, 0.65, 14.0, 12.00, 'NOMINAL', now()),
('DIV-LOWER-06', 2, 'DOME',        'TUNGSTEN_MONOBLOCK', 12.0, 2.30, 322.4, 0.70, 14.5, 12.00, 'NOMINAL', now()),
('DIV-LOWER-07', 3, 'LOWER_INNER', 'TUNGSTEN_MONOBLOCK', 15.0, 7.64, 650.1, 2.90, 31.5, 19.50, 'NOMINAL', now()),
('DIV-LOWER-08', 4, 'LOWER_INNER', 'TUNGSTEN_MONOBLOCK', 15.0, 7.82, 664.7, 3.02, 32.8, 19.50, 'NOMINAL', now())
ON CONFLICT (tile_code) DO UPDATE SET
    current_heat_flux_mwm2 = EXCLUDED.current_heat_flux_mwm2,
    surface_temp_c = EXCLUDED.surface_temp_c,
    updated_at = now();

-- 3. Auxiliary Heating Subsystems (NBI & ECRH Gyrotrons)
INSERT INTO auxiliary_heating_systems (
    subsystem_code,
    subsystem_type,
    target_power_mw,
    actual_power_mw,
    operational_frequency_ghz,
    acceleration_voltage_kv,
    injection_pitch_deg,
    cooling_circuit_status,
    is_interlocked,
    updated_at
) VALUES 
('NBI-BEAMLINE-01', 'NBI',  16.00, 15.82, NULL,   120.00, 22.5, 'NOMINAL', false, now()),
('NBI-BEAMLINE-02', 'NBI',  16.00, 15.74, NULL,   120.00, 24.0, 'NOMINAL', false, now()),
('ECRH-GYROTRON-01', 'ECRH', 4.00,  3.95, 170.00, NULL,   18.0, 'NOMINAL', false, now()),
('ECRH-GYROTRON-02', 'ECRH', 4.00,  3.98, 170.00, NULL,   18.0, 'NOMINAL', false, now()),
('ECRH-GYROTRON-03', 'ECRH', 4.00,  3.91, 170.00, NULL,   20.5, 'NOMINAL', false, now()),
('ECRH-GYROTRON-04', 'ECRH', 4.00,  4.02, 170.00, NULL,   20.5, 'NOMINAL', false, now()),
('ICRH-ANTENNA-01',  'ICRH', 3.00,  2.88, 0.055,  NULL,   0.0,  'NOMINAL', false, now()),
('ICRH-ANTENNA-02',  'ICRH', 3.00,  2.91, 0.055,  NULL,   0.0,  'NOMINAL', false, now())
ON CONFLICT (subsystem_code) DO UPDATE SET
    actual_power_mw = EXCLUDED.actual_power_mw,
    updated_at = now();

-- 4. High-Temperature Superconducting (HTS) Magnet Cryogenics
INSERT INTO hts_cryogenic_monitoring (
    coil_identifier,
    coil_family,
    inlet_temp_k,
    outlet_temp_k,
    superconducting_tape,
    current_feed_ka,
    quench_bridge_voltage_microvolts,
    quench_protection_armed,
    cryostat_vacuum_mbar,
    lorentz_stress_mpa,
    status,
    updated_at
) VALUES 
('TF-COIL-SECTOR-01', 'TOROIDAL_FIELD', 19.85, 20.42, 'REBCO_YBCO_HIGH_FIELD', 48.50, 1.42, true, 1.2e-8, 382.4, 'SUPERCONDUCTING', now()),
('TF-COIL-SECTOR-02', 'TOROIDAL_FIELD', 19.90, 20.48, 'REBCO_YBCO_HIGH_FIELD', 48.50, 1.38, true, 1.2e-8, 384.1, 'SUPERCONDUCTING', now()),
('TF-COIL-SECTOR-03', 'TOROIDAL_FIELD', 19.82, 20.39, 'REBCO_YBCO_HIGH_FIELD', 48.50, 1.45, true, 1.1e-8, 381.8, 'SUPERCONDUCTING', now()),
('TF-COIL-SECTOR-04', 'TOROIDAL_FIELD', 20.02, 20.65, 'REBCO_YBCO_HIGH_FIELD', 48.50, 1.82, true, 1.3e-8, 386.0, 'SUPERCONDUCTING', now()),
('PF-COIL-UPPER-01',  'POLOIDAL_FIELD', 19.65, 20.15, 'REBCO_YBCO_HIGH_FIELD', 32.20, 0.85, true, 1.2e-8, 245.0, 'SUPERCONDUCTING', now()),
('PF-COIL-LOWER-01',  'POLOIDAL_FIELD', 19.72, 20.24, 'REBCO_YBCO_HIGH_FIELD', 34.60, 0.92, true, 1.2e-8, 258.5, 'SUPERCONDUCTING', now()),
('CS-STACK-MODULE-01','CENTRAL_SOLENOID', 19.45, 19.95, 'REBCO_YBCO_HIGH_FIELD', 42.00, 1.10, true, 1.0e-8, 412.3, 'SUPERCONDUCTING', now()),
('CS-STACK-MODULE-02','CENTRAL_SOLENOID', 19.50, 20.05, 'REBCO_YBCO_HIGH_FIELD', 42.00, 1.15, true, 1.0e-8, 415.7, 'SUPERCONDUCTING', now())
ON CONFLICT (coil_identifier) DO UPDATE SET
    inlet_temp_k = EXCLUDED.inlet_temp_k,
    outlet_temp_k = EXCLUDED.outlet_temp_k,
    updated_at = now();

-- 5. Magnetic Equilibrium Reconstruction Snapshots
INSERT INTO magnetic_equilibrium_snapshots (
    shot_id,
    time_offset_ms,
    plasma_current_ma,
    toroidal_field_t,
    major_radius_r0_m,
    minor_radius_a_m,
    elongation_kappa,
    triangularity_delta,
    safety_factor_q95,
    normalized_beta_bn,
    greenwald_fraction,
    poloidal_flux_psi_axis,
    shafranov_shift_cm,
    created_at
) VALUES 
('a0000000-0000-0000-0000-000000000005', 10000, 15.02, 12.35, 3.300, 1.120, 1.82, 0.44, 3.22, 2.38, 0.810, 48.200, 4.12, now() - INTERVAL '30 seconds'),
('a0000000-0000-0000-0000-000000000005', 20000, 15.15, 12.38, 3.302, 1.121, 1.84, 0.45, 3.18, 2.42, 0.825, 48.850, 4.25, now() - INTERVAL '20 seconds'),
('a0000000-0000-0000-0000-000000000005', 30000, 15.20, 12.40, 3.300, 1.122, 1.85, 0.46, 3.15, 2.45, 0.840, 49.120, 4.38, now() - INTERVAL '10 seconds'),
('a0000000-0000-0000-0000-000000000005', 40000, 15.21, 12.40, 3.301, 1.122, 1.85, 0.46, 3.14, 2.46, 0.842, 49.300, 4.40, now());

-- 6. Plasma Actuator Execution History
INSERT INTO plasma_actuator_events (
    shot_id,
    timestamp,
    actuator_type,
    dosage_or_magnitude,
    operator_or_system,
    system_response_latency_ms,
    status,
    notes
) VALUES 
('a0000000-0000-0000-0000-000000000005', now() - INTERVAL '40 seconds', 'SOLENOID_RAMP', '+0.25 V*s', 'AUTONOMOUS_FEEDBACK', 12, 'EXECUTED', 'Maintained flat-top Ip target at 15.2 MA'),
('a0000000-0000-0000-0000-000000000005', now() - INTERVAL '32 seconds', 'RMP_ELM_COILS', 'Phase 120 deg, 4.2 kA', 'FAST_MHD_CONTROLLER', 4, 'EXECUTED', 'Type-I ELM mitigation engaged, frequency lock at 60 Hz'),
('a0000000-0000-0000-0000-000000000005', now() - INTERVAL '22 seconds', 'ARGON_PUFF', '1.8 Pa*m3/s (Sector 4)', 'DIVERTOR_TEMP_GUARD', 18, 'EXECUTED', 'Radiative divertor mantle puff to mitigate peak heat flux'),
('a0000000-0000-0000-0000-000000000005', now() - INTERVAL '15 seconds', 'CRYO_PUMP_CYCLE', 'Valve Sector B 100% open', 'VACUUM_SYSTEM', 85, 'EXECUTED', 'Divertor neutral pressure stabilized at 1.4 Pa'),
('a0000000-0000-0000-0000-000000000005', now() - INTERVAL '5 seconds', 'ARGON_PUFF', '2.2 Pa*m3/s (Sector 2 & 4)', 'OPERATOR_MANUAL', 22, 'EXECUTED', 'Peak target plate temperature reduced from 920 C to 814 C');
