-- =====================================================================
-- CASCADE RANGE CALDERA // SUPERCRITICAL EGS POWER STATION 04
-- Seed Data: Domain-Specific Operational Data (Wells, Telemetry, Seismic)
-- =====================================================================

-- 1. Wells Seed (6 Production, 3 Injection, 1 Deep Seismic Observation)
INSERT INTO wells (id, well_code, well_type, depth_meters, casing_diameter_mm, target_formation, bottom_hole_temp_c, wellhead_pressure_mpa, design_flow_rate_kg_s, choke_aperture_pct, calcite_scaling_index, seismic_risk_tier, status) VALUES
('a0000000-0000-0000-0000-000000000001', 'PROD-01', 'PRODUCTION', 5240.00, 244.50, 'Granodiorite Supercritical Core Alpha', 464.20, 27.80, 78.40, 94.00, 0.82, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000002', 'PROD-02', 'PRODUCTION', 5180.00, 244.50, 'Central Caldera Resurgent Block', 459.80, 26.90, 72.10, 90.00, 0.88, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000003', 'PROD-03', 'PRODUCTION', 5310.00, 219.10, 'Subsurface Shear Boundary Zone', 468.10, 28.50, 68.90, 82.00, 0.94, 'AMBER', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000004', 'PROD-04', 'PRODUCTION', 5290.00, 244.50, 'Deep Graben Extensional Granite', 461.50, 27.20, 74.20, 95.00, 0.79, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000005', 'PROD-05', 'PRODUCTION', 5120.00, 244.50, 'Eastern Ring Fracture Complex', 455.00, 26.40, 64.50, 88.00, 0.74, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000006', 'PROD-06', 'PRODUCTION', 5360.00, 219.10, 'Basement Splay Hydrothermal Duct', 471.30, 29.10, 62.10, 76.00, 1.06, 'AMBER', 'CHOKED'),
('a0000000-0000-0000-0000-000000000007', 'INJ-01', 'INJECTION', 5080.00, 339.70, 'Basement Permeability Stimulated Volume', 64.20, 28.60, 145.00, 100.00, 0.31, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000008', 'INJ-02', 'INJECTION', 5140.00, 339.70, 'Western Hydraulic Recharge Conduit', 62.80, 28.20, 138.50, 96.00, 0.28, 'GREEN', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000009', 'INJ-03', 'INJECTION', 5210.00, 339.70, 'Southern Tectonic Stress Boundary', 65.10, 28.40, 136.70, 85.00, 0.35, 'AMBER', 'ACTIVE'),
('a0000000-0000-0000-0000-000000000010', 'OBS-01', 'OBSERVATION', 5450.00, 177.80, 'Deep Seismo-Acoustic Monitoring Node', 478.00, 31.00, 0.00, 0.00, 0.15, 'GREEN', 'ACTIVE')
ON CONFLICT (well_code) DO NOTHING;

-- 2. Telemetry Logs (Recent high-precision supercritical snapshots)
INSERT INTO telemetry_logs (well_id, recorded_at, temperature_c, pressure_mpa, flow_rate_kg_s, enthalpy_kj_kg, quartz_silica_index, steam_quality_pct, caliper_variance_mm) VALUES
('a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '4 minutes', 464.10, 27.78, 78.35, 2782.50, 0.82, 99.8, 0.12),
('a0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '2 minutes', 464.30, 27.81, 78.42, 2784.10, 0.82, 99.9, 0.13),
('a0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '3 minutes', 459.70, 26.88, 72.05, 2741.00, 0.88, 99.5, -0.05),
('a0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '2 minutes', 468.00, 28.48, 68.85, 2812.30, 0.94, 99.9, 0.34),
('a0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '1 minute', 461.40, 27.22, 74.18, 2761.80, 0.79, 99.7, 0.08),
('a0000000-0000-0000-0000-000000000005', NOW() - INTERVAL '1 minute', 455.10, 26.42, 64.55, 2712.40, 0.74, 99.4, -0.02),
('a0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '30 seconds', 471.20, 29.08, 62.08, 2836.00, 1.06, 100.0, 0.52),
('a0000000-0000-0000-0000-000000000007', NOW() - INTERVAL '1 minute', 64.10, 28.62, 145.10, 272.00, 0.31, 0.0, 0.00),
('a0000000-0000-0000-0000-000000000008', NOW() - INTERVAL '1 minute', 62.90, 28.19, 138.45, 266.50, 0.28, 0.0, 0.01),
('a0000000-0000-0000-0000-000000000009', NOW() - INTERVAL '45 seconds', 65.20, 28.44, 136.65, 276.10, 0.35, 0.0, 0.04);

-- 3. Micro-Seismic Hypocenter Events (Realistic M < 1.0 downhole slip events)
INSERT INTO microseismic_events (id, detected_at, northing_m, easting_m, depth_meters, magnitude_mw, seismic_moment_nm, corner_frequency_hz, fault_strike_deg, fault_dip_deg, fault_rake_deg, cluster_id, risk_tier) VALUES
('b0000000-0000-0000-0000-000000000001', NOW() - INTERVAL '18 minutes', 1420.5, -310.2, 5142.0, 0.42, 1.45e10, 185.4, 214.0, 78.5, -15.2, 'CLUSTER-ALPHA', 'GREEN'),
('b0000000-0000-0000-0000-000000000002', NOW() - INTERVAL '15 minutes', 1465.1, -290.8, 5210.5, 0.68, 3.82e10, 162.1, 218.5, 82.0, -12.0, 'CLUSTER-ALPHA', 'GREEN'),
('b0000000-0000-0000-0000-000000000003', NOW() - INTERVAL '12 minutes', 1380.2, -340.0, 4980.2, 0.15, 5.20e9, 210.0, 205.2, 75.0, -18.4, 'CLUSTER-BETA', 'GREEN'),
('b0000000-0000-0000-0000-000000000004', NOW() - INTERVAL '9 minutes', 1510.9, -260.4, 5320.0, 0.89, 7.94e10, 142.8, 222.0, 85.0, -8.5, 'CLUSTER-GAMMA', 'AMBER'),
('b0000000-0000-0000-0000-000000000005', NOW() - INTERVAL '7 minutes', 1395.0, -325.6, 5060.8, -0.12, 1.88e9, 245.2, 210.4, 76.2, -14.0, 'CLUSTER-ALPHA', 'GREEN'),
('b0000000-0000-0000-0000-000000000006', NOW() - INTERVAL '5 minutes', 1480.3, -280.1, 5280.4, 0.54, 2.12e10, 174.5, 216.0, 80.4, -11.2, 'CLUSTER-ALPHA', 'GREEN'),
('b0000000-0000-0000-0000-000000000007', NOW() - INTERVAL '4 minutes', 1530.0, -245.0, 5380.2, 0.94, 9.40e10, 138.0, 224.5, 86.2, -6.1, 'CLUSTER-GAMMA', 'AMBER'),
('b0000000-0000-0000-0000-000000000008', NOW() - INTERVAL '3 minutes', 1410.7, -305.5, 5110.0, 0.28, 8.90e9, 198.2, 212.0, 77.8, -16.5, 'CLUSTER-BETA', 'GREEN'),
('b0000000-0000-0000-0000-000000000009', NOW() - INTERVAL '1 minute', 1445.6, -295.2, 5195.3, 0.35, 1.15e10, 189.6, 215.1, 79.5, -13.8, 'CLUSTER-ALPHA', 'GREEN'),
('b0000000-0000-0000-0000-000000000010', NOW() - INTERVAL '20 seconds', 1502.4, -270.8, 5265.0, 0.61, 2.95e10, 168.0, 219.0, 83.1, -10.0, 'CLUSTER-ALPHA', 'GREEN');

-- 4. Supercritical Turbine & Binary ORC Matrix (4 Stages)
INSERT INTO turbine_stages (stage_number, stage_name, cycle_type, gross_power_mwe, inlet_pressure_mpa, inlet_temperature_c, rpm, isentropic_efficiency_pct, vibration_rms_mm_s, condenser_vacuum_kpa, status) VALUES
(1, 'Stage 1: HP Supercritical Expander', 'Supercritical Direct Expansion', 48.20, 27.80, 460.50, 5400, 91.4, 1.12, -94.20, 'SYNCHRONIZED'),
(2, 'Stage 2: IP Reheat Flash Expander', 'Intermediate Steam Reheat', 42.10, 11.20, 385.00, 3600, 89.8, 0.94, -94.10, 'SYNCHRONIZED'),
(3, 'Stage 3: LP Dual-Flash Generator', 'Dual-Flash Low Pressure', 34.50, 3.40, 240.20, 3000, 88.2, 0.88, -94.20, 'SYNCHRONIZED'),
(4, 'Stage 4: Binary Organic Rankine (ORC)', 'Closed-Loop Isobutane ORC', 23.80, 1.80, 148.00, 1800, 86.5, 0.65, -94.50, 'SYNCHRONIZED')
ON CONFLICT (stage_number) DO UPDATE SET gross_power_mwe = EXCLUDED.gross_power_mwe;

-- 5. Hydrofracture Stimulation Stages (6 stimulated intervals)
INSERT INTO hydrofracture_stages (well_id, stage_index, top_depth_m, bottom_depth_m, breakdown_pressure_mpa, instantaneous_shut_in_pressure_mpa, proppant_injected_tons, stimulated_reservoir_volume_m3, hydraulic_conductivity_d_m, status) VALUES
('a0000000-0000-0000-0000-000000000007', 1, 4850.00, 4920.00, 58.40, 39.20, 120.50, 450000.00, 14.200, 'CIRCULATING'),
('a0000000-0000-0000-0000-000000000007', 2, 4950.00, 5010.00, 61.20, 41.50, 145.00, 520000.00, 16.800, 'CIRCULATING'),
('a0000000-0000-0000-0000-000000000007', 3, 5020.00, 5080.00, 64.00, 43.10, 160.00, 610000.00, 18.500, 'CIRCULATING'),
('a0000000-0000-0000-0000-000000000008', 1, 4900.00, 4980.00, 59.80, 40.10, 130.00, 480000.00, 15.100, 'CIRCULATING'),
('a0000000-0000-0000-0000-000000000008', 2, 5050.00, 5140.00, 63.50, 42.80, 155.00, 590000.00, 17.900, 'CIRCULATING'),
('a0000000-0000-0000-0000-000000000009', 1, 5100.00, 5210.00, 66.10, 44.50, 175.00, 680000.00, 19.400, 'CIRCULATING');

-- 6. Plant Safety Systems Baseline
INSERT INTO plant_safety_systems (station_code, bop_containment_active, annular_seal_pressure_mpa, blind_shear_rams_armed, choke_manifold_aperture_pct, acoustic_trip_threshold_mw, hydrogen_sulfide_ppm, emergency_diverter_line_ready) VALUES
('STATION-04-CALDERA', FALSE, 24.50, TRUE, 82.50, 1.50, 0.12, TRUE)
ON CONFLICT (station_code) DO NOTHING;

-- 7. Well Actions Audit Log (10 operational commands)
INSERT INTO well_actions_audit (well_id, action_type, initiated_by, authorization_tier, parameters, status, executed_at) VALUES
('a0000000-0000-0000-0000-000000000003', 'CHOKE_MODULATION', 'SYS_ARCHITECT_L4', '{"previous_pct": 90.0, "new_pct": 82.0, "reason": "Microseismic M0.89 swarm dampening"}'::jsonb, 'COMPLETED', NOW() - INTERVAL '14 hours'),
('a0000000-0000-0000-0000-000000000006', 'CALCITE_ACID_FLUSH', 'CHIEF_ENGINEER_G7', '{"agent": "Phosphonic Acid Inhibitor", "volume_m3": 18.5, "pressure_mpa": 31.2}'::jsonb, 'COMPLETED', NOW() - INTERVAL '11 hours'),
('a0000000-0000-0000-0000-000000000001', 'CALIPER_ACOUSTIC_LOG', 'AUTOMATION_CORE', '{"frequency_khz": 250, "resolution_mm": 1.0}'::jsonb, 'COMPLETED', NOW() - INTERVAL '8 hours'),
('a0000000-0000-0000-0000-000000000009', 'INJECTION_RATE_TRIM', 'THERMODYNAMIC_AI', '{"rate_delta_kg_s": -5.0, "new_target": 136.7}'::jsonb, 'COMPLETED', NOW() - INTERVAL '6 hours'),
('a0000000-0000-0000-0000-000000000006', 'PRESSURE_TRANSIENT_TEST', 'GEOCHEM_LEAD', '{"pulse_duration_sec": 300, "recovery_time_sec": 1800}'::jsonb, 'COMPLETED', NOW() - INTERVAL '4 hours'),
('a0000000-0000-0000-0000-000000000002', 'ORC_CONDENSER_BACKWASH', 'TURBINE_SUPERVISOR', '{"vacuum_delta_kpa": 1.2, "cooling_water_c": 14.1}'::jsonb, 'COMPLETED', NOW() - INTERVAL '3 hours'),
('a0000000-0000-0000-0000-000000000007', 'PROPPANT_PACK_EVALUATION', 'GEOPHYSICS_OPS', '{"tracer_isotope": "Krypton-79", "breakthrough_hrs": 42.4}'::jsonb, 'COMPLETED', NOW() - INTERVAL '2 hours'),
('a0000000-0000-0000-0000-000000000006', 'CHOKE_TRIM_ALERT', 'SYS_ARCHITECT_L4', '{"aperture_adjusted_to": 76.0, "silica_index": 1.06}'::jsonb, 'COMPLETED', NOW() - INTERVAL '90 minutes'),
('a0000000-0000-0000-0000-000000000003', 'MICROSEISMIC_CLUSTER_CORRELATION', 'SEISMOLOGY_NODE', '{"hypocenter_depth_m": 5320.0, "mw": 0.89}'::jsonb, 'COMPLETED', NOW() - INTERVAL '45 minutes'),
('a0000000-0000-0000-0000-000000000008', 'ANNULAR_PRESSURE_VALIDATION', 'SAFETY_AUTOMATION', '{"seal_mpa": 24.5, "bop_readiness": "100%"}'::jsonb, 'COMPLETED', NOW() - INTERVAL '10 minutes');
