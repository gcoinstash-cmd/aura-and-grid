/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Info, ShoppingBag, Flame, Sparkles, Filter } from 'lucide-react';
import { CoffeeBean, CartItem } from '../types';
import { COFFEE_BEANS } from '../data';
import { motion, AnimatePresence } from 'motion/react';

interface CollectionProps {
  onAddToBag: (coffee: CoffeeBean, grind: string) => void;
  onSelectCoffee: (coffee: CoffeeBean) => void;
}

export default function Collection({ onAddToBag, onSelectCoffee }: CollectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState('All');
  const [selectedRoast, setSelectedRoast] = useState('All');
  const [flavorFilter, setFlavorFilter] = useState('All');
  const [selectedGrinds, setSelectedGrinds] = useState<Record<string, string>>({});

  // Extraction of all unique origins for filter tabs
  const originsList = useMemo(() => {
    const list = new Set(COFFEE_BEANS.map(bean => bean.origin.split(',').pop()?.trim() || bean.origin));
    return ['All', ...Array.from(list)];
  }, []);

  // Extractions of profiles
  const profiles = ['All', 'Floral', 'Fruity', 'Chocolatey', 'Spicy'];

  // Handle filter matching
  const filteredBeans = useMemo(() => {
    return COFFEE_BEANS.filter(bean => {
      // Search Box (searches text, tasting notes, details)
      const matchesSearch = 
        bean.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.subName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bean.tastingNotes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));

      // Origin Filter
      const matchesOrigin = selectedOrigin === 'All' || bean.origin.includes(selectedOrigin);

      // Roast Level Filter
      const matchesRoast = selectedRoast === 'All' || bean.roastLevel === selectedRoast;

      // Flavor profile filter matching
      let matchesFlavor = true;
      if (flavorFilter !== 'All') {
        const lowerNotes = bean.tastingNotes.map(n => n.toLowerCase());
        if (flavorFilter === 'Floral') {
          matchesFlavor = lowerNotes.some(n => n.includes('jasmine') || n.includes('lavender') || n.includes('blossom') || n.includes('tea'));
        } else if (flavorFilter === 'Fruity') {
          matchesFlavor = lowerNotes.some(n => n.includes('peach') || n.includes('cherry') || n.includes('apricot') || n.includes('fruit') || n.includes('citron') || n.includes('lychee') || n.includes('syrup') || n.includes('grapefruit'));
        } else if (flavorFilter === 'Chocolatey') {
          matchesFlavor = lowerNotes.some(n => n.includes('cocoa') || n.includes('hazelnut') || n.includes('cacao') || n.includes('chocolate'));
        } else if (flavorFilter === 'Spicy') {
          matchesFlavor = lowerNotes.some(n => n.includes('ginger') || n.includes('spice') || n.includes('cardamom') || n.includes('sandalwood'));
        }
      }

      return matchesSearch && matchesOrigin && matchesRoast && matchesFlavor;
    });
  }, [searchQuery, selectedOrigin, selectedRoast, flavorFilter]);

  const handleGrindChange = (beanId: string, value: string) => {
    setSelectedGrinds(prev => ({ ...prev, [beanId]: value }));
  };

  return (
    <section id="collection" className="py-24 bg-[#0B0B0B] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">THE ARCHIVE</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide">
              The Specialty <span className="italic">Micro-Lots</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light max-w-lg leading-relaxed">
              Extremely small batches extracted for pure aesthetic clarity. Each lot contains unique genetics, custom thermal roast profiles, and high sensory cupping ratings.
            </p>
          </div>

          <div className="flex items-center space-x-2 font-mono text-[9px] text-[#A3A3A3] tracking-[0.1em] border border-[#262626] rounded-full px-4 py-1.5 bg-[#121212]">
            <Sparkles className="w-3 h-3 text-[#C5A880] animate-pulse" />
            <span>AUTHENTIC SINGLE-ORIGIN TRACEABILITY</span>
          </div>
        </div>

        {/* Dynamic Filters & Search Command Box */}
        <div className="bg-[#121212] border border-[#262626]/40 p-6 md:p-8 rounded-none mb-12 shadow-2xl space-y-6">
          
          {/* Main Search Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#A3A3A3]" />
              <input
                type="text"
                placeholder="Search single origins, tasting notes (jasmine, bergamot), or elevation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#080808] border border-[#262626] font-sans text-xs focus:text-[#F5F5F3] text-[#A3A3A3] pl-12 pr-4 py-4.5 focus:outline-none focus:border-[#C5A880] focus:ring-1 focus:ring-[#C5A880]/20 transition-all placeholder:text-neutral-600 rounded-none tracking-wide"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-[#A3A3A3] hover:text-[#C5A880] uppercase tracking-wider bg-transparent cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Flavor Bio Profiles */}
            <div className="lg:col-span-6 flex items-center space-x-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1">
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase shrink-0">Profile:</span>
              {profiles.map((profile) => (
                <button
                  key={profile}
                  onClick={() => setFlavorFilter(profile)}
                  className={`px-4 py-2 border rounded-none font-mono text-[10px] tracking-widest uppercase transition-all whitespace-nowrap cursor-pointer ${
                    flavorFilter === profile
                      ? 'bg-[#C5A880] border-[#C5A880] text-[#080808] font-semibold'
                      : 'border-[#262626] text-[#A3A3A3] hover:border-[#A3A3A3] hover:text-[#F5F5F3]'
                  }`}
                >
                  {profile}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] bg-[#262626]/40 w-full" />

          {/* Sub Origin and Roast Filtering Layouts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            {/* Origin Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase mr-2">Origin:</span>
              {originsList.map((origin) => (
                <button
                  key={origin}
                  onClick={() => setSelectedOrigin(origin)}
                  className={`px-3.5 py-1.5 border font-mono text-[10px] tracking-wider transition-all cursor-pointer ${
                    selectedOrigin === origin
                      ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                      : 'border-transparent text-[#A3A3A3] hover:text-[#F5F5F3]'
                  }`}
                >
                  {origin}
                </button>
              ))}
            </div>

            {/* Roast Selection */}
            <div className="flex items-center space-x-3">
              <span className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase">Roast:</span>
              <select
                value={selectedRoast}
                onChange={(e) => setSelectedRoast(e.target.value)}
                className="bg-[#080808] border border-[#262626] font-mono text-[10px] py-1.5 px-3.5 text-[#A3A3A3] focus:outline-none focus:border-[#C5A880] transition-colors rounded-none tracking-widest uppercase"
              >
                <option value="All">All Roasts</option>
                <option value="light">Light</option>
                <option value="light-medium">Light-Medium</option>
                <option value="medium">Medium</option>
              </select>
            </div>

          </div>

        </div>

        {/* Dynamic Coffe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredBeans.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full py-16 text-center border border-dashed border-[#262626] flex flex-col items-center justify-center p-8 bg-[#121212]/30"
              >
                <Info className="w-8 h-8 text-[#C5A880] mb-4 animate-bounce" />
                <h3 className="font-serif text-lg text-[#F5F5F3] font-light italic">No Micro-Lots found matching your sensor criteria.</h3>
                <p className="font-sans text-xs text-[#A3A3A3] mt-2 max-w-md leading-relaxed">
                  Try clearing select filters or checking flavor variants. Feel free to request customized LA Slow Bar roasting specifications at the roasting counter.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedOrigin('All');
                    setSelectedRoast('All');
                    setFlavorFilter('All');
                  }}
                  className="mt-6 font-mono text-[10px] text-[#C5A880] tracking-widest border border-[#C5A880]/30 hover:border-[#C5A880] px-6 py-2.5 transition-all text-center uppercase"
                >
                  Reset Sensors
                </button>
              </motion.div>
            ) : (
              filteredBeans.map((bean, idx) => {
                const grind = selectedGrinds[bean.id] || 'Whole Bean';
                const lotId = `LOT-${bean.id.split('-').map(p => p[0]).join('').toUpperCase() || 'SPEC'}`;
                
                return (
                  <motion.div
                    key={bean.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="group bg-[#121212] border border-[#262626]/40 hover:border-[#C5A880]/30 transition-all duration-500 overflow-hidden flex flex-col h-full hover:shadow-[0_12px_40px_rgba(197,168,128,0.03)]"
                  >
                    {/* Premium Card Header Ledger */}
                    <div className="px-5 py-3 border-b border-[#262626]/40 flex items-center justify-between bg-[#0E0E0E] font-mono text-[9px] tracking-widest text-[#A3A3A3]">
                      <span className="flex items-center space-x-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
                        <span>{lotId} // INDEX</span>
                      </span>
                      <span className="text-[#C5A880] font-medium tracking-[0.15em]">{bean.score} PTS RATING</span>
                    </div>

                    {/* Visual Photo Card */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-stone-900 border-b border-[#262626]/40">
                      {/* Limited Edition badge */}
                      {bean.isLimitedEdition && (
                        <div className="absolute top-3.5 left-3.5 z-20 flex items-center space-x-1 bg-[#C5A880] text-[#080808] font-mono text-[8px] font-bold px-2 py-0.5 tracking-widest uppercase shadow-md">
                          <Flame className="w-2.5 h-2.5 fill-current" />
                          <span>LIMITED DROP</span>
                        </div>
                      )}

                      <img
                        src={bean.imageUrl}
                        alt={bean.name}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105 filter saturate-[0.8] brightness-[0.75] group-hover:saturate-[1] group-hover:brightness-[0.9]"
                      />

                      {/* Interactive Visual Tooltip Overlay */}
                      <div className="absolute inset-0 bg-[#080808]/90 opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-between z-10 pointer-events-none">
                        <div>
                          <span className="font-mono text-[8px] text-[#C5A880] tracking-[0.2em] uppercase block mb-2">Tasting Description</span>
                          <p className="font-sans text-xs text-[#F5F5F3] font-light leading-relaxed text-left">
                            {bean.description}
                          </p>
                        </div>
                        <div className="border-t border-[#262626] pt-3 flex justify-between items-center text-[8.5px] font-mono text-[#A3A3A3]">
                          <span>ESTD PRICE</span>
                          <span className="text-[#C5A880] font-medium">${bean.price} / BAG</span>
                        </div>
                      </div>
                    </div>

                    {/* Meta description specs */}
                    <div className="p-5 flex-1 flex flex-col justify-between bg-[#121212] space-y-5">
                      <div className="space-y-3.5">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[8px] text-[#C5A880]/90 tracking-widest uppercase">{bean.subName}</span>
                          <span className="font-mono text-[9px] text-[#A3A3A3]/70">{bean.origin.split(',').pop()?.trim()}</span>
                        </div>

                        <h3 
                          onClick={() => onSelectCoffee(bean)}
                          className="font-serif text-[19px] font-medium text-[#F5F5F3] group-hover:text-[#C5A880] transition-colors duration-300 cursor-pointer text-left leading-snug"
                        >
                          {bean.name}
                        </h3>

                        {/* Premium Digital Spec Sheet Ledger */}
                        <div className="border border-[#262626]/40 rounded-none bg-[#0E0E0E] divide-y divide-[#262626]/30 text-[9.5px] font-mono">
                          {/* Provenance Origin */}
                          <div className="flex justify-between items-center px-3 py-1.5">
                            <span className="text-[#A3A3A3] uppercase tracking-widest text-[7.5px]">PROVENANCE</span>
                            <span className="text-[#F5F5F3] font-sans truncate max-w-[170px] text-right">{bean.origin}</span>
                          </div>

                          {/* Calibrated Roast Intensity profile */}
                          <div className="flex justify-between items-center px-3 py-1.5">
                            <span className="text-[#A3A3A3] uppercase tracking-widest text-[7.5px]">ROAST DEGREE</span>
                            <span className="text-[#C5A880] uppercase tracking-wider text-[8.5px]">
                              {bean.roastLevel === 'light' 
                                ? 'LIGHT Profile [●○○]' 
                                : bean.roastLevel === 'light-medium' 
                                ? 'LT-MEDIUM Profile [●●○]' 
                                : 'MEDIUM Profile [●●●]'}
                            </span>
                          </div>

                          {/* Botanical Elevation */}
                          <div className="flex justify-between items-center px-3 py-1.5">
                            <span className="text-[#A3A3A3] uppercase tracking-widest text-[7.5px]">ALTITUDE masl</span>
                            <span className="text-[#F5F5F3] tracking-wide">{bean.elevation}</span>
                          </div>

                          {/* Micro-Processing protocol */}
                          <div className="flex justify-between items-center px-3 py-1.5 border-b-0">
                            <span className="text-[#A3A3A3] uppercase tracking-widest text-[7.5px]">PROCESSING</span>
                            <span className="text-[#F5F5F3] font-sans truncate max-w-[170px] text-right">{bean.processType}</span>
                          </div>
                        </div>

                        {/* Tasting Notes palette chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {bean.tastingNotes.map((note) => (
                            <span
                              key={note}
                              className="font-mono text-[9px] text-[#A3A3A3] bg-[#0E0E0E] border border-[#262626]/50 px-2 py-0.5 tracking-wide hover:border-[#C5A880]/30 hover:text-[#C5A880] transition-colors duration-300"
                            >
                              {note}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bag Form Controls and CTA */}
                      <div className="pt-4 border-t border-[#262626]/40 space-y-4">
                        
                        <div className="grid grid-cols-2 gap-3 items-center">
                          {/* Price representation */}
                          <div className="flex flex-col text-left border-r border-[#262626]/40 pr-3">
                            <span className="font-mono text-[8px] text-[#A3A3A3] tracking-widest uppercase">TERROIR VALUE</span>
                            <div className="flex items-baseline space-x-1 mt-0.5">
                              <span className="font-serif text-lg text-[#F5F5F3] font-semibold">${bean.price}</span>
                              <span className="font-mono text-[8.5px] text-[#A3A3A3]">/ 250G</span>
                            </div>
                          </div>

                          {/* Precision Grind selection */}
                          <div className="flex flex-col text-left pl-1">
                            <span className="font-mono text-[8px] text-[#A3A3A3] tracking-widest uppercase">GRIND SPECS</span>
                            <select
                              value={grind}
                              onChange={(e) => handleGrindChange(bean.id, e.target.value)}
                              className="bg-[#080808] border border-[#262626] hover:border-[#C5A880]/30 font-mono text-[9.5px] px-1.5 py-1 text-[#F5F5F3] focus:outline-none focus:border-[#C5A880] transition-all rounded-none mt-1 outline-none text-left tracking-wide uppercase cursor-pointer"
                            >
                              <option value="Whole Bean">Whole Bean</option>
                              <option value="Espresso">Espresso</option>
                              <option value="Pour Over">Pour Over</option>
                              <option value="V60/Chemex">V60/Chemex</option>
                              <option value="Cold Brew">Cold Brew</option>
                            </select>
                          </div>
                        </div>

                        {/* Order button CTA actions */}
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => onAddToBag(bean, grind)}
                            className="w-full bg-[#1A1A1A] hover:bg-[#C5A880] text-[#C5A880] hover:text-[#080808] border border-[#C5A880]/30 hover:border-[#C5A880] font-mono text-[10px] font-semibold tracking-widest py-3 px-4 transition-all duration-300 uppercase flex items-center justify-center space-x-2 cursor-pointer relative overflow-hidden group/btn"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 group-hover/btn:translate-y-[-1px] transition-transform" />
                            <span>SECURE MICRO-LOT BAG</span>
                          </button>

                          {/* Inventory Urgency feedback indicators */}
                          {bean.stockLeft && bean.stockLeft < 15 ? (
                            <div className="flex items-center justify-center space-x-1.5 text-center w-full">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping inline-block" />
                              <span className="font-mono text-[8.5px] text-orange-400 font-medium tracking-wider uppercase">
                                ACCU-METERS ONLY {bean.stockLeft} BAGS REMAINING
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center space-x-1 text-center w-full">
                              <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                              <span className="font-mono text-[8px] text-[#A3A3A3] tracking-widest uppercase">
                                REGISTERED / GENETIC RESERVES VERIFIED
                              </span>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
