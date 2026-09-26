import { motion } from 'motion/react';

export default function Story() {
  return (
    <section id="story" className="py-14 relative overflow-hidden bg-brand-dark flex items-center">
      {/* Full-bleed premium dark/moody restaurant interior background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <img 
          src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop" 
          alt="Moody Chicago Diner Interior" 
          className="w-full h-full object-cover opacity-35 scale-105 select-none animate-pulse-slow"
          style={{ animationDuration: '8s' }}
        />
        {/* Tight physical dark overlay at 75% opacity to make text pop while keeping elements deep and rich */}
        <div className="absolute inset-0 bg-black/75 z-0" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="text-brand-primary font-sans font-bold tracking-[0.2em] uppercase text-xs mb-4 block">
            Our Legacy
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-8 leading-[1.1] uppercase">
            A FUSION OF <span className="text-brand-primary">CHICAGO NOSTALGIA</span> <br/> 
            & CULINARY <span className="text-white/40 italic">MASTERY.</span>
          </h2>
          <p className="text-gray-300 text-base md:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Born in the heart of Chicago, Burger Joint was founded on a simple principle: 
            that the soul of a classic diner could be elevated through uncompromising 
            craftsmanship. We've taken the spirit of the 1950s—the neon, the chrome, 
            the absolute quality—and reimagined it for the modern epicurean. 
            Every patty is a signature, every service is a performance.
          </p>
          <div className="mt-10 w-16 h-px bg-brand-primary/30 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}
