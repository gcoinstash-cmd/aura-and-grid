#!/usr/bin/env node
/**
 * Ghost Factory™ — Missing Cover Generator
 * Generates proper dark-mode UI mockup covers for 3 broken assets:
 *  - kinetic-lab-os     (stock photo → dark biomechanics dashboard)
 *  - aura-medspa-os     (stock photo → dark clinical aesthetics dashboard)
 *  - veterinary-hospital-os (empty wireframe → dark triage dashboard)
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const COVERS = [
  {
    slug: 'kinetic-lab-os',
    outputCover: 'kinetic-lab-cover.jpg',
    outputThumb: 'kinetic-lab-thumbnail.jpg',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px; height: 720px; overflow: hidden;
    background: #080B0D;
    font-family: 'Courier New', monospace;
    color: #E5E7EB;
    position: relative;
  }
  /* subtle hex grid */
  body::before {
    content: '';
    position: absolute; inset: 0;
    background-image: radial-gradient(circle, #00D4FF08 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }
  .pill-badge {
    position: absolute; top: 36px; left: 48px;
    background: #0D1A1F; border: 1px solid #00D4FF44;
    color: #00D4FF; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; padding: 6px 14px; border-radius: 999px;
    font-family: 'Courier New', monospace;
  }
  .corner-badge {
    position: absolute; top: 28px; right: 48px;
    background: #111820; border: 1px solid #2A3540;
    color: #9CA3AF; font-size: 10px; font-weight: 700;
    letter-spacing: 1px; padding: 8px 14px; border-radius: 4px;
    line-height: 1.6; text-align: center;
    font-family: 'Courier New', monospace;
  }
  .corner-badge span { color: #00D4FF; display: block; }
  h1 {
    position: absolute; top: 72px; left: 48px;
    font-size: 64px; font-weight: 900; color: #FFFFFF;
    font-family: Georgia, serif; letter-spacing: -1px;
    line-height: 1.05;
  }
  .subtitle {
    position: absolute; top: 150px; left: 48px;
    font-size: 16px; color: #6B7280; letter-spacing: 0.3px;
    font-family: 'Helvetica Neue', sans-serif;
    max-width: 680px;
  }
  .browser-window {
    position: absolute; top: 220px; left: 48px; right: 48px;
    background: #111820; border: 1px solid #1F2D3A;
    border-radius: 10px; overflow: hidden;
  }
  .browser-chrome {
    background: #0D1520; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid #1F2D3A;
  }
  .traffic-lights { display: flex; gap: 7px; }
  .tl { width: 12px; height: 12px; border-radius: 50%; }
  .tl.r { background: #FF5F57; }
  .tl.y { background: #FFBD2E; }
  .tl.g { background: #28C840; }
  .url-bar {
    flex: 1; background: #080B0D; border: 1px solid #1F2D3A;
    color: #6B7280; font-size: 12px; padding: 5px 12px; border-radius: 5px;
    font-family: 'Courier New', monospace;
  }
  .live-badge { color: #28C840; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .table-area { padding: 0; }
  .table-header {
    background: #0D1520; padding: 12px 20px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #1F2D3A;
  }
  .table-header .title { color: #00D4FF; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; }
  .table-header .meta { color: #374151; font-size: 11px; letter-spacing: 1px; }
  .table-row {
    display: flex; align-items: center; gap: 0;
    border-bottom: 1px solid #111820; padding: 0 20px;
    height: 62px;
  }
  .table-row:nth-child(odd) { background: #0C1419; }
  .table-row:nth-child(even) { background: #111820; }
  .col-id { width: 180px; color: #9CA3AF; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
  .col-desc { flex: 1; color: #D1D5DB; font-size: 13px; }
  .col-status {
    width: 190px; text-align: center;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    padding: 5px 10px; border-radius: 4px;
  }
  .status-active { color: #00D4FF; background: #00D4FF15; border: 1px solid #00D4FF33; }
  .status-pending { color: #F59E0B; background: #F59E0B15; border: 1px solid #F59E0B33; }
  .status-complete { color: #28C840; background: #28C84015; border: 1px solid #28C84033; }
  .col-value { width: 200px; text-align: right; color: #00D4FF; font-size: 13px; font-weight: 700; }
  .browser-footer { background: #0D1520; padding: 10px 20px; text-align: right; border-top: 1px solid #1F2D3A; }
  .browser-footer span { color: #28C840; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .bottom-chips {
    position: absolute; bottom: 20px; left: 48px;
    display: flex; gap: 8px; align-items: center;
  }
  .chip {
    background: #111820; border: 1px solid #1F2D3A;
    color: #6B7280; font-size: 10px; padding: 5px 10px; border-radius: 4px;
    font-family: 'Courier New', monospace;
  }
  .bottom-right-label {
    position: absolute; bottom: 24px; right: 48px;
    color: #374151; font-size: 10px; letter-spacing: 1px;
    font-family: 'Courier New', monospace;
  }
</style>
</head>
<body>
  <div class="pill-badge">● PERFORMANCE ATHLETICS • BIOMECHANICAL OS</div>
  <div class="corner-badge">COMMAND CENTER<span>SUPABASE RLS EDITION</span></div>
  <h1>KINETIC LAB OS</h1>
  <div class="subtitle">Biomechanical Performance Analytics, Velocity Tracking &amp; Athletic Rehabilitation OS</div>
  <div class="browser-window">
    <div class="browser-chrome">
      <div class="traffic-lights"><div class="tl r"></div><div class="tl y"></div><div class="tl g"></div></div>
      <div class="url-bar">https://kinetic-lab-os.onrender.com/admin</div>
      <div class="live-badge">● OPERATIONAL WORKFLOW</div>
    </div>
    <div class="table-area">
      <div class="table-header">
        <div class="title">ATHLETE PERFORMANCE &amp; REHABILITATION TRIAGE</div>
        <div class="meta">LIVE TELEMETRY • RLS SECURED</div>
      </div>
      <div class="table-row">
        <div class="col-id">ATHLETE #KL-08</div>
        <div class="col-desc">Sprint Cadence Analysis — 100M Protocol | Peak Velocity 10.8 m/s</div>
        <div class="col-status status-active">ACTIVE SESSION</div>
        <div class="col-value">Force: 2.4× BW</div>
      </div>
      <div class="table-row">
        <div class="col-id">INJURY #KL-14</div>
        <div class="col-desc">ACL Return-to-Sport — Week 22/26 | ROM: 142° | Limb Symmetry: 94%</div>
        <div class="col-status status-pending">CLEARANCE PENDING</div>
        <div class="col-value">LSI: 94%</div>
      </div>
      <div class="table-row">
        <div class="col-id">SESSION #KL-21</div>
        <div class="col-desc">VO2 Max Retest — Threshold Block | Lactate 4.2 mmol/L</div>
        <div class="col-status status-complete">TEST COMPLETE</div>
        <div class="col-value">Power: 418W</div>
      </div>
    </div>
    <div class="browser-footer"><span>● KINETIC WORKFLOW ACTIVE</span></div>
  </div>
  <div class="bottom-chips">
    <div class="chip">⚡ React 19 Frontend</div>
    <div class="chip">💻 Tailwind CSS (Dark Obsidian)</div>
    <div class="chip">🗄️ Supabase PostgreSQL + RLS</div>
    <div class="chip">🔑 Valet Passkey: kinetic2026</div>
  </div>
  <div class="bottom-right-label">COMMERCIAL AGENCY LICENSE: UNLIMITED CLIENT DEPLOYS</div>
</body>
</html>`,
  },
  {
    slug: 'aura-medspa-os',
    outputCover: 'aura-medspa-cover.jpg',
    outputThumb: 'aura-medspa-thumbnail.jpg',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px; height: 720px; overflow: hidden;
    background: #08090C;
    font-family: 'Courier New', monospace;
    color: #E5E7EB;
    position: relative;
  }
  body::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse 600px 300px at 90% 10%, #A8D5C208, transparent),
                radial-gradient(circle, #A8D5C205 1px, transparent 1px);
    background-size: cover, 28px 28px;
    pointer-events: none;
  }
  .pill-badge {
    position: absolute; top: 36px; left: 48px;
    background: #0D1A15; border: 1px solid #A8D5C244;
    color: #A8D5C2; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; padding: 6px 14px; border-radius: 999px;
    font-family: 'Courier New', monospace;
  }
  .corner-badge {
    position: absolute; top: 28px; right: 48px;
    background: #111820; border: 1px solid #2A3540;
    color: #9CA3AF; font-size: 10px; font-weight: 700;
    letter-spacing: 1px; padding: 8px 14px; border-radius: 4px;
    line-height: 1.6; text-align: center; font-family: 'Courier New', monospace;
  }
  .corner-badge span { color: #A8D5C2; display: block; }
  h1 {
    position: absolute; top: 72px; left: 48px;
    font-size: 60px; font-weight: 900; color: #FFFFFF;
    font-family: Georgia, serif; letter-spacing: -1px; line-height: 1.05;
  }
  .subtitle {
    position: absolute; top: 148px; left: 48px;
    font-size: 16px; color: #6B7280; letter-spacing: 0.3px;
    font-family: 'Helvetica Neue', sans-serif; max-width: 700px;
  }
  .browser-window {
    position: absolute; top: 218px; left: 48px; right: 48px;
    background: #0D1218; border: 1px solid #1C2A22; border-radius: 10px; overflow: hidden;
  }
  .browser-chrome {
    background: #080E10; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid #1C2A22;
  }
  .traffic-lights { display: flex; gap: 7px; }
  .tl { width: 12px; height: 12px; border-radius: 50%; }
  .tl.r { background: #FF5F57; } .tl.y { background: #FFBD2E; } .tl.g { background: #28C840; }
  .url-bar {
    flex: 1; background: #06090A; border: 1px solid #1C2A22;
    color: #6B7280; font-size: 12px; padding: 5px 12px; border-radius: 5px;
  }
  .live-badge { color: #28C840; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .table-header {
    background: #080E10; padding: 12px 20px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #1C2A22;
  }
  .table-header .title { color: #A8D5C2; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; }
  .table-header .meta { color: #374151; font-size: 11px; letter-spacing: 1px; }
  .table-row {
    display: flex; align-items: center; gap: 0;
    border-bottom: 1px solid #0F1A15; padding: 0 20px; height: 62px;
  }
  .table-row:nth-child(odd) { background: #0B1510; }
  .table-row:nth-child(even) { background: #0D1A18; }
  .col-id { width: 190px; color: #9CA3AF; font-size: 12px; font-weight: 700; letter-spacing: 0.5px; }
  .col-desc { flex: 1; color: #D1D5DB; font-size: 13px; }
  .col-status {
    width: 200px; text-align: center;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    padding: 5px 10px; border-radius: 4px;
  }
  .status-active { color: #A8D5C2; background: #A8D5C215; border: 1px solid #A8D5C233; }
  .status-priority { color: #F59E0B; background: #F59E0B15; border: 1px solid #F59E0B33; }
  .status-confirmed { color: #28C840; background: #28C84015; border: 1px solid #28C84033; }
  .col-value { width: 180px; text-align: right; color: #A8D5C2; font-size: 13px; font-weight: 700; }
  .browser-footer { background: #080E10; padding: 10px 20px; text-align: right; border-top: 1px solid #1C2A22; }
  .browser-footer span { color: #28C840; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .bottom-chips { position: absolute; bottom: 20px; left: 48px; display: flex; gap: 8px; align-items: center; }
  .chip {
    background: #0D1218; border: 1px solid #1C2A22;
    color: #6B7280; font-size: 10px; padding: 5px 10px; border-radius: 4px; font-family: monospace;
  }
  .bottom-right-label { position: absolute; bottom: 24px; right: 48px; color: #374151; font-size: 10px; letter-spacing: 1px; }
</style>
</head>
<body>
  <div class="pill-badge">● LUXURY MEDSPA • CLINICAL AESTHETICS OS</div>
  <div class="corner-badge">CLINICAL VANGUARD<span>SUPABASE RLS EDITION</span></div>
  <h1>AURA MEDSPA OS</h1>
  <div class="subtitle">Clinical Intake, Treatment Scheduling &amp; Concierge Aesthetics Operating System</div>
  <div class="browser-window">
    <div class="browser-chrome">
      <div class="traffic-lights"><div class="tl r"></div><div class="tl y"></div><div class="tl g"></div></div>
      <div class="url-bar">https://aura-medspa-os.onrender.com/admin</div>
      <div class="live-badge">● CLINICAL WORKFLOW</div>
    </div>
    <div class="table-header">
      <div class="title">TREATMENT CALENDAR &amp; VIP INTAKE QUEUE</div>
      <div class="meta">LIVE TELEMETRY • RLS SECURED</div>
    </div>
    <div class="table-row">
      <div class="col-id">TREATMENT #AM-108</div>
      <div class="col-desc">Morpheus8 RF Microneedling — Jawline Contour | Suite 3 | Dr. Chen | 11:30 AM</div>
      <div class="col-status status-active">SUITE ACTIVE</div>
      <div class="col-value">VIP Tier Α</div>
    </div>
    <div class="table-row">
      <div class="col-id">INTAKE #AM-112</div>
      <div class="col-desc">Hyaluronidase Reversal Consult — Emergency Slot | Client: VIP-447</div>
      <div class="col-status status-priority">PRIORITY QUEUE</div>
      <div class="col-value">STAT Alert</div>
    </div>
    <div class="table-row">
      <div class="col-id">PACKAGE #AM-095</div>
      <div class="col-desc">HydraFacial Elite + LED Phototherapy | 2:00 PM | Pre-Paid Deposit</div>
      <div class="col-status status-confirmed">CONFIRMED</div>
      <div class="col-value">$980 Deposit</div>
    </div>
    <div class="browser-footer"><span>● INTAKE WORKFLOW ACTIVE</span></div>
  </div>
  <div class="bottom-chips">
    <div class="chip">⚡ React 19 Frontend</div>
    <div class="chip">💻 Tailwind CSS (Dark Obsidian)</div>
    <div class="chip">🗄️ Supabase PostgreSQL + RLS</div>
    <div class="chip">🔑 Valet Passkey: auramedspa2026</div>
  </div>
  <div class="bottom-right-label">COMMERCIAL AGENCY LICENSE: UNLIMITED CLIENT DEPLOYS</div>
</body>
</html>`,
  },
  {
    slug: 'veterinary-hospital-os',
    outputCover: 'veterinary-hospital-cover.jpg',
    outputThumb: 'veterinary-hospital-thumbnail.jpg',
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px; height: 720px; overflow: hidden;
    background: #080B0D;
    font-family: 'Courier New', monospace;
    color: #E5E7EB;
    position: relative;
  }
  body::before {
    content: ''; position: absolute; inset: 0;
    background-image: radial-gradient(circle, #22C55E06 1px, transparent 1px);
    background-size: 30px 30px; pointer-events: none;
  }
  .pill-badge {
    position: absolute; top: 36px; left: 48px;
    background: #0D1A0F; border: 1px solid #22C55E44;
    color: #22C55E; font-size: 11px; font-weight: 700;
    letter-spacing: 1.5px; padding: 6px 14px; border-radius: 999px;
  }
  .corner-badge {
    position: absolute; top: 28px; right: 48px;
    background: #111820; border: 1px solid #2A3540;
    color: #9CA3AF; font-size: 10px; font-weight: 700;
    letter-spacing: 1px; padding: 8px 14px; border-radius: 4px;
    line-height: 1.6; text-align: center;
  }
  .corner-badge span { color: #22C55E; display: block; }
  h1 {
    position: absolute; top: 72px; left: 48px;
    font-size: 56px; font-weight: 900; color: #FFFFFF;
    font-family: Georgia, serif; letter-spacing: -1px; line-height: 1.05;
  }
  .subtitle {
    position: absolute; top: 150px; left: 48px;
    font-size: 16px; color: #6B7280; max-width: 700px;
    font-family: 'Helvetica Neue', sans-serif;
  }
  .browser-window {
    position: absolute; top: 218px; left: 48px; right: 48px;
    background: #0D1A0F; border: 1px solid #1A2E1A; border-radius: 10px; overflow: hidden;
  }
  .browser-chrome {
    background: #081008; padding: 10px 16px;
    display: flex; align-items: center; gap: 10px;
    border-bottom: 1px solid #1A2E1A;
  }
  .traffic-lights { display: flex; gap: 7px; }
  .tl { width: 12px; height: 12px; border-radius: 50%; }
  .tl.r { background: #FF5F57; } .tl.y { background: #FFBD2E; } .tl.g { background: #28C840; }
  .url-bar {
    flex: 1; background: #06090A; border: 1px solid #1A2E1A;
    color: #6B7280; font-size: 12px; padding: 5px 12px; border-radius: 5px;
  }
  .live-badge { color: #28C840; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .table-header {
    background: #081008; padding: 12px 20px;
    display: flex; justify-content: space-between; align-items: center;
    border-bottom: 1px solid #1A2E1A;
  }
  .table-header .title { color: #22C55E; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; }
  .table-header .meta { color: #374151; font-size: 11px; letter-spacing: 1px; }
  .table-row {
    display: flex; align-items: center; border-bottom: 1px solid #0F1A0F;
    padding: 0 20px; height: 62px;
  }
  .table-row:nth-child(odd) { background: #0B150B; }
  .table-row:nth-child(even) { background: #0D1A10; }
  .col-id { width: 190px; color: #9CA3AF; font-size: 12px; font-weight: 700; }
  .col-desc { flex: 1; color: #D1D5DB; font-size: 13px; }
  .col-status {
    width: 210px; text-align: center;
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    padding: 5px 10px; border-radius: 4px;
  }
  .status-emergency { color: #EF4444; background: #EF444415; border: 1px solid #EF444433; }
  .status-stable { color: #22C55E; background: #22C55E15; border: 1px solid #22C55E33; }
  .status-exam { color: #F59E0B; background: #F59E0B15; border: 1px solid #F59E0B33; }
  .col-value { width: 160px; text-align: right; color: #22C55E; font-size: 13px; font-weight: 700; }
  .browser-footer { background: #081008; padding: 10px 20px; text-align: right; border-top: 1px solid #1A2E1A; }
  .browser-footer span { color: #EF4444; font-size: 11px; font-weight: 700; letter-spacing: 1px; }
  .bottom-chips { position: absolute; bottom: 20px; left: 48px; display: flex; gap: 8px; }
  .chip { background: #0D1A0F; border: 1px solid #1A2E1A; color: #6B7280; font-size: 10px; padding: 5px 10px; border-radius: 4px; }
  .bottom-right-label { position: absolute; bottom: 24px; right: 48px; color: #374151; font-size: 10px; letter-spacing: 1px; }
</style>
</head>
<body>
  <div class="pill-badge">● VETERINARY MEDICINE • EMERGENCY TRIAGE OS</div>
  <div class="corner-badge">CLINICAL VANGUARD<span>SUPABASE RLS EDITION</span></div>
  <h1>VETERINARY HOSPITAL OS</h1>
  <div class="subtitle">Emergency Triage Queue, Surgical Suite Scheduler &amp; Patient Monitoring System</div>
  <div class="browser-window">
    <div class="browser-chrome">
      <div class="traffic-lights"><div class="tl r"></div><div class="tl y"></div><div class="tl g"></div></div>
      <div class="url-bar">https://veterinary-hospital-os.onrender.com/admin</div>
      <div class="live-badge">● TRIAGE ACTIVE</div>
    </div>
    <div class="table-header">
      <div class="title">EMERGENCY TRIAGE &amp; SURGICAL SUITE MANIFEST</div>
      <div class="meta">LIVE TELEMETRY • RLS SECURED</div>
    </div>
    <div class="table-row">
      <div class="col-id">PATIENT #VH-047</div>
      <div class="col-desc">German Shepherd "Maximus" — GDV Emergency | Surgical Suite 2 | Dr. Patel</div>
      <div class="col-status status-emergency">SURGICAL — STAT</div>
      <div class="col-value">Priority: P0</div>
    </div>
    <div class="table-row">
      <div class="col-id">PATIENT #VH-051</div>
      <div class="col-desc">Domestic Shorthair "Luna" — Post-Op Splenectomy Day 3 | ICU Bay 4</div>
      <div class="col-status status-stable">STABLE — ICU</div>
      <div class="col-value">BP: 112/74</div>
    </div>
    <div class="table-row">
      <div class="col-id">PATIENT #VH-039</div>
      <div class="col-desc">Golden Retriever "Biscuit" — Annual Bloodwork + Cardiac Echo | Exam Room 1</div>
      <div class="col-status status-exam">EXAM SCHEDULED</div>
      <div class="col-value">9:15 AM</div>
    </div>
    <div class="browser-footer"><span>● TRIAGE WORKFLOW ACTIVE</span></div>
  </div>
  <div class="bottom-chips">
    <div class="chip">⚡ React 19 Frontend</div>
    <div class="chip">💻 Tailwind CSS (Dark Obsidian)</div>
    <div class="chip">🗄️ Supabase PostgreSQL + RLS</div>
    <div class="chip">🔑 Valet Passkey: vethospital2026</div>
  </div>
  <div class="bottom-right-label">COMMERCIAL AGENCY LICENSE: UNLIMITED CLIENT DEPLOYS</div>
</body>
</html>`,
  },
];

async function generateCover(browser, coverConfig) {
  const { slug, outputCover, outputThumb, html } = coverConfig;
  const distDir = path.join(ROOT, 'dist', slug);
  
  console.log(`\n🎮 Generating: ${slug}...`);
  
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.setContent(html, { waitUntil: 'load' });
  await page.waitForTimeout(500);
  
  // Capture cover (1280x720)
  const coverPath = path.join(distDir, outputCover);
  await page.screenshot({ path: coverPath, type: 'jpeg', quality: 92, fullPage: false });
  const coverSize = fs.statSync(coverPath).size;
  console.log(`  ✅ Cover: ${outputCover} (${Math.round(coverSize/1024)}KB)`);
  
  // Crop thumbnail from center of cover (600x600)
  const thumbPath = path.join(distDir, outputThumb);
  // Use viewport crop: take center-left portion 
  await page.setViewportSize({ width: 720, height: 720 });
  await page.setContent(html.replace('width: 1280px', 'width: 720px').replace('height: 720px', 'height: 720px'), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  // Screenshot and then we'll use a different approach for thumb
  // Just use a cropped screenshot of the original
  await page.close();
  
  // For thumbnail: open again with 600x600 viewport and scaled-down version
  const page2 = await browser.newPage();
  await page2.setViewportSize({ width: 600, height: 600 });
  // Scale the HTML to fit 600x600 by zooming
  const thumbHtml = html
    .replace('width: 1280px; height: 720px', 'width: 1280px; height: 720px; transform: scale(0.469); transform-origin: top left;')
    .replace('<body>', '<body style="width:1280px;height:720px;transform:scale(0.469);transform-origin:top left;">');
  await page2.setContent(`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>html,body{width:600px;height:600px;overflow:hidden;margin:0;padding:0;background:#080B0D}iframe{border:none;width:600px;height:600px}</style></head><body>${thumbHtml}</body></html>`, { waitUntil: 'load' });
  await page2.waitForTimeout(400);
  await page2.screenshot({ path: thumbPath, type: 'jpeg', quality: 88, fullPage: false });
  const thumbSize = fs.statSync(thumbPath).size;
  console.log(`  ✅ Thumb: ${outputThumb} (${Math.round(thumbSize/1024)}KB)`);
  await page2.close();
}

async function main() {
  console.log('🏭 GHOST FACTORY™ — Missing Cover Generator');
  console.log('============================================');
  
  const browser = await chromium.launch({ headless: true });
  
  for (const cover of COVERS) {
    try {
      await generateCover(browser, cover);
    } catch (err) {
      console.error(`  ❌ Failed: ${cover.slug} — ${err.message}`);
    }
  }
  
  await browser.close();
  console.log('\n🎉 All covers generated!');
  console.log('\n📦 VERIFICATION:');
  for (const cover of COVERS) {
    const distDir = path.join(ROOT, 'dist', cover.slug);
    const coverPath = path.join(distDir, cover.outputCover);
    const thumbPath = path.join(distDir, cover.outputThumb);
    const coverKB = Math.round(fs.statSync(coverPath).size / 1024);
    const thumbKB = Math.round(fs.statSync(thumbPath).size / 1024);
    console.log(`  ${cover.slug}: cover=${coverKB}KB thumb=${thumbKB}KB`);
  }
}

main().catch(console.error);
