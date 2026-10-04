#!/usr/bin/env node

/**
 * Ghost Factory™ — Public Brand Showroom Compiler
 * Builds an isolated, decoupled public showroom for Aura & Grid (site/index.html)
 * Extracts public metadata from CATALOG_MANIFEST.json and copies canonical covers into site/assets/covers/
 * Statically pre-renders all 136 digital vehicle cards with visible Truth Badges and Compliance Drawers.
 * Synchronized with GhostFactoryOS v1.8.0.
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

const MANIFEST_PATH = path.join(rootDir, 'CATALOG_MANIFEST.json');
const SITE_DIR = path.join(rootDir, 'site');
const SITE_ASSETS_DIR = path.join(SITE_DIR, 'assets', 'covers');
const OUTPUT_HTML_PATH = path.join(SITE_DIR, 'index.html');
const STYLE_CSS_PATH = path.join(SITE_DIR, 'assets', 'style.css');

console.log('⚡ [Aura & Grid] Compiling Decoupled Public Brand Showroom (136 Vehicles)...');

if (!fs.existsSync(MANIFEST_PATH)) {
  console.error(`❌ Missing CATALOG_MANIFEST.json at: ${MANIFEST_PATH}`);
  process.exit(1);
}

// Ensure directories exist
fs.mkdirSync(SITE_ASSETS_DIR, { recursive: true });

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
const distDirs = fs.existsSync(path.join(rootDir, 'dist'))
  ? fs.readdirSync(path.join(rootDir, 'dist')).filter(d => 
      !d.startsWith('.') && !d.startsWith('_') && fs.statSync(path.join(rootDir, 'dist', d)).isDirectory()
    )
  : [];

// Map sector groupings for clean buyer filtering
const sectorMap = {
  hospitality: 'Hospitality & Dining',
  wealth: 'Legal, Wealth & Advisory',
  medical: 'Clinical & Aesthetics',
  automotive: 'Automotive & Mobility',
  creative: 'Creative & Media Studios',
  home_services: 'Trades & Operations',
  heavy_fleet: 'Trades & Operations',
  fitness: 'Performance & Athletics',
  defense: 'Deep Tech & SCADA',
  subsea: 'Deep Tech & SCADA',
  aerospace: 'Deep Tech & SCADA',
  clean_energy: 'Deep Tech & SCADA',
  deep_tech: 'Deep Tech & SCADA'
};

const REGULATED_ASSET_IDS = new Set([
  5, 8, 10, 14, 17, 24, 27, 30, 31, 32, 33, 34, 35, 41, 43, 47, 49, 53, 54, 55,
  57, 58, 61, 62, 63, 65, 66, 67, 68, 69, 70, 73, 80, 82, 84, 86, 87, 88, 89,
  90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106,
  107, 108, 109, 110, 111, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136
]);

function isRegulatedSector(product) {
  if (REGULATED_ASSET_IDS.has(product.id)) {
    return true;
  }
  if (product.id >= 86 && product.id !== 112) return true;
  const s = sectorMap[product.vertical] || '';
  if (s === 'Clinical & Aesthetics' || s === 'Legal, Wealth & Advisory' || s === 'Deep Tech & SCADA') {
    return true;
  }
  if (['hospitality', 'creative', 'fitness'].includes(product.vertical) && product.id < 86) {
    return false;
  }
  const combined = `${product.name} ${product.category || ''} ${product.vertical || ''} ${product.archetype_name || ''}`.toLowerCase();
  const regulatedRegexes = [
    /\bclinical\b/, /\btrial\b/, /\bmedical\b/, /\bmedicine\b/, /\bmedspa\b/,
    /\bdental\b/, /\bdentist\b/, /\bveterinary\b/, /\bvet\b/, /\bhospital\b(?!ity)/,
    /\bhealth\b/, /\bhyperbaric\b/, /\brecovery\b/, /\bwellness\b/, /\bclinic\b/,
    /\btherapy\b/, /\bphysio\b/, /\bdoctor\b/, /\bpharma\b/, /\bbiotech\b/,
    /\bcredit\b/, /\bsyndication\b/, /\bwealth\b/, /\bfinance\b/, /\bcapital\b/,
    /\bdebt\b/, /\bbank\b/, /\bfamily office\b/, /\bfund\b/, /\bsatstacker\b/,
    /\bloan\b/, /\bmortgage\b/, /\bsecurities\b/, /\bm&a\b/, /\badvisory\b/,
    /\bfinancial\b/, /\btreasury\b/, /\blegal\b/, /\blitigation\b/, /\blaw\b/,
    /\battorney\b/, /\bcounsel\b/, /\bcompliance\b/, /\baviation\b/, /\bfbo\b/,
    /\baerospace\b/, /\bsupersonic\b/, /\bdrone\b/, /\bswarm\b/, /\bdefense\b/,
    /\bperimeter defense\b/, /\bmining\b/, /\bhaulage\b/, /\bcrawler\b/,
    /\btokamak\b/, /\bfusion\b/, /\bplasma\b/, /\bgeothermal\b/, /\begs\b/,
    /\bwellhead\b/, /\bhft\b/, /\bcolocation\b/, /\bmicrowave\b/, /\bwind tunnel\b/,
    /\bhypersonic\b/, /\blaser isl\b/, /\boptical terminal\b/, /\bmicrogrid\b/,
    /\bcleanroom\b/, /\bsemiconductor\b/, /\bfab\b/, /\bpayload manifest\b/,
    /\bspace launch\b/, /\bsubsea\b/, /\bcable burial\b/, /\btrenching\b/,
    /\bcable restoration\b/, /\bcryostat\b/, /\bquantum processor\b/,
    /\bsuperconducting\b/, /\beclss\b/, /\borbital habitat\b/, /\bpropellant depot\b/,
    /\bcryogenic\b/, /\bin-space\b/, /\brov\b/, /\baerospike\b/, /\bscada\b/,
    /\btelemetry\b/
  ];
  return regulatedRegexes.some(r => r.test(combined));
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function generateSvgCover(p, isTrack2, sector) {
  const cleanId = String(p.id).padStart(3, '0');
  const trackLabel = isTrack2 ? 'TRACK 2 // FLAGSHIP TIER-1' : 'TRACK 1 // LEAN PROTOTYPE';
  const priceLabel = isTrack2 ? '$14,500 BUYOUT ANCHOR' : '$199 SOURCE LICENSE';
  const archetype = p.archetype_name ? p.archetype_name.split(':')[1]?.trim() || p.archetype_name : 'Dense Operational Console';

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg-${p.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#08090A"/>
      <stop offset="50%" stop-color="#0D1017"/>
      <stop offset="100%" stop-color="#141824"/>
    </linearGradient>
    <pattern id="grid-${p.id}" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#232630" stroke-width="0.75" stroke-opacity="0.45"/>
    </pattern>
  </defs>
  <rect width="1280" height="720" fill="url(#bg-${p.id})"/>
  <rect width="1280" height="720" fill="url(#grid-${p.id})"/>
  
  <!-- Subtle decorative technical radar lines -->
  <circle cx="1060" cy="220" r="180" fill="none" stroke="#C5A880" stroke-width="1" stroke-opacity="0.12" stroke-dasharray="6 8"/>
  <circle cx="1060" cy="220" r="120" fill="none" stroke="#3B82F6" stroke-width="1" stroke-opacity="0.1"/>
  <circle cx="1060" cy="220" r="60" fill="none" stroke="#10B981" stroke-width="1" stroke-opacity="0.08"/>
  
  <!-- Header Bar -->
  <rect x="60" y="50" width="1160" height="40" fill="#14161C" rx="6" stroke="#232630" stroke-width="1"/>
  <text x="80" y="75" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600" letter-spacing="2">AURA &amp; GRID // TECHNICAL REPOSITORY</text>
  <text x="1200" y="75" text-anchor="end" fill="${isTrack2 ? '#F59E0B' : '#10B981'}" font-family="'JetBrains Mono', monospace" font-size="12" font-weight="bold">● ${trackLabel}</text>
  
  <!-- Title Block -->
  <text x="60" y="150" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="15" font-weight="bold" letter-spacing="3">${escapeHtml(sector.toUpperCase())} // ${escapeHtml(archetype.toUpperCase())}</text>
  <text x="60" y="225" fill="#FFFFFF" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="bold">${escapeHtml(p.name)}</text>
  <text x="60" y="270" fill="#9CA3AF" font-family="'Inter', sans-serif" font-size="17">${escapeHtml(p.category)}</text>
  
  <!-- Specs Console Box -->
  <rect x="60" y="320" width="1160" height="260" fill="#090B0E" rx="10" stroke="#232630" stroke-width="1"/>
  <line x1="60" y1="400" x2="1220" y2="400" stroke="#232630" stroke-width="1"/>
  
  <text x="90" y="365" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">ARCHITECTURE</text>
  <text x="260" y="365" fill="#E5E7EB" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">React 19 + TypeScript + Tailwind CSS</text>
  
  <text x="680" y="365" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">DATABASE ENGINE</text>
  <text x="840" y="365" fill="#10B981" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">Supabase PostgreSQL + Active RLS</text>
  
  <text x="90" y="450" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">BENCHMARK</text>
  <text x="260" y="450" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="14">${escapeHtml(p.design_benchmark || 'Industry Standard')}</text>
  
  <text x="680" y="450" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">RELATIONAL TABLES</text>
  <text x="840" y="450" fill="#93C5FD" font-family="'JetBrains Mono', monospace" font-size="14">${escapeHtml(p.tables ? p.tables.slice(0, 4).join(', ') : 'profiles, audit_logs')}</text>
  
  <text x="90" y="525" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="13">PRODUCT TRUTH</text>
  <text x="260" y="525" fill="#F59E0B" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="600">[SIMULATED DATA PROTOTYPE] — CONCEPT DEMONSTRATION &amp; DEPLOYABLE SOURCE</text>
  
  <!-- Footer Bar -->
  <rect x="60" y="615" width="1160" height="50" fill="#14161C" rx="8" stroke="#232630" stroke-width="1"/>
  <text x="90" y="646" fill="#C5A880" font-family="'JetBrains Mono', monospace" font-size="14" font-weight="bold">VEHICLE #${cleanId}</text>
  <text x="360" y="646" fill="#6B7280" font-family="'JetBrains Mono', monospace" font-size="12">CATALOG SYNCHRONIZED WITH GHOSTFACTORYOS v1.8.0</text>
  <text x="1200" y="646" text-anchor="end" fill="#E5E7EB" font-family="'JetBrains Mono', monospace" font-size="13" font-weight="bold">${priceLabel}</text>
</svg>`;
}

const publicProducts = [];
let rasterCoversFound = 0;
let svgCoversGenerated = 0;

manifest.products.forEach(p => {
  const isTrack2 = Boolean(p.flagship_qualified) || (p.pricing_track && p.pricing_track.includes('Track 2')) || (p.id >= 86 && p.id !== 112);
  const cleanSlug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const sector = sectorMap[p.vertical] || (isTrack2 ? 'Deep Tech & SCADA' : 'Specialized Operations');

  // Find matching dist dir
  const match = distDirs.find(d => {
    const normD = d.replace(/-os$/, '');
    const normP = cleanSlug;
    const gumroadSlug = p.gumroad_url ? p.gumroad_url.split('/l/')[1]?.replace(/-os$/, '') : '';
    const previewSlug = p.preview_url ? p.preview_url.replace('https://', '').split('.')[0]?.replace(/-os$/, '') : '';
    return d === normP || normD === normP || d === gumroadSlug || normD === gumroadSlug || d === previewSlug || normD === previewSlug;
  });

  let coverRelPath = p.coverImage || p.cover_image || `assets/covers/${cleanSlug}-cover.webp`;
  let foundLocalRaster = false;

  // Priority 0: Explicit clean coverImage / cover_image key on product
  if (p.coverImage || p.cover_image) {
    const explicitCover = p.coverImage || p.cover_image;
    const explicitFilename = path.basename(explicitCover);
    if (fs.existsSync(path.join(SITE_ASSETS_DIR, explicitFilename))) {
      coverRelPath = explicitCover.startsWith('assets/covers/') ? explicitCover : `assets/covers/${explicitFilename}`;
      rasterCoversFound++;
      foundLocalRaster = true;
    }
  }

  // Priority 1: High-fidelity optimized WebP cover in site/assets/covers/
  if (!foundLocalRaster && fs.existsSync(path.join(SITE_ASSETS_DIR, `${cleanSlug}-cover.webp`))) {
    coverRelPath = `assets/covers/${cleanSlug}-cover.webp`;
    rasterCoversFound++;
    foundLocalRaster = true;
  }

  if (!foundLocalRaster && match) {
    const matchPath = path.join(rootDir, 'dist', match);
    if (fs.existsSync(matchPath) && fs.statSync(matchPath).isDirectory()) {
      const files = fs.readdirSync(matchPath);
      const coverFile = files.find(f => f.includes('cover') && (f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png')));
      if (coverFile) {
        const srcPath = path.join(matchPath, coverFile);
        const ext = path.extname(coverFile);
        const destFilename = `${cleanSlug}-cover${ext}`;
        const destPath = path.join(SITE_ASSETS_DIR, destFilename);
        fs.copyFileSync(srcPath, destPath);
        coverRelPath = `assets/covers/${destFilename}`;
        rasterCoversFound++;
        foundLocalRaster = true;
      }
    }
  }

  // Check if raster already exists in SITE_ASSETS_DIR from previous compilation
  if (!foundLocalRaster) {
    if (fs.existsSync(path.join(SITE_ASSETS_DIR, `${cleanSlug}-cover.webp`))) {
      coverRelPath = `assets/covers/${cleanSlug}-cover.webp`;
      rasterCoversFound++;
      foundLocalRaster = true;
    } else if (fs.existsSync(path.join(SITE_ASSETS_DIR, `${cleanSlug}-cover.jpg`))) {
      coverRelPath = `assets/covers/${cleanSlug}-cover.jpg`;
      rasterCoversFound++;
      foundLocalRaster = true;
    } else if (fs.existsSync(path.join(SITE_ASSETS_DIR, `${cleanSlug}-cover.png`))) {
      coverRelPath = `assets/covers/${cleanSlug}-cover.png`;
      rasterCoversFound++;
      foundLocalRaster = true;
    }
  }

  // If no raster cover found, generate an ultra-clean high-tech vector SVG cover
  if (!foundLocalRaster) {
    const svgFilename = `${cleanSlug}-cover.svg`;
    const svgDestPath = path.join(SITE_ASSETS_DIR, svgFilename);
    const svgContent = generateSvgCover(p, isTrack2, sector);
    fs.writeFileSync(svgDestPath, svgContent, 'utf-8');
    coverRelPath = `assets/covers/${svgFilename}`;
    svgCoversGenerated++;
  }

  publicProducts.push({
    id: p.id,
    name: p.name,
    category: p.category,
    sector,
    vertical: p.vertical,
    preview_url: p.preview_url,
    gumroad_url: p.gumroad_url || 'https://auraandgrid.gumroad.com',
    checkout_active: p.checkout_active ?? true,
    status_badge: p.status_badge || (isTrack2 ? 'Track 2 Flagship' : 'Active Checkout'),
    commercial_checkout_url: p.commercial_checkout_url || (isTrack2 ? '#pricing' : 'https://auraandgrid.gumroad.com'),
    cover_image: coverRelPath,
    coverImage: coverRelPath,
    best_for: p.best_for || '',
    pricing_track: isTrack2 ? 'Track 2 — Flagship Tier-1 ($14,500 Anchor)' : 'Track 1 — Lean Rapid-Sale ($4,500 Anchor)',
    isTrack2,
    tables: p.tables || ['profiles', 'audit_logs', 'orders'],
    archetype_name: p.archetype_name ? p.archetype_name.split(':')[1]?.trim() || p.archetype_name : 'Dense Operational Console',
    design_benchmark: p.design_benchmark || 'Industry Standard Bespoke UI'
  });
});

console.log(`📸 Processed covers: ${rasterCoversFound} raster copied + ${svgCoversGenerated} dynamic vector SVGs created (${publicProducts.length} total vehicles)`);

// Render high-contrast inline SVG SCADA telemetry card or cover component
function renderCoverMarkup(p) {
  if (p.id === 86) {
    // Autonomous Drone Swarm Perimeter Defense OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between p-4 group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-86" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.3"/>
          </pattern>
          <radialGradient id="radarGlow-86" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#00F0FF" stop-opacity="0.35"/>
            <stop offset="100%" stop-color="#00F0FF" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-86)"/>
        <circle cx="75%" cy="50%" r="65" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.4" stroke-dasharray="4 4"/>
        <circle cx="75%" cy="50%" r="42" fill="none" stroke="#10B981" stroke-width="1.2" stroke-opacity="0.6"/>
        <circle cx="75%" cy="50%" r="20" fill="url(#radarGlow-86)"/>
        <line x1="75%" y1="12%" x2="75%" y2="88%" stroke="#00F0FF" stroke-width="0.75" stroke-opacity="0.4"/>
        <line x1="52%" y1="50%" x2="98%" y2="50%" stroke="#10B981" stroke-width="0.75" stroke-opacity="0.4"/>
        <circle cx="71%" cy="40%" r="3.5" fill="#00F0FF"/>
        <circle cx="79%" cy="46%" r="3" fill="#10B981"/>
        <circle cx="68%" cy="60%" r="3" fill="#00F0FF"/>
        <circle cx="82%" cy="62%" r="3.5" fill="#10B981"/>
      </svg>
      <div class="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          AEGIS SWARM RADAR // SECTOR 04
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">SCADA v1.8.0</span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
            <circle cx="12" cy="12" r="3" fill="#00F0FF" fill-opacity="0.3"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80">${escapeHtml(p.archetype_name || '32-NODE AIR PERIMETER TELEMETRY')}</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-amber-400 font-bold">RLS ACTIVE</span>
      </div>
    </div>`;
  }

  if (p.id === 87) {
    // Autonomous Mining Haulage Fleet Dispatch OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-amber-500/30 flex flex-col justify-between p-4 group-hover:border-amber-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-87" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
          <radialGradient id="amberGlow-87" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-87)"/>
        <polygon points="260,30 340,70 320,150 240,110" fill="none" stroke="#F59E0B" stroke-width="1.2" stroke-opacity="0.4"/>
        <polygon points="275,50 325,75 310,130 255,100" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.6" stroke-dasharray="3 3"/>
        <circle cx="280" cy="85" r="16" fill="url(#amberGlow-87)"/>
        <circle cx="270" cy="65" r="3.5" fill="#10B981"/>
        <circle cx="310" cy="90" r="3.5" fill="#00F0FF"/>
        <circle cx="285" cy="120" r="3.5" fill="#10B981"/>
      </svg>
      <div class="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          OPEN-PIT HAULAGE // DISPATCH BENCH 09
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">SCADA v1.8.0</span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z"/>
            <circle cx="5.5" cy="18.5" r="2.5"/>
            <circle cx="18.5" cy="18.5" r="2.5"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-amber-300/80">${escapeHtml(p.archetype_name || '14 HAUL UNITS // CAT 797F TELEMETRY')}</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-amber-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">DISPATCH 100%</span>
      </div>
    </div>`;
  }

  if (p.id === 88) {
    // Autonomous Subsea Mining Crawler Telemetry OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between p-4 group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-88" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
          <radialGradient id="sonarGlow-88" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#10B981" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="#10B981" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-88)"/>
        <circle cx="75%" cy="50%" r="65" fill="none" stroke="#10B981" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <circle cx="75%" cy="50%" r="42" fill="none" stroke="#00F0FF" stroke-width="1.2" stroke-opacity="0.5"/>
        <circle cx="75%" cy="50%" r="18" fill="url(#sonarGlow-88)"/>
        <line x1="75%" y1="12%" x2="75%" y2="88%" stroke="#10B981" stroke-width="0.75" stroke-opacity="0.35"/>
        <line x1="52%" y1="50%" x2="98%" y2="50%" stroke="#00F0FF" stroke-width="0.75" stroke-opacity="0.35"/>
        <circle cx="75%" cy="50%" r="3.5" fill="#10B981"/>
        <circle cx="82%" cy="42%" r="2.5" fill="#00F0FF"/>
      </svg>
      <div class="relative z-10 flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          BENTHIC SEABED TELEMETRY // -4,200M
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">SCADA v1.8.0</span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4z"/>
            <path d="M6 14h12M4 18h16M7 22h10"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80">${escapeHtml(p.archetype_name || '420 BAR PRESSURE // UMBILICAL ROV')}</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">SONAR LOCKED</span>
      </div>
    </div>`;
  }

  if (p.id === 5) {
    // Elevate Capital
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-emerald-500/30 flex flex-col justify-between p-4 group-hover:border-emerald-400/60 transition-colors">
      <div class="flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          LP CAPITAL WATERFALL
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">UNDERWRITING ENGINE</span>
      </div>
      <div class="my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">LP SYNDICATION ENGINE</div>
          <div class="text-[11px] font-mono text-emerald/80">18.4% NET IRR // SEC REG D MODEL</div>
        </div>
      </div>
      <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-emerald font-bold">[ACTIVE UNDERWRITING FEED // CARTA BENCHMARK]</span>
        <span class="text-gold font-bold">$199 LICENSE</span>
      </div>
    </div>`;
  }

  if (p.id === 8) {
    // Aura MedSpa
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-purple-500/30 flex flex-col justify-between p-4 group-hover:border-purple-400/60 transition-colors">
      <div class="flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/40 text-purple-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
          AESTHETICS CLINICAL SUITE
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">ROOM DISPATCH</span>
      </div>
      <div class="my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">CLINICAL TREATMENT OPS</div>
          <div class="text-[11px] font-mono text-purple-300/80">1064nm YAG // EMSELLA PROTOCOL</div>
        </div>
      </div>
      <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-purple-300 font-bold">[CLINICAL TELEMETRY // ROOM ACTIVE]</span>
        <span class="text-gold font-bold">$199 LICENSE</span>
      </div>
    </div>`;
  }

  if (p.id === 9) {
    // Royal Apex
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-amber-500/30 flex flex-col justify-between p-4 group-hover:border-amber-400/60 transition-colors">
      <div class="flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
          LUXURY ATELIER DISPATCH
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">CHAIR MATRIX</span>
      </div>
      <div class="my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-300 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">ROYAL APEX ATELIER</div>
          <div class="text-[11px] font-mono text-amber-300/80">98.4% RETENTION // 6 STATIONS</div>
        </div>
      </div>
      <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-amber-300 font-bold">[ATELIER TELEMETRY // ACTIVE]</span>
        <span class="text-gold font-bold">$199 LICENSE</span>
      </div>
    </div>`;
  }

  if (p.id === 10) {
    // Aura Reserve
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-red-500/30 flex flex-col justify-between p-4 group-hover:border-red-400/60 transition-colors">
      <div class="flex items-center justify-between text-[11px] font-mono tracking-wider">
        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/70 border border-red-500/40 text-red-300 font-bold">
          <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse"></span>
          VINEYARD CELLAR VAULT
        </span>
        <span class="text-neutral-400 font-mono text-[10px]">ALLOCATION OPS</span>
      </div>
      <div class="my-auto flex items-center gap-3.5">
        <div class="w-12 h-12 rounded-xl bg-red-950/60 border border-red-500/50 flex items-center justify-center text-red-300 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M8 22h8M12 11v11M19 3H5l2 8a5 5 0 0 0 10 0z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">AURA RESERVE CELLAR</div>
          <div class="text-[11px] font-mono text-red-300/80">ALLOCATION MATRIX // BARREL LOT 4</div>
        </div>
      </div>
      <div class="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-red-300 font-bold">[VAULT TELEMETRY // 55°F HUMIDITY 70%]</span>
        <span class="text-gold font-bold">$199 LICENSE</span>
      </div>
    </div>`;
  }

  if (p.id === 115) {
    // AEGIS-SWARM Defense Console
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-115" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#00F0FF" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-115)"/>
        <circle cx="75%" cy="50%" r="55" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <circle cx="75%" cy="50%" r="35" fill="none" stroke="#10B981" stroke-width="1.2" stroke-opacity="0.5"/>
        <line x1="75%" y1="15%" x2="75%" y2="85%" stroke="#00F0FF" stroke-width="0.75" stroke-opacity="0.35"/>
        <line x1="55%" y1="50%" x2="95%" y2="50%" stroke="#10B981" stroke-width="0.75" stroke-opacity="0.35"/>
        <circle cx="75%" cy="50%" r="3.5" fill="#10B981"/>
        <circle cx="85%" cy="42%" r="2.5" fill="#00F0FF"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <circle cx="12" cy="11" r="3"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80 truncate">32-NODE AUTONOMOUS INTERCEPT RADAR</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-amber-400 font-bold">RLS ACTIVE</span>
      </div>
    </div>`;
  }

  if (p.id === 116) {
    // Aetheris Sat-Laser ISL Telemetry OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-116" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-116)"/>
        <line x1="20%" y1="80%" x2="80%" y2="20%" stroke="#00F0FF" stroke-width="1.5" stroke-dasharray="6 3"/>
        <circle cx="80%" cy="20%" r="8" fill="none" stroke="#00F0FF" stroke-width="1.5"/>
        <circle cx="20%" cy="80%" r="8" fill="none" stroke="#10B981" stroke-width="1.5"/>
        <circle cx="50%" cy="50%" r="28" fill="none" stroke="#10B981" stroke-width="0.75" stroke-opacity="0.5"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="3"/>
            <path d="M3 12h3M18 12h3M12 3v3M12 18v3"/>
            <path d="m5.6 5.6 2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80 truncate">CONSTELLATION LASER TERMINAL MESH</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">BEAM LOCKED</span>
      </div>
    </div>`;
  }

  if (p.id === 117) {
    // Langley Hypersonic Wind Tunnel SCADA
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-amber-500/30 flex flex-col justify-between group-hover:border-amber-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-117" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-117)"/>
        <path d="M 200,40 Q 280,90 200,140" fill="none" stroke="#F59E0B" stroke-width="2" stroke-opacity="0.6"/>
        <path d="M 230,20 Q 330,90 230,160" fill="none" stroke="#00F0FF" stroke-width="1.5" stroke-opacity="0.5" stroke-dasharray="4 2"/>
        <line x1="50" y1="90" x2="350" y2="90" stroke="#10B981" stroke-width="1" stroke-opacity="0.4"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
            <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
            <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-amber-300/80 truncate">MACH 5-8 AERODYNAMIC SCADA BENCH</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-amber-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">FLOW STABLE</span>
      </div>
    </div>`;
  }

  if (p.id === 118) {
    // Vanguard ECLSS Life Support Systems OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-118" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#00F0FF" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-118)"/>
        <circle cx="75%" cy="50%" r="50" fill="none" stroke="#10B981" stroke-width="1.5"/>
        <circle cx="75%" cy="50%" r="30" fill="none" stroke="#00F0FF" stroke-width="1" stroke-dasharray="4 2"/>
        <circle cx="75%" cy="50%" r="12" fill="#10B981" fill-opacity="0.2"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/>
            <path d="M12 6a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-emerald-300/80 truncate">CLOSED-LOOP LIFE SUPPORT SCADA</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-emerald-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-cyan-400 font-bold">CABIN 101.3 kPa</span>
      </div>
    </div>`;
  }

  if (p.id === 119) {
    // Cascade Supercritical EGS Geothermal OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-amber-500/30 flex flex-col justify-between group-hover:border-amber-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-119" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-119)"/>
        <line x1="75%" y1="10%" x2="75%" y2="90%" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="75%" cy="80%" r="22" fill="#F59E0B" fill-opacity="0.2" stroke="#F59E0B" stroke-width="1.5"/>
        <circle cx="75%" cy="80%" r="10" fill="#EF4444" fill-opacity="0.5"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-amber-300/80 truncate">5,200M CRUSTAL HEAT EXCHANGE SCADA</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-amber-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-amber-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">28.4 MW OUTPUT</span>
      </div>
    </div>`;
  }

  if (p.id === 120) {
    // Subsea Autonomous Crawler Telemetry OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-120" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-120)"/>
        <circle cx="75%" cy="50%" r="55" fill="none" stroke="#10B981" stroke-width="1.2" stroke-dasharray="3 3"/>
        <circle cx="75%" cy="50%" r="35" fill="none" stroke="#00F0FF" stroke-width="1"/>
        <circle cx="75%" cy="50%" r="15" fill="#00F0FF" fill-opacity="0.25"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <path d="M12 2a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4z"/>
            <path d="M6 14h12M4 18h16M7 22h10"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80 truncate">AUTONOMOUS POLYMETALLIC HARVESTER</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">PRESSURE 450 BAR</span>
      </div>
    </div>`;
  }

  if (p.id === 121) {
    // MetroNest-04 Tactical Drone Ops HUD
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-121" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#00F0FF" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-121)"/>
        <circle cx="75%" cy="50%" r="55" fill="none" stroke="#00F0FF" stroke-width="1" stroke-dasharray="4 4"/>
        <circle cx="75%" cy="50%" r="35" fill="none" stroke="#10B981" stroke-width="1.2"/>
        <line x1="75%" y1="15%" x2="75%" y2="85%" stroke="#00F0FF" stroke-width="0.75"/>
        <line x1="55%" y1="50%" x2="95%" y2="50%" stroke="#10B981" stroke-width="0.75"/>
        <circle cx="70%" cy="40%" r="3" fill="#10B981"/>
        <circle cx="82%" cy="60%" r="3" fill="#00F0FF"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <circle cx="12" cy="12" r="3"/>
            <path d="M4.5 4.5l3 3M19.5 4.5l-3 3M4.5 19.5l3-3M19.5 19.5l-3-3"/>
            <circle cx="4.5" cy="4.5" r="2"/><circle cx="19.5" cy="4.5" r="2"/><circle cx="4.5" cy="19.5" r="2"/><circle cx="19.5" cy="19.5" r="2"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80 truncate">4-UAV AUTONOMOUS FLIGHT CORRIDOR</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-cyan-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-emerald font-bold">AIRSPACE CLEAR</span>
      </div>
    </div>`;
  }

  if (p.id === 122) {
    // VoltGrid EV Fleet Dispatch Telemetry OS
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-emerald-500/30 flex flex-col justify-between group-hover:border-emerald-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-122" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-122)"/>
        <line x1="20%" y1="50%" x2="80%" y2="50%" stroke="#10B981" stroke-width="2"/>
        <circle cx="35%" cy="50%" r="6" fill="#10B981"/>
        <circle cx="65%" cy="50%" r="6" fill="#00F0FF"/>
        <circle cx="50%" cy="50%" r="35" fill="none" stroke="#00F0FF" stroke-width="1" stroke-dasharray="4 2"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-lg shadow-emerald-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-emerald-300/80 truncate">COMMERCIAL EV FLEET DISPATCH HUD</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-emerald-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-emerald-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-cyan-400 font-bold">99.4% SOC FLEET</span>
      </div>
    </div>`;
  }

  // Generic Flagship SCADA Blueprint Card for all other Track 2 models (#89–#114)
  if (p.isTrack2) {
    return `
    <div class="w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-zinc-900 to-black border border-cyan-500/30 flex flex-col justify-between group-hover:border-cyan-400/60 transition-colors">
      <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-f${p.id}" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#10B981" stroke-width="0.5" stroke-opacity="0.25"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-f${p.id})"/>
        <circle cx="75%" cy="50%" r="55" fill="none" stroke="#00F0FF" stroke-width="1" stroke-opacity="0.35" stroke-dasharray="4 4"/>
        <circle cx="75%" cy="50%" r="35" fill="none" stroke="#10B981" stroke-width="1.2" stroke-opacity="0.5"/>
        <line x1="75%" y1="15%" x2="75%" y2="85%" stroke="#00F0FF" stroke-width="0.75" stroke-opacity="0.35"/>
        <line x1="55%" y1="50%" x2="95%" y2="50%" stroke="#10B981" stroke-width="0.75" stroke-opacity="0.35"/>
        <circle cx="75%" cy="50%" r="4" fill="#10B981"/>
        <circle cx="85%" cy="42%" r="3" fill="#00F0FF"/>
      </svg>
      <div class="flex items-center justify-between w-full px-4 pt-3 pb-1 gap-2 relative z-10">
        <span class="text-[10px] font-mono tracking-wider text-cyan-400 bg-cyan-950/40 border border-cyan-800/60 px-2 py-0.5 rounded flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          FLAGSHIP SCADA TELEMETRY
        </span>
        <span class="text-[10px] font-mono tracking-wider text-amber-400 bg-amber-950/40 border border-amber-800/60 px-2 py-0.5 rounded font-bold">
          FLAGSHIP TIER-1
        </span>
      </div>
      <div class="relative z-10 my-auto flex items-center gap-3.5 px-4">
        <div class="w-12 h-12 rounded-xl bg-cyan-950/60 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-950/50 shrink-0">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
        </div>
        <div class="min-w-0">
          <div class="text-xs font-mono font-bold text-white tracking-wider uppercase truncate">${escapeHtml(p.name)}</div>
          <div class="text-[11px] font-mono text-cyan-300/80 truncate">${escapeHtml(p.archetype_name || 'SCADA MISSION CONSOLE')}</div>
        </div>
      </div>
      <div class="relative z-10 pt-2 pb-3 px-4 border-t border-cyan-500/20 flex items-center justify-between text-[10px] font-mono text-neutral-300">
        <span class="text-emerald-400 font-bold tracking-tight font-mono">[ACTIVE SCADA STREAM // VERIFIED PROTOTYPE]</span>
        <span class="text-amber-400 font-bold">RLS ACTIVE</span>
      </div>
    </div>`;
  }

  // Standard Retail Template Cover with verified cache busting
  return `<img src="${p.cover_image}?v=1.8.0" alt="${escapeHtml(p.name)}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'640\\' height=\\'360\\' viewBox=\\'0 0 640 360\\'><rect width=\\'640\\' height=\\'360\\' fill=\\'%23111317\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23C5A880\\' font-family=\\'serif\\' font-size=\\'18\\' font-weight=\\'bold\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'>AURA &amp; GRID // BLUEPRINT</text></svg>'">`;
}

// Pre-render all 136 cards into static DOM
const renderedCardsHtml = publicProducts.map(p => {
  const isRegulated = isRegulatedSector(p);
  const isTrack2 = p.isTrack2;
  const disclaimerText = isRegulated
    ? "SIMULATED DATA PROTOTYPE — NOT CERTIFIED FOR OPERATIONAL, REGULATORY, OR LIFE-CRITICAL USE. NOT PRODUCTION OR PROFESSIONAL ADVICE."
    : "SIMULATED DATA PROTOTYPE — FOR CONCEPT DEMO ONLY — NOT PRODUCTION OR ADVICE.";

  const coverMarkup = renderCoverMarkup(p);
  const isCustomVectorCard = coverMarkup.trim().startsWith('<div');

  return `
      <!-- Blueprint Card #${p.id} -->
      <div class="product-card rounded-xl bg-card hairline-border overflow-hidden card-glow transition-all flex flex-col justify-between scroll-mt-32"
           id="vehicle-${p.id}"
           data-id="${p.id}"
           data-name="${escapeHtml(p.name)}"
           data-category="${escapeHtml(p.category)}"
           data-sector="${escapeHtml(p.sector)}"
           data-track="${isTrack2 ? 'track2' : 'track1'}"
           data-benchmark="${escapeHtml(p.design_benchmark)}"
           data-archetype="${escapeHtml(p.archetype_name)}"
           data-tables="${escapeHtml(p.tables ? p.tables.join(', ') : '')}"
           data-bestfor="${escapeHtml(p.best_for || '')}"
           data-preview="${escapeHtml(p.preview_url)}"
           data-checkout="${escapeHtml(p.commercial_checkout_url)}"
           data-active="${p.checkout_active ? '1' : '0'}">
        <div>
          <!-- Cover Mockup Window -->
          <div class="relative bg-obsidian border-b border-white/5 aspect-[16/9] overflow-hidden group">
            ${coverMarkup}
            ${!isCustomVectorCard ? `
            <div class="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase text-gold">
              ${escapeHtml(p.sector)}
            </div>
            <div class="absolute top-3 right-3 px-2 py-0.5 rounded ${isTrack2 ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-emerald/20 border-emerald/40 text-emerald'} border text-[10px] font-mono font-bold">
              ${isTrack2 ? 'FLAGSHIP TIER-1' : 'ACTIVE CHECKOUT'}
            </div>` : ''}
          </div>

          <!-- Card Body -->
          <div class="p-6 sm:p-8">
            <div class="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">${escapeHtml(p.archetype_name)}</div>
            <h3 class="text-xl font-semibold text-white tracking-tight mb-2 leading-snug">${escapeHtml(p.name)}</h3>
            
            <!-- High-Contrast Universal Truth Pill Badge (Visible plain text in DOM) -->
            <div class="my-2.5">
              <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-400 text-black font-black text-xs font-mono uppercase tracking-wider shadow-sm border border-amber-300">
                [SIMULATED DATA PROTOTYPE]
              </span>
            </div>

            <p class="text-sm md:text-base text-zinc-300 line-clamp-2 mb-3 leading-relaxed">${escapeHtml(p.category)}</p>

            <!-- Buyer Qualification Row: Best For -->
            <div class="mb-3.5 px-3.5 py-2.5 rounded-lg bg-black/60 border border-white/10 text-xs sm:text-sm font-mono flex items-start gap-2">
              <span class="text-gold font-bold uppercase tracking-wider shrink-0 text-xs">Best For:</span>
              <span class="text-zinc-200 text-xs sm:text-sm leading-snug">${escapeHtml(p.best_for ? p.best_for.replace(/^Best for:\s*/i, '') : 'Commercial agency client adaptation')}</span>
            </div>

            <!-- Dual-Track Dealership Window Sticker Grid -->
            <div class="mb-3 p-3.5 rounded-lg border text-xs font-mono ${isTrack2 ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'}">
              <div class="flex items-center justify-between mb-2">
                <span class="px-2.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase ${isTrack2 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
                  ${isTrack2 ? 'Track 2 // Flagship Tier-1' : 'Track 1 // Lean Rapid-Sale'}
                </span>
                <span class="text-[11px] text-neutral-400 font-medium">
                  ${isTrack2 ? 'SCADA / Deep Tech' : 'Turnkey Template'}
                </span>
              </div>
              ${isTrack2 ? `
              <div class="space-y-1.5 text-xs sm:text-sm">
                <div class="flex justify-between">
                  <span class="text-neutral-400">Commercial License:</span>
                  <span class="text-amber-300 font-bold">$1,500 – $3,500 USD</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-400">Buyout Anchor:</span>
                  <span class="text-amber-400 font-bold">$14,500 USD</span>
                </div>
                <div class="flex justify-between text-xs text-neutral-400 border-t border-amber-500/15 pt-1.5">
                  <span>Exclusive Buyout Range:</span>
                  <span class="text-amber-200/90 font-medium">$10,000 – $18,000 USD</span>
                </div>
              </div>
              ` : `
              <div class="space-y-1.5 text-xs sm:text-sm">
                <div class="flex justify-between">
                  <span class="text-neutral-400">Retail Source License:</span>
                  <span class="text-emerald-300 font-bold">$199 USD</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-neutral-400">Multi-Seat Team Pass:</span>
                  <span class="text-cyan-300 font-bold">$599 USD</span>
                </div>
                <div class="flex justify-between text-xs text-neutral-400 border-t border-emerald-500/15 pt-1.5">
                  <span>Exclusive Buyout Floor:</span>
                  <span class="text-emerald-300 font-bold">$3,800 – $6,500 ($4,500 Anchor)</span>
                </div>
              </div>
              `}
            </div>

            <!-- Expandable Compliance Details Drawer -->
            <details class="mt-3 pt-2 border-t border-white/5 group">
              <summary class="text-xs font-mono text-neutral-400 hover:text-neutral-200 cursor-pointer flex items-center justify-between select-none py-1">
                <span>Truth &amp; Compliance</span>
                <span class="text-neutral-500 group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <div class="mt-2 p-2.5 rounded bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs font-mono leading-relaxed">
                ${disclaimerText}
              </div>
            </details>
          </div>
        </div>

        <!-- Card Actions -->
        <div class="p-6 sm:p-8 pt-0 border-t border-white/5 mt-4 flex items-center justify-between gap-3 text-xs font-mono">
          <a href="${escapeHtml(p.preview_url)}" target="_blank" class="flex-1 py-2.5 rounded bg-panel hairline-border hover:border-gold/40 text-center text-white font-medium hover:text-gold transition-all min-h-[44px] flex items-center justify-center">
            Live Demo ↗
          </a>
          <button onclick="openModal(this)" class="px-3.5 py-2.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition-all cursor-pointer min-h-[44px] flex items-center justify-center">
            Specs
          </button>
          ${isTrack2 ? `
          <button onclick="openFlagshipModal(${p.id}, '${escapeHtml(p.name).replace(/'/g, "\\'")}', '${escapeHtml(p.sector).replace(/'/g, "\\'")}')" class="py-2.5 px-3.5 rounded bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500 hover:text-black border font-semibold transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap">
            Request Terms ➔
          </button>
          ` : `
          <a href="${escapeHtml(p.gumroad_url)}" target="_blank" class="py-2.5 px-3.5 rounded bg-gold/15 border-gold/40 text-gold hover:bg-gold hover:text-black border font-semibold transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap">
            $199 ➔
          </a>
          `}
        </div>
      </div>`;
}).join('\n');

// Compile standalone public showroom HTML
const showroomHtml = `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Aura & Grid — The Institutional Software Foundry for Modern Agencies</title>
  <meta name="description" content="A curated fleet of 136 deployable commercial web operating system blueprints (86 Track 1 Lean Prototypes + 50 Track 2 Flagships) engineered on React 19, Tailwind CSS, and Supabase PostgreSQL with active Row Level Security patterns.">
  <meta name="version" content="v1.8.0-institutional-pass">
  <meta name="telemetry:sync" content="GhostFactoryOS v1.8.0">
  <link rel="canonical" href="https://auraandgrid.com/">
  
  <!-- Preconnect & Web Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;800&family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Primary Pre-Compiled Standalone Stylesheet -->
  <link rel="stylesheet" href="assets/style.css?v=1.8.0">

  <!-- Progressive Fallback Tailwind CDN Engine -->
  <script src="https://cdn.tailwindcss.com"></script>
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
            sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            mono: ['"JetBrains Mono"', 'monospace']
          }
        }
      }
    };
  </script>

  <!-- Critical Inline CSS (Guarantees zero layout shift CLS < 0.1 & instantaneous styling even offline) -->
  <style>
    :root {
      --obsidian: #08090A;
      --panel: #101216;
      --card: #14161C;
      --border: #232630;
      --gold: #C5A880;
      --gold-hover: #b0936b;
      --emerald: #10B981;
      --cobalt: #3B82F6;
      --amber: #F59E0B;
    }
    * {
      box-sizing: border-box;
    }
    body {
      background-color: #08090A;
      color: #E5E7EB;
      font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
      min-height: 100vh;
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
      background: rgba(8, 9, 10, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
    }
    html {
      scroll-behavior: smooth;
    }
    section[id], .product-card[id] {
      scroll-margin-top: 8rem;
    }
    .card-glow:hover {
      box-shadow: 0 12px 40px -10px rgba(197, 168, 128, 0.15);
      border-color: rgba(197, 168, 128, 0.4);
    }
    button, a, input {
      min-height: 44px;
    }
    img {
      aspect-ratio: 16 / 9;
    }
  </style>
</head>
<body class="selection:bg-gold selection:text-black">

  <header class="fixed top-0 inset-x-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-6 py-3 transition-all duration-200">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">

      <!-- Brand & Live Fleet Telemetry -->
      <div class="flex items-center gap-3 shrink-0">
        <a href="#" class="flex items-center gap-2 text-white font-bold tracking-tight text-sm font-mono">
          <span class="w-6 h-6 rounded bg-amber-400/10 border border-amber-400/40 flex items-center justify-center text-amber-400 text-xs">A</span>
          <span>AURA &amp; GRID</span>
        </a>
        <span class="text-neutral-700">/</span>
        <span class="flex items-center gap-1.5 text-[10px] font-mono uppercase bg-neutral-900 text-amber-400 px-2 py-0.5 rounded border border-neutral-800">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          136 FLEET // GHOSTFACTORYOS V1.8.0
        </span>
      </div>

      <!-- Desktop Navigation Links -->
      <nav class="hidden md:flex items-center gap-6 text-xs font-mono uppercase tracking-wider text-neutral-400">
        <a href="#catalog" class="hover:text-white transition">Fleet Catalog</a>
        <a href="#ladder" class="hover:text-white transition">Offer Ladder</a>
        <a href="#architecture" class="hover:text-white transition">Architecture &amp; RLS</a>
        <a href="#legal" class="hover:text-white transition">Trust &amp; Legal</a>
      </nav>

      <!-- Right Institutional Action Button -->
      <div class="flex items-center gap-3 shrink-0">
        <a href="#catalog" class="rounded bg-white text-black text-xs font-mono font-semibold px-4 py-2 hover:bg-neutral-200 transition shadow-sm">
          EXPLORE FLEET &rarr;
        </a>
      </div>

    </div>
  </header>

  <!-- ================= HERO SECTION ================= -->
  <section id="hero" class="scroll-mt-32 pt-24 sm:pt-28 pb-20 lg:pt-28 lg:pb-28 px-6 border-b border-white/5 relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent pointer-events-none"></div>
    <div class="max-w-6xl mx-auto text-center relative z-10">
      
      <!-- Synced dynamic badge with GhostFactoryOS v1.7.0 -->
      <div class="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase tracking-widest mb-6">
        <span class="w-2 h-2 rounded-full bg-emerald animate-pulse"></span>
        <span>Catalog synchronized with GhostFactoryOS v1.8.0 // 136 Curated Digital Vehicles</span>
      </div>

      <h1 class="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] max-w-4xl mx-auto mb-6">
        Software Architecture for <br>
        <span class="gold-gradient-text italic font-normal">Next-Generation Studios.</span>
      </h1>

      <!-- Legal & FTC substantiated product truth claim -->
      <p class="text-xs sm:text-sm font-mono text-gold uppercase tracking-widest mb-4">
        Specialized web-app prototypes and deployable source templates for modern agencies.
      </p>

      <p class="text-lg sm:text-xl lg:text-2xl text-zinc-400 font-normal leading-relaxed max-w-2xl mx-auto mt-6 mb-10">
        Skip 6 to 8 weeks of custom developer payroll. Deploy turnkey single-tenant web operating system prototypes and templates for high-ticket clients with Supabase PostgreSQL schemas, active Row Level Security patterns, and zero recurring platform royalties.
      </p>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
        <a href="#catalog" class="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all flex items-center justify-center space-x-2">
          <span>Explore 136 Digital Vehicles</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
        </a>
        <a href="#pricing" class="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-panel hairline-border hover:border-gold/50 text-white font-medium text-sm transition-all flex items-center justify-center space-x-2">
          <span>Structured Offer Ladder (Dual-Track)</span>
          <span class="text-gold">↗</span>
        </a>
      </div>

      <!-- Live Telemetry Strip -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left font-mono">
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Fleet Inventory</div>
          <div class="text-xl font-bold text-white">136 Vehicles</div>
          <div class="text-[11px] text-emerald mt-1">● 86 Lean + 36 Flagships</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Architecture Stack</div>
          <div class="text-xl font-bold text-white">React 19 + TypeScript</div>
          <div class="text-[11px] text-neutral-400 mt-1">Modular Component Tree</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Database Engine</div>
          <div class="text-xl font-bold text-white">Supabase PostgreSQL</div>
          <div class="text-[11px] text-cobalt mt-1">Turnkey Schemas + Demo RLS</div>
        </div>
        <div class="p-4 rounded-lg bg-panel hairline-border">
          <div class="text-xs uppercase text-neutral-500 mb-1">Foundry Status</div>
          <div class="text-xl font-bold text-gold">GhostFactoryOS v1.8.0</div>
          <div class="text-[11px] text-neutral-400 mt-1">Audit 360 Institutional Pass</div>
        </div>
      </div>

    </div>
  </section>

  <!-- ================= STRUCTURED COMMERCIAL ACQUISITION LADDER (DUAL-TRACK) ================= -->
  <section id="pricing" class="scroll-mt-32 py-24 px-6 border-b border-white/5 relative">
    <div id="ladder" class="scroll-mt-32"></div>
    <div class="max-w-7xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Dual-Track Pricing Protocol</div>
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">Structured Commercial Acquisition Ladder</h2>
        <p class="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Engineered for digital agencies and technology operators. From single-seat source code blueprints to selective deep-tech flagship acquisitions. Strict 80% portfolio retention floor enforced at all times.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Track 1: Retail Source License -->
        <div class="rounded-xl bg-card hairline-border p-6 flex flex-col justify-between hover:border-emerald/40 transition-all card-glow">
          <div>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald/10 border border-emerald/30 text-emerald mb-4">
              Track 1 // Lean Rapid-Sale
            </div>
            <h3 class="text-xl font-semibold tracking-tight text-white mb-2">Single Source License</h3>
            <div class="text-3xl font-mono font-bold text-white mb-4">$199 <span class="text-xs font-sans font-normal text-neutral-400">/ blueprint</span></div>
            <p class="text-xs text-neutral-400 leading-relaxed mb-6">
              Turnkey single-tenant web operating system prototype. Full source code, responsive layout components, and PostgreSQL migrations for a single client project.
            </p>
            <ul class="space-y-2.5 text-xs text-neutral-300 font-mono mb-8 border-t border-white/5 pt-4">
              <li class="flex items-center space-x-2"><span class="text-emerald">✓</span> <span>Full React 19 + TypeScript source</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald">✓</span> <span>schema.sql &amp; seed.sql patterns</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald">✓</span> <span>1 client commercial deployment</span></li>
              <li class="flex items-center space-x-2"><span class="text-emerald">✓</span> <span>Instant digital fulfillment</span></li>
            </ul>
          </div>
          <a href="#catalog" onclick="filterByTrack('track1')" class="w-full py-3 rounded-lg bg-emerald/15 hover:bg-emerald text-emerald hover:text-black border border-emerald/40 font-bold text-center text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center">
            Browse Track 1 ($199) ➔
          </a>
        </div>

        <!-- Track 1: Commercial Team Seat -->
        <div class="rounded-xl bg-card border border-gold/40 p-6 flex flex-col justify-between hover:border-gold transition-all card-glow relative shadow-xl shadow-gold/5">
          <div class="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gold text-black text-[10px] font-mono font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-gold/10 border border-gold/30 text-gold mb-4">
              Track 1 // Agency Multi-Seat
            </div>
            <h3 class="text-xl font-semibold tracking-tight text-white mb-2">Commercial Team Seat</h3>
            <div class="text-3xl font-mono font-bold text-white mb-4">$599 <span class="text-xs font-sans font-normal text-neutral-400">/ team license</span></div>
            <p class="text-xs text-neutral-400 leading-relaxed mb-6">
              Empower your engineering agency. Deploy across multiple client accounts under your agency brand, bill $3,500–$5,000+ per custom rollout, and keep 100% of billables.
            </p>
            <ul class="space-y-2.5 text-xs text-neutral-300 font-mono mb-8 border-t border-white/5 pt-4">
              <li class="flex items-center space-x-2"><span class="text-gold">✓</span> <span>Unlimited client deployments</span></li>
              <li class="flex items-center space-x-2"><span class="text-gold">✓</span> <span>Full whitelabel reskinning rights</span></li>
              <li class="flex items-center space-x-2"><span class="text-gold">✓</span> <span>Zero recurring platform royalties</span></li>
              <li class="flex items-center space-x-2"><span class="text-gold">✓</span> <span>Agency developer team access</span></li>
            </ul>
          </div>
          <a href="https://auraandgrid.gumroad.com" target="_blank" class="w-full py-3 rounded-lg bg-gold hover:bg-[#b0936b] text-black font-bold text-center text-xs uppercase tracking-wider transition-all shadow-md shadow-gold/15 min-h-[44px] flex items-center justify-center">
            Acquire Team License ($599) ➔
          </a>
        </div>

        <!-- Managed Deployment & Fleet Access -->
        <div class="rounded-xl bg-card hairline-border p-6 flex flex-col justify-between hover:border-cobalt/40 transition-all card-glow">
          <div>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-cobalt/10 border border-cobalt/30 text-cobalt mb-4">
              Fleet &amp; Infrastructure
            </div>
            <h3 class="text-xl font-semibold tracking-tight text-white mb-2">Managed Fleet Access</h3>
            <div class="text-3xl font-mono font-bold text-white mb-4">Custom <span class="text-xs font-sans font-normal text-neutral-400">/ tailored scope</span></div>
            <p class="text-xs text-neutral-400 leading-relaxed mb-6">
              Turnkey multi-vehicle portfolios tailored to your vertical. Includes managed cloud staging, domain configuration, CI/CD pipeline automation, and developer onboarding.
            </p>
            <ul class="space-y-2.5 text-xs text-neutral-300 font-mono mb-8 border-t border-white/5 pt-4">
              <li class="flex items-center space-x-2"><span class="text-cobalt">✓</span> <span>Multi-vehicle portfolio bundles</span></li>
              <li class="flex items-center space-x-2"><span class="text-cobalt">✓</span> <span>Managed staging &amp; custom domains</span></li>
              <li class="flex items-center space-x-2"><span class="text-cobalt">✓</span> <span>Developer onboarding session</span></li>
              <li class="flex items-center space-x-2"><span class="text-cobalt">✓</span> <span>Priority technical advisory SLA</span></li>
            </ul>
          </div>
          <button onclick="openLegalModal('contact')" class="w-full py-3 rounded-lg bg-cobalt/15 hover:bg-cobalt text-cobalt hover:text-white border border-cobalt/40 font-bold text-center text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center cursor-pointer">
            Inquire for Fleet Access ➔
          </button>
        </div>

        <!-- Track 2: Flagship Tier-1 -->
        <div class="rounded-xl bg-card border border-amber-500/40 p-6 flex flex-col justify-between hover:border-amber-400 transition-all card-glow shadow-xl shadow-amber-500/5">
          <div>
            <div class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 mb-4">
              Track 2 // Selective Tier-1
            </div>
            <h3 class="text-xl font-semibold tracking-tight text-white mb-2">Flagship Deep-Tech</h3>
            <div class="text-3xl font-mono font-bold text-amber-300 mb-4">$14,500 <span class="text-xs font-sans font-normal text-neutral-400">buyout anchor</span></div>
            <p class="text-xs text-neutral-400 leading-relaxed mb-6">
              Elite SCADA, deep-tech &amp; mission-critical concept prototypes (Subsea Mining Crawler, Drone Swarm AEGIS, Geothermal EGS, Orbital ECLSS, Tokamak Fusion).
            </p>
            <ul class="space-y-2.5 text-xs text-neutral-300 font-mono mb-8 border-t border-white/5 pt-4">
              <li class="flex items-center space-x-2"><span class="text-amber-400">✓</span> <span>Commercial License: $1,500–$3,500</span></li>
              <li class="flex items-center space-x-2"><span class="text-amber-400">✓</span> <span>Exclusive Buyout: $10,000–$18,000</span></li>
              <li class="flex items-center space-x-2"><span class="text-amber-400">✓</span> <span>8–15 interactive operator panels</span></li>
              <li class="flex items-center space-x-2"><span class="text-amber-400">✓</span> <span>NIST SSDF &amp; SBOM compliance pack</span></li>
              <li class="flex items-center space-x-2"><span class="text-amber-400">✓</span> <span>Max 23 Micro-APAs across portfolio</span></li>
            </ul>
          </div>
          <button onclick="openFlagshipModal(null, null, null)" class="w-full py-3 rounded-lg bg-amber-500/15 hover:bg-amber-500 text-amber-300 hover:text-black border border-amber-500/40 font-bold text-center text-xs uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center cursor-pointer">
            Request Flagship Terms ➔
          </button>
        </div>

      </div>
    </div>
  </section>

  <!-- ================= PUBLIC FLEET CATALOG (136 DIGITAL VEHICLES) ================= -->
  <section id="catalog" class="scroll-mt-32 py-24 px-6 max-w-7xl mx-auto">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Curated Fleet Catalog</div>
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white">The Verified Fleet Index (136 Vehicles)</h2>
        <p class="text-neutral-400 text-sm mt-2">Filter and inspect 136 deployable commercial web operating system prototypes across specialized industry sectors: 86 Track 1 Lean Prototypes and 50 Track 2 Flagships.</p>
      </div>

      <!-- Search Input -->
      <div class="w-full md:w-80">
        <input type="text" id="searchInput" placeholder="Search 136 blueprints by niche, title, or stack..." class="w-full bg-card hairline-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-gold">
      </div>
    </div>

    <!-- Sector & Track Filter Pills -->
    <div class="flex flex-wrap gap-2 mb-10 text-xs font-medium" id="filterContainer">
      <button class="filter-btn active px-4 py-2 rounded-full bg-gold text-black font-semibold transition-all min-h-[44px] flex items-center" data-filter="all">All Vehicles (136)</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-amber-300 hover:text-amber-200 border-amber-500/30 transition-all min-h-[44px] flex items-center" data-filter="track2">Track 2 Flagships (36)</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-emerald hover:text-white border-emerald/30 transition-all min-h-[44px] flex items-center" data-filter="track1">Track 1 Lean Prototypes (86)</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Hospitality & Dining">Hospitality &amp; Dining</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Legal, Wealth & Advisory">Legal, Wealth &amp; Advisory</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Clinical & Aesthetics">Clinical &amp; Aesthetics</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Automotive & Mobility">Automotive &amp; Mobility</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Creative & Media Studios">Creative &amp; Studios</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Trades & Operations">Trades &amp; Operations</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Performance & Athletics">Performance &amp; Athletics</button>
      <button class="filter-btn px-4 py-2 rounded-full bg-card hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px] flex items-center" data-filter="Deep Tech & SCADA">Deep Tech &amp; SCADA</button>
    </div>

    <!-- Catalog Cards Grid (Pre-rendered 136 Blueprints) -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="productsGrid">
${renderedCardsHtml}
    </div>

    <!-- Showroom Pagination & Fleet Navigation (24 Blueprints / Page) -->
    <div id="paginationContainer" class="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs border-t border-white/5 pt-8">
      <div id="paginationInfo" class="text-neutral-400 text-center md:text-left">
        Showing <span id="pageRangeStart" class="text-white font-bold">1</span>–<span id="pageRangeEnd" class="text-white font-bold">24</span> of <span id="pageTotalCount" class="text-gold font-bold">136</span> Catalog Blueprints
      </div>
      <div class="flex items-center gap-2">
        <button id="prevPageBtn" class="px-3.5 py-2 rounded-lg bg-card hairline-border text-neutral-300 hover:text-white hover:border-gold/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold min-h-[44px] flex items-center">
          ‹ Previous
        </button>
        <div id="paginationPages" class="flex items-center gap-1.5 flex-wrap justify-center">
          <!-- Dynamically populated page buttons -->
        </div>
        <button id="nextPageBtn" class="px-3.5 py-2 rounded-lg bg-card hairline-border text-neutral-300 hover:text-white hover:border-gold/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all font-semibold min-h-[44px] flex items-center">
          Next ›
        </button>
      </div>
      <div>
        <button id="viewAllToggle" class="px-4 py-2 rounded-lg bg-card hairline-border text-neutral-400 hover:text-gold hover:border-gold/40 transition-all min-h-[44px] flex items-center">
          Show All (136)
        </button>
      </div>
    </div>

    <div id="noResults" class="hidden text-center py-20">
      <p class="text-neutral-500 font-mono text-sm">No systems match your filter criteria.</p>
    </div>
  </section>

  <!-- ================= TECHNICAL ARCHITECTURE SECTION ================= -->
  <section id="architecture" class="scroll-mt-32 py-24 px-6 border-t border-white/5 bg-panel/30">
    <div class="max-w-6xl mx-auto">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Technical Diligence</div>
        <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-4">Engineered for Technical Directors</h2>
        <p class="text-neutral-400 text-sm sm:text-base leading-relaxed">
          Every blueprint is authored as a single-tenant, full-stack application. Clean code, zero vendor lock-in, and strict security patterns ensure simple client handover.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-mono font-bold mb-6">01</div>
          <h3 class="text-lg font-bold text-white mb-2">React 19 + Tailwind Architecture</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Standardized component tree built on modern React with strict TypeScript interfaces, responsive viewports from mobile to 4K. Accessibility: Designed toward WCAG 2.2 AA (Formal evaluation pending).
          </p>
        </div>

        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-emerald/10 border border-emerald/30 flex items-center justify-center text-emerald font-mono font-bold mb-6">02</div>
          <h3 class="text-lg font-bold text-white mb-2">Supabase PostgreSQL + RLS Patterns</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Pre-packaged with schema.sql and seed.sql migrations. Security: Supabase schema and RLS policy patterns included. Customer-specific configuration and deployment review required.
          </p>
        </div>

        <div class="p-8 rounded-xl bg-card hairline-border">
          <div class="w-10 h-10 rounded bg-cobalt/10 border border-cobalt/30 flex items-center justify-center text-cobalt font-mono font-bold mb-6">03</div>
          <h3 class="text-lg font-bold text-white mb-2">Asset Maturity &amp; Zero Lock-In</h3>
          <p class="text-sm text-neutral-400 leading-relaxed">
            Asset Maturity: Hosted Interactive Demos &amp; Source Templates (Sample/Simulated Data). Deploy on your client's own cloud accounts: Vercel, Supabase, Cloudflare, Netlify, or Render. You own the code; zero ongoing hosting debt is owed to Aura &amp; Grid.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- ================= COMMERCIAL WHITELABEL & MICRO-APA TERMS ================= -->
  <section id="licensing" class="scroll-mt-32 py-24 px-6 border-t border-white/5">
    <div class="max-w-5xl mx-auto">
      <div class="text-xs font-mono uppercase tracking-widest text-gold mb-2">Commercial Terms &amp; Governance</div>
      <h2 class="text-3xl sm:text-4xl font-semibold tracking-tight text-white mb-8">Whitelabel Agency License vs. Micro-APA Buyout</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm mb-12">
        <div class="p-6 rounded-xl bg-card hairline-border space-y-4">
          <h3 class="text-base font-bold text-emerald flex items-center space-x-2">
            <span>✓ Permitted Commercial Use</span>
          </h3>
          <ul class="space-y-3 text-neutral-300">
            <li class="flex items-start space-x-2">
              <span class="text-emerald font-bold">•</span>
              <span>Deploy custom client projects under your agency's brand and domain.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald font-bold">•</span>
              <span>Charge clients implementation fees ($3,500–$5,000+) and recurring maintenance retainers.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald font-bold">•</span>
              <span>Modify, reskin, rebrand, and extend the source code without restriction.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-emerald font-bold">•</span>
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
              <span class="text-red-400 font-bold">•</span>
              <span>Reselling the raw source code or SQL migrations on public template marketplaces.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 font-bold">•</span>
              <span>Distributing digital vehicle source archives to competing template dealerships.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 font-bold">•</span>
              <span>Claiming foundational copyright to underlying GhostFactoryOS design tokens or architectures.</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 font-bold">•</span>
              <span>Treating a non-exclusive license as an ownership transfer of GhostFactoryOS or Aura &amp; Grid brands.</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Micro-APA Retention Floor Notice -->
      <div class="p-6 rounded-xl bg-panel hairline-border border-gold/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div class="text-xs font-mono uppercase tracking-widest text-gold mb-1">Portfolio Governance Standard</div>
          <h4 class="text-base font-serif font-bold text-white mb-1">Strict 80% Retained Fleet Floor Lock</h4>
          <p class="text-xs text-neutral-400 leading-relaxed">
            Aura &amp; Grid maintains an institutional retention floor: a minimum of 80% of all cataloged digital vehicles (currently 109 of 136) are permanently vaulted and retained. Maximum micro-APA buyout capacity across the fleet is strictly capped at 27 vehicles. Every micro-APA transfers defined rights/code to one specific asset and permanently excludes GhostFactoryOS core infrastructure and shared IP.
          </p>
        </div>
        <button onclick="openLegalModal('license')" class="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider shrink-0 transition-all border border-white/10 min-h-[44px]">
          Read Legal Terms ➔
        </button>
      </div>

    </div>
  </section>

  <!-- ================= TRUST & LEGAL FOOTER ================= -->
  <footer id="legal" class="py-16 px-6 border-t border-white/5 text-xs text-neutral-400 font-mono bg-panel/40">
    <div class="max-w-7xl mx-auto">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <!-- Brand Summary -->
        <div class="md:col-span-1 space-y-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 rounded border border-gold/40 flex items-center justify-center font-cinzel font-bold text-gold text-xs">
              A
            </div>
            <span class="font-cinzel text-white font-bold tracking-wider text-sm">AURA &amp; GRID</span>
          </div>
          <p class="text-neutral-400 text-xs leading-relaxed">
            The Institutional Software Foundry for Modern Agencies. Specialized web-app prototypes and deployable source templates.
          </p>
          <div class="pt-2 text-[11px] text-neutral-500">
            An asset holding of ZoMae Media LLC.<br>
            Synchronized with GhostFactoryOS v1.8.0.
          </div>
        </div>

        <!-- Fleet Navigation -->
        <div>
          <div class="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">Fleet Navigation</div>
          <ul class="space-y-2 text-xs">
            <li><a href="#catalog" class="hover:text-gold transition-colors">Catalog (136 Vehicles)</a></li>
            <li><a href="#catalog" onclick="filterByTrack('track2')" class="hover:text-gold transition-colors">Track 2 Flagships (50)</a></li>
            <li><a href="#catalog" onclick="filterByTrack('track1')" class="hover:text-gold transition-colors">Track 1 Lean Prototypes (86)</a></li>
            <li><a href="#architecture" class="hover:text-gold transition-colors">Technical Diligence &amp; RLS</a></li>
          </ul>
        </div>

        <!-- Acquisition Ladder -->
        <div>
          <div class="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">Acquisition Ladder</div>
          <ul class="space-y-2 text-xs">
            <li><a href="#pricing" class="hover:text-gold transition-colors">Single Source License ($199)</a></li>
            <li><a href="#pricing" class="hover:text-gold transition-colors">Commercial Team Seat ($599)</a></li>
            <li><button onclick="openLegalModal('contact')" class="hover:text-gold transition-colors text-left cursor-pointer">Managed Fleet Access (Inquiry)</button></li>
            <li><button onclick="openFlagshipModal(null, null, null)" class="hover:text-gold transition-colors text-left cursor-pointer">Request Flagship Terms ($14,500)</button></li>
          </ul>
        </div>

        <!-- Legal & Compliance Links (Working Anchors/Modals) -->
        <div>
          <div class="text-white font-bold uppercase tracking-wider mb-3 text-[11px]">Trust &amp; Legal Governance</div>
          <ul class="space-y-2 text-xs">
            <li><button onclick="openLegalModal('license')" class="hover:text-gold transition-colors text-left cursor-pointer">Commercial License Agreement</button></li>
            <li><button onclick="openLegalModal('product-truth')" class="hover:text-gold transition-colors text-left cursor-pointer">Product Truth &amp; Disclosures</button></li>
            <li><button onclick="openLegalModal('privacy')" class="hover:text-gold transition-colors text-left cursor-pointer">Privacy Policy &amp; Data Handling</button></li>
            <li><button onclick="openLegalModal('refunds')" class="hover:text-gold transition-colors text-left cursor-pointer">Refund &amp; Support Policy</button></li>
            <li><button onclick="openLegalModal('contact')" class="hover:text-gold transition-colors text-left cursor-pointer">Operator &amp; Business Contact</button></li>
          </ul>
        </div>
      </div>

      <!-- Trust Badges & FTC Disclosures -->
      <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
        <div>
          © 2026 ZoMae Media LLC. All digital vehicles are interactive concept prototypes and deployable source templates using sample/simulated data. Not certified for live clinical, legal, life-critical, or financial operations without customer configuration.
        </div>
        <div class="flex items-center space-x-4 shrink-0">
          <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">NIST SP 800-218 Aligned</span>
          <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">WCAG 2.2 AA Target</span>
          <span class="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-400">GhostFactoryOS v1.8.0</span>
        </div>
      </div>

    </div>
  </footer>

  <!-- ================= SPEC DRAWER MODAL ================= -->
  <div id="specModal" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm hidden flex items-center justify-center p-4">
    <div class="bg-card hairline-border rounded-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
      <button onclick="closeModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-mono p-2 cursor-pointer">✕</button>
      <div class="text-xs font-mono uppercase tracking-widest text-gold mb-1" id="modalSector">Sector</div>
      <h3 class="text-2xl font-serif font-bold text-white mb-2" id="modalTitle">Product Title</h3>
      <p class="text-sm text-neutral-400 mb-6" id="modalCategory">Product Category</p>
      
      <div class="space-y-3 text-xs font-mono mb-6 bg-obsidian p-4 rounded-lg hairline-border">
        <div class="flex justify-between"><span class="text-neutral-500">Pricing Track:</span> <span class="text-gold font-bold" id="modalTrack">Track 1</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Design Benchmark:</span> <span class="text-white" id="modalBenchmark">Benchmark</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">UI Archetype:</span> <span class="text-white" id="modalArchetype">Archetype</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Best For:</span> <span class="text-gold font-medium text-right ml-2" id="modalBestFor">Target</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Database Engine:</span> <span class="text-emerald">Supabase PostgreSQL + RLS</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Relational Tables:</span> <span class="text-gold" id="modalTables">Tables</span></div>
      </div>

      <!-- Regulatory & Truth Disclaimer Box -->
      <div class="p-3.5 bg-amber-950/40 border border-amber-500/40 rounded-lg text-amber-200 text-xs font-mono mb-6 leading-relaxed flex items-start space-x-2">
        <span class="text-amber-400 font-bold shrink-0">⚠</span>
        <div id="modalDisclaimer" class="leading-normal">SIMULATED DATA PROTOTYPE — FOR CONCEPT DEMO ONLY — NOT PRODUCTION OR ADVICE.</div>
      </div>

      <div class="flex gap-3">
        <a href="#" id="modalLiveDemo" target="_blank" class="flex-1 py-3 rounded-lg bg-panel hairline-border hover:border-gold/50 text-white font-medium text-xs text-center uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center">Launch Live Demo ↗</a>
        <a href="#" id="modalGumroad" target="_blank" class="flex-1 py-3 rounded-lg bg-gold hover:bg-[#b0936b] text-black font-bold text-xs text-center uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center">License Blueprint ($199) ➔</a>
      </div>
    </div>
  </div>

  <!-- ================= TRUST & LEGAL COMPLIANCE MODAL (TABBED) ================= -->
  <div id="legalModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl relative flex flex-col">
      <button onclick="closeLegalModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-mono p-2 cursor-pointer">✕</button>
      
      <div class="text-xs sm:text-sm font-mono uppercase tracking-widest text-gold mb-2">Institutional Compliance &amp; Governance</div>
      <h3 class="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-6">Trust, Terms &amp; Legal Disclosures</h3>

      <!-- Tab Buttons -->
      <div class="flex flex-wrap gap-2 mb-6 border-b border-white/10 pb-4">
        <button onclick="switchLegalTab('license')" id="tabBtn-license" class="text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-gold text-black font-bold transition-all min-h-[44px]">License Agreement</button>
        <button onclick="switchLegalTab('product-truth')" id="tabBtn-product-truth" class="text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-panel hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px]">Product Truth</button>
        <button onclick="switchLegalTab('privacy')" id="tabBtn-privacy" class="text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-panel hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px]">Privacy Policy</button>
        <button onclick="switchLegalTab('refunds')" id="tabBtn-refunds" class="text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-panel hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px]">Refund &amp; Support</button>
        <button onclick="switchLegalTab('contact')" id="tabBtn-contact" class="text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-panel hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px]">Contact &amp; Operator</button>
      </div>

      <!-- Tab Content: License Agreement -->
      <div id="tabContent-license" class="space-y-4 text-base text-neutral-200 leading-relaxed font-sans">
        <h4 class="text-xl font-bold text-white mb-3">Commercial Source Code License vs. Micro-APA Asset Purchase</h4>
        <p class="text-base text-neutral-200 leading-relaxed mb-4">
          Aura &amp; Grid offers non-exclusive source-code licenses for deployable web operating system blueprints. Purchasing a Track 1 Source License ($199) or Commercial Team Seat ($599) grants your organization perpetual, royalty-free commercial rights to adapt, reskin, modify, and deploy the code for client projects.
        </p>
        <div class="p-4 sm:p-6 bg-black/40 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed space-y-2">
          <div class="text-gold font-bold uppercase tracking-wider text-sm sm:text-base mb-2">License vs. Ownership APA Distinction:</div>
          <p>• <strong>License:</strong> Grants usage and client deployment rights. Does NOT transfer copyright or ownership of the underlying framework templates.</p>
          <p>• <strong>Micro-APA (Asset Purchase Agreement):</strong> A selective agreement transferring exclusive code rights to one defined asset only. A micro-APA NEVER transfers GhostFactoryOS core infrastructure, Aura &amp; Grid showroom brands, shared design tokens, component libraries, or future catalog rights.</p>
          <p>• <strong>80% Retention Floor:</strong> ZoMae Media LLC permanently vaults and retains at least 80% of all digital vehicles in the catalog (minimum 109 of 136 assets retained). Maximum micro-APA transfer capacity across the entire collection is capped at 27 assets.</p>
        </div>
        <p class="text-base text-neutral-300 leading-relaxed mt-4">
          <strong>Prohibited:</strong> Redistribution, reselling, or public dissemination of raw source code, SQL migrations, or zip archives on third-party template marketplaces or public repositories.
        </p>
      </div>

      <!-- Tab Content: Product Truth -->
      <div id="tabContent-product-truth" class="hidden space-y-4 text-base text-neutral-200 leading-relaxed font-sans">
        <h4 class="text-xl font-bold text-white mb-3">Product Truth &amp; Non-Production Disclosures</h4>
        <p class="text-base text-neutral-200 leading-relaxed mb-4">
          In accordance with FTC guidelines and truth-in-advertising standards, Aura &amp; Grid adheres to strict descriptive disclosures:
        </p>
        <div class="text-base text-neutral-300 leading-relaxed space-y-2">
          <div class="p-4 bg-amber-950/30 border border-amber-500/30 rounded-xl text-base text-amber-200 leading-relaxed">
            <strong>Asset Maturity Disclosure:</strong> Hosted Interactive Demos &amp; Source Templates (Sample/Simulated Data). All demonstrations, telemetry values, charts, alerts, and calculations utilize sample or simulated data models.
          </div>
          <div class="p-4 bg-black/40 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed">
            <strong>Accessibility Status:</strong> Designed toward WCAG 2.2 AA (Formal evaluation pending). Layouts, contrast ratios, and touch targets follow accessibility best practices, but have not completed external certification.
          </div>
          <div class="p-4 bg-black/40 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed">
            <strong>Security Architecture:</strong> Supabase schema and RLS policy patterns included. Customer-specific configuration and deployment review required prior to production exposure.
          </div>
          <div class="p-4 bg-black/40 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed">
            <strong>Non-Production Notice:</strong> None of our prototypes or blueprints are pre-certified for live operational, medical, clinical, flight-qualified, legal, or life-critical environments. Customer-specific implementation, security hardening, and auditing are required.
          </div>
        </div>
      </div>

      <!-- Tab Content: Privacy Policy -->
      <div id="tabContent-privacy" class="hidden space-y-4 text-base text-neutral-200 leading-relaxed font-sans">
        <h4 class="text-xl font-bold text-white mb-3">Privacy Policy &amp; Data Handling</h4>
        <p class="text-base text-neutral-200 leading-relaxed mb-4">
          Aura &amp; Grid and ZoMae Media LLC respect your privacy with minimal data footprint principles:
        </p>
        <ul class="text-base text-neutral-300 leading-relaxed space-y-2">
          <li>• <strong>Zero Third-Party Tracking:</strong> We do not deploy invasive tracking pixels, session replay software, or third-party behavioral advertising scripts.</li>
          <li>• <strong>Payment Processing:</strong> Commercial transactions are fulfilled securely via Gumroad and its authorized payment gateways (Stripe, PayPal). No credit card numbers or banking secrets are ever stored on our servers.</li>
          <li>• <strong>Customer Inquiries:</strong> Any email addresses or contact details submitted for Flagship inquiries are used exclusively for direct commercial communication and are never sold or rented.</li>
        </ul>
      </div>

      <!-- Tab Content: Refund & Support Policy -->
      <div id="tabContent-refunds" class="hidden space-y-4 text-base text-neutral-200 leading-relaxed font-sans">
        <h4 class="text-xl font-bold text-white mb-3">Refund &amp; Support Policy (Source Code Disclosures)</h4>
        <p class="text-base text-neutral-200 leading-relaxed mb-4">
          Due to the digital, irrevocable nature of downloadable source code, TypeScript implementations, and database schema files, <strong>All sales are final and strictly non-refundable.</strong>
        </p>
        <div class="p-4 sm:p-6 bg-black/40 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed space-y-2">
          <p>• <strong>All Sales Final:</strong> Transactions are non-refundable once access or files are delivered.</p>
          <p>• <strong>Inspection Opportunity:</strong> Interactive hosted demos serve as pre-purchase test drives.</p>
          <p>• <strong>Defect Remediation:</strong> If you identify a verifiable code defect or missing migration file, our technical support desk will provide a verified patch or updated archive within 14 days (no cash refunds).</p>
          <p>• <strong>Scope of Support:</strong> Source and docs provided; custom integrations and hosting remain customer responsibilities.</p>
        </div>
      </div>

      <!-- Tab Content: Operator & Contact -->
      <div id="tabContent-contact" class="hidden space-y-4 text-base text-neutral-200 leading-relaxed font-sans">
        <h4 class="text-xl font-bold text-white mb-3">Operator &amp; Business Contact Information</h4>
        <p class="text-base text-neutral-200 leading-relaxed mb-4">
          Aura &amp; Grid operates as an independent software foundry delivering deployable web operating system blueprints.
        </p>
        <div class="bg-obsidian p-5 rounded-xl hairline-border text-base text-neutral-300 leading-relaxed space-y-2">
          <div><span class="text-neutral-400 font-medium">Operator Entity:</span> <span class="text-white font-bold">Aura &amp; Grid (Independent Software Foundry)</span></div>
          <div><span class="text-neutral-400 font-medium">Direct Support &amp; Licensing Desk:</span> <a href="mailto:inquiries@zomaemedia.com" class="text-emerald hover:underline font-bold">inquiries@zomaemedia.com</a></div>
          <div><span class="text-neutral-400 font-medium">Business Inquiries:</span> <span class="text-neutral-200">Contact form or direct email desk for licensing, managed deployments, and custom fleet terms.</span></div>
          <div><span class="text-neutral-400 font-medium">Response Standard:</span> <span class="text-neutral-300">Inquiries reviewed within 24–48 business hours.</span></div>
        </div>
      </div>

      <div class="mt-8 pt-4 border-t border-white/10 flex justify-end">
        <button onclick="closeLegalModal()" class="px-6 py-2.5 rounded-lg bg-white text-black font-semibold text-sm uppercase tracking-wider transition-all hover:bg-neutral-200 min-h-[44px]">
          Close Window
        </button>
      </div>
    </div>
  </div>

  <!-- ================= FLAGSHIP INQUIRY MODAL (TRACK 2) ================= -->
  <div id="flagshipModal" class="fixed inset-0 z-50 bg-black/85 backdrop-blur-md hidden flex items-center justify-center p-4">
    <div class="bg-card hairline-border rounded-xl max-w-xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto">
      <button onclick="closeFlagshipModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-white text-lg font-mono p-2 cursor-pointer">✕</button>
      
      <div class="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 border border-amber-500/40 text-amber-300 mb-3">
        Track 2 // Flagship Acquisition Gate
      </div>
      <h3 class="text-2xl font-serif font-bold text-white mb-2" id="flagshipModalTitle">Request Flagship Terms</h3>
      <p class="text-xs text-neutral-400 mb-6 font-mono" id="flagshipModalSector">Deep Tech &amp; SCADA Prototype Fleet</p>

      <div class="space-y-3 text-xs font-mono mb-6 bg-obsidian p-4 rounded-lg hairline-border">
        <div class="flex justify-between"><span class="text-neutral-500">Commercial Flagship License:</span> <span class="text-amber-300 font-bold">$1,500 – $3,500 USD</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Entry Buyout Anchor:</span> <span class="text-amber-400 font-bold">$14,500 USD</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Exclusive Buyout Range:</span> <span class="text-amber-200/90">$10,000 – $18,000 USD</span></div>
        <div class="flex justify-between"><span class="text-neutral-500">Full Strategic Buyout:</span> <span class="text-white">$18,000 – $35,000+ USD</span></div>
        <div class="flex justify-between border-t border-white/5 pt-2"><span class="text-neutral-500">Governance Lock:</span> <span class="text-emerald">Max 23 Micro-APAs (80% Floor)</span></div>
      </div>

      <div class="p-3.5 bg-black/40 rounded-lg hairline-border text-xs text-neutral-300 space-y-2 mb-6 font-mono">
        <div class="text-gold font-bold uppercase tracking-wider">What Flagship Terms Include:</div>
        <p>• Complete source code repository with 8–15 polished interactive operator panels.</p>
        <p>• Domain physics solvers, operational logic, and Supabase PostgreSQL schema with demo RLS.</p>
        <p>• NIST SP 800-218 SSDF v1.1 compliance alignment document &amp; Software Bill of Materials (SBOM).</p>
        <p>• 1-on-1 architecture walkthrough and technical handover session with our lead engineer.</p>
      </div>

      <div class="flex flex-col sm:flex-row gap-3">
        <a href="mailto:advisory@auraandgrid.com?subject=Flagship%20Terms%20Inquiry%20-%20Aura%20%26%20Grid" id="flagshipMailtoBtn" class="flex-1 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs text-center uppercase tracking-wider transition-all min-h-[44px] flex items-center justify-center">
          Email Advisory Desk ➔
        </a>
        <button onclick="navigator.clipboard.writeText('advisory@auraandgrid.com'); alert('Advisory email copied to clipboard: advisory@auraandgrid.com');" class="py-3 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all min-h-[44px]">
          Copy Email
        </button>
      </div>
    </div>
  </div>

  <!-- ================= CLIENT SCRIPT ================= -->
  <script>
    const PAGE_SIZE = 24;
    let currentPage = 1;
    let viewAll = false;
    let activeFilter = 'all';
    let searchQuery = '';

    const noResults = document.getElementById('noResults');
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationPages = document.getElementById('paginationPages');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const viewAllToggle = document.getElementById('viewAllToggle');
    const pageRangeStart = document.getElementById('pageRangeStart');
    const pageRangeEnd = document.getElementById('pageRangeEnd');
    const pageTotalCount = document.getElementById('pageTotalCount');

    function filterCards() {
      const cards = Array.from(document.querySelectorAll('#productsGrid .product-card'));
      
      const matchingCards = cards.filter(card => {
        const sector = card.getAttribute('data-sector') || '';
        const track = card.getAttribute('data-track') || '';
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const cat = (card.getAttribute('data-category') || '').toLowerCase();
        const tables = (card.getAttribute('data-tables') || '').toLowerCase();
        
        let matchesFilter = false;
        if (activeFilter === 'all') {
          matchesFilter = true;
        } else if (activeFilter === 'track1') {
          matchesFilter = (track === 'track1');
        } else if (activeFilter === 'track2') {
          matchesFilter = (track === 'track2');
        } else {
          matchesFilter = (sector === activeFilter);
        }

        const matchesSearch = (!searchQuery || name.includes(searchQuery) || cat.includes(searchQuery) || sector.toLowerCase().includes(searchQuery) || tables.includes(searchQuery));
        return matchesFilter && matchesSearch;
      });

      const totalMatches = matchingCards.length;

      if (totalMatches === 0) {
        cards.forEach(c => c.classList.add('hidden'));
        noResults.classList.remove('hidden');
        if (paginationContainer) paginationContainer.classList.add('hidden');
        return;
      }

      noResults.classList.add('hidden');
      if (paginationContainer) paginationContainer.classList.remove('hidden');

      const totalPages = Math.ceil(totalMatches / PAGE_SIZE);
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      // Hide all cards first
      cards.forEach(card => card.classList.add('hidden'));

      if (viewAll) {
        matchingCards.forEach(card => card.classList.remove('hidden'));
        if (pageRangeStart) pageRangeStart.innerText = '1';
        if (pageRangeEnd) pageRangeEnd.innerText = totalMatches.toString();
        if (pageTotalCount) pageTotalCount.innerText = totalMatches.toString();
        if (paginationPages) paginationPages.innerHTML = '';
        if (prevPageBtn) prevPageBtn.disabled = true;
        if (nextPageBtn) nextPageBtn.disabled = true;
        if (viewAllToggle) viewAllToggle.innerText = 'Paginate (24/pg)';
      } else {
        const startIdx = (currentPage - 1) * PAGE_SIZE;
        const endIdx = Math.min(startIdx + PAGE_SIZE, totalMatches);
        
        for (let i = startIdx; i < endIdx; i++) {
          matchingCards[i].classList.remove('hidden');
        }

        if (pageRangeStart) pageRangeStart.innerText = (startIdx + 1).toString();
        if (pageRangeEnd) pageRangeEnd.innerText = endIdx.toString();
        if (pageTotalCount) pageTotalCount.innerText = totalMatches.toString();

        if (prevPageBtn) prevPageBtn.disabled = (currentPage === 1);
        if (nextPageBtn) nextPageBtn.disabled = (currentPage === totalPages);
        if (viewAllToggle) viewAllToggle.innerText = 'Show All (' + totalMatches + ')';

        renderPaginationControls(totalPages);
      }
    }

    function renderPaginationControls(totalPages) {
      if (!paginationPages) return;
      paginationPages.innerHTML = '';
      if (totalPages <= 1) return;

      for (let p = 1; p <= totalPages; p++) {
        const btn = document.createElement('button');
        btn.innerText = p.toString();
        btn.className = 'w-9 h-9 rounded text-xs font-mono font-bold transition-all flex items-center justify-center ' + (
          p === currentPage
            ? 'bg-gold text-black shadow-md'
            : 'bg-card hairline-border text-neutral-400 hover:text-white hover:border-gold/40'
        );
        btn.addEventListener('click', () => {
          currentPage = p;
          filterCards();
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        });
        paginationPages.appendChild(btn);
      }
    }

    function filterByTrack(track) {
      activeFilter = track;
      document.querySelectorAll('.filter-btn').forEach(b => {
        const f = b.getAttribute('data-filter');
        if (f === track) {
          b.classList.remove('bg-card', 'text-neutral-300');
          b.classList.add('bg-gold', 'text-black', 'font-semibold');
        } else {
          b.classList.remove('bg-gold', 'text-black', 'font-semibold');
          b.classList.add('bg-card', 'text-neutral-300');
        }
      });
      currentPage = 1;
      filterCards();
    }

    if (prevPageBtn) {
      prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          filterCards();
          const catEl = document.getElementById('catalog');
          if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    if (nextPageBtn) {
      nextPageBtn.addEventListener('click', () => {
        currentPage++;
        filterCards();
        const catEl = document.getElementById('catalog');
        if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (viewAllToggle) {
      viewAllToggle.addEventListener('click', () => {
        viewAll = !viewAll;
        filterCards();
      });
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
        activeFilter = btn.getAttribute('data-filter');
        currentPage = 1;
        filterCards();
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        currentPage = 1;
        filterCards();
      });
    }

    // Spec Modal Helpers
    function openModal(btn) {
      const card = btn.closest('.product-card');
      if (!card) return;
      const isTrack2 = card.getAttribute('data-track') === 'track2';
      const pName = card.getAttribute('data-name') || '';
      const pSector = card.getAttribute('data-sector') || '';
      const pId = card.getAttribute('data-id') || '';

      document.getElementById('modalSector').innerText = pSector;
      document.getElementById('modalTitle').innerText = pName;
      document.getElementById('modalCategory').innerText = card.getAttribute('data-category') || '';
      document.getElementById('modalTrack').innerText = isTrack2 ? 'Track 2 — Flagship Tier-1' : 'Track 1 — Lean Rapid-Sale';
      document.getElementById('modalBenchmark').innerText = card.getAttribute('data-benchmark') || '';
      document.getElementById('modalArchetype').innerText = card.getAttribute('data-archetype') || '';
      document.getElementById('modalBestFor').innerText = card.getAttribute('data-bestfor') ? card.getAttribute('data-bestfor').replace(/^Best for:\s*/i, '') : 'Commercial agency client adaptation';
      document.getElementById('modalTables').innerText = card.getAttribute('data-tables') || '';
      
      const discEl = card.querySelector('details div');
      document.getElementById('modalDisclaimer').innerText = discEl ? discEl.innerText.trim() : 'SIMULATED DATA PROTOTYPE — FOR CONCEPT DEMO ONLY — NOT PRODUCTION OR ADVICE.';
      document.getElementById('modalLiveDemo').href = card.getAttribute('data-preview') || '#';
      
      const gumroadBtn = document.getElementById('modalGumroad');
      if (isTrack2) {
        gumroadBtn.innerText = 'Request Flagship Terms ➔';
        gumroadBtn.removeAttribute('target');
        gumroadBtn.href = '#';
        gumroadBtn.onclick = (e) => {
          e.preventDefault();
          closeModal();
          openFlagshipModal(pId, pName, pSector);
        };
      } else {
        gumroadBtn.innerText = 'License Blueprint ($199) ➔';
        gumroadBtn.setAttribute('target', '_blank');
        gumroadBtn.href = card.getAttribute('data-checkout') || 'https://auraandgrid.gumroad.com';
        gumroadBtn.onclick = null;
      }
      
      document.getElementById('specModal').classList.remove('hidden');
    }

    function closeModal() {
      const el = document.getElementById('specModal');
      if (el) el.classList.add('hidden');
    }

    // Legal Modal Helpers
    function openLegalModal(tab) {
      const modal = document.getElementById('legalModal');
      if (!modal) return;
      modal.classList.remove('hidden');
      if (tab) switchLegalTab(tab);
    }

    function closeLegalModal() {
      const modal = document.getElementById('legalModal');
      if (modal) modal.classList.add('hidden');
    }

    function switchLegalTab(tab) {
      const tabs = ['license', 'product-truth', 'privacy', 'refunds', 'contact'];
      tabs.forEach(t => {
        const content = document.getElementById('tabContent-' + t);
        const btn = document.getElementById('tabBtn-' + t);
        if (content) {
          if (t === tab) {
            content.classList.remove('hidden');
          } else {
            content.classList.add('hidden');
          }
        }
        if (btn) {
          if (t === tab) {
            btn.className = 'text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-gold text-black font-bold transition-all min-h-[44px]';
          } else {
            btn.className = 'text-sm sm:text-base font-medium px-4 py-2 rounded-lg bg-panel hairline-border text-neutral-300 hover:text-white transition-all min-h-[44px]';
          }
        }
      });
    }

    // Flagship Modal Helpers
    function openFlagshipModal(id, name, sector) {
      const modal = document.getElementById('flagshipModal');
      if (!modal) return;
      const titleEl = document.getElementById('flagshipModalTitle');
      const sectorEl = document.getElementById('flagshipModalSector');
      const mailtoBtn = document.getElementById('flagshipMailtoBtn');

      if (name) {
        titleEl.innerText = name;
        sectorEl.innerText = (sector || 'Deep Tech & SCADA') + ' // Vehicle #' + (id ? String(id).padStart(3, '0') : '');
        const subject = encodeURIComponent('Flagship Terms Inquiry — ' + name + ' (Asset #' + id + ')');
        const body = encodeURIComponent('Hello Aura & Grid Advisory Team,\\n\\nI am inquiring regarding commercial license and micro-APA buyout terms for ' + name + ' (Asset #' + id + ').\\n\\nBuyer Organization:\\nIntended Use / Deployment Scope:\\n\\nThank you.');
        mailtoBtn.href = 'mailto:advisory@auraandgrid.com?subject=' + subject + '&body=' + body;
      } else {
        titleEl.innerText = 'Request Flagship Terms';
        sectorEl.innerText = 'Track 2 // Deep Tech & SCADA Fleet (36 Vehicles)';
        mailtoBtn.href = 'mailto:advisory@auraandgrid.com?subject=Flagship%20Portfolio%20Inquiry%20-%20Aura%20%26%20Grid';
      }

      modal.classList.remove('hidden');
    }

    function closeFlagshipModal() {
      const modal = document.getElementById('flagshipModal');
      if (modal) modal.classList.add('hidden');
    }

    // Backdrop Click Handling
    document.getElementById('specModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'specModal') closeModal();
    });
    document.getElementById('legalModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'legalModal') closeLegalModal();
    });
    document.getElementById('flagshipModal')?.addEventListener('click', (e) => {
      if (e.target.id === 'flagshipModal') closeFlagshipModal();
    });

    // Keyboard Esc Handling
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeModal();
        closeLegalModal();
        closeFlagshipModal();
      }
    });

    // Hash routing for legal tabs
    function handleHashRoute() {
      const hash = window.location.hash.replace('#', '');
      if (['license', 'product-truth', 'privacy', 'refunds', 'contact'].includes(hash)) {
        openLegalModal(hash);
      } else if (hash === 'flagship-terms') {
        openFlagshipModal(null, null, null);
      }
    }
    window.addEventListener('hashchange', handleHashRoute);

    // Auto-init on page ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      filterCards();
      handleHashRoute();
    } else {
      window.addEventListener('DOMContentLoaded', () => {
        filterCards();
        handleHashRoute();
      });
    }
  </script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT_HTML_PATH, showroomHtml, 'utf-8');
console.log(`✅ [Aura & Grid] Decoupled Public Showroom successfully compiled at: ${OUTPUT_HTML_PATH}`);

// Execute Tailwind compiler to build standalone production style.css
const tailwindBin = path.join(rootDir, 'tools', 'ghost-factory-console', 'node_modules', '.bin', 'tailwindcss');
const tailwindConfig = path.join(SITE_DIR, 'tailwind.config.js');
const inputCss = path.join(SITE_DIR, 'input.css');

if (fs.existsSync(tailwindBin) && fs.existsSync(tailwindConfig) && fs.existsSync(inputCss)) {
  console.log('🎨 Compiling standalone production stylesheet (site/assets/style.css)...');
  try {
    execSync(`"${tailwindBin}" -c "${tailwindConfig}" -i "${inputCss}" -o "${STYLE_CSS_PATH}" --minify`, {
      cwd: rootDir,
      stdio: 'pipe'
    });
    const stats = fs.statSync(STYLE_CSS_PATH);
    console.log(`✨ [Tailwind] Production stylesheet compiled successfully (${(stats.size / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.warn(`⚠️ Warning: Tailwind compile error: ${err.message}`);
  }
} else {
  console.warn('⚠️ Warning: Tailwind binary or config not found; using existing style.css');
}

// Mirror to repository root for hosting environments configured for root publishing (Render, GitHub Pages, Vercel)
const ROOT_HTML_PATH = path.join(rootDir, 'index.html');
fs.copyFileSync(OUTPUT_HTML_PATH, ROOT_HTML_PATH);
console.log(`🪞 [Aura & Grid] Mirrored showroom index.html to repository root: ${ROOT_HTML_PATH}`);

// Ensure root assets/ has style.css and covers/ synchronized
const ROOT_ASSETS_DIR = path.join(rootDir, 'assets');
const ROOT_COVERS_DIR = path.join(ROOT_ASSETS_DIR, 'covers');
fs.mkdirSync(ROOT_COVERS_DIR, { recursive: true });
if (fs.existsSync(STYLE_CSS_PATH)) {
  fs.copyFileSync(STYLE_CSS_PATH, path.join(ROOT_ASSETS_DIR, 'style.css'));
}
const siteCoverFiles = fs.readdirSync(SITE_ASSETS_DIR);
for (const file of siteCoverFiles) {
  fs.copyFileSync(path.join(SITE_ASSETS_DIR, file), path.join(ROOT_COVERS_DIR, file));
}
console.log(`🪞 [Aura & Grid] Mirrored ${siteCoverFiles.length} covers and style.css to root assets/ directory`);

console.log('🏁 [Aura & Grid] Showroom Rebuild & Compliance Sync Complete.');

