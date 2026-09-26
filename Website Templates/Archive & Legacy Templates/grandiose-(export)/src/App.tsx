/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { CURATED_EVENTS, VENDOR_DIRECTORY } from "./data";
import { RSVPResponse } from "./types";
import GalaJournal from "./components/GalaJournal";
import GalaPortfolio from "./components/GalaPortfolio";
import VendorDirectory from "./components/VendorDirectory";
import AtelierComposer from "./components/AtelierComposer";
import RsvpForm from "./components/RsvpForm";
import { BookOpen, Calendar, MapPin, Mail, Users, FileText, ChevronRight, Check, X, Sparkles, Trash2, Shield } from "lucide-react";

// Pre-filled majestic RSVPs to make the layout look immediately exquisite
const INITIAL_REGISTRY: RSVPResponse[] = [
  {
    fullName: "Archduchess Francesca von Habsburg",
    email: "francesca@habsburg-estate.at",
    attendance: "accept",
    guestCount: 2,
    dietaryRestrictions: ["Classic Tasting", "Caviar Alternative"],
    accommodationPreference: "Imperial Suite (Villa Sourced)",
    customRequests: "Dietary Directives: White Truffle Infusions Only / Saffron-Allergy Strict. Logistics: Private Airport Transfer (Tail #N700AG Reserved). Please coordinate helicopter landing sequence directly with Lake Como port authorities.",
  },
  {
    fullName: "Viscount Charles de Valois",
    email: "charles@valois-heritage.co.fr",
    attendance: "accept",
    guestCount: 2,
    dietaryRestrictions: ["Vegetarian Flight"],
    accommodationPreference: "Executive Observatory Balcony",
    customRequests: "Dietary Directives: Strictly organic micro-greens sourced from Northern Milan estate / No nightshades. Logistics: Yacht Mooring Spot #4 (65m Berthing). Requires deep acoustic wave synchronization during the evening classical string sextet performance.",
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"journal" | "portfolio" | "directory" | "atelier" | "registry">("journal");
  const [registrations, setRegistrations] = useState<RSVPResponse[]>([]);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [overrideEventName, setOverrideEventName] = useState<string>("Le Palais de Cristal");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load from local storage or prefill
  useEffect(() => {
    try {
      const stored = localStorage.getItem("grandiose-registrations-ledger");
      if (stored) {
        setRegistrations(JSON.parse(stored));
      } else {
        setRegistrations(INITIAL_REGISTRY);
        localStorage.setItem("grandiose-registrations-ledger", JSON.stringify(INITIAL_REGISTRY));
      }
    } catch (e) {
      console.error("Could not load registry draft", e);
      setRegistrations(INITIAL_REGISTRY);
    }
  }, []);

  // Update registry
  const handleRsvpSuccess = (newRsvp: RSVPResponse) => {
    const updated = [newRsvp, ...registrations];
    setRegistrations(updated);
    try {
      localStorage.setItem("grandiose-registrations-ledger", JSON.stringify(updated));
    } catch (e) {
      console.error("Could not save registry draft", e);
    }
    setIsRsvpOpen(false);
    
    // Display sweet physical seal notification
    setSuccessMessage(`${newRsvp.fullName}, your private Wax Seal is certified in our ledger.`);
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const deleteRegistration = (email: string) => {
    const updated = registrations.filter((r) => r.email !== email);
    setRegistrations(updated);
    try {
      localStorage.setItem("grandiose-registrations-ledger", JSON.stringify(updated));
    } catch (e) {
      console.error("Could not delete registration", e);
    }
  };

  const handleOpenRsvpWithEvent = (eventName: string) => {
    setOverrideEventName(eventName);
    setIsRsvpOpen(true);
  };

  return (
    <div className="min-h-screen bg-obsidian text-stark-white font-sans relative selection:bg-gold selection:text-obsidian flex flex-col justify-between">
      
      {/* Decorative premium grain overlay */}
      <div className="absolute inset-0 grain-overlay pointer-events-none z-10" />

      {/* Extreme luxury high-contrast background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-y-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-gold/5 blur-[220px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-y-1/2 translate-x-1/2 w-[550px] h-[550px] bg-charcoal-light/10 blur-[220px] rounded-full pointer-events-none" />

      {/* GLOBAL HEADER BAR */}
      <header className="border-b border-charcoal/80 bg-obsidian/90 backdrop-blur-md sticky top-0 z-40" id="global-header">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex justify-between items-center md:space-x-2 lg:space-x-6">
          
          {/* Logo Brand with custom tracking layout */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 border border-gold flex items-center justify-center font-serif text-sm font-bold text-gold shrink-0">
              G
            </div>
            <div>
              <h1 className="text-sm tracking-[0.35em] font-medium text-stark-white uppercase font-sans leading-none">
                GRANDIOSE
              </h1>
              <span className="text-[8px] tracking-[0.2em] text-[#A3842C] uppercase font-mono block mt-1">
                L'Élite d'Événements
              </span>
            </div>
          </div>

          {/* Clean UI Menu Tabs - Serif & Uppercase Sans pairing */}
          <nav className="hidden md:flex flex-nowrap items-center overflow-x-hidden max-w-[calc(100%-120px)] md:gap-2 lg:gap-8 md:text-[9px] lg:text-xs md:pr-4 lg:pr-8 font-sans shrink-0">
            <button
              id="tab-btn-journal"
              onClick={() => setActiveTab("journal")}
              className={`py-2 md:px-2 lg:px-3 tracking-[0.22em] uppercase transition-all relative cursor-pointer ${
                activeTab === "journal" ? "text-gold font-semibold" : "text-platinum/60 hover:text-stark-white"
              }`}
            >
              Le Journal
              {activeTab === "journal" && (
                <motion.div layoutId="activeHeaderGlow" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
            <button
              id="tab-btn-portfolio"
              onClick={() => setActiveTab("portfolio")}
              className={`py-2 md:px-2 lg:px-3 tracking-[0.22em] uppercase transition-all relative cursor-pointer ${
                activeTab === "portfolio" ? "text-gold font-semibold" : "text-platinum/60 hover:text-stark-white"
              }`}
            >
              La Chronique
              {activeTab === "portfolio" && (
                <motion.div layoutId="activeHeaderGlow" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
            <button
              id="tab-btn-directory"
              onClick={() => setActiveTab("directory")}
              className={`py-2 md:px-2 lg:px-3 tracking-[0.22em] uppercase transition-all relative cursor-pointer ${
                activeTab === "directory" ? "text-gold font-semibold" : "text-platinum/60 hover:text-stark-white"
              }`}
            >
              Le Bottin
              {activeTab === "directory" && (
                <motion.div layoutId="activeHeaderGlow" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
            <button
              id="tab-btn-atelier"
              onClick={() => setActiveTab("atelier")}
              className={`py-2 md:px-2 lg:px-3 tracking-[0.22em] uppercase transition-all relative cursor-pointer ${
                activeTab === "atelier" ? "text-gold font-semibold" : "text-platinum/60 hover:text-stark-white"
              }`}
            >
              La Galerie
              {activeTab === "atelier" && (
                <motion.div layoutId="activeHeaderGlow" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
            <button
              id="tab-btn-registry"
              onClick={() => setActiveTab("registry")}
              className={`py-2 md:px-2 lg:px-3 tracking-[0.22em] uppercase transition-all relative cursor-pointer ${
                activeTab === "registry" ? "text-gold font-semibold" : "text-platinum/60 hover:text-stark-white"
              }`}
            >
              Le Registre
              {activeTab === "registry" && (
                <motion.div layoutId="activeHeaderGlow" className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gold" />
              )}
            </button>
          </nav>

          {/* Action trigger button */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              id="header-rsvp-portal-btn"
              onClick={() => handleOpenRsvpWithEvent("Custom Ambience Selection")}
              className="border border-gold px-5 py-2.5 text-[9px] font-sans font-bold uppercase tracking-[0.22em] bg-charcoal-deep text-stark-white hover:bg-gold hover:text-obsidian transition-all duration-300 cursor-pointer shrink-0"
            >
              RSVP PORTAL
            </button>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden bg-charcoal-deep border-t border-charcoal text-[7.5px] font-mono tracking-wider divide-x divide-charcoal">
          <button
            onClick={() => setActiveTab("journal")}
            className={`flex-1 py-3 text-center uppercase ${activeTab === "journal" ? "text-gold bg-obsidian font-bold" : "text-platinum/60"}`}
          >
            JOURNAL
          </button>
          <button
            onClick={() => setActiveTab("portfolio")}
            className={`flex-1 py-3 text-center uppercase ${activeTab === "portfolio" ? "text-gold bg-obsidian font-bold" : "text-platinum/60"}`}
          >
            CHRONIQUE
          </button>
          <button
            onClick={() => setActiveTab("directory")}
            className={`flex-1 py-3 text-center uppercase ${activeTab === "directory" ? "text-gold bg-obsidian font-bold" : "text-platinum/60"}`}
          >
            BOTTIN
          </button>
          <button
            onClick={() => setActiveTab("atelier")}
            className={`flex-1 py-3 text-center uppercase ${activeTab === "atelier" ? "text-gold bg-obsidian font-bold" : "text-platinum/60"}`}
          >
            GALERIE
          </button>
          <button
            onClick={() => setActiveTab("registry")}
            className={`flex-1 py-3 text-center uppercase ${activeTab === "registry" ? "text-gold bg-obsidian font-bold" : "text-platinum/60"}`}
          >
            REGISTRE
          </button>
        </div>
      </header>

      {/* NOTIFICATION NOTICES */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            id="toast-notification"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 bg-gold border border-[#AA8B2C] text-obsidian px-6 py-4 rounded-none z-50 text-xs shadow-2xl font-serif italic text-center w-11/12 max-w-lg flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Sparkles size={16} className="text-obsidian shrink-0" />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-obsidian hover:scale-110 ml-4 font-mono font-bold text-[10px] cursor-pointer">
              X
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        
        {/* PREMIUM MAGAZINE UPPER HERO BLOCK */}
        <section className="bg-obsidian py-16 md:py-24 border-b border-charcoal/80 text-center relative overflow-hidden" id="magazine-main-hero">
          <div className="max-w-4xl mx-auto px-4 space-y-6 relative z-10">
            <span className="text-[10px] tracking-[0.45em] text-[#D4AF37] uppercase block font-sans font-semibold">
              PREMIUM WEB BLUEPRINT / EDITION XIV
            </span>
            <div className="h-[1px] w-12 bg-gold mx-auto" />
            <h2 className="text-5xl md:text-8xl font-serif text-stark-white font-light tracking-[0.05em] leading-tight">
              Grandiose
            </h2>
            <p className="font-script text-3xl md:text-4xl text-gold italic leading-none my-2">
              Extravagance meets spatial mathematics
            </p>
            <p className="text-xs md:text-sm tracking-[0.16em] uppercase text-platinum/60 max-w-xl mx-auto leading-relaxed font-sans font-light">
              Bespoke event structures engineered to a high-ticket dark standard. Curating olfactory notes, spatial sound waves, and architectural blueprints for the global elite.
            </p>
          </div>
          
          {/* Subtle line background layout elements simulating luxury paper */}
          <div className="absolute left-1/10 top-0 bottom-0 w-[1px] bg-charcoal/20 hidden xl:block" />
          <div className="absolute right-1/10 top-0 bottom-0 w-[1px] bg-charcoal/20 hidden xl:block" />
        </section>

        {/* INTERACTIVE TAB PANELS WITH FLOW TRANSITIONS */}
        <section className="py-8">
          <AnimatePresence mode="wait">
            
            {/* TAB 1: JOURNAL VIEW */}
            {activeTab === "journal" && (
              <motion.div
                key="journal-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <GalaJournal
                  events={CURATED_EVENTS}
                  onOpenRsvp={handleOpenRsvpWithEvent}
                />
              </motion.div>
            )}

            {/* TAB: PORTFOLIO VIEW */}
            {activeTab === "portfolio" && (
              <motion.div
                key="portfolio-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <GalaPortfolio />
              </motion.div>
            )}

            {/* TAB 2: VENDOR DIRECTORY */}
            {activeTab === "directory" && (
              <motion.div
                key="directory-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <VendorDirectory
                  vendors={VENDOR_DIRECTORY || []}
                  onContactVendor={(vendor) => {
                    handleOpenRsvpWithEvent(`Exclusive consultation: ${vendor.name}`);
                  }}
                />
              </motion.div>
            )}

            {/* TAB 3: SENSER COMPOSER */}
            {activeTab === "atelier" && (
              <motion.div
                key="atelier-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                <AtelierComposer />
              </motion.div>
            )}

            {/* TAB 4: PRIVATE REGISTRY LOGBOOK */}
            {activeTab === "registry" && (
              <motion.div
                key="registry-view"
                id="private-registry-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12"
              >
                {/* Ledger Header */}
                <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-charcoal pb-8 mb-12">
                  <div>
                    <span className="text-[10px] tracking-[0.3em] text-gold uppercase block mb-2 font-sans font-medium">
                      04 / Coordinator Credentials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif text-stark-white font-light tracking-wide">
                      Le Registre de Sécurité
                    </h2>
                  </div>
                  <p className="max-w-md text-xs tracking-wider text-platinum/70 leading-relaxed font-sans font-light mt-4 md:mt-0">
                    Audit real guest invitations, credentials, and accommodations. This log syncs with your discrete browser cache to preserve absolute silence.
                  </p>
                </div>

                {/* Main Table view formatted like high-end layout */}
                <div className="bg-charcoal-deep/35 border border-charcoal p-6 md:p-10 text-justify relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-obsidian to-transparent pointer-events-none" />

                  {registrations.length === 0 ? (
                    <div className="text-center py-24 text-platinum/40">
                      <p className="font-serif italic text-lg mb-2 text-gold">The Chamber is Silent.</p>
                      <p className="text-xs font-sans font-light max-w-sm mx-auto leading-relaxed">
                        No RSVP files exist in cache. Please complete a physical or digital submission using the RSVP Portal trigger.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6 relative z-10">
                      
                      {/* Grid lists for guest accounts */}
                      <div className="space-y-4">
                        {registrations.map((rsvp, idx) => (
                          <div
                            key={`${rsvp.email}-${idx}`}
                            id={`registry-log-card-${idx}`}
                            className="p-6 bg-obsidian border border-charcoal/80 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 group hover:border-gold/30 transition-all duration-300"
                          >
                            <div className="space-y-3 flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-3">
                                <span className="font-mono text-[9px] text-[#A3842C] tracking-widest uppercase bg-charcoal px-2.5 py-0.5">
                                  REGISTRANT 0{registrations.length - idx}
                                </span>
                                <span className={`text-[8.5px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 ${
                                  rsvp.attendance === "accept"
                                    ? "bg-emerald-950/80 border border-emerald-900 text-emerald-300"
                                    : "bg-red-950/80 border border-red-900 text-red-300"
                                }`}>
                                  {rsvp.attendance === "accept" ? "ACCEPTE AVEC JOIE" : "DECLINED WITH REGRET"}
                                </span>
                                <span className="text-[10px] text-platinum/40 font-mono">
                                  {rsvp.accommodationPreference}
                                </span>
                              </div>

                              <h4 className="text-xl font-serif text-stark-white font-medium">
                                {rsvp.fullName}
                              </h4>

                              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-platinum/60 font-sans font-light">
                                <span className="flex items-center gap-1.5"><Mail size={12} className="text-gold" /> {rsvp.email}</span>
                                <span className="flex items-center gap-1.5"><Users size={12} className="text-gold" /> Accompaniments Count: {rsvp.guestCount}</span>
                              </div>

                              {rsvp.dietaryRestrictions.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-2">
                                  {rsvp.dietaryRestrictions.map((diet) => (
                                    <span key={diet} className="text-[9px] font-mono uppercase bg-charcoal-deep border border-charcoal px-2 py-0.5 text-platinum/70">
                                      {diet}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {rsvp.customRequests && (
                                <div className="bg-charcoal-deep/50 p-3 border-l-2 border-gold font-mono text-[10px] text-[#E5E5E5]/70 mt-3 leading-relaxed">
                                  <span className="text-gold block font-sans font-semibold text-[8px] tracking-widest uppercase mb-1">COORDINATOR DIRECTIVES</span>
                                  &ldquo;{rsvp.customRequests}&rdquo;
                                </div>
                              )}
                            </div>

                            <button
                              id={`delete-registry-btn-${idx}`}
                              onClick={() => deleteRegistration(rsvp.email)}
                              className="self-end md:self-center p-3 border border-charcoal hover:border-red-950/60 text-platinum/30 hover:text-red-400 hover:bg-red-950/15 transition-all duration-300 cursor-pointer"
                              title="Expunge credentials"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>

                    </div>
                  )}

                  <div className="border-t border-charcoal/40 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center text-[9px] text-platinum/30 font-mono tracking-widest uppercase gap-4">
                    <span>SECURITY CLASSIFICATION: CONFIDENTIAL</span>
                    <span className="flex items-center gap-1.5"><Shield size={10} className="text-gold animate-pulse" /> DISCRETE HARDENED PERSISTENT ENVE</span>
                    <span>© 2026 COGNITIVE CHRONIQUE</span>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* FULL-SCREEN OVERLAY RSVP MODAL (Physical Invitation Envelope unfolding) */}
      <AnimatePresence>
        {isRsvpOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
            {/* Semi-transparent dark blur background */}
            <motion.div
              id="modal-backdrop-blur"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRsvpOpen(false)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md cursor-zoom-out"
            />

            {/* Form wrapper */}
            <motion.div
              id="modal-card-frame"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-2xl z-50 my-8"
            >
              {/* Close Button on layout edge */}
              <button
                id="absolute-close-rsvp-btn"
                onClick={() => setIsRsvpOpen(false)}
                className="absolute -top-12 right-0 md:-right-12 text-platinum/60 hover:text-gold hover:scale-110 transition-all p-2 bg-charcoal-deep rounded-full border border-charcoal cursor-pointer"
              >
                <X size={16} />
              </button>

              <RsvpForm
                defaultEventName={overrideEventName}
                onSuccess={handleRsvpSuccess}
                onCancel={() => setIsRsvpOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL HIGH-END EDITORIAL FOOTER */}
      <footer className="border-t border-charcoal bg-obsidian py-16 text-center relative z-20" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 items-baseline text-left">
          
          {/* Col 1 */}
          <div className="space-y-4">
            <h5 className="font-serif text-stark-white italic text-xl">Grandiose Atelier</h5>
            <p className="text-[10px] tracking-widest text-[#E5E5E5]/60 font-sans uppercase">
              RESERVED FOR THE SELECTIONS OF ELITE PLANNERS, CHRONICLING ATHENS, LAKE COMO, REIMS, KYOTO & NEW YORK CITY GALA ESTATES.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-3 font-mono text-[9px] text-[#A3842C] tracking-widest uppercase">
            <p>CHRONO REVISION: 2026 v.XIV</p>
            <p>CONCIERGE HOTLINE: +41 (22) VIP-JOURNAL</p>
            <p>L'OR DE PARIS OFFICE // MONACO RECEPTIONS</p>
          </div>

          {/* Col 3 */}
          <div className="space-y-4 md:text-right">
            <h5 className="font-serif text-stark-white text-base">Le Bottin Privé Registration</h5>
            <p className="text-[9px] text-[#E5E5E5]/40 uppercase font-sans">
              ALL REGISTERED SERVICE ARTISANS MUST UNDERGO DOUBLE-BLIND LUXURY SECURITY REVIEWS BEFORE MINTING REGISTRY LEDGERS.
            </p>
            <div className="h-[1px] w-full bg-charcoal/80" />
            <span className="text-[7.5px] font-mono text-platinum/20 block">
              © 2026 GRANDIOSE DIGITAL BLUEPRINT. COGNITIVE RECEPTIONS SYSTEM.
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
