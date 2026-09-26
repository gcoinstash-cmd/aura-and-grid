import { motion } from 'motion/react';
import { Sparkles, Disc, MapPin, ArrowRight, Music, Heart } from 'lucide-react';

interface HeroSectionProps {
  onScrollToTickets: () => void;
  onScrollToMenu: () => void;
  currentlyVinylPlaying?: string;
  vinylArtist?: string;
}

export default function HeroSection({
  onScrollToTickets,
  onScrollToMenu,
  currentlyVinylPlaying = "Everybody Loves the Sunshine",
  vinylArtist = "Roy Ayers Ubiquity",
}: HeroSectionProps) {
  return (
    <div id="hero-landing-layout" className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center py-6 min-h-[85vh]">
      
      {/* Editorial Content Column (6 cols wide on large screens) */}
      <div className="lg:col-span-6 space-y-6 text-left relative z-10">
        
        {/* Decorative Golden Hour Capsule Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-stone-900 to-stone-950 border border-white/10 rounded-full" id="golden-hour-capsule">
          <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-white font-extrabold">View Park • Baldwin Hills • Leimert Park</span>
        </div>

        {/* Big Editorial Heading */}
        <div className="space-y-3">
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-semibold text-stone-100 tracking-tight leading-[1.05]">
            Where heritage <br />
            meets the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-terracotta to-gold">golden hour.</span>
          </h1>
          <div className="w-24 h-px bg-gradient-to-r from-terracotta via-gold to-transparent my-1" />
        </div>

        {/* Elegant Brand Manifesto */}
        <p className="font-sans text-sm sm:text-base text-stone-400 font-light leading-relaxed max-w-lg">
          An elite, private dining concept and analog sound commune located in the hills and historical centers of South Los Angeles. Our communal long-boards unite slow, wood-charred Southern culinary lineages with rare vinyl grooves, crafted exclusively for Black American high culinary pioneers and their patrons.
        </p>

        {/* Live deck tracking indicator */}
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#131315]/80 border border-white/5 max-w-sm">
          <div className="relative flex items-center justify-center bg-stone-900 border border-gold/45 w-10 h-10 rounded-full flex-shrink-0">
            <Disc className="w-5 h-5 text-gold animate-spin" />
            <div className="absolute w-2 h-2 rounded-full bg-obsidian border border-neutral-400" />
          </div>
          <div className="min-w-0">
            <span className="font-mono text-[8px] uppercase tracking-wider text-terracotta font-semibold block">Now on the Deck</span>
            <span className="text-xs text-white font-medium truncate block font-serif italic">"{currentlyVinylPlaying}"</span>
            <span className="text-[10px] text-stone-400 font-sans truncate block">{vinylArtist}</span>
          </div>
        </div>

        {/* Luxury CTA Buttons Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          
          <button
            onClick={onScrollToTickets}
            className="px-6 py-3.5 text-center cursor-pointer bg-gold hover:bg-gold-hover text-obsidian font-mono text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gold/5 flex items-center justify-center gap-2 group"
          >
            <span>Secure Board Pass</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onScrollToMenu}
            className="px-6 py-3.5 text-center cursor-pointer bg-[#161618] hover:bg-[#1E1E21] border border-white/10 hover:border-gold/30 text-stone-300 font-mono text-xs uppercase tracking-widest rounded-xl transition-all"
          >
            Inspect Current Provisions
          </button>
        </div>

        {/* Footer Meta indicators */}
        <div className="flex items-center gap-6 pt-6 border-t border-white/5 font-mono text-[10px] text-stone-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-terracotta" />
            <span>South Los Angeles</span>
          </div>
          <div>•</div>
          <div className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-gold" />
            <span>Black Culinary Heritage</span>
          </div>
          <div>•</div>
          <div className="flex items-center gap-1">
            <Music className="w-3.5 h-3.5 text-stone-400" />
            <span>Analog Tube Sync</span>
          </div>
        </div>

      </div>

      {/* Asymmetric Dual Photo Collage Column (6 cols wide on large screens) */}
      <div className="lg:col-span-6 flex justify-center items-center relative mt-8 lg:mt-0">
        
        {/* Glow halo background behind images */}
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        {/* Collage Container */}
        <div className="relative w-full max-w-md h-[400px] sm:h-[480px]">
          
          {/* Main big image (Top Left aspect) representing Culinary artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="absolute top-0 left-0 w-[72%] h-[74%] rounded-2xl overflow-hidden border border-white/10 shadow-2xl group cursor-pointer bg-stone-900"
          >
            {/* Dark protective overlay */}
            <div className="absolute inset-0 bg-obsidian/20 group-hover:bg-transparent transition-all z-10" />
            
            <img
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
              alt="Artisan southern soul food plating with deep golden crispy finishes"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Micro tag overlay */}
            <div className="absolute bottom-3 left-3 bg-stone-950/80 border border-white/10 px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-widest text-gold z-20">
              Alchemy Plating • Provisions Index No. 05
            </div>
          </motion.div>

          {/* Underlaid Offset image representing Analog Turntable ambiance */}
          <motion.div
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="absolute bottom-0 right-0 w-[64%] h-[60%] rounded-2xl overflow-hidden border border-gold/30 shadow-2xl group cursor-pointer bg-stone-950 z-20"
          >
            {/* Gilded frame border highlight */}
            <div className="absolute inset-0 border border-transparent group-hover:border-gold/70 transition-colors z-20 pointer-events-none" />
            {/* Soft dark filter */}
            <div className="absolute inset-0 bg-neutral-950/30 group-hover:bg-transparent transition-colors z-10" />
            
            <img
              src="https://images.unsplash.com/photo-1484755560695-a4C514e88f77?auto=format&fit=crop&w=800&q=80"
              alt="Spinning vintage vinyl LP on a glowing tube pre-amp high-fidelity sound station"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Micro tag overlay */}
            <div className="absolute bottom-3 right-3 bg-stone-950/80 border border-white/10 px-2.5 py-1 rounded text-[8px] font-mono uppercase tracking-widest text-white z-20">
              Acoustic Room Sync • 33 RPM
            </div>
          </motion.div>

          {/* Additional decorative floating tag card overlay */}
          <div className="absolute top-[48%] -right-4 bg-charcoal border border-white/10 p-4 rounded-xl shadow-2xl hidden sm:flex items-center gap-3 z-30 max-w-[200px]" id="heritage-tag">
            <div className="w-2.5 h-2.5 bg-terracotta rounded-full flex-shrink-0 animate-ping" />
            <div className="text-[10px] font-mono leading-tight">
              <span className="text-stone-400 block uppercase tracking-wider">Next Session Venue</span>
              <span className="text-white font-semibold">View Park Courtyard</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
