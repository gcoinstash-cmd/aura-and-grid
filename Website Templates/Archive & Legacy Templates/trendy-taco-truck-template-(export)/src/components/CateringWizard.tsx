import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clipboard, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Sparkles, 
  Calculator, 
  Info,
  X,
  Flame
} from 'lucide-react';

export const CateringWizard: React.FC = () => {
  const { addCateringLead } = useApp();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guestCount: 50,
    budgetRange: '2k_5k' as 'under_2k' | '2k_5k' | '5k_10k' | 'over_10k',
    details: '',
    menuTier: 'full_experience' as 'essential_street' | 'full_experience' | 'luxury_reserve',
    selectedAddons: [] as string[],
  });

  // Budget Tier rates per head
  const TIER_RATES = {
    essential_street: 18, // basic tacos + sides
    full_experience: 32,  // signature tacos, specials, elotes & refresca
    luxury_reserve: 58,   // VIP menu: truffle elotes, seafood, pork belly + dedicated server
  };

  const ADDON_RATES = {
    unlimited_refresca: 6,
    late_night_hour: 250, // flat rate
    dessert_churros: 5,
  };

  // Live price calculation
  const calculateEstimate = () => {
    const baseRate = TIER_RATES[formData.menuTier];
    let perHeadCost = baseRate;
    let flatAddonCost = 0;

    if (formData.selectedAddons.includes('unlimited_refresca')) {
      perHeadCost += ADDON_RATES.unlimited_refresca;
    }
    if (formData.selectedAddons.includes('dessert_churros')) {
      perHeadCost += ADDON_RATES.dessert_churros;
    }
    if (formData.selectedAddons.includes('late_night_hour')) {
      flatAddonCost += ADDON_RATES.late_night_hour;
    }

    const foodTotal = perHeadCost * formData.guestCount;
    const total = foodTotal + flatAddonCost;
    
    // Catering service min is $1,200
    const finalTotal = Math.max(total, 1200);
    return {
      perHead: perHeadCost,
      foodTotal,
      addonsTotal: flatAddonCost,
      total: finalTotal,
      isUnderMinimum: total < 1200,
    };
  };

  const estimate = calculateEstimate();

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const count = parseInt(e.target.value) || 20;
    setFormData((prev) => ({ ...prev, guestCount: count }));
  };

  const toggleAddon = (addonKey: string) => {
    setFormData((prev) => {
      const addons = prev.selectedAddons.includes(addonKey)
        ? prev.selectedAddons.filter((a) => a !== addonKey)
        : [...prev.selectedAddons, addonKey];
      return { ...prev, selectedAddons: addons };
    });
  };

  const validateStep = () => {
    if (step === 1) {
      return formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';
    }
    if (step === 2) {
      return formData.date !== '';
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Map tier estimate to budget range for the schema
    let budgetRange: 'under_2k' | '2k_5k' | '5k_10k' | 'over_10k' = 'under_2k';
    if (estimate.total >= 10000) budgetRange = 'over_10k';
    else if (estimate.total >= 5000) budgetRange = '5k_10k';
    else if (estimate.total >= 2000) budgetRange = '2k_5k';

    const success = await addCateringLead({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      guestCount: formData.guestCount,
      budgetRange,
      details: `Tier: ${formData.menuTier}. Addons: ${formData.selectedAddons.join(', ')}. Est. Price: $${estimate.total}. Notes: ${formData.details}`,
    });

    setLoading(false);
    if (success) {
      setIsSuccess(true);
      setShowSuccessModal(true);
    }
  };

  return (
    <div id="catering-booking-wizard" className="bg-charcoal border border-zinc-800 rounded-2xl overflow-hidden p-6 md:p-8 shadow-2xl relative">
      {/* Editorial Decorative Corner Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-agave-500/5 to-transparent pointer-events-none rounded-bl-3xl" />

      {!isSuccess ? (
        <form onSubmit={handleSubmit}>
          {/* Wizard Header Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
                Event Commission Portal
              </span>
              <span className="font-mono text-xs text-agave-400 font-bold bg-agave-950/40 border border-agave-900/40 px-2 py-0.5 rounded">
                Step {step} of 3
              </span>
            </div>
            <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-agave-500" 
                initial={{ width: '33.33%' }}
                animate={{ width: `${(step / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                <div>
                  <h3 className="font-display font-medium text-2xl text-white">Let's craft the atmosphere.</h3>
                  <p className="text-zinc-500 text-sm mt-1">Please introduce yourself and your contact coordinates.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">Your Name</label>
                    <input 
                      type="text" 
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleTextChange}
                      placeholder="e.g. Sterling Draper"
                      className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleTextChange}
                        placeholder="sterling@events.co"
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleTextChange}
                        placeholder="(213) 555-0100"
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="w-full bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold rounded-xl py-3.5 px-6 flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer"
                  >
                    Set Logistics & Menu
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display font-medium text-2xl text-white">Logistics & Scale.</h3>
                  <p className="text-zinc-500 text-sm mt-1">Define the date and crowd size for the catering commission.</p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-agave-400" />
                        Target Date
                      </label>
                      <input 
                        type="date" 
                        name="date"
                        required
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={handleTextChange}
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-4 py-3 text-sm text-zinc-200 outline-none transition-colors scheme-dark"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-agave-400" />
                          Guest Count
                        </span>
                        <span className="font-bold text-white text-sm font-mono">{formData.guestCount} heads</span>
                      </label>
                      <div className="bg-obsidian border border-zinc-850 rounded-xl p-4 flex flex-col justify-center h-[52px]">
                        <input 
                          type="range" 
                          min="20" 
                          max="500" 
                          step="5"
                          value={formData.guestCount}
                          onChange={handleGuestCountChange}
                          className="w-full accent-agave-400 h-1 rounded-lg cursor-pointer bg-zinc-800"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Menu Tier Select Cards */}
                  <div>
                    <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-3">
                      Select Gastronomy Tier
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Essential */}
                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, menuTier: 'essential_street' }))}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 relative ${
                          formData.menuTier === 'essential_street'
                            ? 'bg-agave-950/20 border-agave-500/80 shadow-lg shadow-agave-950/20'
                            : 'bg-obsidian border-zinc-850 hover:border-zinc-750'
                        }`}
                      >
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">Tier I</span>
                        <h4 className="font-semibold text-zinc-200 mt-1">Street Ritual</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">Classic wood-grilled tacos & artisanal side dishes.</p>
                        <div className="mt-3 text-sm font-bold text-white font-mono">
                          ${TIER_RATES.essential_street} <span className="text-[10px] text-zinc-500 font-normal">/ head</span>
                        </div>
                      </div>

                      {/* Full Experience */}
                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, menuTier: 'full_experience' }))}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 relative ${
                          formData.menuTier === 'full_experience'
                            ? 'bg-agave-950/20 border-agave-500/80 shadow-lg shadow-agave-950/20'
                            : 'bg-obsidian border-zinc-850 hover:border-zinc-750'
                        }`}
                      >
                        <div className="absolute -top-2 right-3 bg-agave-500 text-black text-[8px] font-mono font-bold tracking-widest px-1.5 py-0.5 rounded uppercase">
                          Popular
                        </div>
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">Tier II</span>
                        <h4 className="font-semibold text-zinc-200 mt-1">Signature Feast</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">Full access to regular menu + custom mocktails & specials.</p>
                        <div className="mt-3 text-sm font-bold text-white font-mono">
                          ${TIER_RATES.full_experience} <span className="text-[10px] text-zinc-500 font-normal">/ head</span>
                        </div>
                      </div>

                      {/* Luxury Reserve */}
                      <div 
                        onClick={() => setFormData(prev => ({ ...prev, menuTier: 'luxury_reserve' }))}
                        className={`border rounded-xl p-4 cursor-pointer transition-all duration-150 relative ${
                          formData.menuTier === 'luxury_reserve'
                            ? 'bg-agave-950/20 border-agave-500/80 shadow-lg shadow-agave-950/20'
                            : 'bg-obsidian border-zinc-850 hover:border-zinc-750'
                        }`}
                      >
                        <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">Tier III</span>
                        <h4 className="font-semibold text-zinc-200 mt-1">Reserve VIP</h4>
                        <p className="text-[11px] text-zinc-500 mt-1">Seafood prawns, black truffle elotes, and personal service.</p>
                        <div className="mt-3 text-sm font-bold text-white font-mono">
                          ${TIER_RATES.luxury_reserve} <span className="text-[10px] text-zinc-500 font-normal">/ head</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-semibold rounded-xl py-3.5 px-4 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={!validateStep()}
                    className="w-2/3 bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 text-black font-semibold rounded-xl py-3.5 px-6 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
                  >
                    Verify Estimate
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-display font-medium text-2xl text-white">Culinary Customization & Valuation</h3>
                  <p className="text-zinc-500 text-sm mt-1">Elevate the event with optional upgrades and review the dynamic quote.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Left Column: Upgrades & Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">Enhance Experience</label>
                      <div className="space-y-2">
                        {/* Addon 1 */}
                        <div 
                          onClick={() => toggleAddon('unlimited_refresca')}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                            formData.selectedAddons.includes('unlimited_refresca')
                              ? 'bg-agave-950/20 border-agave-500/50'
                              : 'bg-obsidian border-zinc-850 hover:bg-zinc-900'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold text-zinc-200 block">Unlimited Agua Frescas</span>
                            <span className="text-[10px] text-zinc-500">Hibiscus mint cold-brews for everyone.</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">+${ADDON_RATES.unlimited_refresca}/head</span>
                        </div>

                        {/* Addon 2 */}
                        <div 
                          onClick={() => toggleAddon('dessert_churros')}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                            formData.selectedAddons.includes('dessert_churros')
                              ? 'bg-agave-950/20 border-agave-500/50'
                              : 'bg-obsidian border-zinc-850 hover:bg-zinc-900'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold text-zinc-200 block">Warm Churros Station</span>
                            <span className="text-[10px] text-zinc-500">With cajeta caramel dip on-site.</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">+${ADDON_RATES.dessert_churros}/head</span>
                        </div>

                        {/* Addon 3 */}
                        <div 
                          onClick={() => toggleAddon('late_night_hour')}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                            formData.selectedAddons.includes('late_night_hour')
                              ? 'bg-agave-950/20 border-agave-500/50'
                              : 'bg-obsidian border-zinc-850 hover:bg-zinc-900'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold text-zinc-200 block">Extended Hour (Late Night)</span>
                            <span className="text-[10px] text-zinc-500">Extend truck duration past midnight.</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-white">+${ADDON_RATES.late_night_hour} Flat</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-400 tracking-wider mb-2">Special Accommodations</label>
                      <textarea 
                        name="details"
                        rows={2}
                        value={formData.details}
                        onChange={handleTextChange}
                        placeholder="Allergies, visual setups, custom branding stickers, gate codes..."
                        className="w-full bg-obsidian border border-zinc-850 focus:border-agave-500 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  {/* Right Column: Quote Estimation Breakdown */}
                  <div className="bg-obsidian border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 mb-3 border-b border-zinc-850 pb-2">
                        <Calculator className="w-4 h-4 text-agave-400" />
                        <h4 className="font-mono text-xs uppercase tracking-wider text-zinc-400 font-bold">Dynamic Commission Ledger</h4>
                      </div>

                      <div className="space-y-2 text-sm font-mono text-zinc-400">
                        <div className="flex justify-between">
                          <span>Base ({formData.guestCount} guest x ${TIER_RATES[formData.menuTier]})</span>
                          <span className="text-zinc-200">${(TIER_RATES[formData.menuTier] * formData.guestCount).toLocaleString()}</span>
                        </div>
                        {formData.selectedAddons.map((addon) => (
                          <div key={addon} className="flex justify-between text-xs text-zinc-500">
                            <span className="capitalize">{addon.replace(/_/g, ' ')}</span>
                            <span>
                              {addon === 'late_night_hour' 
                                ? `+$${ADDON_RATES.late_night_hour}`
                                : `+$${(formData.guestCount * ADDON_RATES[addon as keyof typeof ADDON_RATES]).toLocaleString()}`}
                            </span>
                          </div>
                        ))}

                        {estimate.isUnderMinimum && (
                          <div className="flex justify-between text-xs text-amber-500/80 items-center bg-amber-950/20 border border-amber-900/30 p-2 rounded mt-2">
                            <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Truck Minimum</span>
                            <span>$1,200 Min</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="border-t border-zinc-850 pt-4 mt-auto">
                      <div className="flex justify-between items-baseline mb-2">
                        <span className="font-mono text-xs uppercase text-zinc-500">Grand Total Estimate</span>
                        <span className="text-3xl font-display font-medium text-white tracking-tight">
                          ${estimate.total.toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-relaxed font-mono">
                        *Excludes local sales tax. An administrative booking lock is required to hold targets.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="w-1/3 border border-zinc-800 hover:bg-zinc-900 text-zinc-300 font-semibold rounded-xl py-3.5 px-4 flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-2/3 bg-gradient-to-r from-agave-500 to-agave-600 hover:from-agave-600 hover:to-agave-700 text-black font-bold rounded-xl py-3.5 px-6 flex items-center justify-center gap-2 shadow-lg shadow-agave-500/10 hover:shadow-agave-500/20 transition-all duration-150 cursor-pointer"
                  >
                    {loading ? (
                      <span className="w-5 h-5 rounded-full border-2 border-black border-t-transparent animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-4.5 h-4.5 fill-black" />
                        Commission Catering Truck
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 px-4 space-y-6"
        >
          <div className="w-16 h-16 bg-agave-950/50 border border-agave-500/30 text-agave-400 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <CheckCircle2 className="w-10 h-10 stroke-[1.5]" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-medium text-3xl text-white">Event Locked.</h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Your catering design ledger has been committed. The Master Culinary lead will contact you within 4 hours to review final styling options.
            </p>
          </div>

          {/* Receipt display to prove high-end portal value */}
          <div className="max-w-sm mx-auto bg-obsidian border border-zinc-850 rounded-2xl p-5 text-left font-mono space-y-3">
            <div className="flex justify-between text-xs text-zinc-500 border-b border-zinc-850 pb-2">
              <span>REFERENCE CODE</span>
              <span className="text-zinc-300 font-bold">TC-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
            
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">CLIENT</span>
                <span className="text-zinc-300 truncate max-w-[180px]">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">TARGET DATE</span>
                <span className="text-zinc-300">{formData.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ATTENDEES</span>
                <span className="text-zinc-300">{formData.guestCount} head</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">STYLE TIER</span>
                <span className="text-zinc-300 capitalize">{formData.menuTier.replace(/_/g, ' ')}</span>
              </div>
            </div>

            <div className="border-t border-zinc-850 pt-2 flex justify-between text-sm">
              <span className="text-zinc-400 font-bold">LEDGER TOTAL</span>
              <span className="text-agave-400 font-bold">${estimate.total.toLocaleString()}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setIsSuccess(false);
              setStep(1);
              setFormData({
                name: '',
                email: '',
                phone: '',
                date: '',
                guestCount: 50,
                budgetRange: '2k_5k',
                details: '',
                menuTier: 'full_experience',
                selectedAddons: [],
              });
            }}
            className="text-zinc-500 hover:text-zinc-300 text-xs font-mono underline transition-colors cursor-pointer"
          >
            Submit Another Booking Request
          </button>
        </motion.div>
      )}

      {/* Immersive Success Modal Overlay */}
      <AnimatePresence>
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Dark blur backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccessModal(false)}
              className="absolute inset-0 bg-zinc-950/90 backdrop-blur-md cursor-pointer"
            />

            {/* Glowing Ambient Aura */}
            <div className="absolute w-80 h-80 bg-gradient-to-r from-agave-500/15 via-chipotle-500/15 to-amber-500/15 rounded-full filter blur-3xl pointer-events-none" />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden p-8 text-center space-y-6 shadow-2xl z-10"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-white transition-all cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Central Glowing Icon + Confetti Burst */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                {/* SVG glowing ring ripple */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: [1, 1.4], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border-2 border-agave-500/40"
                />

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200, delay: 0.1 }}
                  className="w-16 h-16 rounded-full bg-agave-950 border border-agave-500/30 flex items-center justify-center text-agave-400 relative z-10 shadow-lg shadow-agave-500/20"
                >
                  <CheckCircle2 className="w-9 h-9 stroke-[1.5]" />
                </motion.div>

                {/* Animated Particles (Confetti Burst) */}
                {Array.from({ length: 18 }, (_, i) => ({
                  id: i,
                  angle: (i * 360) / 18 + (Math.sin(i) * 10),
                  distance: 70 + (i % 3) * 25,
                  size: 3 + (i % 4),
                  delay: (i % 5) * 0.05
                })).map((p) => {
                  const rad = (p.angle * Math.PI) / 180;
                  const targetX = Math.cos(rad) * p.distance;
                  const targetY = Math.sin(rad) * p.distance;
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                      animate={{
                        x: targetX,
                        y: targetY,
                        opacity: [1, 1, 0],
                        scale: [0, 1.2, 0.5],
                      }}
                      transition={{
                        duration: 1.2,
                        ease: 'easeOut',
                        delay: p.delay,
                      }}
                      className={`absolute rounded-full ${
                        p.id % 3 === 0 
                          ? 'bg-agave-400' 
                          : p.id % 3 === 1 
                          ? 'bg-chipotle-400' 
                          : 'bg-amber-400'
                      }`}
                      style={{ 
                        width: p.size, 
                        height: p.size,
                        top: '50%',
                        left: '50%',
                        marginTop: -p.size/2,
                        marginLeft: -p.size/2,
                      }}
                    />
                  );
                })}
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950/40 border border-emerald-900/30 text-emerald-400 text-[10px] font-mono font-semibold tracking-wider uppercase">
                  <Flame className="w-3 h-3 text-emerald-400" />
                  Catering Ledger Committed
                </div>
                <h3 className="font-display font-medium text-2xl text-white tracking-tight">
                  Reservation Received!
                </h3>
                <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mx-auto font-sans">
                  Your custom gastronomy blueprint has been locked. The Master Culinary coordinator will contact you within 4 hours.
                </p>
              </div>

              {/* Compact Ledger Summary Plate */}
              <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-4 text-left font-mono space-y-2 text-xs">
                <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                  <span className="text-zinc-500 uppercase text-[10px] font-bold">CLIENT REGISTER</span>
                  <span className="text-white font-medium truncate max-w-[150px]">{formData.name || 'Anonymous'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-zinc-400">
                  <div>
                    <span className="text-zinc-600 block text-[9px] font-bold uppercase">Date Target</span>
                    <span className="text-zinc-300 font-medium">{formData.date || 'TBD'}</span>
                  </div>
                  <div>
                    <span className="text-zinc-600 block text-[9px] font-bold uppercase">Headcount</span>
                    <span className="text-zinc-300 font-medium">{formData.guestCount} heads</span>
                  </div>
                </div>
                <div className="border-t border-zinc-850/60 pt-2 flex justify-between items-baseline">
                  <span className="text-zinc-400 font-bold uppercase text-[10px]">Estimated Total</span>
                  <span className="text-agave-400 font-bold text-base">${estimate.total.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-black/20"
                >
                  View Digital Ledger Receipt
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="w-full py-2.5 bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-zinc-450 hover:text-white font-mono text-[10px] tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
