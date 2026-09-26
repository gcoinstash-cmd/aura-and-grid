import { useState, FormEvent } from 'react';
import { X, CheckCircle, Info, Calendar, Sparkles } from 'lucide-react';
import { programsData } from '../data';

interface WaitlistModalProps {
  isOpen: boolean;
  programId?: string;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, programId = 'infant-care', onClose }: WaitlistModalProps) {
  const [formData, setFormData] = useState({
    parentName: '',
    parentEmail: '',
    parentPhone: '',
    childName: '',
    childAge: '',
    cohort: 'Autumn 2026',
    programId: programId,
    entrepreneurAffiliation: 'no',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Sync program ID state if updated via parent prop injection
  const handleProgramChange = (id: string) => {
    setFormData(prev => ({ ...prev, programId: id }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const selectedProgramDetails = programsData.find(p => p.id === formData.programId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-charcoal/70 backdrop-blur-md transition-all duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-brand-cream ring-1 ring-brand-sand/50 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[32px] shadow-2xl z-10 p-6 md:p-8 border border-brand-sand">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-brand-forest hover:bg-brand-forest hover:text-white transition flex items-center justify-center shadow"
          aria-label="Close waitlist modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>

            <h3 className="font-serif text-2xl md:text-3xl font-black text-brand-forest mb-3">
              Elite Cohort Spot Queue!
            </h3>

            <p className="text-xs md:text-sm text-brand-charcoal/80 leading-relaxed font-sans mb-6">
              Dear <span className="font-semibold text-brand-forest">{formData.parentName}</span>, your family waitlist request for <span className="font-semibold text-brand-terracotta">{formData.childName || 'your young scholar'}</span> is verified.
            </p>

            {/* Smart Cohort Queue estimation details */}
            <div className="bg-brand-sand/50 p-5 rounded-2xl text-left border border-brand-sand/70 space-y-3 mb-8">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-brand-sand/50">
                <span className="font-medium text-brand-charcoal/70">Waitlist Target Cohort:</span>
                <span className="font-bold text-brand-forest uppercase tracking-wider text-[10px]">{formData.cohort}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-brand-sand/50">
                <span className="font-medium text-brand-charcoal/70">Program Requested:</span>
                <span className="font-bold text-brand-forest uppercase tracking-wider text-[10px]">{selectedProgramDetails?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-brand-sand/50">
                <span className="font-medium text-brand-charcoal/70">Priority Pool Status:</span>
                <span className="font-extrabold text-brand-terracotta uppercase tracking-[1px] text-[10px]">
                  {formData.entrepreneurAffiliation === 'yes' ? '★ Entrepreneur Pool' : 'Standard Pool'}
                </span>
              </div>
              <div className="pt-1 select-none">
                <p className="text-[10px] text-center font-bold text-emerald-700 bg-emerald-50 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest leading-none">
                  ✔ Placement Probability Est: High (A+)
                </p>
              </div>
            </div>

            <p className="text-xs text-brand-charcoal/60 leading-relaxed mb-6">
              Our Admissions Director will follow up in 24 hours to schedule your mandatory admissions family interview step and custom walkthrough.
            </p>

            <button
              type="button"
              onClick={onClose}
              className="w-full bg-brand-forest hover:bg-brand-moss text-brand-cream font-bold text-xs tracking-widest py-3.5 rounded-full uppercase transition duration-200"
            >
              Back to Overview
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1 bg-brand-sand px-2.5 py-1 rounded-full text-brand-forest font-bold text-[9px] uppercase tracking-widest mb-2.5 border border-brand-sand/80">
                <Sparkles className="w-3 h-3 text-brand-gold fill-brand-gold" /> Future Giants Entrance
              </div>
              <h3 className="font-serif text-2xl font-black text-brand-forest">
                Waitlist Application
              </h3>
              <p className="text-xs text-brand-charcoal/70 mt-1">
                Queue your spot in our upcoming developmental pools.
              </p>
            </div>

            {/* Program selection */}
            <div>
              <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                Target Pathway *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {programsData.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProgramChange(p.id)}
                    className={`px-2 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider border transition text-center col-span-1 cursor-pointer ${
                      formData.programId === p.id
                        ? 'bg-brand-forest text-brand-cream border-brand-forest'
                        : 'bg-white text-brand-charcoal border-brand-sand hover:bg-brand-sand/30'
                    }`}
                  >
                    {p.name.replace(' Program', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Parent contact information */}
            <div className="space-y-4 pt-2 border-t border-brand-sand/60">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1">
                    Parent Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Omari Sterling"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1">
                    Parent Primary Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="parent@icloud.com"
                    value={formData.parentEmail}
                    onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(213) 555-0182"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1">
                    Child Name & Age *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Miles Sterling, Age 2"
                    value={formData.childName}
                    onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                    className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                  />
                </div>
              </div>
            </div>

            {/* Target Cohort & Sibling Affiliations */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-brand-sand/60">
              <div>
                <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                  Target Cohort *
                </label>
                <select
                  required
                  value={formData.cohort}
                  onChange={(e) => setFormData({ ...formData, cohort: e.target.value })}
                  className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                >
                  <option value="Summer 2026">Summer 2026 Opening</option>
                  <option value="Autumn 2026">Autumn 2026 Opening</option>
                  <option value="Spring 2027">Spring 2027 Opening</option>
                </select>
              </div>
              
              <div>
                <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5 flex items-center gap-1">
                  LA Business Owner Pool?
                </label>
                <select
                  value={formData.entrepreneurAffiliation}
                  onChange={(e) => setFormData({ ...formData, entrepreneurAffiliation: e.target.value })}
                  className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2.5 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                >
                  <option value="no">No, standard admissions</option>
                  <option value="yes">Yes, Entrepreneur/Scholar Pool</option>
                </select>
              </div>
            </div>

            {/* Special considerations notes area */}
            <div>
              <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                Special requirements, dietary options, developmental outcomes
              </label>
              <textarea
                rows={2}
                placeholder="We prioritize early phonics, cultural literacy, and eco-awareness."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full bg-white border border-brand-sand rounded-xl px-3 py-2 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition resize-none"
              />
            </div>

            {/* Fee information notice info box */}
            <div className="bg-brand-sand p-3.5 rounded-xl flex gap-2.5 items-start text-[10px] text-brand-charcoal/80 leading-relaxed border border-brand-sand/60">
              <Info className="w-4.5 h-4.5 text-brand-terracotta shrink-0" />
              <span>
                * Waitlist placement is complimentary. Submitting this form secures your placement queue position without immediate service obligation. Sibling prioritizing terms apply.
              </span>
            </div>

            {/* Submit application CTA */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 border border-brand-sand hover:bg-brand-sand/40 text-brand-charcoal text-xs font-bold tracking-widest py-3.5 rounded-full uppercase transition text-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-2/3 bg-brand-forest hover:bg-brand-moss text-brand-cream text-xs font-bold tracking-widest py-3.5 rounded-full uppercase transition text-center disabled:opacity-75"
              >
                {isSubmitting ? 'Processing Application...' : 'Apply to Waitlist'}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
