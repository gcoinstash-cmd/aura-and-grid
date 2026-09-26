import React from "react";
import { motion } from "motion/react";
import { MessageSquare, Star, ArrowDownRight, Sparkles, Receipt, ThumbsUp } from "lucide-react";

interface Review {
  id: string;
  handle: string;
  avatarLetter: string;
  date: string;
  quote: string;
  ordered: string[];
  rating: number;
}

const REVIEWS: Review[] = [
  {
    id: "tx-4921",
    handle: "@cyber.culinary",
    avatarLetter: "C",
    date: "05-28-2026",
    quote: "The Charcoal Wagyu Taco is an absolute masterclass. The scallion cream is electric, and the hand-pressed charcoal shell has this amazing earthy crunch that pairs perfectly with the bass from the sound system.",
    ordered: ["Charcoal A5 Wagyu Taco", "Liquid Neon Limeade"],
    rating: 5
  },
  {
    id: "tx-8812",
    handle: "@vandal_bites",
    avatarLetter: "V",
    date: "05-24-2026",
    quote: "Heavy beats and flawless brisket. The Subline Burrito is rolled so tightly and heat-pressed perfectly. Squeezing lime over it in Sector 9 at midnight is a spiritual experience.",
    ordered: ["Subline Brisket Smasher", "Loaded Cotija Fries"],
    rating: 5
  },
  {
    id: "tx-3011",
    handle: "@street_food_guru",
    avatarLetter: "S",
    date: "05-20-2026",
    quote: "A5 brisket with true street-level hustle. This isn’t fancy-restaurant pretense; it is raw cooking done with elite materials. Best late-night system in District 4.",
    ordered: ["Yuzu Citrus Shrimp", "Loaded Cotija Fries"],
    rating: 5
  }
];

export const StreetCred: React.FC = () => {
  return (
    <section id="street-cred" className="py-24 bg-[#0B0B0C] border-b border-brand-border px-6 relative overflow-hidden">
      {/* Background neon laser grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161618_1px,transparent_1px),linear-gradient(to_bottom,#161618_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />
      <div className="absolute top-[30%] left-[5%] w-[40%] h-[30%] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[5%] w-[35%] h-[35%] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Title Block with bracket decorations */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-orange tracking-widest uppercase font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-orange animate-pulse" /> STREET CRED // DISPATCH VERIFIED
            </span>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white uppercase tracking-tight">
              RAW INTEL // VERIFIED CLOUT
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            Collected transcripts from physical dispatch logs. Real people, pristine culinary expectations, heavy low frequencies.
          </p>
        </div>

        {/* High-Fidelity Terminal Receipt Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -5 }}
              className="bg-brand-card border border-brand-border hover:border-brand-accent/60 transition-all duration-300 relative flex flex-col justify-between overflow-hidden group rounded-sm p-6"
            >
              {/* Receipt Visual Top Notch Serrations */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-[linear-gradient(90deg,transparent_50%,rgba(204,255,0,0.25)_50%)] bg-[size:8px_100%] pointer-events-none" />
              
              <div className="space-y-6">
                {/* Header Metadata */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-sm bg-brand-bg border border-brand-border flex items-center justify-center font-display font-black text-white text-lg group-hover:text-brand-accent transition-colors">
                      {review.avatarLetter}
                    </div>
                    <div className="text-left font-mono">
                      <span className="block text-xs font-bold text-white uppercase tracking-wider">{review.handle}</span>
                      <span className="block text-[9px] text-brand-muted">STAFF ID: #{review.id}</span>
                    </div>
                  </div>
                  
                  {/* Styled Receipt Tag */}
                  <div className="flex items-center gap-1 bg-brand-accent/5 border border-brand-accent/20 text-brand-accent font-mono text-[9px] px-2 py-0.5 rounded-sm">
                    <Receipt className="w-3 h-3" />
                    <span>REC_LOG</span>
                  </div>
                </div>

                {/* Star Matrix */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      className={`w-3.5 h-3.5 ${
                        starIdx < review.rating 
                          ? "text-brand-accent fill-brand-accent" 
                          : "text-brand-border"
                      }`} 
                    />
                  ))}
                  <span className="font-mono text-[9px] text-brand-accent ml-2">VERIFIED LOAD</span>
                </div>

                {/* Quote Block */}
                <p className="text-xs sm:text-sm text-brand-text leading-relaxed font-sans text-left relative pl-4 border-l-2 border-brand-orange/40 italic">
                  "{review.quote}"
                </p>

                {/* Ordered Items Manifest */}
                <div className="pt-4 border-t border-brand-border/60 space-y-2">
                  <span className="block text-[9px] font-mono text-brand-muted tracking-widest uppercase text-left">
                    ITEMS ORDERED // VIRTUAL REGISTER:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {review.ordered.map((item, itemIdx) => (
                      <span 
                        key={itemIdx} 
                        className="font-mono text-[9px] text-white bg-brand-bg/80 border border-brand-border px-2 py-0.5 rounded-sm"
                      >
                        + {item.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Detail */}
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-brand-border/40 font-mono text-[9px] text-brand-muted">
                <span>DATE LOG: {review.date}</span>
                <span className="flex items-center gap-1 group-hover:text-brand-accent transition-colors">
                  SECURE CHANNELS
                  <ArrowDownRight className="w-3 h-3 text-brand-orange" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Visual Call-to-Action Bottom Banner */}
        <div className="p-8 bg-brand-card/40 border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-6 relative select-none">
          <div className="absolute top-2 left-2 text-[8px] font-mono text-brand-border">// AUTHENTIC TRANSCRIPTS VERIFIED THROUGH POS DEPLOYMENTS</div>
          
          <div className="space-y-1.5 text-left pt-2 sm:pt-0">
            <h4 className="font-display font-black text-white text-lg sm:text-xl uppercase tracking-tight">Got high levels of taco feedback?</h4>
            <p className="text-xs text-brand-muted font-sans max-w-xl">
              We update our physical terminal grids and dispatch logs weekly. Tap into the official server and drop an encrypted rating during checkouts.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-brand-accent bg-brand-accent/5 border border-brand-accent/20 px-4 py-2 rounded-sm whitespace-nowrap self-stretch sm:self-center justify-center">
            <ThumbsUp className="w-4 h-4 text-brand-accent animate-bounce" />
            <span>99.4% CLIENT REENTRY STATUS</span>
          </div>
        </div>

      </div>
    </section>
  );
};
