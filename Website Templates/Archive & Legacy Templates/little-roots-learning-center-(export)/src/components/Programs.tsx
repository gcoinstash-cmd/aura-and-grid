import { useState } from 'react';
import { programsData } from '../data';
import { Program } from '../types';
import { Clock, Users, ArrowRight, Check, CheckCircle2, X } from 'lucide-react';

interface ProgramsProps {
  onOpenWaitlistModal: (programId?: string) => void;
}

export default function Programs({ onOpenWaitlistModal }: ProgramsProps) {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  const imagesByProgram: Record<string, string> = {
    'infant-care': 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop',
    'toddler-discovery': 'https://images.unsplash.com/photo-1567473030492-533b30c5494c?w=800&auto=format&fit=crop',
    'pre-k-academy': 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&auto=format&fit=crop'
  };

  return (
    <section id="programs" className="py-20 md:py-28 bg-brand-cream relative">
      {/* Background Graphic Accents */}
      <div className="absolute top-1/2 left-0 w-32 h-64 bg-brand-sand/40 rounded-r-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
            Academic Pathways
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-brand-forest tracking-tight mb-4">
            Curated For Greatness & Brilliance
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6 rounded-full" />
          <p className="text-base text-brand-charcoal/80">
            Each program pathway is structured around the unique developmental leap and cognitive wonder of early childhood. Guided by certified, expert educators and rooted in cultural confidence.
          </p>
        </div>

        {/* 3 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programsData.map((program) => {
            const isFull = program.availability === 'Waitlist Active';
            const isLimited = program.availability === 'Limited Openings';
            
            return (
              <div
                key={program.id}
                className="bg-white border border-brand-sand rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full natural-tones-program-card"
              >
                {/* Image & Badge overlay */}
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-sand/10">
                  <img
                    src={imagesByProgram[program.id]}
                    alt={program.name}
                    className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
                    loading="eager"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop";
                    }}
                  />
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-3.5 py-1.5 rounded-full text-white ${
                      isFull 
                        ? 'bg-brand-charcoal' 
                        : isLimited
                        ? 'bg-brand-terracotta'
                        : 'bg-brand-forest'
                    }`}>
                      {program.availability}
                    </span>
                  </div>

                  {/* Ratio badge */}
                  <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-brand-sand/30 flex items-center gap-1.5 shadow-sm text-brand-forest">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {program.ratio.split(' ')[0]} Ratio
                    </span>
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Age and Program Name */}
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-brand-terracotta uppercase tracking-wider font-sans">
                        {program.ageRange}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl font-bold text-brand-forest mb-4 group-hover:text-brand-terracotta transition-colors duration-200">
                      {program.name}
                    </h3>

                    <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans mb-6">
                      {program.description}
                    </p>
                  </div>

                  {/* Actions & Highlights Sneak Peak */}
                  <div>
                    {/* Key feature bullets */}
                    <div className="border-t border-brand-sand/60 pt-5 mb-6">
                      <p className="text-[10px] font-bold tracking-wider text-brand-forest uppercase mb-3">
                        Curriculum Highlights:
                      </p>
                      <ul className="space-y-2">
                        {program.curriculumHighlights.slice(0, 2).map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs text-brand-charcoal/85">
                            <span className="text-brand-gold font-bold shrink-0 mt-0.5">✓</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Interactive 'Learn More' trigger */}
                    <div className="flex items-center justify-between mt-4">
                      <button
                        type="button"
                        onClick={() => setSelectedProgram(program)}
                        className="inline-flex items-center gap-1.5 text-xs font-black tracking-widest text-brand-terracotta uppercase group-hover:text-brand-forest transition duration-200"
                      >
                        Learn More <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onOpenWaitlistModal(program.id)}
                        className="bg-brand-sand/50 text-brand-forest text-[11px] font-bold tracking-wider px-4 py-2 rounded-full uppercase hover:bg-brand-forest hover:text-white transition duration-300"
                      >
                        Enroll
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Program Deep-Dive Modal Overlay */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-md"
            onClick={() => setSelectedProgram(null)}
          />

          {/* Modal Content */}
          <div className="relative bg-brand-cream ring-1 ring-brand-sand max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl z-10 border border-brand-sand">
            {/* Header background & Close button */}
            <div className="relative h-48 md:h-60 overflow-hidden bg-brand-sand/10">
              <img
                src={imagesByProgram[selectedProgram.id]}
                alt={selectedProgram.name}
                className="w-full h-full object-cover"
                loading="eager"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800&auto=format&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-forest via-brand-forest/40 to-black/20" />
              <button
                type="button"
                onClick={() => setSelectedProgram(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-brand-forest hover:bg-brand-forest hover:text-white transition flex items-center justify-center shadow"
                aria-label="Close details"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-[#FAF7F2]/90 uppercase px-2.5 py-1 bg-brand-terracotta rounded-md">
                  {selectedProgram.ageRange}
                </span>
                <h3 className="font-serif text-3xl md:text-4xl font-black mt-2 leading-none">
                  {selectedProgram.name}
                </h3>
              </div>
            </div>

            {/* Core Specs */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-brand-sand mb-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-terracotta uppercase block">
                    Daily Schedule
                  </span>
                  <span className="text-sm font-semibold text-brand-forest flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4 text-brand-gold" />
                    {selectedProgram.hours}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-terracotta uppercase block">
                    Teacher-Child Ratio
                  </span>
                  <span className="text-sm font-semibold text-brand-forest flex items-center gap-1.5 mt-1">
                    <Users className="w-4 h-4 text-brand-gold" />
                    {selectedProgram.ratio}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-brand-terracotta uppercase block">
                    Monthly Tuition
                  </span>
                  <p className="text-sm font-bold text-brand-forest mt-1">
                    ${selectedProgram.monthlyTuition} / mo
                  </p>
                </div>
              </div>

              {/* Description \& Context */}
              <div className="mb-8">
                <h4 className="font-serif text-xl font-bold text-brand-forest mb-2">
                  Developmental Intent
                </h4>
                <p className="text-sm text-brand-charcoal/80 leading-relaxed font-sans">
                  {selectedProgram.extendedDescription}
                </p>
              </div>

              {/* Dynamic highlights and Rhythm columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h5 className="text-xs font-bold tracking-widest text-brand-terracotta uppercase mb-4 pb-1 border-b border-brand-sand">
                    What They Will Master
                  </h5>
                  <ul className="space-y-3">
                    {selectedProgram.curriculumHighlights.map((hl, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-brand-charcoal/90 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="text-xs font-bold tracking-widest text-brand-terracotta uppercase mb-4 pb-1 border-b border-brand-sand">
                    Sample Daily Rhythm
                  </h5>
                  <ul className="space-y-2">
                    {selectedProgram.dailyRhythm.map((step, i) => (
                      <li key={i} className="flex gap-2 text-xs text-brand-charcoal/90 leading-relaxed pb-2 border-b border-brand-sand/40 last:border-0 last:pb-0">
                        <span className="text-brand-gold font-bold font-mono">{(i+1).toString().padStart(2, '0')}</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-6 border-t border-brand-sand flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div className="text-xs text-brand-charcoal/60 max-w-xs">
                  * Enrollment requires custom family interview and tour step before formal cohort assignment.
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedProgram(null)}
                    className="border border-brand-sand hover:bg-brand-sand/50 text-brand-charcoal hover:text-brand-forest text-xs font-bold tracking-widest py-3 px-6 rounded-full uppercase transition duration-200 text-center"
                  >
                    Close Window
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProgram(null);
                      onOpenWaitlistModal(selectedProgram.id);
                    }}
                    className="bg-brand-forest hover:bg-brand-moss text-brand-cream text-xs font-bold tracking-widest py-3 px-6 rounded-full uppercase transition duration-300 text-center shadow"
                  >
                    Apply Now
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </section>
  );
}
