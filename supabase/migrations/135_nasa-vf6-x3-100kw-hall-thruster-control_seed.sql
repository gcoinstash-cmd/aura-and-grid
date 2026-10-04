-- NASA Glenn Vacuum Facility 6 (VF6) // X3 100kW Nested-Channel Hall Thruster Seed Data
-- Provides realistic institutional test campaign baseline and calibration data.

-- Insert Test Campaign
INSERT INTO test_campaigns (id, campaign_code, facility_name, thruster_model, lead_test_engineer, target_power_kw, primary_propellant, chamber_id, status)
VALUES 
('d1111111-1111-4111-8111-111111111111', 'NASA-GRC-VF6-X3-CY26-004', 'NASA Glenn VF6 Electric Propulsion Laboratory', 'X3 100kW Nested-Channel Hall Thruster (3-Channel Annular)', 'Dr. Sarah Vance (GRC-LPE)', 102.40, 'Research Grade Xenon (99.999% purity)', 'VF-6 Main Tank (7.6m x 21m)', 'OPERATIONAL')
ON CONFLICT (id) DO NOTHING;

-- Insert 10 Subsystem Nodes
INSERT INTO facility_subsystems (subsystem_code, subsystem_name, category, health_status, operating_temp_k, operational_pressure_torr, interlock_armed)
VALUES
('VF6-CRYO-01', 'Primary 15K G-M Cryo-Condensation Arrays (North Wall)', 'VACUUM', 'NOMINAL', 14.85, 0.0000014, true),
('VF6-CRYO-02', 'Secondary 15K Cryo-Pumping Baffles (South Wall)', 'VACUUM', 'NOMINAL', 15.10, 0.0000014, true),
('VF6-LN2-SHLD', 'Liquid Nitrogen Thermal Shroud & Chevron Array', 'THERMAL', 'NOMINAL', 77.35, NULL, true),
('VF6-ROUGH-01', 'Leybold RUVAC Roots Blower / Dry Screw Vacuum Train', 'VACUUM', 'NOMINAL', 294.15, 0.0000850, true),
('X3-PPU-INN', 'PPU Stage 1: Inner Discharge Inverter (300-800V / 50A)', 'POWER', 'NOMINAL', 312.40, NULL, true),
('X3-PPU-MID', 'PPU Stage 2: Middle Discharge Inverter (300-800V / 120A)', 'POWER', 'NOMINAL', 318.80, NULL, true),
('X3-PPU-OUT', 'PPU Stage 3: Outer Discharge Inverter (300-800V / 160A)', 'POWER', 'NOMINAL', 324.20, NULL, true),
('X3-CAT-HK', 'LaB6 Central Hollow Cathode Keeper & Emitter Bias Supply', 'POWER', 'NOMINAL', 1340.00, NULL, true),
('X3-MAG-FLX', 'Inner / Intermediate / Outer Coil Electromagnet Matrix', 'POWER', 'NOMINAL', 338.50, NULL, true),
('VF6-RAKE-ENC', 'Faraday Cup Angular Positioning Rig (-90° to +90°)', 'DIAGNOSTICS', 'NOMINAL', 293.00, NULL, true)
ON CONFLICT (subsystem_code) DO NOTHING;

-- Insert 10 Telemetry Snapshots (Tracking Power Ramp & Micro-oscillations)
INSERT INTO firing_telemetry_snapshots (
    campaign_id, recorded_at, inner_channel_active, middle_channel_active, outer_channel_active,
    discharge_voltage_v, discharge_current_inner_a, discharge_current_middle_a, discharge_current_outer_a,
    total_discharge_power_kw, thrust_newtons, isp_seconds, chamber_pressure_torr,
    cathode_keeper_voltage_v, cathode_heater_current_a, mass_flow_inner_mgs, mass_flow_middle_mgs, mass_flow_outer_mgs, mass_flow_cathode_mgs
)
VALUES
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '45 minutes', true, true, true, 400.0, 37.45, 87.60, 125.10, 100.06, 5.342, 2810.5, 0.00000138, 18.2, 7.15, 4.18, 9.75, 14.42, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '40 minutes', true, true, true, 400.2, 37.52, 87.75, 125.30, 100.28, 5.358, 2818.0, 0.00000139, 18.3, 7.12, 4.20, 9.78, 14.45, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '35 minutes', true, true, true, 405.0, 37.60, 88.10, 125.80, 101.86, 5.395, 2835.4, 0.00000141, 18.4, 7.10, 4.21, 9.80, 14.48, 2.11),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '30 minutes', true, true, true, 410.0, 37.80, 88.50, 126.20, 103.53, 5.430, 2854.2, 0.00000142, 18.4, 7.10, 4.22, 9.81, 14.50, 2.12),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '25 minutes', true, true, true, 408.0, 37.72, 88.35, 126.05, 102.86, 5.418, 2848.9, 0.00000141, 18.3, 7.08, 4.20, 9.79, 14.49, 2.11),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '20 minutes', true, true, true, 406.5, 37.65, 88.20, 125.90, 102.34, 5.405, 2842.1, 0.00000140, 18.4, 7.11, 4.19, 9.78, 14.47, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '15 minutes', true, true, true, 407.0, 37.68, 88.28, 125.98, 102.54, 5.412, 2845.0, 0.00000141, 18.4, 7.10, 4.20, 9.80, 14.49, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '10 minutes', true, true, true, 408.5, 37.75, 88.42, 126.15, 103.08, 5.424, 2851.3, 0.00000142, 18.4, 7.10, 4.20, 9.80, 14.50, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '5 minutes', true, true, true, 407.8, 37.70, 88.32, 126.02, 102.78, 5.417, 2847.6, 0.00000141, 18.3, 7.09, 4.20, 9.79, 14.48, 2.10),
('d1111111-1111-4111-8111-111111111111', NOW() - INTERVAL '10 seconds', true, true, true, 407.2, 37.66, 88.25, 125.95, 102.56, 5.420, 2850.0, 0.00000140, 18.4, 7.10, 4.20, 9.80, 14.50, 2.10);

-- Insert 13 Faraday Sweep Angular Data Points (-60° to +60° sweep ledger)
INSERT INTO faraday_sweeps (campaign_id, angle_degrees, current_density_ma_cm2, ion_flux_cm2_s, plasma_potential_v, divergence_fraction)
VALUES
('d1111111-1111-4111-8111-111111111111', -60.0, 0.0842, 5.25e14, 8.4, 0.012),
('d1111111-1111-4111-8111-111111111111', -50.0, 0.2450, 1.53e15, 10.2, 0.028),
('d1111111-1111-4111-8111-111111111111', -40.0, 0.8120, 5.07e15, 12.8, 0.065),
('d1111111-1111-4111-8111-111111111111', -30.0, 2.1450, 1.34e16, 15.6, 0.124),
('d1111111-1111-4111-8111-111111111111', -20.0, 5.3400, 3.33e16, 17.8, 0.198),
('d1111111-1111-4111-8111-111111111111', -10.0, 8.9200, 5.57e16, 19.4, 0.264),
('d1111111-1111-4111-8111-111111111111',   0.0, 10.4500, 6.52e16, 20.1, 0.285),
('d1111111-1111-4111-8111-111111111111',  10.0, 8.8900, 5.55e16, 19.3, 0.262),
('d1111111-1111-4111-8111-111111111111',  20.0, 5.2800, 3.30e16, 17.7, 0.195),
('d1111111-1111-4111-8111-111111111111',  30.0, 2.0800, 1.30e16, 15.4, 0.121),
('d1111111-1111-4111-8111-111111111111',  40.0, 0.7950, 4.96e15, 12.6, 0.062),
('d1111111-1111-4111-8111-111111111111',  50.0, 0.2380, 1.48e15, 10.1, 0.026),
('d1111111-1111-4111-8111-111111111111',  60.0, 0.0810, 5.05e14, 8.2, 0.011);

-- Insert Incident & Fast-Trip History Logs (10 rows)
INSERT INTO incident_trip_logs (campaign_id, incident_code, trip_category, severity, trigger_metric, trigger_value, threshold_value, action_taken, resolved)
VALUES
('d1111111-1111-4111-8111-111111111111', 'ARC-TRIP-0881', 'HIGH_VOLTAGE_ARC', 'WARNING', 'Outer Anode dv/dt', '480 V -> 110 V (<20us)', 'Delta > 150V/100us', 'Auto-choke fast snubber fired. Micro-arc cleared in 1.4ms. Power restored.', true),
('d1111111-1111-4111-8111-111111111111', 'PPU-TRIP-0882', 'PPU_OVERCURRENT', 'CRITICAL', 'Middle Stage Current', '134.2 A', '120.0 A Max Trip', 'Stage gate cut off for 250ms, gas flow sustained to avoid thermal spike.', true),
('d1111111-1111-4111-8111-111111111111', 'VAC-WARN-0883', 'VACUUM_LOSS', 'WARNING', 'Chamber Pressure', '2.8e-6 Torr', '2.5e-6 Torr Warning', 'Throttled Outer MFC by 8% until 15K Cryo Array thermal recovery.', true),
('d1111111-1111-4111-8111-111111111111', 'CAT-EXT-0884', 'CATHODE_EXTINCTION', 'CRITICAL', 'Keeper Current', '0.04 A', '0.50 A Low Floor', 'Immediate emergency keeper restart pulse fired (120V ignition). Plasma relit.', true),
('d1111111-1111-4111-8111-111111111111', 'THM-WARN-0885', 'THERMAL_OVERRUN', 'INFO', 'Outer Pole Temp', '585 K', '600 K Warning Level', 'LN2 thermal shroud flow stepped up by +15%. Stabilization achieved.', true),
('d1111111-1111-4111-8111-111111111111', 'ARC-TRIP-0886', 'HIGH_VOLTAGE_ARC', 'WARNING', 'Inner Anode Spurious Current', '54.2 A', '50.0 A Ceiling', 'PPU pulse blanking engaged for 80 microseconds.', true),
('d1111111-1111-4111-8111-111111111111', 'RAK-DIAG-0887', 'OPERATOR_FAST_TRIP', 'INFO', 'Rake Encoder Margin', '61.4 deg', '60.0 deg Soft Bound', 'Limit switch actuated. Sweep arm returned to home zero angle.', true),
('d1111111-1111-4111-8111-111111111111', 'GAS-WARN-0888', 'PPU_OVERCURRENT', 'INFO', 'Cathode Gas Backpressure', '44.8 psia', '45.0 psia Margin', 'Regulator vent trimmed. Line backpressure normalized to 38.4 psia.', true),
('d1111111-1111-4111-8111-111111111111', 'CRYO-INFO-0889', 'VACUUM_LOSS', 'INFO', 'Cryo Bank B Head Temp', '15.4 K', '16.0 K Caution', 'Cold head helium compressor cycle optimized. Dropped back to 14.9 K.', true),
('d1111111-1111-4111-8111-111111111111', 'ARC-TRIP-0890', 'HIGH_VOLTAGE_ARC', 'WARNING', 'Channel Inter-Stage Leakage', '1.8 mA', '2.0 mA Ceiling', 'Insulator ceramic burn-in clean. Spurious discharge settled.', true);
