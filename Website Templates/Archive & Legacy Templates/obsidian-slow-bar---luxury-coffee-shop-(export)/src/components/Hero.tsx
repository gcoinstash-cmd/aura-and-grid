/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Play, Volume2, Info, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onCtaclick: () => void;
}

export default function Hero({ onCtaclick }: HeroProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  
  return (
    <section id="hero" className="relative min-h-screen pt-20 flex flex-col justify-center overflow-hidden bg-[#080808]">
      
      {/* Absolute Ambient Backglow */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[25%] left-[10%] w-[500px] h-[500px] bg-[#C5A880]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-neutral-900/40 rounded-full blur-[120px]" />
      </div>

      {/* Hero Visual Container Grid */}
      <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12 md:py-20">
        
        {/* Left Editorial Core Content (Column Span 7) */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8 text-left">
          
          {/* Micro-Pre-Header */}
          <div className="flex items-center space-x-3">
            <span className="w-1.5 h-[1px] bg-[#C5A880]" />
            <span className="font-mono text-[10px] sm:text-xs text-[#C5A880] tracking-[0.4em] uppercase">LOS ANGELES, CA</span>
            <span className="text-[#A3A3A3] font-mono text-[10px]">—</span>
            <span className="font-mono text-[10px] text-[#A3A3A3] tracking-[0.2em] uppercase">ARTS DISTRICT LAB</span>
          </div>

          {/* Master Serifed Manifesto Header */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-[72px] font-light leading-[1.1] tracking-tight text-[#F5F5F3]">
            Rituals in <span className="italic block mt-1">Light & Shadow.</span>
          </h1>

          <p className="font-sans text-sm sm:text-base text-[#A3A3A3] font-light leading-relaxed max-w-xl">
            Sourced globally with fierce micro-farm intentionality. Roasted on custom vintage drum-profiles, specifically curated for the unique micro-climate of Los Angeles. A slow-bar sensory temple designed for the silent observer.
          </p>

          {/* Action Metrics */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-4">
            <button
              onClick={onCtaclick}
              className="bg-[#C5A880] text-[#080808] font-mono text-[11px] font-semibold tracking-[0.25em] px-8 py-4.5 rounded-none hover:bg-[#F5F5F3] hover:text-[#080808] uppercase transition-all duration-300 transform active:scale-95 text-center cursor-pointer"
            >
              EXPLORE THE COFFEES
            </button>
            
            <a
              href="#tasting-bar"
              className="border border-[#262626] text-[#F5F5F3] font-mono text-[11px] font-semibold tracking-[0.25em] px-8 py-4.5 rounded-none hover:border-[#C5A880] uppercase transition-all duration-300 text-center"
            >
              BOOK PRIVATE OMAKASE
            </a>
          </div>

          {/* Luxury Metadata Footnote */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-[#262626]/40 max-w-lg">
            <div>
              <span className="font-mono text-[9px] text-[#A3A3A3] block tracking-[0.15em] mb-1">ORIGINS</span>
              <span className="font-serif text-lg text-[#F5F5F3]">5 micro-lots</span>
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#A3A3A3] block tracking-[0.15em] mb-1">CUPPING SCORE</span>
              <span className="font-serif text-lg text-[#F5F5F3]">93+ — 97 pts</span>
            </div>
            <div>
              <span className="font-mono text-[9px] text-[#A3A3A3] block tracking-[0.15em] mb-1">BAR SPACE</span>
              <span className="font-serif text-lg text-[#F5F5F3]">8 stool bar</span>
            </div>
          </div>

        </div>

        {/* Right Cinematic Video Frame Container (Column Span 5) */}
        <div className="lg:col-span-5 relative mt-6 lg:mt-0">
          <div className="relative group overflow-hidden bg-[#121212] border border-[#262626] p-2 aspect-[4/5] flex items-center justify-center">
            
            {/* Camera Viewfinder Corners Ornamentation */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-[#C5A880]/40 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-[#C5A880]/40 pointer-events-none" />

            {/* Simulated Live Viewfinder Overlays */}
            <div className="absolute top-6 left-6 flex items-center space-x-2 z-20 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="font-mono text-[9px] text-[#F5F5F3]/75 tracking-widest uppercase">REC</span>
              <span className="font-mono text-[8px] text-[#A3A3A3]/50">4K DCI</span>
            </div>
            
            <div className="absolute top-6 right-6 font-mono text-[8px] text-[#A3A3A3] z-20 pointer-events-none">
              24 FPS • 1/48s
            </div>

            <div className="absolute bottom-6 left-6 font-mono text-[8px] text-[#A3A3A3] z-20 pointer-events-none">
              ISO 400 • F/1.4
            </div>

            <div className="absolute bottom-6 right-6 font-mono text-[8px] text-[#C5A880] z-20 pointer-events-none">
              FOCUS • [ A ]
            </div>

            {/* Dynamic Cinematic Loop Representation */}
            {isPlaying ? (
              <div className="w-full h-full relative overflow-hidden">
                {/* Embedded atmospheric video placeholder loop */}
                <iframe
                  src="https://www.youtube.com/embed/gU9cPh6u3Uo?autoplay=1&mute=1&playlist=gU9cPh6u3Uo&loop=1&controls=0&showinfo=0&rel=0&iv_load_policy=3"
                  title="Atmospheric Pour Over Coffee"
                  className="absolute inset-0 w-full h-full object-cover scale-[1.3] pointer-events-none opacity-60 mix-blend-lighten"
                  referrerPolicy="no-referrer"
                  allow="autoplay; encrypted-media"
                />
                
                {/* Heavy Editorial Contrast Overlay */}
                <div className="absolute inset-0 bg-[#080808]/15 mix-blend-darken" />
                <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent pointer-events-none" />
              </div>
            ) : (
              <div className="w-full h-full bg-[#181818] flex flex-col items-center justify-center text-center p-8">
                <p className="font-serif text-lg text-[#F5F5F3] italic">"Observation is the highest art."</p>
                <p className="font-mono text-[10px] text-[#A3A3A3] mt-2 tracking-wider">SLOW BAR SEQUENCE PAUSED</p>
              </div>
            )}

            {/* Interaction Button Overlays on Hover */}
            <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4 z-30">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-[#080808] border border-[#C5A880]/50 hover:border-[#C5A880] flex items-center justify-center text-[#C5A880] transition-colors"
                title={isPlaying ? "Pause cinematic loop" : "Play cinematic loop"}
              >
                {isPlaying ? <span className="w-3.5 h-3.5 bg-[#C5A880] block" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </section>
  );
}
