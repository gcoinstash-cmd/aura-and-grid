# Aethel Atelier Framework — Implementation & Customization Guide

Welcome to the **Aethel Atelier Architecture Framework**. This enterprise-grade SPA is designed specifically for premium direct-to-consumer (D2C) brands, high-end bespoke artisans, and specialized luxury agencies. By focusing on deep, narrative-driven interactive storytelling coupled with precise sizing engines, this digital asset empowers buyers to bridge the physical gap between client-side visualization and physiological reality.

---

## 1. System Architecture & Directory Layout

The application utilizes a modular, highly performant React 18 + Vite configuration powered by Tailwind CSS and `motion`. Key components have been isolated to ensure robust modular scaling and to bypass token limits during complex upgrades:

```bash
├── DEVELOPER_DOCUMENTATION.md    # This premium guides file
├── package.json                   # Dependency declarations & build orchestration
├── vite.config.ts                 # Asset compiler configurations
├── src/
│   ├── App.tsx                    # Layout orchestrator, global hooks, and modal contexts
│   ├── main.tsx                   # Standalone DOM entrypoint
│   ├── index.css                  # Global styling, Tailwind imports, and custom theme overrides
│   ├── types.ts                   # Unified system types, interfaces, and options definitions
│   ├── data.ts                    # Single Source of Truth (SSOT) static database (curated products & sourcing specs)
│   ├── components/
│   │   ├── Hero.tsx               # Cinematic primary entrance screen
│   │   ├── ProductMatrix.tsx      # Curated inventory grid featuring multi-tiered scarcity states
│   │   ├── Anatomy.tsx            # The "Anatomy of Craft" interactive vector mapping board
│   │   ├── SizingPortal.tsx       # Multi-step anatomical sizing portal with real-time sensing visualization
│   │   └── EnterpriseUpsell.tsx   # Premium concierge lead generation utility
```

---

## 2. System Variables & Reskinning

The visual aesthetic of the Aethel Atelier framework is configured using standard Tailwind CSS v4 variables defined inside `src/index.css`. To pivot the applet to target an entirely different brand landscape, modify the CSS custom variables to update fonts and colour accents system-wide.

### Global CSS Theme Definition (`src/index.css`)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  /* Brand-Driven Color Palette */
  --color-bg-primary: #050505;       /* Deep charcoal primary background space */
  --color-bg-secondary: #0A0A0A;     /* Soft overlay canvas for inner cards and modals */
  --color-bg-tertiary: #191919;      /* Borders, lines, grids, block dividers */
  --color-accent: #C5A880;           /* Signature champagne gold luxury primary accent */
  --color-text-primary: #F5F5F7;     /* High-legibility modern neutral text */
  --color-text-secondary: #8E8E93;   /* Muted technical subtexts and utility labeling */

  /* Typographic Hierarchy Selection */
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Playfair Display", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, monospace;
}
```

### Brand Aesthetic Presets

| Brand Vibe | `--color-accent` | Display Font Family | Sans Font Family | Style Application |
| :--- | :--- | :--- | :--- | :--- |
| **Swiss Minimalist** | `#D4AF37` (Aura Gold) | `Helvetica neue` / `Inter` | `Inter` (sans) | Perfect for modern prestige watchmaking and minimal high-contrast layouts. |
| **English Heritage** | `#1A4329` (British Racing Green) | `Playfair Display` (serif) | `Inter` (sans) | Tailor-made for bespoke London tailors, bootmakers, and traditional leather goods. |
| **Neo-Brutalist** | `#FF3333` (Hazard Red) | `Space Grotesk` (sans-display) | `JetBrains Mono` (mono) | Ideal for forward-thinking premium techwear, concept design studios, or hyper-modern jewelry houses. |

---

## 3. Multi-Niche Architectural Mapping

The **Anatomy of Craft** component (`src/components/Anatomy.tsx`) represents a state-of-the-art interactive vector mapping interface. By altering the vector graphic and updating coordinates mapped in `src/data.ts` and `src/components/Anatomy.tsx`, you can dynamically repurpose this layout across other luxury verticals:

```typescript
// Blueprint Schema located in src/types.ts
export interface BlueprintSpec {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  sourcing: string;
  origin: string;
  longevity: string;
  image?: string; // High-resolution Unsplash photo URL
}
```

---

### A. Luxury Watchmaking (Bespoke Horology)
*Map the interactive coordinate anchors around an active mechanical watch calibre framework.*

* **Vector Blueprint Concept**: Front-profile exploded or rear exhibition-back configuration showing the bridges, balance wheel, and hand alignment.
* **Component Anchor Layout Mapping**:
  1. **Anchor 01: The Mechanical Movement** (Placement coordinates: Center gear-train `top-[45%] left-[50%]`)
  2. **Anchor 02: Hand-Finished Case** (Placement coordinates: Perimeter outer bezel `top-[15%] left-[20%]`)
  3. **Anchor 03: The Galvanic Dial** (Placement coordinates: Face region `top-[32%] left-[48%]`)
  4. **Anchor 04: The Alligator Strap** (Placement coordinates: Lug endpoints `top-[85%] left-[75%]`)

#### Suggested Watchmaking Database Mapping Specs:
```typescript
{
  id: "movement",
  number: "01",
  title: "The In-House Calibre",
  subtitle: "Micro-Mechanical Symphony",
  sourcing: "Double-barrel hand-wound mechanism with hand-chamfered bridges, Geneva stripes, and a solid silicon escape wheel.",
  origin: "Vallée de Joux, Switzerland",
  longevity: "Undergoes 600 hours of continuous chronometric testing. Engineered to maintain atomic precision across centuries."
}
```

---

### B. Bespoke Tailoring (Savile Row Suitmaking)
*Map coordinates over a structured chest piece or master paper pattern.*

* **Vector Blueprint Concept**: Cross-section silhouette of a bespoke double-breasted lounge jacket highlighting internal chest canvas layers.
* **Component Anchor Layout Mapping**:
  1. **Anchor 01: Standard Pattern Drafting** (Placement coordinates: Shoulder curvature seam bounds `top-[18%] left-[65%]`)
  2. **Anchor 02: Float Canvas Construction** (Placement coordinates: Lapel lining chest block `top-[48%] left-[45%]`)
  3. **Anchor 03: The Lapel Roll** (Placement coordinates: Lapel fold crest `top-[38%] left-[32%]`)
  4. **Anchor 04: Hand-Stitched Buttonholes** (Placement coordinates: Lower cuff or front closure point `top-[82%] left-[28%]`)

#### Suggested Tailoring Database Mapping Specs:
```typescript
{
  id: "canvas",
  number: "02",
  title: "Horsehair Canvas Core",
  subtitle: "Living Internal Sculpting",
  sourcing: "Floating chest piece created from unbleached flax fibers blended and woven with hand-combed horsehair.",
  origin: "Biella Mills, Piedmont, Italy",
  longevity: "Dynamically molds to your unique shoulder slope and rib structure over 10 wearings; establishes lifetime drape."
}
```

---

### C. Fine Jewelry & Gemology (High-Jewelry Manufacture)
*Map anchor coordinates to a highly structural multi-tiered ring or necklace layout.*

* **Vector Blueprint Concept**: High-density geometric wireframe of an emerald-cut diamond ring showing claw alignments and basket proportions.
* **Component Anchor Layout Mapping**:
  1. **Anchor 01: Gem Selection / Curation** (Placement coordinates: Solitaire crown center `top-[12%] left-[50%]`)
  2. **Anchor 02: Basket & Setting Architecture** (Placement coordinates: Prong support mounts `top-[42%] left-[40%]`)
  3. **Anchor 03: Metal Refinement & Casting** (Placement coordinates: Lower structural band ring `top-[80%] left-[50%]`)
  4. **Anchor 04: Polish Profile Inspection** (Placement coordinates: Side facet edge reflectives `top-[28%] left-[68%]`)

#### Suggested Fine Jewelry Database Mapping Specs:
```typescript
{
  id: "setting",
  number: "03",
  title: "The Platinum Basket Setting",
  subtitle: "Tension & Light Refraction",
  sourcing: "Specially formulated 950-grade solid platinum matrix wire, hand-pulled to maximize tensile hold on precious minerals.",
  origin: "Kyoto Artisan Foundry, Japan",
  longevity: "Non-corrosive structure immune to wear. Engineered to safely lock the gem core forever against physical shock."
}
```

---

## 4. Scarcity & Drop Mechanics

To adjust inventory counts, change available items, or introduce new collection models, alter the data declarations in `src/data.ts`. The system recognizes three status indicators which dynamically configure UI flags across the workspace:

```typescript
// Status types options
status?: 'available' | 'limited' | 'sold_out';
```

- **`available`**: Renders clear `[ REGULAR BATCH CURATION ]` details; CTA remains `[ SECURE PAIR ]`.
- **`limited`**: Displays an active glowing pulse alongside the relative countdown marker: `[ LIMITED BATCH: {inventoryCount} PAIRS REMAINING ]`.
- **`sold_out`**: Transitions product panels to `[ CURRENT BATCH FULLY SIGNED ]` and safely proxies CTAs to trigger the interactive bespoke reservation queue waitlist.

This technical framework acts as a highly customizable blueprint that allows modern luxury businesses to curate their physical heritage digitally.
