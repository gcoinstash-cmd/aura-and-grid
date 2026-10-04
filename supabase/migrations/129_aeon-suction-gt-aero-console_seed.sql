-- ==============================================================================
-- AEON SUCTION-GT // ACTIVE GROUND-EFFECT TELEMETRY SEED DATA
-- Target: Supabase / PostgreSQL Seed Fixtures
-- ==============================================================================

-- 1. VEHICLE PROFILES SEED (PROTO-10 Flagship & PROTO-09 Development Testbed)
INSERT INTO ground_effect_vehicles (
    id,
    chassis_code,
    model_name,
    prototype_stage,
    curb_weight_kg,
    powertrain_config,
    battery_capacity_kwh,
    dual_turbine_rating_cfm,
    max_vacuum_kpa,
    max_downforce_kg,
    skirt_material,
    status
) VALUES
(
    'a1000000-0000-0000-0000-000000000010',
    'AEON-PROTO-10',
    'Aeon Suction-GT Active Vacuum Hypercar',
    'PRE-PRODUCTION FLIGHT-SPEC',
    1395.00,
    'TRI-MOTOR AXIAL AWD 1680HP',
    88.00,
    22000,
    -52.80,
    2650.00,
    'KEVLAR-GRAPHENE ACTIVE FLEX PNEUMATIC',
    'ACTIVE'
),
(
    'a0900000-0000-0000-0000-000000000009',
    'AEON-PROTO-09',
    'Aeon Skirt Calibration & Aero Dyno Rig',
    'WIND-TUNNEL ROLLING ROAD',
    1480.00,
    'DUAL-MOTOR 1200HP TESTBED',
    75.00,
    18000,
    -44.50,
    2100.00,
    'TEFLON-TITANIUM MATRIX',
    'MAINTENANCE'
);

-- 2. VACUUM TELEMETRY SNAPSHOTS (Recent Stint Data for PROTO-10)
INSERT INTO vacuum_telemetry_snapshots (
    vehicle_id,
    recorded_at,
    ground_speed_kmh,
    underfloor_vacuum_kpa,
    total_downforce_kg,
    vacuum_mode,
    lateral_g,
    longitudinal_g,
    skirt_clearance_fl_mm,
    skirt_clearance_fr_mm,
    skirt_clearance_rl_mm,
    skirt_clearance_rr_mm,
    seal_integrity_pct,
    venturi_throat_velocity_ms
) VALUES
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '4 minutes', 284.50, -46.20, 2180.00, 'HIGH_DOWNFORCE', 2.85, 0.42, 4.10, 4.00, 3.80, 3.90, 99.2, 118.4),
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '3 minutes', 318.60, -48.20, 2250.00, 'HIGH_DOWNFORCE', 3.42, -0.15, 3.90, 3.85, 3.70, 3.75, 98.6, 126.8),
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '2 minutes', 342.10, -32.40, 1640.00, 'V_MAX_STREAMLINE', 0.95, 0.88, 7.20, 7.10, 6.80, 6.90, 89.4, 98.2),
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '1 minute',  192.40, -51.80, 2410.00, 'BRAKING_AIR_SUCTION', 1.82, -2.14, 3.40, 3.35, 3.50, 3.45, 99.7, 134.5);

-- 3. DUAL TURBINE FAN DIAGNOSTIC LOGS (4 entries)
INSERT INTO turbine_fan_logs (
    vehicle_id,
    recorded_at,
    fan_channel,
    rpm_actual,
    rpm_target,
    air_evacuation_cfm,
    blade_pitch_deg,
    inverter_temp_celsius,
    stator_temp_celsius,
    power_draw_kw,
    overboost_active,
    purge_cycle_active,
    bearing_vibration_g,
    fault_code
) VALUES
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '8 minutes', 'TURBINE_L', 21400, 21500, 9250, 28.5, 58.4, 66.2, 54.2, FALSE, FALSE, 0.038, 'NOMINAL'),
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '8 minutes', 'TURBINE_R', 21380, 21500, 9250, 28.5, 60.1, 67.8, 54.8, FALSE, FALSE, 0.041, 'NOMINAL'),
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '4 minutes', 'DUAL_SYNC', 24200, 24500, 20800, 34.0, 71.2, 79.5, 82.6, TRUE, FALSE, 0.052, 'OVERBOOST_ACTIVE'),
('a0900000-0000-0000-0000-000000000009', NOW() - INTERVAL '30 minutes', 'DUAL_SYNC', 18200, 18200, 15800, 26.0, 52.0, 58.3, 41.0, FALSE, FALSE, 0.029, 'NOMINAL');

-- 4. 14 REALISTIC HIGH-G CORNERING APEX TELEMETRY RECORDS
INSERT INTO cornering_apex_records (
    vehicle_id,
    corner_number,
    corner_name,
    track_name,
    apex_speed_kmh,
    entry_lateral_g,
    peak_lateral_g,
    exit_lateral_g,
    underfloor_suction_kpa,
    skirt_ground_gap_min_mm,
    seal_integrity_pct,
    turbine_kw_demand,
    aero_balance_front_pct
) VALUES
('a1000000-0000-0000-0000-000000000010', 1,  'Tamburello Inflow',        'AUTODROMO EMILIA GP', 248.4, 2.78, 3.12, 2.65, -46.8, 3.8, 98.9, 68.2, 47.2),
('a1000000-0000-0000-0000-000000000010', 2,  'Villeneuve Sweeper',       'AUTODROMO EMILIA GP', 262.1, 2.95, 3.35, 2.82, -48.5, 3.6, 99.1, 72.4, 46.8),
('a1000000-0000-0000-0000-000000000010', 3,  'Tosa Hairpin Compression', 'AUTODROMO EMILIA GP', 114.6, 2.15, 2.88, 2.40, -50.2, 3.2, 99.8, 76.5, 48.0),
('a1000000-0000-0000-0000-000000000010', 4,  'Piratella Crest Apex',     'AUTODROMO EMILIA GP', 218.0, 3.08, 3.42, 2.94, -49.1, 3.5, 98.4, 74.0, 46.2),
('a1000000-0000-0000-0000-000000000010', 5,  'Acque Minerali Turn-In',   'AUTODROMO EMILIA GP', 188.5, 3.15, 3.55, 3.10, -51.4, 3.4, 99.3, 79.1, 47.8),
('a1000000-0000-0000-0000-000000000010', 6,  'Acque Minerali Launch',    'AUTODROMO EMILIA GP', 205.2, 2.80, 3.22, 2.70, -47.6, 3.7, 98.8, 71.0, 46.5),
('a1000000-0000-0000-0000-000000000010', 7,  'Variante Alta Curbs',      'AUTODROMO EMILIA GP', 142.0, 2.45, 2.95, 2.30, -45.0, 4.2, 96.5, 66.8, 48.5),
('a1000000-0000-0000-0000-000000000010', 8,  'Rivazza 1 High-G Dip',     'AUTODROMO EMILIA GP', 228.7, 3.22, 3.68, 3.15, -52.1, 3.3, 99.6, 81.5, 46.9),
('a1000000-0000-0000-0000-000000000010', 9,  'Rivazza 2 Apex Hold',      'AUTODROMO EMILIA GP', 176.3, 2.90, 3.30, 2.85, -49.8, 3.5, 99.0, 75.3, 47.4),
('a1000000-0000-0000-0000-000000000010', 10, 'Parabolica Super-Radial',  'MONZA VELOCITA RING', 274.0, 3.10, 3.60, 3.25, -50.8, 3.5, 98.7, 78.4, 46.0),
('a1000000-0000-0000-0000-000000000010', 11, 'Curva Grande Transition',  'MONZA VELOCITA RING', 312.5, 2.65, 3.15, 2.70, -46.2, 4.0, 98.1, 69.5, 45.8),
('a1000000-0000-0000-0000-000000000010', 12, 'Lesmo 1 Compression Apex', 'MONZA VELOCITA RING', 204.8, 2.92, 3.38, 2.88, -48.7, 3.6, 99.0, 73.2, 47.0),
('a1000000-0000-0000-0000-000000000010', 13, 'Lesmo 2 Edge Traction',    'MONZA VELOCITA RING', 198.2, 3.01, 3.44, 2.92, -49.4, 3.5, 99.2, 74.8, 47.1),
('a1000000-0000-0000-0000-000000000010', 14, 'Ascari Complex Rapid Flick', 'MONZA VELOCITA RING', 236.9, 3.28, 3.74, 3.18, -52.4, 3.2, 99.5, 83.2, 47.5);

-- 5. 8 REALISTIC DRIVER ACTION & SYSTEM AERO EVENTS
INSERT INTO aero_event_logs (
    vehicle_id,
    recorded_at,
    event_type,
    severity,
    description,
    telemetry_delta,
    triggered_by
) VALUES
('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '14 minutes', 'CHASSIS_BOOT', 'INFO',
 'Ground-effect master controller initialized in AUTO ADAPTIVE mode. Dual fan motor sync locked.',
 '{"mode": "AUTO_ADAPTIVE", "init_skirt_gap_mm": 5.0}'::jsonb, 'SYS_KERNEL'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '12 minutes', 'SKIRT_SEAL_LOWERED', 'ACTION',
 'Pneumatic active skirt dropped from 5.0mm ride-height to 3.8mm high-vacuum track stance.',
 '{"skirt_delta_mm": -1.2, "seal_gain_pct": 11.4}'::jsonb, 'PILOT_CONTROL'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '9 minutes', 'MODE_TRANSITION', 'INFO',
 'Vacuum mode switched to HIGH DOWNFORCE (Corner Carver preset). Target suction set to -48.0 kPa.',
 '{"target_kpa": -48.0, "fan_rpm": 21500}'::jsonb, 'PILOT_CONTROL'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '7 minutes', 'OVERBOOST_ENGAGED', 'ACTION',
 'Turbine Overboost pulse fired for Turn 8 apex compression. Fan RPM spool to 24,200 RPM.',
 '{"boost_kw": 82.6, "peak_downforce_kg": 2550}'::jsonb, 'PILOT_HOTKEY'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '5 minutes', 'CURB_SEAL_DISTURBANCE', 'WARN',
 'Inner left skirt micro-lift detected over chicane kerb. Underfloor vacuum recovered in 18ms.',
 '{"delta_kpa_loss": 3.8, "recovery_ms": 18}'::jsonb, 'AERO_SAFETY_DAEMON'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '3 minutes', 'STREAMLINE_DUMP_TEST', 'ACTION',
 'V-MAX Streamline diffuser stall commanded down the straight. Drag reduced by 41.2%.',
 '{"drag_reduction_pct": 41.2, "suction_bleed_kpa": 14.5}'::jsonb, 'PILOT_CONTROL'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '2 minutes', 'PURGE_CYCLE_TRIGGER', 'ACTION',
 'Underfloor pneumatic seal purge cycle cleared track rubber particulates from rear diffuser mesh.',
 '{"purge_pressure_bar": 6.8, "debris_clear_status": "OK"}'::jsonb, 'CREW_TELEMETRY'),

('a1000000-0000-0000-0000-000000000010', NOW() - INTERVAL '45 seconds', 'THERMAL_STABILIZATION', 'INFO',
 'Turbine dual inverters stabilized at 58.4°C and 60.1°C with active dielectric fluid circulation.',
 '{"fan_l_temp_c": 58.4, "fan_r_temp_c": 60.1}'::jsonb, 'THERMAL_MANAGEMENT');
