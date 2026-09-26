/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MenuItem, DiningTier, PrivateBuyoutOption } from './types';

/* ============================================================================
 * Developer Customization Guide & Copywriting Dashboard
 * ============================================================================
 * This file serves as the centralized content dashboard for the Yūgen template.
 * If you or a buyer wants to tone down the dramatic/zen language to fit a standard
 * restaurant concept in under 5 minutes, follow these simple steps:
 *
 * 1. EDIT HERO_CONTENT below: Change "Silence & Flame" to "Seasons & Ocean" 
 *    and adjust the description to something simpler (e.g. "An elegant omakase counter...").
 * 2. EDIT PHILOSOPHY_CONTENT below: Replace references to "absolute silence" 
 *    and "immaculate custody of negative space" with friendly descriptions of 
 *    the fresh ingredients and warm welcoming environment.
 * 3. EDIT SCENT_PROFILE (Atmosphere copy): Customize top/heart/base notes or 
 *    completely rewrite them as architectural/design aspects if you do not have scent diffuser setups.
 * 4. EDIT MENU & TIER copies: Swap premium terminology like "The Shizen Ritual" 
 *    with standard tier pricing titles like "Early Sitting" or "Signature Tasting Menu".
 * ============================================================================ */

/**
 * 1. HERO SECTION CONTENT
 */
export const HERO_CONTENT = {
  kicker: "Tokyo Edomae Tradition • Re-Imagined",
  headlineHtml: "The Art of <br /><span class=\"italic text-[#C5A880] font-normal\">Silence & Flame</span>",
  description: "Eight luxury seats along a polished volcanic stone counter. Nine days of meticulous aging. A quiet communion of wild elements, preserved lineage, and binchotan smoke.",
  reserveCta: "Inquire Reservation",
  reviewCta: "REVIEW COMPOSITIONS",
  scrollHint: "Descend Into The Sanctuary"
};

/**
 * 2. SECTION 01 // MINDSET & PHILOSOPHY CONTENT
 */
export const PHILOSOPHY_CONTENT = {
  kicker: "Section 01 // The Mindset",
  headlineHtml: "An architecture of taste <br />confronted by <span class=\"italic\">absolute silence</span>",
  paragraphs: [
    "At Yūgen, we believe luxury does not shout; it manifests in the immaculate custody of negative space. We have consciously stripped raw dining of post-modern theatrics, leaving only the pristine dialogue between the blade, the grain, human touch, and absolute volcanic stone.",
    "Each component of our chambers—from our seasoned Hinoki counters, sourced from centuries-old Shizuoka forestry, to the silent 26Hz acoustic isolation layer—is architected specifically to return your sensory slate to neutral. This state of absolute stillness allows the delicate maritime profile of our dry-aged ingredients to bloom without competition."
  ],
  metrics: [
    {
      title: "9-Day Dry Aging",
      description: "Volcanic rock dry cabinets map the pristine curing process of our select wild-caught bluefin."
    },
    {
      title: "Zero Digital Interference",
      description: "Analog reservations and a complete absence of screens foster absolute sensory isolation."
    }
  ],
  verticalLabel: "YŪGEN COMPOSITIONS • PRIVATE COUNTER"
};

/**
 * 3. AMBIENT TUNING // OLFACTORY STORYTELLING (SCENT PROFILE)
 */
export const SCENT_PROFILE = {
  kicker: "Ambient Tuning // Olfactory Storytelling",
  titleHtml: "The Botanical <br /><span class=\"italic text-[#C5A880]\">Scent Profile</span>",
  description: "Before you taste our first composition, the atmosphere has already rewritten your palette. We diffuse a bespoke organic extract engineered to ground breathing rate and enhance salinity reception.",
  notes: [
    {
      level: 'Top Notes // Marine Mist',
      ingredients: 'Toasted kelp matches, ozone vapor, seaside volcanic minerals',
      description: 'The sharp, dry maritime spark that immediately clears old air upon crossing the sliding Hinoki threshhold.'
    },
    {
      level: 'Heart Notes // Sacred Timber',
      ingredients: 'Dry aged cedarwood, sweet forest moss, local mountain pine resin',
      description: 'The ancient warmth of traditional Japanese mountain forestry, radiating from our hand-polished structures.'
    },
    {
      level: 'Base Notes // Grounding Earth',
      ingredients: 'White charcoal smoke, dry barley tea husks, warm stone ashes',
      description: 'A deep, lingering warmth that anchors the sensory experience into the volcanic charcoal pit.'
    }
  ]
};

/**
 * 4. SECTION 02 // CULINARY COMPOSITIONS & MENU DATA
 */
export const MENU_HEADER_CONTENT = {
  kicker: "Section 02 // Culinary Compositions",
  titleHtml: "The Curated <span class=\"italic\">Progressions</span> &amp; Notes",
  description: "Our tasting menu progresses from cool, lean, marine-aged pieces toward warm, fatty, charcoal-marbled finishes. Available exclusively as curated rituals.",
  tabs: {
    tiers: "Curated Rituals",
    compositions: "The Compositions",
    liquids: "Liquids"
  }
};

export const COMPOSITIONS: MenuItem[] = [
  {
    id: 'comp-1',
    name: 'Aged Bluefin Akami',
    romanizedName: '本鮪赤身の極み',
    category: 'nigiri',
    description: 'Dry-aged for 9 days on volcanic stone. Glazed with 15-year barrel-aged shoyu infusion.',
    sensoryNote: 'Vibe: Deep umami, subtle wild cherry, iron-rich backtones.',
    price: 32,
  },
  {
    id: 'comp-2',
    name: 'Smoked Golden Kama Caviar',
    romanizedName: '黄金カマの燻製キャビア添え',
    category: 'composition',
    description: 'Slow-charred binchotan collar medallions paired with select Ossetra reserve caviar.',
    sensoryNote: 'Vibe: Toasted oakwood smoke, hazelnut butter, seaside salt breeze.',
    price: 58,
  },
  {
    id: 'comp-3',
    name: 'Hokkaido Uni with Toasted Kelp',
    romanizedName: '極上北海道羽立ウニ',
    category: 'nigiri',
    description: 'Grade-A Hadate sea urchin on warm hand-pressed koshihikari rice, wrapped in triple-charred nori.',
    sensoryNote: 'Vibe: Sweet maritime cream, volcanic ash crust, warm vinegar finish.',
    price: 45,
  },
  {
    id: 'comp-4',
    name: 'Binchotan Sea Bream',
    romanizedName: '本真鯛の備長炭炙り',
    category: 'nigiri',
    description: 'Seared on burning white binchotan coals, kissed with freshly grated mountain wasabi and crystal sea salt.',
    sensoryNote: 'Vibe: Mild coastal minerality, fresh sweet alpine spice.',
    price: 28,
  },
  {
    id: 'comp-5',
    name: 'A5 Miyazaki Wagyu in Truffle Leaf',
    romanizedName: 'A5宮崎牛 熟成トリュフ包み',
    category: 'composition',
    description: 'Flash-seared ribeye cap glazed with slow-rendered bone marrow and black winter truffle carpaccio.',
    sensoryNote: 'Vibe: Earthy forest floor, intense buttery marbling, mineral smoke.',
    price: 72,
  },
];

export const BEVERAGE_PAIRINGS: MenuItem[] = [
  {
    id: 'pair-1',
    name: 'The Sacred Brews sake journey',
    category: 'pairing',
    description: 'Curated selection of four rare, unpasteurized Junmai Daiginjo sakes.',
    sensoryNote: 'Sake Profile: Melon rind, cold mountain spring water, white pepper.',
    price: 95,
  },
  {
    id: 'pair-2',
    name: 'Grand Cru Terroir Selection',
    category: 'pairing',
    description: 'An international narrative featuring iconic French and Austrian white mineral vintages.',
    sensoryNote: 'Wine Profile: Crushed gravel, wet stone, subtle petroleum flint, white blossom.',
    price: 145,
  },
];

export const DINING_TIERS: DiningTier[] = [
  {
    id: 'tier-standard',
    title: 'The Shizen Ritual',
    subtitle: 'Nigiri Progression',
    price: 120,
    description: 'An elegant 12-course narrative highlighting the seasonality of the coastal currents.',
    inclusions: [
      '3 Seasonal Zen Starters',
      '8 Curated Premium Hand-Pressed Nigiri',
      'Traditional Red Miso & Aged Kombu Consommé',
      'Artisanal Ceremonial Shizuoka Matcha Gelato',
    ],
  },
  {
    id: 'tier-exclusive',
    title: 'The Yūgen Masterwork',
    subtitle: 'Reserve Omakase',
    price: 185,
    description: 'Our ultimate expression. A 18-course sensory masterpiece orchestrated live by Master Chef.',
    inclusions: [
      '5 Rare Cold-Chamber Compositions',
      '11 Signature Hand-Pressed Volcanic-Aged Nigiri',
      'A5 Miyazaki Ribeye Cap Snapped over Coals',
      'Exclusive Access to the Nightly Rare Vintage Reserve Sake List',
    ],
    isPremium: true,
  },
];

export const BUYOUT_OPTIONS: PrivateBuyoutOption[] = [
  {
    id: 'buyout-counter',
    title: 'Sanctuary Counter Takeover',
    basePrice: 3500,
    capacity: 'Up to 8 Guests Exclusive',
    description: 'The ultimate culinary isolation. The entire 8-seat obsidian stone counter is closed to the public for your party with custom-crafted menu compositions.',
    exclusivePerks: [
      'Private 4-Hour Counter Buyout with full custom culinary orchestration',
      'Direct, uninterrupted interaction with the Master Sushi Chef',
      'Bespoke ambient music and specific room lighting tuning of your choice',
      'Zero external guest footsteps or distractions on premises',
    ],
  },
  {
    id: 'buyout-estate',
    title: 'Imperial Estate Buyout',
    basePrice: 7500,
    capacity: 'Up to 20 Guests Exclusive',
    description: 'A complete spatial takeover of the entire sanctuary compound. Fully personalized sensory branding, botanical design enhancements, and dedicated flight staff.',
    exclusivePerks: [
      'Entire estate security lockdown and fully private parking array',
      'Custom luxury menu card printed on handcrafted Japanese mulberry paper',
      'Complete pre-event pairing consultation with our Lead Wine & Sake Sommelier',
      'Private botanical scent tuning inside the chamber prior to entry',
    ],
  },
];
