/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Compass, Sparkles, MapPin, Wine, Calendar, ArrowDown } from "lucide-react";

interface PastGala {
  id: string;
  codename: string;
  title: string;
  storyTitle: string;
  narrative: string;
  year: string;
  location: string;
  atmosphereKeywords: string[];
  vibe: string;
  architecturalStyle: string;
  imageUrl: string;
}

const PAST_GALAS: PastGala[] = [
  {
    id: "past-1",
    codename: "ÉDITION IMPERIALE",
    title: "The Alabaster Cloister",
    storyTitle: "Whispers of White Marble & Sandalwood",
    narrative: "Constructed deep within the hollowed halls of a 14th-century cathedral in Reims. We replaced the floors entirely with obsidian glass mirrors, creating a perfect ceiling-down optical reflection. Over five thousand beeswax pillars floated on copper wire grids, scenting the atmospheric smoke with pure damask honey and dry sandalwood incense. Guests gathered in absolute silver silence.",
    year: "SUMMER 2024",
    location: "Reims, France",
    atmosphereKeywords: ["Obsidian Reflection", "Beeswax Columns", "Gothic Silence"],
    vibe: "Heavy Stone & Golden Flame",
    architecturalStyle: "High Gothic Revival",
    imageUrl: "https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=1500&q=80"
  },
  {
    id: "past-2",
    codename: "ÉDITION NOCTURNE",
    title: "The Iron Ribbons Dinner",
    storyTitle: "Suspended Iron Canopies & Cold Ash Gastronomy",
    narrative: "An avant-garde runway dining structure suspended eighteen feet in the air above an active deep-water shipping canal in Rotterdam. Guests walked a high-tension steel runway to reach unpolished dark granite slabs. A cold mist vapor system dispersed custom cypress wood aroma, while soundwaves were propagated using sub-bass conductors set directly into the guests' solid marble throne chairs.",
    year: "AUTUMN 2025",
    location: "Rotterdam, Netherlands",
    atmosphereKeywords: ["High-Tension Steel", "Molecular Ice Smoke", "Sub-Bass Conduction"],
    vibe: "Industrial Brutalism & Violet Dark",
    architecturalStyle: "High-Tech Structuralism",
    imageUrl: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1500&q=80"
  },
  {
    id: "past-3",
    codename: "ÉDITION SACRÉE",
    title: "Le Temple de Bambou",
    storyTitle: "Acoustically Isolated Sanctuary & Tea Ash",
    narrative: "Deep in the private bamboo forests of Arashiyama, we built a sound-attenuated chamber completely isolated from the outer world's ambient frequencies. Guests sat around dry riverbed stone pits where master potters fired custom clay cups live. The space smelled of cold green moss, damp forest topsoil, and fresh cedar sap, with live shakuhachi and modular electronics blended dynamically at 52 BPM.",
    year: "WINTER 2025",
    location: "Kyoto, Japan",
    atmosphereKeywords: ["Shakuhachi 52 BPM", "Damp Forest Moss", "Acoustically Cloaked"],
    vibe: "Primal Wood & Mineral Quiet",
    architecturalStyle: "Heian Period Minimalist",
    imageUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1500&q=80"
  }
];

export default function GalaPortfolio() {
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-16" id="gala-portfolio-section">
      
      {/* Editorial Title Header Block */}
      <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-charcoal pb-8 mb-16">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-gold uppercase block mb-2 font-sans font-medium">
            05 / Archival Showcases
          </span>
          <h2 className="text-3xl md:text-6xl lg:text-7xl font-serif text-stark-white font-light tracking-wide leading-none tracking-tight">
            La Chronique des Spectacles
          </h2>
        </div>
        <p className="max-w-md text-xs tracking-wider text-platinum/70 leading-relaxed font-sans font-light mt-4 md:mt-0">
          A high-fashion portfolio detailing past digital-crafted spatial blueprints. Review the structural architectures, tactile narratives, and scent-matched atmospheres.
        </p>
      </div>

      {/* Cinematic Full-bleed Hero Series with Zoom effects & large Typographic story overlays */}
      <div className="space-y-32" id="portfolio-cinematic-list">
        {PAST_GALAS.map((gala, idx) => {
          const isEven = idx % 2 === 0;
          const isHovered = hoveredCardId === gala.id;

          return (
            <div
              key={gala.id}
              id={`portfolio-item-${gala.id}`}
              className="relative space-y-12"
              onMouseEnter={() => setHoveredCardId(gala.id)}
              onMouseLeave={() => setHoveredCardId(null)}
            >
              {/* Cinematic Full-width Cover Box */}
              <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden border border-charcoal/80 group bg-obsidian">
                {/* Simulated Zoom effect on scroll or hover */}
                <img
                  src={gala.imageUrl}
                  alt={gala.title}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-[110%] object-cover transition-all duration-[2000ms] ease-out origin-center ${
                    isHovered ? "scale-105 opacity-65" : "scale-101 opacity-50"
                  }`}
                />
                
                {/* Premium gradient to guarantee absolute text contrast & luxury dark mode feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-black/15 pointer-events-none" />

                {/* Left/Right structural watermark bar representing a high-ticket physical catalog */}
                <div className="absolute top-8 left-8 text-gold/30 font-mono text-[9px] tracking-[0.3em] uppercase select-none">
                  GRD // ARCHIVE-{gala.id.toUpperCase()}
                </div>
                <div className="absolute top-8 right-8 text-gold/30 font-mono text-[9px] tracking-[0.3em] uppercase select-none">
                  {gala.year}
                </div>

                {/* Overlapping large luxury font and absolute coordinates */}
                <div className="absolute bottom-8 left-6 right-6 md:left-12 md:right-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-20">
                  <div className="space-y-3 max-w-xl md:max-w-2xl">
                    <span className="text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase block font-sans font-semibold">
                      {gala.codename}
                    </span>
                    <h3 className="text-4xl md:text-7xl lg:text-8xl font-serif text-stark-white font-light tracking-wide leading-none tracking-tight">
                      {gala.title}
                    </h3>
                    <div className="flex items-center gap-2 text-platinum/60 text-xs">
                      <MapPin size={12} className="text-gold" />
                      <span className="font-mono text-[10px] tracking-widest uppercase">{gala.location}</span>
                    </div>
                  </div>

                  <div className="border border-charcoal bg-obsidian/90 backdrop-blur-md px-6 py-4 space-y-1.5 hidden lg:block">
                    <span className="text-[8px] text-platinum/40 uppercase font-mono tracking-widest">
                      ARCHITECTURAL SCHEME
                    </span>
                    <p className="text-xs font-serif text-[#D4AF37] italic font-medium">
                      {gala.architecturalStyle}
                    </p>
                  </div>
                </div>
              </div>

              {/* Staggered Non-Standard Asymmetrical Dual Column layout representing 'The Story' */}
              <div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 items-start pt-4`}>
                
                {/* Column A (Metadatas and vibes descriptors - 4 cols) */}
                <div className={`lg:col-span-4 space-y-6 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="space-y-4 bg-charcoal-deep/40 border border-charcoal/80 p-6 md:p-8">
                    <span className="text-[9px] tracking-[0.25em] text-gold uppercase block font-sans font-bold">
                      ATMOSPHERIC BLUEPRINT
                    </span>
                    
                    <div className="space-y-4 text-xs font-sans">
                      <div className="flex justify-between items-center pb-2 border-b border-charcoal/40">
                        <span className="text-platinum/40 uppercase text-[9px] font-mono">Sensory Tone</span>
                        <span className="text-stark-white text-right font-serif italic text-xs">{gala.vibe}</span>
                      </div>
                      <div className="flex justify-between items-center pb-2 border-b border-charcoal/40">
                        <span className="text-platinum/40 uppercase text-[9px] font-mono">CHRONOLOGY</span>
                        <span className="text-stark-white text-right font-mono text-[10px]">{gala.year}</span>
                      </div>
                      <div className="flex justify-between items-start pt-1">
                        <span className="text-platinum/40 uppercase text-[9px] font-mono">SPEC VECTORS</span>
                        <div className="flex flex-col gap-1 items-end">
                          {gala.atmosphereKeywords.map((tag) => (
                            <span key={tag} className="text-[9px] font-mono bg-charcoal text-platinum/70 px-2 py-0.5 rounded-none uppercase">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column B (The narrative overlay "The Story" - 8 cols) */}
                <div className={`lg:col-span-8 space-y-6 lg:px-6 ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                  <div className="relative">
                    {/* Big beautiful watermark style overlap text "THE STORY" */}
                    <div className="absolute -top-16 left-0 text-charcoal-deep font-serif italic text-7xl md:text-9xl select-none font-bold opacity-30 pointer-events-none leading-none tracking-tighter">
                      The Story
                    </div>
                    
                    <div className="relative pt-6 space-y-4">
                      <span className="text-[10px] tracking-[0.3em] text-gold uppercase block font-sans font-semibold">
                        L'Œuvre d'Art Tactile
                      </span>
                      <h4 className="text-2xl md:text-3xl font-serif text-stark-white font-light tracking-wide leading-tight">
                        {gala.storyTitle}
                      </h4>
                      <p className="text-sm font-sans font-light leading-relaxed text-platinum/80 text-justify">
                        {gala.narrative}
                      </p>
                    </div>
                  </div>

                  <div className="h-[1px] w-full bg-charcoal/50 pt-4" />
                </div>

              </div>

            </div>
          );
        })}
      </div>

      {/* Luxury Quote footer block inside Portfolio */}
      <div className="mt-32 max-w-2xl mx-auto text-center py-16 border-t border-b border-charcoal/60 bg-charcoal-deep/10">
        <span className="text-4xl font-serif text-gold/40 block mb-2 font-normal">“</span>
        <p className="text-lg md:text-xl leading-relaxed font-serif text-[#E5E5E5]/90 italic px-6 pb-6 pt-1">
          To orchestrate an elite spatial event is to bridge high physics with molecular design. The sensory blueprint must dissolve into memory completely, leaving only a residue of absolute grace.
        </p>
        <div className="h-[1.5px] w-8 bg-gold mx-auto mb-3" />
        <p className="uppercase tracking-[0.25em] text-[8.5px] text-gold/80 font-mono font-medium">
          COGNITIVE RECEPTIONS / PRINCIPAL CHRONICLER
        </p>
      </div>

    </div>
  );
}
