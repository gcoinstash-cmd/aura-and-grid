/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Volume2, Sparkles, Compass, Shield } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import { SCENT_PROFILE } from '../data';

export default function Atmosphere() {
  return (
    <section id="atmosphere-section" className="relative w-full py-24 md:py-32 bg-yugen-bg block clear-both border-t border-yugen-border">
      
      {/* Background Grid Line Offsets */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-neutral-900/30 hidden md:block" />

      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Column A: Olfactory / Botanical sketches list */}
          <div className="lg:col-span-12 xl:col-span-5 lg:order-1 space-y-10">
            <div className="space-y-4">
              <ScrollReveal delay={0} yOffset={25}>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yugen-gold" />
                  <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold">
                    {SCENT_PROFILE.kicker}
                  </span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={100} yOffset={25}>
                <h2 
                  className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-tight tracking-tight"
                  dangerouslySetInnerHTML={{ __html: SCENT_PROFILE.titleHtml }}
                />
              </ScrollReveal>

              <ScrollReveal delay={150} yOffset={25}>
                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  {SCENT_PROFILE.description}
                </p>
              </ScrollReveal>
            </div>

            {/* Scent note visualization component */}
            <div className="space-y-8">
              {SCENT_PROFILE.notes.map((note, index) => (
                <ScrollReveal key={index} delay={200 + index * 100} yOffset={20}>
                  <div className="flex gap-4 items-start border-l border-white/5 pl-6 py-1 hover:border-yugen-gold/30 transition-all">
                    <span className="text-yugen-gold font-sans text-xs font-semibold tracking-wider mt-0.5">
                      0{index + 1}
                    </span>
                    <div className="space-y-1">
                      <h4 className="font-sans text-[10px] uppercase tracking-widest text-yugen-gold/90 font-semibold">
                        {note.level}
                      </h4>
                      <p className="font-serif italic text-lg text-white leading-snug">
                        {note.ingredients}
                      </p>
                      <p className="font-sans text-[11px] text-neutral-500 leading-relaxed block pt-1">
                        {note.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Column B: Acoustic & Material Isolation detail (asymmetric layout) */}
          <div className="lg:col-span-12 xl:col-span-7 lg:order-2">
            <ScrollReveal delay={300} yOffset={35}>
              <div className="space-y-12 bg-neutral-950 p-8 sm:p-14 border border-white/5">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4 text-neutral-500" />
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                      Material Craft // Acoustic Isolation
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-light tracking-tight">
                    Engineering a structural state of <span className="italic">absolute calm</span>
                  </h3>
                </div>

                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  We understand that hearing is the silent director of taste. By shielding the dining chamber from the high-frequency vibration of urban traffic and cell signals, our guests find an pristine acoustic environment layout.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-yugen-gold block font-semibold">
                      Meticulous Material
                    </span>
                    <p className="font-sans text-[11px] text-neutral-400 font-medium">
                      26Hz Basalt Sub-Floor
                    </p>
                    <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                      The counter foundation is suspended on dense volcanic basalt blocks, filtering surrounding vibration noise down to zero.
                    </p>
                  </div>

                  <div className="space-y-2 border-t border-white/5 pt-4">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-yugen-gold block font-semibold">
                      Acoustic Resonance
                    </span>
                    <p className="font-sans text-[11px] text-neutral-400 font-medium">
                      Silent Analog Acoustics
                    </p>
                    <p className="font-sans text-[11px] text-neutral-500 leading-relaxed">
                      We play no background streams. Instead, we architect sound with natural limestone panels that absorb high frequencies, allowing chew and breath to harmonize.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-neutral-900 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yugen-gold animate-ping" />
                    <span className="font-sans text-[9px] uppercase tracking-wider text-neutral-400">Chamber Status: Pristine</span>
                  </div>
                  <span className="font-sans text-[9px] uppercase tracking-wider text-neutral-600 font-mono">dB Limit: &lt; 14HZ</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>

      </div>
    </section>
  );
}
