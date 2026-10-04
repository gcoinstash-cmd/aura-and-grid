-- =============================================================================
-- AEGIS-SWARM PERIMETER DEFENSE COMMAND
-- Database Seed Data: PostgreSQL / Supabase
-- Realistic operational data for Swarm Fleet (16 drones), Bogeys, EW, & Engagements
-- =============================================================================

-- Clean previous seed entries in dependency order
DELETE FROM public.intercept_engagements;
DELETE FROM public.radar_contacts;
DELETE FROM public.swarm_nodes;
DELETE FROM public.ew_spectrum_bands;
DELETE FROM public.hpm_emitters;
DELETE FROM public.defense_sectors;

-- 1. Insert Institutional Sector Hub
INSERT INTO public.defense_sectors (
    id,
    sector_code,
    sector_name,
    threat_level,
    inner_exclusion_radius_m,
    buffer_zone_radius_m,
    outer_perimeter_radius_m,
    active_bogeys_count,
    airborne_nodes_count,
    master_arm_authorized
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'SECTOR-SIERRA-06',
    'Aegis High-Security Perimeter Mesh 06',
    'DEFCON 3 / ELEVATED',
    1000.00,
    5000.00,
    10000.00,
    2,
    16,
    FALSE
);

-- 2. Insert Swarm Autonomous Patrol Nodes (SWARM-01 through SWARM-16)
INSERT INTO public.swarm_nodes (
    id,
    sector_id,
    node_identifier,
    callsign,
    operational_status,
    altitude_m_agl,
    airspeed_knots,
    battery_percentage,
    battery_runtime_min,
    payload_mode,
    heading_degrees,
    pos_x_m,
    pos_y_m,
    sensor_fov_deg,
    target_lock_id,
    mesh_signal_snr_db
) VALUES
('b1111111-1111-4111-8111-111111111101', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-01', 'Aegis Vector 01', 'AIRBORNE // PATROL', 245.00, 68.4, 94.2, 52, 'EO/IR Optical', 34.0, 1800.0, 2400.0, 80.0, NULL, 36.8),
('b1111111-1111-4111-8111-111111111102', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-02', 'Aegis Vector 02', 'AIRBORNE // PATROL', 260.00, 71.0, 91.0, 48, 'RF Jammer', 72.0, 3100.0, 1400.0, 75.0, NULL, 34.2),
('b1111111-1111-4111-8111-111111111103', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-03', 'Aegis Vector 03', 'INTERCEPT VECTOR', 310.00, 92.5, 87.5, 41, 'Kinetic Net', 115.0, 4200.0, -800.0, 90.0, 'BOGEY-ALPHA', 32.5),
('b1111111-1111-4111-8111-111111111104', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-04', 'Aegis Vector 04', 'AIRBORNE // PATROL', 230.00, 64.0, 89.2, 46, 'EO/IR Optical', 158.0, 2900.0, -2600.0, 75.0, NULL, 35.0),
('b1111111-1111-4111-8111-111111111105', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-05', 'Aegis Vector 05', 'AIRBORNE // PATROL', 280.00, 69.2, 85.0, 42, 'LIDAR Recon', 205.0, 1100.0, -3800.0, 85.0, NULL, 33.1),
('b1111111-1111-4111-8111-111111111106', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-06', 'Aegis Vector 06', 'AIRBORNE // PATROL', 255.00, 66.8, 86.4, 43, 'EO/IR Optical', 248.0, -1600.0, -3200.0, 80.0, NULL, 34.7),
('b1111111-1111-4111-8111-111111111107', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-07', 'Aegis Vector 07', 'INTERCEPT VECTOR', 340.00, 96.0, 82.1, 37, 'Kinetic Net', 290.0, -3400.0, -1200.0, 90.0, 'BOGEY-BRAVO', 31.9),
('b1111111-1111-4111-8111-111111111108', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-08', 'Aegis Vector 08', 'AIRBORNE // PATROL', 235.00, 65.5, 93.8, 51, 'RF Jammer', 330.0, -2800.0, 1900.0, 75.0, NULL, 36.1),
('b1111111-1111-4111-8111-111111111109', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-09', 'Aegis Sentinel 09', 'AIRBORNE // PATROL', 190.00, 58.0, 88.0, 44, 'EO/IR Optical', 12.0, 800.0, 1500.0, 70.0, NULL, 38.2),
('b1111111-1111-4111-8111-111111111110', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-10', 'Aegis Sentinel 10', 'AIRBORNE // PATROL', 210.00, 60.5, 87.2, 43, 'LIDAR Recon', 60.0, 1900.0, 900.0, 75.0, NULL, 37.9),
('b1111111-1111-4111-8111-111111111111', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-11', 'Aegis Sentinel 11', 'AIRBORNE // PATROL', 205.00, 61.0, 90.4, 47, 'EO/IR Optical', 135.0, 1600.0, -1400.0, 70.0, NULL, 38.0),
('b1111111-1111-4111-8111-111111111112', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-12', 'Aegis Sentinel 12', 'AIRBORNE // PATROL', 215.00, 59.5, 86.8, 42, 'RF Jammer', 190.0, 300.0, -2100.0, 75.0, NULL, 37.4),
('b1111111-1111-4111-8111-111111111113', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-13', 'Aegis Sentinel 13', 'AIRBORNE // PATROL', 220.00, 62.0, 84.5, 39, 'EO/IR Optical', 235.0, -1400.0, -1600.0, 70.0, NULL, 36.9),
('b1111111-1111-4111-8111-111111111114', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-14', 'Aegis Sentinel 14', 'AIRBORNE // PATROL', 195.00, 58.5, 91.6, 49, 'Kinetic Net', 280.0, -2000.0, 400.0, 80.0, NULL, 37.5),
('b1111111-1111-4111-8111-111111111115', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-15', 'Aegis Sentinel 15', 'AIRBORNE // PATROL', 225.00, 63.2, 89.0, 45, 'EO/IR Optical', 320.0, -1100.0, 1800.0, 70.0, NULL, 38.1),
('b1111111-1111-4111-8111-111111111116', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'SWARM-16', 'Aegis Sentinel 16', 'AIRBORNE // PATROL', 240.00, 67.0, 81.0, 36, 'LIDAR Recon', 355.0, 200.0, 2200.0, 85.0, NULL, 36.5);

-- 3. Insert Unidentified Radar Contacts (BOGEY-ALPHA, BOGEY-BRAVO)
INSERT INTO public.radar_contacts (
    id,
    sector_id,
    contact_code,
    transponder_code,
    threat_tier,
    classification,
    estimated_speed_knots,
    heading_degrees,
    current_range_m,
    altitude_m_agl,
    time_to_breach_sec,
    status,
    assigned_interceptor_id
) VALUES
(
    'c1111111-2222-4222-8222-222222222201',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'BOGEY-ALPHA',
    'UNKNOWN // UNREGISTERED',
    'CRITICAL',
    'Fixed-Wing Fast Recon Drone',
    148.00,
    142.00,
    6420.00,
    320.00,
    148,
    'INBOUND',
    'b1111111-1111-4111-8111-111111111103'
),
(
    'c1111111-2222-4222-8222-222222222202',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'BOGEY-BRAVO',
    'SPOOFED_HEX // 0x88F4A',
    'HOSTILE',
    'Rotary Loitering Munition',
    192.00,
    310.00,
    4180.00,
    480.00,
    86,
    'INTERCEPTING',
    'b1111111-1111-4111-8111-111111111107'
);

-- 4. Insert Electronic Warfare Spectrum Bands
INSERT INTO public.ew_spectrum_bands (
    sector_id,
    band_name,
    center_freq_mhz,
    noise_floor_dbm,
    peak_signal_dbm,
    jamming_detected,
    jamming_type,
    countermeasure_active
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2.4 GHz ISM Command Link', 2440.00, -96.2, -44.0, FALSE, 'NONE', FALSE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '5.8 GHz Telemetry & Video Downlink', 5800.00, -92.5, -28.4, TRUE, 'CHIRP SWEEP', TRUE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GNSS L1 Frequency (1575.42 MHz)', 1575.42, -98.0, -38.2, TRUE, 'CARRIER SPOOF', TRUE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'GNSS L2 Frequency (1227.60 MHz)', 1227.60, -97.4, -62.0, FALSE, 'NONE', FALSE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'UHF Tactical Mesh (433 MHz)', 433.92, -101.0, -51.2, FALSE, 'NONE', FALSE),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'X-Band Perimeter Doppler (9.8 GHz)', 9800.00, -94.0, -32.8, FALSE, 'NONE', FALSE);

-- 5. Insert High-Power Microwave (HPM) Emitters
INSERT INTO public.hpm_emitters (
    sector_id,
    emitter_identifier,
    power_kw,
    capacitor_charge_pct,
    gimbal_azimuth_deg,
    gimbal_elevation_deg,
    system_temperature_c,
    coolant_pressure_bar,
    emitter_status
) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'HPM-STATION-PRIMARY-01', 120.00, 94.20, 284.50, 32.80, 42.10, 6.40, 'STANDBY // ARMED'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'HPM-STATION-AUXILIARY-02', 85.00, 88.60, 112.00, 24.10, 38.50, 6.20, 'STANDBY // READY');

-- 6. Insert Historical Intercept Engagement Ledger (Audit trail)
INSERT INTO public.intercept_engagements (
    sector_id,
    node_id,
    contact_id,
    countermeasure_type,
    authorization_tier,
    authorized_by,
    engagement_status,
    initial_target_range_m,
    outcome,
    telemetry_snapshot
) VALUES
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111103',
    'c1111111-2222-4222-8222-222222222201',
    'KINETIC_NET',
    'COMMANDER_KEY_VERIFIED',
    'WATCH_OFFICER // DEF-06',
    'IN_FLIGHT',
    6420.00,
    'VECTOR_CLOSING_EST_INTERCEPT_94S',
    '{"closing_speed_kts": 240.5, "guidance": "RADAR_LIDAR_FUSION", "confidence": 0.96}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111107',
    'c1111111-2222-4222-8222-222222222202',
    'RF_DOWNLINK_DISRUPT',
    'AUTONOMOUS_INTERCEPT_POLICY',
    'AEGIS_AUTO_ENGAGE_MESH',
    'IN_FLIGHT',
    4180.00,
    'JAMMER_BURST_ENGAGED_CARRIER_OFFLINE',
    '{"tx_power_dbm": 48.0, "targeted_band": "5.8GHz", "jamming_pattern": "SWEEP_CHIRP"}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111102',
    NULL,
    'HPM_DIRECTED_ENERGY',
    'COMMANDER_KEY_VERIFIED',
    'COL_V_MARKOVA // AUTH-99',
    'COMPLETED',
    2850.00,
    'PROPULSION_DISABLED_SAFE_FALL',
    '{"peak_pulse_kw": 120.0, "pulse_duration_ms": 450, "target_signature": "HEX_0x44B"}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111108',
    NULL,
    'KINETIC_NET',
    'AUTONOMOUS_INTERCEPT_POLICY',
    'AEGIS_AUTO_ENGAGE_MESH',
    'COMPLETED',
    1420.00,
    'TARGET_CONTAINED_RECOVERED',
    '{"net_deployment_speed_mps": 54.0, "chute_deployed": true, "integrity": "INTACT"}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111104',
    NULL,
    'AERO_SHADOW',
    'AUTONOMOUS_INTERCEPT_POLICY',
    'AEGIS_AUTO_ENGAGE_MESH',
    'COMPLETED',
    4900.00,
    'AIRSPACE_ESCORT_OUT_OF_SECTOR',
    '{"duration_sec": 380, "escort_vector_deg": 180, "breach_averted": true}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111101',
    NULL,
    'RF_DOWNLINK_DISRUPT',
    'AUTONOMOUS_INTERCEPT_POLICY',
    'AEGIS_AUTO_ENGAGE_MESH',
    'COMPLETED',
    3800.00,
    'LINK_SEVERED_FORCED_LAND',
    '{"protocol": "FAILSAFE_RETURN_SPOOF", "time_to_ground_sec": 42}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111105',
    NULL,
    'KINETIC_NET',
    'COMMANDER_KEY_VERIFIED',
    'WATCH_OFFICER // DEF-06',
    'COMPLETED',
    1950.00,
    'TARGET_CONTAINED_RECOVERED',
    '{"payload": "BALLISTIC_KEVLAR_CANISTER", "altitude_m": 185}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111106',
    NULL,
    'HPM_DIRECTED_ENERGY',
    'COMMANDER_KEY_VERIFIED',
    'OPERATOR // DEF-06-ALPHA',
    'COMPLETED',
    3100.00,
    'PROPULSION_DISABLED_SAFE_FALL',
    '{"gimbal_track_duration_s": 3.2, "avionics_failure_observed": true}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111111',
    NULL,
    'RF_DOWNLINK_DISRUPT',
    'AUTONOMOUS_INTERCEPT_POLICY',
    'AEGIS_AUTO_ENGAGE_MESH',
    'COMPLETED',
    4600.00,
    'LINK_SEVERED_FORCED_LAND',
    '{"signal_jammer_dbm": 42.5, "carrier_suppression": "TOTAL"}'::jsonb
),
(
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b1111111-1111-4111-8111-111111111114',
    NULL,
    'KINETIC_NET',
    'COMMANDER_KEY_VERIFIED',
    'COL_V_MARKOVA // AUTH-99',
    'COMPLETED',
    1150.00,
    'TARGET_CONTAINED_RECOVERED',
    '{"canister_charge": "NOMINAL", "retrieval_beacon": "ACTIVATED"}'::jsonb
);
