import React from "react";
import { motion } from "motion/react";
import { BRAND_STORY } from "../data/mockData";
import { Card } from "../components/Card";
import { Hammer, ShieldCheck, Flame } from "lucide-react";

export const BrandStory: React.FC = () => {
  const brandPillars = [
    {
      icon: Flame,
      title: "Vandals of Flavor",
      desc: "Rebel recipes, artisan techniques, wood embers, and fresh high-contrast flavors."
    },
    {
      icon: Hammer,
      title: "Hardboiled Craft",
      desc: "Twenty-four-hour potato brining, charcoal-infused tacos. Zero processed shortcuts."
    },
    {
      icon: ShieldCheck,
      title: "Concrete Honesty",
      desc: "Humbler, street-driven sourcing. Bold spices, raw beats, absolute transparent pricing."
    }
  ];

  return (
    <section id="story" className="py-24 bg-[#0B0B0C] border-b border-brand-border px-6 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_top_right,_var(--color-brand-card)_0%,_transparent_70%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Side: Brand Pillars */}
        <div className="lg:col-span-5 space-y-6">
          <span className="font-mono text-xs text-brand-orange tracking-widest uppercase font-bold flex items-center flex-wrap gap-1.5">
            <span className="w-1.5 h-1.5 bg-brand-orange inline-block" /> THE CONCRETE MANIFESTO <span className="text-brand-muted/70 font-sans normal-case font-normal text-[11px] tracking-normal">(Our Story)</span>
          </span>
          
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight uppercase">
            {BRAND_STORY.title}
          </h2>
          
          <p className="font-mono text-xs text-brand-accent tracking-widest font-black uppercase">
            {BRAND_STORY.sub}
          </p>

          <div className="space-y-4 pt-4">
            {brandPillars.map((pillar, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-brand-card/30 border border-brand-border/40">
                <div className="flex-shrink-0 w-10 h-10 rounded-sm bg-brand-accent/5 border border-brand-accent/20 flex items-center justify-center text-brand-accent">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-sm font-display font-black text-white uppercase tracking-tight">{pillar.title}</h4>
                  <p className="text-xs text-brand-muted leading-relaxed font-sans">{pillar.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Visuals & Paragraphs */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-6 flex flex-col justify-center">
            {BRAND_STORY.paragraphs.map((pTxt, idx) => (
              <p key={idx} className="text-sm text-brand-muted leading-relaxed font-sans">
                {pTxt}
              </p>
            ))}
          </div>

          <div className="relative aspect-[4/5] bg-brand-card border border-brand-border/80 p-3 flex flex-col justify-between group">
            <div className="absolute inset-0 bg-brand-orange/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <div className="relative w-full h-[82%] overflow-hidden border border-brand-border">
              <img
                src="https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80"
                alt="Behind the food assembly line"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 border border-brand-border font-mono text-[9px] text-brand-orange">
                ACTIVE COOKING
              </div>
            </div>
            
            <div className="font-mono text-[10px] text-brand-muted flex justify-between items-center pt-2">
              <span>EST. MMXXV // DIST.4</span>
              <span className="text-brand-accent font-bold">● ONLINE SECTOR</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
