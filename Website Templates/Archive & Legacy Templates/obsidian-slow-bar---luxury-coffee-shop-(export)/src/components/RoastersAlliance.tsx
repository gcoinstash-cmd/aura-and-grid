/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToggleLeft, Check, Sparkles, Sliders, Calendar, Play, Pause, MapPin, Layers, RefreshCw } from 'lucide-react';
import { SubscriptionTier, ActiveSubscription } from '../types';
import { SUBSCRIPTION_TIERS } from '../data';

interface RoastersAllianceProps {
  loyaltyPoints: number;
  onUpdateLoyaltyPoints: (points: number) => void;
}

export default function RoastersAlliance({ loyaltyPoints, onUpdateLoyaltyPoints }: RoastersAllianceProps) {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [activeTab, setActiveTab] = useState<'config' | 'portal'>('config');
  
  // Custom user subscription simulation state
  const [userSub, setUserSub] = useState<ActiveSubscription>({
    tierId: 'alliance-connoisseur',
    billingFrequency: 'monthly',
    grindOption: 'Whole Bean',
    frequency: 'biweekly',
    status: 'active',
    deliveryAddress: '1000 S Grand Ave Studio C, Los Angeles, CA 90015',
    nextShipDate: 'June 5, 2026'
  });

  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);
  const [customAddress, setCustomAddress] = useState(userSub.deliveryAddress);
  const [customGrind, setCustomGrind] = useState(userSub.grindOption);
  const [customShipFreq, setCustomShipFreq] = useState(userSub.frequency);
  const [isSuccess, setIsSuccess] = useState(false);

  const activeTierDetails = SUBSCRIPTION_TIERS.find(t => t.id === userSub.tierId) || SUBSCRIPTION_TIERS[0];

  const handleOpenCheckout = (tier: SubscriptionTier) => {
    setSelectedTier(tier);
    setCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    setIsSuccess(true);
    setTimeout(() => {
      // Configure new subscription limits
      setUserSub({
        tierId: selectedTier.id,
        billingFrequency: billingCycle,
        grindOption: customGrind,
        frequency: customShipFreq,
        status: 'active',
        deliveryAddress: customAddress,
        nextShipDate: 'June 8, 2026'
      });
      
      // Award loyalty bonus
      const bonusPoints = billingCycle === 'annual' ? 300 : 100;
      onUpdateLoyaltyPoints(loyaltyPoints + bonusPoints);
      
      setIsSuccess(false);
      setCheckoutModalOpen(false);
      setSelectedTier(null);
      
      // Automatically navigate to dashboard
      setActiveTab('portal');
    }, 1800);
  };

  const handleTogglePause = () => {
    setUserSub(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'paused' : 'active'
    }));
  };

  return (
    <section id="alliance" className="py-24 bg-[#0B0B0B] border-t border-[#262626]/20 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Module Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 text-left">
          <div className="space-y-4">
            <span className="font-mono text-[10px] text-[#C5A880] tracking-[0.4em] uppercase block">HIGH-TICKET RECURRING CURATIONS</span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F5F3] tracking-wide">
              The Roaster’s <span className="italic">Alliance</span>
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#A3A3A3] font-light max-w-lg leading-relaxed">
              Unlock priority reserve crops and custom thermodynamic allocations. Shipped fresh within 24 hours of roasting directly to your workspace.
            </p>
          </div>

          {/* Configuration / Portal Multi-Tabs */}
          <div className="flex border border-[#262626] bg-[#080808] p-1 rounded-none shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveTab('config')}
              className={`px-5 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors rounded-none cursor-pointer ${
                activeTab === 'config' ? 'bg-[#C5A880] text-[#080808] font-bold' : 'text-[#A3A3A3] hover:text-[#F5F5F3]'
              }`}
            >
              MEMBERSHIP TIERS
            </button>
            <button
              onClick={() => setActiveTab('portal')}
              className={`px-5 py-2 font-mono text-[10px] tracking-widest uppercase transition-colors rounded-none relative cursor-pointer ${
                activeTab === 'portal' ? 'bg-[#C5A880] text-[#080808] font-bold' : 'text-[#A3A3A3] hover:text-[#F5F5F3]'
              }`}
            >
              SUBSCRIBER PORTAL
              {userSub.status === 'active' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[#080808]" />
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Panel Display */}
        {activeTab === 'config' ? (
          /* CONFIGURATOR PAGE */
          <div className="space-y-12">
            
            {/* Toggle Monthly/Annual switch */}
            <div className="flex items-center justify-center space-x-4 bg-[#121212] p-4 border border-[#262626]/40 max-w-md mx-auto rounded-none">
              <span className={`font-mono text-[10px] tracking-widest uppercase ${billingCycle === 'monthly' ? 'text-[#C5A880] font-semibold' : 'text-[#A3A3A3]'}`}>
                BILL MONHTLY
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                className="relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border border-neutral-700 bg-[#080808] transition-colors duration-300 focus:outline-none"
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-[#C5A880] shadow ring-0 transition duration-300 ease-in-out mt-[2px] ${
                    billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <div className="flex items-center space-x-1.5">
                <span className={`font-mono text-[10px] tracking-widest uppercase ${billingCycle === 'annual' ? 'text-[#C5A880] font-semibold' : 'text-[#A3A3A3]'}`}>
                  BILL ANNUALLY
                </span>
                <span className="font-mono text-[8.5px] bg-[#C5A880]/15 text-[#C5A880] px-2 py-0.5 rounded-none font-bold">
                  SAVE 15%
                </span>
              </div>
            </div>

            {/* Displaying Tiers Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch pt-4">
              {SUBSCRIPTION_TIERS.map((tier) => {
                const isUserActiveTier = userSub.tierId === tier.id;
                const monthlyCost = tier.priceMonthly;
                const annualCost = tier.priceAnnual;
                const displayedPrice = billingCycle === 'monthly' ? monthlyCost : annualCost;
                
                return (
                  <div
                    key={tier.id}
                    className={`bg-[#121212] border p-8 rounded-none flex flex-col justify-between h-full relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                      isUserActiveTier 
                        ? 'border-[#C5A880] shadow-[0_12px_45px_rgba(197,168,128,0.03)]' 
                        : 'border-[#262626] hover:border-neutral-700'
                    }`}
                  >
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-[#1A1A1A] border border-[#262626] text-[#A3A3A3] font-mono text-[8px] tracking-widest px-2.5 py-0.5 rounded-none uppercase">
                      {tier.badge}
                    </div>

                    <div className="space-y-6 text-left">
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-light text-[#F5F5F3]">{tier.name}</h3>
                        <p className="font-sans text-[11px] text-[#A3A3A3]/80 tracking-wide font-light">{tier.tagline}</p>
                      </div>

                      {/* Pricing block */}
                      <div className="py-4 border-y border-[#262626]/40 flex items-baseline space-x-1.5 bg-[#121212]">
                        <span className="font-serif text-3xl font-medium text-[#F5F5F3]">${displayedPrice}</span>
                        <span className="font-mono text-[9px] text-[#A3A3A3] uppercase">
                          / month {billingCycle === 'annual' && '(Billed Annually)'}
                        </span>
                      </div>

                      {/* Benefits list */}
                      <div className="space-y-3.5 pt-2">
                        <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest uppercase block">MEMBERSHIP PRIVILEGES</span>
                        <ul className="space-y-2.5 font-sans text-xs text-[#A3A3A3] font-light">
                          {tier.perks.map((perk, pidx) => (
                            <li key={pidx} className="flex items-start space-x-2.5">
                              <Check className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                              <span className="leading-relaxed">{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Choose membership CTA */}
                    <div className="mt-8 pt-6 border-t border-[#262626]/40">
                      <button
                        onClick={() => handleOpenCheckout(tier)}
                        className={`w-full py-3.5 font-mono text-[10px] font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer ${
                          isUserActiveTier
                            ? 'bg-[#181818] text-[#C5A880] border border-[#C5A880]/30 hover:bg-[#C5A880]/10'
                            : 'bg-[#C5A880] text-[#080808] hover:bg-[#F5F5F3] hover:text-[#080808]'
                        }`}
                      >
                        {isUserActiveTier ? 'LOCK CURRENT MEMBERSHIP' : 'ENLIST IN ALLIANCE'}
                      </button>
                      <span className="font-mono text-[8px] text-[#A3A3A3]/50 block text-center mt-3 uppercase tracking-wider">
                        Earn {billingCycle === 'annual' ? '300' : '100'} Loyalty Bonus Points Instantly
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ) : (
          /* MANAGED SUBSCRIBER PORTAL PANEL */
          <div className="bg-[#121212] border border-[#262626] p-8 md:p-10 rounded-none shadow-2xl space-y-8 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262626] pb-6 bg-[#121212]">
              <div className="space-y-1">
                <span className="font-mono text-[9px] text-[#C5A880] tracking-widest uppercase">CURRENTLY SEEDED</span>
                <h3 className="font-serif text-2xl font-light text-[#F5F5F3]">
                  {activeTierDetails.name} — <span className="italic">Subscriber Portal</span>
                </h3>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-3.5 bg-[#080808] px-4.5 py-2.5 border border-[#262626]">
                <span className="font-mono text-[10px] text-[#A3A3A3] tracking-[0.15em]">STATUS:</span>
                <div className="flex items-center space-x-1.5">
                  <span className={`w-2 h-2 rounded-full ${userSub.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                  <span className="font-mono text-[10px] text-[#F5F5F3] uppercase font-bold tracking-wider">
                    {userSub.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Subscriptions parameters configurations layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Delivery Schedule Cockpit */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-sm text-[#F5F5F3] tracking-widest uppercase">DISPATCH SCHEDULE</span>
                </div>

                <div className="bg-[#080808] border border-[#262626] p-5 space-y-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[8.5px] text-[#A3A3A3] tracking-widest block">TARGET FRESH DISPATCH:</span>
                    <span className="font-serif text-lg text-[#F5F5F3] block">{userSub.nextShipDate}</span>
                  </div>

                  <div className="h-[1px] bg-[#262626]/40" />

                  <div className="space-y-3 font-mono text-[11px] text-[#A3A3A3]">
                    <div className="flex justify-between">
                      <span>Frequency:</span>
                      <span className="text-[#F5F5F3] capitalize">{userSub.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Grind Profile:</span>
                      <span className="text-[#C5A880]">{userSub.grindOption}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cycle Billing:</span>
                      <span className="text-[#F5F5F3] uppercase">{userSub.billingFrequency}</span>
                    </div>
                  </div>

                  {/* Pause, Cancel buttons */}
                  <div className="pt-3 flex space-x-2">
                    <button
                      onClick={handleTogglePause}
                      className="flex-1 border border-[#262626] hover:border-neutral-600 font-mono text-[9px] text-[#F5F5F3] uppercase tracking-widest py-2.5 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer bg-[#080808]"
                    >
                      {userSub.status === 'active' ? (
                        <>
                          <Pause className="w-3 h-3 text-amber-500 fill-current" />
                          <span>PAUSE ORDERS</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3 h-3 text-emerald-500 fill-current" />
                          <span>RESUME DISPATCH</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Preferences Configurator Form */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-sm text-[#F5F5F3] tracking-widest uppercase">COCKPIT CALIBRATOR</span>
                </div>

                <div className="bg-[#080808] border border-[#262626] p-5 space-y-4">
                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">GRIND SPECIFICATION</label>
                    <select
                      value={userSub.grindOption}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserSub(prev => ({ ...prev, grindOption: val }));
                      }}
                      className="w-full bg-[#121212] border border-[#2c2c2c] font-mono text-xs p-2.5 text-[#F5F5F3] focus:outline-none"
                    >
                      <option value="Whole Bean">Whole Bean (Highly Recommended)</option>
                      <option value="Espresso (Fine)">Espresso (Fine)</option>
                      <option value="Pour Over (Medium)">Pour Over (Medium)</option>
                      <option value="Chemex (Coarse)">Chemex (Coarse)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">SHIPMENT PACING</label>
                    <div className="grid grid-cols-3 gap-1">
                      {['weekly', 'biweekly', 'monthly'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setUserSub(prev => ({ ...prev, frequency: f as any }))}
                          className={`py-1.5 border font-mono text-[9px] tracking-wider uppercase transition-all whitespace-nowrap ${
                            userSub.frequency === f
                              ? 'border-[#C5A880] text-[#C5A880] bg-[#C5A880]/5'
                              : 'border-[#262626] text-[#A3A3A3] hover:text-[#F5F5F3]'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-left">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-widest uppercase block">NEXT SHIP ADDRESS</label>
                    <textarea
                      rows={2}
                      value={userSub.deliveryAddress}
                      onChange={(e) => {
                        const val = e.target.value;
                        setUserSub(prev => ({ ...prev, deliveryAddress: val }));
                      }}
                      className="w-full bg-[#121212] border border-[#2c2c2c] font-sans text-xs p-2.5 text-[#F5F5F3] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic shipment track progress */}
              <div className="space-y-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-[#C5A880]" />
                  <span className="font-serif text-sm text-[#F5F5F3] tracking-widest uppercase">TRACK DELIVERIES</span>
                </div>

                <div className="bg-[#080808] border border-[#262626] p-5 space-y-4 text-xs font-sans text-[#A3A3A3]">
                  <span className="font-mono text-[8.5px] text-[#C5A880] tracking-widest uppercase block mb-1">ALLIANCE SHIP TIMELINE</span>
                  
                  <div className="space-y-4 relative pl-5 border-l border-[#262626]">
                    
                    {/* Tick Active */}
                    <div className="relative">
                      <div className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#C5A880] ring-4 ring-[#080808]" />
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#F5F5F3] block">BATCH ALLOCATION COAXED</span>
                        <span className="text-[10px] text-[#neutral-400] block leading-relaxed">
                          May 28th – Your beans are locked into custom roast drum profiling.
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className={`absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full ring-4 ring-[#080808] ${userSub.status === 'active' ? 'bg-[#C5A880] animate-pulse' : 'bg-[#262626]'}`} />
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-[#F5F5F3] block uppercase">THERMO SHOCK COMING</span>
                        <span className="text-[10px] text-zinc-500 block leading-relaxed">
                          Scheduled for degassing cooling cycles on our casting grids.
                        </span>
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[24.5px] top-1 w-2.5 h-2.5 rounded-full bg-[#262626] ring-4 ring-[#080808]" />
                      <div className="space-y-0.5">
                        <span className="font-mono text-[10px] text-zinc-500 block">HAND-SEALING & OUTBOUND</span>
                        <span className="text-[10px] text-zinc-600 block leading-relaxed">
                          Shipped local courier with structural tasting cards.
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Alliance Enrollment checkout modal */}
      <AnimatePresence>
        {checkoutModalOpen && selectedTier && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (!isSuccess) setCheckoutModalOpen(false);
              }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 pointer-events-auto"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-[15%] md:left-1/2 md:right-auto md:w-full md:max-w-md md:-translate-x-1/2 bg-[#0C0C0C] border border-[#262626] p-6 shadow-2xl z-50 overflow-hidden"
            >
              
              {isSuccess ? (
                <div className="py-8 text-center space-y-4 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-[#C5A880]/15 flex items-center justify-center text-[#C5A880]">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <h4 className="font-serif text-xl font-light text-[#F5F5F3]">Securing Your Roasting Desk...</h4>
                  <p className="font-sans text-xs text-[#A3A3A3] max-w-xs leading-relaxed">
                    Connecting to deep thermodynamic queues. Shaking cast-iron drums and awarding loyalty multipliers...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6 text-left">
                  <div className="border-b border-[#262626] pb-3 flex justify-between items-center">
                    <div>
                      <span className="font-mono text-[8px] text-[#C5A880] tracking-widest block uppercase">ALLIANCE ENLISTMENT</span>
                      <h4 className="font-serif text-lg font-light text-[#F5F5F3]">{selectedTier.name}</h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutModalOpen(false)}
                      className="font-mono text-[9px] text-[#A3A3A3] hover:text-[#C5A880] uppercase"
                    >
                      X
                    </button>
                  </div>

                  <p className="font-sans text-xs text-[#A3A3A3] font-light leading-relaxed">
                    By enrolling, you are securing a recurring allocation of our absolute highest scoring and most limited single-origins, roasted dynamically on demand in Los Angeles.
                  </p>

                  <div className="bg-[#121212] border border-[#262626] p-4 font-mono text-xs space-y-2">
                    <div className="flex justify-between text-neutral-400">
                      <span>Rate Charged:</span>
                      <span className="text-[#F5F5F3] font-serif">
                        ${billingCycle === 'monthly' ? selectedTier.priceMonthly : selectedTier.priceAnnual} /mo
                      </span>
                    </div>
                    <div className="flex justify-between text-neutral-400">
                      <span>Grind Preference:</span>
                      <span className="text-[#C5A880] uppercase">{customGrind}</span>
                    </div>
                    <div className="flex justify-between border-t border-neutral-800 pt-2 font-bold text-[#F5F5F3]">
                      <span>First Bill Total:</span>
                      <span>
                        ${billingCycle === 'monthly' ? selectedTier.priceMonthly : selectedTier.priceAnnual * 12}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-[0.1em] block uppercase">CALIBRATE GRIND REFRESHED</label>
                    <select
                      value={customGrind}
                      onChange={(e) => setCustomGrind(e.target.value)}
                      className="w-full bg-[#121212] border border-[#262626] font-mono text-xs p-2 focus:outline-none text-[#F5F5F3]"
                    >
                      <option value="Whole Bean">Whole Bean</option>
                      <option value="Espresso">Espresso</option>
                      <option value="Pour Over">Pour Over</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-mono text-[9px] text-[#A3A3A3] tracking-[0.1em] block uppercase">DELIVERY DESTINATION ADDRESS</label>
                    <input
                      required
                      type="text"
                      value={customAddress}
                      onChange={(e) => setCustomAddress(e.target.value)}
                      placeholder="Street, City, State, ZIP"
                      className="w-full bg-[#121212] border border-[#262626] font-sans text-xs p-2.5 focus:outline-none text-[#F5F5F3]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-[#C5A880] text-[#080808] font-mono text-[10px] font-bold tracking-widest py-4 uppercase text-center cursor-pointer"
                    >
                      AUTHORIZE SECURE ENLISTMENT
                    </button>
                    <span className="font-mono text-[8px] text-[#A3A3A3]/50 text-center block mt-2.5">
                      SSL-128 BIT SECURE LOCK OVER COLD NODE RUNTIME ENGINES
                    </span>
                  </div>

                </form>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}
