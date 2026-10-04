-- ============================================================================
-- CHRONOS MORPH-GT TELEMETRY PLATFORM
-- Seed Data: PROTO-14 Flagship Interceptor & PROTO-13 Testbed
-- 14 Lap Sectors, Actuator Logs, and Morph Diagnostic Events
-- ============================================================================

-- Clean existing data
TRUNCATE morph_sector_records, actuator_thermal_logs, aero_surface_snapshots, alloy_diagnostic_events, morph_hypercar_vehicles CASCADE;

-- 1. VEHICLES: PROTO-14 Flagship and PROTO-13 Dyno Testbed
INSERT INTO morph_hypercar_vehicles (
    id,
    vin,
    chassis_code,
    model_name,
    spec_edition,
    dry_weight_kg,
    peak_power_kw,
    peak_horsepower,
    v_max_kmh,
    alloy_bus_voltage,
    status
) VALUES 
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'CHRONOS-GT-PROTO-14-AERO',
    'PROTO-14',
    'CHRONOS MORPH-GT',
    'SHAPE-SHIFTING AERO INTERCEPTOR',
    1280.0,
    1976,
    2650,
    442.5,
    48.0,
    'ACTIVE_TELEMETRY'
),
(
    'b1d3f99a-7a18-42ec-99e1-124b8d7e1013',
    'CHRONOS-GT-PROTO-13-DYNO',
    'PROTO-13',
    'CHRONOS MORPH-GT',
    'HIGH-G DYNAMICS TESTBED',
    1310.0,
    1850,
    2480,
    428.0,
    48.0,
    'STANDBY_BENCH'
);

-- 2. AERO SURFACE SNAPSHOTS
INSERT INTO aero_surface_snapshots (
    vehicle_id,
    aero_profile,
    speed_kmh,
    drag_coefficient_cd,
    downforce_kg,
    splitter_flex_pct,
    bargeboard_flare_pct,
    diffuser_tunnel_angle_deg,
    rear_wing_camber_deg,
    streamline_purge_active
) VALUES
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 'V-MAX STREAMLINE', 384.60, 0.198, 1680.0, -18.5, 4.2, 7.8, -2.4, TRUE),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 'CORNER CARVER HIGH-DOWNFORCE', 242.30, 0.410, 2450.0, 32.0, 68.4, 18.2, 14.5, FALSE),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 'AIRBRAKE DUMP', 320.10, 0.440, 2890.0, 45.0, 92.0, 22.0, 26.8, FALSE),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 'AUTO ADAPTIVE MORPH', 315.40, 0.285, 1920.0, 12.0, 34.0, 12.5, 6.2, FALSE);

-- 3. ACTUATOR THERMAL & HYDRAULIC LOGS (16-Channel Representative & Detailed Valve Cycles)
INSERT INTO actuator_thermal_logs (
    vehicle_id,
    channel_index,
    channel_name,
    current_amps,
    temp_celsius,
    hydraulic_bus_bar,
    valve_response_ms,
    coolant_flow_lpm,
    superconducting_temp_k,
    inverter_load_pct
) VALUES
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 1,  'AERO-ACT-01 // Front Left Splitter Canard',     4.8, 24.8, 280.2, 2.8, 14.2, 77.4, 96.2),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 2,  'AERO-ACT-02 // Front Right Splitter Canard',    4.9, 25.1, 280.1, 2.9, 14.2, 77.4, 96.0),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 3,  'AERO-ACT-03 // Underfloor Venturi Inflow',      5.2, 26.0, 279.8, 3.1, 14.1, 77.3, 95.8),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 4,  'AERO-ACT-04 // Nose Strakes Variable Camber',   4.1, 23.9, 280.0, 2.6, 14.3, 77.5, 96.4),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 5,  'AERO-ACT-05 // Left Bargeboard Flap Upper',      6.1, 27.4, 280.5, 3.4, 14.0, 77.2, 97.1),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 6,  'AERO-ACT-06 // Left Bargeboard Flap Lower',      5.8, 26.8, 280.4, 3.3, 14.0, 77.2, 96.8),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 7,  'AERO-ACT-07 // Right Bargeboard Flap Upper',     6.0, 27.2, 280.5, 3.5, 14.0, 77.2, 97.0),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 8,  'AERO-ACT-08 // Right Bargeboard Flap Lower',     5.9, 26.9, 280.3, 3.2, 14.1, 77.3, 96.9),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 9,  'AERO-ACT-09 // Side Pod Boundary Air Bleed L',  3.8, 23.1, 280.0, 2.4, 14.4, 77.6, 95.5),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 10, 'AERO-ACT-10 // Side Pod Boundary Air Bleed R',  3.7, 23.0, 280.0, 2.5, 14.4, 77.6, 95.5),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 11, 'AERO-ACT-11 // Active Venturi Tunnel Throat',    7.2, 29.5, 279.4, 3.8, 13.8, 76.9, 98.2),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 12, 'AERO-ACT-12 // Central Diffuser Expansion Fin', 6.8, 28.9, 279.6, 3.6, 13.9, 77.0, 97.8),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 13, 'AERO-ACT-13 // Wing Mainplane Morph Pitch',     8.4, 31.2, 279.0, 3.9, 13.6, 76.7, 98.9),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 14, 'AERO-ACT-14 // Wing Flap Variable Camber Tip L', 5.3, 25.6, 280.1, 2.9, 14.2, 77.4, 96.1),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 15, 'AERO-ACT-15 // Wing Flap Variable Camber Tip R', 5.4, 25.8, 280.0, 3.0, 14.2, 77.4, 96.3),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 16, 'AERO-ACT-16 // Drag-Purge Micro-Jet Vortex Gate', 4.5, 24.2, 280.2, 2.7, 14.3, 77.5, 95.9);

-- 4. MORPH SECTOR RECORDS (14 FULL SECTORS ON EHRA-LESSIEN OVAL & FLUGPLATZ HIGH-SPEED LOOP)
INSERT INTO morph_sector_records (
    vehicle_id,
    sector_number,
    sector_name,
    entry_speed_kmh,
    apex_speed_kmh,
    exit_speed_kmh,
    active_cd,
    downforce_kg,
    actuator_cycles,
    sector_time_seconds,
    morph_state
) VALUES
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 1,  'Main Straight // Inception Blast',    294.2, 384.6, 392.4, 0.198, 1680.0, 48,  6.842, 'STREAMLINE_LOCK'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 2,  'Supersonic Kink East // Turn 1',      390.1, 355.4, 368.2, 0.235, 1890.0, 84,  7.120, 'ADAPTIVE_TRIM'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 3,  'Braking Threshold 1 // Airbrake Gate', 368.2, 192.5, 204.0, 0.440, 2890.0, 142, 5.450, 'AIRBRAKE_DUMP'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 4,  'Omega Carousel // Apex Camber',       204.0, 178.6, 225.4, 0.410, 2450.0, 188, 8.934, 'CORNER_CARVE'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 5,  'Acceleration Chute 1',                225.4, 288.9, 312.0, 0.245, 1750.0, 92,  5.890, 'PROGRESSIVE_UNFURL'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 6,  'High-Speed Chicane Entry',            312.0, 245.0, 252.0, 0.360, 2210.0, 134, 4.980, 'ROLL_MOMENT_COMP'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 7,  'Chicane Direction Transition',        252.0, 238.4, 268.0, 0.380, 2340.0, 156, 5.120, 'DYNAMIC_VECTOR'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 8,  'Hangar Velocity Sprint',              268.0, 372.1, 401.5, 0.202, 1695.0, 66,  6.410, 'DRAG_PURGE_PULSE'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 9,  'V-Max High-Bank Curve South',         401.5, 386.0, 394.8, 0.218, 1790.0, 110, 7.820, 'AERO_GROUND_SUCTION'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 10, 'Deceleration Funnel 2',               394.8, 210.0, 220.5, 0.435, 2810.0, 138, 5.620, 'AERO_DECEL_MAX'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 11, 'Corkscrew Drop // Compression',      220.5, 185.0, 214.2, 0.395, 2380.0, 162, 6.740, 'GROUND_SEAL_ACTIVE'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 12, 'Spine Sweeper Right',                 214.2, 274.5, 305.0, 0.280, 1880.0, 98,  6.190, 'TRANSVERSE_STABILIZE'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 13, 'Penultimate High-G Left',             305.0, 260.0, 289.0, 0.340, 2140.0, 122, 5.430, 'VORTEX_TRAPPING'),
('e7c2a11b-4f92-48ea-8b43-982c7a0c1014', 14, 'Final Grid Launch Straight',          289.0, 379.8, 384.6, 0.198, 1680.0, 52,  6.250, 'STREAMLINE_PURGE');

-- 5. ALLOY DIAGNOSTIC & VEHICLE ACTION EVENTS (8 Realistic Action & Telemetry Events)
INSERT INTO alloy_diagnostic_events (
    vehicle_id,
    severity,
    event_code,
    title,
    details,
    voltage_pulse_v,
    operator_id
) VALUES
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'OPTIMAL',
    'ALLOY_VMAX_ENGAGED',
    'Streamline Morph Engaged // Drag Purge Active',
    'Front canards retracted to -18.5%, active underfloor venturi skirts closed to 4.2mm gap. Drag coefficient lowered to Cd 0.198.',
    48.0,
    'PILOT_SYS_AUTO'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'ACTION',
    'AIRBRAKE_DEPLOY_MAX',
    'High-G Airbrake Deployed // Vortex Dump',
    'Piezo actuators pulsed at 48V. Variable-camber rear wing deflected +26.8° pitch, generating 2,890 kg aero braking load at 320 km/h.',
    48.2,
    'PILOT_THRESHOLD_TRIGGER'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'OPTIMAL',
    'SKIN_PRESTRESS_CALIB',
    'Alloy Surface Pre-Stressed // Tension Balanced',
    'Shape-memory nickel-titanium lattice thermally pre-stressed to 24.8°C nominal baseline. Hysteresis variance calibrated under 0.04mm.',
    47.9,
    'CREW_CHIEF_SYSTEM'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'INFO',
    'HYDR_BUS_STABILIZED',
    'Hydraulic Bus Pressure Nominal at 280.2 Bar',
    'Micro-hydraulic fluid manifold operating within target pressure window (278-282 bar). Servo response verified at 2.8ms latency.',
    48.0,
    'HYDR_CONTROLLER_P01'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'WARNING',
    'DIFFUSER_TEMP_SPIKE',
    'Diffuser Actuator ACT-13 Thermal Gradient Alert',
    'Actuator 13 reached 31.2°C under sustained downforce load in Sector 4. Secondary liquid coolant loop increased from 13.6 to 14.5 LPM.',
    48.0,
    'THERMAL_MGMT_SUBSYS'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'ACTION',
    'ALLOY_MEMORY_RESET',
    'Alloy Memory Crystallographic Anneal Reset',
    'Executed full lattice memory cycle across all 16 piezoelectric channels. Shape recovery index confirmed at 99.98% zero-offset.',
    48.4,
    'PILOT_MANUAL_OVERRIDE'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'OPTIMAL',
    'SUPERCONDUCT_STABLE',
    'Flux Motor Cryo-Cooling Nominal at 77.4 Kelvin',
    'Tri-axial superconducting stator coils maintain stable cryogenic envelope. Inverter efficiency measured at 99.4% under 1,976 kW sprint.',
    48.0,
    'CRYO_FLUX_CORE'
),
(
    'e7c2a11b-4f92-48ea-8b43-982c7a0c1014',
    'INFO',
    'TELEMETRY_LOG_EXPORT',
    'High-Speed Stint Telemetry Snapshot Synchronized',
    'Laps 1-14 sector dynamics, high-frequency piezoelectric logs, and aerodynamic coefficient curves archived to onboard solid-state block.',
    48.0,
    'DATA_LOGGER_FLIGHT_DECK'
);
