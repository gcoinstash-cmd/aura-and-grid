-- ==============================================================================
-- APEX-ASCENT ORBITAL TETHER & HEAVY CLIMBER TELEMETRY ENGINE
-- PostgreSQL Seed Dataset (Minimum 10+ rows per core table)
-- Domain: Space Elevator Infrastructure & Climber Robotics
-- ==============================================================================

-- 1. Insert Primary Climber Carriage (HC-12) & Secondary Climbers
INSERT INTO climbers (id, designation, chassis_class, ascent_status, current_altitude_km, ascent_velocity_kmh, beamed_power_mw, tether_strain_gpa, core_temp_c, target_destination, ground_laser_array) VALUES
('a0000000-0000-0000-0000-000000000001', 'HEAVY CLIMBER CARRIAGE HC-12', 'HEAVY_CARRIAGE_GEN4', 'ASCENDING', 14280.000, 220.00, 4.80, 68.40, 24.20, 'GEO_APEX_TERMINAL_35786KM', 'GALAPAGOS_EQUATORIAL_820NM'),
('a0000000-0000-0000-0000-000000000002', 'LIGHT INTERCEPTOR CLIMBER LC-04', 'RAPID_SURVEYOR_GEN3', 'DECELERATING', 32410.500, 180.00, 2.10, 71.20, 21.80, 'GEO_APEX_TERMINAL_35786KM', 'GALAPAGOS_EQUATORIAL_820NM'),
('a0000000-0000-0000-0000-000000000003', 'HEAVY UTILITY TETHER CRANE UC-09', 'HEAVY_CARRIAGE_GEN4', 'STATION_DOCKED', 35786.000, 0.00, 0.40, 74.80, 19.50, 'GEO_APEX_TERMINAL_35786KM', 'ORBITAL_SUN_MIRROR_ARRAY_B');

-- 2. Insert Pressurized Cargo Manifest Pods (POD-GEO-01 through POD-GEO-10)
INSERT INTO cargo_manifest (id, pod_code, climber_id, payload_name, cargo_class, mass_kg, atmospheric_integrity_pct, transit_progress_pct, eta_hours, power_draw_kwh_km, priority_tier, destination, status, loaded_at) VALUES
('b0000000-0000-0000-0000-000000000001', 'POD-GEO-01', 'a0000000-0000-0000-0000-000000000001', 'Orbital Habitat Life-Support Ring Segment Alpha', 'HABITAT_RING', 12000.00, 100.00, 39.90, 97.7, 14.80, 'CRITICAL', 'GEO_HABITAT_RING_ALPHA', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000002', 'POD-GEO-02', 'a0000000-0000-0000-0000-000000000001', 'High-Flux Multi-Junction Photovoltaic Array Spine', 'SOLAR_ARRAY_SHEET', 8500.00, 99.98, 39.90, 97.7, 11.20, 'TIER_1', 'GEO_POWER_STATION_BETA', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000003', 'POD-GEO-03', 'a0000000-0000-0000-0000-000000000001', 'Cryogenic Liquid Xenon Ion Thruster Bladder Tank', 'CRYO_GAS', 11400.00, 99.85, 39.90, 97.7, 16.50, 'CRITICAL', 'COUNTERWEIGHT_BOOSTER_STAGE', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000004', 'POD-GEO-04', 'a0000000-0000-0000-0000-000000000001', 'Deep Space Communications Transceiver Bus Mk-IV', 'SATELLITE_BUS', 6200.00, 100.00, 39.90, 97.7, 9.40, 'TIER_1', 'GEO_RELAY_PLATFORM_GAMMA', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000005', 'POD-GEO-05', 'a0000000-0000-0000-0000-000000000001', 'Lunar Polar Regolith Autonomous Excavator Rover', 'ROVER_CHASSIS', 9800.00, 100.00, 39.90, 97.7, 13.10, 'TIER_2', 'GEO_INTERPLANETARY_TRANSFER_DOCK', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000006', 'POD-GEO-06', 'a0000000-0000-0000-0000-000000000001', 'Zero-G High-Entropy Alloy Metallurgy Induction Furnace', 'METALLURGY_FURNACE', 14200.00, 100.00, 39.90, 97.7, 18.20, 'TIER_1', 'GEO_ORBITAL_FOUNDRY_NODE', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000007', 'POD-GEO-07', 'a0000000-0000-0000-0000-000000000001', 'High-Resolution Cosmic Ray Astrophysics Spectrometer', 'SPECTROMETER_MODULE', 4800.00, 100.00, 39.90, 97.7, 8.10, 'TIER_2', 'APEX_OBSERVATORY_STATION', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000008', 'POD-GEO-08', 'a0000000-0000-0000-0000-000000000001', 'Ultra-Dense Carbon Nanotube Spool Repair Reel', 'SOLAR_ARRAY_SHEET', 7300.00, 100.00, 39.90, 97.7, 10.60, 'CRITICAL', 'TETHER_ANCHOR_GEO_STATION', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000009', 'POD-GEO-09', 'a0000000-0000-0000-0000-000000000001', 'Pressurized Hydroponic Biomass Chamber Module 4B', 'HABITAT_RING', 11500.00, 100.00, 39.90, 97.7, 15.00, 'TIER_1', 'GEO_HABITAT_RING_ALPHA', 'IN_TRANSIT', NOW() - INTERVAL '38 hours'),
('b0000000-0000-0000-0000-000000000010', 'POD-GEO-10', 'a0000000-0000-0000-0000-000000000001', 'Bulk Titanium Structural Truss Members (32-Pack)', 'METALLURGY_FURNACE', 16000.00, 100.00, 39.90, 97.7, 19.80, 'BULK_FREIGHT', 'GEO_SPACECRAFT_SHIPYARD', 'IN_TRANSIT', NOW() - INTERVAL '38 hours');

-- 3. Insert 8-Wheel Magnetic Pinch Traction Drive Diagnostics
INSERT INTO traction_drive_telemetry (id, climber_id, recorded_at, wheel_index, torque_nm, rpm, slip_ratio_pct, pinch_force_kn, motor_temp_c, regenerative_power_kw, status) VALUES
('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NOW(), 1, 1540.20, 318.4, 0.019, 48.60, 42.10, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW(), 2, 1535.80, 318.5, 0.021, 48.55, 41.90, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW(), 3, 1552.10, 318.6, 0.018, 48.70, 43.40, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NOW(), 4, 1548.40, 318.3, 0.022, 48.62, 42.80, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', NOW(), 5, 1515.60, 318.5, 0.020, 48.40, 40.90, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', NOW(), 6, 1522.00, 318.4, 0.020, 48.48, 41.20, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', NOW(), 7, 1530.90, 318.7, 0.023, 48.52, 41.70, 0.00, 'NOMINAL'),
('c0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', NOW(), 8, 1538.30, 318.5, 0.019, 48.58, 42.00, 0.00, 'NOMINAL');

-- 4. Insert Photovoltaic Receivers Telemetry Points
INSERT INTO photovoltaic_receivers (id, climber_id, recorded_at, array_voltage_v, array_current_a, beam_flux_mw_m2, optical_alignment_jitter_mrad, heat_pipe_rejection_mw, radiator_temp_k, multi_junction_efficiency_pct, status) VALUES
('d0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '40 minutes', 1198.40, 4005.00, 8.640, 0.038, 1.32, 341.20, 58.42, 'OPTIMAL'),
('d0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 minutes', 1201.20, 3995.00, 8.655, 0.041, 1.34, 342.10, 58.39, 'OPTIMAL'),
('d0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 minutes', 1200.50, 4001.00, 8.660, 0.043, 1.35, 342.50, 58.45, 'OPTIMAL'),
('d0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 minutes', 1202.80, 3990.00, 8.670, 0.039, 1.33, 341.80, 58.40, 'OPTIMAL'),
('d0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', NOW(), 1200.00, 4000.00, 8.650, 0.042, 1.34, 342.15, 58.40, 'OPTIMAL');

-- 5. Insert Tether Inspection Events (Micro-Meteorite pitting, nanotube fraying, etc.)
INSERT INTO tether_inspection_events (id, climber_id, detected_at, altitude_km, defect_type, severity, pitting_depth_um, ribbon_coordinate_y_m, camera_sensor_id, action_taken, status) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 hours', 13180.400, 'MICROMETEORITE_PIT', 'LOW', 4.20, 13180400.12, 'CAM_VENTRAL_ULTRA_4K', 'SURFACE_SCANNED_WITHIN_TOLERANCE', 'RESOLVED'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 hours', 13400.150, 'CARBON_FIBER_FRAY', 'LOW', 1.80, 13400150.45, 'CAM_DORSAL_SPECTRUM', 'POLYMER_RESIN_HEALER_SCHEDULED', 'ACTIVE'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 hours', 13840.800, 'MICROMETEORITE_PIT', 'MEDIUM', 11.50, 13840800.80, 'CAM_VENTRAL_ULTRA_4K', 'ULTRASONIC_SHEAR_TEST_CONFIRMED_NOMINAL', 'RESOLVED'),
('e0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '1 hour', 14060.220, 'PLASMA_ETCHING', 'INFORMATIONAL', 0.60, 14060220.00, 'CAM_LATERAL_STARBOARD', 'SPECTRAL_REFLECTANCE_LOGGED', 'ACTIVE'),
('e0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 minutes', 14220.900, 'CARBON_FIBER_FRAY', 'LOW', 2.10, 14220900.50, 'CAM_DORSAL_SPECTRUM', 'AUTOMATED_ULTRASONIC_PULSE_NOMINAL', 'ACTIVE');

-- 6. Insert Operator Action Logs & Audit Trail (Minimum 10 rows)
INSERT INTO operator_action_logs (id, climber_id, operator_callsign, action_code, action_description, parameter_deltas, execution_status, logged_at) VALUES
('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'FLIGHT_DIR_VEGA', 'TETHER_PREFLIGHT_VERIFY', 'Verified ribbon tension and laser power beacon link prior to Earth Anchor release', '{"tension_check": "PASS", "beaming_lock": "PASS"}'::jsonb, 'SUCCESS', NOW() - INTERVAL '40 hours'),
('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'TRACTION_ENG_CHEN', 'TRACTION_ENGAGE_W1_W8', 'Engaged 8-wheel magnetic pinch traction drive with 48.5 kN initial normal force', '{"pinch_force_kn": 48.5, "target_rpm": 318.5}'::jsonb, 'SUCCESS', NOW() - INTERVAL '39 hours'),
('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'LASER_SYS_ORTEGA', 'BEAM_HANDOFF_GROUND_TO_ORBITAL', 'Acquired 820nm 4.8 MW ground beam array lock from Galapagos Central Station', '{"laser_power_mw": 4.80, "target_wavelength_nm": 820}'::jsonb, 'SUCCESS', NOW() - INTERVAL '38 hours'),
('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'ATMOS_MON_KOWALSKI', 'KARMAN_LINE_CROSSING_ACK', 'Confirmed successful crossing of Karman boundary at 100.0 km altitude', '{"altitude_km": 100.0, "aerodynamic_drag_n": 0.0}'::jsonb, 'SUCCESS', NOW() - INTERVAL '36 hours'),
('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'ORBITAL_NAV_SATO', 'DEBRIS_CORRIDOR_LEO_CLEAR', 'Scanned 600-1400 km orbital debris zone. 0 collision threats within 50 km clearance', '{"threat_count": 0, "radar_range_km": 250}'::jsonb, 'SUCCESS', NOW() - INTERVAL '30 hours'),
('f0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'THERMAL_ENG_FARAH', 'RADIATOR_HEAT_PIPE_CYCLE', 'Purged secondary capillary loop on ventral radiator panel. Rejection capacity at 1.34 MW', '{"rejection_mw": 1.34, "radiator_k": 342.15}'::jsonb, 'SUCCESS', NOW() - INTERVAL '24 hours'),
('f0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000001', 'TRACTION_ENG_CHEN', 'PINCH_PRESSURE_TRIM', 'Balanced pinch wheel hydraulic pressure across starboard bogies (W5-W8)', '{"delta_kn": "+0.15", "slip_pct": 0.020}'::jsonb, 'SUCCESS', NOW() - INTERVAL '18 hours'),
('f0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000001', 'RADIATION_OFF_ALVAREZ', 'INNER_VAN_ALLEN_EXIT_RECORD', 'Transited inner proton radiation belt. Magnetic deflection shield maintained zero pod dose', '{"max_flux_rad": 18.4, "cumulative_dose_mgy": 1.2}'::jsonb, 'SUCCESS', NOW() - INTERVAL '12 hours'),
('f0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000001', 'OPTICAL_SYS_VASQUEZ', 'PV_RECEIVER_GIMBAL_CALIBRATE', 'Fine-tuned secondary beam reflector servo tracking to null out 0.042 mrad atmospheric jitter', '{"alignment_err_mrad": 0.042, "absorption_eff": 94.2}'::jsonb, 'SUCCESS', NOW() - INTERVAL '6 hours'),
('f0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000001', 'FLIGHT_DIR_VEGA', 'TRANSFER_TRAJECTORY_HALFWAY_CHECK', 'Carriage HC-12 reaching 14,280 km. Nominal transit to GEO terminal on schedule', '{"progress_pct": 39.9, "ascent_velocity_kmh": 220.0}'::jsonb, 'SUCCESS', NOW() - INTERVAL '1 hour');
