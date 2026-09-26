import { motion } from 'motion/react';
import { Sparkles, Compass, Thermometer, Droplet } from 'lucide-react';

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-[#EBE8E0] bg-[#FAF9F6]">
      {/* Background Image Container */}
      <div className="relative h-[280px] md:h-[350px] w-full">
        <div className="absolute inset-0 bg-neutral-900/40 z-10 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/30 to-transparent z-15" />
        
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&h=800&q=80"
          alt="Modern premium architectural design of Palmdale Crest Townhomes complex under beautiful desert sun"
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 z-0 bg-stone-950 text-transparent select-none"
          referrerPolicy="no-referrer"
        />

        {/* Floating Accent Ring */}
        <div className="absolute top-6 left-6 z-20 hidden md:flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-sans text-[10px] tracking-wider text-white uppercase font-medium">Community Secure: 24/7 Gate Patrol</span>
        </div>

        {/* Content Overlaid Content */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 md:p-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-2 max-w-xl"
          >
            <span className="font-serif italic text-white/80 text-lg md:text-xl font-light">HOA Resident Portal</span>
            <h2 className="font-serif text-3xl md:text-5xl font-normal leading-tight tracking-wide text-white">
              Welcome back to <span className="font-serif italic font-extralight text-[#FAF9F6] border-b border-white/30">Palmdale Crest</span>.
            </h2>
            <p className="font-sans text-xs md:text-sm text-stone-300 font-light leading-relaxed max-w-md">
              Your modern, state-of-the-art retreat built on solar innovation, private amenities, and quiet desert luxury. Today is a beautiful sunlit day in Palmdale, CA.
            </p>
          </motion.div>

          {/* Quick Stats Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center gap-4 md:gap-6 bg-white/10 backdrop-blur-md p-4 rounded-lg border border-white/10 text-white font-sans text-xs w-full md:w-auto"
          >
            <div className="flex items-center space-x-3 pr-4 md:border-r border-white/15">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Thermometer className="h-4 w-4 text-[#FAF9F6]" />
              </div>
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-light">Ambient Temp</p>
                <p className="font-mono text-sm font-semibold text-white">82°F / Desert Sun</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pr-4 md:border-r border-white/15">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                <Droplet className="h-4 w-4 text-[#FAF9F6]" />
              </div>
              <div>
                <p className="text-white/60 text-[10px] uppercase tracking-wider font-light">Solar Generation</p>
                <p className="font-mono text-sm font-semibold text-white">12.8 kW (Peak)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4A1521]/40 border border-[#FAF9F6]/20">
                <Compass className="h-4 w-4 text-[#AF9E81]" />
              </div>
              <div>
                <p className="text-white/76 text-[10px] font-medium text-[#AF9E81] uppercase tracking-wider">Crest Social</p>
                <p className="font-serif italic text-xs text-white">BBQ & Poolside Social</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
