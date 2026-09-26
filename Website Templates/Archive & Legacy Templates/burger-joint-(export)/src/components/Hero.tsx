import { motion } from 'motion/react';
import { ArrowRight, ChevronDown } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background with abstract shapes */}
      <div className="absolute top-0 right-0 -z-10 w-2/3 h-full overflow-hidden opacity-20 pointer-events-none">
         <div className="absolute top-1/4 right-[-10%] w-[800px] h-[800px] bg-brand-primary rounded-full blur-[160px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="z-10"
        >
          <motion.span 
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-brand-primary font-sans tracking-[0.3em] font-semibold text-sm block mb-6 px-1 border-l-4 border-brand-primary"
          >
            ESTABLISHED 2015 • CHICAGO, IL
          </motion.span>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-[0.9] tracking-tighter mb-8 italic">
            GOURMET <br/>
            <span className="text-gradient">BURGERS.</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg lg:text-xl max-w-md mb-12 font-medium leading-relaxed">
            Fresh, never frozen beef. House-made secret sauces. Hand-cut fries. 
            Experience the definitive modern diner vibe.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <a href="#menu" className="bg-brand-primary text-brand-dark font-bold py-4 sm:py-5 px-8 sm:px-10 rounded-full flex items-center justify-center sm:justify-between group overflow-hidden relative shadow-xl shadow-amber-500/10 active:scale-95 transition-all w-full sm:w-auto">
              <span className="z-10 flex items-center gap-2 whitespace-nowrap">VIEW MENU <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></span>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-600 transition-all group-hover:h-full -z-0 opacity-20" />
            </a>
            <a href="#order" style={{ borderColor: '#D4A017', color: '#FFFFFF', backgroundColor: '#0C0C0C' }} className="border-2 py-4 sm:py-5 px-8 sm:px-10 rounded-full font-bold hover:text-brand-dark hover:bg-brand-primary flex items-center justify-center gap-3 transition-all active:scale-95 w-full sm:w-auto">
              ORDER FOR PICKUP
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square relative rounded-[40px] overflow-hidden shadow-2xl border border-white/5">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=1200" 
              alt="Gourmet Burger" 
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110"
            />
            {/* Overlay badge */}
            <div className="absolute top-8 right-8 glass p-6 rounded-3xl text-center rotate-12">
              <span className="block text-brand-primary text-3xl font-display font-black leading-tight">100%</span>
              <span className="block text-xs uppercase tracking-widest font-bold opacity-70">Angus Beef</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 cursor-pointer hidden md:block"
        onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <ChevronDown size={32} />
      </motion.div>
    </section>
  );
}
