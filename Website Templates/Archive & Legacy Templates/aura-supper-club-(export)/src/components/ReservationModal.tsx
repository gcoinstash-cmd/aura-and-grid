import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Flame, Printer, CreditCard, Ticket, Clock, Grid } from 'lucide-react';
import { SupperClubEvent, ReservationSubmission } from '../types';

interface ReservationModalProps {
  event: SupperClubEvent | null;
  onClose: () => void;
  onSuccess: (reservation: ReservationSubmission) => void;
}

export default function ReservationModal({ event, onClose, onSuccess }: ReservationModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guestCount: 2,
    seatingPreference: 'Courtyard Firepit' as const,
    dietaryNotes: '',
    spiciness: 'Chef Signature Warmth' as const,
    curationAddon: false,
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketVoucher, setTicketVoucher] = useState<ReservationSubmission | null>(null);

  if (!event) return null;

  const handleGuestCountChange = (amount: number) => {
    const newCount = Math.max(1, Math.min(8, formData.guestCount + amount));
    if (newCount <= event.ticketsLeft) {
      setFormData((prev) => ({ ...prev, guestCount: newCount }));
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateSubtotal = () => formData.guestCount * event.price;
  const calculateCurationCost = () => (formData.curationAddon ? 35 : 0);
  const calculateTax = () => (calculateSubtotal() + calculateCurationCost()) * 0.095; // 9.5% LA tax
  const calculateTotal = () => calculateSubtotal() + calculateCurationCost() + calculateTax();

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Kindly fill all primary identity markers.');
      return;
    }

    setIsSubmitting(true);

    // Simulate luxury API handshake
    setTimeout(() => {
      const generatedId = `AURA-TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      const submission: ReservationSubmission = {
        id: generatedId,
        eventId: event.id,
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        guestCount: formData.guestCount,
        seatingPreference: formData.seatingPreference,
        dietaryNotes: formData.dietaryNotes,
        customSpiceTier: formData.spiciness,
        curationAddon: formData.curationAddon,
        createdTime: new Date().toISOString(),
      };

      setTicketVoucher(submission);
      setIsSubmitting(false);
      onSuccess(submission);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true" id="reservation-drawer-overlay">
        
        {/* Dark blurred background cover */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-obsidian/85 backdrop-blur-md"
        />

        {/* Modal Outer Container */}
        <div className="flex min-h-screen items-center justify-center p-4 sm:p-6 lg:p-8 relative">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`w-full max-w-2xl bg-[#0F0F10] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative ${
              ticketVoucher ? 'sm:p-8 p-4' : ''
            }`}
          >
            {/* Close trigger button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full cursor-pointer bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-400 hover:text-white flex items-center justify-center transition-all z-20"
              aria-label="Close form"
            >
              <X className="w-4 h-4" />
            </button>

            {!ticketVoucher ? (
              /* ACTIVE FORM DRAWER STATE */
              <form onSubmit={handleSubmitBooking} className="divide-y divide-white/5">
                
                {/* Header row */}
                <div className="p-6">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Flame className="w-4 h-4 text-terracotta" />
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-gold font-semibold">Admission Request Panel</span>
                  </div>
                  <h3 className="font-serif text-2xl text-white font-medium leading-tight">
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mt-1">
                    {event.date} • {event.time}
                  </p>
                </div>

                {/* Form main blocks */}
                <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                  
                  {/* Step 1: Attendee Counters */}
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">1. Total Board Count</label>
                    <div className="flex items-center justify-between p-4 rounded-xl bg-stone-950/60 border border-white/5">
                      <div>
                        <div className="text-sm font-medium text-white">{formData.guestCount} {formData.guestCount === 1 ? 'Guest Chair' : 'Guest Chairs'}</div>
                        <div className="text-[10px] text-stone-500">Fully inclusive multi-course menu pairing</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(-1)}
                          className="w-8 h-8 rounded bg-stone-900 border border-white/10 text-stone-300 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                        >
                          -
                        </button>
                        <span className="font-mono text-sm text-gold font-bold">{formData.guestCount}</span>
                        <button
                          type="button"
                          onClick={() => handleGuestCountChange(1)}
                          className="w-8 h-8 rounded bg-stone-900 border border-white/10 text-stone-300 hover:text-white flex items-center justify-center text-lg cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Seating Placements */}
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">2. Seating Preferences</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        'Courtyard Firepit',
                        'Vinyl Library Arcade',
                        'Garden Terrace',
                        'Chef Communal Counter',
                      ] as const).map((pref) => {
                        const isSelected = formData.seatingPreference === pref;
                        return (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleInputChange('seatingPreference', pref)}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-all flex flex-col justify-between cursor-pointer ${
                              isSelected
                                ? 'bg-stone-950 border-gold/70 text-gold'
                                : 'bg-stone-950/30 border-white/5 text-stone-400 hover:text-white'
                            }`}
                          >
                            <span className="font-medium">{pref}</span>
                            <span className="text-[9px] text-stone-500 font-mono mt-0.5">
                              {pref === 'Courtyard Firepit' && 'Under open starlight'}
                              {pref === 'Vinyl Library Arcade' && 'Near tube pre-amps'}
                              {pref === 'Garden Terrace' && 'Surrounded by local flora'}
                              {pref === 'Chef Communal Counter' && 'Inside prep interaction'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 3: Cultural Culinary Customization */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Spiciness Level */}
                    <div className="space-y-2">
                      <label className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">3. Board Spice Preference</label>
                      <div className="flex flex-col gap-1.5">
                        {([
                          'Traditional Southern Subtle',
                          'Chef Signature Warmth',
                          'South LA Heat',
                        ] as const).map((spice) => {
                          const isSelected = formData.spiciness === spice;
                          return (
                            <button
                              key={spice}
                              type="button"
                              onClick={() => handleInputChange('spiciness', spice)}
                              className={`text-left px-3 py-2 rounded border text-xs flex items-center gap-2 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-stone-950 border-terracotta text-terracotta'
                                  : 'bg-stone-950/35 border-white/5 text-stone-400'
                              }`}
                            >
                              <Flame className={`w-3.5 h-3.5 ${isSelected ? 'text-terracotta fill-terracotta' : 'text-stone-500'}`} />
                              <span className="font-mono text-[10px]">{spice}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dietary Restrictions */}
                    <div className="space-y-2">
                      <label htmlFor="dietary_notes" className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">4. Dietary Markers</label>
                      <textarea
                        id="dietary_notes"
                        value={formData.dietaryNotes}
                        onChange={(e) => handleInputChange('dietaryNotes', e.target.value)}
                        placeholder="e.g. Vegetarian only, shellfish allergies, peanut concerns..."
                        className="w-full h-[105px] bg-stone-950 border border-white/5 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600 resize-none"
                      />
                    </div>
                  </div>

                  {/* Step 4: Add-on Vinyl Package */}
                  <div className="p-4 rounded-xl bg-stone-950/40 border border-white/5 flex items-center justify-between">
                    <div className="max-w-[75%]">
                      <span className="font-mono text-[9px] text-gold uppercase tracking-wider block mb-0.5">Heritage Souvenir Soufflé</span>
                      <h4 className="text-xs font-semibold text-white">Curated Vinyl Sync Plate (+$35)</h4>
                      <p className="text-[10px] text-stone-400 font-sans leading-relaxed">
                        A pristine physical vinyl LP record custom selected by our selectors matching your dinner atmosphere. Gift-wrapped in wax-sealed brown kraft.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('curationAddon', !formData.curationAddon)}
                      className={`w-6 h-6 rounded flex items-center justify-center border transition-all cursor-pointer ${
                        formData.curationAddon
                          ? 'bg-gold border-gold text-obsidian'
                          : 'bg-stone-950 border-white/20 text-transparent'
                      }`}
                      aria-label="Add-on Vinyl Sync Album curation to reservation"
                    >
                      <Check className="w-4 h-4 stroke-[3px]" />
                    </button>
                  </div>

                  {/* Step 5: Personal Guest Details */}
                  <div className="space-y-3">
                    <label className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">5. Primary Identity Markers</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          placeholder="Your Full Name"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600"
                        />
                      </div>
                      <div>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          placeholder="Email Address"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600"
                        />
                      </div>
                      <div>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="Phone Number"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Step 6: Luxury Card Vaulting (Simulated checkout) */}
                  <div className="space-y-3 border-t border-white/5 pt-4">
                    <label className="font-mono text-[10px] text-stone-400 uppercase tracking-wider block">6. Premium Secured Verification</label>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-1.5 relative">
                        <CreditCard className="absolute left-3 top-3 w-4 h-4 text-stone-500" />
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                          placeholder="1111 2222 3333 4444"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={formData.cardExpiry}
                          onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                          placeholder="MM/YY"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600 text-center"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          required
                          maxLength={3}
                          value={formData.cardCvc}
                          onChange={(e) => handleInputChange('cardCvc', e.target.value)}
                          placeholder="CVC"
                          className="w-full bg-stone-950 border border-white/5 rounded-lg px-3 py-2.5 text-xs text-white focus:outline-none focus:border-gold placeholder-stone-600 text-center"
                        />
                      </div>
                    </div>
                    <span className="text-[10px] text-stone-500 font-sans block">
                      Aura operates on a fully-inclusive ticketing format. Cancellation refunds granted up to 72 hours prior to seating.
                    </span>
                  </div>

                </div>

                {/* Footer calculation block & submission */}
                <div className="p-6 bg-stone-950/85 flex flex-col sm:flex-row items-center justify-between gap-6">
                  
                  {/* Detailed ledger */}
                  <div className="w-full sm:w-auto text-left font-mono text-[10px] text-stone-400 space-y-1">
                    <div className="flex justify-between gap-4">
                      <span>Course Pack ({formData.guestCount}):</span>
                      <span className="text-white">${calculateSubtotal()}</span>
                    </div>
                    {formData.curationAddon && (
                      <div className="flex justify-between gap-4">
                        <span>Souvenir Record LP:</span>
                        <span className="text-white">$35</span>
                      </div>
                    )}
                    <div className="flex justify-between gap-4">
                      <span>9.5% Los Angeles Tax:</span>
                      <span className="text-white">${calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between gap-4 border-t border-white/5 pt-1 text-xs">
                      <span className="text-gold font-bold">Total Ledger Due:</span>
                      <span className="text-gold font-bold">${calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Submission triggers */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 cursor-pointer bg-gold hover:bg-gold-hover text-obsidian font-mono text-xs font-extrabold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-gold/10 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="w-4 h-4 animate-spin" />
                        <span>Verifying Ledger...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Authorize & Issue Board</span>
                      </>
                    )}
                  </button>

                </div>
              </form>
            ) : (
              /* DIGITAL EXQUISITE GOLD RESERVATION TICKET stub */
              <div className="py-6 flex flex-col items-center">
                
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1 bg-green-950 border border-green-800 text-green-400 text-[10px] font-mono uppercase px-3 py-1 rounded-full mb-3 shadow">
                    <Check className="w-3.5 h-3.5 stroke-[3px]" />
                    <span>Liturgy Of Seating Authorized</span>
                  </div>
                  <h4 className="font-serif text-3xl font-medium text-white mb-1">Your Admission Stub Is Active</h4>
                  <p className="text-stone-400 text-xs max-w-sm mx-auto font-sans">
                    A copy of this gold ledger has been dispatched to <span className="text-gold">{ticketVoucher.customerEmail}</span> along with exact residential coordinates.
                  </p>
                </div>

                {/* THE EXQUISITE GOLD GILDED VOUCHER CARD */}
                <div 
                  className="w-full max-w-sm bg-gradient-to-b from-[#18181A] to-[#0d0d0e] border border-gold/45 rounded-2xl overflow-hidden relative shadow-2xl p-6 space-y-6"
                  id="printable-voucher-stub"
                >
                  {/* Watermark logo decoration */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.06),transparent)] pointer-events-none" />

                  {/* Top cutting/rip notches */}
                  <div className="absolute top-0 left-12 right-12 h-1 bg-repeating-radial-gradient(circle, #D4AF37 0px, #D4AF37 2px, transparent 4px)" />

                  {/* Head banner */}
                  <div className="flex justify-between items-center border-b border-white/5 pb-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-gold font-bold">Aura Supper Board</span>
                    <span className="font-mono text-[9px] text-stone-500 font-bold">{ticketVoucher.id}</span>
                  </div>

                  {/* Main Event info */}
                  <div className="space-y-1 text-center">
                    <h5 className="font-serif text-lg text-white font-medium">{event.title}</h5>
                    <div className="text-[11px] font-sans text-stone-400 italic">"West Coast Air • Southern Alchemy"</div>
                  </div>

                  {/* Split Dashboard (Dashed borders representation) */}
                  <div className="border-t border-b border-dashed border-white/10 py-4 grid grid-cols-2 gap-4 text-left font-mono">
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Chair Holder</span>
                      <span className="text-[11px] text-stone-200 truncate block font-bold">{ticketVoucher.customerName}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Board Capacity</span>
                      <span className="text-[11px] text-white font-bold">{ticketVoucher.guestCount} {ticketVoucher.guestCount === 1 ? 'Seat' : 'Seats'} Authorized</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Placing preference</span>
                      <span className="text-[11px] text-gold font-bold">{ticketVoucher.seatingPreference}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Board Spice Chemistry</span>
                      <span className="text-[11px] text-terracotta font-bold">{ticketVoucher.customSpiceTier}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Date Matrix</span>
                      <span className="text-[11px] text-stone-300">{event.date.split(',')[1]}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-stone-500 uppercase block">Hour Window</span>
                      <span className="text-[11px] text-stone-300">{event.time.split('—')[0]}</span>
                    </div>
                  </div>

                  {/* Interactive Details row */}
                  {ticketVoucher.curationAddon && (
                    <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                      <span className="font-mono text-[9px] text-amber-400 uppercase tracking-wider block">Souvenir Sync Vinyl Selected</span>
                      <span className="text-[9px] font-mono text-stone-500">Seal Pack #A-VINYL</span>
                    </div>
                  )}

                  {/* Barcode representation */}
                  <div className="space-y-2 flex flex-col items-center">
                    {/* Retro lines representing barcode */}
                    <div className="w-full h-11 bg-stone-900 border border-white/5 rounded p-1 flex items-stretch justify-between">
                      {[1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 1, 3, 4, 2, 1, 3, 2, 1, 4, 2, 1].map((val, idx) => (
                        <div 
                          key={idx} 
                          className="bg-gold/80" 
                          style={{ width: `${val * 1.5}px` }} 
                        />
                      ))}
                    </div>
                    <span className="font-mono text-[8px] text-stone-500 tracking-[0.4em] uppercase uppercase-center block">
                      *AURA_PASS_SECURED_2026*
                    </span>
                  </div>

                </div>

                {/* Print button & Close */}
                <div className="mt-8 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-stone-900 hover:bg-stone-800 border border-white/10 text-stone-300 text-xs font-mono rounded-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Ledger Stub</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-gold text-obsidian text-xs font-mono font-bold rounded-lg cursor-pointer"
                  >
                    Return to Aura
                  </button>
                </div>

              </div>
            )}

          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
