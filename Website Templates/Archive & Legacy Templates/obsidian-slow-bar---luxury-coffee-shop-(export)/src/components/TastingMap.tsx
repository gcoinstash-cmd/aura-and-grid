/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Compass, Navigation, RefreshCw, Layers } from 'lucide-react';
import { OrderTrackState } from '../types';

interface TastingMapProps {
  currentActiveOrder: OrderTrackState | null;
  onClearOrder: () => void;
}

export default function TastingMap({ currentActiveOrder, onClearOrder }: TastingMapProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simulated fallback order if none exists yet, so that it's highly interactive immediately
  const fallbackOrder: OrderTrackState = {
    orderId: 'OBSDN-1002',
    status: 'brewing',
    estimatedTime: '8 Minutes',
    items: ['1 x Wush Wush Gesha (Pour Over grind)'],
    pickupCode: 'SLOW-12'
  };

  const activeOrder = currentActiveOrder || fallbackOrder;

  const handleQuerySearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate query validation
    if (!searchTerm) return;
    alert(`Searching workspace for token: ${searchTerm}. Connected to LA Arts District server node...`);
  };

  return (
    <section id="location" className="py-24 bg-[#0B0B0B] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Intro */}
        <div className="max-w-3xl mb-16 space-y-4 text-left">
          <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">GEOGRAPHIC BLUEPRINT</span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide">
            Location & <span className="italic">Order Tracking</span>
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light leading-relaxed">
            Head to our physical coffee laboratory in Los Angeles for direct counter collections, or inspect the real-time thermal queue calibration of your active brewing orders.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
          
          {/* LEFT: ACTIVE ORDER TRACKING TERMINAL (Span 5) */}
          <div className="lg:col-span-5 bg-[#0E0E0E] border border-[#262626] p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              
              {/* Box Title */}
              <div className="flex items-center justify-between border-b border-[#262626] pb-4 bg-[#0E0E0E]">
                <div className="space-y-1">
                  <span className="font-mono text-[8s] text-[#C5A880] tracking-widest block uppercase">QUEUE COCKPIT</span>
                  <h4 className="font-serif text-lg font-light text-[#F5F5F3] text-left">Active Brewing Queue</h4>
                </div>
                
                <span className="font-mono text-[9px] text-zinc-500">REFRESHING LOCAL...</span>
              </div>

              {/* Order Search Bar */}
              <form onSubmit={handleQuerySearch} className="relative">
                <input
                  type="text"
                  placeholder="Insert Order reference (e.g. OBSDN-1002)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#121212] border border-[#262626] font-mono text-xs p-3.5 pr-12 focus:outline-none focus:border-[#C5A880] text-[#A3A3A3] focus:text-[#F5F5F3]"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C5A880] hover:text-[#F5F5F3] transition-colors bg-transparent cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Order tracking timeline indicators */}
              <div className="bg-[#121212] border border-[#262626] p-5 space-y-5 rounded-none text-left">
                
                <div className="flex justify-between items-center text-[11px] font-mono border-b border-[#262626] pb-2.5">
                  <span className="text-[#A3A3A3]">TOKEN ID: <span className="text-[#F5F5F3] font-medium">{activeOrder.orderId}</span></span>
                  <span className="text-[#C5A880] font-semibold">{activeOrder.status.toUpperCase()}</span>
                </div>

                <div className="space-y-4 relative pl-5 border-l border-[#262626]">
                  
                  {/* Step 1: Received */}
                  <div className="relative">
                    <div className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5A880]" />
                    <div className="space-y-0.5">
                      <span className="font-mono text-[10px] text-[#F5F5F3] block">1. SECURED IN QUEUE</span>
                      <span className="font-sans text-[10px] text-neutral-500 block leading-relaxed">Your order is accepted in our Arts District roasting queue.</span>
                    </div>
                  </div>

                  {/* Step 2: Brewing / Roasting */}
                  <div className="relative">
                    <div className={`absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#121212] ${
                      activeOrder.status === 'brewing' ? 'bg-[#C5A880] animate-pulse' : activeOrder.status === 'ready' || activeOrder.status === 'collected' ? 'bg-[#C5A880]' : 'bg-neutral-800'
                    }`} />
                    <div className="space-y-0.5">
                      <span className={`font-mono text-[10px] block ${activeOrder.status === 'brewing' ? 'text-[#F5F5F3]' : 'text-zinc-500'}`}>2. FLUID THERMO EXTRACTION</span>
                      <span className="font-sans text-[10px] text-neutral-500 block leading-relaxed">Head barista is testing density variables and pouring at 92.5°C.</span>
                    </div>
                  </div>

                  {/* Step 3: Ready */}
                  <div className="relative">
                    <div className={`absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#121212] ${
                      activeOrder.status === 'ready' ? 'bg-[#C5A880] animate-pulse' : activeOrder.status === 'collected' ? 'bg-[#C5A880]' : 'bg-neutral-800'
                    }`} />
                    <div className="space-y-0.5">
                      <span className={`font-mono text-[10px] block ${activeOrder.status === 'ready' ? 'text-[#F5F5F3]' : 'text-zinc-500'}`}>3. READY AT SLOW BAR CODES</span>
                      <span className="font-sans text-[10px] text-neutral-500 block leading-relaxed">Sealed on delivery tray with descriptive terroir charts.</span>
                    </div>
                  </div>

                </div>

                {/* Pickup indicators */}
                <div className="border-t border-[#262626] pt-4 mt-2 grid grid-cols-2 gap-3 font-mono text-[10px]">
                  <div>
                    <span className="text-zinc-500 block">ESTIMATED WAIT:</span>
                    <span className="text-[#F5F5F3] font-bold block mt-0.5">{activeOrder.estimatedTime}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">PICKUP CODE:</span>
                    <span className="text-[#C5A880] font-bold block mt-0.5">{activeOrder.pickupCode}</span>
                  </div>
                </div>

              </div>

            </div>

            {/* General Location contact footnote details */}
            <div className="space-y-4 pt-6 border-t border-[#262626]/40 text-left">
              <span className="font-mono text-[9px] text-[#C5A880] tracking-widest block uppercase">THE LOS ANGELES FLAGSHIP</span>
              
              <div className="grid grid-cols-2 gap-4 font-sans text-xs text-[#A3A3A3] leading-relaxed">
                <div>
                  <h5 className="text-[#F5F5F3] font-semibold font-serif text-sm mb-1">Slow Bar Counter</h5>
                  <p>824 E 3rd Street,</p>
                  <p>LA Arts District, CA 90013</p>
                </div>
                <div>
                  <h5 className="text-[#F5F5F3] font-semibold font-serif text-sm mb-1">Sensory Hours</h5>
                  <p>Tuesday — Thursday: 8am — 4pm</p>
                  <p>Friday — Sunday: 8am — 6pm</p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: VECTOR GEOGRAPHIC CAD BLUEPRINT MAP (Span 7) */}
          <div className="lg:col-span-7 bg-[#0E0E0E] border border-[#262626] p-8 flex flex-col justify-between relative overflow-hidden">
            
            {/* Absolute compass and status labels */}
            <div className="absolute top-8 right-8 flex items-center space-x-1.5 font-mono text-[8.5px] text-[#A3A3A3] bg-[#121212] border border-[#262626] px-3 py-1 z-20">
              <Compass className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>N 33.7490° / W 118.2437°</span>
            </div>

            <div className="space-y-2 text-left">
              <span className="font-mono text-[9px] text-[#C5A880] tracking-[0.3em] block uppercase">ARTS DISTRICT LOCAL MAP GRID</span>
              <h4 className="font-serif text-lg font-light text-[#F5F5F3]">Structural Location Map</h4>
              <p className="font-sans text-xs text-[#A3A3A3] mt-2 max-w-sm leading-relaxed">
                Rendered vector interface projection representing physical street segments in the Los Angeles Arts District block.
              </p>
            </div>

            {/* Custom Interactive Vector Map represented visually using CSS & SVG absolute positions */}
            <div className="my-8 aspect-video w-full bg-[#080808] border border-[#262626] flex items-center justify-center p-6 relative overflow-hidden">
              
              {/* Fine architectural millimeter lines grid */}
              <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 opacity-15 pointer-events-none">
                {Array.from({ length: 110 }).map((_, idx) => (
                  <div key={idx} className="border-t border-l border-neutral-700 font-mono text-[5px] text-zinc-800 p-0.5">
                    {idx % 11 === 0 ? `+${idx}` : ''}
                  </div>
                ))}
              </div>

              {/* Stylized Street roads representing the Arts District layout */}
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Alameda street vertical road */}
                <div className="absolute left-[15%] top-0 bottom-0 w-8 bg-[#121212] border-x border-[#262626]/40 flex items-center justify-center">
                  <span className="font-mono text-[7px] text-neutral-600 rotate-90 tracking-widest uppercase">ALAMEDA ST</span>
                </div>

                {/* Santa Fe Avenue vertical road */}
                <div className="absolute right-[15%] top-0 bottom-0 w-8 bg-[#121212] border-x border-[#262626]/40 flex items-center justify-center">
                  <span className="font-mono text-[7px] text-neutral-600 rotate-90 tracking-widest uppercase">SANTA FE AVE</span>
                </div>

                {/* E 3rd Street horizontal road spanning Alameda to Santa Fe */}
                <div className="absolute top-[45%] left-0 right-0 h-8 bg-[#121212] border-y border-[#262626]/40 flex items-center justify-between px-16">
                  <span className="font-mono text-[7px] text-neutral-600 tracking-widest uppercase">EAST 3RD STREET (CREATIVE SPINE)</span>
                </div>

                {/* Traction Avenue slanting angular road */}
                <div className="absolute top-[10%] left-[25%] right-[25%] h-6 bg-[#121212] border-y border-[#262626]/30 rotate-[22deg] origin-top-left flex items-center justify-center">
                  <span className="font-mono text-[6.5px] text-neutral-600 tracking-widest uppercase">TRACTION AVE</span>
                </div>
              </div>

              {/* Physical Landmarks indicators */}
              
              {/* Landmark 1: SCI-Arc building */}
              <div className="absolute top-[15%] right-[25%] px-2.5 py-1 bg-[#121212]/90 border border-[#262626] font-mono text-[6.5px] text-[#A3A3A3] tracking-wider pointer-events-none">
                SCI-ARC
              </div>

              {/* Landmark 2: Hauser & Wirth */}
              <div className="absolute bottom-[20%] left-[25%] px-2.5 py-1 bg-[#121212]/90 border border-[#262626] font-mono text-[6.5px] text-[#A3A3A3] tracking-wider pointer-events-none">
                HAUSER & WIRTH
              </div>

              {/* Master Flagship: OBSIDIAN slow bar pin location */}
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: [0.95, 1.05, 0.95] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="absolute top-[40%] left-[55%] -translate-y-1/2 -translate-x-1/2 z-10 flex flex-col items-center cursor-pointer"
              >
                {/* Ambient pulse wave */}
                <div className="absolute w-8 h-8 rounded-full bg-[#C5A880]/15 animate-ping" />

                <div className="w-10 h-10 rounded-full bg-[#080808] border-2 border-[#C5A880] flex items-center justify-center shadow-2xl relative z-10">
                  <MapPin className=" some absolute w-5 h-5 text-[#C5A880]" />
                </div>

                {/* Address Label tooltip */}
                <div className="mt-2.5 px-3 py-1.5 bg-[#080808] border border-[#C5A880] rounded-none shadow-xl">
                  <span className="font-serif text-[10px] text-[#C5A880] block font-semibold tracking-wide">OBSIDIAN COFFEE OUTPOST</span>
                  <span className="font-sans text-[8px] text-[#A3A3A3] block tracking-wide uppercase mt-0.5">824 E 3rd St • Slow Bar Desk</span>
                </div>
              </motion.div>

              {/* Transit tracking dot indicator representing pickup car/transit live status */}
              <motion.div
                animate={{
                  x: [-80, 20, -80],
                  y: [-30, -30, -30]
                }}
                transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
                className="absolute top-[49%] left-[30%] z-20"
              >
                <div className="flex items-center space-x-1 bg-[#080808]/85 border border-[#262626] p-1 px-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 block animate-pulse" />
                  <span className="font-mono text-[6px] text-zinc-400">PICKUP COURIER TRANSIT</span>
                </div>
              </motion.div>

            </div>

            {/* Bottom guide info */}
            <div className="bg-[#121212]/85 border border-[#262626] p-4 font-sans text-[11px] text-[#A3A3A3] flex items-center space-x-2.5 text-left bg-[#121212]">
              <Navigation className="w-5 h-5 text-[#C5A880] shrink-0" />
              <p className="leading-relaxed font-light">
                Simply specify order reference token ID in the search field above to track your fresh espresso or filter drip orders. Double-points are applied on all self-collection bookings at our LA Arts District counter.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
