import { Crown, Compass, HeartHandshake } from 'lucide-react';

export default function Philosophy() {
  const pillars = [
    {
      id: 'cultural-identity',
      icon: Crown,
      title: 'Cultural Identity',
      tagline: 'Rooted in Greatness',
      description: 'We surround children with positive mirrors of their heritage daily. Through music, historical storytelling, and diverse aesthetics, we instill an unshakeable self-worth and a profound sense of cultural belonging from infancy.',
      accent: 'text-brand-gold bg-brand-forest'
    },
    {
      id: 'academic-excellence',
      icon: Compass,
      title: 'Academic Excellence',
      tagline: 'Inquiry & Rigor',
      description: 'Blending the child-led sensory exploration of Reggio Emilia with rigorous pre-literacy and early STEAM labs. We cultivate critical thinkers who ask why, build theories, and treat challenges as pathways to mastery.',
      accent: 'text-brand-terracotta bg-brand-sand'
    },
    {
      id: 'community-family',
      icon: HeartHandshake,
      title: 'Community & Family',
      tagline: 'Legacy of Support',
      description: 'We believe it takes a highly intentional village. Little Roots acts as a cooperative sanctuary for Black entrepreneurs, scholars, and creators, aligning child-care excellence with parent-centric networking and cultural events.',
      accent: 'text-brand-forest bg-brand-gold'
    }
  ];

  return (
    <section
      id="philosophy"
      className="py-16 md:py-24 bg-brand-sand/40 border-y border-brand-sand relative"
    >
      {/* Decorative subtle texture/line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-85" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
            Our Foundation
          </span>
          <h2 className="font-serif text-3xl md:text-4xl font-black text-brand-forest tracking-tight mb-4">
            A Culturally-Rich Soil for Global Visionaries
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6 rounded-full" />
          <p className="text-base text-brand-charcoal/80">
            We reject standard assembly-line childcare models. Instead, we have curated a premier responsive methodology that nurtures intellectual resilience, creative fluency, and strong cooperative values.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 premium-pillars-container">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="bg-brand-cream border border-brand-sand/85 p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative group overflow-hidden natural-tones-pillar-card"
              >
                {/* Accent Highlight Top bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-brand-sand transition-all duration-300 group-hover:bg-brand-gold" />
                
                {/* Icon Circle */}
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition duration-300 group-hover:scale-105 shrink-0 ${
                    pillar.id === 'cultural-identity'
                      ? 'bg-brand-forest text-brand-gold'
                      : pillar.id === 'academic-excellence'
                      ? 'bg-brand-terracotta text-brand-cream'
                      : 'bg-brand-gold text-brand-forest'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl font-bold text-brand-forest group-hover:text-brand-terracotta transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] font-bold tracking-wider text-brand-terracotta/80 uppercase font-sans">
                      {pillar.tagline}
                    </p>
                  </div>
                </div>

                {/* Body Text */}
                <p className="text-sm text-brand-charcoal/85 leading-relaxed font-sans">
                  {pillar.description}
                </p>

                {/* Subtle Gold Accent Dot in Corner */}
                <span className="absolute bottom-4 right-4 text-brand-gold/20 font-serif font-black text-4xl select-none group-hover:text-brand-gold/40 transition duration-300">
                  ★
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
