import React from "react";
import { CLIENT_BRANDS, SITE_COPY } from "../data";

/**
 * ClientWall Component
 * Arranges client brand representations into a structured modular grid with clean hover states.
 */
export default function ClientWall() {
  return (
    <section
      id="brands"
      className="py-24 bg-black relative border-b border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-[#8b947c] block mb-2">
            {SITE_COPY.clientWall.label}
          </span>
          <h2
            id="brands-headline"
            className="font-serif text-3xl sm:text-4xl md:text-5xl text-neutral-100 font-medium tracking-tight max-w-2xl"
          >
            {SITE_COPY.clientWall.headline}
          </h2>
        </div>

        {/* Brand Grid Container */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-l border-t border-neutral-900">
          {CLIENT_BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="relative aspect-square md:aspect-[4/3] flex flex-col justify-center items-center border-r border-b border-neutral-900 bg-[#040404] hover:bg-[#080808] transition-all duration-300 group p-6 cursor-default"
            >
              {/* Brand representation without arbitrary symbols */}
              <div className="flex flex-col items-center space-y-3.5 text-center">
                <span className="font-mono text-xs tracking-[0.3em] font-medium text-neutral-600 group-hover:text-brand-gold transition-colors duration-300">
                  {brand.symbol}
                </span>
                <span className="font-display font-medium text-xs tracking-[0.2em] text-neutral-400 group-hover:text-white transition-all duration-300">
                  {brand.name}
                </span>
              </div>

              {/* Elegant Category Info overlay (absolute bottom) */}
              <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                <span className="font-mono text-[9px] uppercase tracking-widest text-brand-gold">
                  {brand.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Clean, high-value representation statement footer note */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] font-mono text-neutral-500 uppercase tracking-[0.25em] pt-4">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-1 h-1 rounded-full bg-[#8b947c]"></span>
            <span>{SITE_COPY.clientWall.footerLeft}</span>
          </div>
          <span className="mt-2 md:mt-0">{SITE_COPY.clientWall.footerRight}</span>
        </div>

      </div>
    </section>
  );
}
