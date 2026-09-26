# 🌌 MIDNIGHT EXPRESS // DESIGN TOKENS SYSTEM & CUSTOMIZATION GUIDE

Welcome to the **Midnight Express** global design token system framework documentation. This system regulates all typographic, volumetric, metric, acoustic, and coloring parameters of the drive-thru template. 

End-buyers on platforms like **Gumroad** can leverage this single reference to effortlessly customize, re-brand, or extend the assets to fit any high-octane nocturne aesthetics.

---

## 🎨 1. CORE COLOR MATRIX

Our palette blends surgical cybernetic contrasts with high-visibility warnings. Custom hues are built purely in **Tailwind CSS**.

| Color Segment | HEX Value | Tailwind Utility Class | Purpose / Application |
| :--- | :--- | :--- | :--- |
| **Electric Lotus Pink** | `#FF3366` | `bg-[#FF3366]` / `text-[#FF3366]` | High-voltage primary brand accents, triggers, active tabs, outline brackets, and checkout CTAs. |
| **Toxic Acid Green** | `#00FF66` | `bg-[#00FF66]` / `text-[#00FF66]` | Diagnostic telemetry reports, success indicators, secure logistics links, active pipelines, and countdown windows. |
| **Cyber Onyx Black** | `#0A0A0A` | `bg-[#0A0A0A]` | Primary dark baseline canvas background for high-fidelity eye-safety and contrast. |
| **Coal Silt Dark** | `#111111` | `bg-[#111111]` / `bg-[#121212]` | Secondary panel containers, headers, tickers, borders, and input fields. |
| **Pure White** | `#FFFFFF` | `text-white` | Highly readable typography accents, focus marks, and primary labels. |

---

## ✍️ 2. TYPOGRAPHY MATRIX

We use a layered triple-font pairing strategy imported from **Google Fonts** inside `src/index.css`.

### A. Display Headings
*   **Font Family**: `Space Grotesk` (Sans-Serif, high tracking-tight, weights: 500-800)
*   **Import CSS Utility**: `.font-display`
*   **Ideal Size**: `text-4xl`, `text-5xl`, `text-6xl`
*   **Vibe**: Bold, assertive, brutalist-tech, modern Swiss look.

### B. Standard UI Body Text
*   **Font Family**: `Inter` (Sans-Serif, multi-weight, weights: 400-700)
*   **CSS Class**: `font-sans` (Default body baseline font)
*   **Ideal Size**: `text-xs`, `text-sm`, `text-md`
*   **Vibe**: Extremely legible, balanced letter spacing, standard interface neutrality.

### C. Telemetry Readouts & Data Logs
*   **Font Family**: `JetBrains Mono` (Monospace, weights: 400-700)
*   **CSS Class**: `font-mono`
*   **Ideal Size**: `text-[9px]`, `text-[10px]`, `text-xs`
*   **Vibe**: Technical diagnostic logs, currency readouts, vehicle plates, calculations.

---

## 📐 3. LAYOUT & SPACING MATRIX

Fluidity layout bounds are secured with generous negative space ratios to maintain pristine grid structure on any terminal.

```
       [ Grid Bound System: w-full max-w-7xl mx-auto ]
  +---------------------------------------------------------+
|                  [ HEADER SYSTEM: py-3 px-6 ]             |
|  +-----------------------------------------------------+  |
|  | CULINARY ENGINE | LOGISTICS | TERMINAL | AUDIO ON   |  |
|  +-----------------------------------------------------+  |
|                                                           |
|                  [ CORE VIEWPORT: py-8 px-6 ]             |
|   +-----------------------+     +-----------------------+ |
|   |                       |     |                       | |
|   |     GRID COL-12:      |     |     GRID COL-12:      | |
|   |     lg:col-span-6     |     |     lg:col-span-6     | |
|   |                       |     |                       | |
|   +-----------------------+     +-----------------------+ |
|                                                           |
|             [ INFINITE MARQUEE TICKER: p-2.5 ]            |
  +---------------------------------------------------------+
```

*   **Grid Padding Bounds**: `px-6 py-8 md:px-12`
*   **Borders & Outlines**: `border border-white/5` with discrete laser bracket margins.
*   **Micro-Interaction Hover Scale**: `scale-95 group-hover:scale-100 transition-all duration-300`

---

## 🔊 4. ACOUSTIC ENVIRONMENT & FREQUENCIES

A key aspect of template luxury is the Web Audio API synthesizer. Acoustic triggers are managed via `/src/utils/audio.ts`.

### A. Core Ambient Drone
*   **Base Frequency**: **`80 Hz`** (Low-sine engine hum representing heavy thermal kitchen burners)
*   **Oscillator Type**: `sawtooth` passed through a **`110Hz Lowpass Biquad Filter`** to shave off harsh harmonics.
*   **Dynamic Range**: Standardized peak idle gain at `0.1`, peaking up to `0.8` on micro-cinematic transitions.

### B. Interactive SFX Frequencies
1.  **Neon Chime Trigger**:
    *   **Carrier Core**: Sine Waves at `880 Hz` decaying to `440 Hz`.
    *   **Impulse Vibe**: Cybernetic UI chime feedback.
2.  **Searing Wok Sizzle**:
    *   **Acoustic Texture**: High frequency dynamic white noise generation.
    *   **Vibe**: Simulates hot oil sizzle upon wok sensor changes.
3.  **Mechanical Hardware Thud**:
    *   **Carrier Core**: Triangle wave dropping rapidly from `180 Hz` to `10 Hz` over `0.2s`.
    *   **Filter Type**: `lowpass` at `200 Hz`.
    *   **Vibe**: Heavy metallic pneumatic latch closing on tab changes.

---

## 🚀 5. CUSTOMIZATION STEP-BY-STEP

### Rename the Storefront
1.  Navigate to `src/App.tsx` and look for `<header>` or footer references.
2.  Modify variables or strings to adjust branding to e.g. "MIDNIGHT ROAST // CYBERNETIC COFFEE".

### Swapping Accent Colors
1.  Open `/src/index.css` and apply custom overrides, or update classes like `border-[#FF3366]` or `bg-[#00FF66]` with your specific HEX codes.

### Changing Menu Items
*   All menu items are securely structured in `/src/data.ts`. Edits there will dynamically adjust both pricing totals and prep times automatically!
