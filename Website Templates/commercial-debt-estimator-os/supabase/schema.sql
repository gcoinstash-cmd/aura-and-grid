-- ============================================================
-- COMMERCIAL DEBT ESTIMATOR OS — Supabase Schema
-- Asset 88 | Archetype C: Step-by-Step Calculator / Wizard
-- Ghost Factory™ | Zero-Defect Institutional Standard
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: loan_applications
-- Primary borrower entity and asset level intake
-- ============================================================
CREATE TABLE IF NOT EXISTS loan_applications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  borrower_name TEXT NOT NULL,
  entity_type TEXT DEFAULT 'LLC'
    CHECK (entity_type IN ('LLC','Corporation','REIT','Limited_Partnership','Individual')),
  property_address TEXT NOT NULL,
  property_type TEXT NOT NULL
    CHECK (property_type IN ('multifamily','office','retail','industrial','mixed_use','hotel','student_housing')),
  loan_purpose TEXT NOT NULL
    CHECK (loan_purpose IN ('acquisition','refinance','bridge','construction','mezzanine')),
  purchase_price_usd DECIMAL(14,2),
  requested_amount_usd DECIMAL(14,2) NOT NULL,
  gross_potential_rent_usd DECIMAL(12,2),
  vacancy_rate_pct DECIMAL(5,2) DEFAULT 5.00,
  operating_expenses_usd DECIMAL(12,2),
  net_operating_income_usd DECIMAL(12,2),
  ltv_ratio DECIMAL(5,2),
  dscr_ratio DECIMAL(5,2),
  debt_yield_pct DECIMAL(5,2),
  application_status TEXT DEFAULT 'draft'
    CHECK (application_status IN ('draft','submitted','under_review','term_sheet_issued','approved','funded','declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE loan_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "loan_apps_select_all" ON loan_applications FOR SELECT USING (TRUE);
CREATE POLICY "loan_apps_insert_auth" ON loan_applications FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "loan_apps_update_auth" ON loan_applications FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: underwriting_scenarios
-- Multiple financing structures per loan application
-- ============================================================
CREATE TABLE IF NOT EXISTS underwriting_scenarios (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
  scenario_name TEXT NOT NULL,
  interest_rate_pct DECIMAL(5,3) NOT NULL,
  rate_type TEXT DEFAULT 'fixed'
    CHECK (rate_type IN ('fixed','floating','hybrid')),
  term_years INTEGER NOT NULL DEFAULT 10,
  amortization_years INTEGER DEFAULT 30,
  interest_only_months INTEGER DEFAULT 0,
  origination_fee_pct DECIMAL(4,2) DEFAULT 1.00,
  annual_debt_service_usd DECIMAL(12,2),
  monthly_payment_usd DECIMAL(10,2),
  resulting_dscr DECIMAL(5,2),
  resulting_debt_yield_pct DECIMAL(5,2),
  break_even_occupancy_pct DECIMAL(5,2),
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE underwriting_scenarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scenarios_select_all" ON underwriting_scenarios FOR SELECT USING (TRUE);
CREATE POLICY "scenarios_insert_auth" ON underwriting_scenarios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "scenarios_update_auth" ON underwriting_scenarios FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: term_sheets
-- Formal institutional term sheets generated from approved sizing
-- ============================================================
CREATE TABLE IF NOT EXISTS term_sheets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
  lender_institution TEXT NOT NULL,
  loan_amount_usd DECIMAL(14,2) NOT NULL,
  interest_rate_display TEXT NOT NULL,
  spread_bps INTEGER,
  index_benchmark TEXT,
  recourse_type TEXT DEFAULT 'non_recourse'
    CHECK (recourse_type IN ('full_recourse','partial_recourse','non_recourse')),
  prepayment_penalty_structure TEXT DEFAULT 'yield_maintenance',
  issuance_date DATE DEFAULT CURRENT_DATE,
  expiration_date DATE,
  term_sheet_status TEXT DEFAULT 'draft'
    CHECK (term_sheet_status IN ('draft','issued','accepted','counter_offer','expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE term_sheets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "term_sheets_select_all" ON term_sheets FOR SELECT USING (TRUE);
CREATE POLICY "term_sheets_insert_auth" ON term_sheets FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "term_sheets_update_auth" ON term_sheets FOR UPDATE USING (auth.role() = 'authenticated');

-- ============================================================
-- TABLE: deal_documents
-- Rent rolls, operating statements, appraisals & KYC docs
-- ============================================================
CREATE TABLE IF NOT EXISTS deal_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  application_id UUID REFERENCES loan_applications(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL
    CHECK (document_type IN ('rent_roll','operating_statement','appraisal','environmental_phase1','title_commitment','kyc_borrower')),
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  storage_path TEXT,
  verification_status TEXT DEFAULT 'pending'
    CHECK (verification_status IN ('pending','verified','rejected','needs_update')),
  verified_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deal_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "documents_select_all" ON deal_documents FOR SELECT USING (TRUE);
CREATE POLICY "documents_insert_auth" ON deal_documents FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "documents_update_auth" ON deal_documents FOR UPDATE USING (auth.role() = 'authenticated');
