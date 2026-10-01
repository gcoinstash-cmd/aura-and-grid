-- ============================================================
-- BESPOKE TAILOR ATELIER OS — Supabase Schema
-- Asset 87 | Archetype B: Asymmetric Editorial Showcase
-- Ghost Factory™ | Zero-Defect Institutional Standard
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: client_profiles
-- High-net-worth client measurement dossier & preferences
-- ============================================================
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  nationality TEXT,
  preferred_lapel TEXT DEFAULT 'peak'
    CHECK (preferred_lapel IN ('notch','peak','shawl')),
  preferred_canvas TEXT DEFAULT 'full'
    CHECK (preferred_canvas IN ('full','half','fused')),
  chest_cm DECIMAL(6,2),
  waist_cm DECIMAL(6,2),
  seat_cm DECIMAL(6,2),
  inseam_cm DECIMAL(6,2),
  shoulder_cm DECIMAL(6,2),
  sleeve_cm DECIMAL(6,2),
  vip_tier TEXT DEFAULT 'mayfair'
    CHECK (vip_tier IN ('standard','mayfair','royal')),
  total_commissions_gbp DECIMAL(12,2) DEFAULT 0,
  preferred_cutter TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE client_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clients_select_authenticated"
  ON client_profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "clients_insert_authenticated"
  ON client_profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "clients_update_authenticated"
  ON client_profiles FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: fabric_inventory
-- Mill-sourced fabric bolt inventory with pattern/weight specs
-- ============================================================
CREATE TABLE IF NOT EXISTS fabric_inventory (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  fabric_code TEXT UNIQUE NOT NULL,
  mill_name TEXT NOT NULL,
  collection_name TEXT,
  fabric_weight_gsm INTEGER,
  fiber_content TEXT DEFAULT '100% Wool',
  color_family TEXT,
  pattern_type TEXT DEFAULT 'solid'
    CHECK (pattern_type IN ('solid','stripe','check','houndstooth','windowpane','tweed','herringbone','sharkskin')),
  available_meters DECIMAL(8,2) DEFAULT 0,
  price_per_meter_gbp DECIMAL(8,2),
  is_trunk_show BOOLEAN DEFAULT FALSE,
  is_reserved BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fabric_inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fabric_select_all" ON fabric_inventory FOR SELECT USING (TRUE);
CREATE POLICY "fabric_insert_authenticated" ON fabric_inventory FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "fabric_update_authenticated" ON fabric_inventory FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: garments
-- Active and historical commission orders
-- ============================================================
CREATE TABLE IF NOT EXISTS garments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES client_profiles(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  garment_type TEXT NOT NULL
    CHECK (garment_type IN ('suit','coat','trouser','shirt','waistcoat','bespoke_jacket','dinner_suit','morning_coat')),
  fabric_code TEXT REFERENCES fabric_inventory(fabric_code) ON DELETE SET NULL,
  canvas_type TEXT DEFAULT 'full'
    CHECK (canvas_type IN ('full','half','fused')),
  measurement_status TEXT NOT NULL DEFAULT 'intake'
    CHECK (measurement_status IN ('intake','drafted','cut','sewn','first_fitting','second_fitting','finished','delivered')),
  commission_value_gbp DECIMAL(10,2),
  lead_time_weeks INTEGER DEFAULT 18,
  assigned_cutter TEXT,
  lining_color TEXT,
  button_type TEXT,
  notes TEXT,
  order_date DATE DEFAULT CURRENT_DATE,
  target_completion DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE garments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "garments_select_all" ON garments FOR SELECT USING (TRUE);
CREATE POLICY "garments_insert_authenticated" ON garments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "garments_update_authenticated" ON garments FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: fitting_appointments
-- Scheduling for first, second, final fittings and delivery
-- ============================================================
CREATE TABLE IF NOT EXISTS fitting_appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  garment_id UUID REFERENCES garments(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  appointment_type TEXT NOT NULL
    CHECK (appointment_type IN ('first_fitting','second_fitting','final_fitting','delivery','basting','measurement_intake')),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','confirmed','in_progress','complete','cancelled','rescheduled')),
  fitter_name TEXT,
  room_number TEXT DEFAULT 'Fitting Room 1',
  alteration_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fitting_appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fittings_select_all" ON fitting_appointments FOR SELECT USING (TRUE);
CREATE POLICY "fittings_insert_authenticated" ON fitting_appointments FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "fittings_update_authenticated" ON fitting_appointments FOR UPDATE USING (auth.role() = 'authenticated');
