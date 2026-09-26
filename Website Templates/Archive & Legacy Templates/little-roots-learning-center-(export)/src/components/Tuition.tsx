import { CheckCircle2, Info, ArrowUpRight } from 'lucide-react';
import { programsData } from '../data';

interface TuitionProps {
  onOpenWaitlistModal: (programId?: string) => void;
}

export default function Tuition({ onOpenWaitlistModal }: TuitionProps) {
  const inclusions = [
    'Organic development-rich meals & snacks prepared daily by our in-house chef',
    'Premium plant-based diapers, wipes, and organic skincare products',
    'Bilingual immersion sessions (English, Spanish, and introductory Swahili)',
    'Atelier art supplies, local sensory clay, and community garden tools',
    'Real-time daily reports, developmental tracking, and high-fidelity video updates',
    'Pre-eminent community networking and parenting masterclasses monthly'
  ];

  return (
    <section id="tuition" className="py-20 md:py-28 bg-brand-cream relative">
      {/* Decorative Gold Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-brand-gold/10 rounded-bl-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20">
          <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
            Enrollment & Investment
          </span>
          <h2 className="font-serif text-3xl md:text-5xl font-black text-brand-forest tracking-tight mb-4">
            Investing in Future Giants
          </h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto mb-6 rounded-full" />
          <p className="text-base text-brand-charcoal/80 max-w-2xl mx-auto">
            Our tuition covers highly personalized educational guidance, supreme organic resources, and absolute safety infrastructure. We grow confidence, legacy, and academic strength.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
          {programsData.map((prog) => {
            const isWaitlist = prog.id === 'pre-k-academy';
            
            return (
              <div
                key={prog.id}
                className={`border rounded-[32px] p-8 flex flex-col justify-between transition-all duration-300 relative h-full bg-white shadow-sm hover:shadow-lg ${
                  isWaitlist
                    ? 'border-brand-gold ring-1 ring-brand-gold/50'
                    : 'border-brand-sand'
                }`}
              >
                {/* Popular highlight for Pre-K or highest demand */}
                {isWaitlist && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-brand-gold text-brand-forest text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-sm">
                    High Demand Cohort
                  </span>
                )}

                <div>
                  {/* Title and Age */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-serif text-2xl font-bold text-brand-forest">
                        {prog.name}
                      </h3>
                      <p className="text-[11px] font-bold text-brand-terracotta tracking-wider uppercase mt-1">
                        {prog.ageRange}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-brand-charcoal/70 mb-6 leading-relaxed">
                    Personalized ratio of {prog.ratio.split(' ')[0]}. {prog.hours} daily instruction.
                  </p>

                  {/* Pricing metrics */}
                  <div className="mb-6 pt-6 border-t border-brand-sand">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-serif font-black text-brand-forest">
                        ${prog.monthlyTuition}
                      </span>
                      <span className="text-sm font-semibold text-brand-charcoal/60">/ Month</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-brand-charcoal/80 mt-3 pt-3 border-t border-brand-sand/50">
                      <span>Annual Supply & Atelier Fee:</span>
                      <span className="font-bold">${prog.annualSupplyFee}</span>
                    </div>
                  </div>

                  {/* Highlights checklist mini */}
                  <div className="mb-8 workspace-curriculum-list">
                    <p className="text-[10px] font-bold tracking-wider text-brand-forest uppercase mb-3">
                      Core focus:
                    </p>
                    <ul className="space-y-2.5">
                      {prog.curriculumHighlights.slice(0, 3).map((hl, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-brand-charcoal/85">
                          <span className="text-emerald-600 font-bold shrink-0">✓</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Primary CTA for waitlist */}
                <div>
                  <button
                    type="button"
                    onClick={() => onOpenWaitlistModal(prog.id)}
                    className={`w-full text-xs font-bold tracking-widest uppercase py-3.5 px-6 rounded-full transition transform active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer ${
                      isWaitlist
                        ? 'bg-brand-gold text-brand-forest hover:bg-brand-gold/90'
                        : 'bg-brand-forest text-brand-cream hover:bg-brand-moss'
                    }`}
                  >
                    {prog.availability === 'Waitlist Active' ? 'Join Waitlist' : 'Apply to Enroll'}
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-center text-brand-charcoal/50 mt-3 font-sans">
                    Cohort starts rolling: Autumn & Spring schedules.
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Double-Column Inclusions and Sibling Discount Strip */}
        <div className="bg-brand-sand/50 rounded-[32px] p-8 md:p-12 border border-brand-sand border-dashed">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column Description */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-brand-terracotta border border-brand-terracotta/20 bg-brand-terracotta/5 px-3.5 py-1.5 rounded-full w-fit mb-4">
                <Info className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold tracking-wider uppercase font-sans">
                  The Premium Difference
                </span>
              </div>
              
              <h3 className="font-serif text-2xl md:text-3xl font-black text-brand-forest mb-4">
                What’s Integrated with All Enrolments
              </h3>
              
              <p className="text-xs md:text-sm text-brand-charcoal/80 leading-relaxed font-sans mb-6">
                Unlike traditional preschools, we offer an all-inclusive pricing structure. There are no surprise fees for meals, nappies, supplies, or special field trips.
              </p>

              {/* Sibling discounts details */}
              <div className="bg-brand-cream p-5 rounded-2xl border border-brand-sand">
                <h4 className="font-serif text-sm font-black text-brand-forest mb-1.5 uppercase tracking-wide">
                  ★ Sibling & Entrepeneur Discount
                </h4>
                <p className="text-xs text-brand-charcoal/80 leading-relaxed font-semibold">
                  We offer a <span className="text-brand-terracotta">10% tuition discount</span> for the second enrolled sibling, and customized flexible scheduling structures for Black-owned business families.
                </p>
              </div>
            </div>

            {/* Right Column Checklist of Inclusions */}
            <div className="lg:col-span-7">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {inclusions.map((inc, i) => (
                  <li
                    key={i}
                    className="bg-white p-4 rounded-xl border border-brand-sand/70 flex gap-3 text-xs text-brand-charcoal/90 items-start shadow-sm"
                  >
                    <CheckCircle2 className="w-4.5 h-4.5 text-brand-gold shrink-0 mt-0.5" />
                    <span className="leading-relaxed font-medium">{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
