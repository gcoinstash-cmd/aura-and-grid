/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, Compass, Circle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-yugen-bg text-neutral-500 border-t border-white/5 py-16 relative overflow-hidden">
      
      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10 space-y-12">
        
        {/* Core Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-b border-white/5 pb-12">
          
          {/* Column 1: Wide Brand Wordmark (Spans 4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="font-serif text-2xl tracking-[0.2em] text-white">
              YŪGEN
            </h3>
            <p className="font-sans text-[11px] text-neutral-600 uppercase tracking-widest leading-relaxed">
              Tokyo Sanctuary Compound • 幽玄 <br />
              Ginza-West, Chūō-ku • Tsukiji Traditional
            </p>
          </div>

          {/* Column 2: Structural Link Array (Spans 3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold">
              The Compound Places
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans">
              <span className="text-neutral-400">Ginza Counter: 8 Volcanic Chairs</span>
              <span className="text-neutral-500">Kamakura Shore Compound (Reservations Only)</span>
              <span className="text-neutral-500">Kyoto Bamboo Scent Chamber (Private Buyout)</span>
            </div>
          </div>

          {/* Column 3: Custom Dev Flipping guidelines (Spans 3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold font-mono">
              DX Template Hook
            </h4>
            <div className="flex flex-col space-y-2 text-[11px] leading-relaxed font-sans text-neutral-500">
              <p>
                Developers: Customize pricing tiers inside <code className="text-neutral-400">src/data.ts</code> or bind registration states easily to Stripe Checkout &amp; Headless CMS platforms.
              </p>
            </div>
          </div>

          {/* Column 4: Operational Sitting blocks (Spans 2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold">
              Sitting Hours
            </h4>
            <div className="flex flex-col space-y-2 text-xs font-sans">
              <span className="text-neutral-400">Seating I // 17:30</span>
              <span className="text-neutral-400">Seating II // 20:15</span>
              <span className="text-neutral-500">Late Sitting // 22:30</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright & secure licensing indicators */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] tracking-wider uppercase font-sans text-neutral-600">
          
          <div className="flex items-center gap-2">
            <Circle className="h-2 w-2 text-neutral-800 fill-neutral-800" />
            <span>&copy; {currentYear} YŪGEN. All rights reserved by Aura &amp; Grid.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Security Protocol // SSL-256</span>
            <span className="hover:text-neutral-400 transition-colors cursor-pointer">Bespoke Architectural Build v4.1</span>
          </div>

        </div>

      </div>
    </footer>
  );
}
