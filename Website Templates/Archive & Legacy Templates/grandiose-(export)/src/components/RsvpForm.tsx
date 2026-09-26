/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { RSVPResponse } from "../types";
import { Check, Mail, ShieldCheck, ChevronRight } from "lucide-react";

interface RsvpFormProps {
  defaultEventName?: string;
  onSuccess: (data: RSVPResponse) => void;
  onCancel?: () => void;
}

export default function RsvpForm({ defaultEventName = "Selected Atmosphere", onSuccess, onCancel }: RsvpFormProps) {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<RSVPResponse>({
    fullName: "",
    email: "",
    attendance: "",
    guestCount: 1,
    dietaryRestrictions: [],
    accommodationPreference: "Standard Suite",
    customRequests: "",
  });

  const [dietInput, setDietInput] = useState("");
  const [waxSealPressed, setWaxSealPressed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAttendanceChange = (val: "accept" | "decline") => {
    setFormData({ ...formData, attendance: val });
    setErrorMsg("");
  };

  const nextStep = () => {
    if (step === 1) {
      if (!formData.fullName.trim()) {
        setErrorMsg("Please provide your full name.");
        return;
      }
      if (!formData.email.trim() || !formData.email.includes("@")) {
        setErrorMsg("Please enter a valid luxury mailing address.");
        return;
      }
      if (!formData.attendance) {
        setErrorMsg("Please declare your RSVP status.");
        return;
      }
    }
    setErrorMsg("");
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setErrorMsg("");
    setStep((prev) => prev - 1);
  };

  const addDietary = (item: string) => {
    if (formData.dietaryRestrictions.includes(item)) {
      setFormData({
        ...formData,
        dietaryRestrictions: formData.dietaryRestrictions.filter((x) => x !== item),
      });
    } else {
      setFormData({
        ...formData,
        dietaryRestrictions: [...formData.dietaryRestrictions, item],
      });
    }
  };

  const handleCustomDietAdd = () => {
    if (dietInput.trim()) {
      if (!formData.dietaryRestrictions.includes(dietInput.trim())) {
        setFormData({
          ...formData,
          dietaryRestrictions: [...formData.dietaryRestrictions, dietInput.trim()],
        });
      }
      setDietInput("");
    }
  };

  const sealInvitation = () => {
    setWaxSealPressed(true);
    setTimeout(() => {
      onSuccess(formData);
    }, 1200);
  };

  return (
    <div className="w-full max-w-2xl mx-auto border border-neutral-800 bg-[#0B0B0B] text-stark-white p-8 md:p-14 relative shadow-2xl shadow-black/90 overflow-hidden" id="rsvp-invitation-wizard">
      
      {/* Absolute graphic lines representing architectural alignment */}
      <div className="absolute top-0 bottom-0 left-6 w-[1px] bg-neutral-900/45 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-6 w-[1px] bg-neutral-900/45 pointer-events-none" />
      <div className="absolute top-6 left-0 right-0 h-[1px] bg-neutral-900/45 pointer-events-none" />
      <div className="absolute bottom-6 left-0 right-0 h-[1px] bg-neutral-900/45 pointer-events-none" />

      {/* Header Info */}
      <div className="text-center relative z-10 pt-4 pb-8 border-b border-neutral-900">
        <span className="text-[9px] tracking-[0.4em] text-neutral-400 uppercase block font-sans">
          PRIVATE OFFICE RSVP SERVICE
        </span>
        <h3 className="text-3xl md:text-4xl font-serif text-stark-white mt-2 font-light tracking-wide italic">
          L&apos;Invitation d&apos;Élite
        </h3>
        <p className="text-[10px] tracking-widest text-neutral-500 uppercase font-sans mt-3">
          ATMOSPHERE: <span className="text-white italic font-serif text-xs leading-none normal-case">{defaultEventName}</span>
        </p>

        {/* Step dots */}
        <div className="flex justify-center gap-3 mt-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-[1.5px] transition-all duration-500 ${
                step === s ? "w-10 bg-white" : "w-2 bg-neutral-800"
              }`}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="my-4 bg-red-950/20 border border-red-900/30 text-red-100/90 p-3 text-xs text-center font-sans tracking-wide">
          {errorMsg}
        </div>
      )}

      {/* Step Contents */}
      <div className="relative z-10 py-8 min-h-[300px]">
        
        {/* STEP 1: GUEST CREDENTIALS */}
        {step === 1 && (
          <div className="space-y-8">
            <h4 className="text-xs font-sans text-neutral-400 uppercase tracking-[0.25em] text-center mb-6">
              I. CREDENTIALS DEFINITION
            </h4>
            
            <div className="space-y-2 group relative">
              <label className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans">
                NOM COMPLET / FULL NAME
              </label>
              <div className="relative border-b border-neutral-800 pb-1">
                <input
                  id="rsvp-input-fullname"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-transparent py-4 text-sm text-white focus:outline-none placeholder:font-sans placeholder:font-light placeholder:tracking-[0.2em] placeholder:text-neutral-600 focus:placeholder:opacity-30 font-sans transition-all"
                />
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-left pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2 group relative">
              <label className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans">
                ADRESSE COURRIEL / EMAIL ADDRESS
              </label>
              <div className="relative border-b border-neutral-800 pb-1">
                <input
                  id="rsvp-input-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email Address"
                  className="w-full bg-transparent pl-8 py-4 text-sm text-white focus:outline-none placeholder:font-sans placeholder:font-light placeholder:tracking-[0.18em] placeholder:text-neutral-600 focus:placeholder:opacity-30 font-sans transition-all"
                />
                <Mail size={13} className="absolute left-1 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none group-focus-within:text-white transition-colors duration-300" />
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-left pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <span className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans text-center">
                RESPONDEZ S&apos;IL VOUS PLAÎT / ACCORDANCE OF PRESENCE
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  id="attendance-accept"
                  onClick={() => handleAttendanceChange("accept")}
                  className={`py-4 border text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-sans ${
                    formData.attendance === "accept"
                      ? "bg-white text-black border-white font-semibold"
                      : "bg-transparent border-neutral-900 text-neutral-400 hover:border-neutral-500"
                  }`}
                >
                  ACCEPTE AVEC JOIE
                </button>
                <button
                  type="button"
                  id="attendance-decline"
                  onClick={() => handleAttendanceChange("decline")}
                  className={`py-4 border text-[10px] uppercase tracking-[0.2em] transition-all cursor-pointer font-sans ${
                    formData.attendance === "decline"
                      ? "bg-red-950/30 text-red-200 border-red-900"
                      : "bg-transparent border-neutral-900 text-neutral-400 hover:border-red-900/40"
                  }`}
                >
                  DÉCLINE AVEC REGRET
                </button>
              </div>
            </div>

            <button
              type="button"
              id="rsvp-next-btn-st1"
              onClick={nextStep}
              className="w-full mt-6 relative group overflow-hidden border border-neutral-800 hover:border-white py-4 px-10 text-xs tracking-[0.35em] uppercase font-sans text-center text-white transition-colors duration-500 ease-out bg-transparent cursor-pointer"
            >
              <span className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-semibold">
                Proceed to Details
              </span>
            </button>
          </div>
        )}

        {/* STEP 2: DETAILS & PREFERENCES */}
        {step === 2 && (
          <div className="space-y-6">
            <h4 className="text-xs font-sans text-neutral-400 uppercase tracking-[0.25em] text-center mb-6">
              II. DES PRÉFÉRENCES & ALCHIMIE
            </h4>

            {formData.attendance === "decline" ? (
              <div className="text-center p-8 bg-neutral-950 border border-neutral-800 text-neutral-400 text-xs py-12">
                <p className="font-serif italic text-lg mb-2 text-white">Nous sommes attristés.</p>
                <p className="font-sans font-light tracking-wide max-w-sm mx-auto leading-relaxed">
                  We regret your absence. You may still write notes or regards for our registry on the subsequent panel.
                </p>
                
                <button
                  type="button"
                  onClick={nextStep}
                  className="mt-6 relative group overflow-hidden border border-neutral-800 hover:border-white py-4 px-10 text-[10px] tracking-[0.3em] uppercase font-sans text-center text-white transition-colors duration-500 ease-out bg-transparent cursor-pointer"
                >
                  <span className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-semibold">
                    Continue to Notes
                  </span>
                </button>
              </div>
            ) : (
              <>
                {/* Guest counter */}
                <div className="flex justify-between items-center bg-neutral-950 p-5 border border-neutral-800">
                  <div>
                    <span className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans font-medium">
                      SEATS TO RESERVE / PLACES
                    </span>
                    <span className="font-sans text-[10px] text-neutral-500">Maximum 4 guest credentials per token</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      id="decrease-guests"
                      onClick={() => setFormData({ ...formData, guestCount: Math.max(1, formData.guestCount - 1) })}
                      className="w-10 h-10 border border-neutral-800 hover:border-white focus:border-white hover:bg-neutral-900 transition-colors flex items-center justify-center text-sm font-light cursor-pointer text-white"
                    >
                      -
                    </button>
                    <span className="font-sans text-sm font-semibold text-white w-6 text-center">
                      {formData.guestCount}
                    </span>
                    <button
                      type="button"
                      id="increase-guests"
                      onClick={() => setFormData({ ...formData, guestCount: Math.min(4, formData.guestCount + 1) })}
                      className="w-10 h-10 border border-neutral-800 hover:border-white focus:border-white hover:bg-neutral-900 transition-colors flex items-center justify-center text-sm font-light cursor-pointer text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Dietary Restriction Preselects */}
                <div className="space-y-3">
                  <span className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans font-medium">
                    DIETARY PREFERENCES / EXPERIENCES
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {["Classic Tasting", "Vegetarian Flight", "Halal Curated", "Caviar Alternative", "No Scent Dispersers"].map((diet) => {
                      const active = formData.dietaryRestrictions.includes(diet);
                      return (
                        <button
                          key={diet}
                          type="button"
                          id={`diet-${diet.replace(/\s+/g, '-').toLowerCase()}`}
                          onClick={() => addDietary(diet)}
                          className={`p-3.5 text-left border flex items-center justify-between font-sans font-light tracking-wider transition-all cursor-pointer ${
                            active ? "border-white bg-[#111] text-white" : "border-neutral-800 bg-neutral-950/40 text-neutral-400 hover:border-neutral-600"
                          }`}
                        >
                          <span className="text-[11px] uppercase tracking-wider">{diet}</span>
                          <div className={`w-2.5 h-2.5 rounded-full flex items-center justify-center ${active ? "bg-white" : "bg-transparent border border-neutral-800"}`}>
                            {active && <Check size={6} className="text-black" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Add Custom dietary restriction */}
                  <div className="flex gap-2 pt-2 group relative">
                    <div className="flex-1 border-b border-neutral-800 relative pb-1">
                      <input
                        type="text"
                        value={dietInput}
                        onChange={(e) => setDietInput(e.target.value)}
                        placeholder="Other allergies or notes..."
                        className="w-full bg-transparent py-2.5 text-xs text-white focus:outline-none placeholder:font-sans placeholder:font-light placeholder:text-neutral-600"
                      />
                      <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-left pointer-events-none" />
                    </div>
                    <button
                      type="button"
                      id="add-custom-diet"
                      onClick={handleCustomDietAdd}
                      className="bg-transparent text-white px-5 border border-neutral-800 hover:border-white text-[10px] uppercase tracking-widest transition-all cursor-pointer font-sans"
                    >
                      ADD
                    </button>
                  </div>
                </div>

                {/* Suite preference */}
                <div className="space-y-2">
                  <span className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans font-medium">
                    ACCOMMODATION SUITE
                  </span>
                  <select
                    value={formData.accommodationPreference}
                    onChange={(e) => setFormData({ ...formData, accommodationPreference: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 px-4 py-3 text-xs text-neutral-300 focus:outline-none focus:border-white focus:ring-0 font-sans tracking-wide"
                  >
                    <option value="Imperial Suite (Villa Sourced)">Imperial Suite (Villa Sourced)</option>
                    <option value="Executive Observatory Balcony">Executive Observatory Balcony</option>
                    <option value="None (Arranging Independent Lodge)">None (Arranging Independent Lodge)</option>
                  </select>
                </div>
                
                <button
                  type="button"
                  id="rsvp-next-btn-st2"
                  onClick={nextStep}
                  className="w-full mt-6 relative group overflow-hidden border border-neutral-800 hover:border-white py-4 px-10 text-xs tracking-[0.35em] uppercase font-sans text-center text-white transition-colors duration-500 ease-out bg-transparent cursor-pointer"
                >
                  <span className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                  <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-semibold">
                    Proceed to Confirmation
                  </span>
                </button>
              </>
            )}
          </div>
        )}

        {/* STEP 3: REFINEMENT & REVELATION */}
        {step === 3 && (
          <div className="space-y-6 text-center">
            <h4 className="text-xs font-sans text-neutral-400 uppercase tracking-[0.25em] text-center mb-6">
              III. FINAL AUDIT
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto font-sans font-light">
              By requesting an invitation to this exclusive environment, your credentials will be formatted into our encrypted registry. Scent and acoustic profile compliance keys will be generated upon confirmation email.
            </p>

            <div className="space-y-2 text-left pt-2 group relative">
              <label className="text-[9.5px] tracking-[0.25em] uppercase text-neutral-500 block font-sans font-medium">
                SIGNATURE CUSTOM GREETS / SPECIAL ACCOMPANIMENTS (OPTIONAL)
              </label>
              <div className="relative border-b border-neutral-800 pb-1">
                <textarea
                  value={formData.customRequests}
                  onChange={(e) => setFormData({ ...formData, customRequests: e.target.value })}
                  placeholder="Specify yacht transfer requirements, dietary sensitivities or other arrangements..."
                  rows={3}
                  className="w-full bg-transparent py-3 text-xs text-white focus:outline-none placeholder:font-sans placeholder:font-light placeholder:text-neutral-600 focus:placeholder:opacity-30 tracking-wide font-sans resize-none"
                />
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-white scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 ease-out origin-left pointer-events-none" />
              </div>
            </div>

            {/* Statement piece submit button with luxury color inversion */}
            <div className="flex flex-col items-center justify-center py-6 space-y-6">
              <button
                type="button"
                id="wax-seal-button"
                onClick={sealInvitation}
                disabled={waxSealPressed}
                className="w-full relative group overflow-hidden border border-neutral-600 hover:border-white py-5 px-10 text-xs tracking-[0.35em] uppercase font-sans text-center text-white transition-all duration-500 ease-out bg-transparent disabled:opacity-50 cursor-pointer active:scale-95"
              >
                <span className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                <span className="relative z-10 text-white group-hover:text-black transition-colors duration-500 font-semibold tracking-widest">
                  {waxSealPressed ? "Securing Invitation..." : "Request Invitation"}
                </span>
              </button>
              
              <div className="flex items-center gap-2 text-neutral-500 text-[9px] tracking-[0.3em] uppercase mt-2 font-mono">
                <ShieldCheck size={12} className="text-neutral-400" />
                <span>{waxSealPressed ? "COMMITTING TO SECURITY CHRONIQUE" : "PRESS TO SUBMIT SECURE CREDENTIALS"}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center relative z-10 border-t border-neutral-900 pt-6 mt-4">
        {step > 1 ? (
          <button
            type="button"
            id="rsvp-prev"
            onClick={prevStep}
            disabled={waxSealPressed}
            className="text-[10px] uppercase font-sans tracking-[0.25em] text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            &larr; Go Back
          </button>
        ) : (
          <button
            type="button"
            id="rsvp-cancel"
            onClick={onCancel}
            className="text-[10px] uppercase font-sans tracking-[0.25em] text-neutral-500 hover:text-white transition-colors duration-300 cursor-pointer"
          >
            Cancel Post
          </button>
        )}

        {step < 3 ? (
          <span className="text-[10px] font-sans text-neutral-600 uppercase tracking-[0.2em]">
            Step {step} of 3
          </span>
        ) : (
          <span className="text-[10px] font-sans text-neutral-600 uppercase tracking-[0.25em]">
            Final Audit
          </span>
        )}
      </div>
    </div>
  );
}
