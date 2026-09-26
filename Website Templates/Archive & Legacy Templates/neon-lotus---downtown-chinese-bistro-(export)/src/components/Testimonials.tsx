import { motion } from "motion/react";

const REVIEWS = [
  {
    quote: "The wok hei on this beef ho fun is the real deal. This is what downtown dining should feel like.",
    author: "Marcus T.",
    role: "Food Critic"
  },
  {
    quote: "Every dish feels like a street food anthem elevated to art.",
    author: "Jade L.",
    role: "Regular"
  },
  {
    quote: "The truffle siu mai changed my life. I'm not joking.",
    author: "Kevin R.",
    role: "Yelp Elite"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-20 px-6 md:px-12 bg-[#111111] relative overflow-hidden">
      {/* Subtle Grid overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,white_1px,transparent_1px)] bg-[length:15vw_100%]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16 md:mb-20">
          <motion.span 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-[10px] md:text-xs font-bold tracking-[0.5em] text-neon-blue uppercase mb-4 block"
          >
            PATRON VOICES
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display font-black text-4xl md:text-6xl uppercase tracking-tighter text-white"
          >
            Guest <span className="text-neon-red">Perspectives</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="flex flex-col justify-between p-8 bg-black/40 border border-white/5 relative group hover:border-neon-blue/40 transition-all duration-300"
            >
              {/* Cyan Accent Line on Top */}
              <div className="w-12 h-1 bg-neon-blue mb-8 group-hover:w-24 transition-all duration-500" />
              
              <p className="font-display italic text-lg md:text-2xl text-white leading-relaxed mb-8 font-light">
                "{review.quote}"
              </p>
              
              <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-display font-bold text-base text-white uppercase tracking-tight">
                    {review.author}
                  </h4>
                  <p className="text-[10px] font-bold tracking-widest text-bone/45 uppercase mt-1">
                    {review.role}
                  </p>
                </div>
                {/* Visual marker */}
                <span className="text-2xl text-neon-blue/20 font-serif leading-none">”</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
