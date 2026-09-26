import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SERVICES, STYLISTS } from '../data';
import { ServiceItem, Stylist, BookingDetails } from '../types';
import { X, Calendar, Clock, User, Check, ArrowRight, ArrowLeft, Coffee, Sparkles, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedServiceId?: string;
}

export default function BookingModal({ isOpen, onClose, selectedServiceId }: BookingModalProps) {
  const [step, setStep] = useState<number>(1);
  const [service, setService] = useState<ServiceItem | null>(null);
  const [stylist, setStylist] = useState<Stylist | null>(null);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientEmail, setClientEmail] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [quietAppointment, setQuietAppointment] = useState<boolean>(false);
  const [refreshment, setRefreshment] = useState<string>('Matcha Micro-brew');
  const [validationError, setValidationError] = useState<string>('');

  // Auto-map selected service when the modal is opened
  useEffect(() => {
    if (isOpen) {
      if (selectedServiceId) {
        const found = SERVICES.find(s => s.id === selectedServiceId);
        if (found) {
          setService(found);
          setStep(2); // Go directly to Stylist selection
        } else {
          setService(null);
          setStep(1);
        }
      } else {
        setService(null);
        setStep(1);
      }
      setStylist(null);
      setDate('');
      setTime('');
      setValidationError('');
    }
  }, [isOpen, selectedServiceId]);

  // Handle outside overlay click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Generate date selectors (next 7 days, excluding Sundays)
  const getDates = () => {
    const dates = [];
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const today = new Date();

    for (let i = 1; i <= 8; i++) {
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + i);
      if (nextDate.getDay() !== 0) { // Exclude Sunday
        dates.push({
          raw: nextDate.toISOString().split('T')[0],
          formatted: nextDate.toLocaleDateString('en-US', options)
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    '09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM', '06:00 PM'
  ];

  // Steps Handlers
  const validateAndNext = () => {
    setValidationError('');
    if (step === 1 && !service) {
      setValidationError('Please select a Hair Ritual to continue.');
      return;
    }
    if (step === 2 && !stylist) {
      setValidationError('Please select an Avant-Garde Stylist to continue.');
      return;
    }
    if (step === 3 && (!date || !time)) {
      setValidationError('Please pick a date and valid time slot.');
      return;
    }
    if (step === 4) {
      if (!clientName.trim()) {
        setValidationError('Your name is required.');
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(clientEmail)) {
        setValidationError('Please provide a valid client email.');
        return;
      }
      if (!clientPhone.trim()) {
        setValidationError('Your cell contact number is required.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const handlePrev = () => {
    setValidationError('');
    setStep(prev => Math.max(1, prev - 1));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-end"
        >
          {/* Main Slide-out Container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-full max-w-lg md:max-w-xl h-full bg-[#0a0a0a] border-l border-white/5 flex flex-col justify-between overflow-hidden relative"
          >
            {/* Soft Ambient Light Gradient inside drawer */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#E6C587]/[0.01] rounded-full blur-3xl pointer-events-none" />

            {/* Header Block */}
            <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between bg-[#121212]/30 backdrop-blur-md relative z-10">
              <div>
                <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#E6C587]">
                  LA CURATION PROCESS
                </span>
                <h3 className="font-serif text-xl font-light text-white uppercase tracking-wider mt-1">
                  Book an Experience
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 border border-white/5 hover:border-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Steps Progress Indicator (Step 1 to 5) */}
            {step < 5 && (
              <div className="px-6 md:px-8 py-3.5 bg-zinc-900/30 border-b border-white/5 flex items-center justify-between text-[10px] font-mono tracking-widest text-[#F7F4EB]/40">
                <div className="flex items-center space-x-1">
                  <span className={`${step >= 1 ? 'text-[#E6C587]' : ''}`}>CURATIONS</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-50" />
                  <span className={`${step >= 2 ? 'text-[#E6C587]' : ''}`}>STYLIST</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-50" />
                  <span className={`${step >= 3 ? 'text-[#E6C587]' : ''}`}>CALENDAR</span>
                  <ArrowRight className="w-2.5 h-2.5 opacity-50" />
                  <span className={`${step >= 4 ? 'text-[#E6C587]' : ''}`}>CONFIRM</span>
                </div>
                <span>STEP {step}/4</span>
              </div>
            )}

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-6 md:px-8 py-8 relative z-10 no-scrollbar">
              
              {validationError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-950/20 border border-red-500/20 flex items-start space-x-2.5 text-xs text-red-200"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{validationError}</span>
                </motion.div>
              )}

              {/* Step 1: Services Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-white font-light tracking-wide mb-1.5">
                      Select your primary Hair Ritual
                    </h4>
                    <p className="text-xs text-[#F7F4EB]/50 font-light">
                      Each ritual can be further refined with your stylist during continuous intake.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {SERVICES.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => setService(s)}
                        className={`p-5 border cursor-pointer transition-all duration-300 relative ${
                          service?.id === s.id
                            ? 'border-[#E6C587] bg-[#E6C587]/[0.03]'
                            : 'border-white/5 bg-[#121212]/40 hover:border-white/20'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-serif text-base text-white tracking-wide font-light">
                              {s.name}
                            </h5>
                            <span className="inline-block mt-1 font-mono text-[9px] text-[#E6C587] uppercase tracking-wider">
                              {s.duration} Block Service
                            </span>
                          </div>
                          <span className="font-serif text-base text-[#F7F4EB] font-medium">
                            ${s.price}
                          </span>
                        </div>
                        <p className="text-xs text-[#F7F4EB]/60 leading-relaxed font-light mt-3">
                          {s.description}
                        </p>
                        {service?.id === s.id && (
                          <div className="absolute top-3 right-3 p-1 bg-[#E6C587]/10 text-[#E6C587]">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Stylist Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-white font-light tracking-wide mb-1.5">
                      Choose an Art Specialist
                    </h4>
                    <p className="text-xs text-[#F7F4EB]/50 font-light">
                      Our designers are specialized residents focused on architectural geometries.
                    </p>
                  </div>

                  {service && (
                    <div className="p-4 bg-zinc-900/30 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-[#E6C587] block">SELECTED RITUAL</span>
                        <span className="text-xs font-serif text-white block mt-0.5">{service.name}</span>
                      </div>
                      <button
                        onClick={() => setStep(1)}
                        className="text-[9px] font-mono text-[#F7F4EB]/40 hover:text-white underline cursor-pointer"
                      >
                        CHANGE
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    {STYLISTS.map((st) => (
                      <div
                        key={st.id}
                        onClick={() => setStylist(st)}
                        className={`p-5 border cursor-pointer transition-all duration-300 relative flex gap-4 items-center ${
                          stylist?.id === st.id
                            ? 'border-[#E6C587] bg-[#E6C587]/[0.03]'
                            : 'border-white/5 bg-[#121212]/40 hover:border-white/20'
                        }`}
                      >
                        <img
                          src={st.avatar}
                          alt={st.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 object-cover grayscale brightness-95 rounded-none"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-baseline">
                            <h5 className="font-serif text-base text-white font-light tracking-wide">
                              {st.name}
                            </h5>
                            <span className="text-[10px] font-mono text-[#E6C587] tracking-wider">
                              {st.instagram}
                            </span>
                          </div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-[#F7F4EB]/40 mt-0.5 block">
                            {st.role}
                          </span>
                          <p className="text-[11px] text-[#F7F4EB]/60 leading-relaxed font-light mt-1.5 line-clamp-2">
                            {st.bio}
                          </p>
                        </div>
                        {stylist?.id === st.id && (
                          <div className="absolute top-3 right-3 p-1 bg-[#E6C587]/10 text-[#E6C587]">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time Booking Block */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-white font-light tracking-wide mb-1.5">
                      Reserve slow-salon block
                    </h4>
                    <p className="text-xs text-[#F7F4EB]/50 font-light">
                      Crown & Collective operates physical parameters with deliberate zero-overlap guest blocks.
                    </p>
                  </div>

                  {stylist && (
                    <div className="p-4 bg-zinc-900/30 border border-white/5 flex items-center justify-between">
                      <div>
                        <span className="text-[8px] font-mono tracking-widest text-[#E6C587] block">ASSIGNED STYLIST</span>
                        <span className="text-xs font-serif text-white block mt-0.5">{stylist.name}</span>
                      </div>
                      <button
                        onClick={() => setStep(2)}
                        className="text-[9px] font-mono text-[#F7F4EB]/40 hover:text-white underline cursor-pointer"
                      >
                        CHANGE
                      </button>
                    </div>
                  )}

                  {/* Date Grid */}
                  <div>
                    <label className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-3">
                      PICK DATE
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {getDates().map((d) => (
                        <div
                          key={d.raw}
                          onClick={() => setDate(d.raw)}
                          className={`p-3 border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center ${
                            date === d.raw
                              ? 'border-[#E6C587] bg-[#E6C587]/[0.03] text-white'
                              : 'border-white/5 bg-[#121212]/40 text-[#F7F4EB]/70 hover:border-white/10'
                          }`}
                        >
                          <Calendar className={`w-3.5 h-3.5 mb-1.5 ${date === d.raw ? 'text-[#E6C587]' : 'text-white/30'}`} />
                          <span className="text-[10px] font-mono uppercase tracking-wider">{d.formatted}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots Grid */}
                  <div>
                    <label className="block text-[9px] font-mono tracking-widest uppercase text-white/50 mb-3">
                      SPECIFY HOUR BLOCK
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {timeSlots.map((ts) => (
                        <div
                          key={ts}
                          onClick={() => setTime(ts)}
                          className={`p-3 border text-center cursor-pointer transition-all duration-300 flex items-center justify-center space-x-1.5 ${
                            time === ts
                              ? 'border-[#E6C587] bg-[#E6C587]/[0.03] text-white'
                              : 'border-white/5 bg-[#121212]/40 text-[#F7F4EB]/70 hover:border-white/10'
                          }`}
                        >
                          <Clock className={`w-3.5 h-3.5 ${time === ts ? 'text-[#E6C587]' : 'text-white/30'}`} />
                          <span className="text-[11px] font-mono">{ts}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Contact & Hospitality Options */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif text-lg text-white font-light tracking-wide mb-1.5">
                      Client Credentials & Preferences
                    </h4>
                    <p className="text-xs text-[#F7F4EB]/50 font-light">
                      Personalize your physical intake so your lounge room parameters are tailored on entry.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-white/40 mb-1.5">
                        Client Full Name
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Adrienne Westwood"
                        required
                        className="w-full bg-[#121212] border border-white/5 focus:border-[#E6C587] px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-mono tracking-widest uppercase text-white/40 mb-1.5">
                          E-mail Contact
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="adrienne@mode.com"
                          required
                          className="w-full bg-[#121212] border border-white/5 focus:border-[#E6C587] px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-mono tracking-widest uppercase text-white/40 mb-1.5">
                          Mobile Call contact
                        </label>
                        <input
                          type="tel"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          placeholder="(310) 902-1244"
                          required
                          className="w-full bg-[#121212] border border-white/5 focus:border-[#E6C587] px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="h-px bg-white/5 my-6" />

                    {/* Premium High-converting Hospitality Choices */}
                    <div>
                      <label className="block text-[9px] font-mono tracking-widest uppercase text-[#E6C587] mb-3">
                        HOSPITALITY ACCENTS
                      </label>
                      
                      <div className="space-y-3">
                        {/* Quiet Appointments check */}
                        <label className="flex items-start space-x-3 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={quietAppointment}
                            onChange={(e) => setQuietAppointment(e.target.checked)}
                            className="mt-0.5 rounded-none border border-white/20 bg-transparent text-[#E6C587] accent-[#E6C587]"
                          />
                          <div>
                            <span className="block text-xs font-serif text-white font-light">
                              The Pure Sanctuary Block (Quiet Appointment)
                            </span>
                            <span className="block text-[10px] text-[#F7F4EB]/40 mt-0.5 font-light leading-relaxed">
                              Check this if you prefer a meditative environment. Your resident stylist will focus purely on sensory cut parameters, restricting speech to absolute essential consultation metrics.
                            </span>
                          </div>
                        </label>

                        {/* Refreshment Option */}
                        <div className="pt-3">
                          <span className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-2">
                            Apothecary Beverage Preference
                          </span>
                          <div className="grid grid-cols-2 gap-2">
                            {['Matcha Micro-brew', 'Cold Espresso Shot', 'Organic Lavender Tea', 'Pure Mineral Mist Water'].map((opt) => (
                              <div
                                key={opt}
                                onClick={() => setRefreshment(opt)}
                                className={`p-2.5 border text-center text-[10px] font-sans uppercase tracking-[0.1em] cursor-pointer transition-colors ${
                                  refreshment === opt
                                    ? 'border-[#E6C587] bg-[#E6C587]/5 text-white'
                                    : 'border-white/5 bg-[#121212]/40 text-[#F7F4EB]/50 hover:border-white/10'
                                }`}
                              >
                                {opt}
                              </div>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Step 5: Beautiful Completed success slipery bar */}
              {step === 5 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-8 py-4"
                >
                  <div className="text-center">
                    <div className="w-14 h-14 bg-[#E6C587]/10 text-[#E6C587] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#E6C587]/30">
                      <Check className="w-6 h-6" />
                    </div>
                    <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-[#E6C587]">
                      EXPERIENCE LOCKED
                    </span>
                    <h4 className="font-serif text-2xl text-white font-light tracking-wide mt-2">
                      Your Ritual is Curated
                    </h4>
                    <p className="text-xs text-[#F7F4EB]/60 font-light mt-2 max-w-sm mx-auto leading-relaxed">
                      We have reserved your quiet sanctuary hour. A digital invite has been dispatched to your e-mail address.
                    </p>
                  </div>

                  {/* Curated Slip Mock Design */}
                  <div className="bg-[#121212] border border-white/10 p-6 space-y-4 font-mono text-xs text-[#F7F4EB]/70 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1.5 bg-[#E6C587] text-[#0A0A0A] text-[7px] uppercase tracking-widest font-mono">
                      SANCTUARY PASS
                    </div>

                    <div className="border-b border-white/5 pb-3">
                      <span className="text-[8px] text-white/40 block">SALON PROTOCOL</span>
                      <span className="text-xs text-white uppercase tracking-wider block mt-0.5">Crown & Collective — Melrose</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] text-white/40 block">CLIENT VISITOR</span>
                        <span className="text-[11px] text-white font-medium block mt-0.5">{clientName}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 block">RESIDENT SCIENTIST</span>
                        <span className="text-[11px] text-white block mt-0.5">{stylist?.name}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[8px] text-white/40 block">RESERVED RITUAL</span>
                        <span className="text-[11px] text-white block mt-0.5 line-clamp-1">{service?.name}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 block">CHRONO BLOCK</span>
                        <span className="text-[11px] text-[#E6C587] block mt-0.5">{date} • {time}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="text-[8px] text-white/40 block">HOSPITALITY PROTOCOL</span>
                        <span className="text-[10px] text-white block mt-0.5">{quietAppointment ? 'Silent Sanctuary' : 'Conversational Talk'}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-white/40 block">BAR APOTHECARY</span>
                        <span className="text-[10px] text-white block mt-0.5">{refreshment}</span>
                      </div>
                    </div>

                    {/* Barcode representation */}
                    <div className="pt-6 border-t border-dashed border-white/10 text-center">
                      <div className="h-10 bg-white/5 w-4/5 mx-auto flex items-center justify-around px-2 opacity-60">
                        {Array.from({ length: 30 }).map((_, i) => (
                          <div
                            key={i}
                            className={`h-full bg-white`}
                            style={{
                              width: `${i % 3 === 0 ? 3 : i % 5 === 0 ? 1 : 1.5}px`,
                              opacity: i % 7 === 0 ? 0.2 : 0.8
                            }}
                          />
                        ))}
                      </div>
                      <span className="text-[7.5px] text-white/30 tracking-[0.4em] uppercase block mt-2">
                        NO_BOOK_MSN_REF_{Math.floor(Math.random() * 90000) + 10000}
                      </span>
                    </div>

                  </div>

                  <button
                    onClick={onClose}
                    className="w-full py-4 bg-[#F7F4EB] hover:bg-[#E6C587] text-[#0A0A0A] font-mono uppercase tracking-[0.25em] text-xs transition-colors"
                  >
                    CLOSE PORTAL
                  </button>
                </motion.div>
              )}

            </div>

            {/* Sticky Actions Footer */}
            {step < 5 && (
              <div className="p-6 md:p-8 bg-[#121212]/90 backdrop-blur-md border-t border-white/5 flex items-center justify-between relative z-10">
                {step > 1 ? (
                  <button
                    onClick={handlePrev}
                    className="flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.18em] text-[#F7F4EB]/60 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>PREV STEP</span>
                  </button>
                ) : (
                  <div className="text-[9px] font-mono text-white/20 tracking-widest uppercase">
                    MELROSE PLACE STUDIO
                  </div>
                )}

                <button
                  onClick={validateAndNext}
                  className="flex items-center space-x-2.5 px-6 py-3.5 bg-[#F7F4EB] hover:bg-[#E6C587] text-[#0A0A0A] text-xs font-sans uppercase tracking-[0.22em] font-semibold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <span>{step === 4 ? 'Confirm Experience' : 'CONTINUE'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
