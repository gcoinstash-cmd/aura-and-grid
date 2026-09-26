import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="pt-14 pb-20 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center text-left">
        <div className="text-left">
          <h2 className="text-brand-primary font-sans font-bold tracking-[0.2em] uppercase text-sm mb-4">Contact</h2>
          <h3 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">FIND US <span className="text-white/30 tracking-widest uppercase">IN CHI-TOWN.</span></h3>
          
          <div className="space-y-10 mt-16">
            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-brand-dark transition-all duration-500">
                <MapPin size={24} />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest font-black text-white/30 mb-1">Location</span>
                <p className="text-xl font-medium">1234 West Armitage Ave<br/>Chicago, IL 60647</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-brand-dark transition-all duration-500">
                <Phone size={24} />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest font-black text-white/30 mb-1">Phone</span>
                <p className="text-xl font-medium">(773) 555-BURG</p>
              </div>
            </div>

            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-brand-primary shrink-0 group-hover:bg-brand-primary group-hover:text-brand-dark transition-all duration-500">
                <Mail size={24} />
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest font-black text-white/30 mb-1">Catering</span>
                <p className="text-xl font-medium">orders@burgerjointchi.com</p>
              </div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-12 rounded-[48px] relative text-left"
        >
          <div className="absolute -top-12 -right-8 w-64 h-64 bg-amber-500/10 blur-[80px] pointer-events-none" />
          
          <h4 className="font-display text-3xl font-bold mb-8 uppercase tracking-tighter">The Reservation</h4>
          
          <form className="space-y-6" id="order">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 ml-2">Name</label>
                <input type="text" placeholder="John Smith" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 ml-2">Phone</label>
                <input type="tel" placeholder="(773) 555-0123" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-white/10" />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30 ml-2">Special Requests / Dietary Notes</label>
              <textarea rows={4} placeholder="e.g., Allergies, window seating, special occasions..." className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all placeholder:text-white/10 resize-none" />
            </div>

            <button type="submit" className="w-full py-5 bg-brand-primary text-brand-dark rounded-2xl font-bold uppercase tracking-widest flex items-center justify-center gap-3 group active:scale-[0.98] transition-all shadow-xl shadow-amber-500/10">
              BOOK A TABLE <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
