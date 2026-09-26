/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrandAngleConfig, ThemeConfig, MenuItem } from './types';

export const BRAND_ANGLES: BrandAngleConfig[] = [
  {
    id: 'burger-lab',
    name: 'Burger Lab',
    tagline: 'Artisanal Dining Design',
    slogan: 'Curated flavors. Design in every bite.',
    description: 'A clean, editorial website template for modern culinary brands. Perfect for showcasing a refined craft menu with elegant typography and a distinctive minimalist grid layout.',
    philosophyTitle: 'The Craft of Balanced Flavor',
    philosophyText: 'We approach every burger with the same care great studios bring to design. Every cut, sear temperature, and fat-to-lean ratio is chosen with care to achieve a single target: a perfectly caramelized, incredibly juicy double smashburger.',
    accentClass: 'bg-[#E1FF01] text-black border-[#E1FF01]',
    accentHex: '#E1FF01',
    primaryFont: 'font-sans',
    badgeText: 'CULINARY DESIGN CO',
    labSpecs: [
      { label: 'Sear Quality', value: 'Crispy Caramelized Edges', index: 94 },
      { label: 'Sauce Accent', value: 'Smoked Bone-Marrow Aioli', index: 86 },
      { label: 'House Style', value: 'Double Smash Beef', index: 98 }
    ]
  },
  {
    id: 'smash-theory',
    name: 'Smash Theory',
    tagline: 'High-Heat Smash Specialists',
    slogan: 'Serrated edges. Unrivaled crust.',
    description: 'An urban, high-contrast digital menu layout for street-level burger brands and quick-service operations. Focuses on strong typography and quick customer conversion.',
    philosophyTitle: 'The High-Heat Formula',
    philosophyText: 'Our patties are crafted from fresh premium beef chuck and rib cuts, hand-pressed on custom 450°F cast iron plates. This instant contact fuses deep caramelization directly into the outer lace edges, locked within forty seconds.',
    accentClass: 'bg-[#DC2626] text-white border-[#DC2626]',
    accentHex: '#DC2626',
    primaryFont: 'font-mono',
    badgeText: 'SMASH SPECIALISTS',
    labSpecs: [
      { label: 'Beef Blend', value: '80:20 Chuck & Rib', index: 97 },
      { label: 'Sear Quality', value: 'Super-Crispy Lace Edges', index: 92 },
      { label: 'Cheese Layer', value: 'Melted Sharp Cheddar', index: 89 }
    ]
  },
  {
    id: 'field-notes',
    name: 'Field Notes Burger Co.',
    tagline: 'Family-Owned Grass-Fed Beef',
    slogan: 'Honest casual dining. Sourced responsibly.',
    description: 'A premium-casual website template with bone-white backdrops, warm earthy tones, and spacious serif typography. Designed to highlight organic sourcing and farm alliances.',
    philosophyTitle: 'The Farm-to-Plate Consensus',
    philosophyText: 'Our beef is sourced exclusively from family-run pastures. We wet-age each pasture-raised cut for exactly 35 days, grinding fresh daily to deliver an uncompromised, clean flavor experience.',
    accentClass: 'bg-[#1E3F20] text-amber-500 border-[#1E3F20]',
    accentHex: '#1E3F20',
    primaryFont: 'font-serif',
    badgeText: 'PASTURE ALLIANCES',
    labSpecs: [
      { label: 'Beef Sourcing', value: '100% Grass-Fed', index: 90 },
      { label: 'Aging Process', value: '35-Day Wet Aging', index: 82 },
      { label: 'House Style', value: 'Classic Backyard Burger', index: 95 }
    ]
  },
  {
    id: 'char-grid',
    name: 'Char & Grid',
    tagline: 'Sparsely Elevated Burger Build',
    slogan: 'A structural study in balanced taste.',
    description: 'A structural, geometric gridded template for fine-casual concept menus, featuring deep charcoal accents, clean alignments, and structured layouts.',
    philosophyTitle: 'The Culinary Architecture',
    philosophyText: 'A premium burger is a layered stack where flavor meets structural integrity. From the toasted bun crown to the adhesive melt of aged cheese, each element is placed intentionally to preserve balance.',
    accentClass: 'bg-[#EA580C] text-black border-[#EA580C]',
    accentHex: '#EA580C',
    primaryFont: 'font-mono',
    badgeText: 'STRUCTURAL SYMMETRY',
    labSpecs: [
      { label: 'Toast Level', value: 'Sourdough Golden-Crisp', index: 88 },
      { label: 'Stack Integrity', value: '7 Balanced Layers', index: 99 },
      { label: 'Cheese Layer', value: 'Double Gruyere Melt', index: 85 }
    ]
  }
];

export const THEMES: ThemeConfig[] = [
  {
    id: 'light',
    name: 'Bone White',
    bgColor: 'bg-[#F9F8F6]',
    cardBg: 'bg-white',
    textColor: 'text-[#1E1E1C]',
    textColorMuted: 'text-[#6B6A66]',
    borderColor: 'border-[#1E1E1C]',
    gridLineColor: 'border-[#1E1E1C]/10'
  },
  {
    id: 'dark',
    name: 'Matte Black',
    bgColor: 'bg-[#0E0E0E]',
    cardBg: 'bg-[#181818]',
    textColor: 'text-[#F1F1F1]',
    textColorMuted: 'text-[#A1A1A1]',
    borderColor: 'border-[#333333]',
    gridLineColor: 'border-[#333333]/30'
  },
  {
    id: 'steel',
    name: 'Stainless Steel',
    bgColor: 'bg-[#1E232A]',
    cardBg: 'bg-[#2A303C]',
    textColor: 'text-[#F3F4F6]',
    textColorMuted: 'text-[#9CA3AF]',
    borderColor: 'border-[#4B5563]',
    gridLineColor: 'border-[#4B5563]/30'
  }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'bl-01',
    name: 'THE SIGNATURE DOUBLE SMASH',
    price: '$21',
    code: 'BL-01',
    category: 'burgers',
    description: 'Our flagship double smash burger. Two crispy hand-pressed beef patties, melted sharp white cheddar, and a delicate spread of smoked bone-marrow aioli on toasted brioche.',
    composition: [
      { label: 'Beef Blend', value: 'Prime Short Rib & Chuck' },
      { label: 'Sear Style', value: 'Crispy Caramelized Edges' },
      { label: 'Cheese Layer', value: 'Melted Sharp White Cheddar' },
      { label: 'Sauce Accent', value: 'Smoked Bone-Marrow Aioli' }
    ],
    maillardScore: 9.8,
    hydrationIndex: '64%',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '680 kcal'
  },
  {
    id: 'bl-02',
    name: 'THE TRUFFLE & GRUYÈRE',
    price: '$26',
    code: 'BL-02',
    category: 'burgers',
    description: 'A woodsy, savory combination. Sautéed wild chanterelles, melted Gruyère, premium Wagyu beef, and a light white truffle aioli on a toasted brioche bun.',
    composition: [
      { label: 'Beef Blend', value: 'Marbled Wagyu Chuck' },
      { label: 'Mushroom Saute', value: 'Wild Chanterelles' },
      { label: 'Cheese Layer', value: 'Aged Swiss Gruyère' },
      { label: 'Sauce Accent', value: 'White Truffle Aioli' }
    ],
    maillardScore: 9.2,
    hydrationIndex: '71%',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '740 kcal'
  },
  {
    id: 'bl-03',
    name: 'THE GOCHUJANG GLAZE',
    price: '$24',
    code: 'BL-03',
    category: 'burgers',
    description: 'A balanced blend of sweet, spicy, and savory. Crispy griddle beef patties glazed in a rich gochujang reduction, topped with pickled daikon and fresh, crisp watercress.',
    composition: [
      { label: 'Beef Blend', value: 'Short Rib & Brisket Blend' },
      { label: 'Sauce Glaze', value: 'Gochujang-Soy Reduction' },
      { label: 'Greens', value: 'Fresh Crisp Watercress' },
      { label: 'Pickles', value: 'House-Pickled Daikon' }
    ],
    maillardScore: 9.5,
    hydrationIndex: '68%',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '710 kcal'
  },
  // Sides
  {
    id: 'sd-01',
    name: 'TRIPLE-COOKED ROBUST WEDGES',
    price: '$12',
    code: 'SD-11',
    category: 'sides',
    description: 'Fresh-cut potato wedges, par-boiled then twice-fried in rendered premium Wagyu beef tallow for a golden-glassy exterior and an ultra-fluffy center.',
    composition: [
      { label: 'Frying Base', value: 'Rendered A5 Wagyu beef fat' },
      { label: 'Texture', value: 'Glassy-crisp crust with fluffy center' },
      { label: 'Seasoning', value: 'Maldon flaked organic sea salt' }
    ],
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '410 kcal'
  },
  {
    id: 'sd-02',
    name: 'QUICK-PICKLED DILL GHERKINS',
    price: '$9',
    code: 'SD-15',
    category: 'sides',
    description: 'Hand-sliced English cucumbers quick-pickled in an aromatic brine of fresh wild dill flower, yellow mustard seeds, and organic white wine vinegar.',
    composition: [
      { label: 'Ferment Cycle', value: '14 Days cold-brined at 40°F' },
      { label: 'Acidity Index', value: 'Balanced 3.4 pH profile' },
      { label: 'Aromatics', value: 'Freshly cut wild dill & coriander' }
    ],
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '30 kcal'
  },
  {
    id: 'sd-03',
    name: 'CHARRED BONE MARROW CANOES',
    price: '$18',
    code: 'SD-22',
    category: 'sides',
    description: 'Longitudinally split beef marrow bones roasted high over hardwood charcoal. Served with fresh flat-leaf parsley and warm toasted organic sourdough.',
    composition: [
      { label: 'Marrow Cut', value: 'Split femur center-cut bones' },
      { label: 'Char Finish', value: 'Smoky, charred wood embers' },
      { label: 'Bread Accompaniment', value: 'Toasted wild-yeast sourdough bread' }
    ],
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '520 kcal'
  },
  // Shakes
  {
    id: 'sk-01',
    name: 'MADAGASCAR VANILLA CAVIAR SHAKE',
    price: '$14',
    code: 'SK-40',
    category: 'shakes',
    description: 'Heirloom Madagascar vanilla bean pods scraped by hand and blended with high-fat organic double cream and a light single-estate maple glaze swirl.',
    composition: [
      { label: 'Dairy Cream', value: 'High-butterfat organic country cream' },
      { label: 'Vanilla Core', value: 'Hand-scraped Bourbon vanilla seeds' },
      { label: 'Sweetener', value: 'Authentic wood-fired maple glaze' }
    ],
    image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '490 kcal'
  },
  {
    id: 'sk-02',
    name: 'TOASTED SESAME & WHITE MISO SHAKE',
    price: '$15',
    code: 'SK-45',
    category: 'shakes',
    description: 'A striking savory-sweet milkshake blending stone-ground sesame paste with delicate, Kyoto-style white Shiro miso and organic grey salt.',
    composition: [
      { label: 'Soy Miso Source', value: 'Kyoto-style sweet white miso' },
      { label: 'Sesame Base', value: 'Toasted organic black hull paste' },
      { label: 'Sea Salt Accent', value: 'Brittany hand-harvested grey salt' }
    ],
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '520 kcal'
  },
  // Late Night
  {
    id: 'ln-01',
    name: 'THE MIDNIGHT SINGLE',
    price: '$16',
    code: 'LN-01',
    category: 'late-night',
    description: 'Served exclusively during late hours. A single crispy smashburger patty topped with sweet caramelized onions and a rich brown mustard glaze.',
    composition: [
      { label: 'Service Hours', value: 'Directly from 11:30 PM to 4:00 AM' },
      { label: 'Patty Weight', value: '110g single high-heat ribbon' },
      { label: 'Bun Base', value: 'Lightly steamed buttered bun' }
    ],
    image: 'https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&w=600&h=600&q=80',
    calories: '410 kcal'
  },
  {
    id: 'ln-02',
    name: 'BEEF-TALLOW CRACKLED POPCORN',
    price: '$11',
    code: 'LN-05',
    category: 'late-night',
    description: 'Crispy warm popcorn lightly misted with pure beef tallow and dusted with toasted organic nutritional yeast for deep savory richness.',
    composition: [
      { label: 'Fat Coating', value: 'Pure grass-fed cattle butter tallow' },
      { label: 'Yeast Factor', value: 'Toasted nutty nutritional yeast' },
      { label: 'Serving Sizing', value: 'Freshly popped shared snack bowl' }
    ],
    image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    calories: '280 kcal'
  }
];

export const LAB_METRICS = {
  pattiesSmashed: { label: 'Patties Served Daily', value: '412' },
  maillardIndex: { label: 'Skillet Searing Heat', value: '450°F Max' },
  fatEmulsion: { label: 'House Meat-to-Fat Blend', value: '80 / 20' },
  supplierDirect: { label: 'Single-Source Local Farms', value: '100% Direct' }
};

export const REVIEWS = [
  {
    id: 1,
    author: 'Chef Harrison Thorne',
    role: 'Gastronomy Critic, Culinary Digest',
    rating: 5,
    text: 'An exceptional template. The minimal layout lets the food take center stage, and the spacing matches the level of craft in our actual kitchen. Outstanding design and execution.',
    date: 'August 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=120&h=120&q=80',
    initials: 'HT'
  },
  {
    id: 2,
    author: 'Maddox Voss',
    role: 'Co-Founder, Local Food Collective',
    rating: 5,
    text: 'Most burger templates rely on loud, cartoonish graphics. This layout is quiet, clean, and beautifully balanced. It commands respect and appeals to guests who notice the details.',
    date: 'October 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    initials: 'MV'
  },
  {
    id: 3,
    author: 'Evelyn Choi',
    role: 'Design Lead, Soil & Salt Group',
    rating: 5,
    text: 'The typography and clean grid alignment are incredibly elegant. Spacious layouts, natural margins, and clean presets make configuring our local menu simple. It takes only minutes to customize.',
    date: 'February 2026',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    initials: 'EC'
  }
];
