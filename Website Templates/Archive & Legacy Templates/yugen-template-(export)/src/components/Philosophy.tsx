/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Landmark, Compass, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { PHILOSOPHY_CONTENT } from '../data';

export default function Philosophy() {
  return (
    <section className="section-padding-tier-1 bg-yugen-bg relative border-t border-white/5 overflow-hidden">
      
      {/* Background Graphic Grid Line offsets for architectural styling */}
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-neutral-900/30 hidden md:block" />
      <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-neutral-900/30 hidden md:block" />
 
      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />
 
      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        {/* Asymmetric Core Layout: Grid where column spans create tension */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Column A (Left): Typographic & Philosophy Text (Spans 7 Columns on wide screens) */}
          <div className="md:col-span-7 flex flex-col justify-center space-y-8 order-2 md:order-1">
            <ScrollReveal delay={0} yOffset={30}>
              <div className="flex items-center gap-2 mb-4">
                <Landmark className="h-4 w-4 text-yugen-gold" />
                <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold">
                  {PHILOSOPHY_CONTENT.kicker}
                </span>
              </div>
            </ScrollReveal>
 
            <ScrollReveal delay={100} yOffset={30}>
              <h2 
                className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-white leading-tight tracking-tight"
                dangerouslySetInnerHTML={{ __html: PHILOSOPHY_CONTENT.headlineHtml }}
              />
            </ScrollReveal>
 
            <ScrollReveal delay={200} yOffset={20}>
              <div className="h-[1px] w-20 bg-neutral-800" />
            </ScrollReveal>
 
            <ScrollReveal delay={250} yOffset={25}>
              <div className="space-y-6 text-neutral-400 text-sm leading-relaxed font-sans max-w-xl">
                {PHILOSOPHY_CONTENT.paragraphs.map((paragraph, index) => (
                  <p key={index} className={index > 0 ? "text-neutral-400/80" : ""}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </ScrollReveal>
 
            <ScrollReveal delay={300} yOffset={20}>
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {PHILOSOPHY_CONTENT.metrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <span className="font-serif italic text-xl text-yugen-gold">{metric.title}</span>
                    <p className="text-[11px] text-neutral-500 font-sans uppercase tracking-wider leading-relaxed">
                      {metric.description}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
 
          {/* Column B (Right): Interlocking Image and Architectural vertical text (Spans 5 Columns) */}
          <div className="md:col-span-5 relative order-1 md:order-2 flex justify-center">
            <ScrollReveal delay={350} yOffset={40} className="w-full">
              {/* Main Picture Frame */}
              <div className="relative w-full aspect-[3/4] bg-neutral-900 border border-white/5 overflow-hidden group">
                <img 
                  src="https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=1000"
                  alt="Yūgen Gastronomy Philosophy"
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover grayscale scale-100 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
                />
                {/* Gold Framing border line inside layout */}
                <div className="absolute inset-4 border border-white/10 group-hover:border-yugen-gold/30 transition-colors pointer-events-none duration-700" />
              </div>

              {/* Asymmetric Floating Vertical Wordmark (High-end editorial hallmark) */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 rotate-90 origin-right tracking-[0.4em] text-[10px] font-sans text-neutral-600 uppercase hidden lg:block whitespace-nowrap">
                {PHILOSOPHY_CONTENT.verticalLabel}
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
