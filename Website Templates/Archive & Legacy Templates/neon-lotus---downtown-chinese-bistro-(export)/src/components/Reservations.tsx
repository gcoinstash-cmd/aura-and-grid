import { motion, AnimatePresence } from "motion/react";
import React, { useState } from "react";
import { Calendar, Clock, Users, User, Phone, CheckCircle } from "lucide-react";

export default function Reservations() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2 guests",
    name: "",
    phone: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.name || !formData.phone) {
      return;
    }
    setIsLoading(true);
    // Mimic API post
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1200);
  };

  return (
    <section id="reservations" className="py-16 md:py-20 px-6 md:px-12 bg-charcoal relative overflow-hidden border-t border-white/5">
      {/* Red/Blue background glows */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-neon-red/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[10px] md:text-xs font-bold tracking-[0.4em] text-neon-red uppercase mb-4 block"
          >
            SECURE YOUR PASS
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter"
          >
            Reserve a <span className="text-neon-blue">Table</span>
          </motion.h2>
          <p className="mt-4 text-bone/60 text-sm max-w-md mx-auto">
            Bookings are open 30 days in advance. For parties of 8 or more, please contact reservations directly.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0e0e0e] border border-white/5 p-8 md:p-12"
        >
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Date Input */}
                  <div className="space-y-2">
                    <label htmlFor="res-date" className="block font-display text-xs font-bold tracking-widest text-bone/60 uppercase">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        id="res-date"
                        type="date" 
                        required
                        aria-label="Reservation Date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none py-4 pl-12 pr-4 text-white text-sm font-light transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Time Input */}
                  <div className="space-y-2">
                    <label htmlFor="res-time" className="block font-display text-xs font-bold tracking-widest text-bone/60 uppercase">
                      Time
                    </label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        id="res-time"
                        type="time" 
                        required
                        aria-label="Reservation Time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none py-4 pl-12 pr-4 text-white text-sm font-light transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Party Size Input */}
                  <div className="space-y-2">
                    <label htmlFor="res-guests" className="block font-display text-xs font-bold tracking-widest text-bone/60 uppercase">
                      Party Size
                    </label>
                    <div className="relative">
                      <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <select 
                        id="res-guests"
                        aria-label="Party Size"
                        value={formData.guests}
                        onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none py-4 pl-12 pr-4 text-white text-sm font-light transition-all appearance-none cursor-pointer"
                      >
                        <option value="1 guest" className="bg-charcoal text-white">1 Guest</option>
                        <option value="2 guests" className="bg-charcoal text-white">2 Guests</option>
                        <option value="3 guests" className="bg-charcoal text-white">3 Guests</option>
                        <option value="4 guests" className="bg-charcoal text-white">4 Guests</option>
                        <option value="5 guests" className="bg-charcoal text-white">5 Guests</option>
                        <option value="6 guests" className="bg-charcoal text-white">6 Guests</option>
                        <option value="7 guests" className="bg-charcoal text-white">7 Guests</option>
                        <option value="8+ guests" className="bg-charcoal text-white">8+ Guests</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-white/10 pl-2">
                        <span className="text-[10px] text-white/40">▼</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="res-name" className="block font-display text-xs font-bold tracking-widest text-bone/60 uppercase">
                      Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        id="res-name"
                        type="text" 
                        required
                        placeholder="Your full name"
                        aria-label="Full Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none py-4 pl-12 pr-4 text-white placeholder-white/20 text-sm font-light transition-all"
                      />
                    </div>
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label htmlFor="res-phone" className="block font-display text-xs font-bold tracking-widest text-bone/60 uppercase">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        id="res-phone"
                        type="tel" 
                        required
                        placeholder="+1 (555) 000-0000"
                        aria-label="Phone Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-blue focus:ring-1 focus:ring-neon-blue outline-none py-4 pl-12 pr-4 text-white placeholder-white/20 text-sm font-light transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* RESERVE MY TABLE BUTTON */}
                <div className="pt-4">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-neon-red hover:bg-white text-charcoal font-display font-black text-xs tracking-widest py-5 uppercase transition-colors relative flex items-center justify-center cursor-pointer"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-charcoal" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        PROCESSING BOOKING...
                      </span>
                    ) : (
                      "RESERVE MY TABLE"
                    )}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 flex flex-col items-center gap-6"
              >
                <div className="p-4 bg-neon-blue/10 border border-neon-blue/30 rounded-full text-neon-blue animate-pulse">
                  <CheckCircle size={44} />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tighter text-white">
                    Reservation Blocked
                  </h3>
                  <p className="text-sm text-bone/60 max-w-sm mx-auto mt-2 leading-relaxed">
                    We've saved a space for <strong className="text-white">{formData.name}</strong> on <span className="text-neon-blue">{formData.date}</span> at <span className="text-neon-blue">{formData.time}</span>. A confirmation SMS has been sent to your phone.
                  </p>
                </div>
                <div className="w-16 h-[1px] bg-white/15" />
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="font-display text-[10px] font-bold tracking-[0.2em] text-neon-pink hover:text-white transition-colors uppercase"
                >
                  Book another slot
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
