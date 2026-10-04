-- ====================================================================
-- SHACKLETON POLAR CATAPULT // E-LAUNCH MASS DRIVER TRACK 01
-- PostgreSQL / Supabase Institutional Seed Data
-- ====================================================================

-- 1. Facility Setup
INSERT INTO mass_driver_facilities (
    id, facility_code, facility_name, track_length_meters, stator_stages_count,
    lunar_coordinates, nominal_exit_velocity_ms, max_capacitor_energy_mj, operational_status
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'SPC-TRACK-01',
    'Shackleton Polar Catapult // E-Launch Mass Driver Track 01',
    1200.00,
    120,
    '89.9000° S, 0.0000° E (Shackleton Rim Connecting Ridge)',
    1682.40,
    420.00,
    'OPERATIONAL'
) ON CONFLICT (facility_code) DO NOTHING;

-- 2. Payload Manifest (LOAD-REG-01 to LOAD-REG-10)
INSERT INTO payload_manifest (
    id, facility_id, canister_code, payload_type, mass_kg,
    orbital_destination, launch_azimuth_deg, apoapsis_target_km,
    target_velocity_ms, release_accuracy_ms, bucket_recapture_status,
    launch_status, scheduled_launch_at, actual_launch_at
) VALUES
(
    'b1000001-0000-0000-0000-000000000001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-01',
    'Sintered Iron Regolith Armor Tiles',
    250.00,
    'Earth Transfer Trajectory',
    045.20,
    384400.00,
    1682.40,
    0.012,
    'RECAPTURED',
    'INJECTED',
    TIMESTAMPTZ '2026-10-04 01:15:00.000000Z',
    TIMESTAMPTZ '2026-10-04 01:15:00.412891Z'
),
(
    'b1000001-0000-0000-0000-000000000002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-02',
    'Purified Lunar Volatile Water-Ice Cylinders',
    250.00,
    'Low Lunar Orbit Depot',
    090.00,
    100.00,
    1678.80,
    0.009,
    'RECAPTURED',
    'INJECTED',
    TIMESTAMPTZ '2026-10-04 01:22:30.000000Z',
    TIMESTAMPTZ '2026-10-04 01:22:30.220194Z'
),
(
    'b1000001-0000-0000-0000-000000000003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-03',
    'Refined Ilmenite / High-Titanium Feedstock',
    250.00,
    'L2 Lagrange Transfer',
    182.40,
    64500.00,
    1684.10,
    0.015,
    'RECAPTURED',
    'INJECTED',
    TIMESTAMPTZ '2026-10-04 01:30:00.000000Z',
    TIMESTAMPTZ '2026-10-04 01:30:00.384012Z'
),
(
    'b1000001-0000-0000-0000-000000000004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-04',
    'Anorthosite Lunar Glass Structural Rods',
    250.00,
    'Low Lunar Orbit Depot',
    090.00,
    100.00,
    1678.80,
    0.011,
    'RECAPTURED',
    'INJECTED',
    TIMESTAMPTZ '2026-10-04 01:37:30.000000Z',
    TIMESTAMPTZ '2026-10-04 01:37:30.401923Z'
),
(
    'b1000001-0000-0000-0000-000000000005',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-05',
    'Cryogenic Liquid Oxygen Pressure Sphere',
    250.00,
    'L2 Lagrange Transfer',
    182.40,
    64500.00,
    1684.10,
    0.014,
    'RECAPTURED',
    'INJECTED',
    TIMESTAMPTZ '2026-10-04 01:45:00.000000Z',
    TIMESTAMPTZ '2026-10-04 01:45:00.198334Z'
),
(
    'b1000001-0000-0000-0000-000000000006',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-06',
    'Solid State Silicon Monoxide Crystals',
    250.00,
    'Earth Transfer Trajectory',
    045.20,
    384400.00,
    1682.40,
    0.008,
    'READY',
    'PRIMED',
    TIMESTAMPTZ '2026-10-04 02:45:00.000000Z',
    NULL
),
(
    'b1000001-0000-0000-0000-000000000007',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-07',
    'Sintered Regolith Habitat Bulkheads',
    250.00,
    'Low Lunar Orbit Depot',
    090.00,
    100.00,
    1678.80,
    0.016,
    'READY',
    'QUEUED',
    TIMESTAMPTZ '2026-10-04 02:45:45.000000Z',
    NULL
),
(
    'b1000001-0000-0000-0000-000000000008',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-08',
    'Refined Rare Earth Metallurgical Ingots',
    250.00,
    'Earth Transfer Trajectory',
    045.20,
    384400.00,
    1682.40,
    0.010,
    'READY',
    'QUEUED',
    TIMESTAMPTZ '2026-10-04 02:46:30.000000Z',
    NULL
),
(
    'b1000001-0000-0000-0000-000000000009',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-09',
    'Degassed Helium-3 Extraction Mineral Sand',
    250.00,
    'Earth Transfer Trajectory',
    045.20,
    384400.00,
    1682.40,
    0.013,
    'READY',
    'QUEUED',
    TIMESTAMPTZ '2026-10-04 02:47:15.000000Z',
    NULL
),
(
    'b1000001-0000-0000-0000-000000000010',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'LOAD-REG-10',
    'Cast Basalt Magnetic Flywheel Rotors',
    250.00,
    'L2 Lagrange Transfer',
    182.40,
    64500.00,
    1684.10,
    0.011,
    'READY',
    'QUEUED',
    TIMESTAMPTZ '2026-10-04 02:48:00.000000Z',
    NULL
) ON CONFLICT (canister_code) DO NOTHING;

-- 3. Stator Coil Stage Diagnostics (Sample of critical checkpoints across 1,200m track)
INSERT INTO stator_coil_stages (
    facility_id, stage_index, track_position_meters, pulse_delay_microseconds,
    coil_peak_current_ka, magnetic_flux_density_tesla, cryo_temp_k, switching_jitter_ns, health_status
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 1, 10.00, 0, 78.40, 14.20, 4.180, 0.9, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 15, 150.00, 1420, 81.20, 15.60, 4.195, 1.1, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 30, 300.00, 2210, 83.10, 16.40, 4.201, 1.0, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 45, 450.00, 2840, 84.00, 16.80, 4.205, 1.3, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 60, 600.00, 3350, 84.50, 17.10, 4.210, 1.2, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 75, 750.00, 3790, 84.50, 17.15, 4.208, 0.8, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 90, 900.00, 4170, 84.40, 17.10, 4.215, 1.4, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 105, 1050.00, 4510, 84.20, 17.05, 4.220, 1.1, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 115, 1150.00, 4720, 83.90, 16.90, 4.225, 0.9, 'NOMINAL'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 120, 1200.00, 4830, 82.50, 16.20, 4.230, 1.0, 'NOMINAL')
ON CONFLICT (facility_id, stage_index) DO NOTHING;

-- 4. High-Precision Historical Telemetry Snapshots
INSERT INTO telemetry_snapshots (
    facility_id, timestamp_utc, exit_velocity_ms, stator_peak_current_ka,
    capacitor_bank_energy_mj, capacitor_charge_percent, launch_cadence_seconds,
    barrel_cryo_temp_k, levitation_gap_mm, pfn_discharge_voltage_kv,
    hts_resistance_microohms, cryocooler_delta_p_kpa, eddy_thermal_dissipation_kw
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:40:00.123456Z', 1682.384, 84.48, 419.80, 98.15, 45, 4.198, 4.51, 24.98, 0.0000, 142.30, 18.20),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:40:15.654321Z', 1682.410, 84.52, 420.10, 98.22, 45, 4.200, 4.50, 25.01, 0.0000, 142.45, 18.35),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:40:30.987654Z', 1682.395, 84.50, 420.00, 98.20, 45, 4.202, 4.49, 25.00, 0.0000, 142.50, 18.40),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:40:45.112233Z', 1682.405, 84.51, 420.05, 98.21, 45, 4.201, 4.50, 25.00, 0.0000, 142.48, 18.38),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:41:00.445566Z', 1682.420, 84.53, 420.12, 98.24, 45, 4.199, 4.52, 25.02, 0.0000, 142.52, 18.42),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:41:15.778899Z', 1682.390, 84.49, 419.95, 98.18, 45, 4.203, 4.48, 24.99, 0.0000, 142.55, 18.45),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:41:30.001122Z', 1682.415, 84.52, 420.08, 98.23, 45, 4.200, 4.50, 25.00, 0.0000, 142.50, 18.39),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:41:45.334455Z', 1682.400, 84.50, 420.00, 98.20, 45, 4.198, 4.50, 25.00, 0.0000, 142.40, 18.30),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:42:00.667788Z', 1682.408, 84.51, 420.04, 98.22, 45, 4.201, 4.51, 25.01, 0.0000, 142.49, 18.37),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', TIMESTAMPTZ '2026-10-04 02:42:15.998877Z', 1682.402, 84.50, 420.02, 98.21, 45, 4.200, 4.50, 25.00, 0.0000, 142.50, 18.40);

-- 5. Firing Cycles Historical Verification
INSERT INTO firing_cycles (
    facility_id, payload_id, authorization_token, authorized_by_callsign,
    charging_cycle_duration_ms, peak_stator_current_ka, muzzle_exit_velocity_ms,
    velocity_dispersion_ms, optical_trigger_sync_ns, trajectory_status,
    bucket_arrested_safely, cycle_timestamp
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1000001-0000-0000-0000-000000000001', 'AUTH-SPC-9921-ALPHA', 'DIR-A.VANCE', 42800, 84.45, 1682.388, 0.012, 12, 'INJECTED', true, TIMESTAMPTZ '2026-10-04 01:15:00.412891Z'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1000001-0000-0000-0000-000000000002', 'AUTH-SPC-9922-BRAVO', 'DIR-A.VANCE', 43100, 84.48, 1678.804, 0.009, 14, 'INJECTED', true, TIMESTAMPTZ '2026-10-04 01:22:30.220194Z'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1000001-0000-0000-0000-000000000003', 'AUTH-SPC-9923-CHARLIE', 'COM-T.REYES', 42950, 84.52, 1684.112, 0.015, 15, 'INJECTED', true, TIMESTAMPTZ '2026-10-04 01:30:00.384012Z'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1000001-0000-0000-0000-000000000004', 'AUTH-SPC-9924-DELTA', 'COM-T.REYES', 43050, 84.50, 1678.796, 0.011, 13, 'INJECTED', true, TIMESTAMPTZ '2026-10-04 01:37:30.401923Z'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b1000001-0000-0000-0000-000000000005', 'AUTH-SPC-9925-ECHO', 'DIR-A.VANCE', 42900, 84.53, 1684.095, 0.014, 16, 'INJECTED', true, TIMESTAMPTZ '2026-10-04 01:45:00.198334Z');

-- 6. System Interlocks & Alerts Log
INSERT INTO system_interlocks_and_alerts (
    facility_id, severity, subsystem, alert_code, headline, details, is_active
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Superconducting Stator Cryo Loop', 'CRYO-L01-STABLE', 'Closed-loop 4.2K liquid helium bath nominal', 'Compressor suction 1.2 bar, return temperature 4.195K. Zero boil-off reliquefier active.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Magnetic Levitation Track', 'MAG-LEV-ALIGNED', 'Halbach array 4.50mm airgap balanced across 120 stages', 'Active eddy-current sensors reporting standard deviation under 0.04mm.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ADVISORY', 'PFN Capacitor Banks', 'PFN-CHG-PRIME', 'Bank 04 Marx charging phase 98.2% primed', 'Voltage steady at 25.01 kV. Thyratron switches pre-warmed for synchronized pulse.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Optical Muzzle Gates', 'OPT-GATE-SYNC', 'Femtosecond laser curtain synchronized at 1,198m release datum', 'Bucket release servo latency calibrated at 14 nanoseconds.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Bucket Arrestor Net & Recapture', 'DECEL-NET-READY', 'Electromagnetic eddy deceleration brake primed in recovery loop', 'Reverse-flux deceleration buckets cleared of regolith particulate.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'ADVISORY', 'Vacuum Bore Environment', 'BORE-VAC-NOMINAL', 'Track vacuum pressure 1.2 x 10^-11 Torr', 'Ultra-high vacuum maintained by cryogenic sorption cryopumping walls.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WARNING', 'Solar Power Relay Station 02', 'SOL-GRID-FLUCT', 'Microwave power beaming receiver phase variance 0.4%', 'Compensating via underground superconducting flywheel battery bank B.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Telemetry Uplink', 'UPLINK-LOCK-EARTH', 'Deep Space Laser Optical Uplink synchronized to Goldstone and White Sands', 'Sub-millisecond packet jitter 0.08 ms.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Ground Seismic Sensors', 'SEISMIC-QUIET', 'Shackleton Crater rim seismic vibration under 0.002 gal', 'Zero thermal expansion displacement detected along bedrock pylons.', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'NOMINAL', 'Safety Interlock Status', 'SAFETY-GREEN', 'All 120 stator blast shields and magnetic dump contactors armed', 'No active emergency abort dump flags raised.', false);
