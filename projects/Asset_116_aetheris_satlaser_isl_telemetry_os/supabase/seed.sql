-- =============================================================================
-- AETHERIS-MESH LEO CONSTELLATION: SATELLITE LASER ISL ARCHITECTURE
-- PostgreSQL / Supabase Seed Script
-- Realistic High-Fidelity Orbital, PAT, and Crosslink Telemetry Data
-- =============================================================================

-- Clear existing data cleanly
TRUNCATE terminal_commands, routing_manifest_hops, isl_routing_manifest, pat_telemetry_logs, active_crosslinks, optical_isl_terminals, constellation_satellites CASCADE;

-- -----------------------------------------------------------------------------
-- 1. SEED CONSTELLATION SATELLITES (24 Satellites across 8 planes)
-- Walker Delta 24/8/1 constellation configuration at 550km altitude
-- -----------------------------------------------------------------------------
INSERT INTO constellation_satellites (
    id, sat_code, orbital_plane, plane_slot, altitude_km, inclination_deg, true_anomaly_deg, raan_deg, battery_soc_pct, solar_flux_w, operational_status
) VALUES
-- Plane 1
('a0000001-0000-0000-0000-000000000001', 'SAT-01', 1, 1, 550.25, 97.42, 12.40, 0.00, 96.2, 2510.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000002', 'SAT-02', 1, 2, 549.80, 97.41, 132.40, 0.00, 94.8, 2480.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000003', 'SAT-03', 1, 3, 550.10, 97.43, 252.40, 0.00, 95.5, 2495.0, 'NOMINAL_OPERATIONAL'),

-- Plane 2 (SAT-04 is our prime operational host node)
('a0000001-0000-0000-0000-000000000004', 'SAT-04', 2, 1, 550.40, 97.40, 27.40, 45.00, 98.1, 2530.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000005', 'SAT-05', 2, 2, 550.15, 97.42, 147.40, 45.00, 93.4, 2460.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000006', 'SAT-06', 2, 3, 549.90, 97.39, 267.40, 45.00, 95.0, 2500.0, 'NOMINAL_OPERATIONAL'),

-- Plane 3
('a0000001-0000-0000-0000-000000000007', 'SAT-07', 3, 1, 550.05, 97.41, 42.40, 90.00, 97.0, 2520.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000008', 'SAT-08', 3, 2, 550.35, 97.40, 162.40, 90.00, 94.1, 2470.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000009', 'SAT-09', 3, 3, 549.95, 97.44, 282.40, 90.00, 95.8, 2505.0, 'NOMINAL_OPERATIONAL'),

-- Plane 4
('a0000001-0000-0000-0000-000000000010', 'SAT-10', 4, 1, 550.12, 97.38, 57.40, 135.00, 96.6, 2515.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000011', 'SAT-11', 4, 2, 550.28, 97.41, 177.40, 135.00, 93.9, 2465.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000012', 'SAT-12', 4, 3, 549.85, 97.40, 297.40, 135.00, 95.2, 2490.0, 'NOMINAL_OPERATIONAL'),

-- Plane 5
('a0000001-0000-0000-0000-000000000013', 'SAT-13', 5, 1, 550.30, 97.42, 72.40, 180.00, 97.3, 2525.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000014', 'SAT-14', 5, 2, 550.00, 97.39, 192.40, 180.00, 94.5, 2475.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000015', 'SAT-15', 5, 3, 550.18, 97.43, 312.40, 180.00, 96.1, 2510.0, 'NOMINAL_OPERATIONAL'),

-- Plane 6
('a0000001-0000-0000-0000-000000000016', 'SAT-16', 6, 1, 549.75, 97.40, 87.40, 225.00, 95.9, 2500.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000017', 'SAT-17', 6, 2, 550.45, 97.41, 207.40, 225.00, 93.2, 2450.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000018', 'SAT-18', 6, 3, 550.08, 97.38, 327.40, 225.00, 96.8, 2520.0, 'NOMINAL_OPERATIONAL'),

-- Plane 7
('a0000001-0000-0000-0000-000000000019', 'SAT-19', 7, 1, 550.22, 97.42, 102.40, 270.00, 97.7, 2530.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000020', 'SAT-20', 7, 2, 549.92, 97.40, 222.40, 270.00, 94.0, 2470.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000021', 'SAT-21', 7, 3, 550.14, 97.43, 342.40, 270.00, 95.6, 2505.0, 'NOMINAL_OPERATIONAL'),

-- Plane 8
('a0000001-0000-0000-0000-000000000022', 'SAT-22', 8, 1, 550.38, 97.39, 117.40, 315.00, 96.4, 2515.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000023', 'SAT-23', 8, 2, 550.02, 97.41, 237.40, 315.00, 93.7, 2460.0, 'NOMINAL_OPERATIONAL'),
('a0000001-0000-0000-0000-000000000024', 'SAT-24', 8, 3, 549.88, 97.40, 357.40, 315.00, 95.1, 2495.0, 'NOMINAL_OPERATIONAL');

-- -----------------------------------------------------------------------------
-- 2. SEED OPTICAL ISL TERMINALS (4 Heads on SAT-04 host)
-- -----------------------------------------------------------------------------
INSERT INTO optical_isl_terminals (
    id, satellite_id, terminal_code, terminal_role, laser_wavelength_nm, laser_frequency_thz, edfa_power_watts, edfa_pump_current_ma, edfa_stage2_gain_db, shutter_state, fsm_lock_status, qpd_error_x_urad, qpd_error_y_urad, gimbal_azimuth_deg, gimbal_elevation_deg, motor_temp_az_c, motor_temp_el_c, fsm_piezo_temp_c, radiator_temp_c
) VALUES
('b0000002-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'TERM-SAT04-FORE', 'FORE', 1550.52, 193.35, 4.82, 855.0, 34.20, 'OPEN', 'FINE_LOCKED', 0.142, -0.281, 142.84, -12.38, 24.30, 26.80, 18.70, -32.40),
('b0000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000004', 'TERM-SAT04-AFT', 'AFT', 1550.12, 193.40, 4.88, 862.0, 34.50, 'OPEN', 'FINE_LOCKED', -0.098, 0.185, 322.10, 11.45, 23.90, 25.40, 18.20, -33.10),
('b0000002-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000004', 'TERM-SAT04-PORT', 'PORT', 1550.92, 193.30, 4.75, 848.0, 33.90, 'OPEN', 'FINE_LOCKED', 0.220, 0.310, 52.40, -4.12, 25.10, 27.20, 19.10, -31.80),
('b0000002-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000004', 'TERM-SAT04-STBD', 'STARBOARD', 1551.32, 193.25, 4.65, 835.0, 33.10, 'OPEN', 'FINE_LOCKED', -0.315, -0.145, 234.60, 6.80, 25.80, 27.90, 19.50, -31.20);

-- -----------------------------------------------------------------------------
-- 3. SEED ACTIVE CROSSLINKS (4 Crosslinks attached to SAT-04)
-- -----------------------------------------------------------------------------
INSERT INTO active_crosslinks (
    id, source_terminal_id, target_satellite_id, link_identifier, link_direction, slant_range_km, range_rate_kms, doppler_shift_ghz, packet_latency_ms, osnr_db, link_margin_db, bit_error_rate, throughput_gbps, buffer_depth_kb, packet_drop_count, link_status
) VALUES
('c0000003-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000005', 'LINK-FORE-01', 'FORE', 1842.15, 0.012, 0.045, 6.145, 28.40, 7.20, '1.20e-11', 100.00, 142, 0, 'LOCKED'),
('c0000003-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000006', 'LINK-AFT-02', 'AFT', 1838.40, -0.008, -0.032, 6.132, 29.10, 7.80, '9.80e-12', 100.00, 118, 0, 'LOCKED'),
('c0000003-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000007', 'LINK-PORT-03', 'PORT', 3120.80, 1.420, 3.428, 10.410, 22.80, 4.60, '4.20e-11', 99.40, 384, 12, 'LOCKED'),
('c0000003-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000001', 'LINK-STBD-04', 'STARBOARD', 3450.25, -1.890, -4.560, 11.508, 21.20, 3.80, '8.50e-11', 98.80, 512, 38, 'LOCKED');

-- -----------------------------------------------------------------------------
-- 4. SEED PAT TELEMETRY LOGS (Historical time-series snapshots)
-- -----------------------------------------------------------------------------
INSERT INTO pat_telemetry_logs (
    id, terminal_id, ephemeris_jitter_urad, solar_exclusion_angle_deg, qpd_sum_voltage_mv, qpd_delta_x_mv, qpd_delta_y_mv, coarse_pointing_error_urad, fine_steering_angle_x_urad, fine_steering_angle_y_urad, edfa_temp_c, recorded_at
) VALUES
('d0000004-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 0.420, 38.40, 845.20, 12.40, -24.80, 1.80, 0.142, -0.281, 24.30, NOW() - INTERVAL '10 seconds'),
('d0000004-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000001', 0.415, 38.41, 846.10, 11.80, -23.90, 1.75, 0.138, -0.275, 24.31, NOW() - INTERVAL '8 seconds'),
('d0000004-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000001', 0.432, 38.42, 844.80, 13.10, -25.20, 1.84, 0.148, -0.289, 24.32, NOW() - INTERVAL '6 seconds'),
('d0000004-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000001', 0.418, 38.43, 845.90, 12.00, -24.10, 1.78, 0.140, -0.278, 24.30, NOW() - INTERVAL '4 seconds'),
('d0000004-0000-0000-0000-000000000005', 'b0000002-0000-0000-0000-000000000001', 0.422, 38.45, 845.30, 12.30, -24.60, 1.81, 0.142, -0.281, 24.31, NOW() - INTERVAL '2 seconds');

-- -----------------------------------------------------------------------------
-- 5. SEED ISL ROUTING MANIFEST & HOPS
-- -----------------------------------------------------------------------------
INSERT INTO isl_routing_manifest (
    id, route_hash, route_name, ingress_sat_code, egress_sat_code, hop_count, total_latency_ms, mesh_throughput_gbps, route_priority, route_status
) VALUES
('e0000005-0000-0000-0000-000000000001', '7f8a3d90e21c', 'TRANS-PACIFIC TRUNK ALPHA', 'SAT-04', 'SAT-19', 4, 28.18, 100.00, 'ULTRA_LOW_LATENCY', 'ACTIVE'),
('e0000005-0000-0000-0000-000000000002', '4a1b9c83f62e', 'TRANS-ATLANTIC COHERENT BACKHAUL', 'SAT-04', 'SAT-11', 3, 22.68, 100.00, 'BULK_BACKHAUL', 'ACTIVE'),
('e0000005-0000-0000-0000-000000000003', '9c2d1e04b78a', 'POLAR RELAY SVALBARD-MCMURDO', 'SAT-04', 'SAT-23', 5, 34.25, 98.40, 'DEEP_SPACE_RELAY', 'ACTIVE'),
('e0000005-0000-0000-0000-000000000004', '2e5f8a19d43c', 'NORTHERN TIER TT&C TELECOMMAND', 'SAT-04', 'SAT-02', 2, 12.28, 100.00, 'CRITICAL_TELECOMMAND', 'ACTIVE');

-- Hops for Route 1 (TRANS-PACIFIC TRUNK ALPHA)
INSERT INTO routing_manifest_hops (
    id, route_id, hop_index, from_sat_code, to_sat_code, isl_direction, hop_latency_ms, hop_margin_db
) VALUES
('f0000006-0000-0000-0000-000000000001', 'e0000005-0000-0000-0000-000000000001', 1, 'SAT-04', 'SAT-05', 'FORE', 6.14, 7.20),
('f0000006-0000-0000-0000-000000000002', 'e0000005-0000-0000-0000-000000000001', 2, 'SAT-05', 'SAT-08', 'PORT', 10.35, 5.10),
('f0000006-0000-0000-0000-000000000003', 'e0000005-0000-0000-0000-000000000001', 3, 'SAT-08', 'SAT-14', 'PORT', 10.42, 4.90),
('f0000006-0000-0000-0000-000000000004', 'e0000005-0000-0000-0000-000000000001', 4, 'SAT-14', 'SAT-19', 'STARBOARD', 11.27, 4.40);

-- -----------------------------------------------------------------------------
-- 6. SEED TERMINAL COMMANDS (Telemetry command log)
-- -----------------------------------------------------------------------------
INSERT INTO terminal_commands (
    id, terminal_id, command_name, command_payload, executed_by, execution_status, response_telemetry
) VALUES
('10000007-0000-0000-0000-000000000001', 'b0000002-0000-0000-0000-000000000001', 'CALIBRATE_FSM_BIAS', '{"axis": "XY", "target_urad": 0.0}'::jsonb, 'GROUND_STATION_ESRANGE', 'SUCCESS', '{"qpd_offset_x": 0.002, "qpd_offset_y": -0.001}'::jsonb),
('10000007-0000-0000-0000-000000000002', 'b0000002-0000-0000-0000-000000000001', 'EDFA_POWER_SETPOINT', '{"target_watts": 4.82, "pump_current_ma": 855}'::jsonb, 'SYSTEM_AUTONOMY', 'SUCCESS', '{"achieved_watts": 4.82, "gain_db": 34.2}'::jsonb),
('10000007-0000-0000-0000-000000000003', 'b0000002-0000-0000-0000-000000000003', 'REACQUIRE_BEACON_RASTER', '{"spiral_radius_mrad": 2.5, "timeout_ms": 1200}'::jsonb, 'AUTONOMOUS_PAT_CONTROLLER', 'SUCCESS', '{"beacon_snr_db": 22.8, "lock_time_ms": 342}'::jsonb),
('10000007-0000-0000-0000-000000000004', 'b0000002-0000-0000-0000-000000000004', 'PURGE_BUFFER_QUEUE', '{"direction": "STARBOARD", "reason": "FIFO_JITTER_RESET"}'::jsonb, 'OPERATOR_DESK_GCOIN', 'SUCCESS', '{"packets_flushed": 48, "queue_depth_kb": 0}'::jsonb);
