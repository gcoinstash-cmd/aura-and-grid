import { motion } from "motion/react";
import { Reveal } from "./Reveal";

export const Hero = () => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-base px-6">
      <div className="relative z-10 max-w-5xl text-center flex flex-col items-center">
        <Reveal delay={0.1}>
          <div className="text-[10px] tracking-[0.2em] opacity-60 mb-8 uppercase font-mono">
            Creative Direction & Narrative Design
          </div>
        </Reveal>
        
        <Reveal delay={0.2} className="mb-4">
          <h1 className="font-serif text-8xl md:text-9xl font-light tracking-tight leading-none italic text-accent">
            Ethereal Forms.
          </h1>
        </Reveal>

        <Reveal delay={0.4} className="mx-auto">
          <p className="max-w-md mx-auto text-[11px] leading-relaxed opacity-40 uppercase tracking-[0.25em] font-sans">
            Digital craftsmanship for the elite creative sector. We shape the void between technical precision and cinematic atmosphere.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-px h-16 bg-gradient-to-b from-accent/20 to-transparent" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};
