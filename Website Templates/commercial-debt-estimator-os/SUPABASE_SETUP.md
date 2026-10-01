# COMMERCIAL DEBT ESTIMATOR OS — Supabase Setup Guide
# Asset 88 | Ghost Factory™ Level 3 Blueprint
# ============================================================
# Setup Time: ~3 minutes
# ============================================================

## Prerequisites
- Active Supabase project
- Configured `.env` (refer to `.env.example`)

## Step 1 — Create Underwriting Tables & RLS (2 min)

1. Open **Supabase Dashboard → SQL Editor**
2. Paste all SQL from `supabase/schema.sql`
3. Execute to create `loan_applications`, `underwriting_scenarios`, `term_sheets`, and `deal_documents` with Row Level Security.

## Step 2 — Seed Institutional Data (30 sec)

1. In the SQL Editor, paste `supabase/seed.sql`
2. Execute to populate institutional transactions (Multifamily & Office towers), DSCR models, CMBS term sheets, and diligence documents.

## Step 3 — Environment Configuration (30 sec)

```bash
cp .env.example .env
```

Configure API endpoints:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4 — Run Application

```bash
npm install
npm run dev
```

## Admin Demo Access

- Route: `/admin`
- One-Click Auto-Fill Demo Passkey: `debtestimator2026`
