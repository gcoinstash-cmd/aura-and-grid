/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Menu, 
  X, 
  ChevronRight, 
  Check, 
  Scissors, 
  Star, 
  ArrowRight, 
  ExternalLink,
  ChevronDown,
  Info,
  User,
  Heart
} from 'lucide-react';

// Service Rates Data mapped to the 4 pillars
const SERVICE_CATEGORIES = {
  barbering: {
    title: "Barbering",
    description: "Master level cuts, razor edges, and traditional scalp therapies tailored to structure.",
    services: [
      { name: "Classic Haircut & Hot Towel Shave", price: "$65", duration: "45 mins" },
      { name: "Signature Skin Fade & Edge-up", price: "$55", duration: "45 mins" },
      { name: "Beard Sculpt, Trim & Premium Oil", price: "$40", duration: "30 mins" },
      { name: "The Diamond Experience (Cut, Beard, Facial)", price: "$110", duration: "75 mins" }
    ]
  },
  braids: {
    title: "Braids",
    description: "Symmetrical protective scaling, cornrows, and custom artistic parting.",
    services: [
      { name: "Standard Box Braids (Medium)", price: "$140+", duration: "120 mins" },
      { name: "Premium Feed-in Cornrows", price: "$95+", duration: "90 mins" },
      { name: "Custom Geometric Pattern Braiding", price: "$160+", duration: "150 mins" },
      { name: "Braid Removal, Wash & Conditioning", price: "$60", duration: "45 mins" }
    ]
  },
  locTech: {
    title: "Loc Tech",
    description: "Meticulous palm-rolling, inter-locking, and therapeutic scalp re-hydration.",
    services: [
      { name: "Premium Hair Loc Retwist & Grooming", price: "$120", duration: "90 mins" },
      { name: "Deep Loc Detox, Wash & Conditioning", price: "$75", duration: "60 mins" },
      { name: "Starter Locs (Comb Coil Method)", price: "$180", duration: "120 mins" },
      { name: "Loc Styling (Barrels, Updos, Fishtails)", price: "$45", duration: "30 mins" }
    ]
  },
  hairStylists: {
    title: "Hair Stylists",
    description: "Precision shear cuts, signature nourishing silk presses, and premium custom color.",
    services: [
      { name: "Signature Blowout & Silk Press", price: "$95", duration: "75 mins" },
      { name: "Precision Modular Shear Haircut", price: "$85", duration: "60 mins" },
      { name: "Full Custom Color & Styling Session", price: "$150+", duration: "120 mins" },
      { name: "Scalp Revitalizing Keratin Treatment", price: "$130", duration: "90 mins" }
    ]
  }
};

// Curated Lookbook styles replacing raw Instagram feeds
const LOOKBOOK_ITEMS = [
  {
    id: 1,
    title: "Razor Skin Taper",
    category: "BARBERING",
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
    description: "High-contrast precision fade featuring flawless hairline alignment and hand-finished neck rasp work."
  },
  {
    id: 2,
    title: "Symmetrical Parts & Braids",
    category: "BRAIDS",
    image: "https://images.unsplash.com/photo-1605980776566-0486c3ac7617?auto=format&fit=crop&w=800&q=80",
    description: "Perfect geometric symmetry with polished styling grease. Custom crafted pattern for protective daily wear."
  },
  {
    id: 3,
    title: "Meticulous Loc Twists",
    category: "LOC MAINTENANCE",
    image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
    description: "Healthy root maintenance, organic locking gel hold, and premium essential oils scalp hydration."
  }
];

// Available Specialists
const SPECIALISTS = [
  { id: 'marcus', name: 'Marcus Sterling', role: 'Master Barber & Founder', rates: 'Barbering & Sculpting' },
  { id: 'kiara', name: 'Kiara J.', role: 'Creative Braid Artisan', rates: 'Braids & Protective Styles' },
  { id: 'andre', name: 'Andre Vance', role: 'Loc Architect & Specialist', rates: 'Loc Tech & Hydration' },
  { id: 'elena', name: 'Elena Ramos', role: 'Senior Shear Stylist', rates: 'Silk Press & Color' }
];

// Presets for Datepicker Grid starting Sat May 23, 2026
const BOOKING_DATES = [
  { dateStr: '2026-05-23', dayName: 'Sat', dayNum: 23, monthName: 'May' },
  { dateStr: '2026-05-24', dayName: 'Sun', dayNum: 24, monthName: 'May', label: 'Closed' },
  { dateStr: '2026-05-25', dayName: 'Mon', dayNum: 25, monthName: 'May', label: 'Appt Only' },
  { dateStr: '2026-05-26', dayName: 'Tue', dayNum: 26, monthName: 'May' },
  { dateStr: '2026-05-27', dayName: 'Wed', dayNum: 27, monthName: 'May' },
  { dateStr: '2026-05-28', dayName: 'Thu', dayNum: 28, monthName: 'May' },
  { dateStr: '2026-05-29', dayName: 'Fri', dayNum: 29, monthName: 'May' },
  { dateStr: '2026-05-30', dayName: 'Sat', dayNum: 30, monthName: 'May' }
];

const testimonials = [
  {
    quote: "The razor precision is entirely unmatched. Marcus Stirling looks at grooming not as a simple service, but as a discipline of handcrafted shear sculpting. Under the high-contrast atelier lights, his focus is absolute.",
    author: "Dominic West",
    role: "CLIENT SINCE 2018"
  },
  {
    quote: "Kiara J.'s creative braiding is second to none in Los Angeles. The symmetrical, protective box braids are flawless and treated with soothing natural plant oils. The studio provides modern luxury without any pretense.",
    author: "Nia Jones",
    role: "CLIENT SINCE 2021"
  },
  {
    quote: "Andre Vance's mastery in scalp hydration and loc alignment is genuine therapy. He's a true loc architect who prioritizes natural health. The serene, calm architectural design of the salon immediately puts you at ease.",
    author: "Marcus Vance",
    role: "CLIENT SINCE 2019"
  }
];

export default function App() {
  // Navigation states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Zoomed Lookbook Item state for click-to-zoom feature
  const [zoomedItem, setZoomedItem] = useState<typeof LOOKBOOK_ITEMS[0] | null>(null);

  // Keyboard navigation for lookbook zoom
  useEffect(() => {
    if (!zoomedItem) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedItem(null);
      } else if (e.key === 'ArrowRight') {
        const currentIndex = LOOKBOOK_ITEMS.findIndex(item => item.id === zoomedItem.id);
        const nextIndex = (currentIndex + 1) % LOOKBOOK_ITEMS.length;
        setZoomedItem(LOOKBOOK_ITEMS[nextIndex]);
      } else if (e.key === 'ArrowLeft') {
        const currentIndex = LOOKBOOK_ITEMS.findIndex(item => item.id === zoomedItem.id);
        const prevIndex = (currentIndex - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length;
        setZoomedItem(LOOKBOOK_ITEMS[prevIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [zoomedItem]);
  
  // Interactive expanded rate category state
  const [activeRateCategory, setActiveRateCategory] = useState<string | null>('barbering');

  // Booking side-panel states
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('barbering');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<string>('marcus');
  const [bookingDate, setBookingDate] = useState<string>('2026-05-23');
  const [bookingTime, setBookingTime] = useState<string>('10:00 AM');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [bookingCompleted, setBookingCompleted] = useState(false);

  // Contact form submission state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Custom testimonial slider state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Calculate salon open/closed status based on actual time
  const [isOpenNow, setIsOpenNow] = useState(true);

  useEffect(() => {
    // Salon hours simulation logic for Los Angeles local timezone representation
    const checkOpenStatus = () => {
      const now = new Date(); // local runtime
      const day = now.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday
      const hour = now.getHours();

      if (day === 0) {
        setIsOpenNow(false); // Closed Sunday
      } else if (day === 1) {
        setIsOpenNow(false); // Appointment only (effectively visual closed indicator for walk-ins)
      } else if (day === 6) {
        // Saturday 8:00 AM - 6:00 PM
        setIsOpenNow(hour >= 8 && hour < 18);
      } else {
        // Tuesday - Friday 9:00 AM - 7:00 PM
        setIsOpenNow(hour >= 9 && hour < 19);
      }
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleBookNowClick = () => {
    setIsBookingOpen(true);
    setBookingCompleted(false);
    setBookingStep(1);
  };

  const handleContactSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (contactName && contactEmail) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      }, 5000);
    }
  };

  const handleBookingConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (customerName && customerPhone) {
      setBookingCompleted(true);
      setBookingStep(3);
    }
  };

  const selectedCategoryData = SERVICE_CATEGORIES[selectedCategory as keyof typeof SERVICE_CATEGORIES];

  return (
    <div className="min-h-screen bg-alabaster text-charcoal flex flex-col relative antialiased selection:bg-charcoal/10 selection:text-charcoal" id="site-root">
      
      {/* GLASSMORPHIC STICKY NAVIGATION */}
      <header className="sticky top-0 z-40 bg-alabaster/80 backdrop-blur-md border-b border-charcoal/5 transition-all duration-300" id="main-navigation">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <a href="#" className="flex flex-col group" id="brand-logo">
            <span className="serif-header text-lg font-medium tracking-widest text-charcoal uppercase leading-tight group-hover:opacity-80 transition-opacity">
              DIAMOND CUTS
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-charcoal/50 leading-none">
              BARBER SALON • EST. 1999
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-12" id="desktop-menu">
            <a href="#services" className="text-xs uppercase tracking-widest font-medium hover:text-charcoal/70 transition-colors">Services</a>
            <a href="#lookbook" className="text-xs uppercase tracking-widest font-medium hover:text-charcoal/70 transition-colors">Lookbook</a>
            <a href="#story" className="text-xs uppercase tracking-widest font-medium hover:text-charcoal/70 transition-colors">Our Story</a>
            <a href="#contact" className="text-xs uppercase tracking-widest font-medium hover:text-charcoal/70 transition-colors">Contact</a>
          </nav>

          {/* Booking Button Desktop */}
          <div className="hidden md:flex items-center space-x-6" id="nav-actions">
            {/* Live Indicator */}
            <div className="flex items-center space-x-2">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal/60 font-medium">
                {isOpenNow ? 'Open Now' : 'By Appt Only'}
              </span>
            </div>
            <button
              onClick={handleBookNowClick}
              id="cta-nav-book"
              className="bg-charcoal text-alabaster border border-charcoal hover:bg-alabaster hover:text-charcoal px-6 py-2.5 text-xs font-sans uppercase tracking-widest font-medium transition-all duration-300 shadow-sm active:scale-98"
            >
              Book Appointment
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={handleBookNowClick}
              className="bg-charcoal text-alabaster px-4 py-2 text-[10px] font-sans uppercase tracking-widest font-medium transition-transform active:scale-95"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 hover:text-charcoal/70 transition-colors"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X size={20} className="stroke-[1.5]" /> : <Menu size={20} className="stroke-[1.5]" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Sliding Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-x-0 bottom-0 top-[79px] bg-alabaster z-30 px-6 py-12 flex flex-col justify-between border-t border-charcoal/5 overflow-y-auto"
            id="mobile-navigation-overlay"
          >
            <div className="flex flex-col space-y-8">
              <a 
                href="#services" 
                onClick={() => setMobileMenuOpen(false)}
                className="serif-header text-3xl font-light tracking-wide hover:opacity-75 transition-opacity"
              >
                Services Rates
              </a>
              <a 
                href="#lookbook" 
                onClick={() => setMobileMenuOpen(false)}
                className="serif-header text-3xl font-light tracking-wide hover:opacity-75 transition-opacity"
              >
                Curated Lookbook
              </a>
              <a 
                href="#story" 
                onClick={() => setMobileMenuOpen(false)}
                className="serif-header text-3xl font-light tracking-wide hover:opacity-75 transition-opacity"
              >
                Our Story
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="serif-header text-3xl font-light tracking-wide hover:opacity-75 transition-opacity"
              >
                Location & Hours
              </a>
            </div>

            <div className="flex flex-col space-y-6 pt-12 border-t border-charcoal/15">
              <div className="flex items-center space-x-3">
                <span className={`w-2 h-2 rounded-full ${isOpenNow ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                <span className="text-xs uppercase tracking-widest text-charcoal/70 font-medium">
                  {isOpenNow ? "Currently Welcoming Clients" : "Special Appointment Hours Only"}
                </span>
              </div>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleBookNowClick();
                }}
                className="w-full bg-charcoal text-alabaster py-4 text-center uppercase text-xs tracking-widest font-semibold transition-all"
              >
                Book Appointment
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        
        {/* CENTERED HERO SECTION */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40 flex flex-col items-center justify-center text-center px-6 bg-[#1C1C1A]" id="hero-section">
          {/* Hero background image */}
          <img 
            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop" 
            alt="Diamond Cuts Luxury Barber Studio Background" 
            referrerPolicy="no-referrer"
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1C1C1A]/70 via-[#1C1C1A]/85 to-[#1C1C1A] z-0 pointer-events-none" />

          <div className="max-w-4xl mx-auto w-full relative z-10">
            
            {/* Heritage Tag */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2.5 bg-[#1C1C1A]/80 border border-[#FBFBF9]/15 px-4.5 py-1.5 mb-8 relative z-10"
            >
              <Scissors size={12} className="text-[#FBFBF9]/80 stroke-[1.5]" />
              <span className="text-[10px] font-sans uppercase tracking-[0.25em] font-semibold text-[#FBFBF9]/95">
                Crafted Heritage in Los Angeles Since 1999
              </span>
            </motion.div>

            {/* Primary Cinematic Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="serif-header text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-light tracking-tight text-[#FBFBF9] leading-[1.05] mb-10"
            >
              Precision cuts.<br />
              Clean fades.<br />
              <span className="italic">Elevated grooming.</span>
            </motion.h1>

            {/* Subtitle description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm md:text-base text-[#FBFBF9]/75 max-w-xl mx-auto mb-12 font-light leading-relaxed font-sans"
            >
              Located at 4916 W. Slauson Ave, we provide premium hair artistry, symmetrical protective braiding, and masterful loc tech treatments with sharp, tailored accuracy.
            </motion.p>

            {/* Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
              id="hero-ctas"
            >
              <button
                onClick={handleBookNowClick}
                className="w-full sm:w-auto bg-[#FBFBF9] hover:bg-[#FBFBF9]/90 text-charcoal px-8 py-4 text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 shadow-md active:scale-98"
              >
                Book Appointment
              </button>
              <a
                href="#services"
                className="w-full sm:w-auto text-[#FBFBF9] border border-[#FBFBF9]/30 hover:border-[#FBFBF9] px-8 py-4 text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 text-center"
              >
                Explore Services
              </a>
            </motion.div>

          </div>

          {/* Architectural Bento Status Grid overlaying image background */}
          <div className="w-full max-w-6xl mx-auto mt-6 px-4 relative z-10" id="hero-feature-bento">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-1 border-t border-[#FBFBF9]/10 pt-1">
              
              {/* Feature Image Frame */}
              <div className="md:col-span-8 h-[280px] md:h-[450px] relative overflow-hidden group border border-[#FBFBF9]/5 bg-[#1C1C1A]">
                <img 
                  src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80" 
                  alt="Diamond Cuts Luxury Barber Studio Interior" 
                  referrerPolicy="no-referrer"
                  loading="lazy"
                  className="w-full h-full object-cover grayscale opacity-90 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000 ease-out"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=1200&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-left">
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#FBFBF9]/70 block mb-1">
                    01 // THE PRIVATE ENCLOSURE
                  </span>
                  <span className="serif-header text-[#FBFBF9] text-xl font-medium tracking-wide">
                    Slauson Avenue’s premier groomers
                  </span>
                </div>
              </div>

              {/* Bento Stat Card 1 */}
              <div className="md:col-span-4 grid grid-rows-2 gap-1">
                <div className="bg-stone p-8 text-left flex flex-col justify-between border border-charcoal/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans uppercase tracking-widest text-charcoal/40">Established</span>
                    <span className="text-xs font-serif font-light italic">LA Classic</span>
                  </div>
                  <div>
                    <h3 className="serif-header text-4xl text-charcoal font-medium">1999</h3>
                    <p className="text-[11px] uppercase tracking-widest text-charcoal/50 mt-2">Over 25 years of visual mastery</p>
                  </div>
                </div>

                <div className="bg-charcoal text-alabaster p-8 text-left flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-sans tracking-widest text-white/40">Grooming Standard</span>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                  <div>
                    <div className="flex items-baseline space-x-1">
                      <span className="serif-header text-4xl font-semi">4.9</span>
                      <span className="text-xs text-white/50">/ 5.0</span>
                    </div>
                    <p className="text-[11px] uppercase tracking-widest text-white/60 mt-2">Based on 1,200+ local client reviews</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* THREE-COLUMN CURATED LOOKBOOK SECTION */}
        <section className="bg-stone py-24 md:py-32 px-6 border-y border-charcoal/5" id="lookbook">
          <div className="max-w-7xl mx-auto">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div className="max-w-xl text-left">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-charcoal/50 block mb-3 font-semibold">
                  01 // VISUAL PORTFOLIO
                </span>
                <h2 className="serif-header text-4xl md:text-5xl text-charcoal font-extralight tracking-tight">
                  The Lookbook
                </h2>
                <div className="w-16 h-[1px] bg-charcoal/30 mt-6 md:hidden"></div>
              </div>
              <p className="text-xs md:text-sm text-charcoal/60 font-light font-sans max-w-sm mt-6 md:mt-0 leading-relaxed text-left">
                Forget raw Instagram screenshots. We hold our hair designs to high editorial standards. View real, highly-focused, premium cuts curated directly inside the studio.
              </p>
            </div>

            {/* Lookbook Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8" id="lookbook-grid">
              {LOOKBOOK_ITEMS.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="group flex flex-col text-left cursor-zoom-in"
                  id={`lookbook-card-${item.id}`}
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={() => setZoomedItem(item)}
                >
                  
                  {/* Photo Frame with subtle custom filters */}
                  <div className="relative overflow-hidden aspect-[4/5] bg-charcoal/5 border border-charcoal/5 mb-6">
                    <motion.img 
                      src={item.image} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                      initial={{ filter: "grayscale(100%)" }}
                      whileHover={{ filter: "grayscale(0%)", scale: 1.05 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                    
                    {/* Tiny UPPERCASE Tag Overlay */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-alabaster/95 text-charcoal text-[9px] font-sans font-semibold uppercase tracking-widest px-3 py-1 border border-charcoal/5">
                        {item.category}
                      </span>
                    </div>

                    {/* Dynamic hover reveal cue */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-alabaster/90 text-charcoal text-[10px] font-sans font-semibold uppercase tracking-widest px-4 py-2 border border-charcoal/15 shadow-md">
                        Click to Zoom
                      </span>
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div className="flex items-baseline justify-between mb-3 border-b border-charcoal/10 pb-2">
                    <h3 className="serif-header text-2xl font-light text-charcoal group-hover:opacity-85 transition-opacity">
                      {item.title}
                    </h3>
                    <span className="text-[10px] font-mono text-charcoal/40 tracking-wider">
                      DC-{String(item.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-charcoal/60 leading-relaxed font-sans font-light">
                    {item.description}
                  </p>

                </motion.div>
              ))}
            </div>

          </div>
        </section>


        {/* STREAMLINED SERVICE PILLARS SECTION */}
        <section className="py-24 md:py-32 px-6 bg-alabaster" id="services">
          <div className="max-w-7xl mx-auto">
            
            {/* Main Header */}
            <div className="max-w-2xl text-left mb-20">
              <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-charcoal/50 block mb-3 font-semibold">
                02 // SERVICE STANDARDS
              </span>
              <h2 className="serif-header text-4xl md:text-5xl lg:text-6xl text-charcoal font-extralight tracking-tight leading-tight">
                Craftsmen Pillars & Rates
              </h2>
              <p className="text-xs md:text-sm text-charcoal/60 mt-6 leading-relaxed max-w-lg font-light">
                Every service at Diamond Cuts is performed by fully-licensed staff specialized in their specific pillar. We maintain clear pricing structures with absolutely no hidden fees.
              </p>
            </div>

            {/* 4 Pillar grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Selector Cards (8 cols equivalent span if normal, let's map in elegant detail) */}
              <div className="lg:col-span-5 flex flex-col space-y-4" id="service-pillars-menu">
                {Object.entries(SERVICE_CATEGORIES).map(([key, value]) => {
                  const isActive = activeRateCategory === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveRateCategory(key)}
                      className={`p-8 text-left border transition-all duration-300 ${
                        isActive 
                          ? 'border-charcoal bg-stone shadow-sm' 
                          : 'border-charcoal/10 bg-transparent hover:border-charcoal/30'
                      }`}
                      id={`pillar-btn-${key}`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal/40">
                          PILLAR • {value.title.toUpperCase()}
                        </span>
                        {isActive && <ChevronRight size={14} className="text-charcoal" />}
                      </div>

                      <h3 className="serif-header text-3xl font-light text-charcoal mb-3">
                        {value.title}
                      </h3>

                      <p className="text-xs text-charcoal/60 leading-relaxed font-sans font-light">
                        {value.description}
                      </p>

                      <div className="mt-6 flex items-center text-[10px] uppercase tracking-wider font-semibold text-charcoal/80 group">
                        <span>View Rates Sheet</span>
                        <ArrowRight size={10} className="ml-1.5 transition-transform group-hover:translate-x-1" />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Right Column: High contrast pricing table sheet */}
              <div className="lg:col-span-7 bg-stone p-8 md:p-12 border border-charcoal/10" id="pricing-sheet-viewport">
                
                <AnimatePresence mode="wait">
                  {activeRateCategory && (
                    <motion.div
                      key={activeRateCategory}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col text-left"
                    >
                      {/* Pricing Sheet Header */}
                      <div className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-charcoal/15 pb-6 mb-8">
                        <div>
                          <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal/40">
                            OFFICIAL PRICE SHEET
                          </span>
                          <h4 className="serif-header text-4xl text-charcoal font-medium mt-1">
                            {SERVICE_CATEGORIES[activeRateCategory as keyof typeof SERVICE_CATEGORIES].title} Rates
                          </h4>
                        </div>
                        <p className="text-[11px] font-sans uppercase tracking-widest text-charcoal/50 mt-2 md:mt-0 font-medium">
                          All prices include tax & finish styling
                        </p>
                      </div>

                      {/* Items List */}
                      <div className="flex flex-col space-y-6">
                        {SERVICE_CATEGORIES[activeRateCategory as keyof typeof SERVICE_CATEGORIES].services.map((svc, i) => (
                          <div key={i} className="flex flex-col md:flex-row md:items-center justify-between group py-3 border-b border-charcoal/5 hover:border-charcoal/10 transition-colors">
                            <div className="max-w-md text-left">
                              <h5 className="text-sm font-medium text-charcoal font-sans">{svc.name}</h5>
                              <div className="flex items-center space-x-2.5 mt-1.5 text-charcoal/40 text-left">
                                <Clock size={11} />
                                <span className="text-[10px] tracking-wider uppercase font-mono">{svc.duration} session duration</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4 mt-3 md:mt-0 self-end md:self-center">
                              <span className="serif-header text-2xl font-light text-charcoal">{svc.price}</span>
                              <button
                                onClick={() => {
                                  setSelectedCategory(activeRateCategory);
                                  setSelectedService(svc.name);
                                  handleBookNowClick();
                                }}
                                className="bg-charcoal text-alabaster border border-charcoal hover:bg-transparent hover:text-charcoal px-4 py-1.5 text-[10px] uppercase font-sans tracking-widest font-semibold transition-all active:scale-95 cursor-pointer"
                              >
                                BOOK
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Service Booking Link */}
                      <div className="mt-12 bg-alabaster border border-charcoal/5 p-6 flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center space-x-3 mb-4 sm:mb-0 text-left">
                          <Info size={16} className="text-charcoal/50 shrink-0" />
                          <p className="text-[11px] text-charcoal/60 leading-normal font-light">
                            Selected category requires custom consultation for specialty requests. Simply book or walk-in.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedCategory(activeRateCategory);
                            handleBookNowClick();
                          }}
                          className="w-full sm:w-auto shrink-0 bg-charcoal text-alabaster px-6 py-2.5 text-[10px] font-sans uppercase tracking-wider font-semibold hover:bg-charcoal/90 transition-all text-center"
                        >
                          Book Category Now
                        </button>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>

          </div>
        </section>


        {/* THE HERITAGE / NARRATIVE STORY SECTION */}
        <section className="bg-stone py-24 md:py-32 px-6 border-y border-charcoal/5 relative overflow-hidden" id="story">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Text details */}
              <div className="lg:col-span-7 text-left lg:pr-12">
                <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-charcoal/50 block mb-3 font-semibold">
                  03 // HISTORIC INSTITUTION
                </span>
                <h2 className="serif-header text-4xl md:text-5xl lg:text-6xl text-charcoal font-extralight tracking-tight mb-8">
                  Serving Slauson Avenue <span className="italic">since 1999</span>
                </h2>
                
                <div className="space-y-6 text-sm text-charcoal/70 font-light leading-relaxed font-sans">
                  <p>
                    For over 25 years, Diamond Cuts Barber Salon has stood as a visual anchor and premier grooming destination in Los Angeles. Founded on Slauson Avenue, our salon was built on a simple philosophy: grooming is an architectural dialogue between precision, luxury styling, and individual identity.
                  </p>
                  <p>
                    We did not start as a fast-volume barber franchise. Instead, we cultivated specialized crafts. Our salon brings together standard-setting master barbers, highly-focused symmetrical braiders, precise loc technologists, and styling shear professionals. 
                  </p>
                  <p className="italic text-charcoal font-serif text-base pt-2">
                    "We do not merely trim hair; we restore absolute self-assurance."
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-12 border-t border-charcoal/10 mt-12">
                  <div>
                    <h4 className="serif-header text-2xl text-charcoal font-medium">1999</h4>
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">Founding Year</p>
                  </div>
                  <div>
                    <h4 className="serif-header text-2xl text-charcoal font-medium">1,200+</h4>
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">Verified Ratings</p>
                  </div>
                  <div>
                    <h4 className="serif-header text-2xl text-charcoal font-medium">100%</h4>
                    <p className="text-[10px] uppercase tracking-widest text-charcoal/50 mt-1">Precision Minded</p>
                  </div>
                </div>
              </div>

              {/* Right Column visual stack image cards */}
              <div className="lg:col-span-5 relative">
                <div className="relative aspect-[3/4] overflow-hidden bg-charcoal/5 border border-charcoal/10 shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1595959183075-c1d09e573ea3?auto=format&fit=crop&w=700&q=80" 
                    alt="Barber styling close-up" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-95"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=700&q=80";
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-charcoal/70 via-charcoal/30 to-transparent p-8 text-left">
                    <p className="text-white text-xs font-light leading-relaxed">
                      "Grooming is more than maintenance—it is a personal preservation of precision styling."
                    </p>
                    <span className="text-[9px] tracking-widest text-white/50 block mt-2 uppercase font-mono">
                      - SPECIALTY CRAFTSMANSHIP
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* CLIENT TESTIMONIAL CAROUSEL */}
        <section className="py-24 px-6 bg-alabaster">
          <div className="max-w-4xl mx-auto text-center">
            <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-charcoal/50 block mb-6 font-semibold">
              04 // PATRON DISCOURSE
            </span>
            
            <div className="min-h-[11rem] md:min-h-[9rem] py-4 flex items-center justify-center relative overflow-hidden mb-8" id="testimonial-slider">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTestimonial}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-2xl mx-auto"
                >
                  <blockquote className="serif-header text-xl md:text-2xl text-charcoal italic leading-relaxed font-light">
                    "{testimonials[activeTestimonial].quote}"
                  </blockquote>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Testimonial Author Meta */}
            <div className="flex flex-col items-center">
              <span className="text-xs uppercase tracking-widest font-semibold text-charcoal">
                {testimonials[activeTestimonial].author}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-charcoal/40 font-mono mt-1">
                {testimonials[activeTestimonial].role}
              </span>
            </div>

            {/* Carousel navigation indicators */}
            <div className="flex items-center justify-center space-x-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    activeTestimonial === index ? 'bg-charcoal w-6' : 'bg-charcoal/20'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

          </div>
        </section>


        {/* CONSOLIDATED CONTACT & OPERATIONAL HOURS */}
        <section className="bg-stone py-24 md:py-32 px-6 border-t border-charcoal/10" id="contact">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
              
              {/* Left Column: Essential details & Interactive Contact formulation */}
              <div className="lg:col-span-6 flex flex-col space-y-10">
                <div>
                  <span className="text-[10px] uppercase font-sans tracking-[0.25em] text-charcoal/50 block mb-3 font-semibold">
                    05 // ENTRANCE DETAILS
                  </span>
                  <h2 className="serif-header text-4xl md:text-5xl text-charcoal font-extralight tracking-tight">
                    Visit the Studio
                  </h2>
                </div>

                {/* Grid listing details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-charcoal/10 pb-10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-charcoal/40">
                      <MapPin size={14} />
                      <span className="text-[10px] tracking-widest uppercase font-semibold">HQ LOCATION</span>
                    </div>
                    <p className="text-xs text-charcoal font-medium font-sans leading-relaxed">
                      4916 W. Slauson Ave,<br />
                      Los Angeles, CA 90056
                    </p>
                    <a 
                      href="https://maps.google.com/?q=4916+W.+Slauson+Ave,+Los+Angeles,+CA+90056" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold text-charcoal hover:opacity-75 pt-1.5 border-b border-charcoal/30 pb-0.5 leading-none"
                    >
                      <span>Get Directions</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 text-charcoal/40">
                      <Phone size={14} />
                      <span className="text-[10px] tracking-widest uppercase font-semibold">CALL INQUIRIES</span>
                    </div>
                    <p className="text-xs text-charcoal font-medium font-sans leading-relaxed">
                      Direct Studio Desk:<br />
                      323-815-1858
                    </p>
                    <a 
                      href="tel:323-815-1858" 
                      className="inline-flex items-center space-x-1.5 text-[10px] uppercase tracking-wider font-semibold text-charcoal hover:opacity-75 pt-1.5 border-b border-charcoal/30 pb-0.5 leading-none"
                    >
                      <span>Dial Hotline</span>
                    </a>
                  </div>
                </div>

                {/* Clean Contact Form integration */}
                <div className="bg-alabaster p-8 border border-charcoal/5 shadow-sm">
                  <h4 className="serif-header text-xl text-charcoal font-medium mb-4">Direct Message</h4>
                  <p className="text-xs text-charcoal/60 leading-relaxed font-light mb-6">
                    Have questions about services or custom braids styling? Drop your details and we will reply promptly.
                  </p>

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/60 font-semibold mb-1.5 focus-within:text-charcoal">Your Full Name</label>
                      <input 
                        type="text" 
                        required
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        placeholder="e.g., Sterling Jones" 
                        className="w-full bg-stone-50 border border-charcoal/10 focus:border-charcoal/40 px-4 py-3 text-xs text-charcoal placeholder:text-charcoal/50 outline-none transition-all duration-200 shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/60 font-semibold mb-1.5 focus-within:text-charcoal">Email Address</label>
                      <input 
                        type="email" 
                        required
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="e.g., sterling@domain.com" 
                        className="w-full bg-stone-50 border border-charcoal/10 focus:border-charcoal/40 px-4 py-3 text-xs text-charcoal placeholder:text-charcoal/50 outline-none transition-all duration-200 shadow-inner"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-[0.15em] text-charcoal/60 font-semibold mb-1.5 focus-within:text-charcoal">Your Inquiry Details</label>
                      <textarea 
                        rows={3}
                        required
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="e.g., Share details of your styling needs..." 
                        className="w-full bg-stone-50 border border-charcoal/10 focus:border-charcoal/40 px-4 py-3 text-xs text-charcoal placeholder:text-charcoal/50 outline-none transition-all duration-200 resize-none shadow-inner"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1C1C1A] text-alabaster py-3.5 text-xs font-sans uppercase tracking-[0.2em] font-semibold transition-all duration-300 hover:bg-[#2C2C2A] hover:tracking-[0.25em] cursor-pointer shadow-md active:scale-[0.98] border border-transparent"
                    >
                      SEND MESSAGE
                    </button>
                    
                    <AnimatePresence>
                      {contactSubmitted && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 text-[11px] p-3 text-center mt-3"
                        >
                          Thank you. Your message has been routed to our office successfully.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </form>
                </div>
              </div>


              {/* Right Column: Beautiful Container listing hours */}
              <div className="lg:col-span-6 bg-charcoal text-alabaster p-8 md:p-12 relative overflow-hidden" id="hours-container">
                
                {/* Visual Accent */}
                <div className="absolute right-0 top-0 w-40 h-40 bg-white/3 -mr-12 -mt-12 rounded-full blur-2xl"></div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-white/40 block font-mono font-medium">
                          RESPECTING YOUR TIME
                        </span>
                        <h3 className="serif-header text-3xl font-light text-alabaster mt-1">
                          Salon Schedule
                        </h3>
                      </div>
                      
                      {/* Active Live open ticker */}
                      <div className="bg-white/5 border border-white/10 px-3 py-1.5 flex items-center space-x-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isOpenNow ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                        <span className="text-[9px] uppercase tracking-widest font-sans font-semibold">
                          {isOpenNow ? 'Currently Open' : 'Special Appt Only'}
                        </span>
                      </div>
                    </div>

                    {/* Operational schedules stack */}
                    <div className="flex flex-col space-y-4 font-sans text-xs">
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Monday</span>
                        <span className="font-medium tracking-wide">By Appointment Only</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Tuesday</span>
                        <span className="font-medium tracking-wide">9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Wednesday</span>
                        <span className="font-medium tracking-wide">9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Thursday</span>
                        <span className="font-medium tracking-wide">9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Friday</span>
                        <span className="font-medium tracking-wide">9:00 AM - 7:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Saturday</span>
                        <span className="font-medium tracking-wide">8:00 AM - 6:00 PM</span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="font-light text-white/60">Sunday</span>
                        <span className="font-medium text-white/40 font-mono text-[10px] tracking-widest uppercase">Closed</span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Book call action */}
                  <div className="mt-12 pt-8 border-t border-white/10 text-left">
                    <p className="text-[11px] text-white/50 leading-relaxed font-light mb-6">
                      For primary consideration, we highly request booking your slots in advance below. Walk-ins are accommodated based on specialist availability.
                    </p>
                    <button
                      onClick={handleBookNowClick}
                      className="w-full bg-[#FBFBF9] text-[#1C1C1A] border border-[#FBFBF9] hover:bg-transparent hover:text-[#FBFBF9] py-4 text-xs font-sans uppercase tracking-widest font-semibold transition-all duration-300 text-center"
                    >
                      Book Free Appointment Slot
                    </button>
                  </div>

                </div>

              </div>

            </div>
          </div>
        </section>

      </main>

      {/* LUXURY BRUTALIST FOOTER */}
      <footer className="bg-charcoal text-alabaster border-t border-white/10 py-16 px-6" id="site-footer">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-baseline justify-between gap-8">
          
          <div className="text-left flex flex-col">
            <span className="serif-header text-2xl font-light tracking-widest text-[#FBFBF9] uppercase leading-tight mb-2">
              DIAMOND CUTS
            </span>
            <span className="text-[9px] uppercase tracking-[0.3em] font-sans text-white/45 leading-none">
              BARBER SALON • ALL RIGHTS RESERVED
            </span>
          </div>

          <p className="text-[10px] text-white/40 tracking-widest uppercase font-mono mt-2 md:mt-0 max-w-sm text-left leading-relaxed">
            4916 W. Slauson Ave, Los Angeles, CA 90056 • EST. 1999 • ARCHITECTURAL LUXURY HAIR DESIGN
          </p>

          <div className="flex items-center space-x-6">
            <a 
              href="https://instagram.com/diamondcutsbarbersalon" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs uppercase tracking-widest font-semibold hover:opacity-85 text-white/70"
            >
              INSTAGRAM
            </a>
            <span className="text-white/20">/</span>
            <a 
              href="tel:323-815-1858" 
              className="text-xs uppercase tracking-widest font-semibold hover:opacity-85 text-white/70"
            >
              323.815.1858
            </a>
          </div>

        </div>
      </footer>


      {/* REAL-TIME LIVE BOOKING ENGINE DRAWER OVERLAY */}
      <AnimatePresence>
        {isBookingOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" id="booking-drawer-portal">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBookingOpen(false)}
              className="fixed inset-0 bg-charcoal/80"
              id="booking-backdrop"
            />

            {/* Sliding Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-alabaster shadow-2xl h-full overflow-y-auto flex flex-col justify-between"
              id="booking-panel-container"
            >
              
              {/* Header */}
              <div className="px-8 py-6 bg-stone border-b border-charcoal/10 flex items-center justify-between sticky top-0 bg-stone/95 backdrop-blur-sm z-10 text-left">
                <div>
                  <span className="text-[9px] uppercase font-mono tracking-widest text-charcoal/40">
                    DIAMOND CUTS APPOINTMENT
                  </span>
                  <h3 className="serif-header text-2xl font-light text-charcoal mt-1">
                    Book Treatment
                  </h3>
                </div>
                <button
                  onClick={() => setIsBookingOpen(false)}
                  className="p-1 px-3 border border-charcoal/10 hover:border-charcoal/40 text-charcoal/60 hover:text-charcoal transition-all text-xs uppercase tracking-widest"
                  id="close-booking-btn"
                >
                  Close
                </button>
              </div>

              {/* Main Steps Content */}
              <div className="px-8 py-8 flex-grow text-left">
                
                {/* Step indicator */}
                {bookingStep < 3 && (
                  <div className="flex items-center space-x-6 mb-8 border-b border-charcoal/5 pb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                        bookingStep === 1 ? 'bg-charcoal text-alabaster' : 'bg-charcoal/10 text-charcoal'
                      }`}>1</span>
                      <span className="text-[10px] font-sans uppercase tracking-widest font-semibold text-charcoal">Select Craft</span>
                    </div>
                    <div className="h-[1px] bg-charcoal/10 flex-grow"></div>
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                        bookingStep === 2 ? 'bg-charcoal text-alabaster' : 'bg-charcoal/10 text-charcoal'
                      }`}>2</span>
                      <span className="text-[10px] font-sans uppercase tracking-widest font-semibold text-charcoal">Pre-Check & Client Info</span>
                    </div>
                  </div>
                )}

                {/* STEP 1: Select Service Craft and Specialist */}
                {bookingStep === 1 && (
                  <div className="space-y-6" id="booking-step-1">
                    
                    {/* Select Pillar Category */}
                    <div>
                      <label className="block text-[10px] uppercase font-sans tracking-widest text-charcoal/60 mb-2 font-semibold">Select Craft Artistry</label>
                      <div className="grid grid-cols-2 gap-2" id="booking-pillar-list">
                        {Object.entries(SERVICE_CATEGORIES).map(([key, cat]) => (
                          <button
                            key={key}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(key);
                              setSelectedService(''); // reset service
                            }}
                            className={`p-3 text-left border text-xs transition-all ${
                              selectedCategory === key 
                                ? 'border-charcoal bg-stone font-semibold text-charcoal' 
                                : 'border-charcoal/10 hover:border-charcoal/30 text-charcoal/70'
                            }`}
                          >
                            {cat.title}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Select Service Item */}
                    <div>
                      <label className="block text-[10px] uppercase font-sans tracking-widest text-charcoal/60 mb-2 font-semibold">Select Service Layout</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 border border-charcoal/5 p-1 bg-stone/30">
                        {selectedCategoryData.services.map((svc, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setSelectedService(svc.name)}
                            className={`w-full p-3.5 text-left border flex items-center justify-between text-xs transition-all ${
                              selectedService === svc.name 
                                ? 'border-charcoal bg-alabaster font-medium' 
                                : 'bg-transparent border-charcoal/5 hover:border-charcoal/20 text-charcoal/80'
                            }`}
                          >
                            <div>
                              <p className="font-sans">{svc.name}</p>
                              <p className="text-[9px] font-mono tracking-wider text-charcoal/40 mt-1 uppercase">Duration: {svc.duration}</p>
                            </div>
                            <span className="serif-header font-light text-sm">{svc.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Select Specialist */}
                    <div>
                      <label className="block text-[10px] uppercase font-sans tracking-widest text-charcoal/60 mb-2 font-semibold font-semibold">Select Specialist Expert</label>
                      <div className="space-y-2">
                        {SPECIALISTS.map((spec) => (
                          <button
                            key={spec.id}
                            type="button"
                            onClick={() => setSelectedSpecialist(spec.id)}
                            className={`w-full p-3 border flex items-center justify-between text-xs transition-all ${
                              selectedSpecialist === spec.id
                                ? 'border-charcoal bg-stone font-medium'
                                : 'border-charcoal/5 hover:border-charcoal/15 bg-transparent text-charcoal/80'
                            }`}
                          >
                            <div className="text-left">
                              <p>{spec.name}</p>
                              <p className="text-[9px] font-mono uppercase tracking-wider text-charcoal/40">{spec.role}</p>
                            </div>
                            <span className="text-[9px] uppercase tracking-wider bg-charcoal/5 px-2.5 py-1 text-charcoal/60">
                              {spec.rates}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calendar Date Selector Grid */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-sans tracking-widest text-[#1C1C1A]/60 font-semibold" id="label-booking-date">
                        Select Appointment Date (Calendar Grid)
                      </label>
                      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 gap-2" id="booking-datepicker-grid">
                        {BOOKING_DATES.map((item) => {
                          const isSelected = bookingDate === item.dateStr;
                          return (
                            <button
                              key={item.dateStr}
                              type="button"
                              onClick={() => setBookingDate(item.dateStr)}
                              className={`p-3 text-center border flex flex-col items-center justify-between text-xs transition-all cursor-pointer ${
                                isSelected 
                                  ? 'border-charcoal bg-stone font-semibold text-charcoal' 
                                  : 'border-charcoal/5 bg-transparent hover:border-charcoal/20 text-charcoal/70'
                              }`}
                            >
                              <span className="text-[9px] uppercase font-mono text-charcoal/40 tracking-wider">
                                {item.dayName}
                              </span>
                              <span className="serif-header text-lg font-light block my-1">
                                {item.dayNum}
                              </span>
                              <span className="text-[9px] uppercase font-mono text-charcoal/50 tracking-wider">
                                {item.label ? item.label : item.monthName}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Clock Hour Grid Selector */}
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-sans tracking-widest text-[#1C1C1A]/60 font-semibold" id="label-booking-time">
                        Select Shift Hour Grid
                      </label>
                      <div className="grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 gap-2" id="booking-timepicker-grid">
                        {[
                          "09:00 AM",
                          "10:00 AM",
                          "11:30 AM",
                          "01:00 PM",
                          "02:30 PM",
                          "04:00 PM",
                          "05:30 PM"
                        ].map((time) => {
                          const isSelected = bookingTime === time;
                          return (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setBookingTime(time)}
                              className={`p-2.5 text-center border text-[11px] font-mono tracking-wider transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-charcoal bg-stone font-semibold text-charcoal'
                                  : 'border-charcoal/5 bg-transparent hover:border-charcoal/15 text-charcoal/80'
                              }`}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Next Action */}
                    <button
                      type="button"
                      disabled={!selectedService}
                      onClick={() => setBookingStep(2)}
                      className="w-full bg-charcoal text-alabaster hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed py-4 text-xs font-sans uppercase tracking-widest font-semibold mt-4 transition-all"
                    >
                      Continue to Client Pre-Check
                    </button>

                  </div>
                )}

                {/* STEP 2: Client Profile validation */}
                {bookingStep === 2 && (
                  <form onSubmit={handleBookingConfirm} className="space-y-6" id="booking-step-2">
                    
                    {/* Summary Overview */}
                    <div className="bg-stone border border-charcoal/10 p-5 space-y-4">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-charcoal/40 block font-semibold border-b border-charcoal/10 pb-2">
                        TREATMENT SUMMARY
                      </span>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-charcoal/50 font-light">Artistry Craft:</span>
                          <span className="font-semibold">{SERVICE_CATEGORIES[selectedCategory as keyof typeof SERVICE_CATEGORIES].title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal/50 font-light">Selected Finish:</span>
                          <span className="font-semibold text-right max-w-[200px]">{selectedService}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal/50 font-light">Groomer Architect:</span>
                          <span className="font-semibold">{SPECIALISTS.find(s => s.id === selectedSpecialist)?.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal/50 font-light">Selected Slot:</span>
                          <span className="font-semibold">{bookingDate} @ {bookingTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal inputs */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-charcoal/60 mb-2 font-semibold">Your Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Sterling Jones" 
                          className="w-full bg-stone border border-charcoal/10 p-3 text-xs text-charcoal outline-none placeholder-charcoal/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-charcoal/60 mb-2 font-semibold font-semibold">Mobile Phone (For Alerts)</label>
                        <input 
                          type="tel" 
                          required
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. 323-555-0199" 
                          className="w-full bg-stone border border-charcoal/10 p-3 text-xs text-charcoal outline-none placeholder-charcoal/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-charcoal/60 mb-2 font-semibold">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. sterling@gmail.com" 
                          className="w-full bg-stone border border-charcoal/10 p-3 text-xs text-charcoal outline-none placeholder-charcoal/30"
                        />
                      </div>
                    </div>

                    {/* Buttons navigation */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="border border-charcoal/10 hover:border-charcoal/30 text-charcoal py-3 text-center text-xs uppercase tracking-widest font-semibold"
                      >
                        Pillar Back
                      </button>
                      <button
                        type="submit"
                        className="bg-charcoal hover:bg-charcoal/90 text-alabaster py-3 text-center text-xs uppercase tracking-widest font-semibold"
                      >
                        Confirm Slot
                      </button>
                    </div>

                  </form>
                )}

                {/* STEP 3: Receipt Appointment Confirmation success */}
                {bookingStep === 3 && bookingCompleted && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 space-y-6"
                    id="booking-completed-screen"
                  >
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                      <Check size={28} />
                    </div>

                    <div className="space-y-2">
                      <h4 className="serif-header text-3xl font-light text-charcoal">
                        Treatment Confirmed
                      </h4>
                      <p className="text-xs text-charcoal/60 font-sans max-w-xs mx-auto">
                        Your grooming slot has been locked into Slauson Desk's schedule. Please save your receipt details below.
                      </p>
                    </div>

                    {/* Receipt print card */}
                    <div className="bg-stone border border-charcoal/10 p-6 text-left max-w-xs mx-auto space-y-4">
                      <div className="border-b border-charcoal/10 pb-3 flex justify-between items-baseline">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-charcoal/40">RECEIPT TICKET</span>
                        <span className="text-xs font-semibold text-charcoal">#{Math.floor(Math.random() * 90000 + 10000)}</span>
                      </div>

                      <div className="space-y-2 text-[11px] font-sans">
                        <p><strong className="font-semibold uppercase tracking-wider text-[9px] text-charcoal/50 block">PATRON:</strong> {customerName}</p>
                        <p><strong className="font-semibold uppercase tracking-wider text-[9px] text-charcoal/50 block">CRAFT FINISH:</strong> {selectedService}</p>
                        <p><strong className="font-semibold uppercase tracking-wider text-[9px] text-charcoal/50 block">SPECIALIST:</strong> {SPECIALISTS.find(s => s.id === selectedSpecialist)?.name}</p>
                        <p><strong className="font-semibold uppercase tracking-wider text-[9px] text-charcoal/50 block">DATE & HOUR:</strong> {bookingDate} @ {bookingTime}</p>
                        <p><strong className="font-semibold uppercase tracking-wider text-[9px] text-charcoal/50 block">SALON ADDRESS:</strong> 4916 W. Slauson Ave, LA</p>
                      </div>

                      <div className="border-t border-charcoal/10 pt-3 flex items-center justify-between text-xs font-semibold">
                        <span>ESTIMATED DUES:</span>
                        <span className="serif-header text-lg font-light text-charcoal">
                          {selectedCategoryData.services.find(s => s.name === selectedService)?.price || '$65'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[9px] text-charcoal/40 font-mono tracking-widest uppercase">
                      * A verification SMS was dispatched to {customerPhone}
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsBookingOpen(false)}
                      className="w-full bg-charcoal text-alabaster py-3 text-xs uppercase tracking-widest font-semibold max-w-xs mx-auto block active:scale-97"
                    >
                      Done
                    </button>
                  </motion.div>
                )}

              </div>

              {/* Drawer footer static note */}
              <div className="p-6 bg-stone border-t border-charcoal/5 text-center">
                <p className="text-[9px] text-charcoal/40 font-mono tracking-widest uppercase flex items-center justify-center space-x-1.5">
                  <Heart size={10} className="fill-charcoal/10 text-charcoal/40 stroke-[1.5]" />
                  <span>PREMIUM GROOMING EST. 1999 LOS ANGELES</span>
                </p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ZOOMED LOOKBOOK LIGHTBOX MODAL */}
      <AnimatePresence>
        {zoomedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-md cursor-zoom-out"
            onClick={() => setZoomedItem(null)}
          >
            {/* Close instruction top-right */}
            <div className="absolute top-6 right-6 flex items-center space-x-6 text-[#FBFBF9]/65 text-xs uppercase tracking-widest font-sans font-semibold">
              <span className="hidden md:inline">Press ESC or Click anywhere to close</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setZoomedItem(null);
                }}
                className="p-2 hover:text-[#FBFBF9] hover:bg-[#FBFBF9]/10 transition-all rounded cursor-pointer"
                aria-label="Close Lookbook Zoomed view"
              >
                <X size={20} />
              </button>
            </div>

            {/* Container for the media & metadata */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              className="relative max-w-5xl w-full flex flex-col md:flex-row items-center bg-[#FBFBF9] text-[#1C1C1A] shadow-2xl max-h-[90vh] overflow-y-auto border border-[#FBFBF9]/10 cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Previous Item Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = LOOKBOOK_ITEMS.findIndex(item => item.id === zoomedItem.id);
                  const prevIndex = (currentIndex - 1 + LOOKBOOK_ITEMS.length) % LOOKBOOK_ITEMS.length;
                  setZoomedItem(LOOKBOOK_ITEMS[prevIndex]);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-charcoal/80 text-alabaster hover:bg-charcoal p-3 hover:scale-105 transition-all text-sm rounded shadow-lg cursor-pointer"
                aria-label="Previous Lookbook image"
              >
                <ArrowRight className="rotate-180" size={16} />
              </button>

              {/* Next Item Control */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const currentIndex = LOOKBOOK_ITEMS.findIndex(item => item.id === zoomedItem.id);
                  const nextIndex = (currentIndex + 1) % LOOKBOOK_ITEMS.length;
                  setZoomedItem(LOOKBOOK_ITEMS[nextIndex]);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-charcoal/80 text-alabaster hover:bg-charcoal p-3 hover:scale-105 transition-all text-sm rounded shadow-lg cursor-pointer"
                aria-label="Next Lookbook image"
              >
                <ArrowRight size={16} />
              </button>

              {/* Image box */}
              <div className="w-full md:w-3/5 bg-charcoal aspect-[4/3] relative overflow-hidden">
                <img
                  src={zoomedItem.image}
                  alt={zoomedItem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-0"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80";
                  }}
                />
              </div>

              {/* Metadata content */}
              <div className="w-full md:w-2/5 p-8 md:p-12 text-left flex flex-col justify-between self-stretch bg-stone border-t md:border-t-0 md:border-l border-charcoal/10">
                <div className="space-y-6">
                  <div>
                    <span className="bg-charcoal text-alabaster text-[9px] font-sans font-semibold uppercase tracking-widest px-3 py-1.5 inline-block">
                      {zoomedItem.category}
                    </span>
                    <span className="ml-3 text-[10px] font-mono text-charcoal/40 tracking-wider">
                      DC-{String(zoomedItem.id).padStart(2, '0')}
                    </span>
                  </div>

                  <h3 className="serif-header text-3xl md:text-4xl font-light tracking-tight text-charcoal">
                    {zoomedItem.title}
                  </h3>

                  <div className="w-12 h-[1px] bg-charcoal/20"></div>

                  <p className="text-sm font-sans text-charcoal/70 leading-relaxed font-light">
                    {zoomedItem.description}
                  </p>
                </div>

                <div className="pt-8 mt-8 border-t border-charcoal/10 flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-4">
                  <button
                    onClick={() => {
                      setZoomedItem(null);
                      handleBookNowClick();
                    }}
                    className="bg-charcoal text-alabaster hover:bg-[#FBFBF9] hover:text-[#1C1C1A] border border-charcoal py-3 px-6 text-xs uppercase tracking-widest font-semibold transition-all text-center flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>Request Style</span>
                    <Scissors size={12} />
                  </button>
                  <button
                    onClick={() => setZoomedItem(null)}
                    className="text-xs uppercase tracking-widest font-semibold py-3 px-4 border border-charcoal/10 hover:border-charcoal/30 text-center text-charcoal cursor-pointer"
                  >
                    Close View
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
