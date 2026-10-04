-- ============================================================================
-- VANGUARD ORBITAL // NODE-02 CLOSED-LOOP ECLSS RACK
-- INSTITUTIONAL POSTGRESQL AVIONICS SEED DATA (MINIMUM 10+ ROWS PER ENTITY)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED HABITAT NODES & MODULES (6 Station Compartments)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_habitat_nodes (id, node_code, name, zone_type, volume_m3, crew_capacity, is_pressurized)
VALUES
    ('a0000001-0000-0000-0000-000000000001', 'NODE-01', 'Command Core & Avionics Central', 'COMMAND', 105.00, 2, true),
    ('a0000001-0000-0000-0000-000000000002', 'NODE-02', 'Central Life Support & Crew Galley', 'LIFE_SUPPORT', 120.00, 2, true),
    ('a0000001-0000-0000-0000-000000000003', 'NODE-03', 'Science Lab & Hydroponics Aeroponics Rack', 'LABORATORY', 115.00, 2, true),
    ('a0000001-0000-0000-0000-000000000004', 'NODE-04', 'Service Module & Propulsion Hub Interface', 'PROPULSION', 80.00, 0, true),
    ('a0000001-0000-0000-0000-000000000005', 'AIRLOCK', 'Alpha EVA Preparation Chamber', 'AIRLOCK', 35.00, 2, true),
    ('a0000001-0000-0000-0000-000000000006', 'CREW-QTRS', 'Berthing Module Quarters 1-6', 'CREW_BERTH', 90.00, 6, true);

-- ----------------------------------------------------------------------------
-- 2. SEED ECLSS CLOSED-LOOP SUBSYSTEMS (6 Flight-Critical Assemblies)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_subsystems (id, subsystem_code, name, category, operational_status, power_draw_watts, efficiency_pct, mass_flow_rate_kgh, operating_temp_celsius, last_serviced_at, next_service_due)
VALUES
    ('b0000001-0000-0000-0000-000000000001', 'OGA', 'Oxygen Generation Assembly (Proton Exchange Membrane)', 'OXYGEN', 'ACTIVE', 1450.00, 99.10, 0.226, 62.50, now() - INTERVAL '40 days', now() + INTERVAL '140 days'),
    ('b0000001-0000-0000-0000-000000000002', 'CRA', 'Sabatier Carbon Dioxide Reduction Assembly', 'CARBON_DIOXIDE', 'ACTIVE', 820.00, 98.40, 0.142, 400.20, now() - INTERVAL '15 days', now() + INTERVAL '75 days'),
    ('b0000001-0000-0000-0000-000000000003', 'UPA', 'Urine Processor Assembly (Vapor Compression Distillation)', 'WATER', 'NOMINAL', 380.00, 93.80, 1.450, 48.00, now() - INTERVAL '60 days', now() + INTERVAL '30 days'),
    ('b0000001-0000-0000-0000-000000000004', 'TCCS', 'Trace Contaminant Control Subsystem Catalytic Oxidizer', 'TRACE_CONTAMINANT', 'ACTIVE', 260.00, 99.70, 0.085, 315.00, now() - INTERVAL '90 days', now() + INTERVAL '90 days'),
    ('b0000001-0000-0000-0000-000000000005', 'CDRA', 'Carbon Dioxide Removal Assembly (4-Bed Molecular Sieve)', 'CARBON_DIOXIDE', 'ACTIVE', 610.00, 96.50, 0.201, 185.00, now() - INTERVAL '25 days', now() + INTERVAL '65 days'),
    ('b0000001-0000-0000-0000-000000000006', 'WPA', 'Water Processor Assembly High-Temp Catalytic Reactor', 'WATER', 'ACTIVE', 540.00, 99.40, 2.100, 135.00, now() - INTERVAL '35 days', now() + INTERVAL '145 days');

-- ----------------------------------------------------------------------------
-- 3. SEED CONSUMABLE STORAGE TANKS (4 Primary Spacecraft Tanks)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_consumable_tanks (id, tank_code, name, consumable_type, current_level, max_capacity, unit, pressure_mpa, temp_kelvin, consumption_rate_per_hour)
VALUES
    ('c0000001-0000-0000-0000-000000000001', 'H2O-POT-RES-01', 'Potable Water Closed-Loop Storage Tank', 'POTABLE_H2O', 842.60, 1000.00, 'kg', 0.32, 294.10, 0.480),
    ('c0000001-0000-0000-0000-000000000002', 'LOX-CRYO-02A', 'Cryo Liquid Oxygen High-Density Storage', 'CRYO_LOX', 1420.00, 2000.00, 'L', 2.45, 90.20, -0.210),
    ('c0000001-0000-0000-0000-000000000003', 'LN2-BUFF-01B', 'High-Pressure Liquid Nitrogen Rapid-Flush Buffer', 'LIQUID_N2', 2850.00, 3500.00, 'L', 3.12, 77.40, -0.050),
    ('c0000001-0000-0000-0000-000000000004', 'H2O-GREY-03C', 'Wastewater Distillate Equalization Accumulator', 'GREYWATER', 115.40, 300.00, 'kg', 0.18, 296.50, -0.120);

-- ----------------------------------------------------------------------------
-- 4. SEED FILTER CANISTERS & SCRUBBER UNITS (12 Canisters Across Modules)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_filter_canisters (id, serial_number, node_id, canister_type, saturation_pct, max_operating_limit_pct, installed_at, estimated_depletion_at, status)
VALUES
    ('d0000001-0000-0000-0000-000000000001', 'LIOH-SN-8821', 'a0000001-0000-0000-0000-000000000001', 'LIOH_CANISTER', 41.20, 85.00, now() - INTERVAL '14 days', now() + INTERVAL '16 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000002', 'HEPA-SN-4410', 'a0000001-0000-0000-0000-000000000001', 'HEPA_PARTICULATE', 24.50, 95.00, now() - INTERVAL '90 days', now() + INTERVAL '275 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000003', 'LIOH-SN-8822', 'a0000001-0000-0000-0000-000000000002', 'LIOH_CANISTER', 58.70, 85.00, now() - INTERVAL '18 days', now() + INTERVAL '8 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000004', 'HEPA-SN-4411', 'a0000001-0000-0000-0000-000000000002', 'HEPA_PARTICULATE', 38.00, 95.00, now() - INTERVAL '90 days', now() + INTERVAL '275 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000005', 'TCCS-CHAR-01', 'a0000001-0000-0000-0000-000000000002', 'ACTIVATED_CHARCOAL', 18.20, 90.00, now() - INTERVAL '120 days', now() + INTERVAL '400 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000006', 'LIOH-SN-8823', 'a0000001-0000-0000-0000-000000000003', 'LIOH_CANISTER', 32.00, 85.00, now() - INTERVAL '10 days', now() + INTERVAL '20 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000007', 'HEPA-SN-4412', 'a0000001-0000-0000-0000-000000000003', 'HEPA_PARTICULATE', 28.10, 95.00, now() - INTERVAL '90 days', now() + INTERVAL '275 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000008', 'LIOH-SN-8824', 'a0000001-0000-0000-0000-000000000004', 'LIOH_CANISTER', 18.50, 85.00, now() - INTERVAL '5 days', now() + INTERVAL '45 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000009', 'HEPA-SN-4413', 'a0000001-0000-0000-0000-000000000004', 'HEPA_PARTICULATE', 12.00, 95.00, now() - INTERVAL '90 days', now() + INTERVAL '275 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000010', 'LIOH-SN-8825', 'a0000001-0000-0000-0000-000000000005', 'LIOH_CANISTER', 22.10, 85.00, now() - INTERVAL '7 days', now() + INTERVAL '33 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000011', 'LIOH-SN-8826', 'a0000001-0000-0000-0000-000000000006', 'LIOH_CANISTER', 67.40, 85.00, now() - INTERVAL '21 days', now() + INTERVAL '5 days', 'ACTIVE'),
    ('d0000001-0000-0000-0000-000000000012', 'HEPA-SN-4414', 'a0000001-0000-0000-0000-000000000006', 'HEPA_PARTICULATE', 44.20, 95.00, now() - INTERVAL '90 days', now() + INTERVAL '275 days', 'ACTIVE');

-- ----------------------------------------------------------------------------
-- 5. SEED ATMOSPHERIC TELEMETRY STREAM (12 Institutional Telemetry Rows)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_telemetry_logs (id, node_id, recorded_at, total_pressure_kpa, o2_partial_kpa, co2_partial_kpa, humidity_percent, temp_celsius, hepa_delta_p_pa, cabin_fan_rpm, status)
VALUES
    ('e0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000001', now() - INTERVAL '5 minutes', 101.32, 21.21, 0.380, 44.50, 21.40, 138.00, 3420, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000001', now() - INTERVAL '4 minutes', 101.31, 21.20, 0.381, 44.52, 21.41, 138.10, 3420, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000002', now() - INTERVAL '5 minutes', 101.34, 21.24, 0.395, 46.10, 22.10, 164.00, 3500, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', now() - INTERVAL '3 minutes', 101.33, 21.22, 0.392, 45.90, 22.05, 164.20, 3500, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000003', now() - INTERVAL '5 minutes', 101.30, 21.18, 0.365, 48.20, 21.00, 142.00, 3380, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000003', now() - INTERVAL '2 minutes', 101.31, 21.19, 0.366, 48.10, 21.02, 142.10, 3380, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000004', now() - INTERVAL '5 minutes', 101.28, 21.15, 0.320, 41.00, 19.80, 118.00, 2950, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000004', now() - INTERVAL '1 minute',  101.29, 21.16, 0.321, 41.05, 19.82, 118.00, 2950, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000005', now() - INTERVAL '5 minutes', 101.29, 21.17, 0.330, 42.10, 20.20, 125.00, 2400, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000006', now() - INTERVAL '5 minutes', 101.35, 21.25, 0.415, 47.50, 21.80, 188.00, 3620, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000011', 'a0000001-0000-0000-0000-000000000006', now() - INTERVAL '3 minutes', 101.36, 21.26, 0.418, 47.60, 21.85, 188.20, 3620, 'NOMINAL'),
    ('e0000001-0000-0000-0000-000000000012', 'a0000001-0000-0000-0000-000000000006', now() - INTERVAL '1 minute',  101.35, 21.25, 0.414, 47.45, 21.81, 188.10, 3620, 'NOMINAL');

-- ----------------------------------------------------------------------------
-- 6. SEED ECLSS MAINTENANCE & INTERLOCK AUDIT LEDGER (10 Rows)
-- ----------------------------------------------------------------------------
INSERT INTO eclss_maintenance_events (id, node_id, subsystem_id, action_type, operator_callsign, executed_at, status, telemetry_snapshot, notes)
VALUES
    ('f0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000002', 'CYCLE_SABATIER_BED', 'AVIONICS_DAEMON', now() - INTERVAL '1 hour', 'EXECUTED', '{"temp_before": 400.2, "temp_peak": 412.5, "delta_p_kpa": 14.2}', 'Automated ruthenium bed thermal sweep cycle completed nominal.'),
    ('f0000001-0000-0000-0000-000000000002', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000006', 'FLUSH_CONDENSATE_SEPARATOR', 'CHIEF_FLIGHT_SURGEON', now() - INTERVAL '2 hours', 'EXECUTED', '{"slurry_discharged_ml": 480, "effluent_conductivity": 0.42}', 'Hydrophobic rotary water separator purge cleared micro-debris.'),
    ('f0000001-0000-0000-0000-000000000003', 'a0000001-0000-0000-0000-000000000001', 'b0000001-0000-0000-0000-000000000001', 'CALIBRATE_CELL_VOLTAGE', 'ECLSS_SPECIALIST_1', now() - INTERVAL '6 hours', 'EXECUTED', '{"stack_v": 28.4, "cell_mean_v": 1.82}', 'PEM stack individual half-cell resistance checked against telemetry baseline.'),
    ('f0000001-0000-0000-0000-000000000004', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000003', 'CENTRIFUGE_DRUM_INSPECT', 'AVIONICS_DAEMON', now() - INTERVAL '12 hours', 'EXECUTED', '{"drum_rpm": 1240, "vibration_g": 0.014}', 'UPA vapor compression distillation dynamic balance verification.'),
    ('f0000001-0000-0000-0000-000000000005', 'a0000001-0000-0000-0000-000000000006', NULL, 'SWAP_LIOH_CANISTER', 'EVA_CREW_MEMBER_3', now() - INTERVAL '1 day', 'EXECUTED', '{"old_sn": "LIOH-SN-8819", "new_sn": "LIOH-SN-8826", "saturation_reset_pct": 2.5}', 'Scheduled replacement of crew quarters backup chemical absorption unit.'),
    ('f0000001-0000-0000-0000-000000000006', 'a0000001-0000-0000-0000-000000000001', NULL, 'SERVICE_HEPA', 'AVIONICS_DAEMON', now() - INTERVAL '2 days', 'EXECUTED', '{"delta_p_pre": 210, "delta_p_post": 138}', 'Automated reverse pulse flow to clear particulate build-up in Command Core.'),
    ('f0000001-0000-0000-0000-000000000007', 'a0000001-0000-0000-0000-000000000002', 'b0000001-0000-0000-0000-000000000005', 'CDRA_BED_DESORB_TEST', 'FLIGHT_CONTROLLER', now() - INTERVAL '3 days', 'EXECUTED', '{"bed_a_temp": 190.2, "bed_b_desorb_pct": 98.4}', 'Zeolite molecular sieve regeneration cycle performance validated.'),
    ('f0000001-0000-0000-0000-000000000008', 'a0000001-0000-0000-0000-000000000003', 'b0000001-0000-0000-0000-000000000004', 'TCCS_CATALYTIC_EFFICIENCY_AUDIT', 'SCIENCE_OFFICER', now() - INTERVAL '5 days', 'EXECUTED', '{"co_destruction_pct": 99.85, "methane_bleed_ppm": 0.01}', 'Trace volatile organics sampling showed zero toxic threshold exceedance.'),
    ('f0000001-0000-0000-0000-000000000009', 'a0000001-0000-0000-0000-000000000005', NULL, 'AIRLOCK_DEPRESS_EVALUATION', 'COMMANDER', now() - INTERVAL '7 days', 'EXECUTED', '{"pumpdown_time_min": 18.4, "residual_press_kpa": 0.8}', 'Airlock rapid depressurization valve timing test prior to EVA sortie.'),
    ('f0000001-0000-0000-0000-000000000010', 'a0000001-0000-0000-0000-000000000002', NULL, 'RAPID_N2_FLUSH_DRILL', 'COMMANDER', now() - INTERVAL '14 days', 'EXECUTED', '{"valve_manifold": "LN2-BUFF-01B", "actuation_delay_ms": 42}', 'Safety interlock drill: emergency N2 release solenoid confirmed 100% operational.');
