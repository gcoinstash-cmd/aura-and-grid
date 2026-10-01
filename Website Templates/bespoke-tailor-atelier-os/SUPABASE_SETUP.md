# BESPOKE TAILOR ATELIER OS — Supabase Setup Guide
# Asset 87 | Ghost Factory™ Level 3 Blueprint
# ============================================================
# Setup Time: ~3 minutes
# ============================================================

## Prerequisites
- Active Supabase project
- Configured `.env` (refer to `.env.example`)

## Step 1 — Create Database Tables & RLS (2 min)

1. Open **Supabase Dashboard → SQL Editor**
2. Paste all SQL statements from `supabase/schema.sql`
3. Execute the script to create `client_profiles`, `fabric_inventory`, `garments`, and `fitting_appointments` with Row Level Security enabled.

## Step 2 — Seed Realistic Savile Row Data (30 sec)

1. In the SQL Editor, paste `supabase/seed.sql`
2. Execute the script to populate fabrics (Loro Piana, Dormeuil, Scabal), high-profile clients, active commissions, and fittings.

## Step 3 — Environment Configuration (30 sec)

```bash
cp .env.example .env
```

Set your Supabase credentials:
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
- One-Click Auto-Fill Demo Passkey: `bespoke2026`
