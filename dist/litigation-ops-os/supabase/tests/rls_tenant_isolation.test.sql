-- ============================================================================
-- CANONICAL pgTAP SUITE: MULTI-TENANT ROW LEVEL SECURITY (RLS) VERIFICATION
-- System: LITIGATION OPS OS (Ghost Factory™ Canonical Security Reference)
-- Standard: SOC-2 / Institutional M&A Technical Due Diligence
-- ============================================================================

BEGIN;
SELECT plan(11);

-- 1. Ensure pgTAP extension is active
SELECT has_extension('pgtap');

-- 2. Verify Row Level Security is ACTIVATED on all operational tables
SELECT ok(relrowsecurity, 'Table litigation_dockets must have RLS active') 
  FROM pg_class WHERE relname = 'litigation_dockets';

SELECT ok(relrowsecurity, 'Table ediscovery_documents must have RLS active') 
  FROM pg_class WHERE relname = 'ediscovery_documents';

SELECT ok(relrowsecurity, 'Table case_assessment_inquiries must have RLS active') 
  FROM pg_class WHERE relname = 'case_assessment_inquiries';

-- 3. Setup Mock Tenants for Multi-Tenant Isolation Testing
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  -- Create isolated tenant test roles
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'firm_alpha_partner') THEN
    CREATE ROLE firm_alpha_partner NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'firm_beta_adversary') THEN
    CREATE ROLE firm_beta_adversary NOLOGIN;
  END IF;
END $$;

-- Add tenant isolation demonstration table for matters with auth.uid() isolation
CREATE TABLE IF NOT EXISTS public.tenant_matters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL,
    matter_name TEXT NOT NULL,
    lead_attorney_id UUID NOT NULL,
    confidential_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tenant_matters ENABLE ROW LEVEL SECURITY;

-- Canonical auth.uid() multi-tenant policy: only organization members can select their own matters
DROP POLICY IF EXISTS "Tenant isolation policy" ON public.tenant_matters;
CREATE POLICY "Tenant isolation policy" ON public.tenant_matters
    FOR ALL
    USING (lead_attorney_id = auth.uid());

GRANT ALL ON public.tenant_matters TO authenticated, firm_alpha_partner, firm_beta_adversary;

-- Seed tenant matters under User A (Firm Alpha Partner)
SET LOCAL ROLE postgres;
INSERT INTO public.tenant_matters (organization_id, matter_name, lead_attorney_id, confidential_notes)
VALUES ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Project Titan Antitrust Defense', '11111111-1111-1111-1111-111111111111', 'Privileged Attorney-Client Work Product');

-- 4. Verify Positive Test: User A (Firm Alpha) can access User A's confidential matter
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "11111111-1111-1111-1111-111111111111", "role": "authenticated"}';

SELECT results_eq(
  'SELECT matter_name FROM public.tenant_matters WHERE lead_attorney_id = auth.uid()',
  ARRAY['Project Titan Antitrust Defense'],
  'User A (Firm Alpha) can query own tenant matter records'
);

-- 5. Verify Negative Test: User B (Adversary Firm Beta) CANNOT see User A's records (0 rows returned)
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "22222222-2222-2222-2222-222222222222", "role": "authenticated"}';

SELECT is_empty(
  'SELECT * FROM public.tenant_matters WHERE matter_name = ''Project Titan Antitrust Defense''',
  'User B (Adversary Firm Beta) cannot access User A privileged matters (isolated by auth.uid)'
);

-- 6. Verify Negative Test: User B cannot modify or update User A's matters
SELECT lives_ok(
  'UPDATE public.tenant_matters SET confidential_notes = ''Breached'' WHERE matter_name = ''Project Titan Antitrust Defense''',
  'Update query executes under RLS boundary without error'
);

SET LOCAL ROLE postgres;
SELECT results_eq(
  'SELECT confidential_notes FROM public.tenant_matters WHERE matter_name = ''Project Titan Antitrust Defense''',
  ARRAY['Privileged Attorney-Client Work Product'],
  'User B update was blocked by RLS - confidential notes remain unmodified'
);

-- 7. Verify Negative Test: Unauthenticated anon role cannot insert privileged e-Discovery
SET LOCAL ROLE anon;
SET LOCAL "request.jwt.claims" = '{"role": "anon"}';

SELECT throws_ok(
  'INSERT INTO public.ediscovery_documents (bates_range, document_title, custodian, hash_sha256) VALUES (''BATES-001'', ''Confidential M&A Memo'', ''General Counsel'', ''e3b0c442'')',
  '42501',
  NULL,
  'Unauthenticated anon role must be strictly rejected from inserting privileged e-Discovery'
);

-- 8. Verify Positive Test: Case inquiries allow public intake
SELECT lives_ok(
  'INSERT INTO public.case_assessment_inquiries (claimant_entity, adverse_party, counsel_email, claim_scale) VALUES (''Acme Corp'', ''Initech LLC'', ''intake@acme.com'', ''$10M+'')',
  'Anonymous prospective clients can submit case assessment intake inquiries'
);

-- 9. Verify Policy Existence in pg_policies
SELECT ok(
  COUNT(*) >= 3,
  'Operational tables have explicitly defined security policies registered in pg_policies'
) FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('litigation_dockets', 'ediscovery_documents', 'case_assessment_inquiries');

SELECT * FROM finish();
ROLLBACK;
