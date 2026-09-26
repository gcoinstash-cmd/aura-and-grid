#!/usr/bin/env node

/**
 * Ghost Factory™ — Public Brand Showroom Compiler
 * Builds an isolated, decoupled public showroom for Aura & Grid (site/index.html)
 * Extracts public metadata from CATALOG_MANIFEST.json and copies canonical covers into site/assets/covers/
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const MANIFEST_PATH = path.join(rootDir, 'CATALOG_MANIFEST.json');
const SITE_DIR = path.join(rootDir, 'site');
const SITE_ASSETS_DIR = path.join(SITE_DIR, 'assets', 'covers');
const OUTPUT_HTML_PATH = path.join(SITE_DIR, 'index.html');

console.log('⚡ [Aura & Grid] Compiling Decoupled Public Brand Showroom...');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`❌ Missing CATALOG_MANIFEST.json at: ${MANIFEST_PATH}`);
  process.exit(1);
}

// Ensure directories exist
fs.mkdirSync(SITE_ASSETS_DIR, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const distDirs = fs.readdirSync(path.join(rootDir, 'dist')).filter(d => 
  !d.startsWith('.') && !d.startsWith('_') && fs.statSync(path.join(rootDir, 'dist', d)).isDirectory()
);

// Map sector groupings for clean buyer filtering
const sectorMap = {
  hospitality: 'Hospitality & Dining',
  wealth: 'Legal, Wealth & Advisory',
  medical: 'Clinical & Aesthetics',
  automotive: 'Automotive & Mobility',
  creative: 'Creative & Media Studios',
  home_services: 'Trades & Operations',
  heavy_fleet: 'Trades & Operations',
  fitness: 'Performance & Athletics'
};

const publicProducts = [];
let coversCopied = 0;

manifest.products.forEach(p => {
  // Find matching dist dir
  const match = distDirs.find(d => {
    const normD = d.replace(/-os$/, '');
    const normP = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const gumroadSlug = p.gumroad_url ? p.gumroad_url.split('/l/')[1].replace(/-os$/, '') : '';
    const previewSlug = p.preview_url ? p.preview_url.replace('https://', '').split('.')[0].replace(/-os$/, '') : '';
    return d === normP || normD === normP || d === gumroadSlug || normD === gumroadSlug || d === previewSlug || normD === previewSlug;
  });

  let coverRelPath = 'assets/covers/placeholder-cover.jpg';
  const cleanSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (match) {
    const files = fs.readdirSync(path.join(rootDir, 'dist', match));
    const coverFile = files.find(f => f.includes('cover') && (f.endsWith('.jpg') || f.endsWith('.png')));
    if (coverFile) {
      const srcPath = path.join(rootDir, 'dist', match, coverFile);
      const ext = path.extname(coverFile);
      const destFilename = `${cleanSlug}-cover${ext}`;
      const destPath = path.join(SITE_ASSETS_DIR, destFilename);
      fs.copyFileSync(srcPath, destPath);
      coverRelPath = `assets/covers/${destFilename}`;
      coversCopied++;
    }
  }

  // Strictly sanitized public representation
  publicProducts.push({
    id: p.id,
    name: p.name,
    category: p.category,
    sector: sectorMap[p.vertical] || 'Specialized Industry',
    vertical: p.vertical,
    preview_url: p.preview_url,
    gumroad_url: p.gumroad_url || 'https://auraandgrid.gumroad.com',
    checkout_active: p.checkout_active ?? true,
    status_badge: p.status_badge || 'Active Checkout',
    commercial_checkout_url: p.commercial_checkout_url || 'https://auraandgrid.gumroad.com/l/agency-whitelabel-vault',
    cover_image: coverRelPath,
    tables: p.tables || ['profiles', 'audit_logs', 'orders'],
    archetype_name: p.archetype_name ? p.archetype_name.split(':')[1]?.trim() || p.archetype_name : 'Dense Operational Console',
    design_benchmark: p.design_benchmark || 'Industry Standard Bespoke UI'
  });
});

console.log(`📸 Copied ${coversCopied} / ${publicProducts.length} canonical cover graphics into site/assets/covers/`);

// Compile standalone public showroom HTML
const showroomHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Aura & Grid — The Institutional Software Foundry for Modern Agencies</title>
  <meta name="description" content="A curated fleet of 85 production-ready, specialized operating system blueprints engineered on React 19, Tailwind CSS, and Supabase PostgreSQL with active Row Level Security.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tailwindcss/2.2.19/tailwind.min.css"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            obsidian: '#08090A',
            panel: '#101216',
            card: '#14161C',
            border: '#232630',
            gold: '#C5A880',
            emerald: '#10B981',
            cobalt: '#3B82F6'
          },
          fontFamily: {
            serif: ['"Playfair Display"', 'Georgia', 'serif'],
            cinzel: ['Cinzel', 'serif'],
            sans: ['Inter', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #08090A;
      color: #E5E7EB;
      font-family: 'Inter', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .gold-gradient-text {
      background: linear-gradient(135deg, #FFFFFF 20%, #E8D5C4 60%, #C5A880 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hairline-border {
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-nav {
      background: rgba(8, 9, 10, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    .card-glow:hover {
      box-shadow: 0 12px 40px -10px rgba(197, 168, 128, 0.15);
      border-color: rgba(197, 168, 128, 0.4);
    }
  </style>
</head>
<body class="selection:bg-gold selection:text-black">

  <!-- ================= TOP NAVIGATION ================= -->
  <nav class="glass-nav fixed top-0 left-0 right-0 z-50 border-b border-white/10">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <div class="w-8 h-8 rounded border border-gold/40 flex items-center justify-center font-cinzel font-bold text-gold text-lg">
          A
        </div>
        <span class="font-cinzel tracking-widest text-lg font-bold text-white">AURA &amp; GRID</span>
        <span class="hidden sm:inline-block text-[11px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">Foundry // 85 OS</span>
      </div>

      <div class="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-400">
        <a href="#catalog" class="hover:text-gold transition-colors">Fleet Catalog (85)</a>
        <a href="#vault" class="hover:text-gold transition-colors">Agency Vault ($1,499)</a>
        <a href="#architecture" class="hover:text-gold transition-colors">Architecture &amp; RLS</a>
        <a href="#licensing" class="hover:text-gold transition-colors">Whitelabel Terms</a>
      </div>

      <div>
        <a href="#vault" class="inline-flex items-center space-x-2 px-4 py-2.5 rounded-full bg-gold hover:bg-[#b0936b] text-black font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-gold/10">
          <span>Acquire Vault</span>
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- ================= HERO SECTION ================= -->
  <header class="pt-36 pb-20 px-6 border-b border-white/5 relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none"></div>
    <div class="max-w-6xl mx-auto text-center relative z-10">
      
      <div class="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest mb-8">
        <span class="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
        <span>Founding Agency Cohort // 85 Turnkey Blueprints</span>
      </div>

      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-white mb-6 leading-[1.1]">
        Software Architecture for <br>
        <span class="gold-gradient-text italic font-normal">Next-Generation Studios.</span>
      </h1>

      <p class="max-w-3xl mx-auto text-lg sm:text-xl text-neutral-400 font-normal leading-relaxed mb-10">
        Skip 6 to 8 weeks of custom developer payroll. Deploy production-grade, single-tenant web operating systems for high-ticket clients with turnkey Supabase PostgreSQL schemas, active Row Level Security, and zero recurring platform royalties.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <a href="#catalog" class="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center justify-center space-x-2">
          <span>Explore 85 Blueprints</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
        <a href="#vault" class="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-panel hairline-border hover:border-gold/50 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2">
          <span>Acquire Founding Vault ($1,499)</span>
          <span class="text-gold">↗</span>
        </a>
      </div>

      <!-- Live Telemetry Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Fleet Inventory</div>
          <div class="text-xl font-bold text-white">85 Blueprints</div>
          <div class="text-[11px] text-emerald mt-1">● 100% Production Ready</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Accessibility Floor</div>
          <div class="text-xl font-bold text-white">WCAG AA Certified</div>
          <div class="text-[11px] text-neutral-400 mt-1">4.5:1 Contrast Floor</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Database Engine</div>
          <div class="text-xl font-bold text-white">Supabase RLS</div>
          <div class="text-[11px] text-cobalt mt-1">Turnkey SQL Schemas</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Whitelabel License</div>
          <div class="text-xl font-bold text-gold">100% Royalty Free</div>
          <div class="text-[11px] text-neutral-400 mt-1">Unlimited Client Sites</div>
        </div>
      </div>

    </div>
  </header>

  <!-- ================= THE FOUNDING AGENCY VAULT FLAGSHIP ================= -->
  <section id="vault" class="py-24 px-6 border-b border-white/5 relative">
    <div class="max-w-7xl mx-auto">
      <div class="rounded-2xl bg-gradient-to-b from-panel to-obsidian border border-gold/30 p-8 sm:p-14 relative overflow-hidden shadow-2xl">
        <div class="absolute -right-20 -top-20 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div class="lg:col-span-7">
            <div class="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold/15 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest mb-6">
              <span>Limited to 10 Agency Partners</span>
            </div>
            
            <h2 class="text-3xl sm:text-5xl font-serif font-bold text-white mb-6">
              The Founding Agency Vault
            </h2>
            
            <p class="text-neutral-300 text-base sm:text-lg leading-relaxed mb-8">
              Gain perpetual, commercial whitelabel rights to all 85 single-tenant operating system blueprints in our foundry. Package them into your agency proposals, bill clients $3,500 to $5,000+ per custom setup, and keep 100% of your billables.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 text-sm">
              <div class="flex items-start space-x-3 text-neutral-300">
                <span class="text-emerald font-bold">✓</span>
                <span><strong>85 Standalone Codebases</strong> with full source code & components.</span>
              </div>
              <div class="flex items-start space-x-3 text-neutral-300">
                <span class="text-emerald font-bold">✓</span>
                <span><strong>Turnkey Supabase PostgreSQL</strong> with active Row Level Security.</span>
              </div>
              <div class="flex items-start space-x-3 text-neutral-300">
                <span class="text-emerald font-bold">✓</span>
                <span><strong>Perpetual Commercial Whitelabel</strong> for unlimited client projects.</span>
              </div>
              <div class="flex items-start space-x-3 text-neutral-300">
                <span class="text-emerald font-bold">✓</span>
                <span><strong>Zero Recurring Platform Fees</strong> owed to Aura &amp; Grid.</span>
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-baseline gap-4 pt-4 border-t border-white/10">
              <div class="text-3xl sm:text-4xl font-mono font-bold text-white">$1,499 <span class="text-sm font-sans font-normal text-neutral-400">one-time acquisition</span></div>
              <div class="text-xs text-neutral-500 font-mono line-through">Standard Enterprise MSRP: $2,999</div>
            </div>
          </div>

          <div class="lg:col-span-5 bg-card hairline-border rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div class="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-2">Instant Fulfillment Package</div>
              <div class="text-xl font-bold text-white mb-4">master-agency-vault-85.zip (7.3 MB)</div>
              
              <ul class="space-y-3 text-xs text-neutral-400 font-mono mb-8 border-b border-white/5 pb-6">
                <li class="flex justify-between"><span>Format:</span> <span class="text-white">Clean React 19 + TypeScript</span></li>
                <li class="flex justify-between"><span>Database:</span> <span class="text-white">schema.sql + seed.sql per app</span></li>
                <li class="flex justify-between"><span>License:</span> <span class="text-white">Perpetual Commercial Whitelabel</span></li>
                <li class="flex justify-between"><span>Delivery:</span> <span class="text-emerald font-bold">Instant Download on Gumroad</span></li>
              </ul>
            </div>

            <a href="https://auraandgrid.gumroad.com/l/agency-whitelabel-vault" target="_blank" class="w-full py-4 rounded-lg bg-gold hover:bg-[#b0936b] text-black font-bold text-center text-sm uppercase tracking-wider transition-all shadow-xl shadow-gold/15">
              Acquire Agency License ($1,499) ➔
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= PUBLIC FLEET CATALOG (85 BLUEPRINTS) ================= -->
  <section id="catalog" class="py-24 px-6 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Production Catalog</div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white">The Verified Fleet Index</h2>
        <p class="text-neutral-400 text-sm mt-2">Filter and inspect 85 production-ready operating system blueprints across 7 specialized industry sectors.</p>
      </div>

      <!-- Search Input -->
      <div class="w-full md:w-72">
        <input type="text" id="searchInput" placeholder="Search by niche, title, or stack..." class="w-full bg-card hairline-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold">
      </div>
    </div>

    <!-- Sector Filter Pills -->
    <div class="flex flex-wrap gap-2 mb-10 text-xs font-medium" id="filterContainer">
      <button class="filter-btn active px-4 py-2 rounded-full bg-gold text-black font-semibold transition-all" data-sector="all">All Sectors (85)</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Hospitality & Dining">Hospitality &amp; Dining</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Legal, Wealth & Advisory">Legal, Wealth &amp; Advisory</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Clinical & Aesthetics">Clinical &amp; Aesthetics</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Automotive & Mobility">Automotive &amp; Mobility</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Creative & Media Studios">Creative &amp; Studios</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Trades & Operations">Trades &amp; Operations</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all" data-sector="Performance & Athletics">Performance &amp; Athletics</button>
    </div>

    <!-- Catalog Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="productsGrid">
      <!-- Injected via JavaScript -->
    </div>

    <div id="noResults" class="hidden text-center py-20">
      <p class="text-neutral-500 font-mono text-sm">No systems match your filter criteria.</p>
    </div>
  </section>

  <!-- ================= TECHNICAL ARCHITECTURE SECTION ================= -->
  <section id="architecture" class="py-24 px-6 border-t border-white/5 bg-panel/30">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Technical Diligence</div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white mb-4">Engineered for Technical Directors</h2>
        <p class="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Every blueprint is authored as a single-tenant, full-stack application. Clean code, zero vendor lock-in, and strict security standards ensure simple client handover.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono font-bold mb-6">01</div>
          <h3 class="text-lg font-bold text-white mb-2">React 19 + Tailwind Architecture</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Standardized component tree built on modern React with strict TypeScript interfaces, responsive viewports from mobile to 4K, and WCAG AA accessibility floors.
          </p>
        </div>

        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald font-mono font-bold mb-6">02</div>
          <h3 class="text-lg font-bold text-white mb-2">Supabase PostgreSQL + Active RLS</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Pre-packaged with schema.sql and seed.sql migrations. Tables enforce multi-tenant Row Level Security (RLS) so client records never bleed between organizations.
          </p>
        </div>

        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt font-mono font-bold mb-6">03</div>
          <h3 class="text-lg font-bold text-white mb-2">Zero Platform Lock-In</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Deploy on your client's own cloud accounts: Vercel, Supabase, Cloudflare, Netlify, or Render. You own the code; zero ongoing hosting debt is owed to Aura &amp; Grid.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= COMMERCIAL WHITELABEL TERMS ================= -->
  <section id="licensing" class="py-24 px-6 border-t border-white/5">
    <div class="max-w-5xl mx-auto">
      <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Commercial Terms</div>
      <h2 class="text-3xl sm:text-4xl font-serif font-bold text-white mb-8">Whitelabel Agency License</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
        <div class="p-6 rounded-xl bg-card hairline-border space-y-4">
          <h3 class="text-base font-bold text-emerald flex items-center space-x-2">
            <span>✓ Permitted Commercial Use</span>
          </h3>
          <ul class="space-y-3 text-neutral-300">
            <li class="flex items-start space-x-2">
              <span class="text-emerald">•</span>
              <span>Deploy unlimited custom client projects under your agency's brand.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald">•</span>
              <span>Charge clients onboarding fees ($3,500–$5,000+) and recurring monthly hosting retainers.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald">•</span>
              <span>Modify, reskin, rebrand, and extend the source code without restriction.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald">•</span>
              <span>Keep 100% of all client billing with zero royalties owed to Aura &amp; Grid.</span>
            </li>
          </ul>
        </div>

        <div class="p-6 rounded-xl bg-card hairline-border space-y-4">
          <h3 class="text-base font-bold text-red-400 flex items-center space-x-2">
            <span>✕ Prohibited Actions</span>
          </h3>
          <ul class="space-y-3 text-neutral-300">
            <li class="flex items-start space-x-2">
              <span class="text-red-400">•</span>
              <span>Reselling the raw source code or SQL migrations on public template marketplaces.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400">•</span>
              <span>Distributing master-agency-vault-85.zip to competing design agencies.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400">•</span>
              <span>Claiming primary foundational copyright to the underlying framework templates.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= FOOTER ================= -->
  <footer class="py-12 px-6 border-t border-white/5 text-xs text-neutral-500 font-mono">
    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div>
        <span class="font-cinzel text-white font-bold tracking-wider">AURA &amp; GRID</span>
        <span>— Digital Software Foundry. An asset holding of ZoMae Media LLC.</span>
      </div>
      <div class="flex items-center space-x-6">
        <a href="#catalog" class="hover:text-white transition-colors">Catalog (85)</a>
        <a href="#vault" class="hover:text-white transition-colors">Agency Vault ($1,499)</a>
        <a href="https://auraandgrid.gumroad.com" target="_blank" class="hover:text-white transition-colors">Gumroad Storefront ↗</a>
      </div>
    </div>
  </footer>

  <!-- ================= SPEC DRAWER MODAL ================= -->
  <div id="specModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-card hairline-border rounded-xl max-w-lg w-full p-6 relative">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-mono">✕</button>
      <div class="text-xs font-mono uppercase tracking-widest text-gold mb-1" id="modalSector">Sector</div>
      <h3 class="text-2xl font-serif font-bold text-white mb-2" id="modalTitle">Product Title</h3>
      <p class="text-sm text-neutral-400 mb-6" id="modalCategory">Product Category</p>
      
      <div class="space-y-3 text-xs font-mono mb-8 bg-obsidian p-4 rounded-lg hairline-border">
        <div class="flex justify-between"><span class="text-neutral-500">Design Benchmark:</span> <span class="text-white" id="modalBenchmark">Benchmark</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">UI Archetype:</span> <span class="text-white" id="modalArchetype">Archetype</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Database Engine:</span> <span class="text-emerald">Supabase PostgreSQL + RLS</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Relational Tables:</span> <span class="text-gold" id="modalTables">Tables</span></div>
      </div>

      <div class="flex gap-3">
        <a href="#" id="modalLiveDemo" target="_blank" class="flex-1 py-3 rounded-lg bg-panel hairline-border hover:border-gold/50 text-white font-medium text-xs text-center uppercase tracking-wider transition-all">Launch Live Demo ↗</a>
        <a href="#" id="modalGumroad" target="_blank" class="flex-1 py-3 rounded-lg bg-gold hover:bg-[#b0936b] text-black font-bold text-xs text-center uppercase tracking-wider transition-all">License ($150) ➔</a>
      </div>
    </div>
  </div>

  <!-- ================= CLIENT SCRIPT ================= -->
  <script>
    const products = ${JSON.stringify(publicProducts)};
    let activeSector = 'all';
    let searchQuery = '';

    const grid = document.getElementById('productsGrid');
    const noResults = document.getElementById('noResults');

    function renderProducts() {
      const filtered = products.filter(p => {
        const matchesSector = activeSector === 'all' || p.sector === activeSector;
        const matchesSearch = searchQuery === '' || 
          p.name.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery) ||
          p.sector.toLowerCase().includes(searchQuery);
        return matchesSector && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
      }

      noResults.classList.add('hidden');
      grid.innerHTML = filtered.map(p => \`
        <div class="rounded-xl bg-card hairline-border overflow-hidden card-glow transition-all flex flex-col justify-between">
          <div>
            <!-- Cover Mockup Window -->
            <div class="relative bg-obsidian border-b border-white/5 aspect-[16/9] overflow-hidden group">
              <img src="\${p.cover_image}" alt="\${p.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'640\\' height=\\'360\\' viewBox=\\'0 0 640 360\\'><rect width=\\'640\\' height=\\'360\\' fill=\\'%23111317\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23C5A880\\' font-family=\\'serif\\' font-size=\\'20\\' font-weight=\\'bold\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>AURA &amp; GRID // BLUEPRINT</text></svg>'">
              <div class="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase text-gold">
                \${p.sector}
              </div>
              <div class="absolute top-3 right-3 px-2 py-0.5 rounded \${p.checkout_active ? 'bg-emerald/20 border-emerald/40 text-emerald' : 'bg-gold/20 border-gold/40 text-gold'} border text-[10px] font-mono font-bold">
                \${p.checkout_active ? 'ACTIVE CHECKOUT' : 'PACKAGED'}
              </div>
            </div>

            <!-- Card Body -->
            <div class="p-6">
              <div class="text-[11px] font-mono text-neutral-500 uppercase tracking-widest mb-1.5">\${p.archetype_name}</div>
              <h3 class="text-xl font-serif font-bold text-white mb-2 leading-snug">\${p.name}</h3>
              <p class="text-xs text-neutral-400 line-clamp-2 mb-4 leading-relaxed">\${p.category}</p>
            </div>
          </div>

          <!-- Card Actions -->
          <div class="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between gap-3 text-xs font-mono">
            <a href="\${p.preview_url}" target="_blank" class="flex-1 py-2.5 rounded bg-panel hairline-border hover:border-gold/40 text-center text-white font-medium hover:text-gold transition-all">
              Live Demo ↗
            </a>
            <button onclick="openModal(\${p.id})" class="px-3 py-2.5 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all">
              Specs
            </button>
            <a href="\${p.commercial_checkout_url}" target="_blank" class="py-2.5 px-3 rounded \${p.checkout_active ? 'bg-gold/15 border-gold/40 text-gold hover:bg-gold hover:text-black' : 'bg-white/10 border-white/20 text-neutral-300 hover:bg-white hover:text-black'} border font-semibold transition-all">
              \${p.checkout_active ? '$150 ➔' : 'Vault ➔'}
            </a>
          </div>
        </div>
      \`).join('');
    }

    // Filter Buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('bg-gold', 'text-black', 'font-semibold');
          b.classList.add('bg-card', 'text-neutral-300');
        });
        btn.classList.add('bg-gold', 'text-black', 'font-semibold');
        btn.classList.remove('bg-card', 'text-neutral-300');
        activeSector = btn.getAttribute('data-sector');
        renderProducts();
      });
    });

    // Search Input
    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      renderProducts();
    });

    // Modal Helpers
    function openModal(id) {
      const p = products.find(x => x.id === id);
      if (!p) return;
      document.getElementById('modalSector').innerText = p.sector;
      document.getElementById('modalTitle').innerText = p.name;
      document.getElementById('modalCategory').innerText = p.category;
      document.getElementById('modalBenchmark').innerText = p.design_benchmark;
      document.getElementById('modalArchetype').innerText = p.archetype_name;
      document.getElementById('modalTables').innerText = p.tables.join(', ');
      document.getElementById('modalLiveDemo').href = p.preview_url;
      document.getElementById('modalGumroad').href = p.commercial_checkout_url;
      document.getElementById('modalGumroad').innerText = p.checkout_active ? 'License Blueprint ($150) ➔' : 'Acquire in Agency Vault ($1,499) ➔';
      document.getElementById('specModal').classList.remove('hidden');
    }

    function closeModal() {
      document.getElementById('specModal').classList.add('hidden');
    }

    document.getElementById('specModal').addEventListener('click', (e) => {
      if (e.target.id === 'specModal') closeModal();
    });

    // Initial Render
    renderProducts();
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML_PATH, showroomHtml, 'utf-8');
console.log(`✅ [Aura & Grid] Decoupled Public Showroom successfully compiled at: ${OUTPUT_HTML_PATH}`);
