/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================================
 * DEVELOPER DOCUMENTATION: NAVBAR COMPONENT
 * ============================================================================
 * 
 * 1. DESIGN SYSTEM & LAYOUT ROLE:
 *    The Navbar acts as a fixed visual header anchor in the Yūgen luxury layout system.
 *    It uses a customized glassmorphism styling (`bg-[#050505]/40` with `backdrop-blur-[12px]`)
 *    and a thin, understated border structure to preserve a floating, frictionless look.
 *    Designed with generous desktop padding and custom vertical size tiers (24px to 28px height triggers),
 *    it guides the user's attention down the architectural viewport curves.
 * 
 * 2. PLATFORM & HEADLESS CMS INTEGRATION BINDING:
 *    This navigation bar maps specific section scrolling references (Philosophy, Compositions, Atmosphere).
 *    To link this navigation, state flow, or user identity with a headless CMS (like Sanity, Strapi, or Contentful),
 *    you can dynamically map the link arrays by defining a `navLinksSchema` structure in your preferred CMS,
 *    and replacement components or routing hooks can map that payload within the desktop link cluster.
 *    For OAuth user profiles or secure account dashboards, import your AuthContext providers
 *    and replace the "Reserve Counter" action with customized member welcome states.
 * 
 * 3. STYLE SEGREGATION & TAILWIND FLEXIBILITY:
 *    All branding aesthetics, typography definitions, tracking values, and responsive transitions 
 *    depend fully on top-level global Tailwind configurations. Developers can freely adjust structural
 *    paddings (`px-6 sm:px-12`), size limits, or hover colors (`hover:text-[#C5A880]`) in the markup below
 *    without disrupting any underlying scrolling, drawer triggers, or overall application logic.
 * ============================================================================
 */

import { useState } from 'react';
import { Menu, X, Landmark, Compass, Server, Calendar } from 'lucide-react';

interface NavbarProps {
  onBookClick: () => void;
  onMenuClick: () => void;
  onPhilosophyClick: () => void;
  onAtmosphereClick: () => void;
}

export default function Navbar({ 
  onBookClick, 
  onMenuClick, 
  onPhilosophyClick, 
  onAtmosphereClick 
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/5 bg-yugen-bg/40 backdrop-blur-[12px] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-12">
        <div className="flex items-center justify-between h-24 sm:h-28">
          
          {/* Brand/Logo: Minimal Architectural Wordmark */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            id="navbar-brand-logo"
          >
            <span className="font-serif text-2xl tracking-[0.2em] text-white font-light">
              YŪGEN
            </span>
            <div className="h-4 w-[1px] bg-neutral-800" />
            <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-neutral-500 hidden sm:block">
              Tokyo • Kamakura
            </span>
          </div>

          {/* Desktop Navigation Link Cluster */}
          <div className="hidden md:flex items-center gap-10">
            <button 
              onClick={onPhilosophyClick}
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 hover:text-yugen-gold transition-colors cursor-pointer"
            >
              The Mindset
            </button>
            <button 
              onClick={onMenuClick}
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 hover:text-yugen-gold transition-colors cursor-pointer"
            >
              The Compositions
            </button>
            <button 
              onClick={onAtmosphereClick}
              className="text-[11px] uppercase tracking-[0.25em] text-neutral-400 hover:text-yugen-gold transition-colors cursor-pointer"
            >
              Sensory Atmosphere
            </button>
          </div>

          {/* Luxury CTA / Reserve */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={onBookClick}
              className="px-6 py-2.5 bg-neutral-900 border border-white/10 text-yugen-gold [text-shadow:_0_0_12px_rgba(197,168,128,0.2)] hover:border-yugen-gold/30 hover:bg-neutral-800 transition-all font-sans text-[10px] uppercase tracking-[0.2em]"
            >
              Reserve Counter
            </button>
          </div>

          {/* Mobile Menu Toggle button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Editorial slide-down) */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-[#050505] px-6 py-8 space-y-6 animate-fade-in">
          <div className="flex flex-col gap-6">
            <button 
              onClick={() => {
                onPhilosophyClick();
                setIsOpen(false);
              }}
              className="text-[11px] text-left uppercase tracking-[0.25em] text-neutral-400 hover:text-white"
            >
              The Mindset
            </button>
            <button 
              onClick={() => {
                onMenuClick();
                setIsOpen(false);
              }}
              className="text-[11px] text-left uppercase tracking-[0.25em] text-neutral-400 hover:text-white"
            >
              The Compositions
            </button>
            <button 
              onClick={() => {
                onAtmosphereClick();
                setIsOpen(false);
              }}
              className="text-[11px] text-left uppercase tracking-[0.25em] text-neutral-400 hover:text-white"
            >
              Sensory Atmosphere
            </button>
          </div>
          <div className="pt-6 border-t border-white/5">
            <button
              onClick={() => {
                onBookClick();
                setIsOpen(false);
              }}
              className="w-full text-center py-3 bg-yugen-gold text-black hover:bg-yugen-gold/90 transition-colors font-sans text-xs uppercase tracking-[0.2em] font-semibold"
            >
              Reserve Counter
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
