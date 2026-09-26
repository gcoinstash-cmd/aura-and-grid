# ✨ Serenity Website Template & Wellness Portal

Welcome to **Serenity**, a production-ready, ultra-premium single-page marketing website and interactive wellness portal. Designed specifically to be sold on Gumroad, this template delivers a distinctive, high-end, minimalist aesthetic reminiscent of world-class design houses and luxury spas.

It couples elegant typography and spacious layouts with interactive client-side systems to maximize visitor dwell time and conversion velocity.

---

## 🎨 Design Philosophy & Highlights

*   **Dual-Aura Ambient Architecture:** Includes a seamlessly integrated theme engine allowing visitors to toggle between **Obsidian Black** (ambient, deep night mode) and **Alabaster Sand** (bright, crisp, off-white luxury brand mode) with responsive layout transitions.
*   **The Guided Breathing Ritual (Dwell-Time Booster):** An interactive, client-side breath control module that guides visitors through relaxation cycles (Inhale, Hold, Exhale). It naturally slows down users and establishes trust before they book.
*   **Highly Practical Treatment Menu:** An accordion-style service navigator that filters listings dynamically (All, Body, Hydro, Skin Medicine) using native details tags for zero re-render stutters.
*   **Zero AI-Residue Copy:** Tailored to reflect clean, professional, human-authored copy. Avoids tech-centric phrasing to remain easily adaptable for global spa owners, boutique hotels, physical therapy offices, or meditation retreats.

---

## 🛠️ Step-by-Step Customization Guide

This template has been engineered to be customized in under 10 minutes without deep React knowledge.

### 1. Update Your Brand Name & Logo
Open `src/App.tsx` and find the header section. Replace `SERENITY` with your brand name:
```tsx
// Inside src/App.tsx
<span className="font-sans text-xs tracking-[0.3em] font-medium uppercase">
  YOUR_BRAND_NAME
</span>
```

### 2. Customize the Spa/Clinic Treatments
Our menu loads from a structured, single state array located at the very top of `src/App.tsx`. Simply update the names, durations, and pricing in `RITUAL_CATEGORIES_DATA`:
```tsx
const RITUAL_CATEGORIES_DATA = [
  {
    name: "Massages & Therapeutic Bodywork",
    items: [
      "Signature Deep Tissue Massage | 60 Min / $150",
      "Organic Basalt Warm Stone Therapy | 75 Min / $185",
      // Add or remove items easily in this format
    ]
  },
  // Add other categories here...
];
```

### 3. Adjust the Interactive Breathing Pace
The breathing guide's cadence can be tuned to match your brand's preferred rhythm (e.g. Box Breathing or custom cycles).
Open `src/components/BreathingSanctuary.tsx` to alter the phase cycle durations or the typography labels.

### 4. Change the Location & Contact Form
The physical address card and interactive Map preview are easily updated. Search for the `#location` section in `src/App.tsx` and input your actual address lines and phone numbers.

---

## 🚀 Getting Started & Deploying

### Prerequisites
*   [Node.js](https://nodejs.org/) (Version 18 or above recommended)
*   [npm](https://www.npmjs.com/) 

### Local Development
1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the high-performance local development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) to view the live app!

### Manufacturing a Production Build
To bundle the application into a hyper-optimized static build inside the `/dist` directory for lightning-fast loading speeds on any hosting provider (Vercel, Netlify, Cloudflare Pages, or Github Pages):
```bash
npm run build
```

---

## 💎 Tips for Selling this Template on Gumroad

1.  **Take Distinctive High-Res Screenshots:** 
    *   Take mock screenshots showing both the dark **Obsidian Noir** layout and the light **Alabaster Sand** layouts.
    *   Capture close-ups of the **Treatment Menu** expanded view and the **Interactive Breathing Ritual** ring while active.
2.  **Highlight the Interactive Value:** Use keywords in your Gumroad listing like *"Dynamic Dwell-Time Breathing Engine"*, *"Responsive Multi-Theme Layout"*, and *"Pristine Minimalist Tailwind Code"* to prove it’s not just another basic static landing page.
3.  **Include this README in the ZIP:** Package this `README.md` directly into the template delivery folder so your buyers get an elite onboarding experience the second they download your files.
