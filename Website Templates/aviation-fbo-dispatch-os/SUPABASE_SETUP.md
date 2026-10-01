# AVIATION FBO & RAMP DISPATCH OS — Supabase Setup Guide
# Asset 86 | Ghost Factory™ Level 3 Blueprint
# ============================================================
# Setup Time: ~3 minutes
# ============================================================

## Prerequisites
- Active Supabase project (free tier works fine)
- `.env` file configured (see `.env.example`)

## Step 1 — Create Tables (2 min)

1. Go to **Supabase Dashboard → SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run** — all 5 tables + RLS policies will be created

## Step 2 — Load Demo Data (30 sec)

1. In the same SQL Editor, paste `supabase/seed.sql`
2. Click **Run** — ramp positions, 5 aircraft movements, fuel orders & VIP manifests loaded

## Step 3 — Wire Environment Variables (30 sec)

Copy `.env.example` → `.env` and fill in your keys:

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these in: **Supabase Dashboard → Settings → API**

## Step 4 — Launch

```bash
npm install
npm run dev
```

Open http://localhost:5186

## Admin Demo Access

Visit `/admin` and click **"Auto-fill Demo Passkey"**

Passkey: `aviationfbo2026`

## Tables Overview

| Table | Purpose |
|---|---|
| `aircraft_movements` | Live ramp flight tracking |
| `fuel_dispatch_orders` | Jet-A/AvGas fuel orders |
| `ground_service_requests` | GPU, catering, tow requests |
| `vip_passenger_manifests` | VIP PAX PII (authenticated-only RLS) |
| `ramp_positions` | Static ramp/hangar inventory |

## RLS Policy Summary

- `aircraft_movements`: Public SELECT, authenticated INSERT/UPDATE
- `fuel_dispatch_orders`: Public SELECT, authenticated INSERT/UPDATE
- `ground_service_requests`: Public SELECT, authenticated INSERT/UPDATE
- `vip_passenger_manifests`: **Authenticated SELECT only** (PII protection)
- `ramp_positions`: Public SELECT, authenticated UPDATE
