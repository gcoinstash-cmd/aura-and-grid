/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MenuItem, DiningTier } from '../types';
import { COMPOSITIONS, BEVERAGE_PAIRINGS, DINING_TIERS, MENU_HEADER_CONTENT } from '../data';
import { Compass, Sparkles, BookOpen, Volume2, Shield } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { motion, AnimatePresence } from 'motion/react';

export default function Compositions() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'nigiri' | 'pairings'>('tiers');

  return (
    <section id="compositions-section" className="relative w-full py-24 md:py-32 bg-yugen-bg block clear-both">
      
      {/* Background Graphic Grid Line offsets */}
      <div className="absolute top-0 bottom-0 left-1/3 w-[1px] bg-neutral-900/20" />
      <div className="absolute top-0 bottom-0 left-2/3 w-[1px] bg-neutral-900/20" />

      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Dynamic Header Block */}
        <div className="text-center md:text-left md:flex items-end justify-between mb-16 gap-12">
          
          <div className="space-y-4 max-w-2xl">
            <ScrollReveal delay={0} yOffset={20}>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Compass className="h-4 w-4 text-yugen-gold" />
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold">
                  {MENU_HEADER_CONTENT.kicker}
                </span>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={100} yOffset={20}>
              <h2 
                className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight"
                dangerouslySetInnerHTML={{ __html: MENU_HEADER_CONTENT.titleHtml }}
              />
            </ScrollReveal>
            
            <ScrollReveal delay={150} yOffset={20}>
              <p className="font-sans text-xs text-neutral-400 max-w-xl leading-relaxed">
                {MENU_HEADER_CONTENT.description}
              </p>
            </ScrollReveal>
          </div>

          {/* Aesthetic Toggle Bar */}
          <ScrollReveal delay={200} yOffset={15}>
            <div className="flex justify-center md:justify-end gap-2 mt-8 md:mt-0 border border-white/5 bg-neutral-950 p-1.5 rounded-sm">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('tiers');
                }}
                className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  activeTab === 'tiers' 
                    ? 'bg-yugen-gold text-black font-semibold' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {MENU_HEADER_CONTENT.tabs.tiers}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('nigiri');
                }}
                className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  activeTab === 'nigiri' 
                    ? 'bg-yugen-gold text-black font-semibold' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {MENU_HEADER_CONTENT.tabs.compositions}
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('pairings');
                }}
                className={`px-4 py-2 text-[9px] uppercase tracking-[0.2em] transition-all cursor-pointer ${
                  activeTab === 'pairings' 
                    ? 'bg-yugen-gold text-black font-semibold' 
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {MENU_HEADER_CONTENT.tabs.liquids}
              </button>
            </div>
          </ScrollReveal>

        </div>

        {/* Tab Content Canvas with Soft-Fade Transition and Dynamic Layout */}
        <div className="relative w-full min-h-[350px]">
          <AnimatePresence mode="wait">
            {activeTab === 'tiers' && (
              <motion.div
                key="tiers"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-5xl mx-auto"
              >
                {DINING_TIERS.map((tier, index) => (
                  <ScrollReveal 
                    key={tier.id}
                    delay={index * 150} 
                    yOffset={30}
                    className="h-full flex"
                  >
                    <div 
                      className={`relative p-6 sm:p-12 bg-neutral-950 border transition-all duration-500 flex flex-col justify-between w-full ${
                        tier.isPremium 
                          ? 'border-yugen-gold/30 shadow-[0_0_30px_rgba(197,168,128,0.05)]' 
                          : 'border-white/5'
                      }`}
                    >
                      {tier.isPremium && (
                        <div className="absolute top-0 right-0 transform translate-y-[-50%] translate-x-[-5%] sm:translate-x-[5%] bg-yugen-gold text-black font-sans text-[8px] uppercase tracking-[0.3em] font-bold px-4 py-1 rounded-sm">
                          High Demand Experience
                        </div>
                      )}
                      
                      <div className="space-y-6">
                        <div>
                          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-yugen-gold block mb-1">
                            {tier.subtitle}
                          </span>
                          <h3 className="font-serif text-3xl text-white font-light">
                            {tier.title}
                          </h3>
                        </div>

                        <div className="flex items-baseline gap-2 pb-6 border-b border-white/5">
                          <span className="font-serif text-4xl text-white font-light">${tier.price}</span>
                          <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-neutral-500">per person exclusive</span>
                        </div>

                        <p className="font-sans text-xs text-neutral-400 leading-relaxed italic">
                          "{tier.description}"
                        </p>

                        <div className="space-y-4 pt-4">
                          <h4 className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                            Ritual Progression Inclusions:
                          </h4>
                          <ul className="space-y-3">
                            {tier.inclusions.map((inc, i) => (
                              <li key={i} className="flex items-start gap-3 text-xs text-neutral-300 font-sans">
                                <span className="text-yugen-gold mt-0.5">•</span>
                                <span className="leading-normal">{inc}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                        <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-neutral-500">
                          Duration: ~150 Minutes
                        </span>
                        <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-yugen-gold">
                          Only 8 Guests Nightly
                        </span>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </motion.div>
            )}

            {activeTab === 'nigiri' && (
              <motion.div
                key="nigiri"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {COMPOSITIONS.map((item, index) => (
                  <ScrollReveal 
                    key={item.id}
                    delay={(index % 3) * 100}
                    yOffset={25}
                    className="h-full flex"
                  >
                    <div 
                      className="p-6 sm:p-8 bg-neutral-950 border border-white/5 flex flex-col justify-between hover:border-white/15 transition-all duration-300 w-full"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                            {item.category === 'nigiri' ? '01 // Single Press' : '02 // Compound Plating'}
                          </span>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <h3 className="font-serif text-2xl text-white font-light">
                            {item.name}
                          </h3>
                          <div className="menu-dotted-connector hidden lg:block" />
                          <span className="text-yugen-gold font-sans text-sm tracking-widest font-semibold whitespace-nowrap">
                            ${item.price}
                          </span>
                        </div>
                        {item.romanizedName && (
                          <span className="font-serif text-xs italic text-neutral-500 mt-1 block">
                            {item.romanizedName}
                          </span>
                        )}

                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/5">
                        <p className="font-sans text-[10px] text-yugen-gold/80 tracking-wide">
                          {item.sensoryNote}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </motion.div>
            )}

            {activeTab === 'pairings' && (
              <motion.div
                key="pairings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
              >
                {BEVERAGE_PAIRINGS.map((item, index) => (
                  <ScrollReveal 
                    key={item.id}
                    delay={index * 100}
                    yOffset={25}
                    className="h-full flex"
                  >
                    <div 
                      className="p-6 sm:p-8 bg-neutral-950 border border-white/5 hover:border-yugen-gold/20 transition-all duration-300 flex flex-col justify-between w-full"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-500">
                            Rare Curation
                          </span>
                        </div>

                        <div className="flex items-end justify-between gap-2">
                          <h3 className="font-serif text-2xl text-white font-light">
                            {item.name}
                          </h3>
                          <div className="menu-dotted-connector hidden lg:block" />
                          <span className="text-yugen-gold font-sans text-sm tracking-widest font-semibold whitespace-nowrap">
                            +${item.price} PP
                          </span>
                        </div>

                        <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-8 pt-4 border-t border-white/5">
                        <p className="font-sans text-[10px] text-yugen-gold italic">
                          {item.sensoryNote}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
      <div className="h-16 md:h-24 w-full block clear-both" />
    </section>
  );
}
