# 🎨 GHOST FACTORY™ MASTER SECTOR DESIGN SYSTEM
## Visual Archetypes, Brand Design Tokens & High-Conversion Storefront Packaging Guide

> **Creative Director Mandate**:
> *"Never delegate taste, brand identity, or aesthetic judgment to autonomous defaults. Agents produce average patterns unless bound by strict compositional laws. Every industry has a distinct visual soul: a legal trial platform cannot look like a medspa, and a field dispatch board cannot look like a fine dining atelier."*

---

## 🏛️ PART 1: THE 5 INDUSTRY VISUAL ARCHETYPES

```
+----------------------------------------------------------------------------------------------------+
| 🧭 SECTOR DESIGN ARCHETYPE MATRIX                                                                  |
+-------------------+-----------------------------+-------------------------------+------------------+
| ARCHETYPE         | INDUSTRIES / NICHES         | TYPOGRAPHIC PAIRING           | PRIMARY ACCENT   |
+-------------------+-----------------------------+-------------------------------+------------------+
| 1. EDITORIAL      | Legal, Wealth, Family       | Newsreader / Cormorant +      | Champagne Gold   |
|    DOSSIER        | Office, M&A, Advisory       | Inter / Plus Jakarta Sans     | (#C5A880)        |
+-------------------+-----------------------------+-------------------------------+------------------+
| 2. COMMAND        | Trades (HVAC/Electric/Roof),| Space Grotesk / Chivo +       | Electric Blue    |
|    CENTER         | Fleet Dispatch, Heavy Equip | JetBrains Mono / Inter        | (#3B82F6)        |
+-------------------+-----------------------------+-------------------------------+------------------+
| 3. LUXURY         | Hospitality, Fine Dining,   | Bodoni Moda / Cormorant +     | Muted Bronze     |
|    ATELIER        | Scent, Horology, Yachts     | Neue Montreal / DM Sans       | (#9E8465)        |
+-------------------+-----------------------------+-------------------------------+------------------+
| 4. MATRIX         | Fintech, Quant Capital,     | JetBrains Mono / Space G. +   | Cyan Data        |
|    GRID           | Real Estate Analytics, SaaS | Geist / IBM Plex Sans         | (#06B6D4)        |
+-------------------+-----------------------------+-------------------------------+------------------+
| 5. CLINICAL       | MedSpas, Functional Med,    | Syne / Plus Jakarta Sans +    | Clinical Frost   |
|    VANGUARD       | Physical Therapy, Longevity | Inter / Figtree               | (#00F2FE)        |
+-------------------+-----------------------------+-------------------------------+------------------+
```

---

### 1. The Editorial Dossier
* **Target Verticals**: Commercial Litigation, Wealth Advisory, Sovereign Family Office, Lower Middle-Market M&A, Retained Executive Search, Boutique Law.
* **Aesthetic Philosophy**: Understated institutional power. Evokes high-stakes boardrooms, federal trial war rooms, confidential deal memos, and leather-bound ledgers. Zero bubble corners, zero playful emojis, zero neon party colors.
* **Design Tokens**:
  * Canvas / Base: `#08090A` (Deep Obsidian Ink)
  * Surface Card: `#111215` / Border: `#27272A` (1px razor-sharp rule)
  * Primary Accent: `#C5A880` (Champagne Gold) / `#D4AF37`
  * Secondary Accent: `#71717A` (Muted Zinc)
  * Typography: Primary Headings: `Newsreader` or `Playfair Display` (Serif, High Contrast); Body & Metadata: `Inter` or `Plus Jakarta Sans` (Crisp Geometric Sans).
  * Border Geometry: `rounded-none` or `rounded-sm` (Never round or pill-shaped cards).
* **Signature UI Modules**:
  * Case Docket & Matter Ledgers with timestamps and state flags (`ACTIVE_DOCKET`, `VDR_ENCRYPTED`).
  * Escrow / Capital Allocation Breakdown tables.
  * Side-by-side split screen with document preview on the left and metadata inspection on the right.

---

### 2. The Command Center
* **Target Verticals**: Field Trades (HVAC, Electrical Dispatch, Commercial Roofing, Plumbing), Freight Logistics, Mobile Fleet, Towing & Equipment Rental.
* **Aesthetic Philosophy**: Rugged, tactical, high-velocity utility. Built for field dispatchers, shop managers, and crews working under sunlight or in cabs. High-contrast telemetry, visible status flags, zero fragile micro-text.
* **Design Tokens**:
  * Canvas / Base: `#0C0E12` (Slate Charcoal)
  * Surface Card: `#161B22` / Border: `#2A3441`
  * Primary Accent: `#3B82F6` (Electric Dispatch Blue)
  * Status Tokens: `#10B981` (En Route / Complete), `#F59E0B` (Assigned), `#EF4444` (Emergency Callout)
  * Typography: Primary Headings: `Space Grotesk` or `Chivo` (Technical, Bold); Body & Telemetry: `JetBrains Mono` or `Inter`.
  * Border Geometry: `rounded-md` with 2px high-visibility active outlines.
* **Signature UI Modules**:
  * Live Triage Queue with technician tags, truck numbers, and countdown timers.
  * Interactive Multi-Stage Quote / Sizing Calculator.
  * Rapid Job Status Kanban Board with 44px tap targets.

---

### 3. The Luxury Atelier
* **Target Verticals**: Michelin Counter Dining, Supper Clubs, Bespoke Olfactory/Fragrance, Horology Vaults, Superyacht Charters, Private Island Villas.
* **Aesthetic Philosophy**: Atmospheric, sensory, whispered exclusivity. Generous negative space, editorial photography, delicate framing, and cinematic quiet luxury.
* **Design Tokens**:
  * Canvas / Base: `#050505` (Deep Velvet Black)
  * Surface Card: `#0D0D0E` with subtle backdrop blur (`backdrop-blur-md`)
  * Primary Accent: `#9E8465` (Warm Muted Bronze) / `#E2D9CE` (Parchment Silk)
  * Typography: Primary Headings: `Bodoni Moda`, `Cormorant`, or `Italianno` (Refined High-Fashion Serif); Body: `Neue Montreal` or `DM Sans`.
  * Border Geometry: `rounded-none` with hair-thin `rgba(255, 255, 255, 0.08)` borders.
* **Signature UI Modules**:
  * Timeline & Station Reservation Matrix (Time-slot grids for chef tables, seats, or yacht charters).
  * Olfactory / Material Ingredient Breakdown pyramid.
  * Provenance & Serial Number Certificate Verification Cards.

---

### 4. The Matrix Grid
* **Target Verticals**: Quantitative Hedge Funds, Real Estate Analytics, Crypto Asset Vaults, Cap Table Engines, Developer Infrastructure.
* **Aesthetic Philosophy**: Dense financial terminal meets cyberpunk telemetry. High data density, monospaced ledger feeds, live latency counters, and modular bento grids.
* **Design Tokens**:
  * Canvas / Base: `#090A0F` (Midnight Carbon)
  * Surface Card: `#13151F` / Border: `#1F2336`
  * Primary Accent: `#06B6D4` (Cyan Data Stream) / `#8B5CF6` (Violet Compute)
  * Typography: Headings & Numbers: `JetBrains Mono` or `Space Grotesk`; Body: `Geist` or `IBM Plex Sans`.
  * Border Geometry: `rounded-sm` with subtle grid background pattern (`rgba(6, 182, 212, 0.04)`).
* **Signature UI Modules**:
  * Live Streaming Ledger & Transaction Ticker.
  * Interactive Yield & Underwriting Sensitivity Sliders.
  * Cap Table / Liquidation Cascade Bento Charts.

---

### 5. Clinical Vanguard
* **Target Verticals**: VIP MedSpas, Functional Longevity Medicine, Cryotherapy & Hyperbaric Suites, Biomechanical Physical Therapy, Sports Performance Labs.
* **Aesthetic Philosophy**: Precision health meets hyper-clean clinical sanctuary. Pristine contrast, diagnostic telemetry, calming dark-mode cyan glows, and patient intake steppers.
* **Design Tokens**:
  * Canvas / Base: `#070B0E` (Clinical Obsidian Cyan)
  * Surface Card: `#10171D` / Border: `#1E2C37`
  * Primary Accent: `#00F2FE` (Clinical Frost Cyan) / `#38BDF8` (Bio-Blue)
  * Typography: Headings: `Syne` or `Plus Jakarta Sans` (Modern High-Tech Sans); Body: `Inter` or `Figtree`.
  * Border Geometry: `rounded-xl` with crisp, clean structural padding.
* **Signature UI Modules**:
  * Chamber & Treatment Suite Interactive Booking Matrix.
  * Multi-Stage Patient Biomarker & Medical Intake Stepper.
  * Rehabilitation Modality & Recovery Protocol Checklist.

---

## 🖼️ PART 2: THE STOREFRONT ASSET COMPOSITIONAL STANDARD

> ⛔ **THE PERMANENT ANTI-GENERIC LAW**:
> Flat viewport screenshots of landing page hero text are **STRICTLY FORBIDDEN**.
> Every product cover and thumbnail must look like an engineered digital software asset, elevated inside floating UI hardware with high-contrast typography, sector badge hierarchy, and technical proof chips.

```
+----------------------------------------------------------------------------------------------------+
| 📐 GUMROAD PRODUCT COVER COMPOSITION (1280x720 — 16:9 WIDESCREEN)                                  |
+----------------------------------------------------------------------------------------------------+
| [CANVAS: Obsidian Base #08090A + Sector Radial Ambient Glow]                                      |
|                                                                                                    |
| 🏷️ [SECTOR PILL BADGE: e.g. "LEGAL PRACTICE OS • TURNKEY BLUEPRINT" in Gold/Cyan]                |
| 🔤 [HEADLINE: 38px Bold Archetype Heading — e.g. "LITIGATION OPS OS"]                             |
| 📝 [SUBTITLE: 16px Clean Subtitle — e.g. "Commercial Trial War Room & E-Discovery Command Center"]|
|                                                                                                    |
|            +-------------------------------------------------------------------------+             |
|            | 💻 FLOATING ELEVATED BROWSER CONTAINER (Drop Shadow 36px)               |             |
|            | [● ● ●]  https://litigation-ops-os.preview/docket                       |             |
|            |-------------------------------------------------------------------------|             |
|            |                                                                         |             |
|            |   [ACTUAL INTERNAL WORKFLOW UI: Case Dockets, Data Tables, Grids]       |             |
|            |   (NOT generic hero text — showcases the real application power!)       |             |
|            |                                                                         |             |
|            +-------------------------------------------------------------------------+             |
|                                                                                                    |
| 🛡️ [CHIPS: React 19]   [Tailwind CSS]   [Supabase RLS Engine]   [Commercial Agency License]        |
+----------------------------------------------------------------------------------------------------+
```

```
+----------------------------------------------------+
| 📐 GUMROAD PRODUCT THUMBNAIL (600x600 — 1:1 SQUARE)|
+----------------------------------------------------+
| [CANVAS: High-Contrast Archetype Base + Gradient]  |
|                                                    |
|  🏷️ [SECTOR BADGE]                                 |
|                                                    |
|  🔤 [BOLD SHORT TITLE: e.g. "LITIGATION OPS"]      |
|                                                    |
|  +----------------------------------------------+  |
|  | 🔍 FOCUSED MACRO-CROP OF CORE UI MODULE      |  |
|  | (Zoomed view of Table, Stepper, or Matrix)   |  |
|  +----------------------------------------------+  |
|                                                    |
|  ✨ [VERIFIED 85-ASSET MASTER VAULT BADGE]         |
+----------------------------------------------------+
```

---

## 🛠️ PART 3: AUTOMATED GENERATION SPECIFICATIONS

Every generation engine must output both formats into:
1. `dist/gumroad_assets/<slug>/cover.png` (1280x720, >80 KB, Crisp UI typography)
2. `dist/gumroad_assets/<slug>/thumbnail.png` (600x600, >50 KB, High-contrast mobile crop)
3. Standardized distribution mirror: `dist/<slug>/<slug>-cover.jpg` and `dist/<slug>/<slug>-thumbnail.jpg`.
