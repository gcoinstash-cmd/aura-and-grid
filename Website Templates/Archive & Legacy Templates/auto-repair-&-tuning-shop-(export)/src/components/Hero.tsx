import { motion } from 'motion/react';
import { Gauge, Milestone, Settings, Timer, CheckCircle, ChevronDown, Monitor } from 'lucide-react';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  baysAvailable: number;
  heroTitle?: string;
  heroSubtext?: string;
  tagline?: string;
}

export default function Hero({ onNavigate, baysAvailable, heroTitle, heroSubtext, tagline }: HeroProps) {
  const brands = [
    'PORSCHE MOTORSPORT', 'M POWER BIEMMER', 'AMG PERFORMANCE', 'AUDI SPORT', 
    'NISSAN GT-R', 'SUPRA RACING', 'BREMBO BRAKES', 'RECARO SEATS',
    'PORSCHE MOTORSPORT', 'M POWER BIEMMER', 'AMG PERFORMANCE', 'AUDI SPORT', 
    'NISSAN GT-R', 'SUPRA RACING', 'BREMBO BRAKES', 'RECARO SEATS'
  ];

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden pt-12 md:pt-20 bg-neutral-950">
      {/* Visual background aesthetics: Radial grid & high-voltage orange flare */}
      <div className="absolute top-0 left-0 right-0 h-[600px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,95,31,0.11),rgba(10,11,14,0))]" />
      
      {/* Decorative vertical blueprint grids */}
      <div className="absolute left-6 top-32 bottom-20 w-[1px] bg-neutral-900 hidden xl:block" />
      <div className="absolute right-6 top-32 bottom-20 w-[1px] bg-neutral-900 hidden xl:block" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-8 z-10">
            {/* Tagline / Live Status telemetry */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 rounded-full border border-accent-orange/20 bg-accent-orange/5 px-3 py-1 text-[11px] font-mono tracking-wider text-accent-orange uppercase"
            >
              <span className="h-2 w-2 rounded-full bg-accent-orange animate-pulse"></span>
              <span>{tagline || 'Hyper-Precision Garage & Tuning Lab'}</span>
            </motion.div>

            {/* Captivating Typography */}
            <div className="space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white leading-none"
              >
                {heroTitle ? (
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-amber-200 to-white">{heroTitle}</span>
                ) : (
                  <>
                    Engineered for <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange via-amber-400 to-white">The Street</span>.<br />
                    Calibrated for <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-orange to-red-600">The Track</span>.
                  </>
                )}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-white font-sans text-sm md:text-base max-w-xl font-normal leading-relaxed border-l-2 border-accent-orange pl-4"
              >
                A fully responsive, modern auto shop web system equipped with online appointment booking, live repair tracking, and interactive pricing grids—engineered to optimize conversions and streamline shop communications.
              </motion.p>
              
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-zinc-400 font-sans text-sm max-w-xl leading-relaxed font-light"
              >
                {heroSubtext || 'We provide custom race-prep diagnostics, Stage 1/2 ECU remapping, fluid engineering, and high-gloss 9H ceramic detailing. Built for owners who demand peak automotive performance and precision care.'}
              </motion.p>
            </div>

            {/* Sticky/Interactive Counters and Action CTA Button Row */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center"
            >
              <button 
                onClick={() => onNavigate('booking')}
                className="group relative flex items-center justify-center space-x-3 rounded-lg bg-gradient-to-r from-accent-orange to-amber-500 px-8 py-4 text-center font-display text-sm font-bold uppercase tracking-wider text-black hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-accent-orange/15 cursor-pointer"
                id="hero-book-cta"
              >
                <span>PREVIEW BOOKING SCHEDULER</span>
                <Settings className="h-4 w-4 animate-spin-slow transition-transform group-hover:rotate-45" />
              </button>

              <button 
                onClick={() => onNavigate('tracker')}
                className="flex items-center justify-center space-x-2 rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-900/90 transition-all font-mono text-xs uppercase tracking-wider text-zinc-300 px-6 py-4 cursor-pointer"
              >
                <span>TEST LIVE WORK TRACKER</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              </button>
            </motion.div>

            {/* Quick Live Indicators Counter Widget */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-neutral-900 font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center text-accent-orange">
                  <span className="text-2xl font-bold font-display">{baysAvailable}</span>
                  <span className="text-zinc-600 text-sm ml-0.5">/5</span>
                </div>
                <p className="text-[10px] uppercase text-zinc-500 tracking-wider">Service Bays Open</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-white">
                  <span className="text-2xl font-bold font-display">2.8k</span>
                  <span className="text-accent-orange text-sm ml-0.5">+</span>
                </div>
                <p className="text-[10px] uppercase text-zinc-500 tracking-wider">Retunings Logged</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center text-white">
                  <span className="text-2xl font-bold font-display">99.8</span>
                  <span className="text-zinc-600 text-sm ml-0.5">%</span>
                </div>
                <p className="text-[10px] uppercase text-zinc-500 tracking-wider">Quality Score</p>
              </div>
            </motion.div>
          </div>

          {/* Right Hero Column: Premium Interactive Automotive Overlay Asset */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative w-full max-w-md h-[400px] rounded-2xl overflow-hidden group"
            >
              {/* Outer Glowing Accents */}
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-accent-orange to-amber-500 opacity-20 group-hover:opacity-35 blur transition duration-300"></div>
              
              {/* Image with referrerPolicy="no-referrer" */}
              <div className="relative h-full w-full rounded-2xl bg-neutral-900 border border-neutral-800 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200" 
                  alt="High performance calibration in progress" 
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover grayscale brightness-75 contrasts-125 group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0E] via-[#0A0B0E]/40 to-transparent"></div>
                
                {/* Tech Dashboard floating tag inside image for "Wow" feel */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-white/5 bg-black/75 backdrop-blur-md space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 uppercase">
                    <span>DIAGNOSTICS &</span>
                    <span className="text-accent-orange animate-pulse">Live Dyno Feed</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-display font-bold text-sm tracking-wide text-white">STAGE 2 GT3 CALIBRATION</span>
                    <span className="font-mono text-xs text-accent-orange font-bold">+52 BHP</span>
                  </div>
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-accent-orange h-full rounded-full w-[84%] animate-pulse"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scrolling Brand Ticker Ribbon requested */}
      <div className="relative w-full border-t border-b border-neutral-900 bg-neutral-950 py-3.5 overflow-hidden mt-16 md:mt-24">
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0A0B0E] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#0A0B0E] to-transparent z-10 pointer-events-none" />
        
        <div className="animate-marquee whitespace-nowrap flex select-none text-xs font-mono font-bold tracking-widest text-zinc-500">
          {brands.map((brand, i) => (
            <span key={i} className="mx-8 uppercase hover:text-accent-orange transition-colors">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
