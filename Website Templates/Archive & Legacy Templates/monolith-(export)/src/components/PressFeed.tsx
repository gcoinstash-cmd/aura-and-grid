import React from "react";
import { ArrowUpRight } from "lucide-react";
import { SITE_COPY } from "../data";

/**
 * PressFeed Component
 * Displays an infinite horizontal text marquee ticker of recent media placements.
 * Optimized with high-contrast indicator dots and CSS-managed smooth infinite translations.
 */
export default function PressFeed() {
  const items = SITE_COPY.pressFeed.placements;

  return (
    <section
      id="press-feed"
      className="py-16 bg-[#030303] border-b border-neutral-900 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
          <div className="lg:col-span-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#8b947c] mb-2 block">
              {SITE_COPY.pressFeed.label}
            </span>
            <h2
              id="press-feed-title"
              className="font-serif text-3xl md:text-4xl text-neutral-200 font-medium tracking-tight"
            >
              {SITE_COPY.pressFeed.headline}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:pl-12">
            <p className="text-neutral-500 font-light text-sm md:text-base leading-relaxed max-w-xl">
              {SITE_COPY.pressFeed.description}
            </p>
          </div>
        </div>
      </div>

      {/* Marquee Wrapper */}
      <div className="border-y border-neutral-900/60 py-6 bg-black/40 relative w-full overflow-hidden marquee-container">
        <div className="flex whitespace-nowrap w-full overflow-hidden">
          <div className="animate-marquee flex items-center space-x-12 pr-12 shrink-0">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center space-x-4 bg-[#090909] border border-neutral-800/40 py-2.5 px-6 group cursor-default shrink-0"
              >
                {/* Clean Steady Indicator */}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold"></span>
                
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#a3a3a3] group-hover:text-white transition-colors duration-200">
                  {item}
                </span>

                <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-brand-gold transition-colors duration-200" />
              </div>
            ))}
          </div>
          
          <div className="animate-marquee flex items-center space-x-12 pr-12 shrink-0" aria-hidden="true">
            {items.map((item, idx) => (
              <div
                key={`dup-${idx}`}
                className="flex items-center space-x-4 bg-[#090909] border border-neutral-800/40 py-2.5 px-6 group cursor-default shrink-0"
              >
                {/* Clean Steady Indicator */}
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand-gold"></span>
                
                <span className="font-mono text-[11px] uppercase tracking-widest text-[#a3a3a3] group-hover:text-white transition-colors duration-200">
                  {item}
                </span>

                <ArrowUpRight className="w-3 h-3 text-neutral-600 group-hover:text-brand-gold transition-colors duration-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
