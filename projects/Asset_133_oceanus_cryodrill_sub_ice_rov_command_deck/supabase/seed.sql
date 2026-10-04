-- ============================================================================
-- OCEANUS-ICE TETHER RIG // CRYOBOT PROBE CR-07
-- PostgreSQL Seed Data (Realistic Planetary Sub-Ice Expedition Telemetry)
-- ============================================================================

-- 1. Insert Target Probe Units
INSERT INTO probe_units (
    id,
    callsign,
    model_designation,
    hull_material,
    crush_depth_rating_meters,
    max_thermal_power_kw,
    commissioned_at,
    current_status,
    target_body
) VALUES (
    'a1000000-0000-0000-0000-000000000001',
    'CR-07',
    'OCEANUS-ICE SUB-OCEAN PENETRATOR MARK IV',
    'Titanium Grade 5 + Aerogel Insulated Matrix & Diamond Melt-Tip',
    12000.00,
    250.00,
    '2026-01-15T08:00:00Z',
    'melt_penetration',
    'Europa / Pwyll Crater Ice Shell - Station Charlie'
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Flight Deck Operators
INSERT INTO flight_deck_operators (
    id,
    callsign,
    full_name,
    role,
    clearance_level,
    last_login_at,
    is_active
) VALUES 
    ('b1000000-0000-0000-0000-000000000001', 'DIR-VANCE', 'Dr. Elena Vance', 'mission_director', 5, '2026-10-04T02:00:00Z', true),
    ('b1000000-0000-0000-0000-000000000002', 'PILOT-KAI', 'Commander Kai Thorne', 'rov_lead_pilot', 4, '2026-10-04T02:15:00Z', true),
    ('b1000000-0000-0000-0000-000000000003', 'CHEM-SVEN', 'Dr. Astrid Lindholm', 'biogeochemist_specialist', 4, '2026-10-04T01:50:00Z', true),
    ('b1000000-0000-0000-0000-000000000004', 'ENG-CHEN', 'Lt. Marcus Chen', 'flight_engineer', 4, '2026-10-04T02:10:00Z', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Ice Column Stratigraphy Waypoints
INSERT INTO ice_column_waypoints (
    id,
    layer_name,
    depth_start_m,
    depth_end_m,
    ambient_temp_c,
    ice_type,
    cavitation_assist_required,
    acoustic_ping_rate_hz,
    notes
) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'Surface Cold Firn & Regolith Crust', 0.00, 2000.00, -165.00, 'Brittle Polycrystalline Ice I', false, 2.00, 'High acoustic backscatter, thermal drilling passive conductive regime.'),
    ('c1000000-0000-0000-0000-000000000002', 'Ductile Convective Ice & Brine Veins', 2000.00, 8500.00, -42.00, 'Warm Deformable Warm Ice', true, 4.00, 'High dielectric loss, fluid pockets encountered, engage pulsed water jet.'),
    ('c1000000-0000-0000-0000-000000000003', 'Slush Boundary / Basal Ingress Zone', 8500.00, 11200.00, -3.20, 'Frazil Ice & Water Slurry Ceiling', true, 8.00, 'Rapid melt rate; variable buoyancy bladder deflation active for ingress trim.'),
    ('c1000000-0000-0000-0000-000000000004', 'Sub-Surface Liquid Abyssal Ocean', 11200.00, 18500.00, 1.80, 'Hyper-Saline Liquid Ocean Matrix', false, 1.00, 'Full free-submergence mode, tether payout dynamic tension control.'),
    ('c1000000-0000-0000-0000-000000000005', 'Benthic Hydrothermal Vent Floor', 18500.00, 20000.00, 84.50, 'Basalt Chimney Serpentinization Field', false, 12.00, 'Ultra-high dissolved H2 and CH4 plume detected. Niskin carousel deployed.')
ON CONFLICT (id) DO NOTHING;

-- 4. Insert Science Payload Manifest
INSERT INTO science_payload_manifest (
    id,
    probe_id,
    sensor_code,
    sensor_name,
    sensor_type,
    operating_wavelength_nm,
    sampling_rate_hz,
    is_active,
    health_score_pct,
    last_calibration_at
) VALUES
    ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'SAM-01', 'Sample Analysis at Mars/Europa MS', 'Quadrupole Mass Spectrometer', NULL, 1.00, true, 99.20, '2026-10-04T01:00:00Z'),
    ('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'RAMAN-532', 'Deep-UV Raman Laser Spectrometer', 'Non-Destructive Mineralogy / Organics', 532.00, 5.00, true, 97.80, '2026-10-04T01:30:00Z'),
    ('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'CTD-PREC', 'Micro-Inductive Salinity & CTD Cell', 'Conductivity-Temperature-Depth', NULL, 20.00, true, 100.00, '2026-10-04T02:00:00Z'),
    ('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'UVP-FLUORO', 'Deep-Abyssal Micro-Fluorometer', 'Bioluminescence & Hydrocarbon Tracer', 470.00, 10.00, true, 96.40, '2026-10-04T00:45:00Z')
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Niskin Sample Bay Records
INSERT INTO niskin_sample_bays (
    id,
    probe_id,
    bay_number,
    capacity_ml,
    fill_volume_ml,
    state,
    sealed_at,
    seal_pressure_bar,
    sample_depth_meters,
    organic_compounds_detected
) VALUES
    ('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 1, 750, 750, 'sealed_refrigerated', '2026-10-03T18:22:00Z', 125.40, 3200.00, '{"methane_clathrate": "positive", "amino_precursor": "trace"}'::jsonb),
    ('e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 2, 750, 750, 'sealed_refrigerated', '2026-10-03T23:45:00Z', 210.80, 4050.00, '{"serpentine_silicate": "abundant", "dissolved_sulfide": "high"}'::jsonb),
    ('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 3, 750, 320, 'sampling_active', NULL, NULL, 4120.00, '{"formate": "pending_mass_spec"}'::jsonb),
    ('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 4, 750, 0, 'empty_purged', NULL, NULL, NULL, '{}'::jsonb),
    ('e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 5, 750, 0, 'empty_purged', NULL, NULL, NULL, '{}'::jsonb),
    ('e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 6, 750, 0, 'empty_purged', NULL, NULL, NULL, '{}'::jsonb),
    ('e1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 7, 750, 0, 'empty_purged', NULL, NULL, NULL, '{}'::jsonb),
    ('e1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001', 8, 750, 0, 'empty_purged', NULL, NULL, NULL, '{}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Historical Telemetry Stream (10 Rows)
INSERT INTO probe_telemetry_logs (
    probe_id,
    recorded_at,
    depth_meters,
    hydrostatic_pressure_mpa,
    thermal_core_power_kw,
    tether_payout_meters,
    tether_tension_kn,
    melt_core_temp_celsius,
    cartridge_1_temp_c,
    cartridge_2_temp_c,
    cartridge_3_temp_c,
    cartridge_4_temp_c,
    bus_voltage_v,
    fiber_attenuation_db_per_km,
    circulator_flow_l_per_min,
    buoyancy_bladder_volume_l,
    buoyancy_piston_bar
) VALUES
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '45 minutes', 4075.20, 40.75, 184.20, 5190.00, 14.80, 318.5, 318.2, 317.9, 321.0, 316.5, 399.8, 0.182, 141.8, 24.5, 382.1),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '40 minutes', 4080.50, 40.80, 184.60, 5196.00, 15.10, 319.0, 318.8, 318.1, 321.5, 316.8, 400.1, 0.183, 142.0, 24.6, 382.7),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '35 minutes', 4086.10, 40.86, 185.00, 5202.00, 15.40, 319.4, 319.1, 318.3, 322.0, 317.0, 400.0, 0.183, 142.1, 24.6, 383.2),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 minutes', 4092.40, 40.92, 185.10, 5210.00, 15.70, 319.8, 319.4, 318.5, 322.6, 317.2, 399.9, 0.184, 142.3, 24.7, 383.8),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 minutes', 4098.80, 40.98, 185.30, 5217.00, 15.90, 320.1, 319.7, 318.7, 323.1, 317.4, 399.7, 0.184, 142.4, 24.7, 384.2),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 minutes', 4104.20, 41.04, 185.00, 5223.00, 16.10, 320.0, 319.9, 318.6, 323.5, 317.3, 400.0, 0.184, 142.5, 24.8, 384.6),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 minutes', 4109.90, 41.09, 185.20, 5229.00, 16.30, 320.2, 320.0, 318.8, 324.0, 317.5, 400.2, 0.185, 142.5, 24.8, 384.9),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 minutes', 4114.30, 41.14, 184.90, 5234.00, 16.40, 320.1, 320.1, 318.7, 324.4, 317.4, 399.8, 0.185, 142.4, 24.8, 385.1),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 minutes',  4118.00, 41.18, 185.00, 5238.00, 16.50, 320.0, 320.0, 318.6, 324.8, 317.2, 400.1, 0.185, 142.5, 24.8, 385.0),
    ('a1000000-0000-0000-0000-000000000001', NOW(),                         4120.00, 41.20, 185.00, 5240.00, 16.60, 320.0, 320.0, 318.5, 325.0, 317.1, 400.0, 0.185, 142.5, 24.8, 385.0);

-- 7. Insert Vent Geochemistry Logs (10 Rows)
INSERT INTO vent_water_chemistry_logs (
    probe_id,
    timestamp,
    depth_meters,
    dissolved_methane_nmol_l,
    dissolved_hydrogen_umol_kg,
    ph_level,
    salinity_psu,
    orp_redox_mv,
    dissolved_oxygen_umol_l,
    turbidity_fnu
) VALUES
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '45 minutes', 4075.20, 240.50, 18.20, 7.82, 34.65, -120.0, 4.20, 0.95),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '40 minutes', 4080.50, 275.10, 22.40, 7.65, 34.72, -145.0, 3.85, 1.10),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '35 minutes', 4086.10, 320.80, 28.90, 7.42, 34.80, -180.0, 3.40, 1.35),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '30 minutes', 4092.40, 395.20, 36.50, 7.15, 34.91, -220.0, 2.95, 1.80),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '25 minutes', 4098.80, 480.00, 47.10, 6.84, 35.05, -270.0, 2.30, 2.45),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '20 minutes', 4104.20, 560.40, 58.70, 6.45, 35.18, -315.0, 1.85, 3.10),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '15 minutes', 4109.90, 645.90, 72.30, 5.92, 35.32, -380.0, 1.40, 3.90),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '10 minutes', 4114.30, 720.10, 85.00, 5.40, 35.45, -430.0, 1.05, 4.60),
    ('a1000000-0000-0000-0000-000000000001', NOW() - INTERVAL '5 minutes',  4118.00, 810.50, 96.80, 4.88, 35.60, -490.0, 0.72, 5.20),
    ('a1000000-0000-0000-0000-000000000001', NOW(),                         4120.00, 895.00, 108.40, 4.12, 35.75, -540.0, 0.45, 5.85);

-- 8. Insert Diagnostic Telemetry Alerts
INSERT INTO telemetry_alerts (
    id,
    probe_id,
    subsystem,
    severity,
    title,
    message,
    triggered_value,
    threshold_value,
    is_acknowledged
) VALUES
    ('f1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'THERMAL_CORE', 'warning', 'Thermal Cartridge 3 Delta Excursion', 'Cartridge #3 running 5.0C above bank average due to dense basal silicate interface.', 325.0, 322.0, false),
    ('f1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'VENT_CHEMISTRY', 'critical', 'High-Enthalpy Acid Plume Ingress', 'Benthic pH dropped below 4.5; dissolved H2 exceeds 100 umol/kg indicating active serpentinization.', 4.12, 4.50, false),
    ('f1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'TETHER_WINCH', 'nominal', 'Optical Fiber Attenuation Nominal', '1550nm return link loss stable at 0.185 dB/km across 5.24 km payout.', 0.185, 0.250, true)
ON CONFLICT (id) DO NOTHING;
