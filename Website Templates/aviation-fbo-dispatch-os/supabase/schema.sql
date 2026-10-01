-- ============================================================
-- AVIATION FBO & RAMP DISPATCH OS — Supabase Schema
-- Asset 86 | Archetype A: Dense Operational Console
-- Ghost Factory™ | Zero-Defect Institutional Standard
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: aircraft_movements
-- Live ramp flight arrivals, departures, and parking assignments
-- ============================================================
CREATE TABLE IF NOT EXISTS aircraft_movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tail_number TEXT NOT NULL,
  aircraft_type TEXT NOT NULL DEFAULT 'Unknown',
  operator_name TEXT,
  origin_icao TEXT,
  destination_icao TEXT,
  eta TIMESTAMPTZ,
  etd TIMESTAMPTZ,
  ramp_position TEXT,
  movement_status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (movement_status IN ('scheduled','inbound','on_ramp','fueling','departing','departed','cancelled')),
  passenger_count INTEGER DEFAULT 0,
  vip_flag BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE aircraft_movements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "aircraft_movements_select_all"
  ON aircraft_movements FOR SELECT USING (TRUE);

CREATE POLICY "aircraft_movements_insert_authenticated"
  ON aircraft_movements FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "aircraft_movements_update_authenticated"
  ON aircraft_movements FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: fuel_dispatch_orders
-- Jet-A / AvGas fuel orders linked to aircraft movements
-- ============================================================
CREATE TABLE IF NOT EXISTS fuel_dispatch_orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movement_id UUID REFERENCES aircraft_movements(id) ON DELETE CASCADE,
  fuel_type TEXT NOT NULL DEFAULT 'Jet-A'
    CHECK (fuel_type IN ('Jet-A','AvGas','SAF')),
  quantity_gallons DECIMAL(10,2) NOT NULL DEFAULT 0,
  unit_price_usd DECIMAL(10,4) DEFAULT 6.80,
  total_cost_usd DECIMAL(12,2) GENERATED ALWAYS AS (quantity_gallons * unit_price_usd) STORED,
  dispatch_status TEXT NOT NULL DEFAULT 'queued'
    CHECK (dispatch_status IN ('queued','assigned','in_progress','complete','invoiced')),
  truck_id TEXT,
  technician_name TEXT,
  dispatched_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fuel_dispatch_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fuel_orders_select_all"
  ON fuel_dispatch_orders FOR SELECT USING (TRUE);

CREATE POLICY "fuel_orders_insert_authenticated"
  ON fuel_dispatch_orders FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "fuel_orders_update_authenticated"
  ON fuel_dispatch_orders FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: ground_service_requests
-- GPU, lavatory, catering, tow, deice, and crew car requests
-- ============================================================
CREATE TABLE IF NOT EXISTS ground_service_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movement_id UUID REFERENCES aircraft_movements(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL
    CHECK (service_type IN ('GPU','lavatory','catering','tow','deice','crew_car','oxygen','nitrogen','custom')),
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  scheduled_for TIMESTAMPTZ,
  assigned_agent TEXT,
  service_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (service_status IN ('pending','assigned','active','complete','cancelled')),
  priority_level TEXT DEFAULT 'normal'
    CHECK (priority_level IN ('low','normal','high','vip')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ground_service_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "gsr_select_all"
  ON ground_service_requests FOR SELECT USING (TRUE);

CREATE POLICY "gsr_insert_authenticated"
  ON ground_service_requests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "gsr_update_authenticated"
  ON ground_service_requests FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: vip_passenger_manifests
-- Passenger PII, preferences, and customs flag for VIP arrivals
-- ============================================================
CREATE TABLE IF NOT EXISTS vip_passenger_manifests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  movement_id UUID REFERENCES aircraft_movements(id) ON DELETE CASCADE,
  passenger_name TEXT NOT NULL,
  passport_last4 TEXT,
  nationality TEXT,
  seat_position TEXT,
  dietary_notes TEXT,
  vehicle_requested BOOLEAN DEFAULT FALSE,
  vehicle_plate TEXT,
  customs_pre_cleared BOOLEAN DEFAULT FALSE,
  vip_tier TEXT DEFAULT 'standard'
    CHECK (vip_tier IN ('standard','premium','ultra')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE vip_passenger_manifests ENABLE ROW LEVEL SECURITY;

-- Stricter policy: only authenticated users can read PII
CREATE POLICY "vip_manifest_select_authenticated"
  ON vip_passenger_manifests FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "vip_manifest_insert_authenticated"
  ON vip_passenger_manifests FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: ramp_positions
-- Static ramp parking spot inventory with capacity & status
-- ============================================================
CREATE TABLE IF NOT EXISTS ramp_positions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  position_code TEXT UNIQUE NOT NULL,
  position_name TEXT NOT NULL,
  max_wingspan_ft INTEGER DEFAULT 100,
  surface_type TEXT DEFAULT 'asphalt',
  is_heated BOOLEAN DEFAULT FALSE,
  is_vip_only BOOLEAN DEFAULT FALSE,
  current_status TEXT NOT NULL DEFAULT 'available'
    CHECK (current_status IN ('available','occupied','reserved','maintenance')),
  notes TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE ramp_positions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ramp_positions_select_all"
  ON ramp_positions FOR SELECT USING (TRUE);

CREATE POLICY "ramp_positions_update_authenticated"
  ON ramp_positions FOR UPDATE
  USING (auth.role() = 'authenticated');
