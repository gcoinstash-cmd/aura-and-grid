import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Retreat, RetreatApplication } from '../types';
import { Check, CheckCircle } from 'lucide-react';

interface ApplicationPortalProps {
  retreats: Retreat[];
  selectedRetreat: Retreat;
  selectedLodgingId: string;
  onSelectRetreat: (retreat: Retreat) => void;
  onSelectLodging: (tierId: string) => void;
  onAddApplication: (app: RetreatApplication) => void;
  setCurrentTab: (tab: string) => void;
}

export default function ApplicationPortal({
  retreats,
  selectedRetreat,
  selectedLodgingId,
  onSelectRetreat,
  onSelectLodging,
  onAddApplication,
  setCurrentTab
}: ApplicationPortalProps) {
  // Navigation for step indicators preloaded matching the global selections
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [selectedRetreatId, setSelectedRetreatId] = useState<string>(selectedRetreat.id);
  const [selectedTierId, setSelectedTierId] = useState<string>(selectedLodgingId);
  
  // Demographic and profile state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [dietary, setDietary] = useState('');
  
  // Core intake fields
  const [intentText, setIntentText] = useState('');
  const [priorExperienceText, setPriorExperienceText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Retrieve details dynamically based on local select bindings or fallback to properties
  const formRetreat = retreats.find(r => r.id === selectedRetreatId) || selectedRetreat;
  const currentTier = formRetreat.accommodations.find(t => t.id === selectedTierId) || formRetreat.accommodations[0];

  const handleStepTransition = (nextStep: 1 | 2 | 3) => {
    // Validate fields before proceeding
    if (activeStep === 1 && nextStep > 1) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        alert('Please complete all required contact information.');
        return;
      }
    }
    if (activeStep === 2 && nextStep > 2) {
      if (!intentText.trim()) {
        alert('Please outline your message or statement of intent before proceeding.');
        return;
      }
    }
    setActiveStep(nextStep);
  };

  const handleFormSubmission = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !phone.trim() || !intentText.trim()) {
      alert('Please complete all required fields.');
      return;
    }

    const applicationRecord: RetreatApplication = {
      id: 'APP_' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      retreatId: formRetreat.id,
      retreatTitle: formRetreat.title,
      tierId: currentTier.id,
      tierName: currentTier.name,
      fullName,
      email,
      phone,
      instagram: instagram.trim() || undefined,
      dietaryRestrictions: dietary.trim() || undefined,
      callingText: intentText,
      experienceText: priorExperienceText.trim() || undefined,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    onAddApplication(applicationRecord);
    setIsSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
      
      {/* Editorial Title banner */}
      <div className="border-b border-ink/15 pb-10 mb-12 text-left">
        <span className="text-xs font-semibold tracking-[0.25em] text-ochre uppercase block mb-3">
          [ APPLICATION SYSTEM DEMO ]
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-ink leading-tight">
          Retreat Application <span className="italic">& Registration</span>
        </h1>
        <p className="text-sm text-ink/75 font-sans leading-relaxed mt-4 max-w-xl">
          Submit the application form below to preview the booking and enrollment workflow. In a live template, this creates a secure record viewable instantly inside the Host Dashboard (top right).
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="application-form-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Step indicators */}
            <div className="grid grid-cols-3 gap-4 mb-10 font-sans text-left border-b border-ink/10 pb-6">
              <button
                onClick={() => handleStepTransition(1)}
                className={`transition-all duration-300 cursor-pointer ${activeStep === 1 ? 'opacity-100 font-bold border-l-2 border-ochre pl-3' : 'opacity-40 hover:opacity-75 pl-3 border-l-2 border-transparent'}`}
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A6455] block font-bold">STEP 01</span>
                <span className="text-xs text-ink/90 font-sans tracking-wide">Contact Details</span>
              </button>

              <button
                onClick={() => handleStepTransition(2)}
                disabled={!fullName || !email || !phone}
                className={`transition-all duration-300 cursor-pointer disabled:opacity-30 ${activeStep === 2 ? 'opacity-100 font-bold border-l-2 border-ochre pl-3' : 'opacity-40 hover:opacity-75 pl-3 border-l-2 border-transparent'}`}
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A6455] block font-bold">STEP 02</span>
                <span className="text-xs text-ink/90 font-sans tracking-wide">Application details</span>
              </button>

              <button
                onClick={() => handleStepTransition(3)}
                disabled={!fullName || !email || !phone || !intentText}
                className={`transition-all duration-300 cursor-pointer disabled:opacity-30 ${activeStep === 3 ? 'opacity-100 font-bold border-l-2 border-ochre pl-3' : 'opacity-40 hover:opacity-75 pl-3 border-l-2 border-transparent'}`}
              >
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#5A6455] block font-bold">STEP 03</span>
                <span className="text-xs text-ink/90 font-sans tracking-wide">Review Details</span>
              </button>
            </div>

            {/* Main Form element */}
            <form onSubmit={handleFormSubmission} className="space-y-8 text-left font-sans">
              
              {/* STEP 1: DEMOGRAPHICS PANEL */}
              {activeStep === 1 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                        Full name <span className="text-ochre">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Eleanor Vance"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3.5 text-sm text-ink outline-hidden transition shadow-3xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                        Email address <span className="text-ochre">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. eleanor@vance-design.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3.5 text-sm text-ink outline-hidden transition shadow-3xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                        Mobile Phone Number <span className="text-ochre">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 0192-384"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3.5 text-sm text-ink outline-hidden transition shadow-3xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                        Social Profile Link <span className="text-ink/40">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. instagram.com/eleanor_vance"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3.5 text-sm text-ink outline-hidden transition shadow-3xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                      Dietary or accessibility needs <span className="text-ink/40">(Optional)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Please note any dietary preferences, sensitivities, or physical access considerations here."
                      value={dietary}
                      onChange={(e) => setDietary(e.target.value)}
                      className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3.5 text-sm text-ink outline-hidden transition shadow-3xs resize-none"
                    />
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleStepTransition(2)}
                      className="bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-xs uppercase tracking-widest font-bold py-3.5 px-8 transition rounded-sm cursor-pointer shadow-1xs"
                    >
                      Continue to retreat details
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: APPLICATION DETAILS */}
              {activeStep === 2 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                      1. Application Intent <span className="text-ochre">*</span>
                    </label>
                    <p className="text-[11px] text-ink/50 mb-3 block leading-relaxed">
                      What is your motivation for participating in this program, and what core milestones or outcomes do you wish to achieve?
                    </p>
                    <textarea
                      required
                      rows={4}
                      placeholder="Share your goals and specific interest here..."
                      value={intentText}
                      onChange={(e) => setIntentText(e.target.value)}
                      className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-4 text-sm text-ink outline-hidden transition shadow-3xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-bold mb-2">
                      2. Relevant Background & Experience <span className="text-ink/40">(Optional)</span>
                    </label>
                    <p className="text-[11px] text-ink/50 mb-3 block leading-relaxed">
                      Briefly describe any related workshops, physical development training, or design seminars you have attended.
                    </p>
                    <textarea
                      rows={3}
                      placeholder="Let us know what programs or focus work you are already accustomed to..."
                      value={priorExperienceText}
                      onChange={(e) => setPriorExperienceText(e.target.value)}
                      className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-4 text-sm text-ink outline-hidden transition shadow-3xs"
                    />
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(1)}
                      className="border border-ink/20 hover:border-ink/50 text-ink/80 hover:text-ink text-xs uppercase tracking-widest font-bold py-3.5 px-6 transition rounded-sm cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStepTransition(3)}
                      className="bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-xs uppercase tracking-widest font-bold py-3.5 px-8 transition rounded-sm cursor-pointer shadow-1xs"
                    >
                      Proceed to review
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: LOGISTICS SELECTION & VERIFY */}
              {activeStep === 3 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Choose programmatic location */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-semibold mb-2">
                        Select retreat
                      </label>
                      <select
                        value={selectedRetreatId}
                        onChange={(e) => {
                          setSelectedRetreatId(e.target.value);
                          const target = retreats.find(r => r.id === e.target.value);
                          if (target) {
                            onSelectRetreat(target);
                            if (target.accommodations[0]) {
                              setSelectedTierId(target.accommodations[0].id);
                              onSelectLodging(target.accommodations[0].id);
                            }
                          }
                        }}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3 text-sm text-ink outline-hidden cursor-pointer shadow-3xs font-medium"
                      >
                        {retreats.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title} ({r.location})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Choose Accommodation tier */}
                    <div>
                      <label className="block text-[10px] font-mono uppercase tracking-[0.18em] text-[#5A6455] font-semibold mb-2">
                        Select accommodation
                      </label>
                      <select
                        value={selectedTierId}
                        onChange={(e) => {
                          setSelectedTierId(e.target.value);
                          onSelectLodging(e.target.value);
                        }}
                        className="w-full bg-white border border-ink/15 focus:border-ochre rounded-sm p-3 text-sm text-ink outline-hidden cursor-pointer shadow-3xs font-medium"
                      >
                        {formRetreat.accommodations.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} — ${t.price} USD
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Pricing Verification Summary Panel */}
                  <div className="border border-ink/15 bg-[#FBF9F6] p-6 rounded-sm shadow-xs space-y-4">
                    <span className="text-[10px] font-mono text-[#5A6455] font-bold uppercase tracking-widest block border-b border-ink/10 pb-2">
                      Selected Accommodation Details
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="font-serif text-lg font-light text-ink tracking-wide">{currentTier.name}</h4>
                        <p className="text-xs text-ink/65 leading-relaxed mt-1 max-w-lg">{currentTier.description}</p>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <span className="font-serif text-2xl font-light text-[#5A6455]">${currentTier.price}</span>
                        <span className="text-[10px] text-ink/50 uppercase block font-medium mt-0.5">{currentTier.paymentPlan}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-ink/10 pt-6 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setActiveStep(2)}
                      className="border border-ink/20 hover:border-ink/50 text-ink/80 hover:text-ink text-xs uppercase tracking-widest font-bold py-3.5 px-6 transition rounded-sm cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="bg-[#5A6455] hover:bg-ink text-white text-xs uppercase tracking-widest font-bold py-4 px-10 transition duration-300 rounded-sm cursor-pointer shadow-md inline-flex items-center space-x-2"
                    >
                      <Check size={14} />
                      <span>Submit Application</span>
                    </button>
                  </div>
                </motion.div>
              )}

            </form>
          </motion.div>
        ) : (
          <motion.div
            key="application-success"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-ink/10 bg-white shadow-lg p-10 md:p-16 text-center max-w-xl mx-auto rounded-sm space-y-6"
          >
            <div className="h-16 w-16 bg-[#5A6455]/10 flex items-center justify-center rounded-full mx-auto">
              <CheckCircle className="text-[#5A6455]" size={36} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] tracking-[0.25em] font-mono text-[#5A6455] font-bold block uppercase">
                // APPLICATION SUBMITTED SUCCESSFULLY!
              </span>
              <h2 className="font-serif text-3xl font-light text-ink">
                Application Received
              </h2>
            </div>

            <p className="text-xs text-ink/70 font-sans leading-relaxed">
              Your registration profile has been successfully logged. In a live template setup, a secure database record would be created, and an email would be dispatched to coordinate next steps.
            </p>

            <div className="p-4 border border-[#C4A482]/20 bg-[#FBF9F6] rounded-sm text-left">
              <span className="text-[9px] font-mono text-[#C4A482] uppercase block mb-1">Host dashboard note</span>
              <p className="text-[10px] text-ink/75 leading-relaxed font-sans">
                You can now expand the <strong className="text-ink">Applications</strong> panel at the top right of the navigation bar to inspect your newly registered details in the demo dashboard.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => {
                  setFullName('');
                  setEmail('');
                  setPhone('');
                  setInstagram('');
                  setDietary('');
                  setIntentText('');
                  setPriorExperienceText('');
                  setIsSubmitted(false);
                  setActiveStep(1);
                }}
                className="border border-ink/20 hover:border-ink/50 text-ink/80 hover:text-ink text-[10px] uppercase tracking-widest font-bold py-3.5 px-6 transition duration-300 rounded-sm cursor-pointer"
              >
                Submit another application
              </button>
              <button
                onClick={() => {
                  setCurrentTab('portfolio');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-[10px] uppercase tracking-[0.18em] font-bold py-3.5 px-6 transition duration-300 rounded-sm cursor-pointer"
              >
                Return to retreats
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
