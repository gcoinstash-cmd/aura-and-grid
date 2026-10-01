-- ============================================================================
-- Orbital In-Space Cryogenic Propellant Depot SCADA OS - Supabase Seed Data
-- 10+ Institutional Rows with Real LEO Cryogenic Telemetry
-- ============================================================================

-- 1. Insert Master Station
INSERT INTO depot_stations (
    id,
    station_callsign,
    orbital_regime,
    inclination_deg,
    semi_major_axis_km,
    eccentricity,
    operational_status,
    primary_docking_port_status,
    active_power_kw,
    solar_aspect_angle_deg,
    sun_shield_deploy_state
) VALUES (
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'Aura-Depot-Alpha Station 01',
    '450 km Circular • Inc 28.5°',
    28.50,
    6828.14,
    0.00012,
    'AUTONOMOUS_NOMINAL',
    'Port 2: Active (Chaser Docked)',
    28.40,
    42.00,
    'OPTIMAL_SHADOWED'
) ON CONFLICT (station_callsign) DO UPDATE 
SET updated_at = NOW();

-- 2. Insert Cryo Tanks (LOX & LCH4)
INSERT INTO cryo_tanks (
    id,
    station_id,
    tank_code,
    fluid_type,
    capacity_tonnes,
    current_mass_tonnes,
    fill_fraction_pct,
    ullage_pressure_kpa,
    liquid_temp_k,
    ullage_temp_k,
    boil_off_rate_kg_hr,
    vacuum_jacket_torr,
    mli_layer_count,
    vent_valve_status
) VALUES 
(
    'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'TANK-01-LOX',
    'LOX',
    151.50,
    142.40,
    94.00,
    240.20,
    90.15,
    94.80,
    0.012,
    1.4e-6,
    80,
    'CLOSED_AUTO'
),
(
    'c3d4e5f6-a7b8-9c0d-1e2f-3a4b5c6d7e8f',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'TANK-02-LCH4',
    'LCH4',
    52.40,
    48.20,
    92.00,
    238.80,
    111.45,
    115.10,
    0.018,
    1.8e-6,
    65,
    'CLOSED_AUTO'
);

-- 3. Insert Cryo Cooling Loops
INSERT INTO cryo_cooling_loops (
    id,
    station_id,
    subsystem_tag,
    cooling_cycle_type,
    cryocooler_power_kw,
    coldhead_temp_k,
    heat_exchanger_delta_t_k,
    jt_expansion_valve_pct,
    tvs_spray_pump_status,
    reliquefaction_rpm,
    compressor_shaft_power_kw,
    settlement_stability_index,
    qd_cryo_seal_temp_k,
    helium_purge_active,
    qd_leak_rate_sccm
) VALUES (
    'd4e5f6a7-b8c9-0d1e-2f3a-4b5c6d7e8f9a',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'CRYO-PT-BRAYTON-ALPHA',
    '20 K Pulse Tube Brayton Closed-Loop',
    4.20,
    20.40,
    1.40,
    38.50,
    'RUNNING',
    18400,
    4.20,
    99.20,
    92.00,
    false,
    0.0084
);

-- 4. Insert Propellant Transfer Operations Log (Past & Ongoing Missions)
INSERT INTO propellant_transfers (
    id,
    station_id,
    chaser_vehicle_id,
    docking_port_number,
    propellant_type,
    planned_mass_tonnes,
    transferred_mass_tonnes,
    transfer_rate_kg_min,
    chilldown_stage,
    isolation_valve_state,
    started_at,
    status
) VALUES 
(
    'e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'CHASER-ORION-FREIGHTER-9',
    2,
    'METHALOX_DUAL',
    35.00,
    12.45,
    120.00,
    'LINE_CHILLED_FLOWING',
    'OPEN_COMMITTED',
    NOW() - INTERVAL '42 minutes',
    'IN_PROGRESS'
),
(
    'f6a7b8c9-d0e1-2f3a-4b5c-6d7e8f9a0b1c',
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    'CISLUNAR-TUG-CYGNUS-XL',
    1,
    'LOX',
    22.50,
    22.50,
    145.00,
    'COMPLETE_PURGED',
    'ISOLATED_CLOSED',
    NOW() - INTERVAL '18 hours',
    'COMPLETED'
);

-- 5. Insert Telemetry Snaps (10 rows representing continuous orbital cycle)
INSERT INTO telemetry_snaps (
    station_id,
    recorded_at,
    lox_pressure_kpa,
    lch4_pressure_kpa,
    lox_temp_k,
    lch4_temp_k,
    solar_flux_w_m2,
    sun_aspect_angle_deg,
    boil_off_margin_pct,
    rcs_settling_accel_g,
    log_severity,
    audit_notes
) VALUES
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '90 minutes',
    239.4, 237.9, 90.10, 111.40, 1362.5, 38.0, 99.4, 0.0152, 'NOMINAL',
    'LEO Noon pass. Sunshield yaw aligned.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '80 minutes',
    239.8, 238.1, 90.11, 111.41, 1364.1, 39.5, 99.3, 0.0151, 'NOMINAL',
    'TVS spray-bar cycle active in LOX tank.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '70 minutes',
    240.0, 238.3, 90.12, 111.42, 1366.0, 41.0, 99.1, 0.0150, 'NOMINAL',
    'Brayton cooler heat lift steady at 4.2 kW.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '60 minutes',
    240.2, 238.6, 90.14, 111.44, 1367.2, 42.0, 98.9, 0.0149, 'NOMINAL',
    'Ullage pressure steady within +/- 0.5 kPa band.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '50 minutes',
    240.3, 238.7, 90.15, 111.45, 1365.8, 42.0, 98.9, 0.0150, 'NOMINAL',
    'Chaser vehicle rendezvous radar lock verified.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '40 minutes',
    240.1, 238.5, 90.15, 111.45, 1362.0, 42.0, 99.0, 0.0151, 'NOMINAL',
    'Docking Port 2 latched. Transfer line helium pre-purge passed.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '30 minutes',
    239.9, 238.4, 90.14, 111.44, 820.0, 44.0, 99.2, 0.0152, 'NOMINAL',
    'Depot enters penumbra. Solar flux attenuating.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '20 minutes',
    239.6, 238.2, 90.13, 111.43, 0.0, 45.0, 99.5, 0.0150, 'NOMINAL',
    'Depot in full Earth eclipse (umbra). Radiative cooling peak.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '10 minutes',
    239.7, 238.3, 90.13, 111.43, 0.0, 43.5, 99.5, 0.0149, 'NOMINAL',
    'Cryocooler coldhead temperature holding 20.40 K.'
),
(
    'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d',
    NOW() - INTERVAL '1 minute',
    240.2, 238.8, 90.15, 111.45, 1361.4, 42.0, 99.2, 0.0150, 'NOMINAL',
    'Sunrise terminator crossing. Zero boil-off thermal lock sustained.'
);
