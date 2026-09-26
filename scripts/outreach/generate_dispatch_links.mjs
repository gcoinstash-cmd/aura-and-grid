#!/usr/bin/env node

/**
 * Ghost Factory™ — One-Click Outreach Generator
 * Compiles docs/outreach/OUTBOUND_BATCH_1.md into an interactive, local HTML dispatch dashboard: dist/outreach_cockpit.html
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const OUTBOUND_MD_PATH = path.join(rootDir, 'docs/outreach/OUTBOUND_BATCH_1.md');
const COCKPIT_HTML_PATH = path.join(rootDir, 'dist/outreach_cockpit.html');

console.log('⚡ [Ghost Factory™] Compiling Outreach Dispatch Cockpit...');

if (!fs.existsSync(OUTBOUND_MD_PATH)) {
  console.error(`❌ Missing source file: ${OUTBOUND_MD_PATH}`);
  process.exit(1);
}

// 5 Curated Prospect Profiles with initial contact targets
const prospects = [
  {
    id: 'king-partners',
    name: 'Tony King',
    company: 'King & Partners',
    website: 'https://www.kingandpartners.com',
    email: 'tony@kingandpartners.com',
    niche: 'Luxury Hospitality & Boutique Dining',
    featuredSystem: 'The Velvet Note / Fine Dining Matrix OS',
    demoUrl: 'https://the-velvet-note-os.onrender.com/admin',
    demoKey: 'velvet2026',
    subject: 'SevenRooms-style reservation & cellar matrix for your hospitality accounts',
    bodyTemplate: `Hi Tony,

Followed King & Partners' work across Edition Hotels and boutique hospitality—the art direction is always immaculate.

One pattern we hear constantly from hospitality agency principals: high-end restaurant and hotel clients frequently ask for custom table reservation matrices, chef counter seat allocation, or sommelier cellar ledgers, but custom React/Postgres development eats 6 to 8 weeks of dev payroll.

We built a dedicated hospitality operating system called The Velvet Note (part of our 85-system agency foundry library). It packages a custom obsidian dark aesthetic, 24-seat dining allocation matrix, and turnkey Supabase PostgreSQL with active Row Level Security.

You can test the interactive buyer demo in 10 seconds:
👉 https://the-velvet-note-os.onrender.com/admin (Click the Valet Key to auto-fill: velvet2026)

We are opening our Founding Agency Cohort for 10 boutique agencies: $1,499 one-time for a perpetual, non-exclusive commercial whitelabel license to our entire 85-system inventory (unlimited client deployments, zero platform royalties, keep 100% of your $3,500–$5,000 client setup fees).

Direct checkout link: {{GUMROAD_URL}}

Open to a quick 5-minute look to see if this saves your team dev hours on upcoming Q4 hospitality pitches?

Best,
{{SENDER_NAME}}
Founder, Aura & Grid`
  },
  {
    id: 'heavy-hospitality',
    name: 'Managing Partner',
    company: 'Heavy Hospitality',
    website: 'https://www.heavy.agency',
    email: 'hello@heavy.agency',
    niche: 'Nightlife & Experiential Dining',
    featuredSystem: 'The Vault Studio OS',
    demoUrl: 'https://the-vault-studio.onrender.com/admin',
    demoKey: 'vault2026',
    subject: 'VIP bottle service & guestlist triage engine for your nightlife clients',
    bodyTemplate: `Hi there,

Heavy’s branding across nightlife and experiential dining concepts is second to none.

When hospitality clients ask for custom bottle service booking engines, private lounge access matrices, or promoter guestlist portals, agencies usually end up stitching together clunky third-party widgets or building custom backends from scratch.

We engineered The Vault Studio OS (and 84 other single-tenant operating systems) specifically to eliminate that dev grind. It comes out of the box with an obsidian dark UI, VIP table allocation matrices, guestlist triage queues, and turnkey Supabase PostgreSQL with active Row Level Security.

Interactive demo you can click through right now:
👉 https://the-vault-studio.onrender.com/admin (Click the Valet Key to auto-fill: vault2026)

We’re licensing our full 85-operating-system library to 10 founding boutique agencies for $1,499 (one-time commercial whitelabel license). You can re-skin, re-brand, and deploy it for unlimited clients under your own agency label while keeping 100% of your setup fees.

Full details & checkout: {{GUMROAD_URL}}

Worth a 3-minute look for your upcoming nightlife concepts?

Best,
{{SENDER_NAME}}
Founder, Aura & Grid`
  },
  {
    id: 'hudson-creative',
    name: 'Account Director',
    company: 'Hudson Creative',
    website: 'https://www.hudsoncreative.com',
    email: 'info@hudsoncreative.com',
    niche: 'Fine Dining & Multi-Unit Culinary Groups',
    featuredSystem: 'Omakase Counter OS / Culinary Workspace OS',
    demoUrl: 'https://omakase-counter-os.onrender.com/admin',
    demoKey: 'omakase2026',
    subject: 'Pre-built culinary operating systems (omakase, tasting menus, cellar allocation)',
    bodyTemplate: `Hi there,

Hudson Creative’s track record scaling culinary groups and Michelin-starred concepts is remarkable.

When restaurant groups want custom tasting menu ticketing, omakase counter allocation, or private dining inquiry engines, writing authentication and database schemas from scratch burns $8k+ in senior dev invoices per build.

We compiled a dedicated suite of 23 culinary operating systems—including Omakase Counter OS and The Velvet Note—featuring obsidian dark styling, seat-tier scheduling grids, and production Supabase PostgreSQL tables configured with Row Level Security.

Check out the interactive chef counter demo:
👉 https://omakase-counter-os.onrender.com/admin (Click the Valet Key: omakase2026)

We are releasing our entire 85-system library to a founding cohort of 10 agencies for $1,499 (perpetual commercial whitelabel license). One single client deployment at your standard $3,500 setup fee puts +$2,001 net cash in your bank on day one.

Live listing & license: {{GUMROAD_URL}}

Could this help streamline your client onboarding this quarter?

Best,
{{SENDER_NAME}}
Founder, Aura & Grid`
  },
  {
    id: 'studio-thomas',
    name: 'Thomas',
    company: 'Studio Thomas',
    website: 'https://www.studio-thomas.com',
    email: 'thomas@studio-thomas.com',
    niche: 'Boutique Hospitality & Wine Estates',
    featuredSystem: 'The Vineyards OS / The Enclave OS',
    demoUrl: 'https://the-vineyards-os.onrender.com/admin',
    demoKey: 'vineyards2026',
    subject: 'Wine allocation ledgers & vineyard private reservation OS for your estate clients',
    bodyTemplate: `Hi Thomas,

Studio Thomas has set the gold standard for high-craft boutique hospitality and estate branding.

When wine estates and luxury vineyards want member allocation release engines, private tasting room matrices, or harvest dinner booking portals, custom software development often takes months and pulls attention away from brand storytelling.

We developed The Vineyards OS—a turnkey operating system featuring allocation release countdowns, cellar inventory tiers, and private tasting reservation matrices wired directly to Supabase PostgreSQL.

Interactive demo:
👉 https://the-vineyards-os.onrender.com/admin (Click the Valet Key: vineyards2026)

We’re offering our complete 85-system foundry library (covering wine estates, private villas, Michelin dining, and boutique hospitality) to 10 founding agencies for $1,499 with an unlimited commercial whitelabel license.

Access portal & checkout: {{GUMROAD_URL}}

Open to checking out the live catalog console to see if it fits your estate client roster?

Best,
{{SENDER_NAME}}
Founder, Aura & Grid`
  },
  {
    id: 'agency-21',
    name: 'Operations Director',
    company: 'Agency 21 Consulting',
    website: 'https://www.agency21consulting.com',
    email: 'info@agency21consulting.com',
    niche: 'High-End Food & Hospitality Events',
    featuredSystem: 'Culinary Workspace OS / Heritage & Honey OS',
    demoUrl: 'https://culinary-workspace-os.onrender.com/admin',
    demoKey: 'culinary2026',
    subject: 'Turnkey culinary workspace & event ticketing engines for your hospitality events',
    bodyTemplate: `Hi there,

Loved Agency 21’s production on premier food and wine events nationwide.

Managing culinary festival vendor queues, VIP tasting ticket tiers, and chef talent schedules usually requires stitching together multiple third-party tools with high monthly fees.

We engineered Culinary Workspace OS—a dedicated single-tenant web operating system designed for culinary events, festival guestlists, and kitchen prep queues, pre-configured with Supabase PostgreSQL and active Row Level Security.

Take a look at the interactive event command center:
👉 https://culinary-workspace-os.onrender.com/admin (Click Valet Key: culinary2026)

We are opening 10 founding seats for our 85-system library at $1,499 (one-time payment, unlimited commercial client deployments, zero hosting debt or platform royalties owed to us).

Direct checkout: {{GUMROAD_URL}}

Would this save your team operational hours on upcoming festival launches?

Best,
{{SENDER_NAME}}
Founder, Aura & Grid`
  }
];

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ghost Factory™ — Outreach Dispatch Cockpit</title>
  <style>
    :root {
      --bg: #0A0A0B;
      --card-bg: #141417;
      --border: #26262B;
      --border-focus: #3B82F6;
      --accent: #10B981;
      --accent-hover: #059669;
      --text: #F3F4F6;
      --text-muted: #9CA3AF;
      --brand: #6366F1;
      --brand-hover: #4F46E5;
      --gold: #F59E0B;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 32px 24px;
      line-height: 1.5;
    }
    .container {
      max-width: 1040px;
      margin: 0 auto;
    }
    header {
      margin-bottom: 32px;
      border-bottom: 1px solid var(--border);
      padding-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: rgba(16, 185, 129, 0.15);
      color: var(--accent);
      border: 1px solid rgba(16, 185, 129, 0.3);
      margin-bottom: 12px;
    }
    h1 {
      font-size: 28px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 8px;
    }
    p.subtitle {
      color: var(--text-muted);
      font-size: 15px;
    }
    .hud-controls {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 24px;
      margin-bottom: 32px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 768px) {
      .hud-controls { grid-template-columns: 1fr; }
    }
    .control-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      margin-bottom: 6px;
    }
    .control-group input {
      width: 100%;
      background: #0D0E11;
      border: 1px solid var(--border);
      color: #fff;
      padding: 10px 14px;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;
    }
    .control-group input:focus {
      border-color: var(--border-focus);
    }
    .progress-hud {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #111216;
      border: 1px solid var(--border);
      padding: 14px 20px;
      border-radius: 10px;
      margin-bottom: 28px;
    }
    .progress-bar-container {
      flex: 1;
      height: 8px;
      background: #202228;
      border-radius: 9999px;
      margin: 0 20px;
      overflow: hidden;
    }
    .progress-bar-fill {
      width: 0%;
      height: 100%;
      background: var(--accent);
      transition: width 0.3s ease;
    }
    .cards-grid {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .prospect-card {
      background: var(--card-bg);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
      transition: border-color 0.2s;
    }
    .prospect-card.sent {
      border-color: rgba(16, 185, 129, 0.4);
      background: rgba(20, 20, 23, 0.7);
    }
    .card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 16px;
    }
    .card-title h2 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .card-title .niche-tag {
      font-size: 13px;
      color: var(--gold);
      font-weight: 500;
    }
    .sent-toggle {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted);
    }
    .sent-toggle input[type="checkbox"] {
      width: 18px;
      height: 18px;
      accent-color: var(--accent);
      cursor: pointer;
    }
    .specs-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      font-size: 13px;
    }
    .spec-chip {
      background: #1B1C22;
      padding: 6px 12px;
      border-radius: 6px;
      border: 1px solid #2B2C35;
      color: #D1D5DB;
    }
    .spec-chip a {
      color: var(--border-focus);
      text-decoration: none;
    }
    .spec-chip a:hover {
      text-decoration: underline;
    }
    .email-preview-box {
      background: #090A0C;
      border: 1px solid #202227;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 18px;
    }
    .subject-line {
      font-weight: 700;
      font-size: 14px;
      color: #E5E7EB;
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid #1C1E24;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .body-text {
      white-space: pre-wrap;
      font-family: inherit;
      font-size: 13.5px;
      color: #9CA3AF;
      line-height: 1.6;
    }
    .actions-bar {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 18px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all 0.2s;
    }
    .btn-primary {
      background: var(--accent);
      color: #000;
    }
    .btn-primary:hover {
      background: var(--accent-hover);
    }
    .btn-secondary {
      background: var(--brand);
      color: #fff;
    }
    .btn-secondary:hover {
      background: var(--brand-hover);
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-muted);
    }
    .btn-outline:hover {
      color: #fff;
      border-color: #4B5563;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: var(--accent);
      color: #000;
      padding: 12px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .toast.show {
      opacity: 1;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge">Ghost Factory™ Outbound Radar</div>
      <h1>Founding Agency Cohort: Dispatch Cockpit</h1>
      <p class="subtitle">Semi-automated 1-click launcher for the top 5 boutique agency prospects. Inspect, personalize, launch into your email client, or copy for LinkedIn.</p>
    </header>

    <div class="hud-controls">
      <div class="control-group">
        <label for="gumroadUrlInput">Live Gumroad Checkout URL</label>
        <input type="url" id="gumroadUrlInput" value="https://auraandgrid.gumroad.com/l/agency-whitelabel-vault">
      </div>
      <div class="control-group">
        <label for="senderNameInput">Your Name (Sender Signature)</label>
        <input type="text" id="senderNameInput" value="G Mane">
      </div>
    </div>

    <div class="progress-hud">
      <div><strong>Status:</strong> <span id="progressText">0 / 5 Dispatched</span></div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" id="progressBarFill"></div>
      </div>
      <div id="rewardText" style="color: var(--gold); font-weight: 700; font-size: 13px;">🎯 Objective: $1,499 Validation</div>
    </div>

    <div class="cards-grid">
      ${prospects.map((p, index) => `
        <div class="prospect-card" id="card-${p.id}">
          <div class="card-header">
            <div class="card-title">
              <h2>#${index + 1} — ${p.company} (${p.name})</h2>
              <div class="niche-tag">${p.niche}</div>
            </div>
            <label class="sent-toggle">
              <input type="checkbox" onchange="toggleSent('${p.id}', this.checked)">
              <span>Mark Dispatched</span>
            </label>
          </div>

          <div class="specs-row">
            <div class="spec-chip">🌐 Agency: <a href="${p.website}" target="_blank">${p.website.replace('https://', '')}</a></div>
            <div class="spec-chip">🎮 Featured OS: <a href="${p.demoUrl}" target="_blank">${p.featuredSystem}</a></div>
            <div class="spec-chip">🔑 Cheat Code: <code>${p.demoKey}</code></div>
            <div class="spec-chip">✉️ Recipient: <span id="email-label-${p.id}">${p.email}</span></div>
          </div>

          <div class="email-preview-box">
            <div class="subject-line">
              <span>Subject: <strong id="subject-${p.id}">${p.subject}</strong></span>
              <button class="btn btn-outline" style="padding: 4px 10px; font-size: 12px;" onclick="copySubject('${p.id}')">Copy Subject</button>
            </div>
            <div class="body-text" id="body-${p.id}">${p.bodyTemplate.replace(/\{\{GUMROAD_URL\}\}/g, 'https://auraandgrid.gumroad.com/l/agency-whitelabel-vault').replace(/\{\{SENDER_NAME\}\}/g, 'G Mane')}</div>
          </div>

          <div class="actions-bar">
            <a href="#" id="mailto-${p.id}" class="btn btn-primary" onclick="launchMailto('${p.id}', event)">
              🚀 Launch Email (Apple Mail / Client)
            </a>
            <button class="btn btn-secondary" onclick="copyBody('${p.id}')">
              📋 Copy Body (LinkedIn / InMail)
            </button>
            <a href="${p.demoUrl}" target="_blank" class="btn btn-outline">
              👀 Test Buyer Demo (10s)
            </a>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="toast" id="toast">Copied to clipboard!</div>

  <script>
    const prospects = ${JSON.stringify(prospects)};
    const sentStatus = {};

    function updateAllViews() {
      const gumroadUrl = document.getElementById('gumroadUrlInput').value.trim();
      const senderName = document.getElementById('senderNameInput').value.trim() || 'Founder, Aura & Grid';

      prospects.forEach(p => {
        const renderedBody = p.bodyTemplate
          .replace(/\\{\\{GUMROAD_URL\\}\\}/g, gumroadUrl)
          .replace(/\\{\\{SENDER_NAME\\}\\}/g, senderName);

        const bodyEl = document.getElementById('body-' + p.id);
        if (bodyEl) bodyEl.innerText = renderedBody;

        const mailtoEl = document.getElementById('mailto-' + p.id);
        if (mailtoEl) {
          const mailtoUrl = 'mailto:' + encodeURIComponent(p.email) +
            '?subject=' + encodeURIComponent(p.subject) +
            '&body=' + encodeURIComponent(renderedBody);
          mailtoEl.setAttribute('href', mailtoUrl);
        }
      });
    }

    document.getElementById('gumroadUrlInput').addEventListener('input', updateAllViews);
    document.getElementById('senderNameInput').addEventListener('input', updateAllViews);

    function launchMailto(id, event) {
      // Allow default link navigation to open mailto: in the system default client
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      toast.innerText = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    }

    function copySubject(id) {
      const subj = document.getElementById('subject-' + id).innerText;
      navigator.clipboard.writeText(subj).then(() => showToast('Subject copied!'));
    }

    function copyBody(id) {
      const body = document.getElementById('body-' + id).innerText;
      navigator.clipboard.writeText(body).then(() => showToast('Full pitch body copied!'));
    }

    function toggleSent(id, isChecked) {
      sentStatus[id] = isChecked;
      const card = document.getElementById('card-' + id);
      if (isChecked) {
        card.classList.add('sent');
      } else {
        card.classList.remove('sent');
      }

      const totalSent = Object.values(sentStatus).filter(Boolean).length;
      const pct = (totalSent / prospects.length) * 100;
      document.getElementById('progressBarFill').style.width = pct + '%';
      document.getElementById('progressText').innerText = totalSent + ' / ' + prospects.length + ' Dispatched';

      if (totalSent === prospects.length) {
        document.getElementById('rewardText').innerText = '🏆 BATCH 1 FULLY DISPATCHED! Awaiting first reply...';
      } else {
        document.getElementById('rewardText').innerText = '🎯 Objective: $1,499 Validation';
      }
    }

    // Initial render
    updateAllViews();
  </script>
</body>
</html>
`;

fs.writeFileSync(COCKPIT_HTML_PATH, htmlContent, 'utf-8');
console.log(`✅ [Ghost Factory™] Dispatch Cockpit generated successfully: ${COCKPIT_HTML_PATH}`);
