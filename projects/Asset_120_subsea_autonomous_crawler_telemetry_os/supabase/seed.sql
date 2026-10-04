-- ====================================================================
-- AURA & GRID / GHOST FACTORY INSTITUTIONAL BLUEPRINT
-- Subsea Crawler Autonomous Mining Operations (Pacific Trench Sector 11B)
-- Seed Data: Missions, Telemetry, Waypoints, Harvest Manifest, Beacons
-- ====================================================================

-- 1. SEED MISSION
INSERT INTO missions (
    id,
    code,
    sector_name,
    crawler_designation,
    target_depth_meters,
    status,
    ballast_armed,
    ballast_blown,
    hopper_capacity_tons,
    current_hopper_payload_tons,
    operator_callsign
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'PAC-TR-11B-ALPHA',
    'Pacific Trench - Sector 11B (Clarion-Clipperton Zone Abyssal Plain)',
    'NAUTILUS-X9 TETHERLESS ABYSSAL HARVESTER',
    4180.00,
    'ACTIVE_HARVEST',
    true,
    false,
    60.00,
    42.85,
    'SYS-ARCHITECT-GHOST-9'
) ON CONFLICT (code) DO NOTHING;

-- 2. SEED WAYPOINTS (10 Bathymetry Navigation Nodes)
INSERT INTO waypoints (
    id,
    mission_id,
    waypoint_code,
    coord_x_meters,
    coord_y_meters,
    bathymetry_depth_meters,
    nodule_density_grade,
    estimated_cluster_yield_tons,
    status,
    sequence_order,
    standoff_obstacle_distance_m,
    geological_notes
) VALUES
('b1111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-01', 120.50, 45.20, 4178.50, 'High Grade Nodule Field A', 14.50, 'COMPLETED', 1, 22.0, 'Baseline deploy seabed touchdown site, fine pelagic clay substrate.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-02', 185.00, 110.40, 4181.20, 'Premium Polymetallic Bed 2', 18.20, 'COMPLETED', 2, 18.5, 'Dense nodule pavement, average diameter 8-12cm.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-03', 240.80, 175.60, 4183.00, 'Cobalt-Enriched Crust Delta', 11.40, 'COMPLETED', 3, 25.0, 'Slight slope gradient 4.2 deg, excellent track traction.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-04', 315.20, 220.10, 4180.40, 'High Grade Nodule Field B', 21.00, 'CURRENT_TARGET', 4, 15.0, 'Active harvesting envelope. Suction rake operating at 85% capacity.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-05', 380.00, 280.90, 4179.10, 'Nickel-Rich Sediment Basin', 16.80, 'SCHEDULED', 5, 20.0, 'Sub-bottom profiler indicates 0.6m sediment overburden.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-06', 445.60, 310.20, 4184.50, 'Escarpment Rim Deposit', 9.50, 'SCHEDULED', 6, 30.0, 'Approach scarp edge with active sonar obstacle detection.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-07', 520.10, 365.40, 4186.20, 'Hydrothermal Flank Silts', 12.30, 'SCHEDULED', 7, 28.0, 'Elevated temperature gradient (+0.4C above ambient baseline).'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-08', 590.40, 410.80, 4182.00, 'Polymetallic Sulfide Ridge', 22.50, 'SCHEDULED', 8, 16.0, 'High acoustic backscatter reflecting dense mineral crust.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-09', 660.00, 480.00, 4179.80, 'Abyssal Swale Cluster', 15.00, 'SCHEDULED', 9, 20.0, 'Secondary collector rendezvous zone.'),
('b1111111-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'WP-10', 740.20, 530.50, 4180.10, 'Hopper Full Discharge Beacon', 0.00, 'SCHEDULED', 10, 35.0, 'Vertical ascent staging point prior to tethered shuttle docking.');

-- 3. SEED HARVEST MANIFEST (10 Rich Mineral Lots)
INSERT INTO harvest_manifest (
    id,
    mission_id,
    lot_code,
    mineral_class,
    wet_weight_kg,
    dry_equivalent_kg,
    assay_mn_pct,
    assay_ni_pct,
    assay_co_pct,
    assay_cu_pct,
    extraction_zone,
    hopper_bay_code,
    logged_at
) VALUES
('c1111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-001', 'Grade-A Manganese Nodules', 4280.00, 3124.40, 29.80, 1.42, 0.28, 1.15, 'Trench Alpha Sector Flat', 'BAY-01A', NOW() - INTERVAL '3 hours 45 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-002', 'Grade-A Manganese Nodules', 4650.00, 3394.50, 30.10, 1.48, 0.31, 1.20, 'Trench Alpha Sector Flat', 'BAY-01B', NOW() - INTERVAL '3 hours 20 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-003', 'High-Cobalt Crust Aggregate', 3820.00, 2788.60, 24.50, 1.10, 0.84, 0.68, 'Escarpment Outcrop Flank', 'BAY-02A', NOW() - INTERVAL '2 hours 55 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-004', 'High-Cobalt Crust Aggregate', 4100.00, 2993.00, 25.20, 1.15, 0.88, 0.72, 'Escarpment Outcrop Flank', 'BAY-02B', NOW() - INTERVAL '2 hours 30 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-005', 'Polymetallic Seafloor Sulfide', 5100.00, 3825.00, 18.40, 2.85, 0.42, 3.40, 'Ridge Basalt Boundary', 'BAY-03A', NOW() - INTERVAL '2 hours 05 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-006', 'Polymetallic Seafloor Sulfide', 4890.00, 3667.50, 19.10, 2.70, 0.39, 3.25, 'Ridge Basalt Boundary', 'BAY-03B', NOW() - INTERVAL '1 hour 40 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-007', 'Rare-Earth Enriched Silts', 3450.00, 2415.00, 14.80, 0.95, 0.22, 0.85, 'South Hydrothermal Swale', 'BAY-04A', NOW() - INTERVAL '1 hour 15 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-008', 'Grade-A Manganese Nodules', 4420.00, 3226.60, 30.60, 1.52, 0.33, 1.25, 'Central Abyssal Basin', 'BAY-04B', NOW() - INTERVAL '50 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-009', 'Grade-A Manganese Nodules', 4180.00, 3051.40, 29.90, 1.45, 0.29, 1.18, 'Central Abyssal Basin', 'BAY-05A', NOW() - INTERVAL '25 minutes'),
('c1111111-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LOT-11B-010', 'Nickel-Rich Hydrothermal Core', 3960.00, 2970.00, 22.10, 3.12, 0.45, 2.90, 'Sector 11B Core Vent Trench', 'BAY-05B', NOW() - INTERVAL '5 minutes');

-- 4. SEED ACOUSTIC BEACON MESH (10 Deployed Seafloor Nodes)
INSERT INTO acoustic_beacons (
    id,
    mission_id,
    beacon_tag,
    transponder_freq_khz,
    signal_snr_db,
    battery_pct,
    sync_drift_microsec,
    seafloor_fix_latitude,
    seafloor_fix_longitude,
    location_descriptor,
    mesh_status,
    last_ping_at
) VALUES
('d1111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-A12', 18.50, 28.4, 94.2, 1.4, 14.289140, -125.642100, 'North Escarpment Crest Benchmark', 'LOCKED', NOW() - INTERVAL '2 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-B04', 19.20, 24.1, 88.6, 2.8, 14.281050, -125.631800, 'Deep Trench Valley Floor North', 'LOCKED', NOW() - INTERVAL '3 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-C09', 20.10, 26.8, 91.0, 0.9, 14.275400, -125.649200, 'South Escarpment Anchor Station', 'LOCKED', NOW() - INTERVAL '1 second'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-D01', 21.00, 31.2, 96.5, 0.4, 14.284200, -125.638400, 'Autonomous Harvester Local Relay', 'LOCKED', NOW()),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-E15', 22.40, 19.5, 78.4, 4.2, 14.269000, -125.654000, 'Southwest Hydrothermal Perimeter', 'LOCKED', NOW() - INTERVAL '4 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-F08', 23.00, 16.2, 72.1, 6.8, 14.298000, -125.625000, 'Northeast Sediment Drift Edge', 'SYNCHRONIZING', NOW() - INTERVAL '12 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-G22', 24.50, 22.0, 85.3, 1.8, 14.263500, -125.641000, 'Southern Abyssal Gateway Node', 'LOCKED', NOW() - INTERVAL '2 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-H03', 25.20, 14.1, 64.9, 9.1, 14.305000, -125.660000, 'Northwest Baseline Boundary Buoy', 'SIGNAL_DEGRADED', NOW() - INTERVAL '8 seconds'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-I11', 26.00, 25.4, 89.1, 1.1, 14.286700, -125.619000, 'Eastern Flank Seismic Profiler', 'LOCKED', NOW() - INTERVAL '1 second'),
('d1111111-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'BEACON-J07', 27.50, 27.8, 92.4, 0.7, 14.279800, -125.662000, 'Western Trench Safety Perimeter', 'LOCKED', NOW() - INTERVAL '2 seconds');

-- 5. SEED TELEMETRY LOGS (10 Consecutive Operational Ticks)
INSERT INTO telemetry_logs (
    id,
    mission_id,
    recorded_at,
    depth_meters,
    hydrostatic_pressure_mpa,
    sea_temp_celsius,
    salinity_psu,
    acoustic_ping_latency_ms,
    primary_hydraulic_psi,
    aux_hydraulic_psi,
    nodule_intake_rate_tph,
    battery_reserves_kwh,
    power_consumption_kw,
    slurry_density_gpcm3,
    track_magnetic_lock,
    purge_valve_active,
    heading_degrees
) VALUES
('e1111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '90 seconds', 4180.12, 41.80, 1.84, 34.71, 381, 3450, 2820, 14.2, 485.4, 48.2, 1.61, false, false, 142.1),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '80 seconds', 4180.18, 41.80, 1.84, 34.71, 379, 3455, 2818, 14.5, 485.0, 48.6, 1.62, false, false, 142.2),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '70 seconds', 4180.25, 41.81, 1.83, 34.70, 382, 3448, 2822, 14.8, 484.6, 49.1, 1.63, false, false, 142.4),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '60 seconds', 4180.31, 41.81, 1.83, 34.70, 380, 3462, 2825, 15.1, 484.2, 49.8, 1.64, false, false, 142.5),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '50 seconds', 4180.35, 41.81, 1.84, 34.72, 378, 3458, 2820, 14.9, 483.8, 48.9, 1.63, false, false, 142.5),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '40 seconds', 4180.38, 41.81, 1.84, 34.71, 383, 3450, 2815, 14.6, 483.4, 48.5, 1.62, false, false, 142.6),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '30 seconds', 4180.40, 41.81, 1.85, 34.71, 380, 3445, 2810, 14.7, 483.0, 48.4, 1.62, false, false, 142.7),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '20 seconds', 4180.42, 41.81, 1.84, 34.70, 379, 3452, 2818, 15.0, 482.6, 49.0, 1.63, false, false, 142.7),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW() - INTERVAL '10 seconds', 4180.45, 41.82, 1.84, 34.70, 381, 3460, 2824, 15.3, 482.2, 49.5, 1.64, false, false, 142.8),
('e1111111-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', NOW(),                     4180.48, 41.82, 1.84, 34.71, 380, 3458, 2820, 14.8, 481.8, 48.7, 1.62, false, false, 142.8);

-- 6. SEED ROBOTIC ARM DIAGNOSTICS (10 Historical Joint States)
INSERT INTO robotic_arm_diagnostics (
    id,
    mission_id,
    base_yaw_deg,
    boom_pitch_deg,
    stick_pitch_deg,
    wrist_roll_deg,
    wrist_pitch_deg,
    gripper_clamp_kn,
    hydraulic_circuit_temp_celsius,
    suction_depression_kpa,
    active_kinematic_pose,
    created_at
) VALUES
('f1111111-9c0b-4ef8-bb6d-6bb9bd380001', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  12.4, 35.0, 68.2, -15.4, 42.1, 45.0, 41.8, 82.5, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '45 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380002', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  15.2, 36.2, 69.1, -12.1, 43.0, 46.2, 42.0, 84.0, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '40 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380003', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  18.0, 37.5, 71.0,  -8.5, 44.5, 48.0, 42.1, 85.2, 'NODULE_RECLAMATION',  NOW() - INTERVAL '35 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380004', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  22.1, 38.0, 72.4,  -5.0, 45.2, 50.1, 42.3, 86.1, 'NODULE_RECLAMATION',  NOW() - INTERVAL '30 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380005', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  20.4, 35.8, 70.0,  -6.2, 44.0, 47.5, 42.4, 84.8, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '25 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380006', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  14.2, 33.1, 66.5, -11.0, 41.5, 44.8, 42.2, 83.2, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '20 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380007', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',   8.5, 30.5, 62.0, -16.2, 39.0, 42.0, 42.1, 81.0, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '15 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380008', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',   2.1, 28.0, 58.5, -20.4, 36.4, 39.5, 42.0, 79.5, 'SAMPLING_CORE',     NOW() - INTERVAL '10 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380009', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -4.5, 32.4, 64.0, -18.0, 40.2, 43.1, 42.5, 82.0, 'SEABED_RAKE_ACTIVE', NOW() - INTERVAL '5 minutes'),
('f1111111-9c0b-4ef8-bb6d-6bb9bd380010', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',  -1.2, 34.8, 67.5, -14.2, 42.8, 45.4, 42.6, 84.1, 'SEABED_RAKE_ACTIVE', NOW());
