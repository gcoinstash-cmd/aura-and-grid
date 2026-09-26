import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CATERING_PACKAGES } from "../data/mockData";
import { Button } from "./Button";
import { Send, CheckCircle, Sparkles } from "lucide-react";

export const InquiryForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    packageId: "cat1",
    guests: "30",
    specials: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury-meets-street-food server booking process
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setSubmissionId(`SCK-SYS-${Math.floor(100000 + Math.random() * 90000) }-OUTLAW`);
    }, 1500);
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      date: "",
      packageId: "cat1",
      guests: "30",
      specials: "",
    });
    setIsSuccess(false);
  };

  return (
    <div id="catering_inquiry_form_container" className="relative p-1 bg-gradient-to-br from-brand-border to-transparent">
      <div className="bg-brand-bg/95 backdrop-blur-md p-6 sm:p-8 border border-brand-border/60">
        
        {/* Status Line */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-brand-border">
          <span className="font-mono text-xs text-brand-accent tracking-widest uppercase">SECURE TRANSACT SYSTEM</span>
          <span className="font-mono text-[10px] text-brand-muted">V1.49 // ONLINE</span>
        </div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form 
              key="booking-form"
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-5"
            >
              <h3 className="font-display text-2xl font-black text-white tracking-tight uppercase">
                LOCK IN A VIBE
              </h3>
              <p className="text-sm text-brand-muted font-sans leading-relaxed">
                Provide details below. Our events crew will reach back within 12 hours via encrypted channel.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Your Name // Crew Lead *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="E.G. ALEX MERCER"
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent focus:shadow-[0_0_10px_rgba(204,255,0,0.1)] text-white placeholder-brand-muted/40 font-mono text-sm px-4 py-3 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="E.G. ALEX@CYBER.NET"
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent focus:shadow-[0_0_10px_rgba(204,255,0,0.1)] text-white placeholder-brand-muted/40 font-mono text-sm px-4 py-3 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Mobile Core / Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="E.G. +1 (555) 0192"
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent focus:shadow-[0_0_10px_rgba(204,255,0,0.1)] text-white placeholder-brand-muted/40 font-mono text-sm px-4 py-3 outline-none transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Target Date *
                  </label>
                  <input
                    type="date"
                    required
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent text-white font-mono text-sm px-4 py-3 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Aesthetic Package *
                  </label>
                  <select
                    name="packageId"
                    value={formData.packageId}
                    onChange={handleChange}
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent text-white font-mono text-sm px-4 py-3 outline-none transition-all duration-200 appearance-none cursor-pointer"
                  >
                    {CATERING_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.name.toUpperCase()} (${pkg.pricePerPerson}/PP)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                    Guest Estimate (MIN 20) *
                  </label>
                  <input
                    type="number"
                    min="20"
                    required
                    name="guests"
                    id="guest_count_input"
                    value={formData.guests}
                    onChange={handleChange}
                    placeholder="30"
                    className="w-full bg-brand-card border border-brand-border focus:border-brand-accent text-white font-mono text-sm px-4 py-3 outline-none transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold tracking-wider uppercase text-brand-muted mb-1.5">
                  Audio demands, dietary specifications, street art preference
                </label>
                <textarea
                  name="specials"
                  rows={3}
                  value={formData.specials}
                  onChange={handleChange}
                  placeholder="Need vegan alternatives, extreme heavy-bass audio setups, specific food timing or customized merchandise packaging..."
                  className="w-full bg-brand-card border border-brand-border focus:border-brand-accent focus:shadow-[0_0_10px_rgba(204,255,0,0.1)] text-white placeholder-brand-muted/40 font-mono text-sm px-4 py-3 outline-none transition-all duration-200 resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full h-14"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      ENGAGING CRYPTONET WORK...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      SEND REQUEST DETAILS <Send className="w-4 h-4 ml-1" />
                    </span>
                  )}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-8 space-y-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-accent/10 border border-brand-accent text-brand-accent mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display text-2xl font-black text-white tracking-tight uppercase">
                  REQUEST BROADCASTED
                </h4>
                <p className="text-sm font-mono text-brand-accent uppercase tracking-widest">
                  ID: {submissionId}
                </p>
                <div className="max-w-md mx-auto p-4 bg-brand-card/50 border border-brand-border mt-4 text-left rounded-sm font-mono text-xs text-brand-muted space-y-2">
                  <div className="flex justify-between"><span className="text-white">CLIENT:</span> <span>{formData.name.toUpperCase()}</span></div>
                  <div className="flex justify-between"><span className="text-white">CORE EMAIL:</span> <span>{formData.email}</span></div>
                  <div className="flex justify-between"><span className="text-white">DATE SECURED:</span> <span>{formData.date}</span></div>
                  <div className="flex justify-between"><span className="text-white">GUESTS LOCK:</span> <span>{formData.guests} HEADS</span></div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-brand-muted">
                <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
                <span>Ticket locked to SCK-LEDGER</span>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <Button variant="secondary" size="sm" onClick={handleReset}>
                  SUBMIT NEW FORM
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
