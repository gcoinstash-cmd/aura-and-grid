import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LOCATION_DETAILS } from "../data/mockData";
import { Button } from "../components/Button";
import { Instagram, Radio, Disc, ArrowRight, Check, Send } from "lucide-react";

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSubscribed(true);
      setNewsletterEmail("");
    }, 1200);
  };

  const handleScrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <footer id="main_footer" className="bg-[#0B0B0C] border-t border-brand-border py-16 px-6 relative overflow-hidden font-mono text-left">
      <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] bg-brand-accent/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* Left Side: Brand presentation */}
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 bg-brand-accent text-black font-black text-xl flex items-center justify-center select-none">
              S
            </span>
            <div>
              <span className="block text-md font-black text-white tracking-widest uppercase">
                STREET CULTURE KITCHEN
              </span>
              <span className="block text-[10px] text-brand-muted tracking-wide">
                // RAW FOODS. AUDIO DRIVEN.
              </span>
            </div>
          </div>

          <p className="max-w-md text-xs font-sans text-brand-muted leading-relaxed">
            Designed for concrete dining, loaded with heavy bass, and constructed without shortcuts. Smashed, torched, and wrapped with premium streetwear aesthetics in District 4.
          </p>

          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent flex items-center justify-center transition-colors duration-200"
              aria-label="Instagram handle link"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent flex items-center justify-center transition-colors duration-200"
              aria-label="Spotify radio playlist link"
            >
              <Disc className="w-4 h-4" />
            </a>
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-full border border-brand-border hover:border-brand-accent text-brand-muted hover:text-brand-accent flex items-center justify-center transition-colors duration-200"
              aria-label="TikTok channel link"
            >
              <Radio className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Center: Scroll Sitemap */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black tracking-widest text-white uppercase border-b border-brand-border/60 pb-2">
            GRID NAVIGATION
          </h4>
          
          <ul className="space-y-2.5 text-xs">
            {["story", "menu", "catering", "location"].map((sect) => (
              <li key={sect}>
                <button
                  onClick={() => handleScrollToSection(sect)}
                  className="text-brand-muted hover:text-brand-accent transition-colors duration-200 cursor-pointer uppercase select-none text-left flex items-center gap-1 group"
                >
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 -ml-3.5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200 text-brand-accent" />
                  {sect === "story" ? "THE MANIFESTO" : sect === "menu" ? "THE FLAVOR INDEX" : sect.toUpperCase()}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side: Editorial Newsletter Sign-up */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-black tracking-widest text-white uppercase border-b border-brand-border/60 pb-2">
            JOIN THE UNDERGROUND LEDGER
          </h4>
          
          <p className="text-xs font-sans text-brand-muted leading-relaxed">
            Subscribe for notifications regarding covert popups, physical merchandise drops, and weekend party runs.
          </p>

          <AnimatePresence mode="wait">
            {!isSubscribed ? (
              <motion.form
                key="newsletter-form"
                onSubmit={handleNewsletterSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="CORESIGN@DOMAIN.NET"
                  className="bg-brand-card/70 border border-brand-border focus:border-brand-accent text-white placeholder-brand-muted/40 font-mono text-xs px-4 py-3 outline-none flex-1 transition-all duration-200 lowercase"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-accent text-black font-black text-xs tracking-widest px-5 py-3 border border-brand-accent hover:opacity-90 transition-opacity duration-200 cursor-pointer select-none flex items-center justify-center gap-1.5"
                >
                  {submitting ? "ENCRYPT..." : <><span className="sr-only">Submit</span><Send className="w-3.5 h-3.5" /></>}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="newsletter-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-3 bg-brand-accent/5 border border-brand-accent/20 text-brand-accent font-mono text-[10px] tracking-wider uppercase flex items-center gap-2.5 rounded-sm"
              >
                <div className="w-5 h-5 rounded-full bg-brand-accent/10 border border-brand-accent/25 flex items-center justify-center">
                  <Check className="w-3 h-3" />
                </div>
                <span>CORE ENCRYPTED. CHECK INBOX SHORTLY.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Meta Licensing & Details */}
      <div className="max-w-7xl mx-auto border-t border-brand-border/40 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] text-[#8E8E93] font-mono tracking-widest">
        <span>© {new Date().getFullYear()} STREET CULTURE KITCHEN INC. ALL BRAND INTENTS SECURED.</span>
        <span>DESIGNED ON CONCRETE // ANTIGRAVITY SPEC v1.9</span>
      </div>

    </footer>
  );
};
