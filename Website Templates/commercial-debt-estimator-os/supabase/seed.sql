-- ============================================================
-- COMMERCIAL DEBT ESTIMATOR OS — Seed Data
-- ============================================================

-- Loan Applications
INSERT INTO loan_applications (id, borrower_name, entity_type, property_address, property_type, loan_purpose, purchase_price_usd, requested_amount_usd, gross_potential_rent_usd, vacancy_rate_pct, operating_expenses_usd, net_operating_income_usd, ltv_ratio, dscr_ratio, debt_yield_pct, application_status)
VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Apex Meridian Capital LLC', 'LLC', '450 North Michigan Ave, Chicago, IL', 'multifamily', 'acquisition', 12500000.00, 8500000.00, 1420000.00, 5.00, 480000.00, 869000.00, 68.00, 1.42, 10.22, 'under_review'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Vanguard Commercial Partners', 'REIT', '1200 Brickell Bay Drive, Miami, FL', 'office', 'refinance', 22000000.00, 14000000.00, 2600000.00, 7.50, 820000.00, 1585000.00, 63.64, 1.35, 11.32, 'term_sheet_issued');

-- Underwriting Scenarios for App 1 (Multifamily)
INSERT INTO underwriting_scenarios (application_id, scenario_name, interest_rate_pct, rate_type, term_years, amortization_years, interest_only_months, origination_fee_pct, annual_debt_service_usd, monthly_payment_usd, resulting_dscr, resulting_debt_yield_pct, break_even_occupancy_pct, is_selected)
VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Agency Fixed 10-Yr (Fannie Mae DUS)', 5.850, 'fixed', 10, 30, 24, 1.00, 602324.00, 50193.67, 1.44, 10.22, 69.40, true),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'Life Company Fixed 7-Yr', 5.600, 'fixed', 7, 25, 0, 0.75, 631488.00, 52624.00, 1.38, 10.22, 71.80, false);

-- Underwriting Scenarios for App 2 (Office)
INSERT INTO underwriting_scenarios (application_id, scenario_name, interest_rate_pct, rate_type, term_years, amortization_years, interest_only_months, origination_fee_pct, annual_debt_service_usd, monthly_payment_usd, resulting_dscr, resulting_debt_yield_pct, break_even_occupancy_pct, is_selected)
VALUES
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'CMBS Conduit 10-Yr Fixed', 6.250, 'fixed', 10, 30, 36, 1.00, 1035240.00, 86270.00, 1.53, 11.32, 66.50, true);

-- Term Sheet for App 2
INSERT INTO term_sheets (application_id, lender_institution, loan_amount_usd, interest_rate_display, spread_bps, index_benchmark, recourse_type, prepayment_penalty_structure, expiration_date, term_sheet_status)
VALUES
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'Goldman Sachs Commercial Mortgage Capital', 14000000.00, '6.25% Fixed (SOFR + 215 bps)', 215, '10-Yr US Treasury', 'non_recourse', 'Defeasance / Yield Maintenance (Lesser of)', CURRENT_DATE + INTERVAL '30 days', 'issued');

-- Deal Documents
INSERT INTO deal_documents (application_id, document_type, file_name, file_size_bytes, storage_path, verification_status, verified_by)
VALUES
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'rent_roll', 'Apex_Meridian_Certified_Rent_Roll_Q3_2026.xlsx', 412000, 'docs/deals/a1/rent_roll.xlsx', 'verified', 'Underwriter M. Chen'),
  ('a1b2c3d4-e5f6-4a1b-8c2d-3e4f5a6b7c8d', 'operating_statement', 'T12_Operating_Statement_Audited.pdf', 1250000, 'docs/deals/a1/t12.pdf', 'verified', 'Underwriter M. Chen'),
  ('b2c3d4e5-f6a1-4b2c-9d3e-4f5a6b7c8d9e', 'appraisal', 'CBRE_Appraisal_Report_Brickell_1200.pdf', 8400000, 'docs/deals/b2/appraisal.pdf', 'verified', 'Chief Risk Officer S. Vance');
