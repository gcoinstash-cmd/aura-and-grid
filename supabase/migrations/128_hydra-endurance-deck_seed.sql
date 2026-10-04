-- =============================================================================
-- HYDRA LE MANS-24 // LIQUID H2 FUEL-CELL HYPERCAR TELEMETRY SEED DATA
-- Archetype: Ghost Factory & Aura & Grid Institutional Telemetry Seed
-- Chassis: PROTO-11 (Flagship Le Mans Entry) & PROTO-10 (Factory Dyno Testbed)
-- =============================================================================

-- Clean existing data
TRUNCATE TABLE pit_telemetry_events CASCADE;
TRUNCATE TABLE stint_strategy_records CASCADE;
TRUNCATE TABLE supercapacitor_cycle_logs CASCADE;
TRUNCATE TABLE h2_telemetry_snapshots CASCADE;
TRUNCATE TABLE endurance_vehicles CASCADE;

-- -----------------------------------------------------------------------------
-- 1. SEED: endurance_vehicles (Chassis PROTO-11 & PROTO-10)
-- -----------------------------------------------------------------------------
INSERT INTO endurance_vehicles (
    id,
    chassis_code,
    vehicle_name,
    racing_number,
    vehicle_class,
    powertrain_type,
    h2_capacity_kg,
    max_stack_kw,
    max_supercap_kw,
    system_voltage,
    chassis_status,
    created_at,
    updated_at
) VALUES 
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    'PROTO-11',
    'HYDRA HYPERCAR LM-H2 PROTO-11',
    11,
    'HYPERCAR-H2',
    'LIQUID_H2_FUEL_CELL_SUPERCAPACITOR',
    14.50,
    450.0,
    600.0,
    800.0,
    'ACTIVE_STINT',
    timezone('utc'::text, now() - INTERVAL '14 hours'),
    timezone('utc'::text, now())
),
(
    'b2c3d4e5-f6a7-8901-bcde-222222222222',
    'PROTO-10',
    'HYDRA FACTORY DYNO TESTBED PROTO-10',
    10,
    'HYPERCAR-H2',
    'LIQUID_H2_FUEL_CELL_SUPERCAPACITOR',
    14.50,
    430.0,
    580.0,
    800.0,
    'BENCH_TESTING',
    timezone('utc'::text, now() - INTERVAL '36 hours'),
    timezone('utc'::text, now())
);

-- -----------------------------------------------------------------------------
-- 2. SEED: h2_telemetry_snapshots (Recent cryo & fuel cell stack telemetry)
-- -----------------------------------------------------------------------------
INSERT INTO h2_telemetry_snapshots (
    vehicle_id,
    recorded_at,
    ground_speed_kmh,
    stack_output_kw,
    supercap_soc_pct,
    h2_tank_pressure_bar,
    cryo_tank_temp_k,
    anode_mass_flow_g_s,
    cathode_mass_flow_g_s,
    water_exhaust_rate_ml_s,
    membrane_humidity_pct,
    boiloff_relief_active,
    stint_mode
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '25 seconds'),
    338.4,
    420.5,
    92.40,
    700.2,
    20.35,
    4.85,
    38.80,
    43.2,
    89.40,
    false,
    '24H ENDURANCE CRUISE'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '20 seconds'),
    342.1,
    445.0,
    88.10,
    698.8,
    20.38,
    5.12,
    40.90,
    45.8,
    89.10,
    false,
    'ATTACK QUALI'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '15 seconds'),
    185.0,
    310.2,
    96.50,
    696.5,
    20.40,
    3.40,
    27.20,
    30.6,
    91.20,
    false,
    '24H ENDURANCE CRUISE'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '10 seconds'),
    278.6,
    398.0,
    94.00,
    694.1,
    20.42,
    4.60,
    36.80,
    41.4,
    88.70,
    false,
    '24H ENDURANCE CRUISE'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '5 seconds'),
    335.8,
    424.8,
    91.80,
    692.0,
    20.45,
    4.90,
    39.20,
    44.1,
    88.50,
    false,
    '24H ENDURANCE CRUISE'
);

-- -----------------------------------------------------------------------------
-- 3. SEED: supercapacitor_cycle_logs (4 fuel cell diagnostic & supercap logs)
-- -----------------------------------------------------------------------------
INSERT INTO supercapacitor_cycle_logs (
    vehicle_id,
    recorded_at,
    bus_voltage_v,
    instant_power_kw,
    cell_temp_c,
    front_axle_kw,
    rear_axle_kw,
    front_rotor_temp_c,
    rear_rotor_temp_c,
    state_of_health_pct,
    overtake_boost_active
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '120 seconds'),
    798.4,
    -540.0,
    41.2,
    -260.0,
    -280.0,
    740.0,
    780.0,
    99.20,
    false
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '90 seconds'),
    804.2,
    580.0,
    44.8,
    290.0,
    290.0,
    680.0,
    710.0,
    99.15,
    true
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '60 seconds'),
    801.0,
    145.0,
    43.5,
    72.0,
    73.0,
    650.0,
    675.0,
    99.10,
    false
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '30 seconds'),
    802.6,
    -490.0,
    42.9,
    -240.0,
    -250.0,
    710.0,
    735.0,
    99.08,
    false
);

-- -----------------------------------------------------------------------------
-- 4. SEED: stint_strategy_records (16 Realistic 24-Hour Endurance Stints)
-- -----------------------------------------------------------------------------
INSERT INTO stint_strategy_records (
    vehicle_id,
    recorded_at,
    stint_number,
    driver_name,
    laps_completed,
    avg_lap_pace,
    avg_lap_seconds,
    h2_consumption_kg_per_lap,
    tire_wear_pct,
    supercap_health_pct,
    energy_delta_pct,
    pit_turnaround_target_s,
    stint_status
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '15 hours 45 minutes'),
    1,
    'S. Buemi',
    24,
    '3:22.180',
    202.180,
    0.542,
    18.5,
    100.0,
    -0.80,
    42.0,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '14 hours 40 minutes'),
    2,
    'S. Buemi',
    25,
    '3:21.940',
    201.940,
    0.548,
    38.0,
    99.9,
    -1.10,
    44.5,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '13 hours 35 minutes'),
    3,
    'K. Kobayashi',
    24,
    '3:22.450',
    202.450,
    0.539,
    22.0,
    99.8,
    -0.50,
    41.8,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '12 hours 30 minutes'),
    4,
    'K. Kobayashi',
    24,
    '3:22.890',
    202.890,
    0.545,
    41.5,
    99.7,
    -1.30,
    43.0,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '11 hours 25 minutes'),
    5,
    'M. Conway',
    25,
    '3:23.120',
    203.120,
    0.551,
    24.0,
    99.6,
    -1.70,
    42.5,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '10 hours 20 minutes'),
    6,
    'M. Conway',
    23,
    '3:24.050',
    204.050,
    0.558,
    46.0,
    99.5,
    -2.10,
    45.0,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '9 hours 15 minutes'),
    7,
    'S. Buemi',
    25,
    '3:21.850',
    201.850,
    0.536,
    21.0,
    99.4,
    -0.40,
    41.2,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '8 hours 10 minutes'),
    8,
    'S. Buemi',
    25,
    '3:22.030',
    202.030,
    0.540,
    43.5,
    99.3,
    -0.90,
    43.8,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '7 hours 05 minutes'),
    9,
    'K. Kobayashi',
    24,
    '3:23.410',
    203.410,
    0.544,
    25.5,
    99.2,
    -1.20,
    42.0,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '6 hours 00 minutes'),
    10,
    'K. Kobayashi',
    24,
    '3:23.780',
    203.780,
    0.549,
    48.0,
    99.1,
    -1.60,
    44.0,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '4 hours 55 minutes'),
    11,
    'M. Conway',
    26,
    '3:22.650',
    202.650,
    0.538,
    22.5,
    99.0,
    -0.70,
    41.5,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '3 hours 50 minutes'),
    12,
    'M. Conway',
    24,
    '3:24.300',
    204.300,
    0.562,
    49.0,
    98.9,
    -2.40,
    46.2,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '2 hours 45 minutes'),
    13,
    'S. Buemi',
    25,
    '3:22.210',
    202.210,
    0.541,
    23.0,
    98.8,
    -0.90,
    42.1,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '1 hour 40 minutes'),
    14,
    'S. Buemi',
    25,
    '3:22.540',
    202.540,
    0.546,
    45.5,
    98.7,
    -1.30,
    43.4,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '35 minutes'),
    15,
    'K. Kobayashi',
    25,
    '3:21.990',
    201.990,
    0.539,
    26.0,
    98.6,
    -0.60,
    41.9,
    'COMPLETED'
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now()),
    16,
    'K. Kobayashi',
    18,
    '3:21.412',
    201.412,
    0.535,
    31.2,
    98.5,
    -1.40,
    42.0,
    'IN_PROGRESS'
);

-- -----------------------------------------------------------------------------
-- 5. SEED: pit_telemetry_events (8 Realistic Strategy Daemon & Diagnostic Events)
-- -----------------------------------------------------------------------------
INSERT INTO pit_telemetry_events (
    vehicle_id,
    recorded_at,
    stint_number,
    event_type,
    severity,
    message,
    telemetry_payload
) VALUES
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '4 minutes 30 seconds'),
    16,
    'CRYO_VENT_RELIEF',
    'INFO',
    'Cryo-venturi pressure stabilization valve actuated at 700.5 bar. Thermal target maintained at 20.35 K.',
    '{"tank_pressure_bar": 700.5, "cryo_temp_k": 20.35, "vent_duration_ms": 420}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '3 minutes 15 seconds'),
    16,
    'OVERTAKE_BOOST_ENGAGED',
    'OPERATIONAL',
    'Driver Kobayashi keyed Megacap Burst (600 kW) through Mulsanne Kink. Axle flux peaked at 592 kW.',
    '{"peak_flux_kw": 592.4, "boost_duration_s": 4.8, "sector": "S2_MULSANNE"}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '2 minutes 40 seconds'),
    16,
    'STACK_MOISTURE_PURGE',
    'INFO',
    'Automated PEM fuel-cell cathode purge cycle executed. Membrane relative humidity normalized to 88.5%.',
    '{"humidity_pre_pct": 92.4, "humidity_post_pct": 88.5, "purge_volume_l": 1.2}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '1 minute 50 seconds'),
    16,
    'MGU_K_REGEN_RECORD',
    'INFO',
    'Indianapolis braking zone kinetic harvest reached -584 kW peak regeneration at 798 V bus.',
    '{"regen_kw": -584.2, "front_split_pct": 52.0, "rear_split_pct": 48.0}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '1 minute 10 seconds'),
    16,
    'BOILOFF_RELIQUEFACTION',
    'INFO',
    'Stirling cryo-cooler re-liquefaction compressor active at 98% efficiency. Zero H2 lost to atmospheric venting.',
    '{"reliquefaction_flow_g_s": 0.42, "compressor_rpm": 6400}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '45 seconds'),
    16,
    'STACK_IMPEDANCE_CHECK',
    'INFO',
    'High-frequency EIS sweep confirms membrane resistance at 14.2 mOhm-cm2. Zero cell flooding detected.',
    '{"resistance_mohm_cm2": 14.2, "stoichiometry_lambda": 1.82}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '20 seconds'),
    16,
    'PIT_WINDOW_OPEN',
    'WARNING',
    'Pit window open in 4 laps. Current H2 remaining: 4.82 kg. Projected turnaround time: 42.0 seconds.',
    '{"h2_remaining_kg": 4.82, "laps_remaining": 4, "target_window": "Lap 22"}'::jsonb
),
(
    'a1b2c3d4-e5f6-7890-abcd-111111111111',
    timezone('utc'::text, now() - INTERVAL '5 seconds'),
    16,
    'FIA_HOMOLOGATION_BEACON',
    'OPERATIONAL',
    'FIA race direction telemetry handshake verified. All fuel flow and supercap voltage boundaries within 규정 tolerances.',
    '{"voltage_margin_v": 2.4, "power_limit_kw": 600.0, "compliance_state": "NOMINAL"}'::jsonb
);
