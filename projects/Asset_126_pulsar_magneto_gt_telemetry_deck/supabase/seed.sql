-- ============================================================================
-- PULSAR MAGNETO-GT // SEED DATA
-- Flagship Proto-13 & Testbed Proto-12 Telemetry Records & Sector Matrix
-- ============================================================================

-- Fixed UUIDs for relational consistency
DO $$
DECLARE
    v_proto13_id UUID := 'a1b2c3d4-e5f6-47a8-b9c0-112233445566';
    v_proto12_id UUID := 'b2c3d4e5-f6a7-48b9-c0d1-223344556677';
BEGIN

    -- 1. VEHICLE REGISTRY SEED
    INSERT INTO fusion_hypercar_vehicles (
        id, chassis_code, designation, core_architecture, max_plasma_temp_mk,
        peak_magnetic_field_tesla, total_power_kw, cryostat_spec, chassis_mass_kg, status
    ) VALUES 
    (
        v_proto13_id,
        'PROTO-13',
        'Pulsar Magneto-GT Tokamak Flagship Mk.IV',
        'Compact High-Field D-T Tokamak (ReBCO 2G-HTS)',
        18.50,
        14.20,
        1865,
        'Supercritical He-4 Loop @ 4.2K',
        1420,
        'OPERATIONAL'
    ),
    (
        v_proto12_id,
        'PROTO-12',
        'Pulsar Magneto-GT Testbed Mule (Field Rig)',
        'Sub-scale Poloidal Compression Tokamak (YBCO)',
        14.20,
        10.80,
        1490,
        'Subcooled Liquid Nitrogen + He-4 Hybrid',
        1480,
        'BENCH_TEST'
    )
    ON CONFLICT (chassis_code) DO UPDATE 
    SET designation = EXCLUDED.designation,
        total_power_kw = EXCLUDED.total_power_kw,
        status = EXCLUDED.status;

    -- 2. ALL 14 TRACK SECTORS (NÜRBURGRING-STYLE HYBRID HIGH-SPEED STINT)
    INSERT INTO fusion_sector_records (
        vehicle_id, stint_number, sector_number, sector_name, sector_time_sec,
        trap_speed_kmh, peak_temp_mk, mean_field_tesla, maglev_clearance_mm,
        power_output_kw, delta_to_optimal_sec, status, recorded_at
    ) VALUES
    (v_proto13_id, 1, 1,  'Tiergarten Launch Straight',   12.418, 372.4, 15.12, 12.45, 11.8, 1865.0, -0.042, 'OPTIMUM', NOW() - INTERVAL '140 seconds'),
    (v_proto13_id, 1, 2,  'Hatzenbach Poloidal Sweep',    19.642, 284.1, 14.85, 12.30, 10.5, 1720.0, +0.015, 'OPTIMUM', NOW() - INTERVAL '125 seconds'),
    (v_proto13_id, 1, 3,  'Hocheichen Magneto-Chicane',   14.881, 246.8, 15.30, 12.60,  9.8, 1680.0, +0.038, 'STIFFEN', NOW() - INTERVAL '110 seconds'),
    (v_proto13_id, 1, 4,  'Flugplatz Kinetic Crest',      18.230, 365.9, 15.65, 12.80, 13.2, 1890.0, -0.012, 'OPTIMUM', NOW() - INTERVAL '95 seconds'),
    (v_proto13_id, 1, 5,  'Schwedenkreuz V-Max Descent',  16.104, 388.5, 16.10, 13.10, 11.2, 1940.0, -0.089, 'RECORD',  NOW() - INTERVAL '80 seconds'),
    (v_proto13_id, 1, 6,  'Aremberg Magnetic Compression',17.925, 238.4, 15.40, 12.50,  9.5, 1610.0, +0.021, 'STIFFEN', NOW() - INTERVAL '68 seconds'),
    (v_proto13_id, 1, 7,  'Fuchsrohre Downforce Dip',     15.319, 352.0, 15.80, 12.95,  8.8, 1845.0, -0.005, 'OPTIMUM', NOW() - INTERVAL '55 seconds'),
    (v_proto13_id, 1, 8,  'Adenauer-Forst Symmetrizer',   20.145, 198.6, 14.90, 12.15, 12.0, 1520.0, +0.064, 'NOMINAL', NOW() - INTERVAL '42 seconds'),
    (v_proto13_id, 1, 9,  'Metzgesfeld High-G Apex',      17.780, 276.5, 15.25, 12.40, 10.0, 1715.0, +0.002, 'OPTIMUM', NOW() - INTERVAL '32 seconds'),
    (v_proto13_id, 1, 10, 'Kallenhard Toroidal Decel',    18.490, 215.2, 15.05, 12.20, 10.4, 1590.0, +0.019, 'OPTIMUM', NOW() - INTERVAL '24 seconds'),
    (v_proto13_id, 1, 11, 'Wehrseifen Cryo Recirc',      21.305, 174.9, 14.70, 12.05, 11.9, 1480.0, +0.052, 'NOMINAL', NOW() - INTERVAL '18 seconds'),
    (v_proto13_id, 1, 12, 'Breidscheid Magnetic Drop',    16.890, 268.0, 15.45, 12.55, 10.8, 1750.0, -0.014, 'OPTIMUM', NOW() - INTERVAL '12 seconds'),
    (v_proto13_id, 1, 13, 'Bergwerk Full Poloidal Surge', 19.420, 310.8, 15.90, 13.00, 11.5, 1875.0, -0.031, 'OPTIMUM', NOW() - INTERVAL '6 seconds'),
    (v_proto13_id, 1, 14, 'Galgenkopf V-Max Terminal',    15.092, 396.2, 16.42, 13.45, 12.1, 1980.0, -0.105, 'OVERDRIVE', NOW());

    -- 3. MAGLEV CORNER COIL STATUS (4 SUSPENSION / LEVITATION CORNERS)
    INSERT INTO maglev_coil_logs (
        vehicle_id, corner_position, ride_height_mm, repulsive_force_kn, damping_mode,
        motor_torque_nm, motor_power_kw, slip_angle_deg, coil_temp_k, recorded_at
    ) VALUES
    (v_proto13_id, 'FL', 11.8, 41.2, 'HIGH-G STIFFEN', 820.0, 466.0, -0.42, 4.18, NOW()),
    (v_proto13_id, 'FR', 12.1, 40.8, 'HIGH-G STIFFEN', 815.0, 464.0, +0.38, 4.20, NOW()),
    (v_proto13_id, 'RL', 11.6, 44.5, 'HIGH-G STIFFEN', 940.0, 468.0, -0.15, 4.19, NOW()),
    (v_proto13_id, 'RR', 11.7, 44.2, 'HIGH-G STIFFEN', 935.0, 467.0, +0.12, 4.21, NOW());

    -- 4. EIGHT VEHICLE ACTION & INCIDENT LOGS
    INSERT INTO magnetic_quench_events (
        vehicle_id, event_type, severity, coil_node_index, field_divergence_pct,
        description, mitigation_action, resolved, recorded_at
    ) VALUES
    (
        v_proto13_id,
        'PLASMA_OVERDRIVE_ENGAGED',
        'INFO',
        NULL,
        0.00,
        'Pilot actuated keyed Plasma Flux Overdrive switch on Galgenkopf terminal straight.',
        'Toroidal coil current stepped from 68 kA to 74 kA. Fusion output ramped to 1,980 kW.',
        TRUE,
        NOW() - INTERVAL '2 minutes'
    ),
    (
        v_proto13_id,
        'COIL_PRE_CHILL_CYCLE',
        'NOMINAL',
        4,
        0.02,
        'Cryostat subcooling pump cycled. Superconducting ReBCO tape stabilized at 4.18 Kelvin.',
        'Helium loop mass flow verified at 14.6 L/min; boil-off pressure regulated to 1.18 bar.',
        TRUE,
        NOW() - INTERVAL '8 minutes'
    ),
    (
        v_proto13_id,
        'TOROIDAL_FIELD_SYMMETRIZED',
        'NOMINAL',
        7,
        0.01,
        'Automated harmonic field shimming deployed across poloidal field coils 6, 7, and 8.',
        'Ripple coefficient decreased from 0.08% to 0.02% across mid-plane plasma cross-section.',
        TRUE,
        NOW() - INTERVAL '15 minutes'
    ),
    (
        v_proto13_id,
        'HELIUM_BOILOFF_PURGE',
        'INFO',
        NULL,
        0.00,
        'Transient flash vapor purged through rear aerodynamic diffuser nozzle assembly.',
        'Secondary accumulator pressure dropped from 1.45 bar to nominal 1.18 bar reserve.',
        TRUE,
        NOW() - INTERVAL '22 minutes'
    ),
    (
        v_proto13_id,
        'MAGLEV_HIGH_G_STIFFEN',
        'INFO',
        NULL,
        0.00,
        'Apex yaw sensor triggered emergency repulsive field stiffening at Bergwerk turn-in.',
        'Repulsive magnetic force increased to 44.5 kN; ride clearance maintained at 11.6 mm.',
        TRUE,
        NOW() - INTERVAL '31 minutes'
    ),
    (
        v_proto13_id,
        'BETA_LIMIT_THRESHOLD_WARN',
        'WARNING',
        9,
        0.85,
        'Troyon beta limit reached 99.4% during 390 km/h aero compression load spike.',
        'Dynamic magnetic shear injection engaged; beta stability restored to 99.8%.',
        TRUE,
        NOW() - INTERVAL '44 minutes'
    ),
    (
        v_proto13_id,
        'DIVERTOR_HEAT_SOAK_ALERT',
        'WARNING',
        11,
        0.45,
        'Tungsten monoblock divertor thermal sensor T-11 peaked at 1,140°C during regenerative braking.',
        'Auxiliary cryo coolant bypass valve 2B opened for 1.8 seconds. Temperature normalized.',
        TRUE,
        NOW() - INTERVAL '58 minutes'
    ),
    (
        v_proto13_id,
        'COLD_START_MAGNETIC_LEVITATION',
        'NOMINAL',
        NULL,
        0.00,
        'Cockpit telemetry deck initialized. Superconducting Meissner effect locked on all 4 corners.',
        'System passed 12-coil self-diagnostic matrix. Ready for high-speed fusion stint.',
        TRUE,
        NOW() - INTERVAL '75 minutes'
    );

    -- 5. REALISTIC HIGH-FREQUENCY TELEMETRY SNAPSHOTS
    INSERT INTO plasma_telemetry_snapshots (
        vehicle_id, speed_kmh, fusion_output_kw, toroidal_field_tesla,
        poloidal_field_tesla, plasma_temp_mk, beta_stability_percent,
        neutron_flux_10e14, helium_temp_kelvin, helium_pressure_bar,
        maglev_clearance_mm, operational_mode, flux_overdrive_active, recorded_at
    ) VALUES
    (v_proto13_id, 368.2, 1865.0, 12.40, 4.80, 15.20, 99.80, 4.85, 4.20, 1.18, 12.0, 'TOKAMAK EQUILIBRIUM', FALSE, NOW() - INTERVAL '5 seconds'),
    (v_proto13_id, 375.4, 1910.0, 12.75, 4.95, 15.45, 99.75, 5.02, 4.19, 1.19, 11.8, 'FLUX BOOST (V-Max)', FALSE, NOW() - INTERVAL '3 seconds'),
    (v_proto13_id, 388.9, 1975.0, 13.20, 5.15, 15.90, 99.65, 5.30, 4.18, 1.20, 11.5, 'FLUX BOOST (V-Max)', TRUE,  NOW() - INTERVAL '1 second'),
    (v_proto13_id, 396.2, 1980.0, 13.45, 5.30, 16.42, 99.85, 5.55, 4.18, 1.21, 12.1, 'PLASMA OVERDRIVE',     TRUE,  NOW());

END $$;
