-- ============================================================
-- BESPOKE TAILOR ATELIER OS — Seed Data
-- ============================================================

-- Fabric Inventory
INSERT INTO fabric_inventory (fabric_code, mill_name, collection_name, fabric_weight_gsm, fiber_content, color_family, pattern_type, available_meters, price_per_meter_gbp, is_trunk_show) VALUES
  ('LP-160-001', 'Loro Piana', 'Platinum Collection 2026', 310, '100% Super 160s Wool', 'Navy', 'solid', 18.5, 285.00, false),
  ('HS-FR-042', 'Holland & Sherry', 'Fresco III', 280, '100% Worsted Wool', 'Charcoal', 'stripe', 24.0, 145.00, false),
  ('DM-AM-018', 'Dormeuil', 'Amadeus', 260, '100% Super 140s Merino', 'Mid Grey', 'solid', 12.0, 195.00, true),
  ('SC-HT-009', 'Scabal', 'Golden Bale', 290, '100% Cashmere', 'Camel', 'herringbone', 8.5, 340.00, false),
  ('VBC-WP-033', 'Vitale Barberis Canonico', 'S130s Windowpane', 270, '100% Wool', 'Slate Blue', 'windowpane', 30.0, 95.00, false),
  ('ZT-TW-007', 'Zegna Traveller', 'High Performance', 200, '100% Wool', 'Black', 'solid', 15.0, 220.00, false);

-- Client Profiles
INSERT INTO client_profiles (full_name, nationality, preferred_lapel, preferred_canvas, chest_cm, waist_cm, seat_cm, inseam_cm, shoulder_cm, vip_tier, total_commissions_gbp, preferred_cutter) VALUES
  ('Lord Alistair Pemberton', 'British', 'peak', 'full', 101.5, 88.0, 104.0, 80.5, 47.5, 'royal', 48500.00, 'Mr. Thomas Archer'),
  ('Viktor Sokolov', 'Russian', 'notch', 'full', 106.0, 92.5, 110.0, 82.0, 49.0, 'mayfair', 22800.00, 'Mr. James Thornton'),
  ('Sebastián Ramírez', 'Colombian', 'peak', 'half', 98.0, 84.0, 100.5, 79.0, 46.5, 'mayfair', 14200.00, 'Mr. Thomas Archer');

-- Garments (linked to clients)
INSERT INTO garments (client_name, garment_type, fabric_code, canvas_type, measurement_status, commission_value_gbp, lead_time_weeks, assigned_cutter, lining_color, notes, order_date, target_completion)
VALUES
  ('Lord Alistair Pemberton', 'suit', 'LP-160-001', 'full', 'second_fitting', 6800.00, 18, 'Mr. Thomas Archer', 'Royal Blue Bemberg', 'Peak lapel, ticket pocket, surgeon''s cuffs, mother-of-pearl buttons', '2026-07-10', '2026-10-28'),
  ('Viktor Sokolov', 'coat', 'SC-HT-009', 'full', 'cut', 4200.00, 22, 'Mr. James Thornton', 'Ivory Silk', 'Camel overcoat, double-breasted, horn buttons, fly front', '2026-08-01', '2026-12-05'),
  ('Sebastián Ramírez', 'dinner_suit', 'DM-AM-018', 'half', 'drafted', 3800.00, 16, 'Mr. Thomas Archer', 'Black Silk Satin', 'Peak shawl, silk lapel facing, single button', '2026-09-01', '2026-11-15'),
  ('Lord Alistair Pemberton', 'trouser', 'VBC-WP-033', 'fused', 'sewn', 1200.00, 8, 'Mr. Thomas Archer', NULL, 'Slate windowpane odd trousers, side adjusters', '2026-09-10', '2026-10-20');

-- Fitting Appointments
INSERT INTO fitting_appointments (client_name, appointment_type, scheduled_at, duration_minutes, status, fitter_name, room_number, alteration_notes)
VALUES
  ('Lord Alistair Pemberton', 'second_fitting', NOW() + INTERVAL '3 days', 90, 'confirmed', 'Mr. Thomas Archer', 'Fitting Room 1', 'Left sleeve: 0.5cm shorten. Right shoulder: ease 0.3cm'),
  ('Viktor Sokolov', 'first_fitting', NOW() + INTERVAL '6 days', 75, 'scheduled', 'Mr. James Thornton', 'Fitting Room 2', NULL),
  ('Sebastián Ramírez', 'measurement_intake', NOW() + INTERVAL '1 day', 45, 'confirmed', 'Mr. Thomas Archer', 'Fitting Room 1', 'Initial measurement session — new trouser order');
