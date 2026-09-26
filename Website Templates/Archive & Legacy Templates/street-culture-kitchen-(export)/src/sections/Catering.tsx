import React from "react";
import { CATERING_PACKAGES } from "../data/mockData";
import { Card } from "../components/Card";
import { InquiryForm } from "../components/InquiryForm";
import { CalendarRange, Sparkles, Check, Users } from "lucide-react";

export const Catering: React.FC = () => {
  return (
    <section id="catering" className="py-24 bg-[#0B0B0C] border-b border-brand-border px-6 relative">
      <div className="absolute top-[30%] right-[10%] w-[35%] h-[40%] bg-brand-orange/5 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-orange uppercase tracking-widest font-black flex items-center gap-2">
              <CalendarRange className="w-4 h-4 text-brand-orange" /> MOBILE UNIT DISPATCH // POPUPS
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              STREET-LEVEL CATERING
            </h2>
          </div>
          
          <p className="max-w-md text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            We bring our custom-modified fire grills, sub-bass audio channels, and premium packaging directly to your warehouse events, festivals, or private takeovers.
          </p>
        </div>

        {/* Bento Grid Split Layout (Packages Grid on Left, Inquiry Form on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Packages listing */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="font-display text-xl font-bold text-white tracking-widest uppercase flex items-center gap-2 text-left">
              <Sparkles className="w-5 h-5 text-brand-accent animate-pulse" /> CONFIGURABLE EVENTS
            </h3>

            <div className="grid grid-cols-1 gap-6">
              {CATERING_PACKAGES.map((pkg, idx) => (
                <Card
                  key={pkg.id}
                  glowOnHover={true}
                  className="p-6 transition-all duration-300"
                  delayIndex={idx}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 text-left">
                      <div className="flex flex-wrap gap-1.5">
                        {pkg.tags.map((tag, tagIdx) => (
                          <span key={tagIdx} className="bg-brand-bg text-[9px] font-mono text-brand-accent px-2 py-0.5 border border-brand-border uppercase">
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <h4 className="font-display text-xl font-black text-white uppercase">
                        {pkg.name}
                      </h4>
                      
                      <p className="text-xs text-brand-muted font-sans leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>

                    {/* Price and headcount stats pillar */}
                    <div className="flex-shrink-0 bg-brand-bg/60 border border-brand-border/80 p-4 font-mono text-right flex sm:flex-col justify-between items-end gap-1 min-w-[140px]">
                      <div>
                        <span className="block text-[8px] text-brand-muted">ESTIMATE COST</span>
                        <span className="block text-xl font-black text-white">${pkg.pricePerPerson}/PP</span>
                      </div>
                      
                      <div className="pt-2 border-t border-brand-border/60 w-full text-right flex items-center justify-end gap-1.5 text-brand-accent">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[10px] font-bold">MIN {pkg.minGuests} PAX</span>
                      </div>
                    </div>
                  </div>

                  {/* Bullet features */}
                  <div className="border-t border-brand-border/40 mt-5 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {pkg.features.map((feature, featureIdx) => (
                      <div key={featureIdx} className="flex gap-2 text-left items-start">
                        <Check className="w-4 h-4 text-brand-accent flex-shrink-0 mt-0.5" />
                        <span className="text-xs text-brand-text font-mono tracking-tight leading-normal">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                </Card>
              ))}
            </div>
          </div>

          {/* Right Column: Embedded raw Inquiry Form */}
          <div className="lg:col-span-5 relative lg:sticky lg:top-[100px]">
            <InquiryForm />
          </div>

        </div>

      </div>
    </section>
  );
};
