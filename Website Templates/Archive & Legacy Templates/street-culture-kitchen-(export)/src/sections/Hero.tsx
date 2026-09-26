import React from "react";
import { motion } from "motion/react";
import { MONO_STATISTICS } from "../data/mockData";
import { Button } from "../components/Button";
import { ArrowDown, Flame, Disc, Sparkles } from "lucide-react";

export const Hero: React.FC = () => {
  const handleScrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen pt-28 pb-16 flex flex-col justify-center overflow-hidden bg-[#0B0B0C] px-4 sm:px-6"
    >
      {/* Background ambient aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--color-brand-card)_0%,_transparent_60%)] pointer-events-none" />
      <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-[15%] w-[60%] h-[60%] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid Overlay decoration */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161618_1px,transparent_1px),linear-gradient(to_bottom,#161618_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center relative z-10">
        
        {/* Left Side: Brand headlines */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 space-y-6 sm:space-y-8 text-left"
        >
          
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-card border border-brand-border px-3.5 py-1.5 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
            </span>
            <span className="font-mono text-[10px] sm:text-xs font-bold tracking-widest text-brand-text uppercase flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-brand-orange animate-pulse" /> STREET CULINARY ENGINE ACTIVE
            </span>
          </div>

          {/* Editorial Display Heading */}
          <div className="space-y-4">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-[0.9] tracking-tight uppercase select-none">
              STREET TACOS.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-[#DCEE4B] select-none">
                ELEVATED.
              </span>
            </h1>
            
            <p className="max-w-xl text-brand-muted font-sans text-xs sm:text-base leading-relaxed">
              We smash aged brisket, hand-press charcoal tortillas, and curate heavy sub-bass beats on the concrete. No rules, no compromise — visual street culture meets elite culinary art.
            </p>
          </div>

          {/* Highlight Brand CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              variant="primary" 
              size="lg" 
              onClick={() => handleScrollTo("menu")}
              className="text-xs sm:text-sm h-12 sm:h-14 tracking-widest px-8 w-full sm:w-auto"
            >
              VIEW TODAY'S MENU
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => handleScrollTo("catering")}
              className="text-xs sm:text-sm h-12 sm:h-14 tracking-widest px-8 w-full sm:w-auto border-brand-orange/60 text-brand-orange hover:text-brand-orange hover:border-brand-orange hover:shadow-[0_0_15px_rgba(255,69,0,0.15)]"
            >
              ORDER AHEAD
            </Button>
          </div>

          {/* Stats Segment */}
          <div className="pt-8 border-t border-brand-border grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl">
            {MONO_STATISTICS.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-1"
              >
                <span className="block font-mono text-[9px] sm:text-[10px] text-brand-muted tracking-widest uppercase">
                  {stat.label}
                </span>
                <span className="block font-display text-xl sm:text-2xl font-extrabold text-white">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>

        </motion.div>

        {/* Right Side: Showcase Media Graphic Bracket */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 relative w-full flex items-center justify-center"
        >
          
          <div className="relative w-full aspect-square max-w-[390px] sm:max-w-[420px] bg-brand-card border-2 border-brand-border p-3.5 sm:p-4 select-none group">
            {/* Tag markups */}
            <div className="absolute top-2 left-2 text-[8px] font-mono text-brand-muted font-bold">MODEL // TACO_ELEVATE</div>
            <div className="absolute bottom-2 right-2 text-[8px] font-mono text-brand-accent font-bold">GRID // #FF4500</div>

            {/* Radiant core preview item */}
            <div className="w-full h-full bg-[#1e1e21] relative overflow-hidden border border-brand-border flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80"
                alt="Wagyu Brisket Charcoal Taco"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-bg to-transparent opacity-60 pointer-events-none" />
              
              {/* Highlight Label overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-black/90 backdrop-blur-md p-3 sm:p-4 border border-brand-border flex items-center justify-between">
                <div className="space-y-0.5 text-left">
                  <span className="block text-[8px] sm:text-[9px] font-mono text-brand-accent font-black tracking-widest uppercase">STREET POPULAR SKU</span>
                  <span className="block text-xs sm:text-sm font-display font-black text-white uppercase">Tokyo Charcoal Wagyu</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-brand-accent/5 border border-brand-accent/20 flex flex-shrink-0 items-center justify-center text-brand-accent text-xs font-mono font-bold">
                  $18.5
                </div>
              </div>

              {/* Rotatable vinyl badge graphic */}
              <div className="absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 bg-black/80 rounded-full border border-brand-border flex items-center justify-center animate-spin [animation-duration:9s]">
                <Disc className="w-5 h-5 sm:w-6 sm:h-6 text-brand-orange" />
              </div>
            </div>
          </div>

        </motion.div>
        
      </div>

      {/* Continuously Scrolling Banner Marquee */}
      <div className="w-screen bg-brand-accent py-4 mt-16 sm:mt-24 relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-hidden select-none border-y-2 border-black rotate-[-1deg] scale-[1.02]">
        <div className="whitespace-nowrap flex animate-[marquee_20s_linear_infinite] gap-10">
          {[...Array(4)].map((_, containerIdx) => (
            <div key={containerIdx} className="flex gap-10 font-mono text-xs sm:text-sm font-black text-black uppercase tracking-widest py-1">
              <span>★ SMASHED BRISKET PERFECTED</span>
              <span>★ ZERO COMPROMISES ONLY HEAVY BASS</span>
              <span>★ 18-HOUR SLOW SMOKE WAGYU TACOS</span>
              <span>★ DISSIDENT STREET ART CULINARY</span>
              <span>★ OPEN THU-SUN LATE RUNS</span>
              <span>★ CRUSHED CHIPS & TRUFFLE LOOT</span>
            </div>
          ))}
        </div>
      </div>

      {/* Down indicators */}
      <div className="flex justify-center pt-8 sm:pt-14">
        <button
          id="down_scroll_indicator"
          onClick={() => handleScrollTo("story")}
          className="p-2.5 sm:p-3 bg-brand-card/35 border border-brand-border text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-colors duration-200 cursor-pointer animate-bounce rounded-full"
          aria-label="Scroll to manifesto"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      </div>

    </section>
  );
};
