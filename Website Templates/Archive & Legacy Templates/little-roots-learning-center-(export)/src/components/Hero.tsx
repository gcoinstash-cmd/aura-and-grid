import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface HeroProps {
  onOpenTourModal: () => void;
  onScrollViewToPrograms: () => void;
}

export default function Hero({ onOpenTourModal, onScrollViewToPrograms }: HeroProps) {
  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center bg-[#1B3A2D] overflow-hidden pt-20"
    >
      {/* Full-bleed background image behind hero */}
      <div className="absolute inset-0 z-0 select-none">
        <img
          src="https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&auto=format&fit=crop"
          alt="Joyful Black children and families engagement in a supportive academic space"
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=1600&auto=format&fit=crop";
          }}
        />
        {/* Dark forest green overlay at opacity-50 */}
        <div className="absolute inset-0 bg-[#1B3A2D]/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[#1B3A2D]/45 backdrop-blur-[1px]" />
      </div>

      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Text Logic (Left Side, 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Tagline / Location */}
            <div className="inline-flex items-center gap-2 bg-black/45 px-3.5 py-1.5 rounded-full w-fit mb-6 border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span className="text-xs font-bold tracking-widest text-white uppercase">
                A Premium Los Angeles Boutique Daycare
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.08] mb-6 natural-tones-hero-title">
              Where Little <span className="text-brand-gold relative">Roots</span> <br />
              Grow Into <span className="serif-italic italic text-white/90">Giants</span>.
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-[#FAF7F2]/90 font-sans leading-relaxed max-w-xl mb-8">
              Founded for Los Angeles’ entrepreneurial, visionary families. We combine pre-eminent cognitive development, Reggio Emilia inquiry, and culturally affirming Afrocentric identity to foster global brilliance from day one.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                type="button"
                onClick={onOpenTourModal}
                className="bg-brand-gold hover:bg-brand-gold/90 text-[#1B3A2D] font-bold text-sm tracking-widest py-4 px-8 rounded transition-all duration-300 transform active:scale-95 shadow-lg shadow-brand-gold/20 uppercase flex items-center justify-center gap-2"
                id="hero-cta-tour"
              >
                Schedule a Tour <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onScrollViewToPrograms}
                className="border-2 border-white/70 hover:bg-white/10 text-white font-bold text-sm tracking-widest py-4 px-8 rounded transition-all duration-300 transform active:scale-95 uppercase flex items-center justify-center"
                id="hero-cta-programs"
              >
                View Programs
              </button>
            </div>

            {/* Micro details */}
            <div className="mt-10 pt-8 border-t border-white/20 flex flex-wrap gap-x-8 gap-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span className="text-xs font-semibold text-white/95">
                  Leimert Park & Baldwin Hills, CA
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-white/95">
                  Enrolling for Summer / Fall 2026
                </span>
              </div>
            </div>
          </div>

          {/* Hero Image (Right Side, 5 Cols) */}
          <div className="lg:col-span-5 relative w-full aspect-square sm:aspect-[4/3] lg:aspect-[4/5] rounded-[30px] overflow-hidden shadow-2xl border-4 border-white bg-brand-sand/10">
            {/* The signature Natural Tones accent stamp */}
            <div className="absolute top-4 right-4 z-20 hidden sm:flex natural-tones-accent-stamp shadow-md">
              EST. 2024<br />BALDWIN<br />HILLS
            </div>

            {/* The real, deep emotional image of a Black child engaging in premium creative play/art */}
            <img
              src="https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?w=800&auto=format&fit=crop"
              alt="Joyful Black mother and her young child smiling and learning together in a supportive academic space"
              className="w-full h-full object-cover select-none"
              loading="eager"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&auto=format&fit=crop";
              }}
            />
            {/* Accent Gold Corner Ribbons */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-brand-sand flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-forest font-bold text-xs shrink-0 font-serif">
                100%
              </div>
              <div>
                <p className="text-xs font-bold text-brand-forest uppercase tracking-wider leading-none">
                  Culturally Affirming Soil
                </p>
                <p className="text-[10px] text-brand-charcoal/70 font-sans mt-1 leading-normal">
                  Fostering self-esteem and academic dominance starting at 6 weeks old.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
