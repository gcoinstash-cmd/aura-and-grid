/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MenuGrid from "./components/MenuGrid";
import Testimonials from "./components/Testimonials";
import Reservations from "./components/Reservations";
import Contact from "./components/Contact";
import InstagramGrid from "./components/InstagramGrid";
import Newsletter from "./components/Newsletter";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Calendar, ChevronUp } from "lucide-react";

export default function App() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowSticky(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const revealVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <Hero />
        
        {/* Story Section */}
        <motion.section 
          id="story" 
          className="py-16 md:py-20 px-6 md:px-12 bg-[#0A0A0A]"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={revealVariants}
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="inline-block p-4 border border-neon-blue/30 mb-8"
            >
              <span className="font-display text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-white">THE VISION</span>
            </motion.div>
            <h2 className="font-display font-black text-[clamp(2.25rem,8vw,5rem)] md:text-7xl tracking-tighter uppercase leading-[0.9] mb-12 text-white">
              Born from the <span className="text-glow-red text-neon-red">steam</span> of the street, raised in the <span className="text-neon-blue">lights</span> of the city.
            </h2>
            <div className="w-24 h-1 bg-neon-red mx-auto mb-12" />
            <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
              Neon Lotus isn't just a restaurant; it's an urban sanctuary. We celebrate the high-energy, 
              no-compromise flavors of the Far East, brought to life with a modern downtown edge. 
              Our wok is always hot, our neon is always bright.
            </p>
          </div>
        </motion.section>

        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={revealVariants}
        >
          <MenuGrid />
        </motion.div>

        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={revealVariants}
        >
          <Testimonials />
        </motion.div>

        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={revealVariants}
        >
          <Reservations />
        </motion.div>

        {/* Social Proof / Awards */}
        <section className="py-16 md:py-20 bg-neon-blue text-charcoal overflow-hidden">
          <div className="flex whitespace-nowrap overflow-hidden">
             <motion.div 
               animate={{ x: [0, -1000] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="flex gap-20 items-center px-10"
             >
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="flex items-center gap-6">
                   <h3 className="font-display font-black text-6xl tracking-tighter uppercase">METRO CRITIC'S CHOICE</h3>
                   <div className="w-4 h-4 bg-charcoal rotate-45" />
                   <h3 className="font-display font-black text-6xl tracking-tighter uppercase">5 STARS — URBAN EATS</h3>
                   <div className="w-4 h-4 bg-charcoal rotate-45" />
                   <h3 className="font-display font-black text-6xl tracking-tighter uppercase">BEST STREET FOOD 2024</h3>
                   <div className="w-4 h-4 bg-charcoal rotate-45" />
                 </div>
               ))}
             </motion.div>
          </div>
        </section>

        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={revealVariants}
        >
          <Contact />
        </motion.div>

        <InstagramGrid />
        
        <Newsletter />

        {/* Footer */}
        <footer className="py-20 px-6 md:px-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-display font-black text-xl tracking-tighter">
            NEON LOTUS
          </div>
          <div className="text-bone/40 text-[10px] tracking-widest font-bold uppercase">
            © 2024 NEON LOTUS GROUP • ALL RIGHTS RESERVED
          </div>
          <div className="flex gap-8 text-xs font-bold tracking-widest opacity-60">
            <a href="#" className="hover:text-neon-red">PRIVACY</a>
            <a href="#" className="hover:text-neon-blue">TERMS</a>
          </div>
        </footer>
      </main>

      {/* Sticky CTA */}
      <AnimatePresence>
        {showSticky && (
          <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[60] flex flex-col gap-4">
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-charcoal/80 backdrop-blur-md text-white p-3 md:p-4 border border-white/10 hover:bg-neon-blue transition-colors rounded-none"
              aria-label="Back to top"
            >
              <ChevronUp size={20} />
            </motion.button>
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              onClick={() => document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-neon-red text-charcoal px-6 md:px-8 py-4 font-display font-black text-[10px] md:text-xs tracking-widest shadow-2xl flex items-center gap-4 hover:bg-white transition-colors group rounded-none"
            >
              BOOK A TABLE <Calendar className="group-hover:scale-110 transition-transform" size={16} />
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* Decorative vertical rail */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40 hidden xl:flex">
         <div className="w-[1px] h-32 bg-white/10 mx-auto" />
         <span className="[writing-mode:vertical-rl] rotate-180 text-[10px] font-bold tracking-[0.5em] text-bone/20">
           NOW SERVING DOWNTOWN
         </span>
         <div className="w-[1px] h-32 bg-white/10 mx-auto" />
      </div>
    </div>
  );
}

