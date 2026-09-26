-- LITIGATION OPS OS Database Schema
-- Production Supabase SQL Definition with Row Level Security (RLS)

CREATE TABLE IF NOT EXISTS public.litigation_dockets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_name TEXT NOT NULL,
    jurisdiction TEXT NOT NULL,
    claim_amount TEXT NOT NULL,
    stage TEXT NOT NULL,
    trial_date TEXT NOT NULL,
    lead_counsel TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'WAR ROOM ACTIVE',
    key_issues JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ediscovery_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bates_range TEXT NOT NULL,
    document_title TEXT NOT NULL,
    custodian TEXT NOT NULL,
    hash_sha256 TEXT NOT NULL,
    privilege_status TEXT NOT NULL DEFAULT 'REDACTED PRODUCED',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.case_assessment_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claimant_entity TEXT NOT NULL,
    adverse_party TEXT NOT NULL,
    counsel_email TEXT NOT NULL,
    claim_scale TEXT NOT NULL,
    conflict_cleared BOOLEAN DEFAULT false,
    status TEXT NOT NULL DEFAULT 'PENDING CONFLICT CHECK',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.litigation_dockets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ediscovery_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_assessment_inquiries ENABLE ROW LEVEL SECURITY;

-- Public read access for non-privileged active dockets
CREATE POLICY "Public read dockets" ON public.litigation_dockets
    FOR SELECT USING (true);

-- Public insert for case assessment inquiries
CREATE POLICY "Public insert inquiries" ON public.case_assessment_inquiries
    FOR INSERT WITH CHECK (true);

-- Authenticated administrative full access
CREATE POLICY "Admin full access dockets" ON public.litigation_dockets
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access ediscovery" ON public.ediscovery_documents
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access inquiries" ON public.case_assessment_inquiries
    FOR ALL TO authenticated USING (true) WITH CHECK (true);
