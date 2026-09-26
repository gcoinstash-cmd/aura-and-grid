import { motion } from 'motion/react';
import { Layers, Shield, Compass, Sparkles } from 'lucide-react';

export default function Philosophy() {
  const pillars = [
    {
      icon: <Layers className="w-5 h-5 text-[#E6C587]" />,
      title: 'Bespoke Curation',
      desc: 'We do not duplicate default trends. Each consultation begins by calculating bone structure angles, hair cuticle weight, and fluid facial movements to curate a personalized structural geometry.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#E6C587]" />,
      title: 'Botanical Alchemy',
      desc: 'Every coloring pigment, glaze, and cleansing agent is infused with organic bio-lipids, wild-harvested plant proteins, and raw cold-pressed botanical oils. Cruelty-free, safe, and restorative.'
    },
    {
      icon: <Shield className="w-4 h-4 text-[#E6C587]" />,
      title: 'The Slow Studio',
      desc: 'We operate on extended, generous appointment parameters. With single-chair focus block bookings, we banish noisy rushing, serving premium coffee, organic matcha micro-brews, and pure silence.'
    }
  ];

  return (
    <section id="philosophy" className="relative py-28 md:py-36 bg-[#0d0d0d] overflow-hidden border-b border-white/[0.03]">
      {/* Absolute Decorative Grid Elements */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-[#E6C587]/[0.02] rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Editorial Single Column Brand Statement block */}
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1 }}
            className="block font-mono text-[10px] uppercase tracking-[0.35em] text-[#E6C587]"
          >
            OUR CORE VALUE
          </motion.span>
          
          <motion.h2
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="mt-6 font-serif text-3xl md:text-5xl leading-tight text-white font-light tracking-tight"
          >
            A calm sanctuary dedicated to modern texture, raw organic materials, and deliberate precision.
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
            className="h-px w-24 bg-[#E6C587]/30 mx-auto mt-12 mb-8 origin-center"
          />

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-sm md:text-base text-[#F7F4EB]/60 leading-relaxed font-light tracking-wide"
          >
            We believe that hair is an extension of organic landscape architecture and a sacred crown of identity. Established in the tranquil heart of Melrose, Crown & Collective merges premium organic botanical care with elite curl/coil expertise and bespoke dimensional color, elevating your salon appointment into a deliberate, high-end personal ritual of rejuvenation.
          </motion.p>
        </div>

        {/* Brand Pillars Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              className="group relative bg-[#121212] p-8 md:p-10 border border-white/[0.04] flex flex-col justify-between hover:border-white/10 transition-all duration-500 ease-out"
            >
              {/* Asymmetric Light Glair Accent on Hover */}
              <div className="absolute inset-0 bg-linear-to-b from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div>
                {/* Icon wrapper with micro hover bounce */}
                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-none w-fit mb-8 group-hover:border-[#E6C587]/30 group-hover:bg-[#E6C587]/[0.02] transition-colors duration-500">
                  {pillar.icon}
                </div>
                
                <h3 className="font-serif text-xl md:text-2xl text-white tracking-wide font-light mb-4">
                  {pillar.title}
                </h3>
                
                <p className="text-xs md:text-[13px] text-[#F7F4EB]/60 leading-relaxed font-light tracking-wide">
                  {pillar.desc}
                </p>
              </div>

              {/* Aesthetic indicator at bottom of each card */}
              <div className="mt-8 flex items-center justify-between text-[9px] font-mono tracking-[0.3em] uppercase text-white/30 group-hover:text-[#E6C587]/70 transition-colors duration-500">
                <span>RITUAL {idx + 1}</span>
                <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-[#E6C587] transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
