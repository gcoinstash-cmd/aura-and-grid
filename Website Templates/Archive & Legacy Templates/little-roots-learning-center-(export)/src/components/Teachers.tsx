import { teachersData } from '../data';
import { Sparkles, Award, Heart } from 'lucide-react';

function getInitials(name: string): string {
  const cleanName = name.replace(/^(Dr\.|Mr\.|Mrs\.|Ms\.)\s+/i, '').replace(/,\s*.*$/, '');
  const parts = cleanName.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0] ? parts[0][0].toUpperCase() : '';
}

export default function Teachers() {
  return (
    <section id="teachers" className="py-20 md:py-28 bg-brand-cream relative overflow-hidden">
      {/* Background soft layout blur accent */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-brand-gold/5 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-brand-terracotta/5 rounded-full filter blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
            Our Elite Guides
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-brand-forest tracking-tight mb-4">
            Meet the Builders of Giants
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6 rounded-full" />
          <p className="text-base text-brand-charcoal/80">
            Our educators are academic visionaries and warm cultural anchors. Holding advanced degrees in Child Development, Montessori curricula, and Africana research.
          </p>
        </div>

        {/* Teachers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teachersData.map((teacher, index) => {
            return (
              <div
                key={teacher.id}
                className="bg-white border border-brand-sand rounded-[32px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
              >
                {/* Photo Header block with warm circular placeholder */}
                <div className="relative aspect-square flex items-center justify-center bg-brand-sand/15 py-10">
                  <div className="w-52 h-52 rounded-full bg-[#1B3A2D] ring-4 ring-brand-gold/40 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-105 relative overflow-hidden">
                    {/* Concentric elegant circular border */}
                    <div className="absolute inset-2 border border-brand-gold/15 rounded-full pointer-events-none" />
                    <span className="font-serif text-5xl font-black text-brand-gold tracking-widest leading-none select-none">
                      {getInitials(teacher.name)}
                    </span>
                  </div>
                  {/* Floating badge for credentials icon */}
                  <div className="absolute bottom-4 left-4 bg-brand-cream/95 backdrop-blur-md border border-brand-sand/50 p-2.5 rounded-2xl flex items-center justify-center text-[#1B3A2D] shadow-sm">
                    <Award className="w-5 h-5 text-brand-gold" />
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Role Title */}
                    <p className="text-xs font-bold tracking-widest text-brand-terracotta uppercase mb-2">
                      {teacher.role}
                    </p>

                    <h3 className="font-serif text-2xl font-black text-brand-forest mb-2">
                      {teacher.name}
                    </h3>

                    {/* Highly polished credentials layout */}
                    <div className="bg-brand-sand/40 border border-brand-sand/60 px-3 py-2 rounded-xl text-[11px] font-semibold text-brand-forest/90 leading-normal mb-5">
                      {teacher.credentials}
                    </div>

                    {/* Bio Paragraph */}
                    <p className="text-sm text-brand-charcoal/80 font-sans leading-relaxed mb-6">
                      {teacher.bio}
                    </p>
                  </div>

                  {/* Quote element at the base of the card */}
                  {teacher.quote && (
                    <div className="border-t border-brand-sand/40 pt-5 mt-auto">
                      <p className="italic text-xs text-brand-forest font-serif leading-relaxed font-semibold relative pl-4">
                        <span className="absolute left-0 top-0 text-brand-gold font-serif text-xl leading-none">“</span>
                        {teacher.quote}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Small Trust Badge under grid */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-brand-sand/40 px-6 py-3 rounded-2xl border border-brand-sand/50">
            <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-forest">
              <Heart className="w-4 h-4 text-brand-terracotta fill-brand-terracotta animate-pulse" />
              100% CPR & First Aid Certified
            </span>
            <span className="hidden sm:inline-block text-brand-gold">•</span>
            <span className="text-xs text-brand-charcoal/80 font-medium">
              Fingerprint-cleared, background-vetted, and community-approved.
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
