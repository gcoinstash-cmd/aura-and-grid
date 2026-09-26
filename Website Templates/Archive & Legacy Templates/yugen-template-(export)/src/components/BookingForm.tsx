/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * ============================================================================
 * DEVELOPER DOCUMENTATION: SECURE BOOKING SYSTEM & UPSALE ENGAGING PORTAL
 * ============================================================================
 * 
 * 1. DESIGN SYSTEM & LAYOUT ROLE:
 *    The BookingForm component serves as the core interactive transactional anchor 
 *    in the bottom quadrant of the Yūgen landing experiences. Featuring a heavy obsidian card
 *    canvas, dual registration modes (Individual reservations vs Exclusive full buyouts), 
 *    and a meticulously crafted perforated physical "DINNER DOCKET" simulation, it matches 
 *    high-frequency user input with bespoke, analog aesthetic pleasure.
 * 
 * 2. SERVERLESS CONVERSIONS, STRIPE PAYMENTS & CMS INTEGRATION MANUAL:
 *    To upgrade this frontend-only booking flow to a production-live transactional environment,
 *    follow these programmatic binding steps:
 * 
 *    - SERVERLESS ENDPOINTS: Locate the `handleSubmit` event handler. Instead of just setting 
 *      local state `setIsSubmitted(true)`, issue a POST request to your cloud functions or API 
 *      routes (e.g. `await fetch('/api/reserve', { method: 'POST', body: JSON.stringify(formData) })`).
 *    - STRIPE CHECKOUT SESSIONS: For luxury deposit authorization or high-ticket buyouts, initialize the
 *      Stripe SDK within your API handler. Dynamically feed the calculated `estimatedTotal` state into 
 *      a Stripe Line Item structure, generate a Stripe Checkout URL, and route the customer's browser 
 *      using `window.location.href = session.url`.
 *    - HEADLESS CMS INTEGRATIONS: To pull available sitting dates or time slots dynamically from Sanity,
 *      Strapi, or Hygraph, fetch reservation capacity records within a top-level `useEffect` hook, and 
 *      map the dropdown choices dynamically based on live CMS content lists rather than hardcoded slates.
 * 
 * 3. STYLE SEGREGATION & CUSTOMIZATION CONTROLS:
 *    All layout grids, ambient background light paths (`bg-[#C5A880]/[0.015]`), rounded presets, and
 *    perforation border teeth are controlled natively via standardized Tailwind utility CSS classes. 
 *    This allows developer buyers to quickly restructure columns, change focus inputs, or shift core color
 *    schemes directly in the TSX markup without breaking any form calculations, memoized pricing states, 
 *    or input validation engines.
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { BookingFormState } from '../types';
import { DINING_TIERS, BUYOUT_OPTIONS } from '../data';
import { Shield, Sparkles, Calendar, Clock, DollarSign, ArrowRight, CheckCircle2 } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import Toast from './Toast';
import { formatCurrency } from '../utils/currency';

export default function BookingForm() {
  const [formData, setFormData] = useState<BookingFormState>({
    guestName: '',
    email: '',
    phone: '',
    date: '',
    timeSlot: '18:00',
    guestsCount: 2,
    experienceTier: 'tier-exclusive', // standard choice
    addCaviarAssortment: false,
    addPrivateSakeSommelier: false,
    specialRequests: '',
    isCustomConsultation: false, // flag for full state buyouts
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Determine standard chosen tiers or private buyout profiles
  const currentStandardTier = useMemo(() => {
    return DINING_TIERS.find(t => t.id === formData.experienceTier);
  }, [formData.experienceTier]);

  const currentBuyoutTier = useMemo(() => {
    return BUYOUT_OPTIONS.find(b => b.id === formData.experienceTier);
  }, [formData.experienceTier]);

  // Realtime Live Estimated Transaction Value calculation engine
  const estimatedTotal = useMemo(() => {
    if (formData.isCustomConsultation) {
      // Private counter buyout modes
      const base = currentBuyoutTier?.basePrice || 3500;
      let addonTotal = 0;
      if (formData.addCaviarAssortment) addonTotal += 450; // Flat elite buyout catering add-ons
      if (formData.addPrivateSakeSommelier) addonTotal += 850;
      return base + addonTotal;
    } else {
      // Individual reservations mode
      const pricePerSeat = currentStandardTier?.price || 185;
      let customAddonSeatTotal = 0;
      if (formData.addCaviarAssortment) customAddonSeatTotal += 60; // Caviar supplement per person
      if (formData.addPrivateSakeSommelier) customAddonSeatTotal += 95; // Premium Sake Sommelier pairing supplement per person
      return (pricePerSeat + customAddonSeatTotal) * formData.guestsCount;
    }
  }, [formData, currentStandardTier, currentBuyoutTier]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: keyof BookingFormState) => {
    setFormData(prev => ({
      ...prev,
      [name]: !prev[name] as any
    }));
  };

  // Luxury Toggle between individual reservation and exclusive buyout channel
  const handleConsultationToggle = (isBuyout: boolean) => {
    setFormData(prev => ({
      ...prev,
      isCustomConsultation: isBuyout,
      experienceTier: isBuyout ? 'buyout-counter' : 'tier-exclusive',
      guestsCount: isBuyout ? 8 : 2
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName || !formData.email || !formData.phone || !formData.date) {
      alert('Please fill out the contact details to proceed with authorization.');
      return;
    }
    setIsSubmitted(true);
    setShowToast(true);
  };

  return (
    <section id="booking-section" className="section-padding-tier-1 bg-yugen-charcoal relative border-t border-white/5 overflow-hidden">
      
      {/* Background Radial Light Source for high elements fidelity */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yugen-gold/[0.015] rounded-full blur-[120px] pointer-events-none" />

      {/* Atmospheric Grain Overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        
        <ScrollReveal delay={0} yOffset={30}>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yugen-gold" />
              <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold">
                Section 03 // Secure Verification Portal
              </span>
            </div>
            
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-white tracking-tight">
              The <span className="italic">Obsidian Counter</span> Experience
            </h2>
            
            <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-xl mx-auto">
              Reserve individual seats along our 8-chair volcanic stone counter, or request an exclusive full spatial estate takeover. Secure authorization required.
            </p>

            {/* Core Layout Decoupling Toggle */}
            <div className="flex justify-center pt-8">
              <div className="inline-flex rounded-sm p-1.5 bg-neutral-950 border border-white/5">
                <button
                  type="button"
                  onClick={() => handleConsultationToggle(false)}
                  className={`px-3 sm:px-6 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all cursor-pointer hyphens-auto ${
                    !formData.isCustomConsultation 
                      ? 'bg-yugen-gold text-black font-semibold' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Individual Seats
                </button>
                
                <button
                  type="button"
                  onClick={() => handleConsultationToggle(true)}
                  className={`px-3 sm:px-6 py-2.5 text-[9px] sm:text-[10px] uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all cursor-pointer hyphens-auto ${
                    formData.isCustomConsultation 
                      ? 'bg-yugen-gold text-black font-semibold' 
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Private Buyout ({formatCurrency(3500)}+)
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Master Interlocking Form Block */}
        <ScrollReveal delay={200} yOffset={35} className="max-w-5xl mx-auto">
          <div className="bg-neutral-950 border border-white/5 p-4 sm:p-8 md:p-14 rounded-sm shadow-2xl relative">
          
          {isSubmitted ? (
            <div className="text-center py-16 space-y-6 max-w-md mx-auto animate-fade-in">
              <CheckCircle2 className="h-14 w-14 text-yugen-gold mx-auto opacity-90" />
              
              <div className="space-y-2">
                <h3 className="font-serif text-3xl text-white font-light">Inquiry Dispatched</h3>
                <p className="font-sans text-[11px] uppercase tracking-[0.2em] text-yugen-gold">
                  Reference ID: YUG-{Math.floor(Math.random() * 900000 + 100000)}
                </p>
              </div>

              <div className="h-[1px] w-12 bg-neutral-800 mx-auto" />

              <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                Thank you, <span className="font-medium text-white">{formData.guestName}</span>. 
                {formData.isCustomConsultation 
                  ? ' Our Lead Culinary Director will review your high-security buyout request and contact you directly via phone to sculpt your sensory event within 12 hours.'
                  : ' A silent hold has been placed for your counter seating request. Our maître d’ will confirm your selection shortly by email and contact details.'}
              </p>

              <div className="p-4 bg-neutral-900 border border-white/5 rounded-sm text-left">
                <span className="font-sans text-[9px] uppercase tracking-wider text-neutral-500 block mb-2">Estimated Allocation Details</span>
                <div className="flex justify-between text-xs font-sans text-neutral-300">
                  <span>Option:</span>
                  <span>{formData.isCustomConsultation ? currentBuyoutTier?.title : currentStandardTier?.title}</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-neutral-300 mt-1">
                  <span>Seats/Scale:</span>
                  <span>{formData.isCustomConsultation ? 'Exclusive Compound' : `${formData.guestsCount} Seats`}</span>
                </div>
                <div className="flex justify-between text-xs font-sans text-neutral-300 mt-1">
                  <span>Date/Time:</span>
                  <span>{formData.date} at {formData.timeSlot}</span>
                </div>
                <div className="border-t border-white/5 mt-3 pt-2 flex justify-between text-sm font-sans font-medium text-white">
                  <span>Retainer Estimate:</span>
                  <span className="text-yugen-gold">{formatCurrency(estimatedTotal)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData(prev => ({ ...prev, guestName: '', email: '', phone: '', specialRequests: '' }));
                }}
                className="px-8 py-3 bg-neutral-900 border border-white/10 text-[10px] uppercase tracking-widest text-yugen-gold hover:bg-neutral-850 hover:text-white transition-all cursor-pointer"
              >
                Reset Allocation Form
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              
              {/* Form Input Columns (Left/Middle Spans 7 cols) */}
              <div className="col-span-1 lg:col-span-7 space-y-8">
                
                <h3 className="font-serif text-xl sm:text-2xl text-white font-light border-b border-white/5 pb-4">
                  {formData.isCustomConsultation ? '1. Select Spatial Level' : '1. Guest Configuration'}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Select Area */}
                  {formData.isCustomConsultation ? (
                    <div className="sm:col-span-2 space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                        Buyout Specification
                      </label>
                      <select
                        name="experienceTier"
                        value={formData.experienceTier}
                        onChange={handleInputChange}
                        className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white rounded-none cursor-pointer"
                      >
                        {BUYOUT_OPTIONS.map(opt => (
                          <option key={opt.id} value={opt.id} className="bg-[#050505]">{opt.title} (From {formatCurrency(opt.basePrice)})</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                          Accompaniment Level
                        </label>
                        <select
                          name="experienceTier"
                          value={formData.experienceTier}
                          onChange={handleInputChange}
                          className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white rounded-none cursor-pointer"
                        >
                          {DINING_TIERS.map(tier => (
                            <option key={tier.id} value={tier.id} className="bg-[#050505]">{tier.title} ({formatCurrency(tier.price)}/pp)</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                          Guests Count
                        </label>
                        <select
                          name="guestsCount"
                          value={formData.guestsCount}
                          onChange={(e) => setFormData(prev => ({ ...prev, guestsCount: parseInt(e.target.value) }))}
                          className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white rounded-none cursor-pointer"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num} className="bg-[#050505]">{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Date and Time slots */}
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                      Calendar Allocation
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="date"
                        required
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white rounded-none cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                      Temporal Sitting Slates
                    </label>
                    <select
                      name="timeSlot"
                      value={formData.timeSlot}
                      onChange={handleInputChange}
                      className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white rounded-none cursor-pointer"
                    >
                      <option value="17:30" className="bg-[#050505]">First Seating // 17:30</option>
                      <option value="20:15" className="bg-[#050505]">Second Seating // 20:15</option>
                      <option value="22:30" className="bg-[#050505]">Late Night Ritual // 22:30</option>
                    </select>
                  </div>
                </div>

                {/* Secure Contact Elements */}
                <h3 className="font-serif text-xl sm:text-2xl text-white font-light border-b border-white/5 pb-4 pt-4">
                  2. Secure Registry Details
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                        Full Name / Principal
                      </label>
                      <input
                        type="text"
                        name="guestName"
                        required
                        placeholder="e.g., Jean-Luc Sterling"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-none"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                        Secure Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="e.g., +1 (555) 0192"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                        Encrypted Email Coordinates
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="e.g., director@sterlingcomp.co"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-semibold">
                      Anomalies or Dietary Sanctuaries (Optional)
                    </label>
                    <textarea
                      name="specialRequests"
                      rows={3}
                      placeholder="e.g., Strict warm shell crustacean sensitivities..."
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      className="w-full form-input-clean p-3 sm:p-3.5 text-xs sm:text-sm text-white placeholder-neutral-600 rounded-none resize-none"
                    />
                  </div>
                </div>

              </div>

              {/* Real-time Order Summary Panel (Right Spans 5 cols) */}
              <div className="col-span-1 lg:col-span-5 bg-yugen-charcoal border border-white/5 p-4 sm:p-6 lg:p-8 flex flex-col justify-between">
                
                <div className="space-y-6">
                  <h4 className="font-sans text-[10px] uppercase tracking-[0.25em] text-yugen-gold font-semibold border-b border-white/5 pb-3">
                    REGISTRY SUMMARY &amp; CURATION
                  </h4>

                  {/* Elite Custom Extras (Commercial upsell) */}
                  <div className="space-y-4">
                    <h5 className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-3">
                      HIGH-TICKET UPGRADES:
                    </h5>

                    {/* Upsell A */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={formData.addCaviarAssortment}
                        onChange={() => handleCheckboxChange('addCaviarAssortment')}
                        className="mt-1 h-3.5 w-3.5 bg-neutral-800 accent-yugen-gold border-white/10 cursor-pointer rounded-none shrink-0"
                      />
                      <div className="flex-1 min-w-0 break-words">
                        <span className="font-sans text-xs text-neutral-300 font-medium group-hover:text-yugen-gold transition-colors block break-words whitespace-normal">
                          {formData.isCustomConsultation 
                            ? `Buyout Catering Platinum Caviar (${formatCurrency(450, { includeSign: true })})` 
                            : `Personal Royal Caviar Service (${formatCurrency(60, { includeSign: true })}/pp)`}
                        </span>
                        <span className="font-sans text-[10px] text-neutral-500 leading-normal block mt-0.5 break-words whitespace-normal">
                          Acquire 15g premium wild Caspian Caviar with hand-turned mother of pearl spoonware.
                        </span>
                      </div>
                    </label>

                    {/* Upsell B */}
                    <label className="flex items-start gap-3 cursor-pointer group pt-2">
                      <input
                        type="checkbox"
                        checked={formData.addPrivateSakeSommelier}
                        onChange={() => handleCheckboxChange('addPrivateSakeSommelier')}
                        className="mt-1 h-3.5 w-3.5 bg-neutral-800 accent-yugen-gold border-white/10 cursor-pointer rounded-none shrink-0"
                      />
                      <div className="flex-1 min-w-0 break-words">
                        <span className="font-sans text-xs text-neutral-300 font-medium group-hover:text-yugen-gold transition-colors block break-words whitespace-normal">
                          {formData.isCustomConsultation 
                            ? `Lead sommelier Private Sake Cellar flight (${formatCurrency(850, { includeSign: true })})` 
                            : `Standard Sake/Wine Curated Flights (${formatCurrency(95, { includeSign: true })}/pp)`}
                        </span>
                        <span className="font-sans text-[10px] text-neutral-500 leading-normal block mt-0.5 break-words whitespace-normal">
                          Unveil rare vintage unpasteurized Daiginjos sourced exclusively from rural micro-breweries.
                        </span>
                      </div>
                    </label>
                  </div>

                </div>

                {/* Elegant Physical Dinner Ticket / Clean Ledger Receipt */}
                <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
                  
                  {/* Physical Style Ticket Box */}
                  <div className="relative bg-[#050505] border border-stone-800/65 p-3.5 sm:p-5 space-y-4 shadow-2xl overflow-hidden">
                    {/* Top Perforated Teeth Indicator */}
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#050505] flex justify-between overflow-hidden" 
                         style={{ backgroundImage: `repeating-linear-gradient(90deg, var(--color-yugen-gold) 0px, var(--color-yugen-gold) 3px, transparent 3px, transparent 8px)`, backgroundSize: '100% 100%' }} />
                    
                    <div className="flex justify-between items-center border-b border-dashed border-stone-800 pb-3 pt-1">
                      <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-yugen-gold font-bold">DINNER DOCKET</span>
                      <span className="font-mono text-[9px] text-stone-500">
                        RES-{(formData.date ? formData.date.replace(/-/g, '').slice(-4) : '0005')}-{formData.timeSlot.replace(':', '')}
                      </span>
                    </div>

                    <div className="space-y-3.5 pt-1 text-xs">
                      {/* SELECTED SUITE */}
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-semibold whitespace-nowrap">SELECTED SUITE</span>
                        <div className="flex-grow border-b border-dashed border-stone-800/40" />
                        <span className="text-white font-sans text-right text-xs truncate max-w-[160px] font-medium">
                          {(formData.isCustomConsultation ? currentBuyoutTier?.title : currentStandardTier?.title) || 'N/A'}
                        </span>
                      </div>

                      {/* SPATIAL ATTENDANCE */}
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-semibold whitespace-nowrap">SPATIAL ATTENDANCE</span>
                        <div className="flex-grow border-b border-dashed border-stone-800/40" />
                        <span className="text-white font-sans text-right text-xs font-medium">
                          {formData.isCustomConsultation ? 'EXCLUSIVE TAKEOVER' : `${formData.guestsCount} GUESTS`}
                        </span>
                      </div>

                      {/* TEMPORAL ALLOCATION */}
                      <div className="flex justify-between items-baseline gap-2">
                        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-neutral-400 font-semibold whitespace-nowrap">TEMPORAL ALLOCATION</span>
                        <div className="flex-grow border-b border-dashed border-stone-800/40" />
                        <span className="text-white font-sans text-right text-xs font-medium uppercase">
                          {formData.date ? `${formData.date} @ ${formData.timeSlot}` : `TBD @ ${formData.timeSlot}`}
                        </span>
                      </div>

                      {/* DYNAMIC UPGRADES DETAILED IN TICKET LEDGER */}
                      {(formData.addCaviarAssortment || formData.addPrivateSakeSommelier) && (
                        <div className="pt-3 mt-3 border-t border-dashed border-stone-800/40 space-y-2">
                          <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-neutral-500 block">CURATION UPGRADES</span>
                          
                          {formData.addCaviarAssortment && (
                            <div className="flex justify-between items-baseline gap-2 pl-2">
                              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-neutral-450 whitespace-nowrap">PLATINUM CAVIAR</span>
                              <div className="flex-grow border-b border-dashed border-stone-800/30" />
                              <span className="text-yugen-gold font-mono text-xs">
                                {formData.isCustomConsultation ? formatCurrency(450, { includeSign: true }) : formatCurrency(60 * formData.guestsCount, { includeSign: true })}
                              </span>
                            </div>
                          )}

                          {formData.addPrivateSakeSommelier && (
                            <div className="flex justify-between items-baseline gap-2 pl-2">
                              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-neutral-450 whitespace-nowrap">SAKE/WINE RITUAL</span>
                              <div className="flex-grow border-b border-dashed border-stone-800/30" />
                              <span className="text-yugen-gold font-mono text-xs">
                                {formData.isCustomConsultation ? formatCurrency(850, { includeSign: true }) : formatCurrency(95 * formData.guestsCount, { includeSign: true })}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Dashed Border Separator with authentic tear notches */}
                    <div className="w-full border-t border-dashed border-stone-700/80 my-4 relative">
                      <div className="absolute -left-7 -top-1.5 w-3 h-3 bg-[#0B0B0B] rounded-full border border-stone-800/50" />
                      <div className="absolute -right-7 -top-1.5 w-3 h-3 bg-[#0B0B0B] rounded-full border border-stone-800/50" />
                    </div>

                    {/* ESTIMATED COMMITMENT */}
                    <div className="flex justify-between items-baseline">
                      <div>
                        <span className="font-sans text-[9px] uppercase tracking-[0.25em] text-yugen-gold font-bold block">
                          ESTIMATED COMMITMENT
                        </span>
                        <span className="font-mono text-[7.5px] tracking-wider text-stone-500 block">
                          {formData.isCustomConsultation ? 'EXCLUSIVE EST. BUYOUT RATE' : 'INDIVIDUAL ALLOCATION RATE'}
                        </span>
                      </div>
                      <span className="font-mono text-xl sm:text-2xl text-white font-semibold text-right">
                        {formatCurrency(estimatedTotal)}
                      </span>
                    </div>

                  </div>

                  {formData.isCustomConsultation && (
                    <div className="p-3 bg-yugen-gold/5 border border-yugen-gold/15 rounded-none">
                      <p className="font-sans text-[10px] text-yugen-gold leading-relaxed">
                        Notice: As an elite buyout priced over {formatCurrency(3500)}, our staff will execute a private security screening and coordinate high-custom logistics directly via secure line.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-4 bg-neutral-100 hover:bg-yugen-gold text-black font-semibold text-xs tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer rounded-none border border-transparent hover:border-yugen-gold hover:bg-transparent hover:text-white"
                  >
                    <span>{formData.isCustomConsultation ? 'Request Private Curation' : 'Dispatch Counter Request'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[8px] sm:text-[9.5px] text-neutral-500 tracking-[0.05em] sm:tracking-[0.1em] uppercase text-center w-full max-w-xs mx-auto truncate sm:overflow-visible sm:whitespace-normal">
                    <Shield className="h-3 w-3 text-neutral-600 shrink-0" />
                    <span className="hyphens-auto">Secure 256-bit Analog Routing</span>
                  </div>

                </div>

              </div>

            </form>
          )}

          </div>
        </ScrollReveal>

      </div>

      {/* Elegant Success Toast Portal */}
      <Toast isVisible={showToast} onClose={() => setShowToast(false)} />
    </section>
  );
}
