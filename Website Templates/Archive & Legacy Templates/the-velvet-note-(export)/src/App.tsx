/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Music, Wine, Calendar, Clock, MapPin, Sparkles, Phone, Star, 
  ChevronRight, CheckCircle, Camera, Check, Instagram, Menu, X,
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Load static brand details
import { HOST_NICHES, GENERAL_TESTIMONIALS } from "./data";

export default function App() {
  const brandData = HOST_NICHES[0];
  
  // Menu active category filter
  const [menuFilter, setMenuFilter] = useState<string>("all");
  
  // Suggested pairing expanded state
  const [selectedPairing, setSelectedPairing] = useState<string | null>(null);

  // Hovered menu item for custom interaction & immersive tooltips
  const [hoveredMenuItem, setHoveredMenuItem] = useState<string | null>(null);
  
  // Selected menu item for premium micro-modal popovers
  const [selectedMenuItemDetails, setSelectedMenuItemDetails] = useState<any | null>(null);

  // Exquisite wine & handmade cocktail pairing notes
  const pairingNotes: Record<string, string> = {
    m1: "Best paired with our Reserve Oregon Pinot Noir. The cherry reduction matches beautifully with the wine's dry cedar and bright red fruit tones.",
    m2: "Best paired with our Truffle Lobster Frites or Prime Beef Carpaccio to complement the rich wood char.",
    m3: "Best paired with our Oak-Aged Chardonnay. The butter-seared lobster matches the buttery, vanilla notes of the wine.",
    m4: "Best paired with our Aged Cabernet Sauvignon. The rich Wagyu marble structure dissolves under the robust tannins.",
    m5: "Best paired with our Warm Brioche Bread Pudding or light savory bites to let the floral gin notes shine through.",
    m6: "Best paired with a curated Espresso Martini or 20-Year Tawny Port for a deep, rich caramelized finish."
  };

  // Reservation Flow state
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(confirmationCode);
    setCopiedCode(true);
    setTimeout(() => {
      setCopiedCode(false);
    }, 2000);
  };

  const [guestCount, setGuestCount] = useState("2");
  const [bookDate, setBookDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5); // Default to 5 days in the future
    return d.toISOString().split("T")[0];
  });
  const [bookTime, setBookTime] = useState("20:30");
  const [bookZone, setBookZone] = useState("indoor");
  const [custName, setCustName] = useState("");
  const [custEmail, setCustEmail] = useState("");
  const [custNotes, setCustNotes] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Email Newsletter state
  const [subscribedEmail, setSubscribedEmail] = useState("");
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);

  // FAQ Collapsible Accordion state
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqItems = [
    {
      question: "Is there a specific dress code required?",
      answer: "We recommend a smart casual or elegant evening attire. Our goal is to maintain an elevated, sophisticated atmosphere for all guests celebrating their evening with us."
    },
    {
      question: "Do you offer valet or parking services?",
      answer: "Validated parking is available at adjacent secure garages, and complimentary valet service is offered on weekend evenings starting at 5:00 PM."
    },
    {
      question: "What is your policy on outside wine or corkage?",
      answer: "Guests are welcome to bring personal bottles of wine. We observe a standard corkage rate of $35 per 750ml bottle, up to a maximum of two bottles per reservation."
    },
    {
      question: "Are photography and filming permitted?",
      answer: "To preserve a refined sanctuary and respect guest privacy, we ask that flash photography and professional recording equipment remain inactive. Casual non-flash captures of your table are welcome."
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribedEmail) return;
    setSubscriptionSuccess(true);
  };

  // Guest Feedback Review state
  const [customReviews, setCustomReviews] = useState<any[]>([]);
  const [feedbackName, setFeedbackName] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackRatingHover, setFeedbackRatingHover] = useState<number | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackName || !feedbackComment) return;
    
    const newReview = {
      id: `custom-${Date.now()}`,
      author: feedbackName,
      role: "Verified Guest",
      rating: feedbackRating,
      quote: feedbackComment,
      source: "Guest Book"
    };
    
    setCustomReviews([newReview, ...customReviews]);
    setFeedbackSuccess(true);
    setFeedbackName("");
    setFeedbackComment("");
    setFeedbackRating(5);
    
    setTimeout(() => {
      setFeedbackSuccess(false);
    }, 4000);
  };

  // Testimonial sliding carousel state
  const reviewsList = [...customReviews, ...GENERAL_TESTIMONIALS];
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  useEffect(() => {
    if (reviewsList.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentReviewIndex((prev) => (prev + 1) % reviewsList.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviewsList.length]);

  // Smooth custom scroll-to-section with header offset
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const yOffset = -80; // 80px offset for sticky header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // Luxury 'Download Menu PDF' functionality
  const handleDownloadMenu = () => {
    const chefName = brandData.brandStory?.chefName || "Julian Vance";
    let menuText = `==================================================================
                      THE VELVET NOTE
                Fine Dining & Music Lounge
==================================================================

                   EXECUTIVE RESUME MENU
               Chef ${chefName}, Presenting
               
       Location: ${brandData.contact.address}, ${brandData.contact.cityState}
       Reservations: ${brandData.contact.phone}
       Hours: Mon-Sun 5:00 PM - 12:59 AM
          
==================================================================

`;

    // Group items by category for pristine layout
    const categories = {
      "Signature Dishes": menuItems.filter(i => i.category === "signature" || i.category === "mains"),
      "Craft Cocktails": menuItems.filter(i => i.category === "cocktails"),
      "Decadent Desserts": menuItems.filter(i => i.category === "dessert")
    };

    Object.entries(categories).forEach(([catTitle, items]) => {
      if (items.length === 0) return;
      menuText += `------------------------------------------------------------------\n`;
      menuText += `  ${catTitle.toUpperCase()}\n`;
      menuText += `------------------------------------------------------------------\n\n`;
      
      items.forEach((item) => {
        // Pads title and price elegantly
        const dots = ".".repeat(Math.max(4, 55 - item.name.length - (item.price || "").length));
        menuText += `  ${item.name.toUpperCase()} ${dots} ${item.price}\n`;
        const wrapDesc = item.description || "";
        menuText += `  ${wrapDesc}\n`;
        if (item.tags && item.tags.length > 0) {
          menuText += `  [Attributes: ${item.tags.join(", ")}]\n`;
        }
        menuText += `\n`;
      });
      menuText += `\n`;
    });

    menuText += `==================================================================
                 Thank you for choosing The Velvet Note.
     Secured digitally at: ${window.location.origin}
==================================================================`;

    const blob = new Blob([menuText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "The_Velvet_Note_Executive_Menu.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Luxury dynamic availability feedback
  const getAvailabilityText = () => {
    try {
      const selectedDateObj = new Date(bookDate + "T12:00:00");
      const today = new Date();
      const isToday = selectedDateObj.toDateString() === today.toDateString();
      
      if (isToday) {
        return "Only 3 premium tables remain for tonight";
      } else {
        const formattedDate = selectedDateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", weekday: "short" });
        const hash = bookDate.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const remainingTables = (hash % 3) + 2; 
        return `Limited reservation slots remaining for ${formattedDate} (${remainingTables} tables left)`;
      }
    } catch (err) {
      return "Only 3 premium tables remain for tonight";
    }
  };

  // Handles form submission for reservations
  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) return;
    const prefix = brandData.name
      .split(" ")
      .map(w => w[0])
      .join("")
      .toUpperCase();
    setConfirmationCode(`${prefix}-${Math.floor(100000 + Math.random() * 900000)}`);
    setBookingSubmitted(true);
  };

  const menuItems = brandData.menuItems;
  const filteredMenu = menuFilter === "all" 
    ? menuItems 
    : menuItems.filter(item => {
        if (menuFilter === "mains") return item.category === "mains" || item.category === "signature";
        return item.category === menuFilter;
      });

  const bookingSlots = [
    { value: "18:00", label: "6:00 PM (Early Dinner)" },
    { value: "20:30", label: "8:30 PM (Dinner Seating)" },
    { value: "22:45", label: "10:45 PM (Late Seating)" }
  ];

  const seatingZones = [
    { id: "indoor", label: "Indoor Seating", desc: "Sophisticated main room dining" },
    { id: "patio", label: "Outdoor/Patio", desc: "Fresh air dining atmosphere" },
    { id: "bar", label: "Bar Seating", desc: "Premium high-top counter view" }
  ];

  const getZoneLabel = (id: string) => {
    return seatingZones.find(z => z.id === id)?.label || "Main Dining Room";
  };

  return (
    <div className="min-h-screen bg-[#070509] text-gray-200 font-sans relative antialiased selection:bg-[#C5A85C]/30 selection:text-[#C5A85C]">
      
      {/* Background Subtle Ambience Overlay & Gilded Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-950/10 via-[#070509] to-[#050406] pointer-events-none z-0" />
      <div className="absolute top-[5%] right-[10%] w-[500px] h-[500px] rounded-full bg-[#C5A85C]/[0.015] filter blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[5%] w-[400px] h-[400px] rounded-full bg-rose-950/[0.02] filter blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] rounded-full bg-[#1A102F]/[0.08] filter blur-[140px] pointer-events-none z-0" />

      {/* STABLE BRAND HEADER */}
      <header className="sticky top-0 w-full bg-[#070509]/95 backdrop-blur-md border-b border-white/[0.03] z-40 transition-all duration-300">
        <div id="nav-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          <a href="#hero" onClick={(e) => handleScrollTo(e, "hero")} id="brand-logo" className="flex flex-col group gap-0.5 animate-fade-in">
            <span className="text-lg sm:text-xl font-bold tracking-[0.25em] text-white uppercase font-serif">
              {brandData.name}
            </span>
            <span className="text-[7.5px] font-mono tracking-[0.35em] text-[#C5A85C] uppercase">
              {brandData.tagline}
            </span>
          </a>

          {/* Clean Large-Screen Navigation */}
          <nav id="desktop-nav" className="hidden md:flex items-center gap-8 text-[10.5px] font-mono uppercase tracking-[0.2em] text-stone-400">
            <a href="#about" onClick={(e) => handleScrollTo(e, "about")} className="hover:text-[#C5A85C] transition-colors duration-200">Our Story</a>
            <a href="#menu" onClick={(e) => handleScrollTo(e, "menu")} className="hover:text-[#C5A85C] transition-colors duration-200">Menu Highlights</a>
            <a href="#events" onClick={(e) => handleScrollTo(e, "events")} className="hover:text-[#C5A85C] transition-colors duration-200">Upcoming Performances</a>
            <a href="#occasions" onClick={(e) => handleScrollTo(e, "occasions")} className="hover:text-[#C5A85C] transition-colors duration-200">Private Events</a>
            <a href="#reservations" onClick={(e) => handleScrollTo(e, "reservations")} className="hover:text-[#C5A85C] transition-colors font-semibold text-stone-200">Reservations</a>
          </nav>

          {/* Contact Details & Immediate CTA */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col items-end text-right gap-0.5 font-mono">
              <span className="text-[7px] tracking-widest text-[#C5A85C] uppercase font-bold">FINE DINING & MUSIC LOUNGE</span>
              <span className="text-xs font-semibold text-white tracking-wider">
                {brandData.contact.phone}
              </span>
            </div>
            
            <a
              id="cta-book-header"
              href="#reservations"
              onClick={(e) => handleScrollTo(e, "reservations")}
              className="px-4 py-2.5 border border-[#C5A85C]/35 bg-[#C5A85C]/[0.03] text-[#C5A85C] text-[9px] font-bold uppercase tracking-[0.2em] rounded-sm font-mono hover:bg-[#C5A85C] hover:text-black transition-all duration-300 text-center shadow-md shadow-[#000]/40"
            >
              Reserve a Table
            </a>

            {/* Mobile menu trigger */}
            <button 
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-400 hover:text-white transition-colors focus:outline-none"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile drawer navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            id="mobile-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-20 left-0 w-full bg-[#09070a] border-b border-white/[0.05] z-30 shadow-2xl"
          >
            <div className="px-6 py-6 flex flex-col gap-4 text-[11px] font-mono uppercase tracking-[0.2em] text-stone-300">
              <a href="#about" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo(e, "about"); }} className="hover:text-[#C5A85C] py-1 border-b border-white/[0.02]">Our Story</a>
              <a href="#menu" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo(e, "menu"); }} className="hover:text-[#C5A85C] py-1 border-b border-white/[0.02]">Menu Highlights</a>
              <a href="#events" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo(e, "events"); }} className="hover:text-[#C5A85C] py-1 border-b border-white/[0.02]">Upcoming Performances</a>
              <a href="#occasions" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo(e, "occasions"); }} className="hover:text-[#C5A85C] py-1 border-b border-white/[0.02]">Private Events</a>
              <a href="#reservations" onClick={(e) => { setMobileMenuOpen(false); handleScrollTo(e, "reservations"); }} className="hover:text-[#C5A85C] py-1">Reservations</a>
              <div className="pt-3 text-stone-500 text-[9px] font-mono border-t border-white/[0.03]">
                {brandData.contact.address}, {brandData.contact.cityState} • {brandData.contact.phone}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CINEMATIC MOODY HERO */}
      <section id="hero" className="relative h-[88vh] sm:h-[90vh] lg:h-[95vh] min-h-[640px] sm:min-h-[720px] flex items-center justify-center py-16 overflow-hidden z-10">
        
        {/* Full background cinematic dark overlay with large background photo */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none scale-105">
          <img 
            src="https://images.unsplash.com/photo-1481833761820-0509d3217039?auto=format&fit=crop&w=1920&q=80" 
            alt="Warm glowing mood lighting over cocktail glass and elegant dining lounge" 
            className="w-full h-full object-cover object-center filter brightness-[0.26] contrast-[1.05]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070509] via-transparent to-[#070509]/40" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-white/[0.02] border border-[#C5A85C]/20 rounded-full mb-1"
            >
              <Sparkles className="w-3 h-3 text-[#C5A85C]" />
              <span className="text-[8.5px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase">
                Now Hosting Intimate Evenings
              </span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05 }}
              className="text-4xl sm:text-6xl md:text-7xl xl:text-8xl font-bold tracking-tight text-white uppercase leading-[1.05] font-serif"
            >
              Live music, fine dining, and classic cocktails.
            </motion.h1>

            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "80px" }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="h-[1px] bg-[#C5A85C]/30 mx-auto my-6"
            />

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-stone-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans font-light opacity-95"
            >
              We pair classic live performances with elegant lighting and a refined menu. Discover a welcoming, refined sanctuary designed for warm hospitality, sophisticated dinners, and premium spirits.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
            >
              <a
                id="hero-reserve-btn"
                href="#reservations"
                onClick={(e) => handleScrollTo(e, "reservations")}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#C5A85C] text-black font-mono text-[11px] font-bold uppercase tracking-[0.2em] rounded-sm hover:bg-white hover:text-black transition-all duration-300 text-center shadow-lg cursor-pointer"
              >
                Reserve a Table
              </a>
              <a
                id="hero-menu-btn"
                href="#menu"
                onClick={(e) => handleScrollTo(e, "menu")}
                className="w-full sm:w-auto px-8 py-3.5 border border-white/10 text-white font-mono text-[11px] font-semibold uppercase tracking-[0.2em] rounded-sm hover:border-[#C5A85C] hover:bg-white/[0.01] transition-all duration-300 text-center cursor-pointer"
              >
                Menu Highlights
              </a>
            </motion.div>

          </div>
        </div>

        {/* Ambient bottom transition strip */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#070509] to-transparent pointer-events-none" />
      </section>

      {/* 3. STORIES SECTION (Clean, restraint-focused brand narrative) */}
      <section id="about" className="py-32 md:py-44 lg:py-48 relative z-10 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual Narrative Side with gorgeous imagery */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-red-950/10 to-amber-950/10 rounded-sm blur-xl opacity-30 pointer-events-none" />
              
              <div className="aspect-[16/10] rounded-sm overflow-hidden border border-white/[0.08] bg-[#120F1B] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1000&q=80" 
                  alt="Cozy velvet booths and warm amber lamps inside the room" 
                  className="w-full h-full object-cover filter brightness-[0.74] contrast-[1.03] hover:scale-105 transition-transform duration-1000 animate-fade-in"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Elegant floating curator badge */}
              <div id="curator-badge" className="absolute -bottom-6 -right-4 bg-[#120F1B] border border-white/[0.08] p-4 rounded-sm shadow-xl max-w-xs space-y-1.5 backdrop-blur-sm z-20">
                <span className="text-[7.5px] font-mono tracking-widest text-[#C5A85C] block uppercase font-bold">EXECUTIVE KITCHEN</span>
                <p className="text-xs text-stone-300 italic font-serif">
                  "We pair the beautiful ambiance of live performance with highly curated, focused dining."
                </p>
                <div className="pt-2 border-t border-white/[0.05]">
                  <h5 className="text-[10px] font-mono font-bold text-white uppercase">{brandData.brandStory.chefName}</h5>
                  <span className="text-[8px] text-stone-400 font-sans block mt-0.5">{brandData.brandStory.chefRole}</span>
                </div>
              </div>
            </div>

            {/* Editorial Text Column */}
            <div className="lg:col-span-6 space-y-8 lg:pl-12">
              
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
                  Our Concept
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white font-serif uppercase leading-tight">
                  {brandData.brandStory.title}
                </h2>
                <p className="text-xs sm:text-sm md:text-base text-stone-400 font-mono tracking-wider italic">
                  {brandData.brandStory.subtitle}
                </p>
              </div>

              <div className="w-16 h-[1px] bg-[#C5A85C]/40" />

              <div className="space-y-6 text-sm sm:text-base md:text-[17px] text-stone-300 font-sans font-light leading-relaxed">
                {brandData.brandStory.paragraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>

              {/* Concrete realistic highlights */}
              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#C5A85C]/5 border border-[#C5A85C]/15 rounded-sm text-[#C5A85C] shrink-0 mt-0.5">
                    <Music className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider">Atmospheric Design</h4>
                    <p className="text-xs text-stone-400 font-light mt-1">
                      An elegant layout configured to create an engaging yet intimate listening and dining environment.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#C5A85C]/5 border border-[#C5A85C]/15 rounded-sm text-[#C5A85C] shrink-0 mt-0.5">
                    <Wine className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider font-semibold">Curated Reserve</h4>
                    <p className="text-xs text-stone-400 font-light mt-1">
                      A premier collection of carefully curated bottles, premium spirits, and world-class labels.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. FOOD & COCKTAILS SECTION */}
      <section id="menu" className="py-32 md:py-44 lg:py-48 relative z-10 bg-black/10 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 pb-6 border-b border-white/[0.04] gap-6">
            <div className="space-y-3">
              <span className="text-[9.5px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase">
                Chef {brandData.brandStory.chefName}
              </span>
              <h2 className="text-4xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white uppercase font-serif leading-none">
                Menu Highlights
              </h2>
              <div className="w-12 h-[1px] bg-[#C5A85C]/30 mt-2" />
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleDownloadMenu}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-[#C5A85C]/20 bg-[#C5A85C]/[0.02] hover:bg-[#C5A85C]/[0.1] text-[#C5A85C] hover:text-white transition-all text-[8.5px] font-mono tracking-widest uppercase rounded-sm cursor-pointer shadow-sm group"
                >
                  <FileText className="w-3.5 h-3.5 text-[#C5A85C] group-hover:scale-105 transition-transform" />
                  <span>Download Menu PDF</span>
                </button>
              </div>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-3 font-mono text-[9.5px]">
              {[
                { id: "all", label: "Full Menu" },
                { id: "mains", label: "Main Courses" },
                { id: "cocktails", label: "Cocktails" },
                { id: "dessert", label: "Desserts" }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setMenuFilter(cat.id);
                    setSelectedPairing(null);
                  }}
                  className={`px-4.5 py-2 uppercase tracking-[0.2em] border transition-all duration-300 cursor-pointer text-[9.5px] rounded-sm ${
                    menuFilter === cat.id 
                      ? "border-[#C5A85C] bg-[#C5A85C]/[0.06] text-[#C5A85C] font-semibold"
                      : "border-white/[0.05] text-stone-450 hover:text-white hover:border-white/20 bg-transparent"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Active Category Title in text-3xl or text-4xl on mobile */}
          <div className="mb-10 text-left animate-fade-in">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-white tracking-wide uppercase font-serif border-l-2 border-[#C5A85C] pl-4">
              {menuFilter === "all" ? "Full Selection" : menuFilter === "mains" ? "Main Courses" : menuFilter === "cocktails" ? "Cocktails & Spirits" : "Decadent Desserts"}
            </h3>
          </div>

          {/* Dotted Leader Grid */}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
            {filteredMenu.map((item) => {
              const isSelected = selectedPairing === item.id;
              const isHovered = hoveredMenuItem === item.id;
              
              return (
                <div 
                  key={item.id}
                  onClick={() => setSelectedMenuItemDetails(item)}
                  onMouseEnter={() => setHoveredMenuItem(item.id)}
                  onMouseLeave={() => setHoveredMenuItem(null)}
                  className="group flex flex-col justify-between cursor-pointer focus:outline-none pb-5 border-b border-white/[0.04] hover:border-white/[0.08] transition-colors relative"
                >
                  <div className="space-y-3.5">
                    
                    {/* Aligned dot leaders */}
                    <div className="flex justify-between items-end gap-2">
                      <span className="text-xl sm:text-xl md:text-2xl lg:text-[23px] font-medium text-white group-hover:text-[#C5A85C] transition-colors uppercase tracking-wide font-serif">
                        {item.name}
                        {item.isPopular && (
                          <span className="ml-3 text-[8px] font-mono text-[#C5A85C] border border-[#C5A85C]/30 bg-[#C5A85C]/[0.02] px-2 py-0.5 rounded-sm tracking-[0.15em] uppercase font-bold align-middle">
                            HOUSE
                          </span>
                        )}
                      </span>
                      <div className="flex-1 border-b border-dotted border-white/20 mx-4 h-[1px] mb-2 self-end" />
                      <span className="text-[#C5A85C] font-mono text-lg sm:text-lg md:text-xl font-semibold tracking-widest">{item.price}</span>
                    </div>
 
                    {/* Image + Description row */}
                    <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 items-stretch sm:items-start pt-3">
                      <div className="w-full sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-[180px] lg:h-[180px] aspect-[16/10] sm:aspect-square rounded-sm border border-white/[0.08] overflow-hidden shrink-0 bg-[#120F1B] shadow-lg relative">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover filter brightness-[0.78] group-hover:scale-105 transition-transform duration-700"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-[8.5px] font-mono text-[#C5A85C] border border-[#C5A85C]/35 bg-black/95 px-3 py-1.5 rounded-sm uppercase tracking-[0.2em] font-semibold transition-all">
                            View Profile
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 space-y-3.5 text-left">
                        <p className="text-lg sm:text-base md:text-[17px] text-stone-300 font-sans leading-relaxed font-light pt-1">
                          {item.description}
                        </p>

                        {/* Interactive Tooltip shown on hover/click */}
                        <AnimatePresence>
                          {(isHovered || isSelected) && (
                            <motion.div
                              initial={{ opacity: 0, y: 4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 4 }}
                              transition={{ duration: 0.2 }}
                              className="p-3 bg-[#C5A85C]/[0.03] border border-[#C5A85C]/15 rounded-sm space-y-1 text-left"
                            >
                              <span className="text-[8px] font-mono text-[#C5A85C] tracking-[0.2em] uppercase font-bold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                                Interactive Pairing
                              </span>
                              <p className="text-[11px] text-stone-300 font-sans italic font-light leading-relaxed">
                                {pairingNotes[item.id] || "Best complemented by our vintage red wines or a classic bourbon old fashioned."}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
 
                  </div>

                  {/* Elegant interactive pairing option at bottom */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-[8px] font-mono tracking-[0.2em] text-stone-500 group-hover:text-[#C5A85C] flex items-center gap-0.5 transition-colors pl-1">
                      <span>Curated Pairing Details</span>
                      <ChevronRight className="w-2.5 h-2.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    {isHovered && (
                      <span className="text-[8px] font-mono text-[#C5A85C]/60 tracking-[0.1em] uppercase animate-pulse">
                        Click to view profile
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. UPCOMING PERFORMANCES */}
      <section id="events" className="py-32 md:py-44 lg:py-48 relative z-10 border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3.5 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
              Live Lounge
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white uppercase font-serif leading-tight">
              Upcoming Performances
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A85C]/35 mx-auto my-3" />
            <p className="text-xs sm:text-sm text-stone-400 font-sans font-light leading-relaxed max-w-lg mx-auto">
              Dining reservations generally include access to our scheduled live performances. Table bookings are highly recommended.
            </p>
          </div>

          {/* Simple list of performances */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {brandData.events.map((event) => (
              <div 
                key={event.id}
                className="bg-[#120F1B]/20 border border-white/[0.04] hover:border-[#C5A85C]/30 hover:bg-[#120F1B]/35 p-6 sm:p-8 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8 transition-all duration-300 shadow-xl"
              >
                
                {/* Left Indicator */}
                <div className="flex items-center gap-5 shrink-0 w-full sm:w-auto">
                  <div className="px-4.5 py-3 bg-white/[0.01] border border-[#C5A85C]/20 text-center rounded-sm min-w-[120px] sm:min-w-[130px] flex flex-col justify-center">
                    <span className="block text-xs font-mono text-[#C5A85C] font-bold tracking-[0.15em] uppercase leading-tight">
                      {event.date}
                    </span>
                    <span className="block text-[8px] font-mono text-stone-550 uppercase tracking-[0.2em] mt-2 font-light leading-snug">
                      {event.time}
                    </span>
                  </div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-sm border border-white/[0.1] overflow-hidden shrink-0 bg-[#070509] shadow-lg">
                    <img 
                      src={event.image} 
                      alt={event.artist} 
                      className="w-full h-full object-cover filter brightness-[0.74] hover:scale-105 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Performance Title & Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base sm:text-lg font-medium text-white uppercase tracking-wide font-serif">{event.title}</h3>
                    <span className="text-[7.5px] font-mono text-[#C5A85C] border border-[#C5A85C]/25 px-2 py-0.5 rounded-sm bg-[#C5A85C]/5 uppercase tracking-widest font-bold">
                      Live Room
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-350 font-sans font-light leading-relaxed max-w-lg">
                    {event.description}
                  </p>
                  <p className="text-[10px] font-mono text-stone-450 uppercase tracking-[0.15em] pt-1">
                    Featured Quartet: <strong className="text-[#C5A85C] font-semibold">{event.artist}</strong>
                  </p>
                </div>

                {/* CTA Action */}
                <div className="shrink-0 flex items-center justify-between sm:flex-col sm:items-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-white/[0.05] pt-4 sm:pt-0">
                  <div className="text-left sm:text-right font-mono">
                    <span className="block text-[8px] text-stone-500 uppercase tracking-[0.2em] font-medium">COVER CHARGE</span>
                    <span className="text-xs font-semibold text-[#C5A85C] tracking-wide font-mono mt-0.5 block">{event.coverCharge}</span>
                  </div>
                  
                  <a 
                    href="#reservations"
                    className="px-4.5 py-2.5 border border-[#C5A85C]/35 text-[#C5A85C] hover:bg-[#C5A85C] hover:text-black text-[10px] tracking-[0.15em] uppercase font-mono font-medium rounded-sm transition-all duration-300 backdrop-blur-sm"
                  >
                    Book a Table
                  </a>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. IMMERSIVE PRIVATE EVENTS */}
      <section id="occasions" className="py-32 md:py-44 lg:py-48 bg-gradient-to-b from-[#110e16]/20 to-[#070509] relative z-10 border-b border-white/[0.03] overflow-hidden">
        
        <div className="absolute right-0 top-1/4 w-72 h-72 rounded-full bg-[#C5A85C]/[0.01] blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-12 gap-16 items-center mb-24">
            
            <div className="lg:col-span-6 space-y-8">
              
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
                  Private Dining & Gatherings
                </span>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white uppercase leading-tight font-serif">
                  Private Dinners, Celebrations & Hosted Events
                </h2>
              </div>
              
              <div className="w-16 h-[1px] bg-[#C5A85C]/35" />
              
              <p className="text-sm sm:text-base md:text-lg text-stone-300 font-sans leading-relaxed font-light max-w-xl">
                From intimate seated dinners to exclusive full venue buyouts, we tailor every detail—from the menus to the atmosphere—to suit your occasion beautifully.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 text-xs sm:text-sm font-light font-sans text-stone-300 pt-2">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                  <span>Accommodations for 10 to 120 guests</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                  <span>Customized menus and beverage pairings</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                  <span>Flexible configurations and audio-visual setups</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                  <span>Dedicated staffing and full event coordination</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.04] inline-block font-mono">
                <span className="text-[7.5px] text-stone-500 block tracking-widest uppercase">Direct Event Phone</span>
                <span className="text-xs font-semibold text-white tracking-wider">{brandData.contact.phone}</span>
              </div>

            </div>

            {/* Immersive Event Photo side */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-[16/10] rounded-sm overflow-hidden border border-white/[0.08] bg-[#120F1B] shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=1000&q=80" 
                  alt="Elegant dining table near warm stage backlight" 
                  className="w-full h-full object-cover filter brightness-[0.74] hover:scale-105 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>

          {/* Three Packages */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Package I */}
            <div className="bg-[#120F1B]/20 border border-white/[0.05] hover:border-[#C5A85C]/30 hover:bg-[#120F1B]/35 p-8 rounded-sm flex flex-col justify-between transition-all duration-300 shadow-xl font-sans min-h-[380px]">
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono pb-2 border-b border-white/[0.03]">
                  <span className="text-[7.5px] font-bold text-[#C5A85C] uppercase border border-[#C5A85C]/35 bg-[#C5A85C]/5 px-2.5 py-0.5 rounded-sm tracking-[0.15em]">
                    Cocktail Reception
                  </span>
                  <span className="text-[9px] text-[#C5A85C]/85 font-mono tracking-widest uppercase">Cap: 30–50 Guests</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-white uppercase tracking-wide font-serif">Cocktail Receptions</h4>
                <p className="text-xs sm:text-[13px] text-stone-350 leading-relaxed font-light">
                  Ideal for standing receptions, mixers, and social gatherings. Includes curated hors d'oeuvres and a tailored beverage menu matched to your preferences.
                </p>
                <ul className="text-[11px] font-sans text-stone-400 space-y-1.5 pt-3.5 border-t border-white/[0.05] font-light list-none">
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Custom beverage packages and premium spirits curation</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Curated selections of hot and cold savory small bites</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Standard lighting control and simple sound custom configurations</span></li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-6 flex items-center justify-between font-mono">
                <span className="text-[8px] sm:text-[9px] text-stone-500 uppercase tracking-wider">Food & Beverage Minimum</span>
                <span className="text-xs sm:text-sm font-semibold text-[#C5A85C] tracking-wide">$2,500+</span>
              </div>
            </div>

            {/* Package II */}
            <div className="bg-[#120F1B]/20 border border-white/[0.05] hover:border-[#C5A85C]/30 hover:bg-[#120F1B]/35 p-8 rounded-sm flex flex-col justify-between transition-all duration-300 shadow-xl font-sans min-h-[380px]">
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono pb-2 border-b border-white/[0.03]">
                  <span className="text-[7.5px] font-bold text-[#C5A85C] uppercase border border-[#C5A85C]/35 bg-[#C5A85C]/5 px-2.5 py-0.5 rounded-sm tracking-[0.15em]">
                    Seated Dinner
                  </span>
                  <span className="text-[9px] text-[#C5A85C]/85 font-mono tracking-widest uppercase">Cap: 12–24 Guests</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-white uppercase tracking-wide font-serif">Private Dinners</h4>
                <p className="text-xs sm:text-[13px] text-stone-350 leading-relaxed font-light">
                  A refined multi-course dining experience structured for smaller groups. Features a custom tasting menu paired with select bottles from our curated selection.
                </p>
                <ul className="text-[11px] font-sans text-stone-400 space-y-1.5 pt-3.5 border-t border-white/[0.05] font-light list-none">
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Custom three or five-course group dining menus</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Expert wine pairings selected beautifully to match each course</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Dedicated waitstaff service and personalized menus</span></li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-6 flex items-center justify-between font-mono">
                <span className="text-[8px] sm:text-[9px] text-stone-500 uppercase tracking-wider">Food & Beverage Minimum</span>
                <span className="text-xs sm:text-sm font-semibold text-[#C5A85C] tracking-wide">$3,800+</span>
              </div>
            </div>

            {/* Package III */}
            <div className="bg-[#120F1B]/20 border border-[#C5A85C]/25 hover:border-[#C5A85C]/45 hover:bg-[#120F1B]/35 p-8 rounded-sm flex flex-col justify-between transition-all duration-300 shadow-xl font-sans min-h-[380px] relative">
              <div className="absolute top-0 right-6 -translate-y-1/2 bg-[#C5A85C] text-black font-semibold uppercase tracking-widest font-mono text-[6.5px] px-2 py-0.5 rounded-sm border border-[#C5A85C]">
                Exclusive
              </div>
              <div className="space-y-5">
                <div className="flex items-center justify-between font-mono pb-2 border-b border-white/[0.03]">
                  <span className="text-[7.5px] font-bold text-[#C5A85C] uppercase border border-[#C5A85C]/35 bg-[#C5A85C]/5 px-2.5 py-0.5 rounded-sm tracking-[0.15em]">
                    Total Buyout
                  </span>
                  <span className="text-[9px] text-[#C5A85C]/85 font-mono tracking-widest uppercase">Cap: 60–120 Guests</span>
                </div>
                <h4 className="text-base sm:text-lg font-medium text-white uppercase tracking-wide font-serif">Venue Buyouts</h4>
                <p className="text-xs sm:text-[13px] text-stone-350 leading-relaxed font-light">
                  Exclusive access to the entire venue for larger gatherings, private receptions, and premium milestone events.
                </p>
                <ul className="text-[11px] font-sans text-stone-400 space-y-1.5 pt-3.5 border-t border-white/[0.05] font-light list-none">
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Private venue access with custom security and bartenders</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Fully customizable seating layouts and sound staging</span></li>
                  <li className="flex items-start gap-2"><span className="text-[#C5A85C] mt-0.5">•</span> <span>Tailored dining, custom catering themes, and wine selection curation</span></li>
                </ul>
              </div>
              <div className="pt-4 border-t border-white/[0.06] mt-6 flex items-center justify-between font-mono">
                <span className="text-[8px] sm:text-[9px] text-stone-500 uppercase tracking-wider">Food & Beverage Minimum</span>
                <span className="text-xs sm:text-sm font-semibold text-[#C5A85C] tracking-wide">$7,500+</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 7. PRESS REVIEWS & RATINGS */}
      <section className="py-32 md:py-44 lg:py-48 bg-[#120F1B]/10 border-b border-white/[0.03] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase">
              Guest & Press Critiques
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white uppercase font-serif leading-tight">
              Guest Book & Reviews
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A85C]/20 mx-auto my-3" />
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left side: flowing stream of reviews (preset + custom user reviews) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-[#C5A85C] mb-6 flex items-center gap-2">
                <span>Recent Experiences</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" />
              </h3>

              <div className="relative overflow-hidden min-h-[320px] flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={reviewsList[currentReviewIndex].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="bg-black/15 border border-white/[0.03] p-8 rounded-sm space-y-4 shadow-lg relative min-h-[220px] flex flex-col justify-between text-left"
                  >
                    <div className="absolute top-4 right-6 text-5xl text-white/[0.03] font-serif select-none pointer-events-none">“</div>
                    
                    <div className="space-y-4">
                      <div className="flex gap-1 items-center text-[#C5A85C] text-xs font-mono">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < reviewsList[currentReviewIndex].rating 
                                ? "fill-[#C5A85C] text-[#C5A85C]" 
                                : "text-stone-700 fill-transparent"
                            }`} 
                          />
                        ))}
                        <span className="text-[8px] uppercase tracking-[0.2em] text-stone-500 ml-3 font-mono">
                          [{reviewsList[currentReviewIndex].source}]
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm md:text-base text-stone-250 font-sans leading-relaxed italic font-light opacity-95">
                        "{reviewsList[currentReviewIndex].quote}"
                      </p>
                    </div>

                    <div className="border-t border-white/[0.04] pt-4 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          {reviewsList[currentReviewIndex].author}
                        </p>
                        <p className="text-[8.5px] text-stone-450 font-sans mt-0.5">
                          {reviewsList[currentReviewIndex].role}
                        </p>
                      </div>
                      <span className="text-[7.5px] font-mono text-[#C5A85C]/60 uppercase tracking-widest bg-[#C5A85C]/5 px-2 py-0.5 border border-[#C5A85C]/10 rounded-sm">Verified Experience</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <div className="flex items-center justify-between mt-6">
                  {/* Progress Indicator Dots */}
                  <div className="flex gap-2">
                    {reviewsList.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentReviewIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === currentReviewIndex ? "w-6 bg-[#C5A85C]" : "w-1.5 bg-white/15 hover:bg-white/40"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Nav Arrows */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentReviewIndex((prev) => (prev - 1 + reviewsList.length) % reviewsList.length)}
                      className="p-1.5 rounded-sm border border-white/10 hover:border-[#C5A85C] hover:bg-[#C5A85C]/10 text-stone-400 hover:text-[#C5A85C] transition-all cursor-pointer bg-transparent"
                      aria-label="Previous Review"
                    >
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % reviewsList.length)}
                      className="p-1.5 rounded-sm border border-white/10 hover:border-[#C5A85C] hover:bg-[#C5A85C]/10 text-stone-400 hover:text-[#C5A85C] transition-all cursor-pointer bg-transparent"
                      aria-label="Next Review"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Interactive feedback submission form */}
            <div className="lg:col-span-5 bg-black/15 border border-white/[0.03] p-6 sm:p-8 rounded-sm space-y-6 shadow-xl relative backdrop-blur-sm">
              <div className="absolute inset-x-0 top-0 h-[2px] bg-[#C5A85C]/40" />
              
              <div className="space-y-1.5">
                <span className="text-[8px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase block font-semibold">Share Your Journey</span>
                <h3 className="text-base sm:text-lg font-medium text-white uppercase tracking-wider font-serif">Sign Our Guest Book</h3>
              </div>

              <AnimatePresence mode="wait">
                {!feedbackSuccess ? (
                  <motion.form 
                    key="feedback-form"
                    onSubmit={handleFeedbackSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5 font-medium">
                        Your Full Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={feedbackName}
                        onChange={(e) => setFeedbackName(e.target.value)}
                        placeholder="E.g., Julian Vance" 
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                        Experience Rating
                      </label>
                      <div className="flex gap-2 py-1 items-center">
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <button
                            type="button"
                            key={starValue}
                            onClick={() => setFeedbackRating(starValue)}
                            onMouseEnter={() => setFeedbackRatingHover(starValue)}
                            onMouseLeave={() => setFeedbackRatingHover(null)}
                            className="focus:outline-none cursor-pointer p-0.5 transition-transform duration-100 active:scale-95"
                          >
                            <Star
                              className={`w-5 h-5 transition-all ${
                                starValue <= (feedbackRatingHover ?? feedbackRating)
                                  ? "fill-[#C5A85C] text-[#C5A85C] drop-shadow-[0_0_4px_rgba(197,168,92,0.15)]"
                                  : "text-stone-700 fill-transparent hover:text-stone-600"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-[9px] font-mono text-stone-500 ml-2 tracking-wider">
                          ({feedbackRating} / 5 Stars)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5 font-medium">
                        Your Review & Comments
                      </label>
                      <textarea 
                        required
                        value={feedbackComment}
                        onChange={(e) => setFeedbackComment(e.target.value)}
                        placeholder="E.g., The evening session was wonderfully curated. Outstanding wine reserve collection and highly considerate service..."
                        rows={3}
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none transition-all font-sans resize-none"
                      />
                    </div>

                    <div className="pt-2">
                      <button 
                        type="submit"
                        className="w-full py-3 bg-[#C5A85C] hover:bg-white text-black font-mono font-bold tracking-[0.2em] text-[10px] uppercase rounded-sm cursor-pointer transition-all duration-300 border border-[#C5A85C]"
                      >
                        Publish Review
                      </button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div 
                    key="feedback-success"
                    initial={{ opacity: 0, scale: 0.99 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-10 h-10 bg-[#C5A85C]/10 border border-[#C5A85C]/20 text-[#C5A85C] rounded-full flex items-center justify-center mx-auto">
                      <Check className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-serif">
                        Review Received
                      </h4>
                      <p className="text-[11px] text-stone-400 font-sans leading-relaxed px-4 font-light">
                        Thank you for your warm words. Your experience has been beautifully preserved in our guest book in real-time.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </section>

      {/* 8. SIMPLIFIED & TOTALLY REALISTIC RESERVATION GATEWAY */}
      <section id="reservations" className="py-32 md:py-44 lg:py-48 relative z-10">
        <div className="max-w-5xl lg:max-w-6xl mx-auto px-4">
          
          <div className="text-center mb-12 space-y-4">
            <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3.5 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
              Secure an evening table
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white uppercase font-serif leading-tight">
              Reserve a Table
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A85C]/25 mx-auto my-3" />
            <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto font-light leading-relaxed">
              Reservations are highly recommended to secure seating. For parties larger than eight guests, please contact us directly.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Interactive Booking Card */}
            <div className="lg:col-span-7 bg-[#120F1B]/15 rounded-sm border border-white/[0.05] p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
              
              <AnimatePresence mode="wait">
              {!bookingSubmitted ? (
                <motion.form 
                  key="booking-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleBookingSubmit} 
                  className="space-y-6"
                >
                  {/* Table Availability Indicator */}
                  <div className="flex items-center justify-between gap-4 p-3 border border-[#C5A85C]/20 bg-[#C5A85C]/[0.02] rounded-sm shadow-md animate-fade-in flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-[#C5A85C] font-semibold">Live Availability</span>
                    </div>
                    <span className="text-[11px] font-sans text-stone-300 font-light tracking-wide text-right">
                      {getAvailabilityText()}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-5">
                    
                    {/* Guest Size Selection */}
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                        Guests
                      </label>
                      <select 
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        className="w-full bg-black/40 border border-white/[0.08] rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A85C] transition-all font-mono tracking-wider cursor-pointer"
                      >
                        <option value="1">1 Guest (Bar Seating)</option>
                        <option value="2">2 Guests (Indoor Seating)</option>
                        <option value="4">4 Guests (Indoor Seating)</option>
                        <option value="6">6 Guests (Outdoor/Patio)</option>
                        <option value="8">8 Guests (Large Group)</option>
                      </select>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                        Date
                      </label>
                      <input 
                        type="date"
                        value={bookDate}
                        onChange={(e) => setBookDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        required
                        className="w-full bg-black/40 border border-white/[0.08] rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A85C] transition-all font-mono cursor-pointer"
                      />
                    </div>

                    {/* Time selection */}
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-2 font-medium">
                        Preferred Seating
                      </label>
                      <select 
                        value={bookTime}
                        onChange={(e) => setBookTime(e.target.value)}
                        className="w-full bg-[#0d0a12]/90 border border-white/[0.08] rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C5A85C] transition-all font-mono tracking-wider cursor-pointer"
                      >
                        {bookingSlots.map((slot) => (
                          <option key={slot.value} value={slot.value} className="bg-[#120F1B]">
                            {slot.label}
                          </option>
                        ))}
                      </select>
                    </div>

                  </div>

                  {/* Seating Zone choice - clear, elegant buttons */}
                  <div>
                    <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-3 font-medium">
                      Select Table Preference
                    </label>
                    
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {seatingZones.map((zone) => {
                        const isChecked = bookZone === zone.id;
                        return (
                           <button
                             type="button"
                             key={zone.id}
                             onClick={() => setBookZone(zone.id)}
                             className={`text-left p-3.5 rounded-sm border flex flex-col justify-between cursor-pointer transition-all duration-200 ${
                               isChecked 
                                 ? "bg-[#C5A85C]/[0.08] border-[#C5A85C] text-white shadow-md shadow-black/30"
                                 : "bg-black/20 border-white/[0.04] text-stone-400 hover:border-white/[0.12]"
                             }`}
                           >
                             <span className="text-xs font-semibold block tracking-wide font-serif">{zone.label}</span>
                             <span className="text-[8px] text-stone-500 font-mono tracking-wide mt-1.5">{zone.desc}</span>
                           </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Block */}
                  <div className="grid sm:grid-cols-2 gap-5 pt-3">
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5 font-medium">
                        Your Full Name
                      </label>
                      <input 
                        required
                        type="text" 
                        value={custName}
                        onChange={(e) => setCustName(e.target.value)}
                        placeholder="Jane Doe" 
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5 font-medium">
                        Email Address
                      </label>
                      <input 
                        required
                        type="email" 
                        value={custEmail}
                        onChange={(e) => setCustEmail(e.target.value)}
                        placeholder="jane@example.com" 
                        className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-3.5 py-2.5 text-xs text-white focus:outline-none transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Optional notes */}
                  <div>
                    <label className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1.5 font-medium">
                      Special Notes or Dietary Requests (Optional)
                    </label>
                    <textarea 
                      value={custNotes}
                      onChange={(e) => setCustNotes(e.target.value)}
                      placeholder="Please note if celebrating a special occasion, or if you have any dietary restrictions/allergies."
                      rows={2}
                      className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-3.5 py-2 text-xs text-white focus:outline-none transition-all font-sans resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2 space-y-3">
                    <button 
                      type="submit"
                      className="w-full py-3.5 bg-[#C5A85C] hover:bg-white text-black font-mono font-bold tracking-[0.2em] text-[11px] uppercase rounded-sm cursor-pointer transition-all duration-300 text-center border border-[#C5A85C]"
                    >
                      Confirm Reservation
                    </button>
                    <p className="text-[7.5px] text-stone-500 text-center font-mono tracking-widest uppercase">
                      * Reservations are held for 15 minutes. For special requests, please contact our team.
                    </p>
                  </div>

                </motion.form>
              ) : (
                // Beautifully restrained, highly realistic reservation confirmation block
                <motion.div 
                  key="booking-success"
                  initial={{ opacity: 0, scale: 0.99 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-2 text-center max-w-md mx-auto font-sans"
                >
                  <div className="w-10 h-10 bg-[#C5A85C]/10 border border-[#C5A85C]/20 text-[#C5A85C] rounded-full flex items-center justify-center mx-auto mb-2">
                    <Check className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <span className="text-[8px] font-mono text-[#C5A85C] tracking-[0.25em] uppercase block font-semibold">
                      Your table is secured
                    </span>
                    <h3 className="text-xl font-semibold text-white uppercase font-serif">
                      We look forward to welcoming you
                    </h3>
                  </div>

                  {/* Clean Elegant Confirmation block - no funny vouchers */}
                  <div className="bg-black/40 border border-white/[0.06] p-6 rounded-sm text-left space-y-4 font-mono text-[11px] relative shadow-xl">
                    <div className="absolute inset-x-0 top-0 h-[2px] bg-[#C5A85C]" />
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9px] text-[#C5A85C] pb-2 border-b border-white/[0.04] uppercase font-semibold gap-2">
                      <span>{brandData.name.toUpperCase()}</span>
                      <div className="flex items-center gap-2">
                        <span>Confirmation Code: {confirmationCode}</span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="bg-[#C5A85C]/10 hover:bg-[#C5A85C]/20 border border-[#C5A85C]/30 px-2 py-0.5 rounded-sm text-[8px] font-mono tracking-wider text-[#C5A85C] transition-all cursor-pointer font-bold shrink-0 uppercase active:scale-95"
                        >
                          {copiedCode ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                      <div>
                        <span className="block text-stone-500 text-[8px] uppercase">GUEST</span>
                        <span className="text-white font-semibold text-xs mt-0.5 block font-sans">{custName}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500 text-[8px] uppercase">PARTY SIZE</span>
                        <span className="text-white font-semibold text-xs mt-0.5 block">{guestCount} Guests</span>
                      </div>
                      <div>
                        <span className="block text-stone-500 text-[8px] uppercase">DATE</span>
                        <span className="text-white font-semibold text-xs mt-0.5 block">{bookDate}</span>
                      </div>
                      <div>
                        <span className="block text-stone-500 text-[8px] uppercase">TIME</span>
                        <span className="text-white font-semibold text-xs mt-0.5 block">
                          {bookingSlots.find(s => s.value === bookTime)?.label || bookTime}
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/[0.04]">
                      <span className="block text-stone-500 text-[8px] uppercase">SEATING AREA</span>
                      <span className="text-white block font-sans text-xs mt-0.5">{getZoneLabel(bookZone)}</span>
                    </div>

                    {custNotes.trim() && (
                      <div className="pt-3 border-t border-white/[0.04]">
                        <span className="block text-stone-500 text-[8px] uppercase">SPECIAL INSTRUCTIONS</span>
                        <p className="text-stone-300 font-sans text-xs mt-0.5 leading-relaxed font-light">{custNotes}</p>
                      </div>
                    )}

                    <div className="pt-3.5 border-t border-white/[0.04]">
                      <p className="text-[8.5px] text-[#C5A85C] leading-relaxed text-center font-sans font-light">
                        An email confirmation has been sent to {custEmail}. If your plans change, please contact us at least 24 hours in advance at {brandData.contact.phone}.
                      </p>
                    </div>

                  </div>

                  <div className="flex justify-center pt-2">
                    <button 
                      onClick={() => {
                        setBookingSubmitted(false);
                        setCustName("");
                        setCustEmail("");
                        setCustNotes("");
                      }}
                      className="px-5 py-2 border border-white/10 hover:border-[#C5A85C] text-stone-300 text-[9px] font-mono tracking-widest uppercase rounded-sm transition-all cursor-pointer bg-transparent"
                    >
                      Book Another Table
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Right Column: Reservation Policy Board */}
          <div className="lg:col-span-4 bg-[#120F1B]/15 border border-white/[0.05] rounded-sm p-6 sm:p-8 md:p-10 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-sm transition-all text-left">
            <div className="absolute inset-x-0 top-0 h-[2px] bg-[#C5A85C]" />
            
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase block font-semibold">Terms & Expectations</span>
              <h3 className="text-base sm:text-lg font-medium text-white uppercase tracking-wider font-serif">Reservation Policy</h3>
            </div>

            <div className="space-y-5 text-xs">
              
              {/* Policy Item: Booking Window */}
              <div className="space-y-1.5">
                <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" /> 
                  Booking Windows
                </h4>
                <p className="text-stone-400 font-sans font-light leading-relaxed pl-3.5">
                  Reservations can be secured up to 30 days in advance. Digitally secured bookings will close exactly 2 hours prior to seating. Walk-ins are kept on standby.
                </p>
              </div>

              {/* Policy Item: Cancellation Policy */}
              <div className="space-y-1.5">
                <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" /> 
                  Cancellations & Holds
                </h4>
                <p className="text-stone-400 font-sans font-light leading-relaxed pl-3.5">
                  We request cancellations or schedule adjustments at least 24 hours prior. Late-notice changes or no-shows within 12 hours may carry a nominal $25 guest fee.
                </p>
              </div>

              {/* Policy Item: Party Restrictions */}
              <div className="space-y-1.5">
                <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" /> 
                  Party Size Guidelines
                </h4>
                <p className="text-stone-400 font-sans font-light leading-relaxed pl-3.5">
                  Our digital gateway accommodates bookings of up to 8 guests. For larger celebrations or custom buyouts, please initiate an event inquiry above.
                </p>
              </div>

              {/* Policy Item: Grace Period */}
              <div className="space-y-1.5">
                <h4 className="font-mono text-[9px] text-white uppercase tracking-widest font-semibold flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" /> 
                  Grace Period
                </h4>
                <p className="text-stone-400 font-sans font-light leading-relaxed pl-3.5">
                  Your table is held for exactly 15 minutes of grace. Kindly contact our host coordinates if your arrival runs behind to ensure layout preservation.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-white/[0.04] flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8.5px] font-mono uppercase tracking-widest text-[#C5A85C]">Host Desk Active</span>
            </div>
          </div>

        </div>

      </div>
    </section>

      {/* 9. INSTAGRAM GALLERY */}
      <section id="gallery" className="py-32 md:py-44 lg:py-48 border-t border-white/[0.03] bg-black/10 z-10 relative">
        <div className="max-w-7xl mx-auto px-4 text-center">
          
          <span className="text-[9px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3.5 py-1 rounded-sm inline-block mb-4 border border-[#C5A85C]/15">
            Gallery
          </span>
          <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto mb-10 leading-relaxed font-light">
            A glimpse inside our spaces, live evening sets, and signature plates. Follow us on Instagram at <strong className="text-stone-200">{brandData.contact.instagram}</strong>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80", label: "Corner Booth Seating", cat: "Lounge" },
              { url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80", label: "Signature Crafted Cocktail", cat: "Cocktails" },
              { url: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=800&q=80", label: "Fine Dining Platings", cat: "Dining" },
              { url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80", label: "Live Performance", cat: "Performance" },
              { url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80", label: "Savory Shared Plates", cat: "Dining" },
              { url: "https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80", label: "Signature Cocktails & Drinks", cat: "Cocktails" }
            ].map((img, idx) => (
              <div 
                key={idx} 
                className="aspect-square rounded-sm overflow-hidden border border-white/[0.08] bg-[#120F1B] relative group cursor-pointer shadow-lg"
              >
                <img 
                  src={img.url} 
                  alt={img.label} 
                  className="w-full h-full object-cover filter brightness-[0.74] group-hover:scale-110 group-hover:brightness-90 transition-all duration-700" 
                  referrerPolicy="no-referrer"
                />
                
                {/* Visual hover caption overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/85 to-transparent p-3 translate-y-1.5 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-left">
                  <span className="text-[7px] font-mono uppercase tracking-widest text-[#C5A85C] block">
                    {img.cat}
                  </span>
                  <span className="text-[10px] font-sans text-white font-light mt-0.5 block truncate lines-1">
                    {img.label}
                  </span>
                </div>

                <div className="absolute top-2 right-2 bg-black/60 border border-white/[0.06] p-1 rounded-sm">
                  <Camera className="w-3 h-3 text-[#C5A85C]" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9.2. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-24 border-t border-white/[0.03] bg-black/15 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 md:px-8">
          
          <div className="text-center mb-12 space-y-3">
            <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3.5 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
              Guest Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase font-serif">
              Common Questions
            </h2>
            <div className="w-12 h-[1px] bg-[#C5A85C]/20 mx-auto my-3" />
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {faqItems.map((item, index) => {
              const isOpen = activeFaq === index;
              return (
                <div 
                  key={index}
                  className="border-b border-white/[0.06] pb-4 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex justify-between items-center py-3 text-left focus:outline-none group cursor-pointer"
                  >
                    <span className="text-sm font-sans text-stone-250 font-medium group-hover:text-white transition-colors duration-200 uppercase tracking-wide">
                      {item.question}
                    </span>
                    <ChevronRight 
                      className={`w-4 h-4 text-[#C5A85C] transition-transform duration-300 ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`} 
                    />
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs sm:text-[13px] text-stone-400 font-sans font-light leading-relaxed pt-2 pb-4 pl-1">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 9.5. EMAIL NEWSLETTER SUBSCRIPTION */}
      <section className="py-24 border-t border-white/[0.03] bg-black/20 z-10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-amber-950/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          
          <div className="space-y-2">
            <span className="text-[8.5px] font-mono tracking-[0.3em] text-[#C5A85C] uppercase bg-[#C5A85C]/[0.04] px-3.5 py-1 rounded-sm inline-block border border-[#C5A85C]/15">
              Newsletter
            </span>
            <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white uppercase font-serif">
              Join Our Circle
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 font-sans max-w-md mx-auto font-light leading-relaxed">
              Receive private invitations to exclusive curated wine dinners, off-menu seasonal releases, and early access reservation schedules.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!subscriptionSuccess ? (
              <motion.form 
                key="newsletter-form"
                onSubmit={handleNewsletterSubmit}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="max-w-md mx-auto flex flex-col sm:flex-row items-center gap-3"
              >
                <input 
                  required
                  type="email" 
                  value={subscribedEmail}
                  onChange={(e) => setSubscribedEmail(e.target.value)}
                  placeholder="Enter your email address" 
                  className="w-full bg-black/40 border border-white/[0.08] focus:border-[#C5A85C] rounded-sm px-4 py-3 text-xs text-white focus:outline-none transition-all font-sans tracking-wide"
                />
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3 bg-[#C5A85C] hover:bg-white text-black font-mono font-bold tracking-[0.2em] text-[10px] uppercase rounded-sm cursor-pointer transition-all duration-300 border border-[#C5A85C] shrink-0"
                >
                  Subscribe
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="newsletter-success"
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md mx-auto bg-[#C5A85C]/[0.02] border border-[#C5A85C]/15 py-6 px-8 rounded-sm text-center"
              >
                <div className="w-8 h-8 bg-[#C5A85C]/10 border border-[#C5A85C]/20 text-[#C5A85C] rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Subscription Confirmed</h4>
                <p className="text-[11px] text-stone-400 font-sans font-light leading-normal">
                  Thank you. An invitation to our inner circle has been dispatched to <strong className="text-stone-300 font-mono text-[10px]">{subscribedEmail}</strong>.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* 10. HOURS, LOCATION & SUSTAINED CONTACT GROUP */}
      <section id="hours-section" className="py-24 border-t border-white/[0.03] bg-[#09070a] text-stone-400 font-sans text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-white/[0.04]">
            
            {/* Brand column */}
            <div className="space-y-3">
              <span className="text-md font-bold tracking-[0.25em] text-white uppercase font-serif block">
                {brandData.name}
              </span>
              <p className="text-[11px] leading-relaxed text-stone-400 font-light max-w-xs">
                {brandData.description}
              </p>
              <div className="flex gap-4 pt-1">
                <a href="#gallery" className="text-stone-500 hover:text-[#C5A85C] transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Coordinates column */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-mono text-white tracking-widest uppercase font-semibold">Location</h5>
              <div className="space-y-1 font-light text-stone-400 text-[11px]">
                <p className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A85C] shrink-0 mt-0.5" />
                  <span>{brandData.contact.address}<br />{brandData.contact.cityState}</span>
                </p>
                <p className="flex items-center gap-2 mt-2">
                  <Phone className="w-3.5 h-3.5 text-[#C5A85C] shrink-0" />
                  <span>{brandData.contact.phone}</span>
                </p>
              </div>
            </div>

            {/* Hours column */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-mono text-white tracking-widest uppercase font-semibold">Hours</h5>
              <div className="space-y-1.5 font-light text-stone-400 text-[11px] font-mono">
                <p className="flex justify-between">
                  <span>Mon — Wed</span>
                  <span>{brandData.contact.hours.weekdays}</span>
                </p>
                <p className="flex justify-between">
                  <span>Thu — Sat</span>
                  <span>{brandData.contact.hours.weekends}</span>
                </p>
                <p className="flex justify-between">
                  <span>Sunday</span>
                  <span>{brandData.contact.hours.sunday}</span>
                </p>
              </div>
            </div>

            {/* Navigation / Explore column */}
            <div className="space-y-2">
              <h5 className="text-[9px] font-mono text-white tracking-widest uppercase font-semibold">Explore</h5>
              <div className="flex flex-col gap-2 font-mono text-[9px] uppercase tracking-wider">
                <a href="#about" className="hover:text-stone-200 transition-colors">Our Concept</a>
                <a href="#menu" className="hover:text-stone-200 transition-colors">Menu Highlights</a>
                <a href="#events" className="hover:text-stone-200 transition-colors">Performances</a>
                <a href="#reservations" className="hover:text-stone-200 transition-colors">Reserve a Table</a>
              </div>
            </div>

          </div>

          <div id="footer-legals" className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[9px] font-mono text-stone-500 tracking-wider gap-4">
            <p>
              © 2026 {brandData.name.toUpperCase()}. ALL RIGHTS RESERVED.
            </p>
            <p className="uppercase tracking-widest">
              A PREMIUM HOSPITALITY & EVENT TEMPLATE
            </p>
          </div>

        </div>
      </section>

      {/* 4.5. MENU ITEM PAIRING MICRO-MODAL */}
      <AnimatePresence>
        {selectedMenuItemDetails && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedMenuItemDetails(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-[#120F1B] border border-white/[0.08] w-full max-w-md rounded-sm overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button 
                type="button"
                onClick={() => setSelectedMenuItemDetails(null)}
                className="absolute top-4 right-4 text-stone-400 hover:text-[#C5A85C] transition-colors p-1.5 bg-black/60 border border-white/5 rounded-sm cursor-pointer z-10 hover:border-[#C5A85C]/35"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Modal Image */}
              <div className="h-44 relative overflow-hidden">
                <img 
                  src={selectedMenuItemDetails.image} 
                  alt={selectedMenuItemDetails.name} 
                  className="w-full h-full object-cover filter brightness-[0.72]"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F1B] via-transparent to-transparent" />
                <span className="absolute bottom-3 left-4 text-[7.5px] font-mono text-[#C5A85C] border border-[#C5A85C]/25 bg-[#120F1B]/95 backdrop-blur-sm px-2.5 py-0.5 rounded-sm uppercase tracking-widest font-bold">
                  {selectedMenuItemDetails.category === "cocktails" ? "Spirit Reserve" : "Culinary Reserve"}
                </span>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-5 text-left">
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-0.5">
                    <h3 className="text-lg sm:text-xl font-serif text-white uppercase tracking-wide leading-tight">
                      {selectedMenuItemDetails.name}
                    </h3>
                    <p className="text-[8.5px] font-mono text-stone-500 uppercase tracking-widest">
                      Curated by Chef {brandData.brandStory.chefName}
                    </p>
                  </div>
                  <span className="text-base font-mono text-[#C5A85C] font-semibold">{selectedMenuItemDetails.price}</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="block text-[8px] font-mono text-stone-400 uppercase tracking-widest mb-1 font-medium">Composition</span>
                    <p className="text-xs text-stone-350 font-sans font-light leading-relaxed">
                      {selectedMenuItemDetails.description}
                    </p>
                  </div>

                  <div className="p-3 bg-[#C5A85C]/[0.02] border border-[#C5A85C]/15 rounded-sm space-y-1">
                    <span className="text-[8px] font-mono text-[#C5A85C] uppercase tracking-widest font-bold flex items-center gap-1.5">
                      <Wine className="w-3.5 h-3.5 text-[#C5A85C]" />
                      Curated Wine & Craft Pairing
                    </span>
                    <p className="text-xs text-stone-300 font-sans font-light leading-relaxed italic pr-2">
                      "{pairingNotes[selectedMenuItemDetails.id] || "Best complemented by our vintage red wines or a classic bourbon old fashioned."}"
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button 
                    type="button"
                    onClick={(e) => {
                      setSelectedMenuItemDetails(null);
                      handleScrollTo(e as any, "reservations");
                    }}
                    className="flex-grow py-2.5 bg-[#C5A85C] hover:bg-white text-black font-mono font-bold tracking-[0.15em] text-[9.5px] uppercase rounded-sm cursor-pointer transition-all duration-300 border border-[#C5A85C]"
                  >
                    Reserve Table For This Pairing
                  </button>
                  <button 
                    type="button"
                    onClick={() => setSelectedMenuItemDetails(null)}
                    className="py-2.5 px-4.5 border border-white/10 hover:border-stone-500 text-stone-400 hover:text-white font-mono text-[9px] uppercase tracking-[0.15em] rounded-sm transition-all duration-200 cursor-pointer"
                  >
                    Close
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
