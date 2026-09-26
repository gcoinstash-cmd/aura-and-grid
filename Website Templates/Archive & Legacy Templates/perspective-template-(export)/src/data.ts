import { Project, JournalPost, StudioProfile, CopyPromptItem } from './types';

export const ARCHITECTURE_PROJECTS: Project[] = [
  {
    id: 'stone-monolith',
    title: 'The Stone Monolith',
    subtitle: 'Residential Retreat overlooking Lake Lugano',
    abstract: 'A quiet, cast-concrete structure embedded directly into the Swiss mountain slopes, responding to site geography with continuous linear spaces and framed alpine viewpoints.',
    category: 'Residential',
    specs: {
      location: 'Lugano, Switzerland',
      year: '2024',
      typology: 'Private Villa',
      status: 'Completed',
      grossArea: '420 m²',
      materials: 'Board-formed Concrete, Natural Gneiss Stone, Dark Cedar',
      program: 'Primary residence, infinity thermal bath, stone-ground atrium, archive library',
      client: 'Undisclosed Private Commission',
      collaborators: 'Struktura AG (Structural), Keller Landscape Architecture',
      photography: 'Maximilian Kaufmann',
      structuralGrid: '3.6m Cantilever Wall Matrix',
      sparsityIndex: '0.34 (Restrained glass to mass ratio)',
      facadeClass: 'Double Glazed Low-E Argon (Class A++)',
      solarResponse: '-12.4° West-Southwest Offset'
    },
    narrative: [
      'Positioned on an extreme 45-degree slope, The Stone Monolith is conceived as a literal extension of the schist mountainside. The building operates through subtraction rather than addition, carving deep structural courts into the stone to protect living spaces from the elements while introducing controlled eastern sunlight.',
      'A singular, structural concrete shell spans 32 meters without intermediate pillars, enabling an uninterrupted glass facade facing the lake. Inside, spatial transitions are defined by tactile shifts—from the raw, coarse texture of board-formed concrete in corridors to honed, warm regional stone in the primary living halls.'
    ],
    mainImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    blueprintImage: 'stone-monolith-blueprint',
    blueprintCaption: 'Section lateral drawing showcasing the gravity-wall anchorage, rock cavity drainage integration, and double-cantilever roofing assembly.',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80', caption: 'The entry court framed by schist dry-stacked masonry.' },
      { url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80', caption: 'Living volume showing the seamless transition of exterior stone flooring.' },
      { url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80', caption: 'Detail of gravity concrete formwork texture under morning light.' }
    ],
    featured: true
  },
  {
    id: 'komorebi-pavilion',
    title: 'Komorebi Pavilion',
    subtitle: 'Modular Forest Gallery & Tea Sanctuary',
    abstract: 'An investigation into structural lightness, utilizing modular carbon-reinforced timber joints to establish an interactive gallery pavilion that floats above the forest floor.',
    category: 'Cultural',
    specs: {
      location: 'Kyoto, Japan',
      year: '2023',
      typology: 'Exhibition Pavilion',
      status: 'Completed',
      grossArea: '180 m²',
      materials: 'Charred Cypress (Shou Sugi Ban), Local Washi Screens, Tensile Steel rods',
      program: 'Temporary exhibition hall, semi-outdoor tea platform, contemplation deck',
      client: 'Kyoto Cultural Foundation',
      collaborators: 'Kengo Wood-Tech Lab, Sato Tensile Engineering',
      photography: 'Rena Yoshikawa',
      structuralGrid: '3.6m Interlocking Tenon Timber Pitch',
      sparsityIndex: '0.78 (Maximised Filigree Permeability)',
      facadeClass: 'Washi-membrane Custom Triple Diffuse Core',
      solarResponse: 'Staggered Louver Interception Geometry'
    },
    narrative: [
      'Komorebi—the Japanese term for sunlight filtering through trees—serves as both the inspiration and the environmental feedback loop for this forest intervention. Built entirely using traditional mortise-and-tenon woodcraft updated with lightweight steel pins, the structure touches the soil at only six points to preserve subterranean root systems.',
      'The roof features staggered cypress louvers angled specifically to intercept hot summer glare while inviting low-slanting winter warmth. Internal space is fluid, partitioned only by heavy handmade mulberry paper screens that diffuse shadows of swaying surrounding bamboo.'
    ],
    mainImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    blueprintImage: 'komorebi-blueprint',
    blueprintCaption: 'Plan detail grid view showcasing the modular modular joinery grid (3.6m pitch) and tensile structural anchoring diagrams.',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=800&q=80', caption: 'Staggered louver roof scattering light patterns across the deck.' },
      { url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80', caption: 'The floating tea platform hanging above the natural spring basin.' },
      { url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?auto=format&fit=crop&w=800&q=80', caption: 'Carbonized cypress joints demonstrating ancient interlocking integrity.' }
    ],
    featured: true
  },
  {
    id: 'ascent-atrium',
    title: 'Ascent Atrium',
    subtitle: 'Low-Emission Creative Studio Hub',
    abstract: 'An adaptive reuse and vertical extension of a historic maritime brick warehouse, introducing a highly engineered mass-timber courtyard that drives passive air cooling.',
    category: 'Commercial',
    specs: {
      location: 'Oslo, Norway',
      year: '2025',
      typology: 'Creative Workspaces',
      status: 'Under Construction',
      grossArea: '3,800 m²',
      materials: 'Recycled Red Brick, Cross-Laminated Timber (CLT), Low-Carbon Steel',
      program: 'Co-working spaces, architect studios, workshop labs, central public atrium',
      client: 'Oslo Havn & Re-Development AG',
      collaborators: 'Nordic Timber Consulting, Sweco Systems',
      photography: 'Søren Lindström',
      structuralGrid: '7.2m Mass-Timber Columns Array',
      sparsityIndex: '0.15 (Remediated Masonry Shell Perimeter)',
      facadeClass: 'Structural low-carbon glaze (Passive Vent Core)',
      solarResponse: 'Automated Zenith Suntracker Skylights'
    },
    narrative: [
      'In the heart of Oslo’s harbor, Ascent Atrium merges post-industrial brick materiality with the latest in timber structural engineering. The core architectural intervention inserts a central vertical atrium built of spruce CLT columns. This atrium serves as a giant thermal chimney, pulling fresh, cool air from the sea-facing ground levels and venting it through automated skylights.',
      'The raw timber column matrix is exposed throughout the workspace, acting as acoustic baffling and localized humidity regulators. Office partitions are designed as reusable modular shelves, enabling tenants to reconfigure layouts without demolition.'
    ],
    mainImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    blueprintImage: 'ascent-blueprint',
    blueprintCaption: 'Longitudinal HVAC and structural section showing passive intake ducts, CLT column foundations and brick remediation joints.',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80', caption: 'The central timber column grid rising 15 meters through the atrium.' },
      { url: 'https://images.unsplash.com/photo-1556761175-117f1a3a8010?auto=format&fit=crop&w=800&q=80', caption: 'Contrast interface where new timber beams sit on historical structural brick arches.' },
      { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', caption: 'The open dock-view communal terrace at twilight.' }
    ],
    featured: true
  },
  {
    id: 'dune-sanctuary',
    title: 'The Dune Sanctuary',
    subtitle: 'Immersive Desert Eco-Lodge System',
    abstract: 'A series of low-impact, rammed-earth guest portals designed to emerge organically from the sand dunes, utilizing passive wind towers for off-grid desert thermal control.',
    category: 'Hospitality',
    specs: {
      location: 'AlUla, Saudi Arabia',
      year: '2026',
      typology: 'Luxury Eco-Wellness Lodge',
      status: 'Concept / Unbuilt',
      grossArea: '1,250 m²',
      materials: 'Local Desert Clay, Sand-blasted Limestone, Polished Brass accents',
      program: 'Private desert cabins, therapeutic thermal springs, stargazing observatory pavilion',
      client: 'Desert Heritage Group Ltd.',
      collaborators: 'Middle East Geotech Partners, Atelier Zero (HVAC Research)',
      photography: 'Studio Render Project',
      structuralGrid: 'Rammed Sand-Clay Thick Tectonic Shells',
      sparsityIndex: '0.08 (Subterranean Thermal Mass Focus)',
      facadeClass: 'Soil-aggregate thermal mass wall with brass badgir intake vents',
      solarResponse: 'Passive draft solar chimney solar tracking alignment'
    },
    narrative: [
      'The Dune Sanctuary is designed to exist in absolute harmony with the shifting desert landscape. By formulating a bespoke rammed-earth mixture using local sand and clay, the thick envelope achieves maximum thermal mass. This absorbs the blistering daytime solar furnace and radiates gentle, ambient warmth during the freezing desert nights.',
      'Individual suites are organized around secret sunken courtyards. Cool air is pooled at the base using a traditional windcatcher (badgir) system, dropping inner temperatures by up to 12 degrees Celsius without active electricity.'
    ],
    mainImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80',
    blueprintImage: 'dune-blueprint',
    blueprintCaption: 'Topographic site layout and grading drawing mapping wind tower intakes and solar thermal collection ranges.',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80', caption: 'Sunken courtyard pool reflecting the curved rammed-earth walls.' },
      { url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80', caption: 'Obsidian stargazing dome framing the AlUla night sky.' }
    ],
    featured: false
  },
  {
    id: 'relic-void',
    title: 'Relic & Void',
    subtitle: 'Masonry Restoration & Light Chimney',
    abstract: 'A delicate conservation of a ruined 14th-century Tuscan church cellar, inserting an independent steel and glass core to create a private residency and performance space.',
    category: 'Renovation',
    specs: {
      location: 'Siena, Italy',
      year: '2024',
      typology: 'Historical Residential',
      status: 'Completed',
      grossArea: '220 m²',
      materials: 'Siena Clay Bricks, Cor-Ten Steel, Clear Structural Glass, Raw Lime plaster',
      program: 'Single-occupant boutique dwelling, acoustically tuned micro-hall',
      client: 'B. Moretti & G. Castiglione',
      collaborators: 'Soprintendenza Archeologia Toscana, Restauro Storico s.r.l.',
      photography: 'Alessia Marchesi',
      structuralGrid: 'Cantilevered steel platform resting on micro-piles',
      sparsityIndex: '0.22 (Suspended structural core isolation)',
      facadeClass: 'Medieval masonry remediation with direct acoustic glass',
      solarResponse: 'Pre-existing vertical light-well chimney orientation'
    },
    narrative: [
      'Relic & Void demonstrates that restoration who honors the passing of time need not be passive. The collapsing masonry walls were carefully stabilized using micro-piles. Inside, a freestanding structure fabricated of oxidized Cor-Ten steel slides into the vault like an independent archaeological instrument.',
      'A deep ceiling opening, formerly used for lowering dry grain, is converted into a double-glazed light chimney, casting a kinetic beam across the weathered textures of the medieval stone floor.'
    ],
    mainImage: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    blueprintImage: 'relic-blueprint',
    blueprintCaption: 'Preservation detail overlay highlighting original masonry structures (red lines) vs structural steel insertion points (blue lines).',
    gallery: [
      { url: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80', caption: 'The soaring iron staircase hovering inches away from medieval brick arches.' },
      { url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', caption: 'The light chimney casting its daily sun arc across the raw plaster walls.' }
    ],
    featured: false
  }
];

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: 'materiality-of-soil',
    title: 'The Materiality of Soil: Rammed Earth in Contemporary Detail',
    category: 'Materials',
    date: 'May 12, 2026',
    readTime: '6 min read',
    abstract: 'Exploring the tactile qualities and ecological performance of raw earth construction. Why the humblest material remains one of our most resilient choices for thermal comfort.',
    paragraphs: [
      'As modern architecture seeks urgently to lower its embodied carbon footprint, we find ourselves digging deep into the ground. Rammed earth – a material standard of ancient civilisations – is undergoing a structural renaissance, backed by modern geotech testing.',
      'The beauty of soil lies in its geological database layer. By adjusting aggregate ratios and adding natural stabilizers, we create solid, monolithic walls that breathe. The thermal inertia offers high performance during extreme desert temperature shifts, lowering reliance on heating and cooling systems.'
    ],
    image: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'modular-joints-perspective',
    title: 'Interlocking Integrity: Traditional Wood Joinery Goes Digital',
    category: 'Process',
    date: 'April 04, 2026',
    readTime: '8 min read',
    abstract: 'Analyzing traditional mortise-and-tenon connections through custom CNC routing algorithms. Bridging centuries of Japanese woodcraft with modern structural tolerances.',
    paragraphs: [
      'In our research for Komorebi Pavilion, we spent weeks studying the joints of Shinto shrines. Traditional joinery works because it welcomes timber expansion and contraction, distributing load over wide interlocking faces.',
      'By loading parametric tolerances into 5-axis CNC cutters, we are now able to scale this wisdom instantly. We no longer need metal nails, which often corrode and split structural beams under climate flux. Wood meets wood, locked in a digital embrace that can last centuries.'
    ],
    image: 'https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'passive-cooling-atrium',
    title: 'Passive Currents: Drawing Air Without Energy',
    category: 'Notes',
    date: 'March 18, 2026',
    readTime: '5 min read',
    abstract: 'A study of the stack effect in vertical spaces. How to utilize natural temperature differentials to drive natural, silent ventilation.',
    paragraphs: [
      'Air is fluid. It has density, velocity, and predictable thermal behavior, yet standard buildings spent excessive energy fighting these natural currents with mechanical systems.',
      'By introducing a central atrium core, we utilize basic physics: warm air rises, escaping through high-level roof vents while pulling fresh exterior air through lower intakes. It establishes a soft, silent airflow without active fans or noisy machinery.'
    ],
    image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1000&q=80'
  }
];

export const STUDIO_PROFILE: StudioProfile = {
  intro: 'Perspective is an architectural practice operating at the intersection of material depth and structural discipline. We design spaces that respond directly to context, landscape, and climate.',
  philosophy: [
    'We design buildings that respond to site, climate, and the way people move through space.',
    'True luxury lies in the subtraction of noise. By exposing structure, orientation, and material, we create calm, durable spaces with reduced energy demand.'
  ],
  services: [
    { title: 'Private Residential', description: 'Understated residential spaces engineered to integrate with sensitive landscapes and local building practices.' },
    { title: 'Cultural & Public', description: 'Lightweight pavilions, galleries, and installations that facilitate quiet reflection and public assembly.' },
    { title: 'Timber Engineering', description: 'Low-impact design utilizing mass-timber structural systems, custom joints, and low embodied carbon standards.' },
    { title: 'Historical Conservation', description: 'Unobtrusive, historically respectful interventions that integrate modern performance into heritage structures.' }
  ],
  process: [
    { step: '01', title: 'Site & Climate study', description: 'We analyze regional topography, microclimate conditions, solar orientation, and local sourcing options.' },
    { step: '02', title: 'Structural Ordering', description: 'We establish a modular grid that brings spatial clarity and structural efficiency to the layout.' },
    { step: '03', title: 'Environmental Performance', description: 'We optimize passive heating, thermal mass cooling, natural ventilation, and daylighting beforehand.' },
    { step: '04', title: 'Craft & Construction', description: 'We collaborate with local craftspeople and contractors, prioritizing enduring, untreated materials.' }
  ],
  team: [
    {
      name: 'Elena Vance',
      role: 'Founding Principal & Geotech Director',
      bio: 'Elena trained in Zürich and Kyoto, spent a decade leading alpine master projects, and currently leads the studio’s material sustainability research.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    {
      name: 'Marcus Thorne',
      role: 'Structural Partner & Computational Engineer',
      bio: 'Marcus specializes in parametric timber engineering and automated site simulation. He ensures our complex structural arrays operate in perfect tension.',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'
    }
  ],
  recognition: [
    { year: '2025', title: 'Global Timber Excellence Award', medium: 'Ascent Atrium Concept Design' },
    { year: '2024', title: 'Boutique Architect of the Year', medium: 'A10 Magazine' },
    { year: '2023', title: 'Gold Medal for Sustainable Heritage', medium: 'Milan Triennale' },
    { year: '2022', title: 'Fritz-Gerber Foundation Grant', medium: 'Sion Mountain Cabin Works' }
  ]
};

export const COPY_PROMPTS: CopyPromptItem[] = [
  {
    id: 'philosophy',
    label: 'Studio Philosophy Copy Prompt',
    context: 'Perfect for the home intro or studio mission statement.',
    prompt: 'Describe your architectural practice in 3 sentences. In the first, specify your geographic region and core focus (e.g. residential, heritage, timber). In the second, mention your favorite material combination (e.g. board-formed concrete and granite). In the third, state the emotional feeling your spatial layout aims to produce (e.g. quiet sanctuary, raw monumentality, filtered forest glow).'
  },
  {
    id: 'abstract',
    label: 'Project Case Study Abstract',
    context: 'Goes directly below the title block on the case study page.',
    prompt: 'Summarize the primary project sites, structural challenges, and geological response in under 120 words. State the core program size (e.g. 420m²), the client context, and the single mechanical or materials breakthrough that defines the project’s performance (e.g. solar mass chimney or floating carbonized cypress modular timber).'
  },
  {
    id: 'blueprint',
    label: 'Technical Blueprint Caption',
    context: 'Use this text directly underneath the Blueprint View window.',
    prompt: 'Explain what this specific CAD drawing reveals about the project that raw photography cannot. Direct the viewer’s eye toward specific engineered components: rock anchor shear studs, passive airflow return ducts, heavy-timber mortise-and-tenon nodes, or relative terrain contour remediation grades.'
  },
  {
    id: 'contact_intro',
    label: 'Contact Studio Commission Prompt',
    context: 'For the introductory header on your sitemap contact inquiry form.',
    prompt: 'Write a warm, highly-selective studio inquiry message. Express the exact scale of incoming commissions your office accepts, specify which geographical locations you operate in, and outline your preliminary criteria for initial project brief reviews (e.g., valuing material honesty, context sensitivity, and structural longevity).'
  }
];

export const TEMPLATE_SETUP_GUIDE = `
# Perspective — Premium Setup & Implementation Manual

Welcome to the **Perspective** Luxury Editorial Portfolio Template. Built specifically to empower high-end architectural studios, designers, and custom builders with an uncompromising, grid-driven storytelling layout. This site was designed by specialists to showcase architectural portfolios with pristine detail.

---

## 📂 Core Folder Map

\`\`\`
/src
  ├── App.tsx          # Sitemap view router & master wrapper
  ├── types.ts         # Strictly-typed interfaces (Project, Specs, Post)
  ├── data.ts          # Static copy sheets, prompts, and case study files
  ├── index.css        # Tailwind v4 configuration, font imports, CAD grids
  └── components/
        ├── AppUi.tsx       # Interactive variant and creator console
        ├── HomeView.tsx    # Responsive grid homes (3 variants)
        ├── ProjectsView.tsx # Index matrix with typology filters
        ├── DirectCase.tsx  # Cinematic Single Project with Blueprint Toggle
        ├── StudioView.tsx  # Professional Practice profile & bios
        ├── JournalView.tsx # Research publication platform
        └── ContactView.tsx # Understated Inquiry form
\`\`\`

---

## 🛠️ Step-by-Step Customization

### 1. Typography Pairings
This template defines variable fonts directly through Tailwind CSS v4 in \`/src/index.css\`:
- **Headings / Serif**: \`Cormorant Garamond\` (gives that museum editorial look)
- **Monospaced Labels / CAD data**: \`JetBrains Mono\`
- **Body / Utility UI**: \`Inter\`

To change these, simply update the Google Font links in \`/index.html\` and change the \`@theme\` configuration inside \`index.css\`.

### 2. How to edit "Blueprint View" Content
Each project in \`ARCHITECTURE_PROJECTS\` inside \`data.ts\` has a \`blueprintImage\` and a \`blueprintCaption\`.
We have generated crisp, high-contrast digital structural SVGs for these which auto-render beautiful blueprint sheets. To swap with your corporate CAD drawings:
1. Export your elevations, layouts, or detail sections from CAD/Revit as fine-line white SVGs.
2. In your single project template, swap our vector drawing paths or reference your hosted custom SVG assets.
3. Update the matching caption so visitors understand the mechanical performance.

### 3. Modifying Project Specifications Table
Each case study is powered by a structured key-value table:
\`\`\`typescript
export interface ProjectSpecs {
  location: string;
  year: string;
  typology: string;
  status: string;
  grossArea: string;
  materials: string;
  program: string;
  client: string;
  collaborators: string;
  photography: string;
}
\`\`\`
You can freely add fields to this spec in \`types.ts\` and fill them out in \`data.ts\`. The details are rendered in a sleek, compact two-column grid on desktop, folding down to a technical table on mobile.

### 4. Swapping between Homepage Variants
Buyers get 3 pre-built Homepage layouts to match different office structures:
- **Monograph Landing**: Absolute focused story on a single, legendary project with minimal text.
- **Studio-Forward Layout**: Strong, bold practice philosophies displayed alongside small featured work slides immediately.
- **Residential-Specialist**: A curated bento grid prioritizing stunning full-width alpine photo layouts and typography.
Switch between them smoothly using the toolbar inside our interactive developer preview!
`;
