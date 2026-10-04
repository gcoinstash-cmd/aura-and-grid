import fs from 'fs';
import path from 'path';

const scratchDataPath = '/Users/gmane/.gemini/antigravity/brain/444fca5f-bc63-4353-a421-b896e6df1a50/scratch/fleet_images_data.json';
const fleet = JSON.parse(fs.readFileSync(scratchDataPath, 'utf8'));

// Specific visual concept generator mapping
const visualConcepts = {
  1: "Angled glass cockpit crop of athlete biometric heart-rate telemetry, dark-slate UI with neon-emerald pulse graphs and VO2 max dials (no browser window).",
  2: "Angled soundstage production console, showing multi-track studio timeline, acoustic decibel meter displays, and amber LED status lights.",
  3: "Sleek automotive telematics HUD showing exotic fleet availability, GPS track vectors, and rev-counter gauge widgets on carbon fiber background.",
  4: "Isometric dark console showing sparring ring occupancy matrix, member biometric readiness dial, and gold-accent telemetry bars.",
  5: "Executive LP capital call & IRR yield dashboard crop, clean sans-serif data hierarchy, zero browser chrome or passkeys, subtle emerald sparklines.",
  6: "Single-origin roast curve telemetry view, sensory extraction profile spider charts, dark bronze on pitch-black background.",
  7: "Luxury architectural estate master-plan interface, floorplan vector toggle with subtle lighting controls and high-contrast typography.",
  8: "Clinical aesthetics treatment suite console, syringe dosage timeline & facial mapping vector diagram on pearl/obsidian dark glass (remove passkey).",
  9: "Atelier appointment book & barber station queue HUD, brass-tinted borders, client styling profile card (remove browser frame).",
  10: "Cellar humidity/temperature IoT sensor telemetry, barrel aging timeline gauges, deep ruby/gold status indicators (remove browser frame).",
  11: "Creative production pipeline Kanban & render farm queue HUD, monochromatic slate with high-contrast electric violet highlights.",
  12: "Athlete recovery kinetics console, force-plate asymmetry bar charts and muscular load distribution heatmap in dark titanium and cyan.",
  13: "Bespoke acoustic mastering studio session tracker, 64-band graphic equalizer visualization and analog VU meters in warm incandescent gold.",
  14: "Wellness sanctuary cabin occupancy HUD, circadian lighting scene control matrix, and guest biometric baseline graphs in forest slate.",
  15: "Omakase fish inventory provenance timeline, seasonal sourcing freshness countdown, and chef counter seat allocation grid in sumi ink and wasabi green.",
  16: "Bespoke sartorial fitting 3D measurement avatar, fabric mill inventory ledger, and tailoring stage pipeline in bespoke charcoal and chalk pinstripe.",
  17: "Herbal compounding apothecary ledger, botanical extract potency dials, and batch maceration timer in matte olive and amber glass.",
  18: "Alpine lodge private chalets booking matrix, ski slope snowpack telemetry, and hearth dining reservation queue in spruce green and fire amber.",
  19: "VFX motion graphics render cluster node status, GPU memory load graphs, and frame delivery burn-down chart in obsidian and laser purple.",
  20: "Exclusive supper club secret seating allocation, invite-only guest tasting notes, and vintage champagne cellar allocation in midnight navy and champagne gold.",
  21: "Cyberpunk izakaya order velocity radar, robata grill thermal zone map, and craft sake tap flow-meter in Tokyo neon pink and dark gunmetal.",
  22: "Pan-Asian luxury culinary cocktail telemetry, smoke-infusion timer matrix, and VIP mezzanine lounge table map in jade green and dark lacquer.",
  23: "Dyno tuning ECU telemetry display, turbo boost pressure curve, air-fuel ratio graph, and exhaust gas temperature gauges in carbon and racing yellow.",
  24: "Replace stock backyard photo with: Architectural luxury property management console, smart villa IoT HVAC/security zones, and occupancy timeline in dark stone.",
  25: "African creative agency media delivery pipeline, 4K streaming transcode queue, and global brand licensing dashboard in bronze and cobalt blue.",
  26: "Craft smash-burger kitchen ticket speed-of-service radar, griddle surface temperature sensors, and patty inventory depletion in charcoal and mustard yellow.",
  27: "Niche perfumery olfactory pyramid balance chart, top/heart/base note volatility curve, and custom flacon inventory in smoked glass and rose gold.",
  28: "Bespoke architecture BIM revision tracker, structural engineering milestone waterfall, and client material sample catalog in blueprint dark navy.",
  29: "Viticulture micro-climate sensor array, soil moisture probes, and grape harvest sugar brix forecast in dark earth and vineyard crimson.",
  30: "Multi-generational family office wealth allocation tree, estate tax exposure stress-test dial, and private foundation grants in executive pewter and gold.",
  31: "Bespoke diamond atelier gemological grading radar, 4Cs diamond cut facet reflectance analyzer, and custom jewelry workflow in obsidian and brilliant cyan.",
  32: "Artisan collective drops & showroom inventory ledger, limited edition consignment tracking, and member VIP allocation in matte basalt and copper.",
  33: "Commercial debt syndication loan pipeline, DSCR debt-service coverage gauge, and underwriting risk rating matrix in corporate charcoal and steel blue.",
  34: "Replace stock skyscraper photo with: Premium agency offer architecture canvas, pricing tier margin calculator, and client value-ladder pipeline in obsidian and gold.",
  35: "Replace stock BBQ skewers photo with: Pitmaster offset smoker thermal profile telemetry, wood pellet burn-rate sensor, and brisket core internal temp HUD in hickory brown.",
  36: "Replace stock living room photo with: High-end interior design client spec sheet, 3D furniture finish matrix, and contractor procurement timeline in warm travertine.",
  37: "Replace stock pizza photo with: Neapolitan pizza oven dome/floor IR thermal camera view, 72-hour sourdough fermentation tracker, and dough hydration calculator in dark slate.",
  38: "Replace stock concert photo with: Nightclub VIP table revenue heatmap, bottle service delivery velocity, and guest list RFID access monitor in laser ultraviolet.",
  39: "Replace stock suit model photo with: Elite talent agency roster management matrix, high-ticket brand deal pipeline, and contract royalty tracker in bespoke navy and gold.",
  40: "Replace stock kitchen photo with: Ghost kitchen multi-brand order aggregation HUD, prep station ticket turnaround timer, and delivery courier dispatch in dark steel.",
  41: "Replace stock microchip photo with: Multi-sig cryptocurrency treasury cold-vault monitor, hardware security module (HSM) heartbeat, and UTXO balance chart in cyber slate.",
  42: "Replace stock Monaco car photo with: High-end automotive repair shop bay occupancy matrix, OBD-II diagnostic fault scanner feed, and OEM parts supply tracker in grease-black and orange.",
  43: "Replace stock hot stones photo with: Medical aesthetician treatment bay scheduler, client skin phototype analysis chart, and facial contour protocol HUD in calm lavender and pearl.",
  44: "Replace stock ribs photo with: Smokehouse commercial kitchen inventory ledger, meat smoking wood blend ratio dials, and catering event manifest in cast-iron charcoal.",
  45: "Culinary heritage recipe preservation vault, historic ingredient provenance tree, and rare recipe sensory profile radar in dark parchment and sepia obsidian.",
  46: "Replace stock restaurant photo with: Farm-to-table seasonal harvest allocation engine, daily chef menu recipe cost matrix, and dining room covers turnover in raw linen.",
  47: "Replace stock house photo with: High-value luxury estate listing pipeline, private off-market buyer matching radar, and escrow closing countdown in dark graphite.",
  48: "Replace stock cafe photo with: Specialty espresso bar extraction pressure curve, grind-size micron sensor readout, and barista station queue velocity in dark roast espresso.",
  49: "Replace stock skyscraper photo with: Commercial real estate cap rate sensitivity matrix, tenant lease roll-over schedule, and portfolio square-foot NOI in executive slate.",
  50: "Replace duplicate ribs photo with: Commercial prep kitchen production scheduler, ingredient batch yield calculator, and walk-in cooler sensor array in stainless steel gray.",
  51: "Replace stock taco/pizza photo with: Mobile food truck GPS route optimization HUD, event commissary inventory stock, and square-foot kitchen prep queue in vibrant terracotta.",
  52: "Replace stock matcha photo with: Kaiseki sensory dining progression roadmap, seasonal Japanese ceramics inventory, and tea ceremony pairing notes in deep charcoal and matcha green.",
  53: "Replace stock student photo with: Pediatric wellness clinic appointment matrix, developmental milestone tracking timeline, and family health plan in soft eucalyptus and slate.",
  54: "Replace stock wine table photo with: Hotel & resort revenue per available room (RevPAR) forecast dial, dining room beverage margin calculator, and staff labor ROI in luxury graphite.",
  55: "Replace stock candlestick photo with: Algorithmic trading desk order routing console, liquidity pool spread monitor, and portfolio Sharpe ratio gauge in Bloomberg dark slate.",
  56: "Replace stock electrician photo with: Commercial HVAC emergency dispatch fleet map, rooftop unit (RTU) compressor error telemetry, and technician route dispatch in cool zinc.",
  57: "Drone roof inspection aerial 3D pitch/facet mesh, square footage shingles estimator, and insurance claim line-item quote in dark asphalt and safety blue.",
  58: "Commercial plumbing emergency dispatch console, acoustic pipe leak detection telemetry, and water pressure zone map in dark aquamarine and copper.",
  59: "Rooftop solar photovoltaic string voltage telemetry, inverter efficiency curves, and municipal permit milestone checklist in dark silicon and solar gold.",
  60: "High-voltage electrical substation dispatch grid, breaker panel load phase balancing chart, and emergency callout queue in dark carbon and electric volt.",
  61: "Boutique cosmetic dental smile design CAD preview, chair-side operatory booking matrix, and zirconia crown milling timeline in clinical pearl and titanium.",
  62: "Veterinary emergency clinic triage patient vitals monitor, surgical suite schedule, and veterinary pharmacy dispensary ledger in veterinary slate and teal.",
  63: "Functional medicine comprehensive biomarker radar, hormone metabolic pathway diagram, and personalized peptide protocol tracker in clinical dark cyan.",
  64: "Sports rehabilitation PT dynamometer force curves, range-of-motion goniometric angle tracks, and athlete return-to-play timeline in dark titanium and kinetic orange.",
  65: "Multi-place hyperbaric chamber ATA atmospheric pressure gauge, oxygen purity percentage sensor, and therapy session countdown in deep hyperbaric cobalt.",
  66: "Boutique law firm partner billable utilization matrix, court docket calendar, and litigation trust escrow balance in dark mahogany and legal parchment.",
  67: "Middle-market M&A virtual data room (VDR) activity audit, buyer due-diligence request tracker, and EBITDA valuation bridge in Wall Street dark graphite.",
  68: "C-suite executive search candidate pipeline Kanban, psychometric executive assessment radar, and confidential client dossier in luxury executive anthracite.",
  69: "Single-family office multi-entity asset holding structure, liquid capital reserves gauge, and private jet/yacht operating expenditure in midnight charcoal.",
  70: "Complex commercial litigation e-discovery document review velocity, deposition transcript keyword cross-reference, and court deadline burn-down in legal navy.",
  71: "Heavy civil earthmoving equipment telematics HUD, hydraulic excavator hours engine status, and jobsite transport flatbed dispatch in CAT industrial yellow.",
  72: "Intermodal freight brokerage truckload dispatch board, dry van lane rate index, and carrier insurance verification status in logistics steel and warning amber.",
  73: "Private aviation charter empty-leg fleet radar, jet fuel burn calculator, and VIP passenger ground transport manifest in aeronautical navy and gold.",
  74: "Pharma cold-chain refrigerated trailer temperature logging graph, GDP compliance alarm status, and reefer compressor run-time in pharmaceutical frost blue.",
  75: "Mobile crane lift capacity load chart calculator, outrigger ground-bearing pressure sensor, and rigging boom radius angle HUD in high-vis crane yellow.",
  76: "Exotic automotive ceramic coating curing infrared lamp timer, paint thickness gauge (mils) heatmap, and PPF cut pattern plotter queue in obsidian gloss.",
  77: "Luxury mobile auto detailing van route GPS dispatcher, onboard DI water tank levels, and high-end concierge service booking queue in dark metallic gray.",
  78: "Cinema camera equipment rental gear package checker, anamorphic lens checkout inventory, and soundstage grip truck packing manifest in Panavision matte black.",
  79: "High-end custom tattoo atelier artist booking matrix, autoclave sterilization biological indicator log, and custom flash design archive in tattoo black and brass.",
  80: "Combat athlete cryotherapy chamber temperature telemetry, red-light photobiomodulation session timer, and central nervous system fatigue gauge in battle slate and infrared.",
  81: "Michelin-starred fine dining reservation VIP seat map, wine pairing cellar sommelier pull list, and kitchen plating countdown in dark truffle and French copper.",
  82: "Replace stock clinical chair photo with: Aesthetic medicine botox/filler unit injection tracking chart, patient facial wrinkle severity index, and cold-storage vial inventory in clinical mauve and slate.",
  83: "Superyacht charter itinerary nautical navigational chart, marine diesel bunkering fuel status, and luxury guest water-toys manifest in Mediterranean azure and teak.",
  84: "Haute horlogerie grand complication watch inventory vault, Swiss balance wheel beat-error / amplitude vibrograf readout, and provenance certificate archive in luxury platinum and gold.",
  85: "Replace stock villa pool photo with: Ultra-high-net-worth private estate security perimeter zones, private chef/housekeeping staffing roster, and luxury concierge ledger in terracotta and dark bronze.",
  86: "Replace placeholder SVG with: 3D tactical LIDAR geospatial perimeter map, drone swarm node constellation mesh, real-time threat vector radar sweep with cyan/amber HUD indicators.",
  87: "Replace placeholder SVG with: Open-pit topography 3D wireframe elevation model, haul truck GPS path vectors, payload telemetry bar graphs in industrial safety orange and dark slate.",
  88: "Replace placeholder SVG with: Abyssal bathymetry depth profile, crawler benthic traction pressure gauges, acoustic positioning sonar waterfall display in deep ocean cobalt.",
  89: "Replace placeholder SVG with: Ramp apron parking allocation grid, Jet-A fuel uplift telemetry, tail-number turnaround timeline with aviation yellow and radar green accents.",
  90: "Replace placeholder SVG with: Fermentation tank brix & temperature sensor array, pump-over schedule matrix, barrel aging cellar IoT map in burgundy and brushed aluminum.",
  91: "Replace placeholder SVG with: Multi-cohort EDC eCRF reconciliation matrix, adverse event real-time surveillance timeline, HIPAA-compliant anonymized subject cohort tracker in clinical cyan.",
  92: "Replace placeholder SVG with: Sub-zero multi-zone freezer rack temperature heatmap, ammonia refrigeration compressor SCADA loop, pallet dwell-time telemetry in frost blue and warning amber.",
  93: "Replace placeholder SVG with: Mach 2.8 aerospike exhaust nozzle CFD pressure contour, regenerative cooling manifold thermal gradients, shockwave angle HUD in aerospace titanium and plasma orange.",
  94: "Replace duplicate SVG with: Toroidal magnetic flux surface contour, poloidal field coil current telemetry, neutral beam injection plasma beta equilibrium dial in fusion violet and neon cyan.",
  95: "Replace placeholder SVG with: Subsea jet-trenching depth sonar, umbilical cable tension strain gauges, ROV hydraulic manifold telemetry in abyssal trench indigo and high-visibility yellow.",
  96: "Replace placeholder SVG with: Subsurface 500°C fracture network micro-seismic array, supercritical steam turbine enthalpy balance, downhole pressure transducer gauges in volcanic amber.",
  97: "Replace placeholder SVG with: Sub-nanosecond FPGA packet latency histogram, Chicago-to-NJ microwave link atmospheric attenuation gauges, order-book queue depth in terminal green.",
  98: "Replace placeholder SVG with: Mach 7 schlieren optical shockwave visualization feed, stagnation enthalpy sensor array, boundary layer transition telemetry in carbon weave and plasma red.",
  99: "Replace placeholder SVG with: Hypercar acquisition pipeline matrix, global private collection climate vault telemetry, bespoke transport dispatch timeline in obsidian and brushed platinum.",
  100: "Replace placeholder SVG with: Panamax AIS live vessel tracking chart, Baltic Dry Index fixture rate matrix, bunker fuel voyage optimization calculator in maritime navy and brass.",
  101: "Replace placeholder SVG with: LEO constellation inter-satellite laser pointing & acquisition (PAT) fine steering mirror telemetry, bit-error-rate waterfall, gimbal azimuth angles in orbital black and laser emerald.",
  102: "Replace placeholder SVG with: Bespoke direct lending facility waterfall, borrowing base collateral coverage gauge, covenant compliance matrix in executive navy and gold foil.",
  103: "Replace placeholder SVG with: BESS battery state-of-charge dispatch curve, solar irradiance forecast delta, utility islanding breaker SCADA mimic diagram in grid emerald and solar amber.",
  104: "Replace placeholder SVG with: ISO Class 1 particle counter telemetry, toxic gas distribution sensor matrix, photolithography stepper chamber vacuum gauge in silicon grey and warning amber.",
  105: "Replace placeholder SVG with: Payload fairing acoustic vibration envelope, 3D payload CG mass-properties balance model, orbital injection staging timeline in aerospace blue and launch flame orange.",
  106: "Replace placeholder SVG with: Optical Time-Domain Reflectometer (OTDR) fault localization waveform, repair vessel dynamic positioning (DP2) telemetry, subsea cable splice chamber status in transatlantic cobalt.",
  107: "Replace duplicate SVG with: 10 millikelvin dilution refrigerator multi-stage thermal gradient ladder, qubit coherence T1/T2 telemetry histogram, RF attenuation wiring mimic in cryo cyan and deep violet.",
  108: "Replace placeholder SVG with: Mediterranean/Caribbean live charter itinerary dispatch, vessel AIS position telemetry, crew provisioning status and high-net-worth guest folio HUD in ocean azure and teak gold.",
  109: "Replace placeholder SVG with: Life support O2/CO2 partial pressure loop, Bosch CO2 reduction water recovery telemetry, cabin atmospheric pressure dial in space station titanium and life-support green.",
  110: "Replace placeholder SVG with: Liquid hydrogen (LH2) zero-boil-off cryocooler telemetry, sunshield thermal sun-angle tracker, propellant transfer mass-flow rates in orbital slate and cryogenic cyan.",
  111: "Replace duplicate SVG with: D-T fusion reaction neutron flux rate counter, divertor heat load thermal camera telemetry, magnet quench protection loop in plasma violet and reactor amber.",
  112: "Replace placeholder SVG with: Live YouTube live-chat sentiment velocity sparkline, superchat revenue telemetry waterfall, creator audience retention heatmap in broadcast crimson and neon violet.",
  113: "Replace duplicate SVG with: Qubit state tomography Bloch sphere visualization, dilution stage helium 3/4 mixture circulation SCADA, microwave resonator pulse sequence monitor in quantum indigo.",
  114: "Replace placeholder SVG with: Lunar South Pole Shackleton crater thermal profile, carbothermal regolith reduction reactor O2 yield telemetry, rover sintering feed rate in lunar dust gray and industrial amber."
};

const stockIds = new Set([24, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 82, 85]);

fleet.forEach(v => {
  if (v.id >= 86) {
    v.auditCategory = '[C] MISSING / BROKEN';
    v.categoryTag = 'Category [C]';
    v.categoryLabel = 'Missing / Broken (Placeholder SVG / Duplicate Path)';
  } else if (stockIds.has(v.id)) {
    v.auditCategory = '[A] GENERIC STOCK PHOTO';
    v.categoryTag = 'Category [A]';
    v.categoryLabel = 'Generic Stock Photo (Uncurated Photography)';
  } else {
    v.auditCategory = '[B] RAW SCREENSHOT DUMP';
    v.categoryTag = 'Category [B]';
    v.categoryLabel = 'Raw Screenshot Dump (Shrunk UI / Passkeys)';
  }
  v.recommendedConcept = visualConcepts[v.id] || "Perspective glass cockpit crop of primary telemetry console in dark foundry styling.";
});

// Category counts
const counts = {
  '[A]': fleet.filter(x => x.auditCategory.startsWith('[A]')).length,
  '[B]': fleet.filter(x => x.auditCategory.startsWith('[B]')).length,
  '[C]': fleet.filter(x => x.auditCategory.startsWith('[C]')).length
};

const duplicatePathCollisions = [
  { path: 'assets/covers/commercial-tokamak-fusion-plasma-scada-os-cover.svg', ids: [94, 111], name: 'Commercial Tokamak Fusion Plasma SCADA OS' },
  { path: 'assets/covers/superconducting-quantum-processor-cryostat-os-cover.svg', ids: [107, 113], name: 'Superconducting Quantum Processor Cryostat OS' }
];

const duplicateContentHashes = [
  { hash: 'fe9a3c2c2b5244591aa752c3ca23cfb4', ids: [44, 50], files: ['soul-spice-os-cover.jpg', 'culinary-operational-workspace-os-cover.jpg'], desc: 'Byte-for-byte identical photo of BBQ ribs on wooden board' },
  { desc: 'Visually identical photo of city skyscrapers looking upward', ids: [34, 49], files: ['high-ticket-offer-architect-cover.jpg', 'real-estate-analytics-hub-os-cover.jpg'] }
];

let md = `# FLEET THUMBNAIL AUDIT & REPLACEMENT LEDGER (114 DIGITAL VEHICLES)
**GhostFactoryOS × Aura & Grid Strategic Operations**  
**Audit Sealed:** October 2026 | **Catalog Synchronized:** GhostFactoryOS v1.6.0  
**Fleet Status:** 114 Pre-Revenue Digital Vehicles (86 Track 1 Lean Prototypes + 28 Track 2 Flagships)

---

## 1. EXECUTIVE SUMMARY & FLEET BREAKDOWN

Every vehicle in the Aura & Grid dealership must look like an elite, high-performance executive machine—not a generic stock photo of a dinner plate or a tiny, unreadable browser screenshot.

This audit inspects all **114 vehicle cover images** across the repository (\`site/assets/covers/\`), categorizes visual defects into three critical remediation buckets, identifies duplicate file collisions, and establishes a prioritized replacement plan.

### Visual Asset Distribution
| Audit Category | Count | % of Fleet | Primary Issue Identified | Risk Level |
|---|---:|---:|---|---|
| **[A] GENERIC STOCK PHOTO** | **25** | 21.9% | External uncurated photography (plates of ribs, backyard house, city skyscrapers, model in suit, stock circuit board) with zero software UI or telemetry. | **HIGH (Brand Dilution)** |
| **[B] RAW SCREENSHOT DUMP** | **60** | 52.6% | Shrunk browser windows, 6–8px unreadable text tables, and burned-in temporary "Valet Passkeys" (\`elevate2026\`, \`auramedspa2026\`) in URL bars. | **MEDIUM (Ergonomics & Polish)** |
| **[C] MISSING / BROKEN / PLACEHOLDER** | **29** | 25.4% | Minimalist 4KB vector SVGs with wireframe grids instead of photorealistic SCADA cockpits; 2 file collision pairs (4 vehicles sharing 2 paths). | **CRITICAL (Track 2 Gate Failure)** |
| **TOTAL FLEET AUDITED** | **114** | **100.0%** | **Full portfolio inventory sealed and cataloged** | **ACTION REQUIRED** |

---

## 2. FILE COLLISIONS & DUPLICATION FLAGS

During the binary and MD5 hash audit, **4 critical collisions** were discovered where two completely separate vehicles share either the exact same asset path or identical photographic imagery:

1. **Path Collision #1 (Deep Tech / Track 2):**  
   - \`assets/covers/commercial-tokamak-fusion-plasma-scada-os-cover.svg\`  
   - Shared by **#94 Commercial Tokamak Fusion Plasma SCADA OS** and **#111 Commercial Tokamak Fusion Plasma SCADA OS**.
2. **Path Collision #2 (Deep Tech / Track 2):**  
   - \`assets/covers/superconducting-quantum-processor-cryostat-os-cover.svg\`  
   - Shared by **#107 Superconducting Quantum Processor Cryostat OS** and **#113 Superconducting Quantum Processor Cryostat OS**.
3. **Byte-for-Byte Content Collision #1 (Hospitality):**  
   - \`culinary-operational-workspace-os-cover.jpg\` (Vehicle **#50**) is byte-for-byte identical (MD5: \`fe9a3c2c2b5244591aa752c3ca23cfb4\`) to \`soul-spice-os-cover.jpg\` (Vehicle **#44**). Both show the exact same platter of smoked ribs and fries.
4. **Visual Duplicate Photo #2 (Wealth & Real Estate):**  
   - \`real-estate-analytics-hub-os-cover.jpg\` (Vehicle **#49**) is the exact same stock photograph (upward-angle city skyscrapers) as \`high-ticket-offer-architect-cover.jpg\` (Vehicle **#34**).

---

## 3. THREE-TIER PRIORITIZED REPLACEMENT ROADMAP

\`\`\`
   ┌─────────────────────────────────────────────────────────────┐
   │ TIER 1: TRACK 2 FLAGSHIPS & COLLISIONS (29 Vehicles)         │
   │ Priority: IMMEDIATE | Target: IDs 86–114 (Deep Tech & SCADA)│
   │ Goal: Replace 4KB placeholder SVGs with photorealistic      │
   │ 3D mission control / glass cockpit SCADA telemetry renders. │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ TIER 2: GENERIC STOCK PHOTOGRAPHY SCRUB (25 Vehicles)       │
   │ Priority: HIGH | Target: IDs 24, 34-56, 82, 85             │
   │ Goal: Replace off-the-shelf photos (food, houses, models)   │
   │ with tailored dark-mode executive software UI crops.        │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ TIER 3: RAW SCREENSHOT DUMP REFACTOR (60 Vehicles)          │
   │ Priority: MEDIUM | Target: IDs 1-23, 25-33, 45, 57-81, 83-84│
   │ Goal: Scrub burned-in valet passkeys and browser chrome;    │
   │ re-crop at 60-degree perspective focusing on hero KPIs.    │
   └─────────────────────────────────────────────────────────────┘
\`\`\`

---

## 4. STANDARDIZED IMAGE SPECIFICATION (FOUNDRY COCKPIT STANDARD)

For all new thumbnail generation, every asset must adhere strictly to the **GhostFactoryOS Foundry Display Standard**:

- **Resolution & Aspect Ratio:** Exactly \`1920 × 1080 px\` (16:9 widescreen). No portrait or off-aspect images (e.g. eliminating \`1600x2133\` portrait found in #46).
- **Target Format & Size:** Compressed WebP (primary) + optimized JPEG fallback (target \`< 250 KB\` per cover).
- **Visual Composition:**
  - **No Browser Chrome:** Zero macOS window dots, zero URL address bars, zero tabs, zero localhost/render URLs.
  - **Zero Burned-in Secrets:** Zero visible temporary valet passkeys or test passwords.
  - **Framing:** 3D perspective angle (15° to 30° tilt) or high-focus glass cockpit HUD crop highlighting primary gauges, sparklines, and telemetry widgets.
  - **Color Palette:** Matte foundry dark background (\`#0a0a0a\` to \`#141414\`), high-contrast crisp typography, with domain-specific accent lighting (e.g. laser cyan for quantum, solar amber for geothermal, radar emerald for defense/energy).

---

## 5. COMPREHENSIVE 114-VEHICLE AUDIT LEDGER

The following table provides the complete, vehicle-by-vehicle inspection ledger across all 114 cataloged models:

| ID | Vehicle Name | Sector | Track | Current Image Source | Dims & Format | Audit Category | Recommended Visual Concept |
|---:|---|---|:---:|---|---|:---:|---|
`;

fleet.forEach(v => {
  const trackStr = v.isTrack2 ? 'Track 2' : 'Track 1';
  const dimsStr = `${v.width}×${v.height} (${v.format}, ${v.sizeKb}KB)`;
  const catShort = v.auditCategory.split(' ')[0]; // [A], [B], or [C]
  md += `| **#${v.id}** | **${v.name}** | ${v.sector} | ${trackStr} | \`${v.imgSrc}\` | ${dimsStr} | **${catShort}** | ${v.recommendedConcept} |\n`;
});

md += `
---

## 6. AUDIT VERIFICATION METRICS

- **Total Vehicles Scanned:** 114 / 114 (100% catalog coverage)
- **Track 1 Lean Rapid-Sale Models:** 86
- **Track 2 Flagship $10K+ Models:** 28
- **Duplicate Path Collisions:** 2 pairs (4 vehicles)
- **Duplicate Content Hashes:** 2 pairs (4 vehicles)
- **Zero-UI Photographic Stock Images:** 25 vehicles
- **Raw Screenshot Browser Dumps:** 60 vehicles
- **Vector Wireframe Placeholders:** 29 vehicles

---

## 7. NEXT 3 MOVES

1. **Move 1 (Decouple & Fix Duplicate Paths):**  
   Create dedicated distinct asset files for #94 vs #111 and #107 vs #113 so no two cataloged vehicles share the same SVG cover path.
2. **Move 2 (Replace Tier 1 Flagship SVGs):**  
   Generate high-fidelity, photorealistic 16:9 cockpit SCADA renders for the 28 Track 2 Flagships to satisfy Gate #4 and justify the $14,500 buyout anchor.
3. **Move 3 (Scrub Passkeys & Replace Tier 2 Stock Photos):**  
   Batch-replace the 25 food/house/suit stock photos with dark-mode software telemetry crops and scrub burned-in passkeys from #5, #8, #9, and #10.
`;

const outputPath = '/Users/gmane/Documents/ZoMae Media LLC/Aura & Grid/fleet_thumbnail_audit.md';
fs.writeFileSync(outputPath, md, 'utf8');
console.log('Successfully generated:', outputPath);
console.log('Total characters:', md.length);
