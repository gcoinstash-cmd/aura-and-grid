#!/usr/bin/env node

/**
 * Ghost Factory™ — Remediate Catalog Taxonomy, Pseudo-Certifications & Rarity Tiers
 * 
 * 1. Purge pseudo-certifications:
 *    - "Certified Crane Rigging" -> "Simulated Rigging Telemetry"
 *    - "Stamped AHJ" -> "AHJ Reference Spec (Simulation)"
 *    - "Provenance Certificate" -> "Digital Blueprint Ledger"
 * 
 * 2. Rebalance rarity tiers:
 *    - Flagship Deep-Tech/SCADA Blueprints (25 total): "Elite"
 *    - Advanced/Complex Multi-page Blueprints (Track 1: Archetypes A, C, E): "Pro"
 *    - Standard Turnkey Blueprints (Track 1: Archetypes B, D): "Core"
 * 
 * 3. Fix taxonomy & misplaced categories:
 *    - Barber, perfume, spa, retreat -> "Lifestyle & Boutique Hospitality"
 *    - Subsea / mining -> "Industrial Robotics & Autonomous SCADA"
 *    - Explicitly set `domain` and `rarity_tier` on every product.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MANIFEST_PATH = path.join(rootDir, 'CATALOG_MANIFEST.json');
const CONSOLE_CATALOG_PATH = path.join(rootDir, 'tools', 'ghost-factory-console', 'src', 'catalogData.ts');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));

export function getDomainClass(p) {
  const name = (p.name || '').toLowerCase();
  const cat = (p.category || '').toLowerCase();
  const v = (p.vertical || '').toLowerCase();

  // 1. Subsea / Mining -> Industrial Robotics & Autonomous SCADA
  if (
    v === 'subsea' ||
    name.includes('subsea') || name.includes('mining') || name.includes('crawler') ||
    name.includes('haulage') || name.includes('trenching') || name.includes('cable restoration') ||
    name.includes('rov') || cat.includes('mining') || cat.includes('subsea') || cat.includes('crawler')
  ) {
    return 'Industrial Robotics & Autonomous SCADA';
  }

  // 2. Barber, perfume, spa, retreat, and hospitality -> Lifestyle & Boutique Hospitality
  if (
    cat.includes('barber') || name.includes('barber') ||
    cat.includes('parfumerie') || cat.includes('fragrance') || name.includes('fragrance') || name.includes('apothecary') ||
    cat.includes('spa') || name.includes('spa') || name.includes('medspa') ||
    cat.includes('retreat') || name.includes('retreat') ||
    v === 'hospitality' || cat.includes('hospitality') || cat.includes('dining') || cat.includes('bistro') ||
    cat.includes('omakase') || cat.includes('supper') || cat.includes('winery') || cat.includes('vineyard') ||
    cat.includes('nightlife') || cat.includes('villa') || cat.includes('culinary') || cat.includes('estate')
  ) {
    return 'Lifestyle & Boutique Hospitality';
  }

  // 3. Energy SCADA
  if (
    name.includes('fusion') || name.includes('tokamak') || name.includes('geothermal') ||
    name.includes('microgrid') || name.includes('cryostat') || name.includes('semiconductor fab') ||
    name.includes('cleanroom') || v === 'clean_energy'
  ) {
    return 'Energy SCADA';
  }

  // 4. Deep Tech SCADA (Aerospace, Defense, Space)
  if (
    v.includes('aerospace') || v.includes('defense') || v.includes('deep_tech') ||
    name.includes('drone swarm') || name.includes('supersonic') || name.includes('hypersonic') ||
    name.includes('satellite') || name.includes('laser isl') || name.includes('payload manifest') ||
    name.includes('orbital') || name.includes('eclss') || name.includes('propellant depot')
  ) {
    return 'Deep Tech SCADA';
  }

  // 5. Clinical & Medical Operations
  if (
    v.includes('medical') || v.includes('clinical') ||
    name.includes('clinical trial') || name.includes('dental') || name.includes('veterinary') ||
    name.includes('hyperbaric') || name.includes('spine')
  ) {
    return 'Clinical & Medical Operations';
  }

  // 6. Institutional Capital & Wealth
  if (
    v.includes('wealth') || v.includes('finance') || v.includes('credit') ||
    name.includes('credit syndication') || name.includes('capital') || name.includes('family office') ||
    name.includes('horology') || name.includes('litigation') || name.includes('advisory')
  ) {
    return 'Institutional Capital & Wealth';
  }

  // 7. Mobility & Fleet Logistics
  if (
    v.includes('automotive') || v.includes('heavy_fleet') ||
    name.includes('aviation fbo') || name.includes('freight brokerage') || name.includes('maritime') ||
    name.includes('yacht') || name.includes('rental') || name.includes('tuning') || name.includes('detail') ||
    name.includes('ppf') || name.includes('cold storage') || name.includes('crane rigging')
  ) {
    return 'Mobility & Fleet Logistics';
  }

  // 8. Performance Athletics & Fitness
  if (
    v.includes('fitness') || name.includes('stride') || name.includes('boxing') ||
    name.includes('kinetic') || name.includes('recovery lab') || name.includes('fight club')
  ) {
    return 'Performance Athletics & Fitness';
  }

  // 9. Trades & Infrastructure
  if (
    v.includes('home_services') || name.includes('hvac') || name.includes('plumbing') ||
    name.includes('electrical') || name.includes('solar') || name.includes('roofing')
  ) {
    return 'Trades & Infrastructure';
  }

  // 10. Creative & Media Production
  if (v.includes('creative') || name.includes('studio') || name.includes('motion') || name.includes('ink') || name.includes('monolith') || name.includes('cinegrip')) {
    return 'Creative & Media Production';
  }

  return 'Specialized Operations';
}

export function getRarityTier(p) {
  if (p.id >= 86 || Boolean(p.flagship_qualified) || (p.pricing_track && p.pricing_track.includes('Track 2'))) {
    return 'Elite';
  }
  // Advanced/Complex Multi-page: Archetypes A, C, E
  if (['A', 'C', 'E'].includes(p.archetype_id)) {
    return 'Pro';
  }
  return 'Core';
}

let purgedCount = 0;
const domainCounts = {};
const rarityCounts = { Core: 0, Pro: 0, Elite: 0 };

manifest.products.forEach(p => {
  // Purge pseudo certifications
  if (p.category && p.category.includes('Certified Crane Rigging')) {
    p.category = p.category.replace('Certified Crane Rigging', 'Simulated Rigging Telemetry');
    purgedCount++;
  }
  if (p.category && p.category.includes('Stamped AHJ')) {
    p.category = p.category.replace('Stamped AHJ', 'AHJ Reference Spec (Simulation)');
    purgedCount++;
  }
  if (p.category && p.category.includes('Provenance Certificate')) {
    p.category = p.category.replace('Provenance Certificate', 'Digital Blueprint Ledger');
    purgedCount++;
  }

  p.domain = getDomainClass(p);
  p.rarity_tier = getRarityTier(p);

  domainCounts[p.domain] = (domainCounts[p.domain] || 0) + 1;
  rarityCounts[p.rarity_tier]++;
});

console.log(`\n======================================================`);
console.log(`🛠️ [TAXONOMY & TIER REMEDIATION ENGINE]`);
console.log(`======================================================`);
console.log(`✓ Purged pseudo-certifications: ${purgedCount} instances`);
console.log(`✓ Rarity Tier Distribution:`, rarityCounts);
console.log(`✓ Active Domain Taxonomy Breakdown:`, domainCounts);

// Save updated CATALOG_MANIFEST.json
fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
console.log(`✓ Saved updated CATALOG_MANIFEST.json (${manifest.products.length} products)`);

// Generate updated catalogData.ts
const catalogDataTs = `// Auto-generated from CATALOG_MANIFEST.json — Ghost Factory™ Registry
export interface ProductItem {
  id: number;
  name: string;
  category: string;
  best_for: string;
  gumroad_url: string;
  preview_url: string;
  admin_url: string;
  admin_passcode?: string;
  audit_score: number;
  tables: string[];
  vertical: string;
  domain?: string;
  rarity_tier?: 'Core' | 'Pro' | 'Elite';
  archetype_id?: string;
  archetype_name?: string;
  archetype_description?: string;
  design_benchmark?: string;
  checkout_active?: boolean;
  status_badge?: string;
  commercial_checkout_url?: string;
  demo_passcode_type?: string;
  security_architecture?: string;
  pricing_track?: string;
  flagship_qualified?: boolean;
  flagship_license_msrp?: number;
  flagship_license_range?: number[];
  exclusive_buyout_anchor?: number;
  exclusive_buyout_range?: number[];
  full_asset_buyout_range?: number[];
  strategic_acquisition_range?: number[];
  truth_label?: string;
  truth_badge: string;
  disclaimer: string;
}

export const CATALOG_DATA = ${JSON.stringify(manifest, null, 2)};
`;

fs.writeFileSync(CONSOLE_CATALOG_PATH, catalogDataTs, 'utf-8');
console.log(`✓ Saved updated tools/ghost-factory-console/src/catalogData.ts`);
console.log(`======================================================\n`);
