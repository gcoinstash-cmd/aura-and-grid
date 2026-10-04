-- ==============================================================================
-- Institutional EV Fleet Management & Charging Matrix Seed Fixtures
-- Aura & Grid Blueprint Seed Artifact (Minimum 10+ realistic domain rows)
-- ==============================================================================

-- 1. Seed Fleet Depots
INSERT INTO public.fleets (id, hub_name, substation_code, metro_zone, max_grid_capacity_kw, peak_throttle_limit_kw, emergency_throttle_active, baseload_kw)
VALUES 
('f0000001-0000-0000-0000-000000000001', 'VoltGrid Fleet HQ - Metro West', 'PG&E-SUB-115KV-OAK', 'NorCal East Bay Metro', 1200, 600, FALSE, 48),
('f0000001-0000-0000-0000-000000000002', 'VoltGrid Logistics Hub - Silicon South', 'SVP-SUB-230KV-SJC', 'South Bay Tech Corridor', 1500, 750, FALSE, 64)
ON CONFLICT (id) DO NOTHING;

-- 2. Seed Commercial Delivery Vehicles (10 Rows)
INSERT INTO public.vehicles (
    id, fleet_id, vin, callsign, model, driver_name, driver_callsign, status, assigned_corridor,
    battery_capacity_kwh, soc_pct, range_mi, speed_mph, route_progress_pct, parcel_capacity_pct,
    parcels_total, parcels_remaining, lat, lng, heading_deg, temp_motor_c, temp_pack_c,
    tire_fl_psi, tire_fr_psi, tire_rl_psi, tire_rr_psi
) VALUES
('a0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED4NFC92011', 'CYBERHAUL-01', 'FreightVolt TransMax 400', 'Jaxson Chen', 'VORTEX-1', 'in_transit', 'I-880 Freight Corridor', 120.0, 68.0, 148, 54, 42.0, 84, 62, 36, 37.761200, -122.213400, 142, 62.0, 29.4, 42.0, 42.0, 45.0, 45.0),
('a0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED7NFC83204', 'URBANVAN-02', 'VoltCourier CityLite 250', 'Elena Rostova', 'PHANTOM-2', 'in_transit', 'Downtown Central Loop', 85.0, 31.0, 65, 28, 78.0, 92, 88, 18, 37.784500, -122.408900, 310, 58.0, 31.2, 39.0, 39.0, 41.0, 41.0),
('a0000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED9NFC19042', 'APEXCARGO-03', 'HeavyGrid Class 7 Hauler', 'Marcus Kane', 'IRONCLAD-3', 'in_transit', 'Port Terminals Alpha', 220.0, 82.0, 188, 42, 24.0, 45, 34, 26, 37.798100, -122.289100, 215, 54.0, 28.1, 105.0, 105.0, 110.0, 110.0),
('a0000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED1NFC67412', 'VOLTHAUL-04', 'VoltCourier CityLite 250', 'Tariq Al-Mansoor', 'ATLAS-4', 'warning', 'North Industrial Belt', 85.0, 11.0, 24, 47, 88.0, 76, 54, 8, 37.834100, -122.291200, 45, 69.0, 35.8, 38.0, 38.0, 40.0, 40.0),
('a0000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED6NFC55198', 'COURIERE-05', 'FreightVolt TransMax 400', 'Sarah Lindqvist', 'FALCON-5', 'in_transit', 'Silicon Express West', 120.0, 59.0, 124, 62, 52.0, 88, 70, 32, 37.643200, -122.411100, 165, 64.0, 30.1, 41.0, 41.0, 44.0, 44.0),
('a0000001-0000-0000-0000-000000000006', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED3NFC77103', 'TITANFREIGHT-06', 'HeavyGrid Class 7 Hauler', 'Devon Vance', 'TITAN-6', 'in_transit', 'Bay Bridge Arterial', 220.0, 47.0, 95, 38, 64.0, 60, 40, 16, 37.801200, -122.368800, 260, 67.0, 32.5, 108.0, 108.0, 112.0, 112.0),
('a0000001-0000-0000-0000-000000000007', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED8NFC22091', 'METROVAN-07', 'VoltCourier CityLite 250', 'Chloe Nguyen', 'SPECTER-7', 'in_transit', 'South Metro Ring', 85.0, 74.0, 160, 46, 35.0, 95, 96, 60, 37.712100, -122.450200, 195, 56.0, 27.8, 40.0, 40.0, 42.0, 42.0),
('a0000001-0000-0000-0000-000000000008', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED2NFC44980', 'CARGOMAX-08', 'FreightVolt TransMax 400', 'Roland Bishop', 'VIPER-8', 'in_transit', 'Airport Cargo Way', 120.0, 52.0, 112, 58, 60.0, 34, 44, 18, 37.621400, -122.378900, 110, 61.0, 29.8, 42.0, 42.0, 45.0, 45.0),
('a0000001-0000-0000-0000-000000000009', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED5NFC99112', 'THUNDERVAN-09', 'FreightVolt TransMax 400', 'Gavin Pierce', 'BOLT-9', 'charging', 'Depot Dock 01', 120.0, 74.0, 162, 0, 100.0, 10, 50, 0, 37.804400, -122.271100, 0, 38.0, 38.4, 42.0, 42.0, 45.0, 45.0),
('a0000001-0000-0000-0000-000000000010', 'f0000001-0000-0000-0000-000000000001', '1FTFW1ED0NFC33120', 'AEROHAUL-10', 'HeavyGrid Class 7 Hauler', 'Nadia Kasparov', 'AERO-10', 'charging', 'Depot Dock 02', 220.0, 83.0, 192, 0, 100.0, 0, 30, 0, 37.804400, -122.271100, 0, 44.0, 44.1, 105.0, 105.0, 110.0, 110.0)
ON CONFLICT (vin) DO NOTHING;

-- 3. Seed Charging Bays (6 Dedicated Bays)
INSERT INTO public.charging_bays (
    id, fleet_id, bay_number, bay_name, status, max_output_kw, current_kw,
    connected_vehicle_id, vehicle_vin, vehicle_callsign, target_soc_pct, thermals_c, time_to_full_sec, is_boosted, is_surge_throttled
) VALUES
('b0000001-0000-0000-0000-000000000001', 'f0000001-0000-0000-0000-000000000001', '01', 'DCFC-ALPHA-150', 'charging', 150, 142, 'a0000001-0000-0000-0000-000000000009', '1FTFW1ED5NFC99112', 'THUNDERVAN-09', 95.0, 38.4, 1080, FALSE, FALSE),
('b0000001-0000-0000-0000-000000000002', 'f0000001-0000-0000-0000-000000000001', '02', 'DCFC-ULTRA-350', 'charging', 350, 344, 'a0000001-0000-0000-0000-000000000010', '1FTFW1ED0NFC33120', 'AEROHAUL-10', 90.0, 44.1, 540, TRUE, FALSE),
('b0000001-0000-0000-0000-000000000003', 'f0000001-0000-0000-0000-000000000001', '03', 'DCFC-RAPID-150', 'standby', 150, 0, NULL, NULL, NULL, 90.0, 22.0, 0, FALSE, FALSE),
('b0000001-0000-0000-0000-000000000004', 'f0000001-0000-0000-0000-000000000001', '04', 'DCFC-HYPER-350', 'charging', 350, 150, NULL, '1FTFW1ED8NFC88401', 'FREIGHT-E-11', 85.0, 36.5, 1440, FALSE, FALSE),
('b0000001-0000-0000-0000-000000000005', 'f0000001-0000-0000-0000-000000000001', '05', 'DCFC-MEGABAY-350', 'maintenance', 350, 0, NULL, NULL, NULL, 90.0, 19.8, 0, FALSE, FALSE),
('b0000001-0000-0000-0000-000000000006', 'f0000001-0000-0000-0000-000000000001', '06', 'DCFC-FLEX-150', 'standby', 150, 0, NULL, NULL, NULL, 90.0, 21.5, 0, FALSE, FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Seed Delivery Stop Waypoints (12 Rows)
INSERT INTO public.delivery_waypoints (vehicle_id, stop_sequence, stop_name, street_address, parcels_count, is_completed, eta_timestamp)
VALUES
('a0000001-0000-0000-0000-000000000001', 1, 'Oakland Intermodal Depot', '1490 7th St', 20, TRUE, NOW() - INTERVAL '40 minutes'),
('a0000001-0000-0000-0000-000000000001', 2, 'San Leandro Micro-Hub', '2200 Marina Blvd', 16, FALSE, NOW() + INTERVAL '12 minutes'),
('a0000001-0000-0000-0000-000000000001', 3, 'Hayward Logistics Park', '28000 Industrial Pkwy', 26, FALSE, NOW() + INTERVAL '38 minutes'),
('a0000001-0000-0000-0000-000000000002', 1, 'Financial District Parcel Hub', '450 California St', 35, TRUE, NOW() - INTERVAL '60 minutes'),
('a0000001-0000-0000-0000-000000000002', 2, 'Civic Center Dispatch Locker', '100 Van Ness Ave', 35, TRUE, NOW() - INTERVAL '15 minutes'),
('a0000001-0000-0000-0000-000000000002', 3, 'SOMA Tech Campus Box', '650 Townsend St', 18, FALSE, NOW() + INTERVAL '8 minutes'),
('a0000001-0000-0000-0000-000000000003', 1, 'Pier 52 Container Staging', 'Port Way Slip 4', 8, TRUE, NOW() - INTERVAL '30 minutes'),
('a0000001-0000-0000-0000-000000000003', 2, 'Alameda Gateway Warehousing', '2150 Mariner Sq', 12, FALSE, NOW() + INTERVAL '18 minutes'),
('a0000001-0000-0000-0000-000000000004', 1, 'Emeryville Biotech Campus', '5858 Horton St', 22, TRUE, NOW() - INTERVAL '50 minutes'),
('a0000001-0000-0000-0000-000000000004', 2, 'Berkeley West Distribution', '1000 Heinz Ave', 24, TRUE, NOW() - INTERVAL '10 minutes'),
('a0000001-0000-0000-0000-000000000004', 3, 'Albany Commercial Bay', '1250 San Pablo Ave', 8, FALSE, NOW() + INTERVAL '14 minutes'),
('a0000001-0000-0000-0000-000000000005', 1, 'SFO Air Freight Gate 4', 'Cargo Rd Bldg 600', 38, TRUE, NOW() - INTERVAL '25 minutes');

-- 5. Seed Telemetry Ingest Logs (10 Rows)
INSERT INTO public.telemetry_logs (
    vehicle_id, recorded_at, soc_pct, speed_mph, motor_temp_c, pack_temp_c,
    cell_min_v, cell_max_v, kw_draw, lat, lng
) VALUES
('a0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '10 seconds', 68.2, 54, 62.1, 29.4, 4.132, 4.161, 48.5, 37.761200, -122.213400),
('a0000001-0000-0000-0000-000000000001', NOW() - INTERVAL '5 seconds', 68.1, 55, 62.3, 29.4, 4.131, 4.160, 49.2, 37.761350, -122.213250),
('a0000001-0000-0000-0000-000000000002', NOW() - INTERVAL '8 seconds', 31.2, 28, 58.0, 31.2, 3.811, 3.842, 22.4, 37.784500, -122.408900),
('a0000001-0000-0000-0000-000000000003', NOW() - INTERVAL '12 seconds', 82.1, 42, 54.2, 28.1, 4.201, 4.223, 72.8, 37.798100, -122.289100),
('a0000001-0000-0000-0000-000000000004', NOW() - INTERVAL '4 seconds', 11.2, 47, 69.1, 35.8, 3.452, 3.491, 52.0, 37.834100, -122.291200),
('a0000001-0000-0000-0000-000000000005', NOW() - INTERVAL '6 seconds', 59.3, 62, 64.0, 30.1, 4.012, 4.032, 58.4, 37.643200, -122.411100),
('a0000001-0000-0000-0000-000000000006', NOW() - INTERVAL '15 seconds', 47.4, 38, 67.2, 32.5, 3.931, 3.953, 66.1, 37.801200, -122.368800),
('a0000001-0000-0000-0000-000000000007', NOW() - INTERVAL '3 seconds', 74.1, 46, 56.4, 27.8, 4.152, 4.171, 38.9, 37.712100, -122.450200),
('a0000001-0000-0000-0000-000000000008', NOW() - INTERVAL '7 seconds', 52.3, 58, 61.2, 29.8, 3.972, 3.992, 51.7, 37.621400, -122.378900),
('a0000001-0000-0000-0000-000000000009', NOW() - INTERVAL '2 seconds', 74.0, 0, 38.0, 38.4, 4.180, 4.195, -142.0, 37.804400, -122.271100);

-- 6. Seed Reroute Dispatches
INSERT INTO public.reroute_dispatches (id, vehicle_id, target_bay_id, dispatch_status, reason, dispatched_by)
VALUES
('d0000001-0000-0000-0000-000000000001', 'a0000001-0000-0000-0000-000000000004', 'b0000001-0000-0000-0000-000000000003', 'en_route', 'Critical SoC below 12% on North Industrial corridor', 'AUTOMATED_TELEMETRY_DISPATCH');
