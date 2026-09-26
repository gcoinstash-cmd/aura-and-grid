import { motion } from "motion/react";
import { MapPin, Phone, Instagram, Facebook, Navigation, Clock } from "lucide-react";

export default function Contact() {
  const handleGetDirections = () => {
    // Using a generic Lat/Lng or searching for Metropolis MC 90210 (dummy address)
    const url = `https://www.google.com/maps/dir/?api=1&destination=452+Electric+Ave+Metropolis+MC+90210`;
    window.open(url, '_blank');
  };

  return (
    <section id="location" className="relative py-16 md:py-20 px-6 md:px-12 bg-charcoal overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,white_1px,transparent_1px)] bg-[length:10vw_100%]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-[clamp(2.5rem,8vw,5rem)] md:text-8xl tracking-tighter uppercase leading-tight"
          >
            Find the <br />
            <span className="text-neon-red">Vibe</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 text-center">
          {/* Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 group"
          >
            <div className="p-6 bg-white/5 border border-white/10 group-hover:border-neon-blue group-hover:shadow-[0_0_20px_rgba(0,243,255,0.2)] transition-all duration-500">
              <MapPin className="text-neon-blue" size={28} />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest mb-3 uppercase">Location</h4>
              <p className="text-bone/60 leading-relaxed">
                452 Electric Ave, Downtown District<br />
                Metropolis, MC 90210
              </p>
              <button 
                onClick={handleGetDirections}
                className="mt-6 flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-neon-blue hover:text-white transition-colors uppercase mx-auto"
              >
                <Navigation size={14} />
                Get Directions
              </button>
            </div>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center gap-6 group"
          >
            <div className="p-6 bg-white/5 border border-white/10 group-hover:border-neon-red group-hover:shadow-[0_0_20px_rgba(255,68,68,0.2)] transition-all duration-500">
              <Phone className="text-neon-red" size={28} />
            </div>
            <div>
              <h4 className="font-display font-bold text-sm tracking-widest mb-3 uppercase">Contact</h4>
              <p className="text-bone/60 leading-relaxed">
                Reservations: (555) 234-8890<br />
                Events: events@neonlotus.com
              </p>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center gap-6 group"
          >
            <div className="p-6 bg-white/5 border border-white/10 group-hover:border-neon-pink group-hover:shadow-[0_0_20px_rgba(255,0,255,0.2)] transition-all duration-500">
              <Clock className="text-neon-pink" size={28} />
            </div>
            <div className="w-full">
              <h4 className="font-display font-bold text-sm tracking-widest mb-3 uppercase">Hours</h4>
              <ul className="space-y-2 text-sm text-bone/60 max-w-[240px] mx-auto">
                <li className="flex justify-between gap-8"><span>MON — THU</span> <span className="text-bone">5PM — 11PM</span></li>
                <li className="flex justify-between gap-8"><span>FRI — SAT</span> <span className="text-bone">5PM — 1AM</span></li>
                <li className="flex justify-between text-neon-red gap-8"><span>SUNDAY</span> <span>CLOSED</span></li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Social Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex justify-center gap-6 pt-12 border-t border-white/5"
        >
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-neon-pink transition-all duration-300"
          >
            <Instagram size={18} className="text-neon-pink" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Instagram</span>
          </a>
          <a 
            href="https://facebook.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 hover:border-neon-blue transition-all duration-300"
          >
            <Facebook size={18} className="text-neon-blue" />
            <span className="text-[10px] font-bold tracking-[0.3em] uppercase">Facebook</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}

