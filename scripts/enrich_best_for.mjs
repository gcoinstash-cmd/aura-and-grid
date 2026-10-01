#!/usr/bin/env node
/**
 * Ghost Factory™ — Enrich 110 Catalog Blueprints with "Best For:" Buyer Qualification
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const MANIFEST_PATH = path.join(rootDir, 'CATALOG_MANIFEST.json');
const CONSOLE_DATA_PATH = path.join(rootDir, 'tools/ghost-factory-console/src/catalogData.ts');

const BEST_FOR_MAP = {
  1: "Best for: Boutique fitness studios & personal training collectives",
  2: "Best for: Luxury supercar & exotic vehicle rental agencies",
  3: "Best for: High-ticket creative agencies & production houses",
  4: "Best for: Architectural & interior design studio portfolios",
  5: "Best for: Emerging private equity managers & LP syndicates",
  6: "Best for: Specialty micro-roasteries & artisanal coffee tasting bars",
  7: "Best for: Ultra-luxury estate brokers & private villa management",
  8: "Best for: Boutique aesthetics clinics & medical spa practitioners",
  9: "Best for: Sports biomechanics & athlete physical therapy clinics",
  10: "Best for: Private vineyard cellars & allocation tasting estates",
  11: "Best for: Exclusive private member clubs & executive lounges",
  12: "Best for: Independent record labels & analog mastering studios",
  13: "Best for: Speakeasy jazz lounges & sommelier listening rooms",
  14: "Best for: High-ticket wellness retreats & executive expeditions",
  15: "Best for: Intimate chef counter tasting rooms & omakase bars",
  16: "Best for: 3D CGI, motion design & visual effects studios",
  17: "Best for: Bespoke fragrance houses & botanical olfactory ateliers",
  18: "Best for: Alpine tasting salons & biodynamic cellar lounges",
  19: "Best for: Modern architectural ateliers & structural engineering firms",
  20: "Best for: Private dining clubs & vinyl listening restaurants",
  21: "Best for: High-energy izakayas & modern craft robata cantinas",
  22: "Best for: Contemporary dim sum bistros & craft baijiu bars",
  23: "Best for: Commercial lighting designers & architectural fixture firms",
  24: "Best for: Luxury architectural villa rentals & private island retreats",
  25: "Best for: Commercial architecture studios & urban master planners",
  26: "Best for: Craft smash burger joints & fast-casual kitchen collectives",
  27: "Best for: Haute parfumerie brands & bespoke scent formulation labs",
  28: "Best for: Commercial portrait photographers & editorial studios",
  29: "Best for: Boutique wine estates & allocation membership programs",
  30: "Best for: Multi-generational family offices & private wealth trusts",
  31: "Best for: High-end grooming salons & luxury barber ateliers",
  32: "Best for: VIP barber studios & curated grooming product retailers",
  33: "Best for: Commercial real estate loan brokers & debt underwriters",
  34: "Best for: B2B strategy consultants & high-ticket agency founders",
  35: "Best for: Oak smokehouse barbecue joints with pit telemetry needs",
  36: "Best for: Creative film directors & cultural motion studios",
  37: "Best for: Neapolitan pizzerias & artisanal fermentation kitchens",
  38: "Best for: VIP nightclub bottle service & hospitality promoters",
  39: "Best for: Wholesale coffee roasters & cafe bean delivery fleets",
  40: "Best for: Food truck operators & ghost kitchen delivery brands",
  41: "Best for: Bitcoin treasury managers & cryptographic asset holders",
  42: "Best for: Sourdough micro-bakeries & pastry wholesale dispatch",
  43: "Best for: Destination luxury spas & holistic wellness sanctuaries",
  44: "Best for: Heritage culinary concepts & private dining chefs",
  45: "Best for: Gastronomic research collectives & experiential dining",
  46: "Best for: Farm-to-table restaurants & local farm partnership networks",
  47: "Best for: High-end residential real estate brokers & property portals",
  48: "Best for: High-volume drive-thru concepts & late-night wok kitchens",
  49: "Best for: Real estate private equity analysts & property syndicators",
  50: "Best for: Banquet catering facilities & commercial production kitchens",
  51: "Best for: Mobile street food fleets & festival event caterers",
  52: "Best for: Minimalist Zen dining rooms & sensory gastronomy seatings",
  53: "Best for: Pediatric development centers & sensory therapy clinics",
  54: "Best for: Hotel asset managers & boutique hospitality investors",
  55: "Best for: Private equity portfolio managers & investment committees",
  56: "Best for: Commercial HVAC contractors & chiller plant technicians",
  57: "Best for: Drone roofing contractors & insurance scope estimators",
  58: "Best for: Commercial plumbing firms & backflow testing services",
  59: "Best for: Solar EPC installers & renewable energy contractors",
  60: "Best for: Commercial electrical contractors & EV charger deployers",
  61: "Best for: Private dental practices & cosmetic dentistry clinics",
  62: "Best for: Emergency veterinary hospitals & animal surgical clinics",
  63: "Best for: Functional medicine doctors & epigenetic longevity clinics",
  64: "Best for: Orthopedic physical therapists & sports recovery clinics",
  65: "Best for: Contrast therapy lounges & hyperbaric wellness clinics",
  66: "Best for: Commercial boutique law firms & transactional attorneys",
  67: "Best for: Lower middle-market M&A advisors & investment banks",
  68: "Best for: Retained executive search consultants & board recruiters",
  69: "Best for: Sovereign wealth managers & multi-family offices",
  70: "Best for: Complex litigation teams & trial war room managers",
  71: "Best for: Earthmoving equipment rental yards & plant hire fleets",
  72: "Best for: Intermodal freight brokerages & carrier logistics dispatchers",
  73: "Best for: On-demand private jet brokers & aircraft fleet operators",
  74: "Best for: Temperature-controlled cold warehouses & reefer dock hubs",
  75: "Best for: Heavy lift contractors & mobile crane rigging engineers",
  76: "Best for: Paint protection film installers & luxury auto restylers",
  77: "Best for: Mobile detailing operators & corporate fleet wash services",
  78: "Best for: Camera rental houses & grip truck equipment dispatchers",
  79: "Best for: High-ticket tattoo studios & resident artist collectives",
  80: "Best for: Combat sports gyms & elite athlete recovery facilities",
  81: "Best for: Michelin-starred restaurants & multi-course tasting rooms",
  82: "Best for: Aesthetic injection nurses & medical aesthetics practices",
  83: "Best for: Luxury yacht charter brokers & Mediterranean fleet managers",
  84: "Best for: High-end watch dealers & horological provenance vaults",
  85: "Best for: Estate managers & luxury villa rental concierges",
  86: "Best for: Perimeter security operators & autonomous drone fleet coordinators",
  87: "Best for: Open-pit mining dispatchers & autonomous haulage operators",
  88: "Best for: Deep-sea mining engineers & seabed crawler telemetry operators",
  89: "Best for: Airport FBO ground handlers & private aviation terminal managers",
  90: "Best for: Estate winemakers & barrel cellar production managers",
  91: "Best for: Biopharma CROs & clinical trial site coordinators",
  92: "Best for: Cold chain logistics managers & multi-zone freezer facilities",
  93: "Best for: Supersonic propulsion engineers & test cell telemetry analysts",
  94: "Best for: Tokamak control engineers & magnetic confinement fusion labs",
  95: "Best for: Offshore marine contractors & subsea cable trenching engineers",
  96: "Best for: Geothermal energy operators & enhanced geothermal wellhead engineers",
  97: "Best for: Low-latency prop trading firms & colocation infrastructure teams",
  98: "Best for: Aerodynamic test engineers & hypersonic wind tunnel researchers",
  99: "Best for: High-net-worth vehicle concierges & private car collector managers",
  100: "Best for: Dry bulk & container ship brokers & maritime cargo dispatchers",
  101: "Best for: Satellite constellation operators & optical inter-satellite link engineers",
  102: "Best for: Direct lenders, credit funds & private loan syndication desks",
  103: "Best for: Island microgrid operators & commercial battery BESS engineers",
  104: "Best for: Wafer fab contamination engineers & cleanroom facility managers",
  105: "Best for: Commercial launch providers & satellite integration manifest managers",
  106: "Best for: Subsea fiber cable owners & maritime repair ship dispatchers",
  107: "Best for: Quantum computing researchers & dilution refrigerator engineers",
  108: "Best for: Yacht fleet management companies & luxury maritime charter brokers",
  109: "Best for: Commercial space station operators & life support ECLSS flight controllers",
  110: "Best for: In-space propellant depot engineers & cryogenic boiloff telemetry teams"
};

console.log('⚡ Injecting "Best For:" metadata into catalog manifests...');

const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

if (!manifest.products || manifest.products.length !== 110) {
  throw new Error(`Expected 110 products in manifest, found ${manifest.products?.length}`);
}

manifest.products.forEach(p => {
  const target = BEST_FOR_MAP[p.id];
  if (!target) {
    throw new Error(`Missing target for product ID ${p.id}`);
  }
  p.best_for = target;
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
console.log('✅ CATALOG_MANIFEST.json updated with 110 "best_for" entries.');

if (fs.existsSync(CONSOLE_DATA_PATH)) {
  const currentCatalogTs = fs.readFileSync(CONSOLE_DATA_PATH, 'utf8');
  
  // Ensure ProductItem interface includes best_for
  let updatedTs = currentCatalogTs;
  if (!updatedTs.includes('best_for?: string;') && !updatedTs.includes('best_for: string;')) {
    updatedTs = updatedTs.replace(
      'category: string;',
      'category: string;\n  best_for: string;'
    );
  }
  
  const interfaceMatch = updatedTs.match(/([\s\S]*?export const CATALOG_DATA = )/);
  if (!interfaceMatch) throw new Error('Could not find CATALOG_DATA header');
  
  const finalTs = `${interfaceMatch[1]}${JSON.stringify(manifest, null, 2)};\n`;
  fs.writeFileSync(CONSOLE_DATA_PATH, finalTs, 'utf8');
  console.log('✅ tools/ghost-factory-console/src/catalogData.ts updated with 110 "best_for" entries.');
}

console.log('🏁 "Best For:" metadata enrichment complete!\n');
