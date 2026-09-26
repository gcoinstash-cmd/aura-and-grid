import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  Mail, 
  User, 
  Phone, 
  Sparkles, 
  CheckCircle, 
  ExternalLink, 
  ArrowRight,
  RefreshCw,
  MessageSquare,
  Award
} from 'lucide-react';
import { WEB_AGENCY_FORM_CONFIG, submitFormToConfiguredService } from './formConfig';

interface ReservationWidgetProps {
  onReservationSuccess?: (reservation: any) => void;
}

export function ReservationWidget({ onReservationSuccess }: ReservationWidgetProps) {
  const config = WEB_AGENCY_FORM_CONFIG.reservation;
  
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [guests, setGuests] = useState(4); // default 4 guests
  const [date, setDate] = useState(() => {
    // Default to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('19:30'); // default peak hour
  const [atmosphere, setAtmosphere] = useState<'wood-oven' | 'garden-patio' | 'sommelier-lounge'>('wood-oven');
  const [notes, setNotes] = useState('');

  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState<any | null>(null);

  // Auto-generate next 6 days from tomorrow for interactive chips
  const [dayChips, setDayChips] = useState<{ dayName: string; dateStr: string; label: string }[]>([]);

  useEffect(() => {
    const list = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    for (let i = 1; i <= 6; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      list.push({
        dayName: days[d.getDay()],
        dateStr: dateStr,
        label: `${d.getDate()} ${months[d.getMonth()]}`
      });
    }
    setDayChips(list);
  }, []);

  // Validation Engine
  const validateField = (fieldName: string, value: string) => {
    let errMsg = '';
    if (fieldName === 'name') {
      if (!value.trim()) {
        errMsg = 'The host name is required to secure the wood-fired table.';
      } else if (value.trim().length < 3) {
        errMsg = 'Please provide a full guest name (minimum 3 characters).';
      }
    } else if (fieldName === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) {
        errMsg = 'An email coordinates is necessary for digital confirmation vouchers.';
      } else if (!emailRegex.test(value.trim())) {
        errMsg = 'Please provide a valid email structure (e.g. host@domain.com).';
      }
    } else if (fieldName === 'phone') {
      const phoneRegex = /^[+]?[(]?[0-9]{2,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{3,6}$/;
      if (!value.trim()) {
        errMsg = 'A secure cell path is required for table confirmations.';
      } else if (value.trim().length < 7) {
        errMsg = 'Cell path seems too short. Please include full coordinates.';
      }
    } else if (fieldName === 'date') {
      if (!value) {
        errMsg = 'Please choose a dining sunset date.';
      } else {
        const selected = new Date(value);
        const today = new Date();
        today.setHours(0,0,0,0);
        if (selected < today) {
          errMsg = 'Dates in the past cannot be scheduled. Select a future sunset.';
        }
      }
    }
    setErrors(prev => ({ ...prev, [fieldName]: errMsg }));
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'name') setName(val);
    if (field === 'email') setEmail(val);
    if (field === 'phone') setPhone(val);
    if (field === 'date') {
      setDate(val);
      validateField('date', val);
    }
    
    if (touched[field]) {
      validateField(field, val);
    }
  };

  const handleFieldBlur = (field: string, val: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field, val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all fields
    const allFields = { name, email, phone, date };
    const nextTouched = { name: true, email: true, phone: true, date: true };
    setTouched(nextTouched);

    // Validate all fields
    let hasErrors = false;
    Object.entries(allFields).forEach(([field, val]) => {
      validateField(field, val);
      // Recalculate immediate error checks
      if (field === 'name') {
        if (!val.trim() || val.trim().length < 3) hasErrors = true;
      } else if (field === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val.trim() || !emailRegex.test(val.trim())) hasErrors = true;
      } else if (field === 'phone') {
        if (!val.trim() || val.trim().length < 7) hasErrors = true;
      } else if (field === 'date') {
        if (!val) hasErrors = true;
        else {
          const selected = new Date(val);
          const today = new Date();
          today.setHours(0,0,0,0);
          if (selected < today) hasErrors = true;
        }
      }
    });

    if (hasErrors) {
      // Scroll to widget top so errors are visible
      const widgetElement = document.getElementById('luxury-reservation-widget');
      if (widgetElement) {
        widgetElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return;
    }

    setIsSubmitting(true);

    const payload = {
      hostName: name,
      hostEmail: email,
      hostPhone: phone,
      partySize: guests,
      bookingDate: date,
      bookingTime: time,
      atmosphereZone: atmosphere,
      specialRequests: notes,
      requestedAt: new Date().toISOString()
    };

    const response = await submitFormToConfiguredService('reservation', payload);
    
    setIsSubmitting(false);

    if (response.success) {
      const confirmationCode = `RES-${Math.floor(10000 + Math.random() * 90000)}`;
      const bookingData = {
        code: confirmationCode,
        name,
        email,
        phone,
        guests,
        date,
        time,
        atmosphere,
        notes
      };
      setBookingConfirmed(bookingData);
      if (onReservationSuccess) {
        onReservationSuccess(bookingData);
      }
    } else {
      setErrors(prev => ({ ...prev, api: response.message || 'Transmission error. Please try again.' }));
    }
  };

  const handleResetWidget = () => {
    setBookingConfirmed(null);
    setName('');
    setEmail('');
    setPhone('');
    setGuests(4);
    setNotes('');
    setTouched({});
    setErrors({});
  };

  return (
    <section 
      id="luxury-reservation-widget" 
      className="mt-16 pt-12 border-t border-stone-200"
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Editorial Subheader */}
        <div className="text-center mb-10">
          <span className="text-xs font-mono tracking-widest text-[#C29E57] uppercase block mb-2">
            — Experience Belle Nera In-Person —
          </span>
          <h2 className="text-3xl font-serif text-stone-900 tracking-tight mb-3">
            Secure an Artisan Table
          </h2>
          <p className="text-sm text-stone-500 max-w-lg mx-auto">
            Reserve your desk near our roaring 450°C wood-fired hearth, on our fragrant Tuscan garden patio, or inside our exclusive sommelier library.
          </p>
        </div>

        {/* Configuration Routing Bridge Notification (Useful metadata for agency buyers) */}
        <div className="bg-stone-100/80 border border-stone-200/50 rounded-lg p-3 text-xs mb-8 flex items-center justify-between gap-3 text-stone-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>
              <strong>Developer Web Agency Link:</strong> Swappable Form Engine currently in 
              <code className="bg-stone-200/60 font-mono px-1.5 py-0.5 rounded mx-1 text-[#C29E57]">
                {config.integrationType}
              </code> 
              mode.
            </span>
          </div>
          <span className="text-[10px] font-mono text-stone-400 hidden sm:inline">
            formConfig.ts integration
          </span>
        </div>

        {/* Dynamic Booking Core Box */}
        <div className="bg-white border border-[#E8E3D7] rounded-xl shadow-md overflow-hidden relative">
          
          {/* If the configured service is an external third-party like OpenTable or Resy, handle it directly */}
          {config.integrationType === 'opentable' ? (
            <div className="p-8 text-center py-16">
              <div className="w-16 h-16 bg-[#FBF0EF] rounded-full flex items-center justify-center mx-auto mb-6">
                <CalendarIcon size={28} className="text-[#D13B2E]" />
              </div>
              <h3 className="text-2xl font-serif text-stone-800 mb-3">
                Seamless Affiliation Reservations
              </h3>
              <p className="text-sm text-stone-500 max-w-md mx-auto mb-8">
                We manage table availability through our professional affiliate portal. Press below to specify details on our OpenTable reservation ledger.
              </p>
              <a 
                href={config.opentableUrl || 'https://www.opentable.com'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D13B2E] text-white hover:bg-[#AF291D] font-serif font-bold text-sm tracking-wide rounded-md transition-all shadow-md hover:shadow-lg"
              >
                Book with OpenTable <ExternalLink size={14} />
              </a>
            </div>
          ) : bookingConfirmed ? (
            
            /* GORGEOUS OLD-WORLD PRINTED VOUCHER TICKET VIEW */
            <div className="p-8 bg-stone-50/50 relative">
              <div className="max-w-md mx-auto bg-white border border-stone-200 rounded-lg p-6 shadow-md relative overflow-hidden text-stone-800">
                {/* Vintage Tear Slabs Style */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-[#C29E57]"></div>
                
                {/* Seal Ornament */}
                <div className="absolute -top-12 -right-12 w-28 h-28 border border-dashed border-stone-200/50 rounded-full flex items-end justify-start p-6 text-[8px] font-mono font-bold text-stone-300 transform rotate-12">
                  OFFICIAL TAVOLO
                </div>

                <div className="text-center mb-6 pt-2">
                  <h4 className="font-serif text-xl tracking-tight text-stone-900 block font-bold">
                    Pizzeria Bella Nera
                  </h4>
                  <span className="text-[10px] font-mono tracking-widest text-[#C29E57] uppercase block mt-1">
                    Milano Est. 1984 — Booking Voucher
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs border-t border-b border-dashed border-stone-200 py-5 my-5">
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Guest Host
                    </span>
                    <p className="font-serif font-bold text-stone-800 text-sm">
                      {bookingConfirmed.name}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Confirmation ID
                    </span>
                    <p className="font-mono font-bold text-[#C29E57] text-sm">
                      {bookingConfirmed.code}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Party Capacity
                    </span>
                    <p className="font-medium text-stone-800">
                      {bookingConfirmed.guests} Guests
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Atmosphere Zone
                    </span>
                    <p className="font-medium text-stone-800">
                      {bookingConfirmed.atmosphere === 'wood-oven' && 'Wood Oven Hearth'}
                      {bookingConfirmed.atmosphere === 'garden-patio' && 'Giardino Lemon Patio'}
                      {bookingConfirmed.atmosphere === 'sommelier-lounge' && 'Sommelier Library'}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Sunset Date
                    </span>
                    <p className="font-medium text-stone-800 font-mono">
                      {bookingConfirmed.date}
                    </p>
                  </div>
                  <div>
                    <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                      Service Hour
                    </span>
                    <p className="font-medium text-stone-900 font-bold font-mono">
                      {bookingConfirmed.time}
                    </p>
                  </div>

                  {bookingConfirmed.notes && (
                    <div className="col-span-2 pt-2">
                      <span className="block text-[9px] font-mono text-stone-400 uppercase tracking-widest mb-1">
                        Accommodations noted
                      </span>
                      <p className="text-stone-600 font-sans italic text-[11px] leading-relaxed">
                        "{bookingConfirmed.notes}"
                      </p>
                    </div>
                  )}
                </div>

                <div className="bg-[#EEF7F0] border border-emerald-150 p-3 rounded-md text-center text-xs text-emerald-800 flex items-center justify-center gap-2 mb-6">
                  <CheckCircle size={15} className="text-emerald-600 flex-shrink-0" />
                  <span>Your luxury spot is successfully locked & secure.</span>
                </div>

                <div className="text-center">
                  <button 
                    onClick={handleResetWidget}
                    className="text-xs text-stone-400 hover:text-stone-800 underline font-mono tracking-wide transition-all"
                  >
                    Adjust Schedule / Book Another Table
                  </button>
                </div>
              </div>
            </div>
          ) : (
            
            /* LUXURIOUS CHROME RESERVATION FORM */
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              
              {/* API and Submission Errors */}
              {errors.api && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                  {errors.api}
                </div>
              )}

              {/* Responsive Grid Split */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Left Side: Scheduling Parameters */}
                <div className="space-y-6">
                  
                  {/* Party Capacity Count */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Users size={14} className="text-[#C29E57]" />
                      <span>1. Guest Party Capacity</span>
                    </label>
                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, '8+'].map((numOption) => {
                        const targetGuests = numOption === '8+' ? 8 : (numOption as number);
                        const isSelected = numOption === '8+' ? guests >= 8 : guests === targetGuests;
                        return (
                          <button
                            key={numOption}
                            type="button"
                            className={`h-10 rounded-md text-xs font-mono font-bold transition-all border flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'bg-stone-900 border-stone-900 text-white shadow-sm scale-105'
                                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                            }`}
                            onClick={() => setGuests(targetGuests)}
                          >
                            {numOption}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sunset Date Selection Cards */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <CalendarIcon size={14} className="text-[#C29E57]" />
                      <span>2. Selection Sunset Date</span>
                    </label>
                    
                    {/* Horizontal Next-Day selections */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                      {dayChips.map((chip) => {
                        const isSelected = date === chip.dateStr;
                        return (
                          <button
                            key={chip.dateStr}
                            type="button"
                            className={`p-2 rounded-md text-center transition-all border flex flex-col justify-center items-center cursor-pointer ${
                              isSelected
                                ? 'bg-[#3C4A3E] border-[#3C4A3E] text-white shadow-sm'
                                : 'bg-stone-50 border-stone-200 text-stone-500 hover:bg-stone-100'
                            }`}
                            onClick={() => handleFieldChange('date', chip.dateStr)}
                          >
                            <span className="text-[9px] uppercase font-bold block opacity-75">{chip.dayName}</span>
                            <span className="text-xs font-bold font-mono mt-0.5">{chip.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Standalone Fallback standard Date Element picker */}
                    <div className="flex items-center gap-2 max-w-xs bg-stone-50 border border-stone-200 rounded px-2 py-1.5">
                      <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono font-bold">Custom:</span>
                      <input 
                        type="date"
                        className="bg-transparent text-xs text-stone-700 outline-none w-full border-none focus:ring-0 cursor-pointer"
                        value={date}
                        onChange={(e) => handleFieldChange('date', e.target.value)}
                        onBlur={() => handleFieldBlur('date', date)}
                      />
                    </div>
                    {errors.date && touched.date && (
                      <span className="block text-xs text-red-500 font-medium mt-1.5">
                        {errors.date}
                      </span>
                    )}
                  </div>

                  {/* Service Dinner Hour Chips */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Clock size={14} className="text-[#C29E57]" />
                      <span>3. Sunset Dining Hour Slots</span>
                    </label>

                    <div className="space-y-3 p-3 bg-stone-50 border border-stone-200/60 rounded-lg">
                      {/* Lunch Seating Options */}
                      <div>
                        <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">Pomeridiano (Lunch / Midday)</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['12:00', '12:30', '13:00', '13:30', '14:00'].map((t) => {
                            const isSelected = time === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                className={`px-2.5 py-1 text-xs font-mono rounded transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#C29E57] border-[#C29E57] text-white'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                                }`}
                                onClick={() => setTime(t)}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Premium Sunset Options */}
                      <div>
                        <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">Prime Dinner Golden Hours</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['17:30', '18:00', '18:30', '19:00', '19:30', '20:00'].map((t) => {
                            const isSelected = time === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                className={`px-2.5 py-1.5 text-xs font-mono font-bold rounded transition-all border flex items-center gap-1 cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#3C4A3E] border-[#3C4A3E] text-white shadow-sm'
                                    : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                                }`}
                                onClick={() => setTime(t)}
                              >
                                {t} {t === '19:30' ? '★ Peak' : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notte Tardiva (Late options) */}
                      <div>
                        <span className="block text-[9px] font-mono font-bold text-stone-400 uppercase tracking-wider mb-1.5">Late Night Seeding</span>
                        <div className="flex flex-wrap gap-1.5">
                          {['20:30', '21:00', '21:30', '22:00'].map((t) => {
                            const isSelected = time === t;
                            return (
                              <button
                                key={t}
                                type="button"
                                className={`px-2.5 py-1 text-xs font-mono rounded transition-all border cursor-pointer ${
                                  isSelected
                                    ? 'bg-[#C29E57] border-[#C29E57] text-white'
                                    : 'bg-white border-stone-200 text-stone-100 hover:bg-stone-50 text-stone-600'
                                }`}
                                onClick={() => setTime(t)}
                              >
                                {t}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Host Contact Coordinates & Atmosphere selections */}
                <div className="space-y-5">
                  
                  {/* Choose Seating Zone */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2.5 flex items-center gap-2">
                      <Award size={14} className="text-[#C29E57]" />
                      <span>4. Select Ambience Aura</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        {
                          id: 'wood-oven',
                          title: 'Kitchen Wood Oven Bar',
                          desc: 'High-chairs near roaring 485°C brick domes.'
                        },
                        {
                          id: 'garden-patio',
                          title: 'Giardino Lemon Patio',
                          desc: 'Authentic sweet string lanterns & green vines.'
                        },
                        {
                          id: 'sommelier-lounge',
                          title: 'Sommelier Library Rack',
                          desc: 'Surrounded by silent cellars & organic wine bottles.'
                        }
                      ].map((item) => {
                        const isSelected = atmosphere === item.id;
                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-lg border transition-all cursor-pointer select-none ${
                              isSelected
                                ? 'bg-stone-50 border-stone-850 ring-1 ring-stone-900/10'
                                : 'bg-white border-stone-150 hover:bg-stone-50/50'
                            }`}
                            onClick={() => setAtmosphere(item.id as any)}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                                isSelected ? 'border-[#3C4A3E] bg-[#3C4A3E]' : 'border-stone-300'
                              }`}>
                                {isSelected && <span className="w-1 h-1 bg-white rounded-full"></span>}
                              </span>
                              <div>
                                <span className="block font-serif text-xs font-bold text-stone-850">
                                  {item.title}
                                </span>
                                <span className="block text-[10px] text-stone-400 mt-0.5">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Personal guest coordinates */}
                  <div className="space-y-3 pt-1 border-t border-stone-100">
                    <span className="block text-xs font-mono font-bold text-[#C29E57] uppercase tracking-wider">
                      — Host Coordination Details —
                    </span>

                    {/* Name input */}
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                          <User size={13} />
                        </span>
                        <input
                          type="text"
                          className={`w-full text-xs pl-9 pr-3 py-2.5 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            errors.name && touched.name
                              ? 'border-red-400 bg-red-50/20 focus:border-red-500' 
                              : 'border-stone-200 focus:border-[#3C4A3E] focus:ring-1 focus:ring-[#3C4A3E]/10 bg-white'
                          }`}
                          placeholder="Your Full Name (minimum 3 characters)"
                          value={name}
                          onChange={(e) => handleFieldChange('name', e.target.value)}
                          onBlur={() => handleFieldBlur('name', name)}
                        />
                      </div>
                      {errors.name && touched.name && (
                        <span className="block text-[10px] text-red-500 font-medium mt-1 pl-1">
                          {errors.name}
                        </span>
                      )}
                    </div>

                    {/* Email Coordinates */}
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                          <Mail size={13} />
                        </span>
                        <input
                          type="email"
                          className={`w-full text-xs pl-9 pr-3 py-2.5 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            errors.email && touched.email
                              ? 'border-red-400 bg-red-50/20 focus:border-red-500' 
                              : 'border-stone-200 focus:border-[#3C4A3E] focus:ring-1 focus:ring-[#3C4A3E]/10 bg-white'
                          }`}
                          placeholder="Email coordinate (for instant voucher ticket)"
                          value={email}
                          onChange={(e) => handleFieldChange('email', e.target.value)}
                          onBlur={() => handleFieldBlur('email', email)}
                        />
                      </div>
                      {errors.email && touched.email && (
                        <span className="block text-[10px] text-red-500 font-medium mt-1 pl-1">
                          {errors.email}
                        </span>
                      )}
                    </div>

                    {/* Cell path */}
                    <div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400 pointer-events-none">
                          <Phone size={13} />
                        </span>
                        <input
                          type="text"
                          className={`w-full text-xs pl-9 pr-3 py-2.5 rounded border transition-all placeholder:text-stone-400 focus:outline-none ${
                            errors.phone && touched.phone
                              ? 'border-red-400 bg-red-50/20 focus:border-red-500' 
                              : 'border-stone-200 focus:border-[#3C4A3E] focus:ring-1 focus:ring-[#3C4A3E]/10 bg-white'
                          }`}
                          placeholder="Phone / Cell coordinate (E.g. +39 345 0912)"
                          value={phone}
                          onChange={(e) => handleFieldChange('phone', e.target.value)}
                          onBlur={() => handleFieldBlur('phone', phone)}
                        />
                      </div>
                      {errors.phone && touched.phone && (
                        <span className="block text-[10px] text-red-500 font-medium mt-1 pl-1">
                          {errors.phone}
                        </span>
                      )}
                    </div>

                  </div>

                </div>

              </div>

              {/* Special Accommodations notes */}
              <div className="border-t border-stone-100 pt-4">
                <label className="block text-xs font-mono font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5" htmlFor="widget-notes">
                  <MessageSquare size={14} className="text-[#C29E57]" />
                  <span>5. Special Accommodations (Optional)</span>
                </label>
                <textarea
                  id="widget-notes"
                  className="w-full text-xs p-3 rounded border border-stone-200 focus:border-[#3C4A3E] focus:outline-none bg-stone-50/40 focus:bg-white transition-all h-20 placeholder:text-stone-450"
                  placeholder="E.g., Highchair requested for kids, serious peanut or dairy allergies, sweet anniversary sparkling wine pre-pour..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Booking Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#3C4A3E] hover:bg-[#2B352C] disabled:bg-stone-300 text-white font-serif font-bold tracking-wide rounded shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none text-sm"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={14} className="animate-spin text-stone-100" /> Calculating table sunset layout...
                    </>
                  ) : (
                    <>
                      Confirm Table Booking Placement <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </section>
  );
}
