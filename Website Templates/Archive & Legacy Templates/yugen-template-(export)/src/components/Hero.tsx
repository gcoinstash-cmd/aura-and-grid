/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Calendar, ChevronDown, Compass } from 'lucide-react';
import { HERO_CONTENT } from '../data';

interface HeroProps {
  onReserveClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onReserveClick, onExploreClick }: HeroProps) {
  return (
    <section className="relative w-full min-h-screen flex flex-col justify-between pt-32 pb-20 bg-yugen-bg overflow-hidden">
      
      {/* Background Graphic: Fine Arts Food Photography with subtle zoom effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-[0.22] scale-100 animate-[pulse_12s_infinite]"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=1600')`,
            backgroundPosition: '50% 35%'
          }}
        />
        {/* Soft, dark gradient vignette protecting readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-yugen-bg via-yugen-bg/45 to-yugen-bg" />
      </div>

      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />

      {/* Primary Centering Container */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto w-full space-y-8 relative z-10">
        
        {/* Elegant Top Kicker */}
        <div className="inline-flex items-center gap-2 border border-white/5 bg-white/[0.02] px-4 py-1.5 rounded-full backdrop-blur-md">
          <Compass className="h-3.5 w-3.5 text-yugen-gold" />
          <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-neutral-400">
            {HERO_CONTENT.kicker}
          </span>
        </div>

        {/* Masterpiece Editorial Heading */}
        <h1 
          className="font-serif text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light text-white tracking-tight leading-[1.1]"
          dangerouslySetInnerHTML={{ __html: HERO_CONTENT.headlineHtml }}
        />

        {/* Cinematic Understated Subtext */}
        <p className="font-sans text-xs sm:text-sm text-neutral-400/90 leading-relaxed max-w-xl mx-auto tracking-wide">
          {HERO_CONTENT.description}
        </p>

        {/* Premium Core Action CTAs with vertical stack on mobile, horizontal flow on sm+ */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mx-auto" id="hero-actions-container">
          <button
            onClick={onReserveClick}
            className="w-full sm:w-1/2 h-14 flex items-center justify-center px-6 bg-transparent border border-yugen-gold text-yugen-gold hover:bg-yugen-gold/10 hover:text-white font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 pointer-events-auto cursor-pointer"
            id="hero-reserve-btn"
          >
            <span className="block leading-none">{HERO_CONTENT.reserveCta}</span>
          </button>
          
          <button 
            onClick={onExploreClick}
            id="hero-explore-btn"
            className="w-full sm:w-1/2 h-14 flex items-center justify-center px-6 bg-transparent border border-white/10 hover:border-yugen-gold/30 text-neutral-400 hover:text-yugen-gold font-semibold text-xs uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
          >
            <span className="block leading-none">{HERO_CONTENT.reviewCta}</span>
          </button>
        </div>

      </div>

      {/* Bottom Floating Scroll Hint positioned safely via relative-offset safe bounds */}
      <div className="relative z-10 flex flex-col items-center gap-2 cursor-pointer opacity-75 hover:opacity-100 transition-opacity mt-8" onClick={onExploreClick}>
        <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-neutral-500">
          {HERO_CONTENT.scrollHint}
        </span>
        <ChevronDown className="h-4 w-4 text-yugen-gold animate-bounce" />
      </div>

    </section>
  );
}
