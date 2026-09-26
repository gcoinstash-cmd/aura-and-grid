import { CulinaryTemplate } from '../types';

export const CULINARY_TEMPLATES: CulinaryTemplate[] = [
  {
    id: 'gullah-hearth',
    title: 'The Ancestral Hearth',
    tagline: 'High-End Heirloom Soul Food & Lowcountry Hearthfire',
    narrative: 'An artisanal experience honoring the deep, wood-fired hearths of the Sea Islands and southern farming estates. Designed for curators of high-end soul agriculture, rare heirloom seed preservationists, and luxury culinary historians.',
    curatorQuote: 'Every pot of slow-smothered collards, every grain of hand-milled Carolina Gold, is a chapter of a dense, gilded legacy. We cook with the memory of woodsmoke and coastal salt.',
    curatorName: 'Chef Sallie Ann Washington',
    images: {
      hero: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=1200', // Smoked hearth
      plating: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800', // Coastal oyster / fish curation
      atmosphere: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=800', // Lowlight hearth dining
    },
    menu: [
      {
        id: 'gh-1',
        course: 'Opening Gesture',
        title: 'Slow-Simmered Pot Likker & Benne Flurry',
        sensoryDescription: 'Delicate brass-pot likker derived from smoked ham hock, finished with house-toasted Sea Island benne seed oil and crisp sweet potato shoestrings.',
        heritageNotes: 'Pot likker represents pure culinary alchemy—reclaiming the nutrient-dense elixir from wood-fired brass cooking vessel bottoms.'
      },
      {
        id: 'gh-2',
        course: 'The Deep Current',
        title: 'Smothered Coastal Blue Crab & Grit Soufflé',
        sensoryDescription: 'Local marsh-harvested blue crab simmered in a dense brown butter roux, resting within a cloud-light soufflé of stone-milled heirloom grits.',
        heritageNotes: 'Elevating the humble grit to an ethereal luxury state, celebrating the maritime abundance of tidewater artisans.'
      },
      {
        id: 'gh-3',
        course: 'The Hearth Core',
        title: 'Oak-Smoked Duck Breast & Clay Silt Red Peas',
        sensoryDescription: 'Cured premium duck slow-smoked over seasoned peachwood embers, glazed with southern sugarcane syrup, accompanied by sea-island red clay peas double-braised in iron kettles.',
        heritageNotes: 'Every pea holds the genetics of resilience, hand-imported across coastal trade routes and double-braided into locks.'
      }
    ],
    designSpecs: {
      typography: {
        heading: 'Playfair Display (Serif)',
        subheading: 'Space Grotesk (Tech Minimalist)',
        body: 'Inter (High-Readability)'
      },
      whitespace: 'Generous 1:2:1 luxury ratio. High negative space in headers to emphasize singular visual plates.',
      emotionalAtmosphere: 'Deep earthy warmth combined with archival museum curation.'
    },
    tailwindConfig: `// Tailwind Config Accent Extensions
module.exports = {
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1817', // Smoked oak embers
        clay: '#AC5D3F', // Georgia red silt
        gold: '#DEC49D', // Ancestral honey glow
        sand: '#F7F3EE', // Sun-bleached coastal silica
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
    }
  }
}`,
    reactCode: `import React from 'react';
import { motion } from 'motion/react';

export default function AncestralHearthPreview() {
  return (
    <div className="bg-[#F7F3EE] text-[#1A1817] font-sans p-8 md:p-16 max-w-4xl mx-auto border border-[#AC5D3F]/10">
      <header className="mb-24 text-center">
        <span className="text-xs uppercase tracking-[0.25em] text-[#AC5D3F] font-medium">The Gullah Hearth — Course III</span>
        <h1 className="font-serif text-4xl md:text-6xl text-[#1A1817] tracking-tight mt-4">Oak-Smoked Duck & Clay Peas</h1>
        <div className="w-12 h-[1px] bg-[#AC5D3F]/30 mx-auto mt-6"></div>
      </header>
      
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="font-serif text-xl italic text-[#1A1817]/80 leading-relaxed">
            "Each pea is a seed of continuation, slowly double-braided into hair for safe keeping."
          </p>
          <p className="text-sm text-[#1A1817]/70 leading-relaxed font-sans">
            Cured premium duck slow-smoked over seasoned peachwood embers, glazed with southern sugarcane syrup, accompanied by sea-island red clay peas double-braised in iron kettles and finished with benne dust.
          </p>
        </div>
        <div className="border border-[#AC5D3F]/20 p-2 bg-white/50 backdrop-blur">
          <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=600" alt="Hearth Plating" className="w-full grayscale hover:grayscale-0 transition-all duration-700 aspect-square object-cover" />
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'decolonial-table',
    title: 'The Decolonial Table',
    tagline: 'Avant-Garde Soul Deconstruction & Brutalist Geometry',
    narrative: 'A striking, modernist exploration of southern soul culinary staples through an intellectual, minimalist lens. Dismantling the historic divides between comforting traditions and high-design molecular presentation.',
    curatorQuote: 'We are not merely replicating the heavy metal plates of our fathers. We are analyzing the thermal resonance of cast iron to extract the absolute purest essence of smoke and salt.',
    curatorName: 'Chef Marcus K. Adjaye',
    images: {
      hero: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200', // Stark avant-garde table
      plating: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800', // Modernist dark charcoal plate
      atmosphere: 'https://images.unsplash.com/photo-1522336572468-97b06eca219b?auto=format&fit=crop&q=80&w=800', // Shadowy minimal dining room
    },
    menu: [
      {
        id: 'dt-1',
        course: 'Structure 01',
        title: 'Deconstructed Georgia Silt Sweet Potato',
        sensoryDescription: 'Crisped charcoal-roasted sweet potato skins filled with cloud-whipped amber potato mousse, finished with a single teardrop of 12-year sorghum reduction and gold-leaf flakes.',
        heritageNotes: 'Breaking open the southern soil\'s sweetest gift, celebrating the raw mineral flavor profile of red Georgia silt.'
      },
      {
        id: 'dt-2',
        course: 'Structure 02',
        title: 'Crisp Pork Belly & Smoked Applewood Air',
        sensoryDescription: 'Ultra-compressed, crispy salt-cured heritage pork belly, resting under a delicate, aromatic dome of cold-pressed applewood smoke vapor.',
        heritageNotes: 'Reinterpreting classic smokehouse curing protocols through the rigorous prism of clean-room culinary physics.'
      },
      {
        id: 'dt-3',
        course: 'Structure 03',
        title: 'Sea Island Indigo Ash-Crusted Wagyu',
        sensoryDescription: 'Seared luxury American Wagyu beef encrusted in a charcoal of burnt pine and wild indigo skins, served over a geologically layered salt block.',
        heritageNotes: 'Activating the deep cultural significance of Sea Island cash crops, transmuting historical dye wealth into an item of rare consumption.'
      }
    ],
    designSpecs: {
      typography: {
        heading: 'JetBrains Mono (Technical Accent)',
        subheading: 'Space Grotesk (Brutalist Geometry)',
        body: 'Inter (Neutral Base)'
      },
      whitespace: 'Tight, defensive gridlines. Precision margins. Structured spacing with raw dividers inspired by construction schematics.',
      emotionalAtmosphere: 'Monochrome contrast, archival authority, high intellectual command.'
    },
    tailwindConfig: `// Decolonial Table Stylings
module.exports = {
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1817', // Backdrops
        clay: '#AC5D3F', // Georgia red silt accents
        gold: '#DEC49D', // Glowing details
        sand: '#F7F3EE', // stark layouts
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
    }
  }
}`,
    reactCode: `import React from 'react';
import { motion } from 'motion/react';

export default function DecolonialTablePreview() {
  return (
    <div className="bg-[#1A1817] text-[#F7F3EE] font-mono p-6 md:p-12 border-2 border-[#AC5D3F]/30">
      <div className="flex justify-between items-center border-b border-neutral-800 pb-4 mb-16">
        <span className="text-xs text-neutral-500">// BATCH INTEL_DECOL_09</span>
        <span className="text-xs bg-[#AC5D3F]/20 text-[#AC5D3F] px-2 py-0.5 border border-[#AC5D3F]/40 font-mono">SOUL RECONSTRUCTION</span>
      </div>
      
      <div className="space-y-12">
        <div className="space-y-2">
          <span className="text-sm text-neutral-400">STRUCTURE 03 / PRIMARY MAIN</span>
          <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter text-white uppercase">INDIGO ASH & WAGYU</h2>
        </div>
        
        <div className="grid md:grid-cols-12 gap-8 pt-4 border-t border-neutral-800">
          <div className="md:col-span-8 text-sm text-neutral-300 leading-relaxed font-sans">
            Seared luxury American Wagyu beef encrusted in a charcoal of burnt pine and wild indigo skins. Plated on solid obsidian slabs, temperature regulated to 42°C to amplify botanical oil vaporization.
          </div>
          <div className="md:col-span-4 text-xs text-[#DEC49D] border border-[#DEC49D]/30 p-3 bg-[#DEC49D]/5">
            [HISTORIC SPEC] Reclaims the high valuation of Indigo dye. Every bite is an archival lesson of labor and transmutational aesthetics.
          </div>
        </div>
      </div>
    </div>
  );
}`
  },
  {
    id: 'archival-salon',
    title: 'The Archival Salon',
    tagline: 'Gilded Age Southern Gastronomy & Society Dinners',
    narrative: 'An opulent, highly curated layout celebrating the intellectual brownstone dinners and elite high-society culinary salons of early 20th-century black scholars, reimagining heritage soul food for the ultimate private estate table.',
    curatorQuote: 'The dining room is where philosophy, high cuisine, and generational excellence are metabolized. We render the humble biscuit with the meticulous precision of a fine jewel.',
    curatorName: 'Dr. Evelyn Harris-Du Bois',
    images: {
      hero: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&q=80&w=1200', // Elegant luxury salon
      plating: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80&w=800', // French-technique presentation
      atmosphere: 'https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=800', // Dark fine wood & books background
    },
    menu: [
      {
        id: 'as-1',
        course: 'First Discourse',
        title: 'Persimmon & Gilded Bone Marrow Tartlet',
        sensoryDescription: 'Crisp hand-embossed puff pastry filled with roasted premium marrow, topped with a luminous wild persimmon reduction and gold-leaf flakes.',
        heritageNotes: 'Combining classic European pastry craftsmanship with the deeply guarded wild gathering memories of black agrarian estates.'
      },
      {
        id: 'as-2',
        course: 'Main Thesis',
        title: 'Pecanwood Aged Prime Beef & Truffled Gravy',
        sensoryDescription: 'Dry-aged prime beef ribeye smoked over pecanwood embers, rested in rich bone-marrow gravy infused with shaved black winter truffles and Georgia hickory charcoal salt.',
        heritageNotes: 'A tribute to the legendary hospitality of elite hotel chefs and historical black hosts who shaped the American republic\'s high-dining vocabulary.'
      },
      {
        id: 'as-3',
        course: 'The Sweet Synthesis',
        title: 'Heritage Peach Soufflé & Bourbon Truffle',
        sensoryDescription: 'Heirloom Georgia peach soufflé rising weightlessly above a pool of warm vanilla custard, accompanied by a dark cacao truffle filled with premium single-barrel reserve bourbon.',
        heritageNotes: 'Translating the warmth of a dynamic southern summer orchard to the absolute pinnacle of high-style modernist patisserie.'
      }
    ],
    designSpecs: {
      typography: {
        heading: 'Bodoni / Playfair Display (Serif Elegance)',
        subheading: 'Inter (Neutral Sans)',
        body: 'Garamond / Lora (Warm Classic Serif)'
      },
      whitespace: 'Symmetric, majestic proportions. Classic framing with elegant, high-contrast borders and golden accent ratios.',
      emotionalAtmosphere: 'Sophisticated intellectual retreat, gilded, timeless.'
    },
    tailwindConfig: `// Archival Salon Theme
module.exports = {
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1817', // Smoked Oak base
        clay: '#AC5D3F', // Silt accents
        gold: '#DEC49D', // Gilded Gold
        sand: '#F7F3EE', // Parchment-like backing
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        serifBody: ['"Lora"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    }
  }
}`,
    reactCode: `import React from 'react';
import { motion } from 'motion/react';

export default function ArchivalSalonPreview() {
  return (
    <div className="bg-[#F7F3EE] text-[#1A1817] font-sans p-10 md:p-20 border-8 border-double border-[#DEC49D]/40">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        <span className="font-serif italic text-[#AC5D3F] tracking-widest text-sm">— FIRST DISCOURSE —</span>
        <h2 className="font-serif text-3xl md:text-5xl text-[#1A1817] font-normal tracking-tight">
          Persimmon & Gilded Bone Marrow
        </h2>
        <div className="w-16 h-[2px] bg-[#DEC49D] mx-auto"></div>
        <p className="font-serif italic text-base text-[#1A1817]/80 leading-relaxed max-w-xl mx-auto">
          "A marriage of dualities — combining elite European structural technique with the deeply guarded foraging traditions of our agrarian lineage."
        </p>
        <p className="text-xs uppercase tracking-[0.2em] text-[#AC5D3F] font-semibold pt-4 font-mono">
          RESERVE SEAT #14 // ACADEMIC SALON DE LUXE
        </p>
      </div>
    </div>
  );
}`
  }
];
