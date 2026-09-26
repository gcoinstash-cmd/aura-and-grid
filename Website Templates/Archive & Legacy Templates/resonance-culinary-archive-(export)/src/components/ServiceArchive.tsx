import React from 'react';
import { Award, Calendar, Quote, DollarSign, ArrowRight, Newspaper, Landmark } from 'lucide-react';

interface ServiceArchiveProps {
  darkMode: boolean;
}

export default function ServiceArchive({ darkMode }: ServiceArchiveProps) {
  // CSS Helpers
  const bodyTextClass = darkMode 
    ? 'text-sand/80 font-editorial tracking-wide leading-relaxed text-sm md:text-base' 
    : 'text-charcoal/90 font-editorial tracking-wide leading-relaxed text-sm md:text-base';
  const headingClass = 'font-serif tracking-tight font-light';
  const detailFont = 'font-display uppercase tracking-[0.2em] text-[10px] sm:text-[11px] font-semibold';

  // Bill of Fare Data
  const billsOfFare = [
    {
      title: "The Gullah Hearth Remembrance",
      description: "An immersive 5-course maritime tasting centered on live-oak smoking, coastal sea oats, foraged marsh samphire, and Gullah Geechee benne seed lineage.",
      price: "$225",
      unit: "/ guest",
      tag: "Maritime Liturgy",
    },
    {
      title: "The Decolonial Dialogue Commission",
      description: "A highly conceptual 7-course multi-sensory research table designed to deconstruct and rebuild the history of Carolina Gold rice and West African trade winds.",
      price: "$310",
      unit: "/ guest",
      tag: "Academic Curation",
    },
    {
      title: "The Gilded Gentry Banquet",
      description: "A grand representation of 20th-century Harlem Renaissance salons. High-contrast classical pairing, live poetry recitation, and premium heritage-poultry heritage.",
      price: "$195",
      unit: "/ guest",
      tag: "Classic Bourgeois",
    },
    {
      title: "Private Archival Residency",
      description: "Dedicated private estate takeover with customized heirloom plantings, bespoke handmade dinnerware, custom-foraged menu, and private archival documentation.",
      price: "Inquire",
      unit: "",
      tag: "Estate Commission",
    },
  ];

  // Ledger Data
  const ledgerEntries = [
    {
      date: "June 2026",
      source: "The New York Times",
      title: "A Masterpiece of Sensory Archaeology",
      excerpt: "Resonance elevates southern agrarian memory into pristine museum-quality modern dining. A triumphant reclamation of narrative craft.",
      type: "Press Insight",
    },
    {
      date: "August 2026",
      source: "Vogue Gastronomy",
      title: "Uncompromising Gilded Age Luxury",
      excerpt: "Where high-concept spatial luxury meets historical preservation. Volume III is a stunning monument to culinary design philosophy.",
      type: "Press Insight",
    },
    {
      date: "September 12, 2026",
      source: "Beaufort Marsh Estate",
      title: "Upcoming Sea Island Hearth Residency",
      excerpt: "Outdoor marsh-side dynamic oyster smoking & wild tide collection in the original Sea Island marshlands. Intimate seating.",
      type: "Residency",
    },
    {
      date: "October 08, 2026",
      source: "Harlem History Guild",
      title: "The Scholar's Autumn Salon Series",
      excerpt: "Exclusive academic dining dinner focusing on twentieth-century Black culinary scholars and historic coastal recipe transposition.",
      type: "Supper Club",
    },
    {
      date: "November 21, 2026",
      source: "James Beard Foundation",
      title: "Bears of Heirloom Seed Breeding Exhibit",
      excerpt: "Our principal archivist presents research papers on the genetic preservation of Sea Island Red Peas and Gullah benne seed lines.",
      type: "Exhibition",
    },
  ];

  return (
    <div className="space-y-28 md:space-y-40 mt-24 pt-16 border-t border-clay/15">
      
      {/* SECTION 1: LITURGICAL BILL OF FARE */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <span className={`${detailFont} text-clay`}>Reserve Gastronomy Rates</span>
          <h2 className={`${headingClass} text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-neutral-100`}>
            Liturgical Bill of Fare
          </h2>
          <div className="w-12 h-[1px] bg-clay/35 mx-auto"></div>
          <p className="font-serif italic text-neutral-500 text-sm max-w-xl mx-auto mt-2 select-none">
            Our structured rates reflect uncompromising curation, historical ingredient sourcing, and archival craftsmanship.
          </p>
        </div>

        {/* 2-Column Minimalist Layout */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 max-w-5xl mx-auto px-4">
          {billsOfFare.map((fare, idx) => (
            <div 
              key={idx} 
              className={`py-6 border-b ${darkMode ? 'border-clay/15 hover:border-clay/35 hover:bg-clay/[0.02] hover:shadow-[0_0_25px_rgba(172,93,63,0.03)]' : 'border-clay/10 hover:border-clay/25 hover:bg-clay/[0.01] hover:shadow-[0_0_20px_rgba(0,0,0,0.015)]'} flex flex-col justify-between px-4 rounded-xl transition-all duration-300 group`}
            >
              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-serif text-lg sm:text-xl font-normal text-neutral-950 dark:text-sand tracking-tight group-hover:text-clay transition-colors duration-300">
                    {fare.title}
                  </h3>
                  <div className="flex items-baseline shrink-0">
                    <span className="font-display font-light text-xl text-clay">{fare.price}</span>
                    <span className="font-display text-[9px] text-neutral-400 lowercase ml-1 tracking-normal">{fare.unit}</span>
                  </div>
                </div>
                
                {/* Tag label */}
                <span className="inline-block bg-clay/5 border border-gold/10 text-[9px] font-display uppercase tracking-[0.18em] px-2 py-0.5 text-gold rounded">
                  {fare.tag}
                </span>

                <p className={`${bodyTextClass} opacity-90 text-xs sm:text-sm mt-3`}>
                  {fare.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-dashed border-clay/5 flex items-center justify-between">
                <span className="font-display text-[9px] tracking-widest uppercase text-neutral-400">
                  ESTATE COMMODITY RATE
                </span>
                <span className="text-[10px] text-clay font-display tracking-[0.15em] flex items-center gap-1.5 relative pb-0.5 select-none cursor-pointer">
                  <span className="relative">
                    Inquire Room
                    <span className="absolute bottom-[-2px] left-1/2 w-0 h-[1.5px] bg-clay transition-all duration-300 ease-out group-hover:left-0 group-hover:w-full"></span>
                  </span>
                  <ArrowRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: CHRONICLE & PRESS LEDGER */}
      <section className="space-y-12">
        <div className="text-center space-y-4">
          <span className={`${detailFont} text-clay`}>Archival Transcripts</span>
          <h2 className={`${headingClass} text-3xl sm:text-4xl md:text-5xl text-neutral-900 dark:text-neutral-100`}>
            Chronicle & Press Ledger
          </h2>
          <div className="w-12 h-[1px] bg-clay/35 mx-auto"></div>
        </div>

        {/* Low-Contrast, Elegant Panel Design Grid */}
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="grid grid-cols-1 gap-6">
            {ledgerEntries.map((entry, idx) => (
              <div 
                key={idx}
                className={`p-6 sm:p-8 rounded-xl border ${darkMode ? 'border-sand/5 bg-charcoal/30' : 'border-clay/5 bg-neutral-900/[0.02]'} hover:border-gold/30 transition-all duration-300 relative group overflow-hidden`}
              >
                {/* Minimalist Background pattern accent */}
                <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-clay/[0.02] to-transparent pointer-events-none"></div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 mb-4 pb-3 border-b border-clay/10">
                  
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[9px] tracking-widest uppercase bg-clay/10 text-clay px-2 py-0.5 rounded-sm">
                      {entry.type}
                    </span>
                    <span className="font-display text-xs text-neutral-400 dark:text-neutral-500">
                      {entry.date}
                    </span>
                  </div>

                  <span className="font-display uppercase tracking-[0.18em] text-[10px] font-bold text-gold">
                    {entry.source}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-lg sm:text-xl font-normal text-neutral-900 dark:text-sand/90 tracking-tight">
                    {entry.title}
                  </h4>
                  <p className="font-editorial text-sm sm:text-base text-neutral-600 dark:text-sand/70 italic leading-relaxed">
                    "{entry.excerpt}"
                  </p>
                </div>

                {/* Aesthetic Detail Line */}
                <div className="w-6 h-[1.5px] bg-clay/35 mt-4 group-hover:w-16 transition-all duration-500"></div>

              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
