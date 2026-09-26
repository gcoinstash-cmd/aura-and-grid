import React from 'react';
import { CulinaryTemplate } from '../types';
import { Sparkles, Quote, MapPin, Feather } from 'lucide-react';

interface TemplateViewerProps {
  template: CulinaryTemplate;
  darkMode: boolean;
  animateTransitions: boolean;
}

export default function TemplateViewer({
  template,
  darkMode,
  animateTransitions,
}: TemplateViewerProps) {
  // We use our custom tailwind classes configured in index.css: charcoal, clay, gold, sand
  const bodyTextClass = darkMode ? 'text-sand/85 font-editorial tracking-wide' : 'text-charcoal/95 font-editorial tracking-wide';
  const headingClass = 'font-serif tracking-tight text-balance font-light leading-none';
  const detailFont = 'font-display uppercase tracking-[0.22em] text-[12px] font-semibold';

  return (
    <article className="space-y-24 md:space-y-36">
      
      {/* Chapter Cinematic Opening */}
      <header className="text-center max-w-5xl mx-auto space-y-8 pt-4 animate-fade-in">
        <div className="flex justify-center items-center gap-3">
          <span className="w-2 h-[1px] bg-clay/50"></span>
          <span className={`${detailFont} text-clay`}>
            {template.id === 'gullah-hearth' ? 'Chapter I' : template.id === 'decolonial-table' ? 'Chapter II' : 'Chapter III'}
          </span>
          <span className="w-2 h-[1px] bg-clay/50"></span>
        </div>
        
        <h1 className={`${headingClass} text-3xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl break-words uppercase ${darkMode ? 'text-white font-extralight' : 'text-[#0d0d0c] font-light'} transition-all duration-300`}>
          {template.title}
        </h1>

        <p className={`${detailFont} ${darkMode ? 'text-gold' : 'text-clay'} max-w-2xl mx-auto`}>
          {template.tagline}
        </p>

        <div className="w-16 h-[1px] bg-clay/35 mx-auto my-10"></div>
      </header>

      {/* Hero Visual Showcase */}
      <section className="relative group overflow-hidden max-w-5xl mx-auto border border-clay/10 p-2.5 bg-neutral-900/5 dark:bg-white/5 rounded-2xl w-full">
        <div className="w-full aspect-[16/9] overflow-hidden rounded-xl relative bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center">
          <img
            src={template.images.hero}
            alt={template.title}
            className={`w-full h-full object-cover grayscale tracking-wide group-hover:grayscale-0 duration-1000 transition-all ease-out ${
              animateTransitions ? 'animate-cinematic-zoom' : ''
            }`}
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute bottom-6 left-6 font-display text-[9px] uppercase tracking-[0.2em] bg-charcoal/95 border border-gold/15 text-gold px-3.5 py-1.5 bg-opacity-95 rounded-md flex items-center gap-1.5 shadow-lg select-none max-w-[calc(100%-3rem)]">
          <span className="animate-pulse shrink-0">✨</span>
          <span className="truncate">Insert Elegant Culinary Imagery Here</span>
          <span className="text-neutral-500 shrink-0">•</span>
          <span className="truncate">{template.title}</span>
        </div>
      </section>

      {/* Editorial Narrative Section */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7 space-y-6">
          <span className={`${detailFont} text-clay block`}>The Sensory Narrative</span>
          <h2 className={`${headingClass} text-2xl md:text-3xl leading-relaxed font-light ${darkMode ? 'text-sand' : 'text-charcoal'}`}>
            {template.narrative}
          </h2>
          <div className="h-[2px] w-12 bg-gold/50"></div>
        </div>
        
        <div className="md:col-span-5 relative mt-4 md:mt-0">
          <div className={`p-8 md:p-10 border border-gold/20 ${darkMode ? 'bg-charcoal/40' : 'bg-sand/35'} relative rounded-xl space-y-6`}>
            <Quote className="absolute -top-4 -right-4 w-12 h-12 text-gold/15" />
            
            <span className={`${detailFont} text-gold/80 block`}>The Curator's Philosophy</span>
            
            <p className="italic font-serif text-base sm:text-lg leading-relaxed text-neutral-600 dark:text-sand/90">
              "{template.curatorQuote}"
            </p>
            
            <div className="border-t border-gold/15 pt-4 flex justify-between items-center">
              <span className="font-serif text-xs md:text-sm italic font-medium">{template.curatorName}</span>
              <span className="font-display text-[9px] uppercase tracking-widest text-[#AC5D3F]">Archivist</span>
            </div>
          </div>
        </div>
      </section>

      {/* Double Column Gallery */}
      <section className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        <div className="space-y-4 flex flex-col">
          <div className="w-full aspect-[4/3] overflow-hidden rounded-xl border border-clay/5 p-1.5 bg-neutral-900/5 dark:bg-white/10 relative flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <img
              src={template.images.plating}
              alt="Bespoke Plating Curation"
              className={`w-full h-full object-cover rounded-lg grayscale hover:grayscale-0 duration-700 transition-all ${
                animateTransitions ? 'animate-cinematic-zoom' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        <div className="space-y-4 flex flex-col">
          <div className="w-full aspect-[4/3] overflow-hidden rounded-xl border border-clay/5 p-1.5 bg-neutral-900/5 dark:bg-white/10 relative flex items-center justify-center bg-neutral-100 dark:bg-neutral-900">
            <img
              src={template.images.atmosphere}
              alt="Culinary Space"
              className={`w-full h-full object-cover rounded-lg grayscale hover:grayscale-0 duration-700 transition-all ${
                animateTransitions ? 'animate-cinematic-zoom' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </section>

      {/* Pure Editorial Tasting Menu */}
      <section className="max-w-4xl mx-auto py-12 md:py-20 border-t border-b border-clay/10 space-y-20">
        <div className="text-center space-y-4">
          <span className={`block ${detailFont} text-clay`}>The Culinary Liturgy</span>
          <h2 className={`${headingClass} text-3xl md:text-4xl text-neutral-900 dark:text-neutral-100`}>
            A Trilogy of Sensory Remembrance
          </h2>
          <div className="w-12 h-[1px] bg-clay/35 mx-auto"></div>
        </div>

        <div className="space-y-16">
          {template.menu.map((dish, idx) => (
            <div
              key={dish.id}
              className="group grid md:grid-cols-12 gap-8 md:gap-12 items-baseline hover:bg-clay/[0.02] p-6 rounded-xl transition-all duration-300"
            >
              {/* Course Sequence Marker */}
              <div className="md:col-span-2 flex items-center md:flex-col items-baseline md:items-start gap-2 border-b md:border-b-0 md:border-r border-clay/10 pb-2 md:pb-0">
                <span className="font-display font-light text-2xl text-clay">0{idx + 1}</span>
                <span className={`${detailFont} text-neutral-400 text-[10px]`}>
                  {dish.course}
                </span>
              </div>

              {/* Main Sensory Description */}
              <div className="md:col-span-6 space-y-3">
                <h3 className="font-serif text-xl md:text-2xl font-normal text-neutral-900 dark:text-sand tracking-tight">
                  {dish.title}
                </h3>
                <p className={`${bodyTextClass} leading-relaxed text-sm sm:text-base`}>
                  {dish.sensoryDescription}
                </p>
              </div>

              {/* The Provenance (renamed from heritage notes / origin lineage proof) */}
              <div className="md:col-span-4 bg-clay/[0.03] p-6 rounded-lg border border-gold/10 space-y-2">
                <span className={`${detailFont} text-gold mr-2 inline-flex items-center gap-1.5`}>
                  <Feather className="w-3.5 h-3.5 inline text-clay" />
                  The Provenance
                </span>
                <p className="font-serif text-[13px] leading-relaxed italic text-neutral-500 dark:text-sand/70">
                  {dish.heritageNotes}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Delicate Chapter Close */}
      <footer className="text-center space-y-4 max-w-xl mx-auto py-8">
        <p className="font-serif italic text-sm text-neutral-500">
          This concludes our look into {template.title}. A testament to continuous survival, design intelligence, and uncompromising flavor profiles.
        </p>
        <span className="font-display tracking-[0.3em] uppercase text-[10px] text-clay/60 block">
          Resonance Collection
        </span>
      </footer>

    </article>
  );
}
