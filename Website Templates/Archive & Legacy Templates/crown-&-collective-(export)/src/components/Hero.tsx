import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  onBookOpen: () => void;
}

export default function Hero({ onBookOpen }: HeroProps) {
  return (
    <section className="relative min-h-screen pt-28 pb-16 md:py-0 md:flex md:items-center bg-[#0a0a0a] overflow-hidden border-b border-white/[0.03]">
      {/* Editorial Watermark Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <div className="absolute left-1/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-2/4 top-0 bottom-0 w-px bg-white" />
        <div className="absolute left-3/4 top-0 bottom-0 w-px bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full z-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column: Asymmetrical Editorial Block */}
          <div className="lg:col-span-7 flex flex-col justify-center pr-0 lg:pr-8">
            
            {/* Soft Metallic Intro Tag */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex items-center space-x-2.5 mb-6 text-[#E6C587] font-mono uppercase tracking-[0.3em] text-[10px]"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Curation • Architecture • Hair Rituals</span>
            </motion.div>

            {/* Oversized Creative Title */}
            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[1.05] tracking-tight text-white font-light">
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="block"
              >
                Effortless Hair
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                className="block italic font-normal text-[#E6C587] mt-1"
              >
                for the Modern
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                className="block font-medium tracking-tight mt-1"
              >
                Collective.
              </motion.span>
            </h1>

            {/* Tracked-out Sans-serif Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-8 text-base md:text-lg text-[#F7F4EB]/70 leading-relaxed font-light tracking-wide max-w-lg"
            >
              An avant-garde salon residing in Los Angeles, sculpting bespoke silhouettes that honor raw organic textures, coily and curly crowns, and customized aesthetic dimensions for elite entrepreneurs.
            </motion.p>

            {/* Action Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-6"
            >
              <button
                onClick={onBookOpen}
                className="group flex items-center justify-between sm:justify-center space-x-4 px-8 py-4 bg-[#F7F4EB] text-[#0A0A0A] text-xs font-sans uppercase tracking-[0.25em] font-semibold transition-all duration-400 hover:bg-[#E6C587] hover:scale-[1.01] active:scale-95 shadow-lg"
              >
                <span>Book an Experience</span>
                <ArrowRight className="w-4 h-4 text-[#0A0A0A] group-hover:translate-x-1.5 transition-transform duration-300" />
              </button>

              <a
                href="#curation"
                className="flex items-center justify-center space-x-2 py-4 px-6 text-[11px] uppercase tracking-[0.25em] text-[#F7F4EB]/60 hover:text-white transition-all group duration-300"
              >
                <span>Explore Services</span>
                <span className="h-[1px] w-4 bg-[#F7F4EB]/30 group-hover:w-8 group-hover:bg-[#E6C587] transition-all duration-500" />
              </a>
            </motion.div>

            {/* Micro Metadata Info Box */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#F7F4EB]/50"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="w-3 h-3 text-[#E6C587]" />
                <span>MELROSE PLACE • LOS ANGELES</span>
              </div>
              <span>34.0818° N, 118.3768° W</span>
            </motion.div>
          </div>

          {/* Right Column: Editorial Visual (Asymmetric Frame) */}
          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="relative aspect-[3/4] w-full max-w-md mx-auto group border border-white/10 p-2 bg-[#121212]"
            >
              {/* Decorative Tech Corners */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[#E6C587] -translate-x-1 -translate-y-1" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[#E6C587] translate-x-1 translate-y-1" />

              <div className="relative w-full h-full overflow-hidden bg-[#161616]">
                {/* Visual Image */}
                <img
                  src="https://images.unsplash.com/photo-1589156280159-27698a70f29e?q=80&w=800&auto=format&fit=crop"
                  alt="Crown & Collective Editorial Hair Architecture"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-95 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-out"
                />

                {/* Floating Stylist Credit Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-[#0a0a0ad9] backdrop-blur-md px-4 py-3 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="block text-[8px] font-mono uppercase tracking-[0.25em] text-[#E6C587]">
                      EDITORIAL RESIDENCY
                    </span>
                    <span className="block text-xs font-serif text-white uppercase tracking-wider mt-0.5">
                      The Silhouette Cut
                    </span>
                  </div>
                  <span className="text-[10px] font-mono tracking-wider text-[#F7F4EB]/40">
                    RES_2026
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Asymmetrical Floating Quote Bubble */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.2, delay: 0.8 }}
              className="absolute -bottom-8 -left-4 md:-left-8 max-w-xs bg-[#121212]/95 backdrop-blur-md p-5 border border-white/5 shadow-2xl hidden sm:block"
            >
              <div className="text-[#E6C587] text-lg font-serif italic mb-1.5 font-light">“Every coil has its own architecture; we simply reveal its crown.”</div>
              <div className="text-[9px] font-mono tracking-widest uppercase text-[#F7F4EB]/50">— NIA CROWNE, CREATIVE FOUNDER</div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
