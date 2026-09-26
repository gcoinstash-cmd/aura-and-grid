import fs from 'fs';
import path from 'path';

const BASE_DIR = '/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid';
const manifestPath = path.join(BASE_DIR, 'CATALOG_MANIFEST.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// The 5 Archetype Definitions
const ARCHETYPES = {
  A: {
    id: "A",
    name: "Archetype A: Dense Operational Console",
    description: "Persistent utility rail, real-time operational triage queue, and slide-out master-detail inspection drawer for high-velocity dispatch and logistics.",
    benchmarks: ["Flexport", "Samsara", "Geotab", "ServiceTitan", "Aman Dispatch"]
  },
  B: {
    id: "B",
    name: "Archetype B: Asymmetric Editorial Showcase",
    description: "Dynamic masonry grid, visual filtering, editorial typography, and slide-over commission sheet for high-end ateliers, creative studios, and maritime showcases.",
    benchmarks: ["Fraser Yachts Monaco", "Awwwards Annuals", "Savoir Beds", "Leica Gallery"]
  },
  C: {
    id: "C",
    name: "Archetype C: Step-by-Step Calculator / Wizard",
    description: "Stateful multi-stage progression stepper, interactive pricing/spec tally, and stage-by-stage validation for underwriting, legal retainers, and clinical intake.",
    benchmarks: ["Carta", "Clio Legal", "Beverly Hills Aesthetic Intake", "Tesla Design Studio"]
  },
  D: {
    id: "D",
    name: "Archetype D: Timeline & Station Reservation Grid",
    description: "Interactive day/hour time-slot matrix, capacity/station status indicators, and instant seat/pod booking for Michelin dining, private clubs, and recovery labs.",
    benchmarks: ["SevenRooms Michelin Matrix", "Mindbody Concierge", "Resy Global", "Healios Labs"]
  },
  E: {
    id: "E",
    name: "Archetype E: Split-Screen Spec & Proof Panel",
    description: "Fixed left media inspection preview, right scrollable technical breakdown, cryptographic proof logs, and provenance vault for horology, wealth, and fine art.",
    benchmarks: ["Chrono24 Collector Loupe", "Sotheby's Sealed", "Bloomberg Terminal", "Christie's Provenance"]
  }
};

// Map each product ID to its archetype and benchmark
const archetypeMap = {
  // Batch 1 (1-5)
  1: { id: "A", benchmark: "Sneaker Con & Flight Club Authentication Console" },
  2: { id: "B", benchmark: "Abbey Road & Sunset Sound Editorial Showcase" },
  3: { id: "A", benchmark: "Exotic Fleet Telematics & GPS Triage" },
  4: { id: "D", benchmark: "UFC Performance Institute Sparring Matrix" },
  5: { id: "C", benchmark: "Carta LP Subscription & Capital Underwriting Wizard" },

  // Batch 2 (6-10)
  6: { id: "D", benchmark: "Blue Bottle Slow Bar & Pour-Over Station Grid" },
  7: { id: "E", benchmark: "Sotheby's International Realty Deed Provenance Panel" },
  8: { id: "C", benchmark: "Beverly Hills Laser & Injectable Protocol Wizard" },
  9: { id: "B", benchmark: "Chanel Haute Couture Atelier Showcase" },
  10: { id: "D", benchmark: "Napa Valley Allocation & Cellar Tasting Grid" },

  // Batch 3 (11-15)
  11: { id: "E", benchmark: "Dolby Atmos Master Track Acoustic Spec Panel" },
  12: { id: "D", benchmark: "Equinox Biometric Cryo & POD Station Grid" },
  13: { id: "D", benchmark: "Blue Note NYC Jazz Table Reservation Matrix" },
  14: { id: "D", benchmark: "Amanjena Thermal Bathhouse Schedule Matrix" },
  15: { id: "D", benchmark: "Sukiyabashi Jiro 10-Seat Counter Matrix" },

  // Batch 4 (16-20)
  16: { id: "B", benchmark: "Savile Row Bespoke Suiting Editorial" },
  17: { id: "C", benchmark: "Officina Profumo Botanical Tincture Wizard" },
  18: { id: "B", benchmark: "St. Moritz Alpine Parlor Editorial Showcase" },
  19: { id: "B", benchmark: "Framestore VFX Reel & 3D Pipeline Showcase" },
  20: { id: "D", benchmark: "Rao's NYC Secret Speakeasy Reservation Matrix" },

  // Batch 5 (21-25)
  21: { id: "D", benchmark: "Tokyo Shinjuku Golden Gai Izakaya Grid" },
  22: { id: "D", benchmark: "Indochine French-Vietnamese Bistro Grid" },
  23: { id: "A", benchmark: "Hennessey Performance Dyno Dispatch Console" },
  24: { id: "E", benchmark: "Architectural Digest Structural Spec Vault" },
  25: { id: "B", benchmark: "Pixar Renderfarm & 3D Rigging Showcase" },

  // Batch 6 (26-30)
  26: { id: "A", benchmark: "Shake Shack Kitchen Display System Console" },
  27: { id: "B", benchmark: "Kilian Paris Olfactory Scent Pyramid Showcase" },
  28: { id: "C", benchmark: "Foster + Partners Architectural Scope Wizard" },
  29: { id: "D", benchmark: "Bordeaux Premier Cru Allocation Matrix" },
  30: { id: "E", benchmark: "Rockefeller Family Trust Ledger Panel" },

  // Batch 7 (31-35)
  31: { id: "D", benchmark: "Truefitt & Hill 30-Min Barber Chair Matrix" },
  32: { id: "B", benchmark: "Blind Barber VIP Grooming Goods Showcase" },
  33: { id: "C", benchmark: "Walker & Dunlop Commercial DSCR Underwriting Wizard" },
  34: { id: "E", benchmark: "McKinsey High-Ticket Advisory Deal Blueprint" },
  35: { id: "A", benchmark: "Franklin Barbecue Pitmaster Probe Telemetry Console" },

  // Batch 8 (36-40)
  36: { id: "B", benchmark: "Kelly Wearstler California Modernism Showcase" },
  37: { id: "D", benchmark: "L'Antica Pizzeria da Michele Fermentation Matrix" },
  38: { id: "C", benchmark: "LIV Miami VIP Bottle Minimum & Table Wizard" },
  39: { id: "E", benchmark: "Pentagram Brand Identity Asset Spec Panel" },
  40: { id: "B", benchmark: "Supreme NYC Street Food Drop Editorial" },

  // Batch 9 (41-45)
  41: { id: "E", benchmark: "Trezor & Ledger Cold Storage UTXO Proof Panel" },
  42: { id: "A", benchmark: "RWB Porsche Tuning Bay Dispatch Console" },
  43: { id: "D", benchmark: "Banja Bathhouse Hydrotherapy Grid" },
  44: { id: "D", benchmark: "Marcus Samuelsson Heritage Chef Reservation Matrix" },
  45: { id: "B", benchmark: "James Beard Foundation Culinary Archive Editorial" },

  // Batch 10 (46-50)
  46: { id: "E", benchmark: "Blue Hill at Stone Barns Sourcing Proof Panel" },
  47: { id: "B", benchmark: "Architectural Digest Bel-Air Mega-Estate Showcase" },
  48: { id: "A", benchmark: "In-N-Out Supercar Drive-Thru RFID Dispatch" },
  49: { id: "C", benchmark: "CoStar 10-Year Pro-Forma DCF Underwriting Engine" },
  50: { id: "A", benchmark: "Eleven Madison Park BOH Station Velocity Console" },

  // Batch 11 (51-55)
  51: { id: "A", benchmark: "Kogi BBQ Live GPS Food Truck Dispatch Console" },
  52: { id: "B", benchmark: "Ryokan Kyoto Sensory Omakase Editorial Showcase" },
  53: { id: "C", benchmark: "Montessori Early Developmental Milestone Wizard" },
  54: { id: "C", benchmark: "Four Seasons RevPASH & CapEx Yield Calculator" },
  55: { id: "E", benchmark: "Berkshire Hathaway Capital Compounding Terminal Panel" },

  // Batch 12 (56-60)
  56: { id: "A", benchmark: "Carrier Chiller Plant & Commercial Dispatch Console" },
  57: { id: "C", benchmark: "EagleView Drone Scope & Roofing Estimator Wizard" },
  58: { id: "A", benchmark: "Roto-Rooter Commercial Hydraulic Ops Console" },
  59: { id: "D", benchmark: "Sunrun Commercial PV Sizing & AHJ Permit Grid" },
  60: { id: "A", benchmark: "ABB Medium-Voltage Switchgear & EV Crew Console" },

  // Batch 13 (61-65)
  61: { id: "D", benchmark: "Pacific Dental Operatory Chair Scheduling Matrix" },
  62: { id: "B", benchmark: "VCA Animal Hospital Emergency Case Showcase" },
  63: { id: "C", benchmark: "Dr. Mark Hyman Epigenetic Longevity Protocol Wizard" },
  64: { id: "D", benchmark: "EXOS Athletic Rehabilitation Station Grid" },
  65: { id: "D", benchmark: "Next Health Thermal Contrast & IV Lounge Grid" },

  // Batch 14 (66-70)
  66: { id: "C", benchmark: "Skadden Arps Commercial Trial Retainer Wizard" },
  67: { id: "C", benchmark: "Goldman Sachs Lower Middle-Market M&A VDR Stepper" },
  68: { id: "C", benchmark: "Korn Ferry Retained C-Suite Placement Stepper" },
  69: { id: "E", benchmark: "Cambridge Associates Sovereign Wealth Spec Panel" },
  70: { id: "E", benchmark: "FTI Consulting Commercial Trial E-Discovery War Room" },

  // Batch 15 (71-75)
  71: { id: "A", benchmark: "United Rentals Heavy Earthmoving Fleet Console" },
  72: { id: "A", benchmark: "C.H. Robinson Intermodal Freight Brokerage Console" },
  73: { id: "C", benchmark: "NetJets Private Fleet Flight Hours Wizard" },
  74: { id: "A", benchmark: "Lineage Logistics Reefer Dock Telemetry Console" },
  75: { id: "A", benchmark: "Mammoet Heavy Lift & Rigging Dispatch Console" },

  // Batch 16 (76-80)
  76: { id: "C", benchmark: "XPEL Automotive Paint Protection Film Wizard" },
  77: { id: "A", benchmark: "Mobile Detail Rig & Tech Dispatch Console" },
  78: { id: "B", benchmark: "ARRI Rental Cinema Grip & Anamorphic Lens Showcase" },
  79: { id: "B", benchmark: "Bang Bang NYC Resident Tattoo Artist Flash Grid" },
  80: { id: "D", benchmark: "UFC Athlete Cryo & Contrast Chamber Matrix" },

  // Batch 17 (81-85)
  81: { id: "D", benchmark: "SevenRooms 24-Seat Michelin Timeline Matrix" },
  82: { id: "C", benchmark: "Beverly Hills Plastic Surgery Treatment Intake Wizard" },
  83: { id: "B", benchmark: "Fraser Yachts Monaco Asymmetric Editorial Showcase" },
  84: { id: "E", benchmark: "Chrono24 Split-Screen Inspection Loupe & Caliber Vault" },
  85: { id: "A", benchmark: "Aman Resorts Private Villa Concierge & Butler Console" }
};

// Update CATALOG_MANIFEST.json
manifest.standards = "Ghost Factory™ 9.0+ Verified Production Grade (Permanent 5-Archetype Rotation & Curated Design Intelligence)";
manifest.archetypes = ARCHETYPES;

manifest.products.forEach(p => {
  const info = archetypeMap[p.id] || { id: "A", benchmark: "Ghost Factory Standard" };
  const arch = ARCHETYPES[info.id];
  p.archetype_id = info.id;
  p.archetype_name = arch.name;
  p.archetype_description = arch.description;
  p.design_benchmark = info.benchmark;
});

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`✓ CATALOG_MANIFEST.json successfully updated with permanent 5-archetype registry across all ${manifest.products.length} products!`);

// Update tools/ghost-factory-console/src/catalogData.ts
const consoleCatalogPath = path.join(BASE_DIR, 'tools/ghost-factory-console/src/catalogData.ts');
const catalogTsContent = `export const CATALOG_MANIFEST = ${JSON.stringify(manifest, null, 2)};\n`;
fs.writeFileSync(consoleCatalogPath, catalogTsContent, 'utf8');
console.log(`✓ tools/ghost-factory-console/src/catalogData.ts updated!`);
