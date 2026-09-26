import React, { useState } from "react";
import { FittingPreferences } from "../types";
import { Check, ShieldCheck, ArrowRight, ArrowLeft, Ruler, Activity, Sparkles, Clipboard } from "lucide-react";
import { motion } from "motion/react";

export default function SizingPortal() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FittingPreferences>({
    fittingType: "custom",
    archProfile: "neutral",
    instepProfile: "standard",
    fullName: "",
    email: "",
    notes: "",
  });
  
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string>("");

  const handleFieldChange = (key: keyof FittingPreferences, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setValidationError("");
  };

  const handleNextStep = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setValidationError("An elite commission requires a complete registrar name.");
      return;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setValidationError("Please enter a valid electronic communication address.");
      return;
    }
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      fittingType: "custom",
      archProfile: "neutral",
      instepProfile: "standard",
      fullName: "",
      email: "",
      notes: "",
    });
    setStep(1);
    setHasSubmitted(false);
  };

  return (
    <section
      className="py-24 bg-bg-primary border-t border-bg-tertiary relative"
      id="sizing-architect-portal"
    >
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Header Indicator */}
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono tracking-[0.3em] text-accent block uppercase">
            REGISTRAR PORTAL
          </span>
          <h2 className="font-display font-light text-4xl md:text-5xl text-[#FFFFFF] tracking-tight">
            The Sizing Architect Portal
          </h2>
          <p className="text-text-secondary text-sm font-sans font-light max-w-xl mx-auto leading-relaxed">
            Avoid bulk production mismatches. Commission a physiological footprint parameter matrix to align 
            your footwear with perfect bone symmetry.
          </p>
        </div>

        {/* Outer Form Frame */}
        <div className="bg-bg-secondary border border-bg-tertiary p-6 md:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Decorative Pattern */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-bl-full pointer-events-none" />

          {!hasSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Stepper Progress bar */}
              <div className="flex items-center justify-between pb-6 border-b border-bg-tertiary">
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono px-2 py-0.5 ${step >= 1 ? "bg-accent text-[#0A0A0A] font-semibold" : "bg-bg-tertiary text-text-secondary"}`}>
                    01
                  </span>
                  <span className="text-xs font-mono text-text-primary hidden sm:inline">BASE COMMISSION</span>
                </div>
                <div className="h-px bg-bg-tertiary flex-1 mx-4" />
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono px-2 py-0.5 ${step >= 2 ? "bg-accent text-[#0A0A0A] font-semibold" : "bg-bg-tertiary text-text-secondary"}`}>
                    02
                  </span>
                  <span className="text-xs font-mono text-text-primary hidden sm:inline">PHYSIOLOGICAL PROFILE</span>
                </div>
                <div className="h-px bg-bg-tertiary flex-1 mx-4" />
                <div className="flex items-center space-x-2">
                  <span className={`text-xs font-mono px-2 py-0.5 ${step >= 3 ? "bg-accent text-[#0A0A0A] font-semibold" : "bg-bg-tertiary text-text-secondary"}`}>
                    03
                  </span>
                  <span className="text-xs font-mono text-text-primary hidden sm:inline">REGISTRATION PASS</span>
                </div>
              </div>

              {/* STEP 1: The Base Commissioning Type */}
              {step === 1 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-text-primary">Step 1: Choose Your Sizing Archetype</h3>
                    <p className="text-text-secondary text-xs font-sans font-light">
                      Standard sizing tracks worldwide patterns. Custom sizing commissions a hand-carved wood last unique to your skeletal model.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option A: Standard Sizing */}
                    <div
                      onClick={() => handleFieldChange("fittingType", "standard")}
                      className={`p-6 border transition-luxury cursor-pointer flex flex-col justify-between h-48 select-none ${
                        formData.fittingType === "standard"
                          ? "bg-bg-primary border-accent"
                          : "bg-bg-primary/40 border-bg-tertiary hover:border-accent/40"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <Ruler className="w-6 h-6 text-text-secondary group-hover:text-accent" />
                        {formData.fittingType === "standard" && (
                          <span className="text-accent text-xs font-mono font-semibold">[ ACTIVE ]</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-text-primary font-medium">Standard Fitting Matrix</h4>
                        <p className="text-[11px] text-[#8E8E93] font-light mt-1">
                          Standard parameters covering size 7 to 12. Fits symmetrical feet without custom correction requirements.
                        </p>
                      </div>
                    </div>

                    {/* Option B: Custom Last Commissioning */}
                    <div
                      onClick={() => handleFieldChange("fittingType", "custom")}
                      className={`p-6 border transition-luxury cursor-pointer flex flex-col justify-between h-48 select-none ${
                        formData.fittingType === "custom"
                          ? "bg-bg-primary border-accent animate-pulse-slow"
                          : "bg-bg-primary/40 border-bg-tertiary hover:border-accent/40"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <Activity className="w-6 h-6 text-accent" />
                        {formData.fittingType === "custom" && (
                          <span className="text-accent text-xs font-mono font-semibold">[ ELITE ACTIVE ]</span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-display text-lg text-accent font-medium">Bespoke Last Commissioning</h4>
                        <p className="text-[11px] text-[#8E8E93] font-light mt-1">
                          Hand-carved hornbeam wood last cast exactly to your physiological scan data. Reusable for all subsequent orders.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Physiological Profile (Arch Profile vs Instep Profile) + NEW Live Metric Summary Panel */}
              {step === 2 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start animate-fadeIn" id="step-2-layout">
                  {/* Left Column: Input Selectors */}
                  <div className="md:col-span-7 space-y-8" id="profile-selectors-col">
                    <div className="space-y-2">
                      <h3 className="font-display text-xl text-text-primary">Step 2: Anatomical Proportional Metrics</h3>
                      <p className="text-text-secondary text-xs font-sans font-light leading-relaxed">
                        Define the skeletal behavior of your tarsal arches and your instep volume to allow the artisan to establish correct toe waist ratios.
                      </p>
                    </div>

                    {/* Arch Profile Button Selector */}
                    <div className="space-y-3" id="arch-profile-selector-group">
                      <span className="block text-[10px] font-mono tracking-widest text-[#FFFFFF] uppercase">
                        1. Arch Height Profile
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {["low", "neutral", "high"].map((arch) => (
                          <button
                            key={arch}
                            type="button"
                            onClick={() => handleFieldChange("archProfile", arch as FittingPreferences["archProfile"])}
                            className={`py-3.5 px-4 font-mono text-xs border uppercase tracking-widest transition-luxury cursor-pointer ${
                              formData.archProfile === arch
                                ? "bg-accent border-accent text-[#0A0A0A] font-semibold"
                                : "bg-bg-primary border-bg-tertiary text-text-secondary hover:border-accent/40"
                            }`}
                            id={`arch-${arch}-btn`}
                          >
                            {arch} ARCH
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Instep Profile Button Selector */}
                    <div className="space-y-3" id="instep-profile-selector-group">
                      <span className="block text-[10px] font-mono tracking-widest text-[#FFFFFF] uppercase">
                        2. Instep Volume Proportions
                      </span>
                      <div className="grid grid-cols-3 gap-3">
                        {["sleek", "standard", "robust"].map((is) => (
                          <button
                            key={is}
                            type="button"
                            onClick={() => handleFieldChange("instepProfile", is as FittingPreferences["instepProfile"])}
                            className={`py-3.5 px-4 font-mono text-xs border uppercase tracking-widest transition-luxury cursor-pointer ${
                              formData.instepProfile === is
                                ? "bg-accent border-accent text-[#0A0A0A] font-semibold"
                                : "bg-bg-primary border-bg-tertiary text-text-secondary hover:border-accent/40"
                            }`}
                            id={`instep-${is}-btn`}
                          >
                            {is}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Metric Summary Panel */}
                  <div className="md:col-span-5 bg-bg-secondary/40 border border-bg-tertiary p-5 flex flex-col justify-between space-y-6 relative overflow-hidden" id="live-metric-summary-panel">
                    {/* Top Status Header */}
                    <div className="flex items-center justify-between border-b border-bg-tertiary/60 pb-3" id="live-panel-header">
                      <div className="flex items-center space-x-2">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        <span className="text-[9px] font-mono tracking-wider text-text-primary uppercase">
                          SENSING MATRIX ACTIVE
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-accent">
                        v3.1_DEC
                      </span>
                    </div>

                    {/* Graphic Wireframe & Diagnostics */}
                    <div className="relative py-4 border border-bg-tertiary/40 rounded-sm flex flex-col items-center justify-center bg-[#070707]/60 overflow-hidden" id="live-schematic-region">
                      {/* Grid background effect */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#C5A88005_1px,transparent_1px),linear-gradient(to_bottom,#C5A88005_1px,transparent_1px)] bg-[size:14px_14px] pointer-events-none" />
                      
                      {/* Laser scanner line sweep */}
                      <motion.div
                        className="absolute left-0 right-0 h-px bg-accent/30 shadow-[0_0_8px_rgba(197,168,128,0.7)] z-0"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />

                      {/* SVG dynamic anatomic curve representation */}
                      <svg viewBox="0 0 160 80" className="w-32 h-16 relative z-10">
                        {/* Static baseline block */}
                        <line x1="10" y1="70" x2="150" y2="70" stroke="#1F1F1F" strokeWidth="2" strokeDasharray="3,3" />
                        
                        {/* Dynamic Arch Profile Curve */}
                        <motion.path
                          d={
                            formData.archProfile === "low"
                              ? "M 15 70 C 35 68, 55 68, 75 66 C 95 64, 115 67, 145 70"
                              : formData.archProfile === "high"
                              ? "M 15 70 C 35 35, 55 35, 75 40 C 95 45, 115 60, 145 70"
                              : "M 15 70 C 35 52, 55 52, 75 55 C 95 58, 115 64, 145 70" // neutral
                          }
                          fill="none"
                          stroke="var(--color-accent, #C5A880)"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          initial={false}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />

                        {/* Indication marker dots */}
                        <circle cx="75" cy={formData.archProfile === "low" ? "66" : formData.archProfile === "high" ? "40" : "55"} r="3" fill="#FFFFFF" />
                        
                        {/* Dynamic Instep Volume Shell representing instep profile envelope */}
                        <motion.path
                          d={
                            formData.instepProfile === "sleek"
                              ? "M 25 70 C 50 55, 75 50, 105 70"
                              : formData.instepProfile === "robust"
                              ? "M 25 70 C 50 36, 75 32, 105 70"
                              : "M 25 70 C 50 46, 75 42, 105 70" // standard
                          }
                          fill="rgba(197, 168, 128, 0.05)"
                          stroke="var(--color-accent, #C5A880)"
                          strokeWidth="1"
                          strokeDasharray="2,2"
                          initial={false}
                          transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                      </svg>

                      {/* Display live indicators */}
                      <div className="w-full flex justify-between px-3 mt-2 text-[8px] font-mono text-[#8E8E93] relative z-10" id="live-scan-labels">
                        <span>LATERAL SCAN PROFILE</span>
                        <span className="text-accent">MODEL CALIBRATED</span>
                      </div>
                    </div>

                    {/* Numeric Parameter Details */}
                    <div className="space-y-3 font-mono text-[11px]" id="live-parameters-display">
                      <div className="flex justify-between items-center" id="live-arch-delta">
                        <span className="text-text-secondary">Skeletal Arch Delta:</span>
                        <span className="text-accent font-semibold">
                          {formData.archProfile === "low" ? "-4.8mm" : formData.archProfile === "high" ? "+6.4mm" : "Minimal (±0.0)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center" id="live-instep-bias">
                        <span className="text-text-secondary">Instep Volume Bias:</span>
                        <span className="text-accent font-semibold">
                          {formData.instepProfile === "sleek" ? "-2.1mm" : formData.instepProfile === "robust" ? "+5.3mm" : "Standard (±0.0)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center" id="live-tarsal-load">
                        <span className="text-text-secondary">Load Dispersion Pitch:</span>
                        <span className="text-text-primary">
                          {formData.archProfile === "low" ? "12.5° (Low Apex)" : formData.archProfile === "high" ? "19.2° (Elevated)" : "15.8° (Standard)"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center" id="live-volume-envelope">
                        <span className="text-text-secondary">Waist Girth Envelope:</span>
                        <span className="text-text-primary">
                          {formData.instepProfile === "sleek" ? "Compact / Reduced" : formData.instepProfile === "robust" ? "Premium Expansion" : "Standard Radial"}
                        </span>
                      </div>
                      <div className="border-t border-bg-tertiary/40 pt-2 flex justify-between items-center" id="live-calib-code">
                        <span className="text-text-secondary text-[10px]">T-BAR ENVELOPE VALUE:</span>
                        <span className="text-accent font-bold text-[10px] tracking-wider">
                          AETH-L-{formData.archProfile.substring(0,3).toUpperCase()}-{formData.instepProfile.substring(0,3).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Diagnostic Explainer Textbox */}
                    <div className="bg-[#0A0A0A]/80 p-3 border border-bg-tertiary/60" id="live-panel-explainer">
                      <span className="block text-[8px] text-accent/80 font-semibold tracking-wider uppercase mb-1">
                        ARTISAN ADVISORY NOTE:
                      </span>
                      <p className="text-[10px] text-text-secondary leading-normal font-sans font-light">
                        {formData.archProfile === "low" && formData.instepProfile === "sleek" && "Combining low-arched support with low girth metrics. Block contours will be shaved along the waist to prevent slip."}
                        {formData.archProfile === "low" && formData.instepProfile === "standard" && "Medial wedge contour modification required. Instep girth maintains generic master last standards."}
                        {formData.archProfile === "low" && formData.instepProfile === "robust" && "Slight pronation risk. Upper pattern utilizes custom increased volume crown templates."}
                        {formData.archProfile === "neutral" && formData.instepProfile === "sleek" && "Balanced skeletal structure with clean volume metrics. The ultimate symmetrical platform base."}
                        {formData.archProfile === "neutral" && formData.instepProfile === "standard" && "Perfect matching configuration for standard master last. Out-of-box comfort index maximized."}
                        {formData.archProfile === "neutral" && formData.instepProfile === "robust" && "Standard arch vaulting combined with robust volume girth layout. Broad leather tension relief."}
                        {formData.archProfile === "high" && formData.instepProfile === "sleek" && "Raised instep bone peak but slender footbed volume. Requires custom high collar cushioning sweep."}
                        {formData.archProfile === "high" && formData.instepProfile === "standard" && "High-point pressure mitigation applied. Medium volume throat girth holds arch rigid."}
                        {formData.archProfile === "high" && formData.instepProfile === "robust" && "High vault structure with max throat volume. Custom hand-finished relief carving on the wooden last."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Registrar details submission */}
              {step === 3 && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="space-y-2">
                    <h3 className="font-display text-xl text-text-primary">Step 3: Secure Registry Pass</h3>
                    <p className="text-text-secondary text-xs font-sans font-light">
                      Input your direct details below. This generates your high-ticket digital fitting credentials.
                    </p>
                  </div>

                  {validationError && (
                    <div className="bg-red-950/20 border border-red-500/30 text-red-100 p-4 text-xs font-mono">
                      [ WARNING ] {validationError}
                    </div>
                  )}

                  {/* Inputs Group */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-mono text-accent uppercase mb-1.5">
                        Registrar/Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => handleFieldChange("fullName", e.target.value)}
                        placeholder="e.g., Lord Alistair Vance"
                        className="w-full bg-bg-primary border border-bg-tertiary p-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-accent uppercase mb-1.5">
                        Direct Electronic Address (Email)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleFieldChange("email", e.target.value)}
                        placeholder="vance@heritage-lineage.com"
                        className="w-full bg-bg-primary border border-bg-tertiary p-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-mono text-accent uppercase mb-1.5">
                      Custom Sizing Notes & Orthopedic History (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => handleFieldChange("notes", e.target.value)}
                      placeholder="Detail any past friction zones, ankle bone alignments, or bespoke preferences..."
                      className="w-full bg-bg-primary border border-bg-tertiary p-3 text-sm text-text-primary focus:border-accent focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="bg-bg-primary p-4 border border-bg-tertiary">
                    <p className="text-[10px] text-text-secondary leading-relaxed font-mono">
                      COUTIER DIRECTIVE: Submitting this form authorizes Aethel’s technical design lead to 
                      cross-compile these physical parameters against standard block templates or custom hornbeam orders.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Action Buttons footer inside the form */}
              <div className="flex justify-between items-center pt-6 border-t border-bg-tertiary">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="inline-flex items-center space-x-2 text-xs tracking-widest text-text-secondary hover:text-[#FFFFFF] transition-colors font-mono cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>[ GO BACK ]</span>
                    </button>
                  )}
                </div>

                <div>
                  {step < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="bg-bg-primary text-text-primary hover:bg-bg-tertiary border border-bg-tertiary transition-luxury px-6 py-3 text-xs font-mono uppercase tracking-widest font-semibold flex items-center space-x-2 cursor-pointer"
                    >
                      <span>CONTINUE APPLICATION</span>
                      <ArrowRight className="w-3.5 h-3.5 text-accent" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="bg-accent text-[#0A0A0A] font-mono text-xs font-bold py-3.5 px-8 rounded-none border border-accent hover:bg-transparent hover:text-accent transition-luxury cursor-pointer"
                    >
                      [ REQUEST FITTING MATRIX ]
                    </button>
                  )}
                </div>
              </div>

            </form>
          ) : (
            // Success State - Beautiful Digital fitting pass
            <div className="space-y-8 animate-fadeIn text-center">
              
              <div className="max-w-md mx-auto space-y-4">
                <div className="w-12 h-12 bg-accent/20 rounded-full border border-accent/40 flex items-center justify-center mx-auto text-accent">
                  <ShieldCheck className="w-6 h-6 animate-pulse" />
                </div>
                
                <h3 className="font-display text-2xl text-text-primary font-light">
                  Your physiological parameters have been logged.
                </h3>
                
                <p className="text-text-secondary text-xs font-sans font-light leading-relaxed">
                  An artisan will review your alignment metrics within 24 hours. We have compiled your elite fitting passport profile beneath:
                </p>
              </div>

              {/* Printable Sizing Ticket Pass */}
              <div className="max-w-md mx-auto bg-bg-primary border border-accent/20 p-6 text-left relative font-mono text-xs text-text-secondary space-y-4">
                {/* Visual barcode indicator */}
                <div className="absolute top-0 right-6 bottom-0 w-8 flex flex-col justify-between items-center py-4 border-l border-bg-tertiary select-none opacity-30">
                  <div className="h-full flex flex-col gap-[3px] items-center">
                    {[16, 24, 8, 32, 12, 16, 4, 32, 8, 20].map((h, i) => (
                      <span key={i} className="bg-accent w-5" style={{ height: `${h}px` }} />
                    ))}
                  </div>
                </div>

                <div className="border-b border-bg-tertiary pb-4">
                  <span className="text-[10px] text-accent font-semibold uppercase block">AETHEL FITPASS v3.1</span>
                  <span className="text-[8px] text-text-secondary block">REGISTRAR SYSTEM NO. #AETH-{(Math.random() * 10000).toFixed(0)}</span>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-[8px] text-accent block uppercase">COMPILER APPLICANT</span>
                    <span className="text-sm text-text-primary font-sans font-medium uppercase">{formData.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[8px] text-accent block uppercase">ELECTRONIC COMMUNICATIONS</span>
                    <span className="text-text-primary">{formData.email}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-[8px] text-accent block uppercase">COMMISSION MODEL</span>
                      <span className="text-text-primary capitalize">{formData.fittingType} Last</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-accent block uppercase">ARCH RATING</span>
                      <span className="text-text-primary capitalize">{formData.archProfile} Arch</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[8px] text-accent block uppercase">INSTEP DENSITY RATING</span>
                    <span className="text-text-primary capitalize">{formData.instepProfile} Volume</span>
                  </div>
                  {formData.notes && (
                    <div>
                      <span className="text-[8px] text-accent block uppercase">ORTHOPEDIC MEMORIES</span>
                      <p className="text-[11px] text-text-secondary font-sans leading-relaxed mt-0.5 line-clamp-2">
                        {formData.notes}
                      </p>
                    </div>
                  )}
                </div>

                <div className="border-t border-bg-tertiary pt-4 justify-between items-center flex">
                  <span className="text-[8px] uppercase">STATUS: REVIEWING</span>
                  <span className="text-[8px] text-accent">EST. DELIV: 24 HR</span>
                </div>

              </div>

              <div className="pt-4 flex justify-center items-center space-x-4">
                <button
                  onClick={handleReset}
                  className="text-xs text-text-secondary hover:text-accent font-mono underline transition-colors"
                >
                  Configure New Fittings
                </button>
                <span className="text-bg-tertiary">|</span>
                <button
                  type="button"
                  onClick={() => {
                    const matrix = document.getElementById("atelier-lookbook-matrix");
                    matrix?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-bg-tertiary text-text-primary hover:bg-accent hover:text-[#0A0A0A] font-mono text-xs py-2 px-4 transition-luxury"
                >
                  Return to Lookbook
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
