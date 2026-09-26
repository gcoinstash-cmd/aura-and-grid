# Perspective — A luxury editorial portfolio template for architects

Perspective is a meticulously crafted, grid-driven portfolio system designed specifically for premium architects, design studios, and interior designers, optimized for high-ticket Gumroad marketplace strategies. 

---

## 📐 Key Features

1. **Strict 12-Column Grid Layout**: Every section is aligned to a draft board matrix, utilizing fine line decoration rules to give a tactile, technical editorial structure.
2. **Signature Blueprint View**: Switch seamlessly between architectural photography/rendering models and interactive white-on-blue vector blueprint sheets with gravity anchors, elevations, and CAD blocks.
3. **Exhibition-Style Specifications Table**: A highly organized spec table with fine rules, bold uppercase labels, and generous margins matching museum wall text standards.
4. **Three Built-in Homepage Variants**: Toggle between Monograph landing pages, Practice profile pages, and residential showcase layouts according to client preferences.
5. **Contextual Copy Prompts Vault**: Built-in template copywriting prompts that assist boutique architects write compelling brand statements without friction.

---

## 🚀 Directory Walkthrough

```
/src
  ├── App.tsx                  # Sitemap view router, header, footer, & split container
  ├── types.ts                 # Strong TypeScript models (Project, Specs, Post, Biography)
  ├── data.ts                  # Static copy databases, manual configs, and project details
  ├── index.css                # Tailwind CSS v4 variables, custom CAD grid backgrounds
  └── components/
        ├── AisGraphics.tsx    # Crisp high-performance vector schematic render / blueprint modules
        ├── AppUi.tsx          # Multi-tab customization toolkit console & sales helpers
        ├── HomeView.tsx       # Dynamic homepage templates (Monograph, Studio-forward, Bento)
        ├── ProjectsView.tsx   # Visual grid index with instant category filtering
        ├── DirectCase.tsx     # Case Study with technical Specs and CAD lightboxes
        ├── StudioView.tsx     # Detailed studio overview with principles biographies
        └── JournalView.tsx    # Research publishing center
```

---

## 🛠️ Customize Typography & Brand Styles

Bespoke material tones are declared directly via Tailwind CSS v4 inside `/src/index.css`:
* **Bone Background (`#FAF8F5`)**: High contrast, warm, and comfortable for screen viewing.
* **Muted Bronze Light (`#A38E6B`) / Dark (`#6D5B41`)**: Gives architectural warmth to lines and micro buttons.
* **Serif Headings (`Cormorant Garamond`)**: Museum monograph editorial aesthetic.
* **Status Labels (`JetBrains Mono`)**: Strict, clean engineering labels.

---

## 📝 Setup Guidelines

1. **Swapping Plans**: Export Revit, AutoCAD, or Rhino blueprints as white line vector SVGs. Replace the paths inside `/src/components/AisGraphics.tsx` under the corresponding project.
2. **Updating Specifications**: Change project metrics directly in `/src/data.ts` inside `ARCHITECTURE_PROJECTS`. The database will propagate throughout the entire sitemap instantly.
3. **Using AI Prompts**: Use our embedded Prompt Vault on Gumroad to let clients fill out high-polish essays in seconds using standard LLMs.

---

Designed for Boutique Excellence. 2026 Perspective Architectural Studio collective.
