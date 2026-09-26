import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Sparkles, MapPin, Compass, Calendar, Users, Eye, Mail, ArrowRight, User } from 'lucide-react';
import { CulinaryTemplate } from './types';
import { CULINARY_TEMPLATES } from './data/templates';
import TemplateViewer from './components/TemplateViewer';
import ServiceArchive from './components/ServiceArchive';
import { generateLookbookPDF } from './utils/pdfGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState<'heritage' | 'collection' | 'salons'>('collection');
  const [activeTemplate, setActiveTemplate] = useState<CulinaryTemplate>(CULINARY_TEMPLATES[0]);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [animateTransitions, setAnimateTransitions] = useState<boolean>(true);

  // Booking salon form state
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingChapter, setBookingChapter] = useState('gullah-hearth');
  const [bookingSize, setBookingSize] = useState('4');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // PDF Compilation & Configuration States
  const [isPdfConfigured, setIsPdfConfigured] = useState<boolean>(false);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bookingName && bookingEmail) {
      setBookingConfirmed(true);
    }
  };

  const handlePdfDownloadClick = () => {
    if (!isPdfConfigured) {
      setShowPdfModal(true);
    } else {
      generateLookbookPDF(activeTemplate);
    }
  };

  const currentThemeBg = darkMode ? 'bg-charcoal text-sand' : 'bg-sand text-charcoal';
  const borderCol = darkMode ? 'border-sand/10' : 'border-charcoal/10';
  const mutedText = darkMode ? 'text-sand/60' : 'text-charcoal/60';

  return (
    <div className={`min-h-screen theme-transition font-sans ${currentThemeBg} flex flex-col justify-between`}>
      
      {/* Top Header - Editorial Newspaper Aesthetic */}
      <header className={`border-b ${borderCol} py-8 md:py-12`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center gap-6">
          
          {/* Aesthetic Tagline */}
          <span className="font-display uppercase tracking-[0.3em] text-[10px] sm:text-[11px] text-clay font-semibold">
            An Archival Journal of Culinary Art & Heritage Lineage
          </span>

          {/* Majestic Bold Brand Logo */}
          <div className="space-y-2 w-full max-w-full">
            <h1 className="font-serif text-4xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] tracking-tight uppercase font-light text-balance select-none break-words leading-none">
              Resonance
            </h1>
            <p className="font-serif italic text-xs sm:text-base tracking-widest text-[#DEC49D] px-2">
              Est. Beaufort & Harlem • Volume III
            </p>
          </div>

          <div className="w-24 h-[1px] bg-clay/30"></div>

          {/* Simple Human-Centered Layout Switcher */}
          <nav className="flex flex-col sm:flex-row items-center justify-between w-full max-w-5xl gap-6 pt-4 border-t border-dashed border-clay/15">
            
            {/* Aesthetic Control Row - Minimal Textual Switch Designs */}
            <div className="flex items-center gap-6 select-none">
              
              {/* Paper Selection Switch */}
              <div className="flex items-center gap-2 font-display uppercase tracking-[0.2em] text-[10px]">
                <span className="text-neutral-500">Paper:</span>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="relative inline-flex items-center h-4 w-9 rounded-full bg-clay/10 border border-clay/35 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Toggle Obsidian mode"
                >
                  <motion.span
                    animate={{ x: darkMode ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="inline-block w-2.5 h-2.5 rounded-full bg-clay"
                  />
                </button>
                <span className={`transition-colors duration-200 min-w-[55px] text-left ${darkMode ? 'text-clay font-bold' : 'text-neutral-500'}`}>
                  {darkMode ? 'Obsidian' : 'Parchment'}
                </span>
              </div>

              {/* Cinematic Transitions Switch */}
              <div className="flex items-center gap-2 font-display uppercase tracking-[0.2em] text-[10px]">
                <span className="text-neutral-500">Motion:</span>
                <button
                  onClick={() => setAnimateTransitions(!animateTransitions)}
                  className="relative inline-flex items-center h-4 w-9 rounded-full bg-clay/10 border border-clay/35 transition-colors focus:outline-none cursor-pointer"
                  aria-label="Toggle Cinematic mode"
                >
                  <motion.span
                    animate={{ x: animateTransitions ? 20 : 2 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="inline-block w-2.5 h-2.5 rounded-full bg-clay"
                  />
                </button>
                <span className={`transition-colors duration-200 min-w-[55px] text-left ${animateTransitions ? 'text-clay font-bold' : 'text-neutral-500'}`}>
                  {animateTransitions ? 'Cinematic' : 'Static'}
                </span>
              </div>

            </div>

            {/* Core Human-Centered Navigation Labels */}
            <div className="flex gap-8 md:gap-12 text-xs font-display uppercase tracking-[0.22em] font-medium">
              <button
                onClick={() => {
                  setActiveTab('heritage');
                  setBookingConfirmed(false);
                }}
                className={`pb-1 border-b transition-all duration-300 cursor-pointer ${
                  activeTab === 'heritage'
                    ? 'border-clay text-[#DEC49D] font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-[#DEC49D]'
                }`}
              >
                Our Heritage
              </button>

              <button
                onClick={() => {
                  setActiveTab('collection');
                  setBookingConfirmed(false);
                }}
                className={`pb-1 border-b transition-all duration-300 cursor-pointer ${
                  activeTab === 'collection'
                    ? 'border-clay text-[#DEC49D] font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-[#DEC49D]'
                }`}
              >
                The Collection
              </button>

              <button
                onClick={() => {
                  setActiveTab('salons');
                  setBookingConfirmed(false);
                }}
                className={`pb-1 border-b transition-all duration-300 cursor-pointer ${
                  activeTab === 'salons'
                    ? 'border-clay text-[#DEC49D] font-semibold'
                    : 'border-transparent text-neutral-500 hover:text-[#DEC49D]'
                }`}
              >
                Private Salons
              </button>
            </div>

            {/* Spatial Location Indicator */}
            <span className="font-display tracking-[0.2em] text-[10px] text-neutral-500 uppercase flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-clay" />
              Sea Islands / NYC
            </span>

          </nav>

        </div>
      </header>

      {/* Main Luxury Magazine Container */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:py-24 w-full flex-1">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: OUR HERITAGE (ARCHIVAL CHRONICLE) */}
          {activeTab === 'heritage' && (
            <motion.div
              key="heritage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto space-y-20 md:space-y-32"
            >
              {/* Opener */}
              <div className="text-center space-y-4">
                <span className="font-display uppercase tracking-[0.25em] text-xs text-clay">The Archival Chronicle</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-balance leading-tight">
                  On the Transmutation of Memory,<br />Georgia Clay, and Woodsmoke
                </h2>
                <div className="w-12 h-[1px] bg-clay/40 mx-auto mt-6"></div>
              </div>

              {/* Editorial Essay Block */}
              <div className="grid md:grid-cols-2 gap-12 font-editorial text-base sm:text-lg leading-relaxed text-neutral-700 dark:text-sand/80">
                <p className="first-letter:text-7xl first-letter:font-serif first-letter:font-bold first-letter:text-clay first-letter:float-left first-letter:leading-[0.8] first-letter:mr-4 first-letter:mt-1.5">
                  To explore the culinary heritage of the Black diaspora is to step directly into a quiet hearthfire of profound transmutational aesthetics. It is a world where recipes were never simple mechanics of utility, but complex archives of physical navigation, genetic preservation, and high agrarian science. When our ancestors crossed trade winds, they did not bring heavy copper pots; they carried precious seed lines—like Carolina Gold rice and red sea-island clay peas—intimately double-braided into locks of hair to sprout in unfamiliar loam.
                </p>
                <p className="pt-4 md:pt-0">
                  Resonance lives in the woodsmoke of the Sea Islands and the gilded dinner tables of twentieth-century brownstone scholars. Our philosophy seeks to elevate these humbler legacies into the uncompromising visual luxury they deserve. Here, we analyze the thermal memory of cast iron, celebrate wild marsh-foraged indigo dye, and serve the heritage pumpkin soup as a piece of curated political fine-art. This is not casual comfort. This is a monument of sensory remembrance and spatial luxury.
                </p>
              </div>

              {/* Three Pillars Gallery */}
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4 border-l border-clay/10 pl-6">
                  <span className="font-display uppercase tracking-[0.2em] text-[10px] text-clay font-bold block">Pillar I</span>
                  <h4 className="font-serif text-2xl">Lineage Preservation</h4>
                  <p className="font-editorial text-sm text-neutral-500 leading-relaxed">
                    Honoring the precise genetic heritage of Sea Island benne seed, Carolina Gold rice, and marsh oyster smoking practices in their rawest state.
                  </p>
                </div>

                <div className="space-y-4 border-l border-clay/10 pl-6">
                  <span className="font-display uppercase tracking-[0.2em] text-[10px] text-clay font-bold block">Pillar II</span>
                  <h4 className="font-serif text-2xl">Intellectual Aesthetics</h4>
                  <p className="font-editorial text-sm text-neutral-500 leading-relaxed">
                    Rejecting the visual cliches of southern food to present culinary plating through an avant-garde, structural, and museum-curated lens.
                  </p>
                </div>

                <div className="space-y-4 border-l border-clay/10 pl-6">
                  <span className="font-display uppercase tracking-[0.2em] text-[10px] text-clay font-bold block">Pillar III</span>
                  <h4 className="font-serif text-2xl">The Private Salon</h4>
                  <p className="font-editorial text-sm text-neutral-500 leading-relaxed">
                    Providing high-society supper clubs where philosophy, regional history, poetry, and unparalleled Gastronomy are collectively metabolized.
                  </p>
                </div>
              </div>

              {/* Atmospheric Quote Card */}
              <div className="border border-gold/25 p-12 text-center rounded-2xl max-w-2xl mx-auto space-y-6 relative overflow-hidden bg-neutral-900/5 dark:bg-white/5">
                <span className="font-display tracking-[0.25em] text-[10px] text-gold uppercase block">The Archival Decree</span>
                <p className="font-serif text-xl sm:text-2xl italic leading-relaxed text-neutral-600 dark:text-sand">
                  "Every pot of slow-simmered brass greens represents pure cultural alchemy—a legacy forged in memory, resilience, and gold."
                </p>
                <div className="w-8 h-[1px] bg-clay/50 mx-auto"></div>
                <span className="font-display text-[9px] uppercase tracking-widest text-clay block">— The Resonance Society</span>
              </div>
            </motion.div>
          )}

          {/* TAB 2: THE COLLECTION (GALLERY MAGAZINE) */}
          {activeTab === 'collection' && (
            <motion.div
              key="collection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-16 animate-fade-in"
            >
              
              {/* Curated Chapter Switcher */}
              <div className="max-w-4xl mx-auto text-center space-y-6 mb-12">
                <span className="font-display uppercase tracking-[0.3em] text-[10px] text-neutral-500 block">Exhibition Gallery</span>
                <h3 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light tracking-tight">Explore the Chapters</h3>
                
                {/* Elegant Minimalist Chapters Switcher Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 w-full border border-clay/10 dark:border-sand/15 rounded-xl overflow-hidden bg-neutral-900/5 dark:bg-white/5 backdrop-blur-sm shadow-xl transition-all">
                  {CULINARY_TEMPLATES.map((tmpl) => {
                    const selected = tmpl.id === activeTemplate.id;
                    return (
                      <button
                        key={tmpl.id}
                        onClick={() => setActiveTemplate(tmpl)}
                        className={`cursor-pointer px-6 py-6 text-left transition-all flex flex-col justify-between h-full group border-b md:border-b-0 border-clay/5 ${
                          selected
                            ? 'bg-clay/10 text-white border-r border-[#AC5D3F]/20'
                            : 'text-neutral-400 hover:bg-clay/[0.02]/30 hover:text-clay'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
                              selected 
                                ? 'bg-clay scale-125 shadow-[0_0_8px_#AC5D3F]' 
                                : 'bg-neutral-600 group-hover:bg-[#AC5D3F]'
                            }`}></span>
                            <span className="text-[10px] md:text-xs font-display font-bold tracking-widest uppercase text-[#DEC49D]">
                              {tmpl.id === 'gullah-hearth' ? '01 / ' : tmpl.id === 'decolonial-table' ? '02 / ' : '03 / '}
                              {tmpl.title}
                            </span>
                          </div>
                          <span className="block text-[9px] md:text-[10px] text-neutral-500 font-display group-hover:text-neutral-400 leading-tight tracking-[0.05em] transition-colors font-medium">
                            {tmpl.tagline}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Print Lookbook Trigger */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4 pb-2 border-t border-dashed border-clay/10 mt-6 select-none">
                  <span className="font-display uppercase tracking-[0.22em] text-[10px] text-neutral-500 font-semibold flex items-center gap-2">
                    Physical Archive:
                    <span className={`inline-block w-1.5 h-1.5 rounded-full ${isPdfConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`}></span>
                    <span className="text-[9px] text-neutral-400 font-normal">
                      ({isPdfConfigured ? 'Compiled' : 'In compilation'})
                    </span>
                  </span>
                  
                  <button
                    onClick={handlePdfDownloadClick}
                    className="group cursor-pointer inline-flex items-center gap-2.5 px-6 py-2.5 border border-clay/20 hover:border-clay hover:bg-clay/5 rounded-full transition-all duration-300 text-[11px] font-display uppercase tracking-[0.2em] text-[#DEC49D]"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-clay animate-pulse group-hover:scale-110 duration-300" />
                    <span>Download Lookbook PDF</span>
                  </button>

                  <button
                    onClick={() => setIsPdfConfigured(!isPdfConfigured)}
                    className="text-[9px] font-display uppercase tracking-widest text-[#DEC49D]/40 hover:text-clay transition-colors duration-200 border-b border-dashed border-clay/15 pb-0.5"
                    title="Simulate registry asset status transition"
                  >
                    [ Configure Registry Printer ]
                  </button>
                </div>
              </div>

              {/* The Dedicated Chapter View */}
              <div className="max-w-6xl mx-auto">
                <AnimatePresence mode="wait">
                  {animateTransitions ? (
                    <motion.div
                      key={activeTemplate.id}
                      initial={{ opacity: 0, scale: 0.98, filter: 'blur(3px)' }}
                      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, scale: 1.02, filter: 'blur(3px)' }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <TemplateViewer
                        template={activeTemplate}
                        darkMode={darkMode}
                        animateTransitions={animateTransitions}
                      />
                    </motion.div>
                  ) : (
                    <div key={activeTemplate.id}>
                      <TemplateViewer
                        template={activeTemplate}
                        darkMode={darkMode}
                        animateTransitions={animateTransitions}
                      />
                    </div>
                  )}
                </AnimatePresence>
              </div>

              {/* Service Archive & Press Chronicles */}
              <div className="max-w-6xl mx-auto">
                <ServiceArchive darkMode={darkMode} />
              </div>

            </motion.div>
          )}

          {/* TAB 3: PRIVATE SALONS (RESERVE SUITE) */}
          {activeTab === 'salons' && (
            <motion.div
              key="salons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto space-y-12"
            >
              
              {/* Heading */}
              <div className="text-center space-y-4">
                <span className="font-display uppercase tracking-[0.25em] text-xs text-clay">Inquire / Book Room</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-light text-balance">
                  Private Dinner Registration
                </h2>
                <div className="w-12 h-[1px] bg-clay/40 mx-auto mt-6"></div>
              </div>

              <div className="font-editorial text-sm sm:text-base text-neutral-500 leading-relaxed text-center max-w-xl mx-auto">
                We organize exceptionally limited private gatherings for culinary curators and cultural historians. Fill in your details below to request a placement at our next estate dining salon. No algorithmic bidding, no technical tokens—just humble registry by name.
              </div>

              <AnimatePresence mode="wait">
                {!bookingConfirmed ? (
                  <motion.form
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleBookingSubmit}
                    className="border border-clay/10 p-8 sm:p-12 rounded-2xl bg-neutral-900/5 dark:bg-white/5 space-y-6 text-left"
                  >
                    
                    {/* Guest Name */}
                    <div className="space-y-1">
                      <label className="font-display uppercase tracking-widest text-[9px] text-[#DEC49D] font-bold block">
                        Your Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/60" />
                        <input
                          type="text"
                          required
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          placeholder="Lord-Evelyn Washington"
                          className="w-full pl-8 pr-2 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b border-clay/20 focus:border-b-clay focus:ring-0 outline-none rounded-none text-sm text-neutral-800 dark:text-sand font-serif tracking-wide transition-all placeholder:text-neutral-600 dark:placeholder:text-sand/30"
                        />
                      </div>
                    </div>

                    {/* Guest Contact */}
                    <div className="space-y-1">
                      <label className="font-display uppercase tracking-widest text-[9px] text-[#DEC49D] font-bold block">
                        Private Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-clay/60" />
                        <input
                          type="email"
                          required
                          value={bookingEmail}
                          onChange={(e) => setBookingEmail(e.target.value)}
                          placeholder="evelyn@bellestates.org"
                          className="w-full pl-8 pr-2 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b border-clay/20 focus:border-b-clay focus:ring-0 outline-none rounded-none text-sm text-neutral-800 dark:text-sand font-serif tracking-wide transition-all placeholder:text-neutral-600 dark:placeholder:text-sand/30"
                        />
                      </div>
                    </div>

                    {/* Chapter Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="font-display uppercase tracking-widest text-[9px] text-[#DEC49D] font-bold block">
                          Archetype Collection
                        </label>
                        <select
                          value={bookingChapter}
                          onChange={(e) => setBookingChapter(e.target.value)}
                          className="w-full px-1 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b border-clay/20 focus:border-b-clay focus:ring-0 outline-none rounded-none text-sm text-neutral-800 dark:text-sand font-serif appearance-none cursor-pointer"
                        >
                          <option value="gullah-hearth" className="bg-[#1A1817] text-sand">The Ancestral Hearth</option>
                          <option value="decolonial-table" className="bg-[#1A1817] text-sand">The Decolonial Table</option>
                          <option value="archival-salon" className="bg-[#1A1817] text-sand">The Archival Salon</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-display uppercase tracking-widest text-[9px] text-[#DEC49D] font-bold block">
                          Guest Count
                        </label>
                        <select
                          value={bookingSize}
                          onChange={(e) => setBookingSize(e.target.value)}
                          className="w-full px-1 py-3 bg-transparent border-t-0 border-l-0 border-r-0 border-b border-clay/20 focus:border-b-clay focus:ring-0 outline-none rounded-none text-sm text-neutral-800 dark:text-sand font-serif appearance-none cursor-pointer"
                        >
                          <option value="2" className="bg-[#1A1817] text-sand">2 Seats (Intimate Salon)</option>
                          <option value="4" className="bg-[#1A1817] text-sand">4 Seats (Curators' Quad)</option>
                          <option value="8" className="bg-[#1A1817] text-sand">8 Seats (Full Banquet Table)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 px-6 bg-clay hover:bg-clay/90 text-white rounded-lg font-display uppercase tracking-[0.25em] text-xs font-bold transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Submit Salon Inquiry</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                  </motion.form>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="border-2 border-double border-gold/40 p-10 sm:p-14 text-center rounded-2xl bg-neutral-900/40 relative space-y-6"
                  >
                    <BookOpen className="w-12 h-12 text-gold mx-auto" />
                    <span className="font-display uppercase tracking-[0.2em] text-[10px] text-[#DEC49D] font-bold block">
                      Inquiry Logged Into Hearth Journal
                    </span>
                    <h3 className="font-serif text-3xl font-light text-sand">
                      Welcome, Curator {bookingName}.
                    </h3>
                    <div className="w-16 h-[1.5px] bg-clay/35 mx-auto"></div>
                    <p className="font-editorial text-neutral-400 text-base max-w-md mx-auto leading-relaxed">
                      We have handwritten your address (<em>{bookingEmail}</em>) into the estate roll. Our archivist will reach out by private post shortly with a luxury hand-embossed invitation letter containing dates, maps, and private suite codes.
                    </p>
                    <button
                      onClick={() => setBookingConfirmed(false)}
                      className="mt-6 px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-[#DEC49D] border border-gold/15 rounded font-display uppercase tracking-[0.18em] text-[10px] transition-colors cursor-pointer"
                    >
                      Guest Registry Book
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Elegant Editorial Footer */}
      <footer className={`w-full border-t ${borderCol} transition-colors duration-300 bg-neutral-950/20 py-16 px-6 shrink-0`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-sm text-neutral-500 font-editorial">
          
          <div className="space-y-4">
            <span className="font-serif font-semibold text-neutral-300 uppercase tracking-widest text-xs block">
              The Resonance Archive
            </span>
            <p className="leading-relaxed text-xs text-neutral-500 max-w-sm">
              An uncompromised exploration of coastal legacy, red clay silt, and culinary design. Designed to honor historic black foodways, Gullah Geechee sea traditions, and Gilded Age black academic dinners.
            </p>
          </div>

          <div className="space-y-2">
            <span className="font-display text-[10px] uppercase text-[#DEC49D] tracking-wider block font-bold">
              The Collections
            </span>
            <ul className="space-y-1.5 text-xs text-neutral-500">
              <li>• Chapter I: The Gullah Hearthfire (Beaufort Coast)</li>
              <li>• Chapter II: The Decolonial Blueprint (Modernist Table)</li>
              <li>• Chapter III: The Scholar's Bistro (Elite Black Academics)</li>
            </ul>
          </div>

          <div className="space-y-2 text-right">
            <span className="font-display text-[10px] uppercase text-[#DEC49D] tracking-wider block font-bold">
              Registries & Estate Offsets
            </span>
            <p className="text-xs text-neutral-500 leading-relaxed">
              We operate exclusively through private reservations and seasonal invites. Built for chefs, spatial historians, and keepers of regional seedbanks.
            </p>
            <p className="text-[10px] font-display uppercase tracking-widest text-[#AC5D3F] mt-4 font-semibold">
              Volume III • All memories fully preserved.
            </p>
          </div>

        </div>
      </footer>

      {/* Volume III Archival Lookbook Compilation Modal */}
      <AnimatePresence>
        {showPdfModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative max-w-md w-full bg-[#1C1A19] border border-clay/35 rounded-2xl p-8 shadow-2xl text-center space-y-6 overflow-hidden"
            >
              {/* Decorative borders reminiscent of classical papers */}
              <div className="absolute inset-2 border border-dashed border-[#DEC49D]/10 rounded-xl pointer-events-none"></div>

              {/* Icon */}
              <div className="mx-auto w-12 h-12 rounded-full bg-clay/10 border border-clay/30 flex items-center justify-center text-clay animate-pulse">
                <BookOpen className="w-5 h-5" />
              </div>

              {/* Header Content */}
              <div className="space-y-2">
                <span className="font-display uppercase tracking-[0.25em] text-[9px] text-[#DEC49D] font-bold block">
                  Archival Registry Transcripts
                </span>
                <h4 className="font-serif text-2xl text-sand font-light leading-snug">
                  Compilation In Progress
                </h4>
              </div>

              {/* Message */}
              <p className="font-editorial text-sm text-sand/80 bg-neutral-900/50 p-4 border border-clay/10 rounded-lg leading-relaxed italic">
                "The Volume III Archival Lookbook PDF print edition is currently being compiled for the registry. Check back shortly."
              </p>

              {/* Micro diagnostic info */}
              <div className="flex justify-between text-[10px] font-mono text-neutral-500 border-t border-b border-clay/10 py-2.5">
                <span>SEGMENT: VOL_III_LOOKBOOK</span>
                <span className="animate-pulse">COMPILING...</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsPdfConfigured(true);
                    setShowPdfModal(false);
                    // generate download immediately
                    setTimeout(() => generateLookbookPDF(activeTemplate), 300);
                  }}
                  className="flex-1 cursor-pointer font-display uppercase tracking-widest text-[10px] font-bold bg-clay/20 hover:bg-clay text-sand hover:text-white px-4 py-3 rounded-lg border border-clay transition-all duration-300"
                >
                  Force Compile & Get
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="flex-1 cursor-pointer font-display uppercase tracking-widest text-[10px] font-bold bg-transparent border border-clay/20 text-[#DEC49D] hover:border-clay/60 px-4 py-3 rounded-lg transition-all duration-300"
                >
                  Acknowledge
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
