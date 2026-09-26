import { useState, FormEvent } from 'react';
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2, RefreshCw } from 'lucide-react';
import { TourBooking } from '../types';

export default function Contact() {
  const [formData, setFormData] = useState<TourBooking>({
    parentName: '',
    childName: '',
    childAge: '',
    parentEmail: '',
    parentPhone: '',
    selectedDate: '',
    selectedTime: '',
    selectedProgramId: 'infant-care',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const programs = [
    { id: 'infant-care', name: 'Infant Care (6w - 18m)' },
    { id: 'toddler-discovery', name: 'Toddler Discovery (18m - 3y)' },
    { id: 'pre-k-academy', name: 'Pre-K Academy (3y - 5y)' }
  ];

  const timeslots = [
    '09:00 AM — Morning Circle & Work',
    '10:30 AM — Garden & Snack',
    '03:30 PM — Cooperative Play'
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate premium booking
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1200);
  };

  const handleReset = () => {
    setFormData({
      parentName: '',
      childName: '',
      childAge: '',
      parentEmail: '',
      parentPhone: '',
      selectedDate: '',
      selectedTime: '',
      selectedProgramId: 'infant-care',
      notes: ''
    });
    setIsSuccess(false);
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-brand-sand/10 border-t border-brand-sand relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Side: Editorial Address, Hours, Map Mock (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold tracking-widest text-brand-terracotta uppercase block mb-3">
                Visit Us
              </span>
              <h2 className="font-serif text-3xl md:text-5xl font-black text-brand-forest tracking-tight mb-6">
                Connect With Our Village
              </h2>
              <div className="w-16 h-1 bg-brand-gold mb-8 rounded-full" />
              <p className="text-sm text-brand-charcoal/85 leading-relaxed font-sans mb-8">
                We are conveniently nestled in the beloved cultural heartbeat of South Los Angeles. Tours are scheduled strictly by appointment to preserve classroom focus and children’s secure routines.
              </p>

              {/* Contact details list */}
              <div className="space-y-6">
                
                {/* Map location detail */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-black text-brand-forest uppercase tracking-wider">
                      Location
                    </h4>
                    <p className="text-xs text-brand-charcoal/80 mt-1 leading-relaxed">
                      3415 W. 43rd Street, Suite 100 <br />
                      Los Angeles, CA 90008 (Near historic Leimert Park Circle)
                    </p>
                  </div>
                </div>

                {/* Hours details */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-black text-brand-forest uppercase tracking-wider">
                      Operating Hours
                    </h4>
                    <p className="text-xs text-brand-charcoal/80 mt-1 leading-relaxed">
                      Monday — Friday: 07:30 AM — 05:30 PM <br />
                      Weekend Cultural Workshops: Monthly (Schedule Emailed)
                    </p>
                  </div>
                </div>

                {/* Phone & Email details */}
                <div className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-brand-forest/10 flex items-center justify-center text-brand-forest shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm font-black text-brand-forest uppercase tracking-wider">
                      Contact Options
                    </h4>
                    <p className="text-xs text-brand-charcoal/80 mt-1 leading-relaxed">
                      Phone: <a href="tel:3235550190" className="hover:text-brand-terracotta underline font-semibold">(323) 555-0190</a> <br />
                      Email: <a href="mailto:hello@littlerootsla.com" className="hover:text-brand-terracotta underline font-semibold">hello@littlerootsla.com</a>
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated Map Block with high-end designer visual */}
            <div className="mt-12 rounded-2xl border border-brand-sand overflow-hidden aspect-video bg-brand-sand relative flex flex-col justify-end p-5 shadow-inner">
              {/* Artistic vector map stylings */}
              <div className="absolute inset-0 bg-[#FAF7F2] opacity-80 pointer-events-none" />
              {/* Conceptual map graphic path */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-brand-sand/60 -rotate-12" />
              <div className="absolute top-0 bottom-0 left-1/3 w-6 bg-brand-sand/60 rotate-12" />
              <div className="absolute top-1/4 left-0 right-0 h-2 bg-brand-sand/60 rotate-45" />

              {/* Pin Accent */}
              <div className="absolute top-[45%] left-[45%] flex flex-col items-center">
                <div className="w-3 h-3 bg-brand-terracotta rounded-full animate-ping absolute" />
                <div className="w-4 h-4 rounded-full bg-brand-forest border-2 border-brand-gold flex items-center justify-center text-brand-gold shadow relative z-10">
                  ★
                </div>
                <div className="bg-brand-forest text-brand-cream text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 rounded shadow-md mt-1 border border-brand-gold/20 font-serif">
                  LITTLE ROOTS
                </div>
              </div>

              {/* Leimert Park badge */}
              <div className="relative z-10 bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl border border-brand-sand flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-brand-forest uppercase tracking-widest font-sans">
                  PROUD SOUTH LA SOIL
                </span>
              </div>
            </div>
          </div>

          {/* Right Side: Interactive "Book a Tour" Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-[32px] border border-brand-sand shadow-lg relative">
            
            {isSuccess ? (
              <div className="py-8 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <h3 className="font-serif text-2xl md:text-3xl font-black text-brand-forest mb-3">
                  Your Tour Request Received!
                </h3>
                
                <p className="text-xs md:text-sm text-brand-charcoal/80 leading-relaxed max-w-md mx-auto mb-8 font-sans">
                  We are absolutely delighted to welcome you and <span className="font-semibold text-brand-terracotta">{formData.childName || 'your young scholar'}</span> to our Leimert Park sanctuary! A Lead Admissions Guide will email and call you within 24 hours to finalize your scheduled tour on <span className="font-semibold text-brand-forest">{formData.selectedDate}</span> at <span className="font-semibold text-brand-forest">{formData.selectedTime || 'your preferred time'}</span>.
                </p>

                {/* What to expect card */}
                <div className="bg-brand-sand/30 p-6 rounded-2xl text-left border border-brand-sand/60 max-w-md mb-8">
                  <h4 className="font-serif text-xs font-black text-brand-forest uppercase tracking-widest mb-3 text-center">
                    👑 What to Expect During Your Visit
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex gap-2.5 text-xs text-brand-charcoal/90 items-start">
                      <span className="text-brand-gold font-serif">✦</span>
                      <span><strong>A 45-minute interactive walkthrough</strong> guided by our Director to explore environments and philosophy.</span>
                    </li>
                    <li className="flex gap-2.5 text-xs text-brand-charcoal/90 items-start">
                      <span className="text-brand-gold font-serif">✦</span>
                      <span><strong>Observing active classrooms</strong> without interrupting sensory tasks.</span>
                    </li>
                    <li className="flex gap-2.5 text-xs text-brand-charcoal/90 items-start">
                      <span className="text-brand-gold font-serif">✦</span>
                      <span><strong>Private review</strong> of individual schedules, curriculum options, metrics, and custom waitlist procedures.</span>
                    </li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C4622D] hover:text-[#1B3A2D] transition"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Book Another Tour
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                  <h3 className="font-serif text-2xl font-black text-brand-forest mb-1">
                    Schedule a Private Tour
                  </h3>
                  <p className="text-xs text-brand-charcoal/70">
                    Complete this brief request and we will coordinate an exclusive visitation slot.
                  </p>
                </div>

                {/* Two Column details fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Parent Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nia Sterling"
                      value={formData.parentName}
                      onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Child Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Zola Sterling"
                      value={formData.childName}
                      onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                </div>

                {/* Second row: Email and Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="parent@gmail.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(323) 555-0190"
                      value={formData.parentPhone}
                      onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                </div>

                {/* Third row: Program and Child age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Program of Interest
                    </label>
                    <select
                      value={formData.selectedProgramId}
                      onChange={(e) => setFormData({ ...formData, selectedProgramId: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    >
                      {programs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Child’s Age / Estimated Due Date
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 18 months, or Due Dec 2026"
                      value={formData.childAge}
                      onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                </div>

                {/* Fourth row: Select Tour Date and Preferred Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.selectedDate}
                      onChange={(e) => setFormData({ ...formData, selectedDate: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                      Target Time Slot *
                    </label>
                    <select
                      required
                      value={formData.selectedTime}
                      onChange={(e) => setFormData({ ...formData, selectedTime: e.target.value })}
                      className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition"
                    >
                      <option value="">-- Choose Slot --</option>
                      {timeslots.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Special family notes */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-brand-forest uppercase block mb-1.5">
                    Special notes (Allergies, developmental milestones, family values)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="We are focused on early potty learning and bilingual literacy..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-brand-cream/80 border border-brand-sand rounded-xl px-4 py-3 text-brand-charcoal text-xs font-sans focus:outline-none focus:border-brand-terracotta transition resize-none"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-forest hover:bg-brand-moss text-brand-cream font-bold text-xs tracking-widest py-4 rounded-xl uppercase transition disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Send className="w-4 h-4 animate-bounce" /> Processing Booking...
                    </>
                  ) : (
                    <>
                      Book a Tour <Send className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="text-center text-[10px] text-brand-charcoal/50">
                  * All submission data is stored securely in agreement with Little Roots LA privacy guidelines.
                </div>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
