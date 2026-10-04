-- ====================================================================
-- SOLARIS VAC-WING PROTO-12 & PROTO-11 INSTITUTIONAL SEED DATA
-- High-Speed Telemetry, 14 Lap Sectors, Valve Cycles, and Diagnostics
-- ====================================================================

-- 1. VEHICLE PROFILES
INSERT INTO rcs_hypercar_vehicles (
    id, 
    chassis_code, 
    vehicle_name, 
    model_generation, 
    max_drive_power_kw, 
    dry_mass_kg, 
    nitrogen_tank_capacity_kg, 
    max_storage_pressure_bar, 
    nozzle_count, 
    operational_status
) VALUES 
(
    '00000000-0000-0000-0000-000000000012', 
    'PROTO-12', 
    'Solaris Vac-Wing Flagship Interceptor', 
    'Gen 4 Orbital Cold-Gas RCS', 
    1640.00, 
    1280.00, 
    22.00, 
    350.00, 
    8, 
    'ACTIVE_TELEMETRY'
),
(
    '00000000-0000-0000-0000-000000000011', 
    'PROTO-11', 
    'Solaris Vac-Wing Aero Development Rig', 
    'Gen 3 Pneumatic Testbed', 
    1480.00, 
    1320.00, 
    20.00, 
    320.00, 
    8, 
    'STANDBY_BENCH'
)
ON CONFLICT (chassis_code) DO NOTHING;

-- 2. TELEMETRY SNAPSHOT FOR PROTO-12
INSERT INTO thruster_telemetry_snapshots (
    id,
    vehicle_id,
    recorded_at,
    ground_speed_kmh,
    drive_power_kw,
    lateral_g,
    longitudinal_g,
    vertical_g,
    total_thruster_thrust_kn,
    nitrogen_mass_kg,
    nitrogen_pressure_bar,
    battery_temp_celsius,
    inverter_output_voltage,
    telemetry_mode,
    slip_counter_active,
    active_nozzle_mask
) VALUES (
    '11111111-1111-1111-1111-111111110001',
    '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '4 seconds',
    355.20,
    1640.00,
    3.85,
    -1.42,
    2.15,
    14.20,
    18.40,
    348.50,
    28.40,
    984.60,
    'ORBITAL VECTORING',
    true,
    '11111111'
);

-- 3. 14 REALISTIC HIGH-SPEED SECTOR DYNAMICS RECORDS
INSERT INTO sector_dynamics_records (
    id,
    vehicle_id,
    recorded_at,
    lap_number,
    sector_number,
    sector_name,
    entry_speed_kmh,
    apex_speed_kmh,
    exit_speed_kmh,
    peak_lateral_g,
    gas_mass_used_grams,
    downforce_delta_kg,
    compressor_recharge_status
) VALUES 
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '140 seconds', 4, 1, 'Hangar Straight Launch',
    210.40, 312.80, 342.10, 1.25, 42.50, 480.00, 'REGEN_HARVESTING (+1.2 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '130 seconds', 4, 2, 'Orbital Turn 1 (Supersonic Entry)',
    342.10, 198.50, 246.00, 3.82, 185.20, 890.00, 'BRAKE_REGEN_PULSE (+4.8 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '120 seconds', 4, 3, 'Apex Zero-Slip Hairpin',
    246.00, 114.20, 182.70, 4.10, 240.00, 1120.00, 'MAX_COMPRESSION (+5.5 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '110 seconds', 4, 4, 'Solaris S-Chicane Inbound',
    182.70, 215.30, 260.40, 3.45, 110.40, 640.00, 'STEADY_STATE_BUFFER'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '100 seconds', 4, 5, 'Solaris S-Chicane Outbound',
    260.40, 238.10, 295.60, 3.65, 134.80, 710.00, 'PNEUMATIC_TRICKLE_CHARGE'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '90 seconds', 4, 6, 'Plasma Backstretch',
    295.60, 355.20, 362.40, 0.95, 25.00, 390.00, 'EXPANSION_OPTIMIZED'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '80 seconds', 4, 7, 'Braking G-Slam Zone 7',
    362.40, 168.00, 210.50, 2.90, 215.60, 1250.00, 'BRAKE_REGEN_PULSE (+6.1 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '70 seconds', 4, 8, 'Karman Vortex Sweeper',
    210.50, 224.70, 252.30, 3.78, 162.10, 830.00, 'REGEN_HARVESTING (+2.0 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '60 seconds', 4, 9, 'Atmospheric Carousel',
    252.30, 188.40, 220.10, 3.92, 198.40, 960.00, 'ACTIVE_COMPRESSION (+3.4 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '50 seconds', 4, 10, 'Sub-Floor Venturi Trench',
    220.10, 275.80, 308.20, 2.85, 88.00, 770.00, 'IDLE_PRESSURIZED'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '40 seconds', 4, 11, 'Apex Magnet Clamp Complex',
    308.20, 142.60, 195.00, 4.05, 230.50, 1310.00, 'BRAKE_REGEN_PULSE (+5.9 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '30 seconds', 4, 12, 'Thruster Exit Chute',
    195.00, 240.50, 280.00, 3.12, 120.20, 680.00, 'REGEN_HARVESTING (+1.8 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '20 seconds', 4, 13, 'Penultimate Blind Crest',
    280.00, 265.00, 305.40, 3.52, 145.00, 850.00, 'ACTIVE_COMPRESSION (+2.2 bar)'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '10 seconds', 4, 14, 'Final Mainstrafe Straight',
    305.40, 345.90, 355.20, 1.10, 38.00, 520.00, 'PEAK_STORAGE_REACHED (350 bar)'
);

-- 4. 4 DETAILED NITROGEN VALVE CYCLE LOGS
INSERT INTO nitrogen_gas_logs (
    id,
    vehicle_id,
    recorded_at,
    tank_pressure_bar,
    buffer_pressure_bar,
    gas_temp_celsius,
    mass_flow_rate_gps,
    compressor_state,
    compressor_power_draw_kw,
    valve_cycle_duty_pct,
    cumulative_gas_used_kg
) VALUES 
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '300 seconds', 350.00, 348.80, 18.20, 0.00, 'IDLE', 0.00, 0.00, 0.00
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '200 seconds', 346.50, 342.00, 19.50, 184.20, 'HARVESTING_REGEN', 24.50, 44.50, 1.25
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '100 seconds', 342.10, 335.40, 21.00, 320.80, 'MAX_COMPRESSION', 42.00, 78.20, 2.45
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '5 seconds', 348.50, 347.10, 20.40, 92.50, 'HARVESTING_REGEN', 18.80, 32.10, 3.60
);

-- 5. 8 REALISTIC VEHICLE ACTION & RCS DIAGNOSTIC EVENTS
INSERT INTO rcs_diagnostic_events (
    id,
    vehicle_id,
    recorded_at,
    event_type,
    severity,
    nozzle_id,
    impulse_duration_ms,
    description
) VALUES 
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '14 minutes', 'PRE_FLIGHT_ARM', 'INFO',
    'ALL_NOZZLES', 50, 'All 8 cold-gas solenoid solenoids calibrated at 350 bar test pressure.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '12 minutes', 'NITROGEN_TANK_REPRESSURIZED', 'INFO',
    'VESSEL_ALPHA', 0, 'Composite nitrogen vessel pressurized to 350.0 bar nominal ceiling.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '9 minutes', 'RCS_VECTOR_BURST_ENGAGED', 'INFO',
    'NOZZLE_FRONT_LEFT', 180, 'RCS Vector Burst engaged during Sector 3 high-yaw rotation.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '7 minutes', 'YAW_CORRECTION_PULSE', 'INFO',
    'NOZZLE_REAR_RIGHT', 95, 'Yaw correction thruster fire triggered by 0.08 rad/s slip delta.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '5 minutes', 'DOWNFORCE_SLAM_FIRE', 'INFO',
    'NOZZLE_SLAM_DUAL', 240, 'Twin downward slam thrusters fired at 14.2 kN total clamp in Sector 11.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '3 minutes', 'BRAKE_REGEN_CHARGE', 'INFO',
    'PNEUMATIC_PUMP', 850, 'Regenerative compressor harvested 28 kJ braking energy into nitrogen buffer.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '90 seconds', 'VALVE_DUTY_SPIKE', 'WARN',
    'NOZZLE_FRONT_RIGHT', 320, 'Corner vectoring solenoid exceeded 75% duty cycle during sustained lateral G.'
),
(
    gen_random_uuid(), '00000000-0000-0000-0000-000000000012',
    NOW() - INTERVAL '15 seconds', 'TELEMETRY_SYNC_NOMINAL', 'INFO',
    'SYSTEM_BUS', 0, 'Telemetry buffer synced with 0 dropped CAN bus packets across 8 nozzles.'
);
