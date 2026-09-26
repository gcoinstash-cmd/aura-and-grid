/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, Flame, Sparkles, TrendingUp, Compass, Landmark } from 'lucide-react';

interface StoryChapter {
  id: string;
  chapterNumber: string;
  title: string;
  subtitle: string;
  meta: string;
  description: string;
  accentQuote: string;
  icon: React.ReactNode;
  imageUrl: string;
  farmDetails: {
    grower: string;
    region: string;
    elevation: string;
    soil: string;
    temperature: string;
  };
}

export default function ResidencyStories() {
  const [activeChapter, setActiveChapter] = useState<string>('chapter-1');

  const chapters: StoryChapter[] = [
    {
      id: 'chapter-1',
      chapterNumber: '01',
      title: 'The Ancestral Botanical Hunt',
      subtitle: 'VOLCANIC SOIL PROFILE & SELECTION',
      meta: 'CAUCA — HARAAZ — BOQUETE OUTPOSTS',
      description: 'Our sourcing journey is a rigorous quest for botanical rarities. We avoid hyper-industrialized farming models, choosing to ascend mountain cliff cooperatives in the Haraaz Highlands of Yemen or isolated smallholding gardens in Boquete. By establishing micro-contracts directly with specific smallholder families, we secure unique anaerobic honey mutations that never enter standard commercial streams.',
      accentQuote: "“We do not buy crops; we partner with generations of botanical guardians.”",
      icon: <Compass className="w-5 h-5 text-[#C5A880]" />,
      imageUrl: 'https://images.unsplash.com/photo-1518057111178-44a106bad636?auto=format&fit=crop&q=80&w=800',
      farmDetails: {
        grower: 'Al-Sallal Cooperative',
        region: 'Haraaz Mountains, Yemen',
        elevation: '2,350 MASL',
        soil: 'Volcanic Basalt',
        temperature: '14°C — 22°C (Optimal Dry Air)'
      }
    },
    {
      id: 'chapter-2',
      chapterNumber: '02',
      title: 'Decelerated Thermal Alchemy',
      subtitle: 'THERMODYNAMIC PROFILE CURVES',
      meta: 'THE OBSIDIAN LABS PROFILE ROASTS',
      description: 'Traditional roasting carbonizes cellulose to accelerate output. We reject this. In our Arts District laboratory, we utilize vintage German cast-iron drum roasters. Using custom thermodynamic sensors, we deploy an elongated baking phase coupled with a violent thermal shock cooling line. This preserves volatile jasmine terpene compounds and ensures a translucent, sweet acidity.',
      accentQuote: "“Fierce temperature precision produces clean cup translucency.”",
      icon: <Flame className="w-5 h-5 text-[#C5A880]" />,
      imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
      farmDetails: {
        grower: 'Arts District Lab',
        region: 'Los Angeles, California',
        elevation: 'Sea Level Micro Roast',
        soil: 'Vintage Cast Iron Pro-Line',
        temperature: 'Charge at 198°C — First Crack 9m 12s'
      }
    },
    {
      id: 'chapter-3',
      chapterNumber: '03',
      title: 'Rituals in Light and Shadow',
      subtitle: 'THE SLOW-BAR CONCEPTS',
      meta: '8-SEAT PRIVATE OMAKASE BENCHES',
      description: 'The physical space is formulated to honor the beans culinary value. Operating as a quiet oasis in the middle of the Los Angeles Arts District, our concrete slow-bar limits seats to eight observers. We pour exclusively using calibrated mineral-profile waters (120 TDS with precise Magnesium/Calcium splits) through raw custom pottery. Silent, meditative extraction.',
      accentQuote: "“Coffee is not a fuel; it is a direct window into terroir chemistry.”",
      icon: <Landmark className="w-5 h-5 text-[#C5A880]" />,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=800',
      farmDetails: {
        grower: 'Obsidian HQ Space',
        region: 'LA Arts District, US',
        elevation: 'Minimalist Slow Bar',
        soil: 'Architectural Micro Concrete',
        temperature: 'Pouring at exactly 92.5°C'
      }
    }
  ];

  return (
    <section id="philosophy" className="py-24 bg-[#080808] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Intro */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">THE RESIDENCY STORIES</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide leading-tight">
            Tracing Soil Chemistry <br/>
            to the <span className="italic">Los Angeles Slow Bar</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            Unpack the deliberate narrative checkpoints that guide our coffee beans. From volcanic terrace farming directly to your artisan cup in California.
          </p>
        </div>

        {/* Dynamic Storytelling Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          
          {/* Chapter Selectors (Span 5) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-4 flex flex-col">
              {chapters.map((chap) => {
                const isSelected = chap.id === activeChapter;
                return (
                  <button
                    key={chap.id}
                    onClick={() => setActiveChapter(chap.id)}
                    className={`p-6 border text-left transition-all duration-500 rounded-none relative overflow-hidden group cursor-pointer ${
                      isSelected
                        ? 'border-[#C5A880] bg-[#121212]'
                        : 'border-[#262626]/60 bg-[#0C0C0C] hover:border-neutral-700'
                    }`}
                  >
                    {/* Background hover accent */}
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#C5A880] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                    <div className="flex items-start justify-between">
                      <div className="space-y-1.5 flex-1 pr-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[9px] text-[#C5A880] tracking-[0.2em]">CHAPTER {chap.chapterNumber}</span>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />}
                        </div>
                        <h4 className="font-serif text-xl font-light text-[#F5F5F3] group-hover:text-[#C5A880] transition-colors">
                          {chap.title}
                        </h4>
                        <span className="font-mono text-[8px] text-[#A3A3A3] tracking-widest block uppercase">
                          {chap.subtitle}
                        </span>
                      </div>
                      
                      <div className="mt-1 shrink-0 p-2 bg-[#121212] border border-[#262626] rounded-full text-[#C5A880]">
                        {chap.icon}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro infographics representing Roasting Graph or Farm Elevations */}
            <div className="bg-[#121212] border border-[#262626] p-6 space-y-4 rounded-none text-left">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest">THERMO ROAST STAGE CURVE</span>
                <span className="font-mono text-[8px] text-[#C5A880]">FIRST CRACK LOCKED</span>
              </div>
              
              {/* Graphic representation of roasted variables via simple elegant CSS bars */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#A3A3A3]">
                    <span>Drying Phase (Moisture loss)</span>
                    <span className="text-[#F5F5F3]">45% Rate</span>
                  </div>
                  <div className="h-1 bg-[#181818] w-full relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#C5A880]"
                      animate={{ width: activeChapter === 'chapter-2' ? '85%' : '45%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#A3A3A3]">
                    <span>Maillard Reaction (Aromatic formulation)</span>
                    <span className="text-[#F5F5F3]">35% Rate</span>
                  </div>
                  <div className="h-1 bg-[#181818] w-full relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#C5A880]"
                      animate={{ width: activeChapter === 'chapter-1' ? '65%' : activeChapter === 'chapter-2' ? '90%' : '35%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-[#A3A3A3]">
                    <span>Development Time (Terpene retention)</span>
                    <span className="text-[#F5F5F3]">20% Rate</span>
                  </div>
                  <div className="h-1 bg-[#181818] w-full relative">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-[#C5A880]"
                      animate={{ width: activeChapter === 'chapter-3' ? '95%' : '20%' }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter Specific Details Panel (Span 7) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {chapters.map((chap) => {
                if (chap.id !== activeChapter) return null;
                return (
                  <motion.div
                    key={chap.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-[#0C0C0C] border border-[#262626] p-8 md:p-10 flex flex-col justify-between h-full space-y-8 shadow-2xl relative overflow-hidden"
                  >
                    {/* Shadow overlay background */}
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#C5A880]/5 to-transparent pointer-events-none" />

                    <div className="space-y-6">
                      
                      {/* Interactive narrative text */}
                      <span className="font-mono text-[9px] text-[#C5A880] tracking-[0.25em] block uppercase">{chap.meta}</span>
                      
                      <h3 className="font-serif text-3xl md:text-4xl font-light text-[#F5F5F3] text-left">
                        {chap.title}
                      </h3>

                      <p className="font-sans text-[13px] md:text-sm text-[#A3A3A3] font-light leading-relaxed text-left">
                        {chap.description}
                      </p>

                      <div className="border-l-2 border-[#C5A880] pl-5 py-2 text-left">
                        <span className="font-serif text-base text-[#F5F5F3] font-light italic leading-relaxed block">
                          {chap.accentQuote}
                        </span>
                      </div>

                    </div>

                    {/* Infographics and specifics metadata */}
                    <div className="border-t border-[#262626] pt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-left items-center bg-[#0C0C0C]">
                      
                      {/* Image Thumbnail */}
                      <div className="aspect-[4/3] rounded-none border border-[#262626] overflow-hidden bg-neutral-900 shadow-lg">
                        <img
                          src={chap.imageUrl}
                          alt={chap.title}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover filter saturate-[0.6] brightness-[0.7] hover:saturate-100 transition-all duration-700"
                        />
                      </div>

                      {/* Technical database details */}
                      <div className="space-y-3.5">
                        <span className="font-mono text-[9px] text-[#C5A880] tracking-widest block uppercase">TRACE-GRID MATRIX</span>
                        <div className="space-y-2 text-[11px] font-mono text-[#A3A3A3]">
                          <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                            <span>Sourcing / Roaster:</span>
                            <span className="text-[#F5F5F3]">{chap.farmDetails.grower}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                            <span>Micro-Region:</span>
                            <span className="text-[#F5F5F3] text-right">{chap.farmDetails.region}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                            <span>Target Level:</span>
                            <span className="text-[#F5F5F3]">{chap.farmDetails.elevation}</span>
                          </div>
                          <div className="flex justify-between border-b border-[#262626]/40 pb-1.5">
                            <span>Substrates:</span>
                            <span className="text-[#F5F5F3]">{chap.farmDetails.soil}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Thermal Target:</span>
                            <span className="text-[#C5A880]">{chap.farmDetails.temperature}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
