-- ============================================================
-- AVIATION FBO & RAMP DISPATCH OS — Seed Data
-- Realistic mock data for demo/development environment
-- ============================================================

-- Seed ramp positions first (no foreign key dependency)
INSERT INTO ramp_positions (position_code, position_name, max_wingspan_ft, surface_type, is_heated, is_vip_only, current_status) VALUES
  ('R-01', 'Ramp Alpha — VIP Arrival Pad', 200, 'asphalt', false, true, 'occupied'),
  ('R-02', 'Ramp Bravo — Large Cabin', 180, 'asphalt', false, false, 'occupied'),
  ('R-03', 'Ramp Charlie — Mid Cabin', 120, 'asphalt', false, false, 'available'),
  ('R-04', 'Ramp Delta — Light Jet Bay', 80, 'concrete', true, false, 'available'),
  ('R-05', 'Ramp Echo — Maintenance Hold', 150, 'asphalt', false, false, 'maintenance'),
  ('R-06', 'Ramp Foxtrot — Ultra Long Range', 220, 'asphalt', false, true, 'reserved'),
  ('H-01', 'Hangar 1 — Climate Controlled', 200, 'epoxy', true, true, 'occupied'),
  ('H-02', 'Hangar 2 — Standard Storage', 160, 'concrete', false, false, 'available');

-- Seed aircraft movements
INSERT INTO aircraft_movements (tail_number, aircraft_type, operator_name, origin_icao, destination_icao, eta, etd, ramp_position, movement_status, passenger_count, vip_flag) VALUES
  ('N741GX', 'Gulfstream G700', 'Obsidian Capital Group', 'KTEB', 'KBVP', NOW() - INTERVAL '2 hours', NOW() + INTERVAL '4 hours', 'R-01', 'on_ramp', 6, TRUE),
  ('N883PX', 'Bombardier Global 7500', 'Apex Holdings LLC', 'KJFK', 'KLAX', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '2 hours', 'R-02', 'fueling', 8, TRUE),
  ('N527LJ', 'Cessna Citation XLS+', 'Legacy Aviation Charter', 'KPBI', 'KTEB', NOW() + INTERVAL '1 hour', NULL, NULL, 'inbound', 4, FALSE),
  ('N210RS', 'Embraer Phenom 300E', 'RS Executive Transport', 'KMDW', 'KTEB', NOW() + INTERVAL '2.5 hours', NULL, NULL, 'scheduled', 3, FALSE),
  ('N990VL', 'Dassault Falcon 10X', 'Vantage Luxury Group', 'EGLL', 'KTEB', NOW() + INTERVAL '6 hours', NULL, NULL, 'inbound', 10, TRUE);

-- Seed fuel dispatch orders (linked to first two movements)
INSERT INTO fuel_dispatch_orders (movement_id, fuel_type, quantity_gallons, unit_price_usd, dispatch_status, truck_id, technician_name, dispatched_at)
SELECT id, 'Jet-A', 2400.00, 6.95, 'complete', 'TRUCK-04', 'M. Reyes', NOW() - INTERVAL '1 hour'
FROM aircraft_movements WHERE tail_number = 'N741GX';

INSERT INTO fuel_dispatch_orders (movement_id, fuel_type, quantity_gallons, unit_price_usd, dispatch_status, truck_id, technician_name, dispatched_at)
SELECT id, 'Jet-A', 3800.00, 6.95, 'in_progress', 'TRUCK-02', 'D. Okonkwo', NOW() - INTERVAL '15 minutes'
FROM aircraft_movements WHERE tail_number = 'N883PX';

-- Seed ground service requests
INSERT INTO ground_service_requests (movement_id, service_type, assigned_agent, service_status, priority_level, notes)
SELECT id, 'GPU', 'Agent: K. Albright', 'complete', 'vip', 'GPU-12 connected, 28VDC stable'
FROM aircraft_movements WHERE tail_number = 'N741GX';

INSERT INTO ground_service_requests (movement_id, service_type, assigned_agent, service_status, priority_level)
SELECT id, 'crew_car', 'Agent: T. Harmon', 'complete', 'vip'
FROM aircraft_movements WHERE tail_number = 'N741GX';

INSERT INTO ground_service_requests (movement_id, service_type, service_status, priority_level, notes)
SELECT id, 'catering', 'pending', 'high', 'Kosher + vegan selections confirmed with caterer'
FROM aircraft_movements WHERE tail_number = 'N883PX';

-- Seed VIP manifests
INSERT INTO vip_passenger_manifests (movement_id, passenger_name, nationality, seat_position, dietary_notes, vehicle_requested, customs_pre_cleared, vip_tier)
SELECT id, 'Alexandra Voss', 'US', '1A', 'Vegan — no nuts', TRUE, TRUE, 'ultra'
FROM aircraft_movements WHERE tail_number = 'N741GX';

INSERT INTO vip_passenger_manifests (movement_id, passenger_name, nationality, seat_position, vehicle_requested, customs_pre_cleared, vip_tier)
SELECT id, 'Marcus Chen', 'US', '1B', TRUE, TRUE, 'ultra'
FROM aircraft_movements WHERE tail_number = 'N741GX';
