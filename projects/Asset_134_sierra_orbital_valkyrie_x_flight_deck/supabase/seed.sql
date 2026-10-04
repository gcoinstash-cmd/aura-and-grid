-- ==============================================================================
-- SIERRA-ORBITAL // VALKYRIE-X SUBORBITAL AEROSPIKE & RCS FLIGHT DECK
-- Institutional Seed Dataset (10+ Domain Rows per Operational Vector)
-- ==============================================================================

-- 1. Insert Valkyrie-X Spaceplane Prototype
INSERT INTO spaceplanes (
    id,
    tail_number,
    callsign,
    chassis_model,
    aerospike_model,
    dry_mass_kg,
    max_apogee_km,
    status,
    operational_hours
) VALUES (
    'e7d23a48-18e4-4d8b-90f7-119c5c2d3301',
    'SO-VX-04',
    'VALKYRIE-PRIME',
    'Sierra-Valkyrie Mk IV Lifting Body',
    'Aerojet-Rocketdyne Linear Dual-Ramp AR-X900',
    11450.00,
    118.50,
    'MISSION_ACTIVE',
    184.50
) ON CONFLICT (tail_number) DO UPDATE SET status = EXCLUDED.status;

-- 2. Insert Active Suborbital Mission
INSERT INTO missions (
    id,
    spaceplane_id,
    mission_code,
    mission_name,
    trajectory_profile,
    target_apogee_km,
    target_velocity_mach,
    flight_status,
    launch_time,
    commander_callsign,
    propulsion_lead_callsign
) VALUES (
    'f3b89012-74c1-45bc-8a29-ef0489912099',
    'e7d23a48-18e4-4d8b-90f7-119c5c2d3301',
    'VALK-SUB-09',
    'Operation Stratos Apex // Mesospheric High-Mach Verification',
    'SUBORBITAL_MESOSPHERIC_APOGEE_108K',
    108.50,
    5.40,
    'IN_FLIGHT_COAST',
    NOW() - INTERVAL '14 minutes',
    'CDR. V. Vance [CALLSIGN: HAWK-01]',
    'CHIEF PROP. DR. K. REYES'
) ON CONFLICT (mission_code) DO NOTHING;

-- 3. Insert All 16 RCS Thrusters (4 Quads x 4 Thrusters)
INSERT INTO rcs_thrusters (
    id,
    spaceplane_id,
    thruster_code,
    quad_position,
    orientation_axis,
    rated_thrust_n,
    chamber_pressure_nominal_bar,
    cumulative_pulse_count,
    valve_latency_ms,
    nozzle_temp_c,
    duty_cycle_pct,
    manifold_isolated,
    health_status
) VALUES
-- FORWARD QUAD (Nose pitch/yaw authority)
('00000000-0000-0000-0001-000000000001', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-F-01', 'QUAD-FWD-01', '-PITCH', 440.00, 14.50, 1240, 4.12, 138.40, 14.20, false, 'NOMINAL'),
('00000000-0000-0000-0001-000000000002', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-F-02', 'QUAD-FWD-01', '+PITCH', 440.00, 14.45, 1180, 4.15, 142.10, 13.80, false, 'NOMINAL'),
('00000000-0000-0000-0001-000000000003', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-F-03', 'QUAD-FWD-01', '-YAW',   440.00, 14.52, 890,  3.98, 115.60, 9.40,  false, 'NOMINAL'),
('00000000-0000-0000-0001-000000000004', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-F-04', 'QUAD-FWD-01', '+YAW',   440.00, 14.48, 915,  4.05, 118.20, 9.80,  false, 'NOMINAL'),

-- PORT WING QUAD (Roll & lateral sway authority)
('00000000-0000-0000-0002-000000000001', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-P-01', 'QUAD-PORT-02', '+ROLL',  440.00, 14.55, 670,  4.22, 94.30,  7.20,  false, 'NOMINAL'),
('00000000-0000-0000-0002-000000000002', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-P-02', 'QUAD-PORT-02', '-ROLL',  440.00, 14.50, 710,  4.20, 96.80,  7.60,  false, 'NOMINAL'),
('00000000-0000-0000-0002-000000000003', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-P-03', 'QUAD-PORT-02', '+SWAY',  440.00, 14.42, 420,  4.30, 81.50,  4.50,  false, 'NOMINAL'),
('00000000-0000-0000-0002-000000000004', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-P-04', 'QUAD-PORT-02', '-SWAY',  440.00, 14.49, 445,  4.26, 83.20,  4.80,  false, 'NOMINAL'),

-- STARBOARD WING QUAD (Roll & lateral sway authority)
('00000000-0000-0000-0003-000000000001', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-S-01', 'QUAD-STBD-03', '-ROLL',  440.00, 14.52, 690,  4.18, 95.10,  7.40,  false, 'NOMINAL'),
('00000000-0000-0000-0003-000000000002', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-S-02', 'QUAD-STBD-03', '+ROLL',  440.00, 14.51, 685,  4.20, 94.70,  7.30,  false, 'NOMINAL'),
('00000000-0000-0000-0003-000000000003', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-S-03', 'QUAD-STBD-03', '-SWAY',  440.00, 14.45, 410,  4.32, 80.80,  4.40,  false, 'NOMINAL'),
('00000000-0000-0000-0003-000000000004', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-S-04', 'QUAD-STBD-03', '+SWAY',  440.00, 14.47, 430,  4.28, 82.00,  4.60,  false, 'NOMINAL'),

-- AFT BASE QUAD (Yaw & retro vernier trim)
('00000000-0000-0000-0004-000000000001', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-A-01', 'QUAD-AFT-04', '-YAW',   440.00, 14.58, 1420, 3.92, 164.20, 16.40, false, 'NOMINAL'),
('00000000-0000-0000-0004-000000000002', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-A-02', 'QUAD-AFT-04', '+YAW',   440.00, 14.56, 1395, 3.95, 161.80, 16.10, false, 'NOMINAL'),
('00000000-0000-0000-0004-000000000003', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-A-03', 'QUAD-AFT-04', '+PITCH', 440.00, 14.49, 1050, 4.10, 132.50, 11.20, false, 'NOMINAL'),
('00000000-0000-0000-0004-000000000004', 'e7d23a48-18e4-4d8b-90f7-119c5c2d3301', 'RCS-A-04', 'QUAD-AFT-04', '-PITCH', 440.00, 14.51, 1080, 4.08, 134.10, 11.50, false, 'NOMINAL')
ON CONFLICT (spaceplane_id, thruster_code) DO NOTHING;

-- 4. Insert 10 Detailed Telemetry Logs (Ascent into Mesosphere)
INSERT INTO propulsion_telemetry_logs (
    mission_id,
    recorded_at,
    altitude_km,
    velocity_mps,
    velocity_mach,
    dynamic_pressure_q_kpa,
    aerospike_thrust_kn,
    aerospike_chamber_pressure_bar,
    turbopump_rpm,
    turbine_inlet_temp_k,
    he_bottle_pressure_bar,
    he_regulator_outlet_bar,
    mmh_tank_pressure_bar,
    nto_tank_pressure_bar,
    mmh_propellant_pct,
    nto_propellant_pct,
    pitch_rate_deg_s,
    roll_rate_deg_s,
    yaw_rate_deg_s,
    flight_phase
) VALUES
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '90 seconds', 72.100, 1620.00, 4.76, 6.45, 246.20, 89.40, 47920.00, 974.00, 354.20, 18.50, 18.22, 18.42, 85.60, 85.40, +0.120, -0.040, +0.010, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '80 seconds', 73.800, 1642.00, 4.82, 5.82, 245.90, 89.30, 47980.00, 976.00, 353.60, 18.50, 18.21, 18.41, 85.00, 84.80, +0.080, -0.020, -0.010, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '70 seconds', 75.400, 1665.00, 4.89, 5.15, 245.80, 89.25, 48010.00, 977.50, 353.00, 18.50, 18.20, 18.40, 84.40, 84.20, +0.050, +0.010, -0.020, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '60 seconds', 77.100, 1688.00, 4.96, 4.48, 245.50, 89.10, 48005.00, 978.20, 352.40, 18.50, 18.20, 18.40, 83.90, 83.70, +0.030, +0.000, +0.010, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '50 seconds', 78.800, 1705.00, 5.01, 3.86, 245.40, 89.05, 48020.00, 979.00, 351.80, 18.50, 18.19, 18.39, 83.40, 83.20, -0.010, -0.010, +0.020, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '40 seconds', 80.200, 1722.00, 5.06, 3.32, 245.20, 88.95, 48015.00, 979.50, 351.20, 18.50, 18.18, 18.38, 82.90, 82.70, +0.000, +0.020, -0.010, 'POWERED_MESOSPHERIC_ASCENT'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '30 seconds', 81.300, 1731.00, 5.09, 2.94, 245.10, 88.90, 48010.00, 979.80, 350.80, 18.50, 18.18, 18.38, 82.60, 82.50, -0.020, +0.010, +0.000, 'MESOSPHERE_RCS_STABILIZATION'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '20 seconds', 82.000, 1736.00, 5.11, 2.65, 245.05, 88.85, 48000.00, 980.00, 350.50, 18.50, 18.18, 18.38, 82.50, 82.40, +0.010, -0.010, +0.010, 'MESOSPHERE_RCS_STABILIZATION'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '10 seconds', 82.300, 1739.00, 5.12, 2.45, 245.00, 88.80, 47990.00, 980.10, 350.40, 18.50, 18.18, 18.38, 82.40, 82.40, +0.000, +0.000, +0.000, 'MESOSPHERE_RCS_STABILIZATION'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW(),                     82.400, 1740.00, 5.12, 2.38, 245.00, 88.80, 48000.00, 980.00, 350.40, 18.50, 18.18, 18.38, 82.40, 82.40, +0.000, +0.000, +0.000, 'MESOSPHERE_RCS_STABILIZATION');

-- 5. Insert 10 Attitude Commands & Operational Maneuver Events
INSERT INTO attitude_commands (
    mission_id,
    issued_at,
    command_type,
    target_axis,
    pulse_duration_ms,
    quad_mask,
    operator_role,
    execution_status,
    response_delta_ms,
    telemetry_notes
) VALUES
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '8 minutes', 'PITCH_TRIM',        'PITCH',     45, 'QUAD-FWD-01',                  'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.10, 'Compensated for dynamic pressure shift at Mach 4.2 transition'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '7 minutes', 'ROLL_STABILIZE',    'ROLL',      30, 'QUAD-PORT-02|QUAD-STBD-03',    'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.25, 'Nullified aero roll torque on right elevon strake'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '6 minutes', 'YAW_CORRECTION',    'YAW',       60, 'QUAD-FWD-01|QUAD-AFT-04',      'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 3.95, 'Corrected cross-track drift azimuth to +0.04 deg'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '5 minutes', 'CALIBRATE_VERNIER', 'ALL_AXES',  15, 'ALL_QUADS',                    'CHIEF_PROPULSION_DIR', 'COMPLETED', 4.02, 'Pre-mesosphere micro-pulse baseline latency verified 4.02ms'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '4 minutes', 'PITCH_TRIM',        'PITCH',     50, 'QUAD-FWD-01',                  'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.12, 'Incline gamma profile locked at +3.8 deg flight path angle'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '3 minutes', 'NULL_RATES',        'ALL_AXES',  75, 'ALL_QUADS',                    'CDR_COMMAND_OVERRIDE', 'COMPLETED', 4.30, 'Automated three-axis null sequence executed prior to staging'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '2 minutes', 'ROLL_STABILIZE',    'ROLL',      35, 'QUAD-PORT-02|QUAD-STBD-03',    'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.18, 'Maintained horizon alignment 0.00 deg relative to inertial ref'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '1 minute',  'TEST_BURST_AFT',    'YAW',       50, 'QUAD-AFT-04',                  'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 3.92, 'Chamber pressure spiked to nominal 14.58 bar, prompt shutoff'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '30 seconds','PITCH_TRIM',        'PITCH',     20, 'QUAD-FWD-01',                  'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.08, 'Micro-vernier trim against rarefied atmospheric gradient'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '5 seconds', 'NULL_RATES',        'ALL_AXES',  25, 'ALL_QUADS',                    'FLIGHT_COMPUTER_GN&C', 'COMPLETED', 4.05, 'Vehicle residual rates: P 0.000, R 0.000, Y 0.000 deg/s');

-- 6. Insert Propulsion Deck Anomaly Events & Interlocks
INSERT INTO anomaly_events (
    mission_id,
    detected_at,
    severity,
    subsystem,
    code,
    description,
    cleared,
    cleared_at,
    resolution_protocol
) VALUES
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '12 minutes', 'ADVISORY', 'HELIUM_PRESSURIZATION', 'HE-REG-ADV-01', 'Regulator outlet ripple 0.2 bar during main aerospike ignition ramp', true, NOW() - INTERVAL '11 minutes', 'Dome-load pilot regulator damping engaged, pressure steady at 18.50 bar'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '9 minutes',  'CAUTION',  'RCS_MANIFOLD_FWD',     'RCS-THRM-04',  'Forward quad nozzle thermocouple spiked to 142°C during high-frequency pitch damping', true, NOW() - INTERVAL '8 minutes', 'Duty cycle throttled to 14.2%, cooling passive radiation nominal in mesosphere'),
('f3b89012-74c1-45bc-8a29-ef0489912099', NOW() - INTERVAL '2 minutes',  'ADVISORY', 'AEROSPIKE_TURBOPUMP',  'TP-VIB-02',    'Turbopump shaft vibration reached 1.4 mm/s RMS (threshold: 3.0 mm/s)', false, NULL, 'Continuous FFT spectral monitoring active on bearing pack B');
