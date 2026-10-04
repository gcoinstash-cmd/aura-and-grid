-- ============================================================================
-- CHRONO TACHYON-FX FLIGHT DECK SEED DATA ARTIFACT
-- High-Speed Telemetry, 14-Sector Log, Inlet Diagnostics & Action Events
-- ============================================================================

-- Clean up existing seed records if present
DELETE FROM inlet_diagnostic_events;
DELETE FROM velocity_sector_records;
DELETE FROM mag_skid_telemetry_logs;
DELETE FROM hypersonic_telemetry_snapshots;
DELETE FROM scramjet_hypercar_vehicles;

-- 1. Insert Vehicles: Flagship PROTO-16 and Testbed PROTO-15
INSERT INTO scramjet_hypercar_vehicles (
    id,
    chassis_code,
    vehicle_designation,
    powertrain_type,
    aerodynamic_inlet_type,
    cryo_loop_coolant,
    nominal_drive_kw,
    peak_thrust_kn,
    max_service_mach,
    commissioned_at
) VALUES 
(
    'a1600000-0000-0000-0000-000000000016',
    'PROTO-16',
    'CHRONO TACHYON-FX // HYPERSONIC SCRAMJET HYPERCAR PROTO-16',
    'HYBRID_SCRAMJET_EM_FLUX_OCTA_CORE',
    'VARIABLE_GEOMETRY_RAMP_3STAGE',
    'LN2_SUBCOOLED_77K',
    2535.00,
    28.50,
    0.52,
    NOW() - INTERVAL '30 days'
),
(
    'a1500000-0000-0000-0000-000000000015',
    'PROTO-15',
    'CHRONO TACHYON-FX // CRYOGENIC TESTBED PROTO-15',
    'DUAL_INLET_RESEARCH_MAG_SKID',
    'FIXED_GEOMETRY_ISOLATOR_2STAGE',
    'LIQUID_HELIUM_4K_HYBRID',
    2150.00,
    22.40,
    0.44,
    NOW() - INTERVAL '90 days'
);

-- 2. Insert 14 Sector Records (Sectors 1 to 14) for PROTO-16
INSERT INTO velocity_sector_records (
    vehicle_id,
    sector_number,
    sector_name,
    mach_speed,
    ground_speed_kmh,
    scramjet_thrust_kn,
    dynamic_pressure_q_kpa,
    inlet_capture_area_ratio,
    skid_repulsion_kn,
    skid_ground_gap_mm,
    shock_status,
    sector_elapsed_ms,
    recorded_at
) VALUES
(
    'a1600000-0000-0000-0000-000000000016',
    1,
    'S1 - Launch Ingress & Pre-Ram',
    0.285,
    350.20,
    14.20,
    88.40,
    0.780,
    38.40,
    3.80,
    'NOMINAL',
    3420,
    NOW() - INTERVAL '14 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    2,
    'S2 - Supersonic Ramp Ramp-Up Alpha',
    0.312,
    383.60,
    17.80,
    105.80,
    0.815,
    41.20,
    3.20,
    'LOCKED',
    2980,
    NOW() - INTERVAL '13 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    3,
    'S3 - Transonic Straightaway Ingress',
    0.338,
    415.70,
    21.40,
    124.60,
    0.852,
    44.60,
    2.70,
    'LOCKED',
    2750,
    NOW() - INTERVAL '12 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    4,
    'S4 - Scramjet Silane Primary Injection',
    0.360,
    442.80,
    26.80,
    142.00,
    0.890,
    48.20,
    2.10,
    'LOCKED',
    2590,
    NOW() - INTERVAL '11 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    5,
    'S5 - Salt Flats High-Q Choke Point',
    0.378,
    464.90,
    27.90,
    156.40,
    0.912,
    51.80,
    1.90,
    'STABLE',
    2480,
    NOW() - INTERVAL '10 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    6,
    'S6 - Mag-Lev High-G Bank Ingress',
    0.372,
    457.50,
    26.10,
    151.20,
    0.904,
    56.40,
    1.70,
    'OPTIMAL',
    2540,
    NOW() - INTERVAL '9 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    7,
    'S7 - Apex Magnetic Levitation Turn',
    0.354,
    435.40,
    23.50,
    137.50,
    0.874,
    62.80,
    1.50,
    'HIGH_STRESS',
    2810,
    NOW() - INTERVAL '8 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    8,
    'S8 - Oblique Shock Re-Alignment Exit',
    0.369,
    453.80,
    26.40,
    149.30,
    0.898,
    50.10,
    2.00,
    'LOCKED',
    2620,
    NOW() - INTERVAL '7 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    9,
    'S9 - Tachyon Main Runway Burn',
    0.395,
    485.80,
    28.10,
    171.20,
    0.940,
    49.00,
    2.20,
    'LOCKED',
    2350,
    NOW() - INTERVAL '6 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    10,
    'S10 - Supersonic Iso-Chamber Expansion',
    0.412,
    506.70,
    28.40,
    186.00,
    0.958,
    48.50,
    2.30,
    'OPTIMAL',
    2240,
    NOW() - INTERVAL '5 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    11,
    'S11 - Aerodynamic Boundary Bleed Arc',
    0.404,
    496.90,
    27.60,
    179.10,
    0.945,
    52.00,
    2.00,
    'LOCKED',
    2300,
    NOW() - INTERVAL '4 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    12,
    'S12 - Decel Thermal Soak Buffer',
    0.380,
    467.40,
    24.20,
    158.30,
    0.908,
    47.60,
    2.40,
    'NORMAL',
    2510,
    NOW() - INTERVAL '3 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    13,
    'S13 - Cryo Skid Re-Stabilization',
    0.345,
    424.30,
    19.80,
    130.40,
    0.860,
    43.50,
    3.00,
    'NORMAL',
    2780,
    NOW() - INTERVAL '2 minutes'
),
(
    'a1600000-0000-0000-0000-000000000016',
    14,
    'S14 - Recovery Deceleration Trap',
    0.298,
    366.50,
    15.00,
    97.20,
    0.795,
    39.80,
    3.60,
    'NOMINAL',
    3120,
    NOW() - INTERVAL '1 minute'
);

-- 3. Insert Telemetry Snapshots
INSERT INTO hypersonic_telemetry_snapshots (
    vehicle_id,
    recorded_at,
    ground_speed_kmh,
    mach_number,
    total_power_kw,
    scramjet_thrust_kn,
    dynamic_pressure_q_kpa,
    cowl_deflection_deg,
    oblique_shock_angle_deg,
    combustion_chamber_p_bar,
    fuel_mass_flow_kg_s,
    inlet_compression_ratio,
    bypass_valve_open,
    shock_train_stability_pct,
    chassis_g_force
) VALUES
(
    'a1600000-0000-0000-0000-000000000016',
    NOW(),
    442.80,
    0.360,
    2535.00,
    26.80,
    142.00,
    14.20,
    28.60,
    18.40,
    1.840,
    12.40,
    FALSE,
    99.40,
    4.50
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '5 seconds',
    441.50,
    0.359,
    2530.00,
    26.70,
    141.20,
    14.10,
    28.70,
    18.35,
    1.835,
    12.35,
    FALSE,
    99.20,
    4.45
);

-- 4. Insert Mag Skid Telemetry Logs
INSERT INTO mag_skid_telemetry_logs (
    vehicle_id,
    recorded_at,
    fl_gap_mm,
    fr_gap_mm,
    rl_gap_mm,
    rr_gap_mm,
    average_gap_mm,
    cryo_temp_kelvin,
    superconducting_flux_stability_pct,
    skid_repulsion_force_kn,
    coil_current_amperes,
    vacuum_insulation_torr,
    ground_proximity_alert
) VALUES
(
    'a1600000-0000-0000-0000-000000000016',
    NOW(),
    2.10,
    2.15,
    2.05,
    2.10,
    2.10,
    77.30,
    99.60,
    48.20,
    1240.0,
    0.000012,
    FALSE
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '10 seconds',
    2.12,
    2.18,
    2.08,
    2.14,
    2.13,
    77.25,
    99.65,
    47.90,
    1238.0,
    0.000011,
    FALSE
);

-- 5. Insert 4 Inlet Ramp Diagnostic Logs
INSERT INTO inlet_diagnostic_events (
    vehicle_id,
    event_timestamp,
    event_type,
    severity,
    inlet_mode,
    cowl_position_deg,
    isolator_pressure_kpa,
    action_taken,
    telemetry_operator
) VALUES
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '18 minutes',
    'RAMP_ACTUATION_SELF_TEST',
    'INFO',
    'SUBSONIC_STARTUP',
    4.50,
    101.30,
    '3-stage variable geometry hydraulic ramp stroke verified within 0.02 mm tolerance.',
    'AUTO_CALIBRATION_DAEMON'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '14 minutes',
    'SUPERSONIC_TRANSITION_ARMED',
    'NORMAL',
    'TRANSONIC_INGRESS',
    9.80,
    132.40,
    'Shock trap boundary layer bleed doors actuated to 65% open for transonic stability.',
    'AUTO_FLIGHT_DIRECTOR_CHRONO'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '11 minutes',
    'SHOCK_TRAIN_ISOLATOR_LOCK',
    'NORMAL',
    'SCRAMJET_SUPERSONIC_RAM',
    14.20,
    198.60,
    'Oblique shock train stabilized at throat station X-240; isolator backpressure margin at 24.5%.',
    'AUTO_FLIGHT_DIRECTOR_CHRONO'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '7 minutes',
    'BOUNDARY_BLEED_SPILL_CORRECTION',
    'WARNING',
    'SCRAMJET_SUPERSONIC_RAM',
    15.10,
    212.00,
    'Micro-fluctuation detected in static pressure tap P2; bypass relief valve pulsed 180ms to prevent inlet unstart.',
    'AUTO_AERO_GOVERNOR'
);

-- 6. Insert 8 Realistic Vehicle Action Events
INSERT INTO inlet_diagnostic_events (
    vehicle_id,
    event_timestamp,
    event_type,
    severity,
    inlet_mode,
    cowl_position_deg,
    isolator_pressure_kpa,
    action_taken,
    telemetry_operator
) VALUES
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '25 minutes',
    'PRE_COOL_MAG_SKIDS_COMPLETE',
    'NORMAL',
    'STANDBY',
    0.00,
    101.30,
    'Liquid Nitrogen cryostat loop temperature reached equilibrium at 77.3 Kelvin.',
    'GROUND_SUPPORT_CREW'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '22 minutes',
    'MAG_SKIDS_ENERGIZED',
    'NORMAL',
    'STANDBY',
    0.00,
    101.30,
    'Superconducting coil flux energized to 1,240 Amperes; clearance baseline set to 4.8 mm.',
    'CHASSIS_DYNAMICS_CONTROLLER'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '16 minutes',
    'ELECTRIC_DRIVE_TORQUE_SYNC',
    'NORMAL',
    'SUBSONIC_STARTUP',
    4.50,
    102.10,
    'Quad-axial high-voltage inverters locked at 2,535 kW peak drive capability.',
    'POWERTRAIN_CORE_V8'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '12 minutes',
    'SILANE_CH4_INJECTION_PRIMED',
    'NORMAL',
    'TRANSONIC_INGRESS',
    11.40,
    145.80,
    'Synthetic pyrophoric silane catalyst pre-injected into supersonic combustor plenum.',
    'PROPULSION_TELEMETRY'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '10 minutes',
    'SCRAMJET_IGNITION_CONFIRMED',
    'NORMAL',
    'SCRAMJET_SUPERSONIC_RAM',
    14.20,
    188.40,
    'Supersonic combustor flameholding established; net scramjet thrust rose to 26.8 kN.',
    'PROPULSION_TELEMETRY'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '8 minutes',
    'SHOCK_TRAIN_LOCKED',
    'NORMAL',
    'SCRAMJET_SUPERSONIC_RAM',
    14.20,
    192.10,
    'Internal isolator normal shock train locked at designated diffuser acoustic node.',
    'AUTO_AERO_GOVERNOR'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '5 minutes',
    'GROUND_PROXIMITY_DYNAMICS_TRIM',
    'INFO',
    'SCRAMJET_SUPERSONIC_RAM',
    14.40,
    205.30,
    'Dynamic ground effect at 4.5G downforce compensated by electromagnetic skid flux boost +6.2%.',
    'CHASSIS_DYNAMICS_CONTROLLER'
),
(
    'a1600000-0000-0000-0000-000000000016',
    NOW() - INTERVAL '2 minutes',
    'FLIGHT_DECK_HEALTH_TELEMETRY_NOMINAL',
    'NORMAL',
    'SCRAMJET_SUPERSONIC_RAM',
    14.20,
    195.00,
    'All 14 velocity sectors monitored; cryogenic loop stable at 77.3K; 0 unstart events recorded.',
    'AUTO_FLIGHT_DIRECTOR_CHRONO'
);
