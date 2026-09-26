import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-charcoal">
      {/* Full-bleed Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=1200&auto=format&fit=crop')` 
        }}
      />
      {/* 65% Dark Overlay */}
      <div className="absolute inset-0 bg-black/65 z-0" />

      {/* Background Text Decor */}
      <div className="absolute -top-10 -left-10 opacity-[0.03] select-none pointer-events-none text-bone z-0">
        <h2 className="font-display font-black text-[30vw] leading-none uppercase">
          Lotus
        </h2>
      </div>

      <div className="relative max-w-5xl w-full mx-auto px-6 md:px-12 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.3em] text-neon-red mb-6 block">
            DOWNTOWN BISTRO • EST. 2024
          </span>
          <h1 className="font-display font-black text-[clamp(2.75rem,8vw,6.5rem)] leading-[0.85] tracking-tighter uppercase mb-6 md:mb-8 text-white animate-fade-in">
            The New <br />
            <span className="text-neon-blue italic text-glow-blue">Tradition</span>
          </h1>
          <p className="max-w-xl text-white/70 text-base md:text-xl mb-10 leading-relaxed font-light">
            Elevated Chinese street food served in a vibrant, neon-lit atmosphere. 
            Located in the heart of downtown, we bring the energy of Hong Kong nights to your table.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-neon-red text-charcoal font-display font-bold px-10 py-5 flex items-center justify-center gap-2 group hover:bg-white transition-colors w-full sm:w-auto text-xs tracking-wider"
            >
              VIEW MENU
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={16} />
            </button>
            <button 
              onClick={() => document.getElementById('reservations')?.scrollIntoView({ behavior: 'smooth' })}
              className="border border-white/30 px-10 py-5 font-display font-bold hover:bg-white/10 transition-colors w-full sm:w-auto text-center text-white text-xs tracking-wider"
            >
              BOOK A TABLE
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
