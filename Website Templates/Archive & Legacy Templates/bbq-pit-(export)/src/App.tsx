import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu as MenuIcon, 
  X, 
  Flame, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  Facebook, 
  Mail,
  ArrowRight,
  Beef,
  UtensilsCrossed,
  Droplets,
  Check,
  AlertCircle,
  Info
} from 'lucide-react';

/* 
=============================================================================
  GUMROAD PREMIUM DEV NOTE & CUSTOMIZATION INSTRUCTIONS
=============================================================================
  This premium template is designed to be 100% plug-and-play. All copy, coordinates, 
  branding variables, and menu specimens are hosted in TEMPLATE_CONFIG.
=============================================================================
*/

export const TEMPLATE_CONFIG = {
  brand: {
    name: "BBQ Pit",
    taglinePre: "The Art of",
    taglineBold: "Low & Slow",
    established: "Established 2004 — Austin, TX",
    heroDesc: "Oak & pecan smoked • 12-hour cook • Family heritage recipes. We believe barbecue is a craft, not a shortcut.",
    heroBgImage: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80",
    ctaDiscover: "Discover Menu",
    ctaReserve: "Reserve a Table"
  },
  
  menu: {
    sectionTitle: "The Essential Cuts",
    sectionSubtitle: "Meticulously Prepared",
    items: [
      {
        name: "12hr Prime Brisket",
        price: "$22/LB",
        desc: "Prime grade beef brisket, smoked 12 hours over white oak & pecan. Served with house pickles and white onion.",
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
        tag: "Signature"
      },
      {
        name: "St. Louis Spare Ribs",
        price: "$18/HALF",
        desc: "Dry-rubbed with our volcanic stone-ground spices, smoked until the meat pulls clean from the bone.",
        image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
        tag: "Popular"
      },
      {
        name: "The Pit Master Combo",
        price: "$34",
        desc: "A curated platter featuring half-pound brisket, half-slab ribs, handcrafted sausage, and two seasonal sides.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
        tag: "Chef's Choice"
      },
      {
        name: "Pulled Heritage Pork",
        price: "$12",
        desc: "Hand-pulled Berkshire pork shoulder on a toasted brioche bun with sharp vinegar slaw and crackling.",
        image: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
        tag: "Craft"
      }
    ]
  },

  testimonials: {
    sectionTitle: "Reviews & Endorsements",
    sectionSubtitle: "Guest Experiences",
    items: [
      {
        quote: "The brisket here is absolute perfection. Beautiful black pepper bark and melt-in-your-mouth tenderness. A masterclass in traditional smoking.",
        author: "Marcus Vance",
        role: "Texas Food Writer"
      },
      {
        quote: "True heritage barbecue. No gimmicky sweet sauces—just the pure wood smoke, prime cuts, and expert cook timings. Simply flawless.",
        author: "Sarah Jenkins",
        role: "Barbecue Purist"
      },
      {
        quote: "The combination platters are generous, beautifully presented, and incredibly flavorful. Hands down the finest craft barbecue in all of Austin.",
        author: "David Chen",
        role: "Regular Guest"
      }
    ]
  },

  about: {
    sectionTitle: "Provenance & Philosophy",
    sectionSubtitle: "Our Smokehouse Philosophy",
    paragraphs: [
      "In an era of industrial efficiency, we choose the difficult path. Our pits are fueled exclusively by white oak and pecan wood, tended manually around the clock.",
      "Every cut is selected for its marbling and texture, hand-trimmed, and seasoned with our signature volcanic salt rub. There are no thermostats here — only the watchful eyes of our pit masters."
    ],
    features: [
      { title: "All Natural", desc: "Prime Grade Meats" },
      { title: "12-Hour Cook", desc: "Traditional Low & Slow" },
      { title: "Hand Carving", desc: "Heritage Techniques" }
    ],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80"
  },

  contact: {
    sectionTitle: "Location & Hours",
    sectionSubtitle: "Where to Find Us",
    addressLines: ["2704 Bee Caves Road", "Austin, TX 78746"],
    hoursLines: ["Tue – Sun: 11:00 AM – 8:00 PM", "Monday: Smokehouse Maintenance"],
    phone: "(512) 555-BBQ",
    email: "info@bbqpitatx.com",
    socials: {
      instagram: "#",
      facebook: "#"
    }
  },

  reservation: {
    sectionTitle: "Reserve a Table",
    timeConstraint: "* Reservation requests are accepted daily until 2:00 PM for same-day booking."
  }
};

// --- Timezone-Safe Receipt Date/Time Formatters ---
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  try {
    const parts = timeStr.split(':');
    if (parts.length >= 2) {
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1];
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${hours}:${minutes} ${ampm}`;
    }
    return timeStr;
  } catch (e) {
    return timeStr;
  }
};

// --- Toast Types and Component ---
interface Toast {
  id: string;
  message: string;
  type: 'SECURED' | 'HALTED' | 'UPDATED';
  duration?: number;
}

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: (id: string) => void; key?: any }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, toast.duration || 5000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const transitionProperty = prefersReducedMotion 
    ? { duration: 0.1 } 
    : { type: 'spring', damping: 25, stiffness: 380 };

  const styleConfig = {
    SECURED: {
      border: 'border-patina/30 bg-[#0a0f0f]/95 shadow-patina/5',
      accentBg: 'bg-patina',
      titleColor: 'text-patina',
      icon: <Check className="w-4 h-4 text-patina" />
    },
    HALTED: {
      border: 'border-burnt-orange/30 bg-[#120a05]/95 shadow-burnt-orange/5',
      accentBg: 'bg-burnt-orange',
      titleColor: 'text-burnt-orange',
      icon: <AlertCircle className="w-4 h-4 text-burnt-orange" />
    },
    UPDATED: {
      border: 'border-cloud-dancer/10 bg-[#0c0c0c]/95 shadow-black/80',
      accentBg: 'bg-cloud-dancer/20',
      titleColor: 'text-cloud-dancer/60',
      icon: <Info className="w-4 h-4 text-cloud-dancer/60" />
    }
  };

  const config = styleConfig[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 15, scale: prefersReducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: prefersReducedMotion ? 1 : 0.95, transition: { duration: 0.15 } }}
      transition={transitionProperty}
      onClick={() => onClose(toast.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClose(toast.id);
        }
      }}
      tabIndex={0}
      aria-label={`Notification: ${toast.message}. Press enter or space to close.`}
      className={`pointer-events-auto relative flex items-center gap-4 py-4 px-5 border ${config.border} backdrop-blur-md cursor-pointer select-none shadow-2xl transition-all duration-300 hover:brightness-110 group max-w-sm rounded-[1px] focus:outline-none focus:ring-2 focus:ring-patina/50`}
      role="status"
      aria-live="polite"
    >
      {/* Dynamic left side accent wire */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] ${config.accentBg} transition-all duration-500 group-hover:w-[4px]`} />

      {/* State Indicator Icon */}
      <div className="flex-shrink-0 relative z-10">
        {config.icon}
      </div>

      {/* Messaging Hierarchy */}
      <div className="flex-grow relative z-10">
        <span className={`text-[9px] font-mono font-bold tracking-[0.2em] block mb-1 uppercase ${config.titleColor}`}>
          {toast.type}
        </span>
        <p className="text-cloud-dancer font-sans text-xs tracking-wide leading-relaxed">
          {toast.message}
        </p>
      </div>
    </motion.div>
  );
};

// --- Components ---

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Menu', href: '#menu' },
    { name: 'Philosophy', href: '#about' },
    { name: 'Reservations', href: '#order' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-charcoal/90 backdrop-blur-md py-4 border-b border-cloud-dancer/5' : 'bg-transparent py-8'}`} aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <a href="#home" className="flex items-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-patina/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm" aria-label={`${TEMPLATE_CONFIG.brand.name} home`}>
          <div className="relative">
            <Flame className="w-8 h-8 text-patina group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-patina blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
          </div>
          <span className="font-serif text-3xl tracking-tighter font-light text-cloud-dancer uppercase">{TEMPLATE_CONFIG.brand.name}</span>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] uppercase tracking-[0.3em] font-bold text-cloud-dancer/70 hover:text-patina transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-patina/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal rounded-sm py-1"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#order"
            className="px-6 py-2 bg-patina text-charcoal font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-cloud-dancer hover:text-charcoal transition-all duration-500 rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-patina/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal"
          >
            Book a Table
          </a>
        </div>

        {/* Mobile Toggle */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-patina/60 hover:text-patina transition-colors rounded-sm"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close main menu" : "Open main menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-charcoal border-b border-cloud-dancer/5 px-6 py-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-2xl font-serif text-cloud-dancer/80 hover:text-patina transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-patina/60 py-1"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionHeader = ({ title, subtitle, centered = false }: { title: string; subtitle: string; centered?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-16 select-none ${centered ? 'text-center mx-auto' : 'text-left'} max-w-4xl`}
  >
    <p className="text-patina text-[10px] uppercase tracking-[0.4em] font-bold mb-6 break-words">{subtitle}</p>
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-serif text-cloud-dancer font-light uppercase leading-tight tracking-[0.05em] md:tracking-[0.1em] break-words">{title}</h2>
    <div className={`h-px w-24 bg-cloud-dancer/10 mt-8 ${centered ? 'mx-auto' : ''}`}></div>
  </motion.div>
);

const FloatingInput = ({ 
  label, 
  value, 
  onChange, 
  onBlur,
  error, 
  id, 
  type = "text", 
  placeholder, 
  isTextArea = false, 
  required = false 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  onBlur?: () => void;
  error?: string; 
  id: string; 
  type?: string; 
  placeholder?: string; 
  isTextArea?: boolean; 
  required?: boolean; 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  
  const shouldFloat = isFocused || hasValue || type === "datetime-local" || type === "date" || type === "time" || type === "tel";
  const InputComponent = isTextArea ? 'textarea' : 'input';

  return (
    <div className="relative pt-6 group">
      <label 
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 uppercase tracking-[0.3em] font-bold pointer-events-none z-10
          ${shouldFloat ? '-top-1 text-[9px] text-patina' : 'top-7 text-[10px] text-cloud-dancer/60'}
        `}
      >
        {label} {required && <span className="text-burnt-orange select-none font-bold" aria-hidden="true">*</span>}
      </label>
      <InputComponent
        id={id}
        type={type}
        value={value}
        rows={isTextArea ? 3 : undefined}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        className={`w-full bg-transparent border-b ${
          error ? 'border-burnt-orange/60 focus:border-burnt-orange' : 'border-cloud-dancer/20 focus:border-patina'
        } py-4 text-cloud-dancer text-sm outline-none transition-all duration-500 placeholder:opacity-0 focus:placeholder:opacity-30 focus:ring-1 focus:ring-patina/20 rounded-[1px] px-1 ${isTextArea ? 'resize-none' : ''}`}
        placeholder={placeholder}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
          if (onBlur) onBlur();
        }}
        onChange={(e) => onChange(e.target.value)}
      />
      
      {/* Inline accessible error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] text-burnt-orange font-semibold uppercase tracking-[0.15em] mt-2 block select-none"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const FloatingSelect = ({ 
  label, 
  value, 
  onChange, 
  onBlur,
  options, 
  error, 
  id, 
  required = false 
}: { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  onBlur?: () => void;
  options: string[]; 
  error?: string; 
  id: string; 
  required?: boolean; 
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value.length > 0;
  const shouldFloat = isFocused || hasValue;

  return (
    <div className="relative pt-6 group">
      <label 
        htmlFor={id}
        className={`absolute left-0 transition-all duration-300 uppercase tracking-[0.3em] font-bold pointer-events-none z-10
          ${shouldFloat ? '-top-1 text-[9px] text-patina' : 'top-7 text-[10px] text-cloud-dancer/60'}
        `}
      >
        {label} {required && <span className="text-burnt-orange select-none font-bold" aria-hidden="true">*</span>}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${id}-error` : undefined}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            if (onBlur) onBlur();
          }}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full bg-transparent border-b ${
            error ? 'border-burnt-orange/60 focus:border-burnt-orange' : 'border-cloud-dancer/20 focus:border-patina'
          } py-4 text-cloud-dancer text-sm outline-none transition-all duration-500 appearance-none cursor-pointer pr-8 focus:ring-1 focus:ring-patina/20 rounded-[1px] px-1`}
        >
          <option value="" className="bg-charcoal text-cloud-dancer/40"></option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-charcoal text-cloud-dancer py-2">
              {opt}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cloud-dancer/30 group-hover:text-patina transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            key="error"
            id={`${id}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="text-[10px] text-burnt-orange font-semibold uppercase tracking-[0.15em] mt-2 block select-none"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

const MenuCard: React.FC<{ item: any; onProvenanceClick?: () => void }> = ({ item, onProvenanceClick }) => {
  const [imageError, setImageError] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onProvenanceClick) {
      e.preventDefault();
      onProvenanceClick();
    }
  };

  return (
    <motion.article 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={onProvenanceClick}
      onKeyDown={handleKeyPress}
      className="group relative overflow-hidden bg-white/[0.01] border border-cloud-dancer/5 p-4 rounded-sm hover:border-patina/30 focus:outline-none focus:border-patina focus-visible:ring-2 focus-visible:ring-patina/60 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal transition-all duration-700 cursor-pointer flex flex-col justify-between h-full"
      tabIndex={0}
      aria-label={`${item.name}, ${item.price}. ${item.desc}. Press enter to verify provenance.`}
    >
      <div className="flex flex-col h-full justify-between gap-6">
        <div className="relative">
          <div className="relative aspect-square overflow-hidden mb-6 bg-charcoal-light/10 border border-cloud-dancer/[0.03] select-none rounded-[1px]">
            {!imageError ? (
              <img 
                src={item.image} 
                alt={`${item.name} presentation`} 
                onError={() => setImageError(true)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover md:grayscale md:opacity-40 group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-100 transition-all duration-1000 ease-out" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[#0e0e0e]/80 relative text-center">
                <Beef className="w-10 h-10 text-cloud-dancer/10 mb-3 group-hover:scale-110 transition-transform duration-500" aria-hidden="true" />
                <span className="text-[7px] uppercase tracking-[0.2em] font-mono text-cloud-dancer/30 group-hover:text-patina/50 transition-colors font-bold max-w-[80%] leading-relaxed">
                  Provenance Certified
                </span>
                <div className="absolute inset-1.5 border border-cloud-dancer/5 opacity-40 pointer-events-none"></div>
              </div>
            )}
            
            <div className="absolute top-4 right-4 glass px-3 py-1 text-[10px] font-bold text-patina tracking-widest uppercase">
              {item.price}
            </div>
            
            {item.tag && (
              <div className="absolute bottom-4 left-4 text-[9px] uppercase tracking-[0.3em] font-bold text-cloud-dancer/30 border border-cloud-dancer/10 px-2 py-1 bg-charcoal/90 backdrop-blur-sm">
                {item.tag}
              </div>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-cloud-dancer group-hover:text-patina transition-colors duration-500 line-clamp-2 leading-tight min-h-[4rem] sm:min-h-[4.5rem] flex items-end break-words">
              {item.name}
            </h3>
            <p className="text-sm text-cloud-dancer/60 leading-relaxed font-light line-clamp-3 min-h-[4.5rem] break-words">
              {item.desc || "Prepared with heritage methods, smoked daily to absolute perfection."}
            </p>
          </div>
        </div>
        <div 
          className="pt-4 flex items-center gap-2 text-patina/40 group-hover:text-patina transition-colors cursor-pointer mt-auto"
          onClick={(e) => {
            e.stopPropagation();
            if (onProvenanceClick) onProvenanceClick();
          }}
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-bold">Provenance</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
};

const MenuCardSkeleton = () => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pulseClass = prefersReducedMotion ? '' : 'animate-pulse [animation-duration:3s]';

  return (
    <div className="relative overflow-hidden bg-white/[0.01] border border-cloud-dancer/5 p-4 rounded-sm">
      <div className={`relative aspect-square bg-[#1a1a1a] overflow-hidden mb-8 ${pulseClass} flex items-center justify-center`}>
        <div className="w-12 h-12 rounded-full border border-cloud-dancer/[0.03] flex items-center justify-center opacity-30">
          <Beef className="w-5 h-5 text-cloud-dancer/10" />
        </div>
        <div className="absolute top-4 right-4 bg-cloud-dancer/[0.03] border border-cloud-dancer/5 backdrop-blur-md w-14 h-5"></div>
        <div className="absolute bottom-4 left-4 border border-cloud-dancer/5 bg-cloud-dancer/[0.01] w-16 h-4"></div>
      </div>
      <div className="space-y-4">
        <div className={`h-8 bg-cloud-dancer/[0.04] w-3/4 rounded-sm ${pulseClass}`}></div>
        <div className="space-y-2">
          <div className={`h-3.5 bg-cloud-dancer/[0.02] w-full rounded-sm ${pulseClass}`}></div>
          <div className={`h-3.5 bg-cloud-dancer/[0.02] w-5/6 rounded-sm ${pulseClass}`}></div>
        </div>
        <div className="pt-2 flex items-center gap-2">
          <div className={`h-3 bg-patina/10 w-20 rounded-sm ${pulseClass}`}></div>
          <div className="w-3 h-3 bg-patina/15 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

const FormSkeleton = () => {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pulseClass = prefersReducedMotion ? '' : 'animate-pulse [animation-duration:3.2s]';

  return (
    <div className="space-y-12 relative z-10">
      {/* Guest Name & Email Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-16 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full"></div>
        </div>
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-24 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full"></div>
        </div>
      </div>

      {/* Phone & Party Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-28 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full"></div>
        </div>
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-32 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full flex justify-between items-center">
            <span></span>
            <div className="w-3 h-2 bg-cloud-dancer/20 rounded-sm mr-2"></div>
          </div>
        </div>
      </div>

      {/* Date & Time Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-24 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full"></div>
        </div>
        <div className="space-y-3 pt-6">
          <div className={`h-2.5 bg-patina/10 w-24 rounded-sm ${pulseClass}`}></div>
          <div className="h-10 border-b border-cloud-dancer/5 w-full"></div>
        </div>
      </div>

      <div className={`h-2 bg-cloud-dancer/5 w-3/4 rounded-sm ${pulseClass}`}></div>

      {/* Special Requests */}
      <div className="space-y-3 pt-6">
        <div className={`h-2.5 bg-patina/10 w-32 rounded-sm ${pulseClass}`}></div>
        <div className="h-20 border-b border-cloud-dancer/5 w-full"></div>
      </div>

      {/* Action Button placeholder */}
      <div className="pt-6">
        <div className={`w-full py-6 bg-cloud-dancer/[0.04] border border-cloud-dancer/5 rounded-sm flex items-center justify-center ${pulseClass}`}>
          <div className="h-3.5 bg-cloud-dancer/10 w-32 rounded-sm"></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const menuItems = TEMPLATE_CONFIG.menu.items;

  // --- TOAST NOTIFICATIONS STATE & ACTIONS ---
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (message: string, type: 'SECURED' | 'HALTED' | 'UPDATED' = 'UPDATED', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // --- STATE FOR LOADING & SKELETON RE-USE ---
  const [isMenuLoading, setIsMenuLoading] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(false);

  useEffect(() => {
    // 1.5 second initial load of Menu to showcase premium skeletons automatically on visit
    setIsMenuLoading(true);
    const menuTimer = setTimeout(() => {
      setIsMenuLoading(false);
    }, 1500);

    // Initial load for form to showcase identical outline structure
    setIsFormLoading(true);
    const formTimer = setTimeout(() => {
      setIsFormLoading(false);
    }, 1500);

    return () => {
      clearTimeout(menuTimer);
      clearTimeout(formTimer);
    };
  }, []);

  // --- STATE FOR PREMIUM RESERVATION FORM ---
  const [isOrderMode, setIsOrderMode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isOrder = window.location.search.toLowerCase().includes('order') || 
                      window.location.hash.toLowerCase().includes('order') ||
                      window.location.href.toLowerCase().includes('order');
      setIsOrderMode(isOrder);
    }
  }, []);

  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [partySize, setPartySize] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [reservedCuts, setReservedCuts] = useState('');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  // High-End Booking Details State (Holds verified summary on success)
  const [bookingDetails, setBookingDetails] = useState<{
    code: string;
    guestName: string;
    email: string;
    phone: string;
    partySize: string;
    bookingDate: string;
    bookingTime: string;
    reservedCuts: string;
  } | null>(null);

  // Field validation helper
  const validateField = (field: string, val: string) => {
    let err = '';
    const trimmedVal = val.trim();
    
    if (field === 'guestName') {
      if (!trimmedVal) err = 'Guest name is required.';
      else if (trimmedVal.length < 2) err = 'Please enter your complete name.';
    } else if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedVal) err = 'Email address is required.';
      else if (!emailRegex.test(trimmedVal)) err = 'Provide a valid email (e.g., name@domain.com).';
    } else if (field === 'phone') {
      const phoneClean = trimmedVal.replace(/\D/g, '');
      if (!trimmedVal) err = 'Phone number is required.';
      else if (phoneClean.length < 10) err = 'Complete 10-digit phone number is required.';
    } else if (field === 'partySize') {
      if (!val) err = 'Please select party size.';
    } else if (field === 'bookingDate') {
      if (!val) err = 'Reservation date is required.';
      else {
        const dateParts = val.split('-');
        if (dateParts.length === 3) {
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1;
          const day = parseInt(dateParts[2], 10);
          const selectedDate = new Date(year, month, day);
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (selectedDate.getTime() < today.getTime()) {
            err = 'Reservation date cannot be in the past.';
          }
        } else {
          err = 'Please enter a valid date.';
        }
      }
    } else if (field === 'bookingTime') {
      if (!val) err = 'Reservation time is required.';
    }
    return err;
  };

  const handleFieldChange = (field: string, val: string) => {
    if (field === 'guestName') setGuestName(val);
    else if (field === 'email') setEmail(val);
    else if (field === 'phone') setPhone(val);
    else if (field === 'partySize') setPartySize(val);
    else if (field === 'bookingDate') setBookingDate(val);
    else if (field === 'bookingTime') setBookingTime(val);
    else if (field === 'reservedCuts') setReservedCuts(val);

    if (touched[field]) {
      const err = validateField(field, val);
      setErrors(prev => ({ ...prev, [field]: err }));
    }
  };

  const handleFieldBlur = (field: string, val: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const err = validateField(field, val);
    setErrors(prev => ({ ...prev, [field]: err }));
  };

  const validateForm = () => {
    const fieldsToValidate = ['guestName', 'email', 'phone', 'partySize', 'bookingDate', 'bookingTime'];
    const values: Record<string, string> = { guestName, email, phone, partySize, bookingDate, bookingTime };
    const newErrors: Record<string, string> = {};
    const newTouched: Record<string, boolean> = {};

    let isValid = true;
    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      const err = validateField(field, values[field] || '');
      if (err) {
        newErrors[field] = err;
        isValid = false;
      }
    });

    setErrors(newErrors);
    setTouched(newTouched);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      addToast("Please fix the highlighted fields", "HALTED", 6000);
      return;
    }

    setIsSubmitting(true);
    addToast("Sending reservation request...", "UPDATED", 3000);

    setTimeout(() => {
      setIsSubmitting(false);
      const generatedCode = "PIT-" + Math.floor(100000 + Math.random() * 900000);
      setBookingDetails({
        code: generatedCode,
        guestName,
        email,
        phone,
        partySize,
        bookingDate,
        bookingTime,
        reservedCuts
      });
      addToast("Reservation request sent", "SECURED", 6000);
    }, 1800);
  };

  const handleReset = () => {
    setGuestName('');
    setEmail('');
    setPhone('');
    setPartySize('');
    setBookingDate('');
    setBookingTime('');
    setReservedCuts('');
    setErrors({});
    setTouched({});
    setBookingDetails(null);
    addToast("Reservation form cleared", "UPDATED", 4000);
  };

  return (
    <div className="min-h-screen bg-charcoal selection:bg-patina/30 selection:text-cloud-dancer">
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative h-screen min-h-[100dvh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={TEMPLATE_CONFIG.brand.heroBgImage} 
            alt="Smoker background"
            className="w-full h-full object-cover opacity-20 grayscale scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-patina text-[10px] uppercase tracking-[0.6em] font-bold mb-8 break-words">{TEMPLATE_CONFIG.brand.established}</p>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-serif text-cloud-dancer font-light leading-[0.95] text-balance mb-12 tracking-tighter break-words">
              {TEMPLATE_CONFIG.brand.taglinePre} <br />
              <span className="italic text-patina/80">{TEMPLATE_CONFIG.brand.taglineBold}</span>.
            </h1>
            <p className="max-w-2xl mx-auto text-cloud-dancer/40 text-sm md:text-lg leading-relaxed tracking-wide font-light break-words">
              {TEMPLATE_CONFIG.brand.heroDesc}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
          >
            <a 
              href="#menu" 
              onClick={() => addToast("Our smokehouse menu is ready.", "SECURED", 3000)}
              className="w-full sm:w-auto px-12 py-6 bg-patina text-charcoal font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-cloud-dancer transition-all duration-500 rounded-sm text-center"
            >
              {TEMPLATE_CONFIG.brand.ctaDiscover}
            </a>
            <a 
              href="#order" 
              onClick={() => addToast("Opening reservations.", "UPDATED", 3000)}
              className="w-full sm:w-auto px-12 py-6 border border-cloud-dancer/10 text-cloud-dancer font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-burnt-orange hover:border-burnt-orange transition-all duration-500 rounded-sm text-center"
            >
              {TEMPLATE_CONFIG.brand.ctaReserve}
            </a>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 cursor-pointer"
          onClick={() => {
            document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
            addToast("Now viewing today's fresh cuts.", "UPDATED", 3000);
          }}
        >
          <span className="text-[10px] uppercase tracking-[0.5em] text-cloud-dancer/20 font-bold">Scroll</span>
          <div className="w-px h-16 bg-gradient-to-b from-patina/40 to-transparent"></div>
        </motion.div>
      </section>

      {/* House Highlights Strip */}
      <section className="bg-charcoal border-y border-cloud-dancer/5 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-cloud-dancer/5 text-center md:text-left">
            <div className="md:px-8 pt-6 md:pt-0">
              <span className="text-patina font-mono text-xs tracking-widest block mb-1.5 uppercase">I. Oak & Pecan Smoked Daily</span>
              <p className="text-cloud-dancer/65 text-xs font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                Tended around the clock. Every slice of prime-grade brisket is slow-cooked for 12 hours over native seasoned hardwoods.
              </p>
            </div>
            <div className="md:px-8 pt-8 md:pt-0">
              <span className="text-patina font-mono text-xs tracking-widest block mb-1.5 uppercase">II. Prime Cuts, Hand Carved</span>
              <p className="text-cloud-dancer/65 text-xs font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                Sliced strictly to order at our custom pit counter to lock in natural moisture, rich timber smoke, and black pepper bark.
              </p>
            </div>
            <div className="md:px-8 pt-8 md:pt-0">
              <span className="text-patina font-mono text-xs tracking-widest block mb-1.5 uppercase">III. Bourbon, Beer & Seasonal Sides</span>
              <p className="text-cloud-dancer/65 text-xs font-light leading-relaxed max-w-sm mx-auto md:mx-0">
                A carefully curated selection of rare Texas small-batch bourbons, local craft beers, and heirloom side dishes prepared fresh daily.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="section-spacing bg-charcoal relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title={TEMPLATE_CONFIG.menu.sectionTitle} 
            subtitle={TEMPLATE_CONFIG.menu.sectionSubtitle}
            centered
          />

          {/* Premium Interactive Selection Refresh */}
          <div className="flex justify-center items-center gap-4 mb-12 -mt-6">
            <button 
              onClick={() => {
                setIsMenuLoading(true);
                addToast("Refreshing today's wood-fired selections...", "UPDATED", 1800);
                setTimeout(() => {
                  setIsMenuLoading(false);
                  addToast("Smoked cuts refreshed successfully.", "SECURED", 3500);
                }, 1800);
              }}
              disabled={isMenuLoading}
              className="text-[9px] uppercase tracking-[0.25em] text-patina border border-patina/30 hover:border-patina bg-patina/5 hover:bg-patina/10 px-5 py-2.5 transition-all rounded-sm font-mono flex items-center gap-3 disabled:opacity-40"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isMenuLoading ? 'bg-patina animate-ping' : 'bg-patina'}`}></span>
              {isMenuLoading ? "Checking Smoker..." : "Check Smoked Selections"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {isMenuLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <MenuCardSkeleton key={index} />
              ))
            ) : (
              menuItems.map((item) => (
                <MenuCard 
                  key={item.name} 
                  item={item} 
                  onProvenanceClick={() => addToast(`Provenance Verified: Smoked in-house over white oak & pecan.`, "SECURED", 4000)}
                />
              ))
            )}
          </div>

          <div className="mt-20 text-center">
            <p className="text-cloud-dancer/30 text-[10px] uppercase tracking-widest italic mb-12">* All meats are prime grade and hormone-free. Sliced to order.</p>
            <a 
              href="#order" 
              onClick={() => addToast("Opening reservations.", "UPDATED", 3000)}
              className="inline-flex items-center gap-8 group text-left"
            >
              <span className="text-patina text-xs uppercase tracking-[0.4em] font-bold group-hover:text-cloud-dancer transition-colors duration-500">Book a Table</span>
              <div className="w-16 h-px bg-patina/40 group-hover:w-32 group-hover:bg-patina transition-all duration-700"></div>
            </a>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="section-spacing bg-white/[0.002] border-t border-cloud-dancer/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeader 
            title={TEMPLATE_CONFIG.testimonials.sectionTitle} 
            subtitle={TEMPLATE_CONFIG.testimonials.sectionSubtitle}
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEMPLATE_CONFIG.testimonials.items.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15 }}
                className="group relative overflow-hidden bg-white/[0.01] border border-cloud-dancer/5 p-8 rounded-sm hover:border-patina/20 transition-all duration-700 h-full flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <span className="font-serif text-5xl text-patina/20 select-none block h-4">“</span>
                  <p className="text-cloud-dancer/75 text-base leading-relaxed font-light italic break-words">
                    {t.quote}
                  </p>
                </div>
                <div className="pt-8 mt-auto border-t border-cloud-dancer/5 flex flex-col gap-1">
                  <span className="text-cloud-dancer text-xs uppercase tracking-[0.2em] font-bold break-words">{t.author}</span>
                  <span className="text-patina/50 text-[9px] uppercase tracking-[0.3em] font-semibold break-words">{t.role}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section-spacing border-t border-cloud-dancer/5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div
             initial={{ opacity: 0, x: -50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="space-y-12"
          >
            <SectionHeader title={TEMPLATE_CONFIG.about.sectionTitle} subtitle={TEMPLATE_CONFIG.about.sectionSubtitle} />
            <div className="space-y-8 text-cloud-dancer/50 font-light leading-relaxed text-lg break-words">
              {TEMPLATE_CONFIG.about.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 pt-8">
              {TEMPLATE_CONFIG.about.features.map((feature, idx) => {
                const aboutIcons = [
                  <UtensilsCrossed className="w-6 h-6 text-patina opacity-40 mb-3" key="utensils" />,
                  <Clock className="w-6 h-6 text-patina opacity-40 mb-3" key="clock" />,
                  <Droplets className="w-6 h-6 text-patina opacity-40 mb-3" key="droplets" />
                ];
                return (
                  <div className="space-y-4" key={idx}>
                    {aboutIcons[idx] || <Flame className="w-6 h-6 text-patina opacity-40 mb-3" />}
                    <h4 className="text-cloud-dancer text-[10px] uppercase tracking-[0.3em] font-bold break-words">{feature.title}</h4>
                    <p className="text-[9px] text-cloud-dancer/30 leading-relaxed uppercase tracking-widest font-bold break-words">{feature.desc}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             className="relative"
          >
            <div className="absolute inset-0 bg-patina/5 blur-[120px] rounded-full -z-10"></div>
            <div className="aspect-[4/5] overflow-hidden border border-cloud-dancer/5 p-4 bg-white/[0.02] backdrop-blur-sm">
              <img 
                src={TEMPLATE_CONFIG.about.image} 
                alt="Pit master at work" 
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-[2000ms] ease-in-out"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Private Dining & Catering Section */}
      <section id="events" className="section-spacing border-t border-cloud-dancer/5 relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 bg-patina/[0.01] -z-10"></div>
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center font-sans">
          <motion.div
             initial={{ opacity: 0, scale: 0.98 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
             className="relative order-2 lg:order-1"
          >
            <div className="absolute inset-0 bg-patina/5 blur-[120px] rounded-full -z-10"></div>
            <div className="aspect-[16/10] overflow-hidden border border-cloud-dancer/5 p-4 bg-white/[0.02] backdrop-blur-sm">
              <img 
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80" 
                alt="Private dining room with rustic wood table and vintage lighting" 
                className="w-full h-full object-cover grayscale brightness-50 hover:grayscale-0 transition-all duration-[2000ms] ease-in-out"
              />
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
             className="space-y-12 order-1 lg:order-2"
          >
            <SectionHeader title="Private Dining & Catering" subtitle="Exclusive Smokehouse Experiences" />
            <div className="space-y-6 text-cloud-dancer/50 font-light leading-relaxed text-sm md:text-base break-words">
              <p>
                From intimate group bookings to full smokehouse buyouts and special event inquiries, host your guests surrounded by the aroma of seasoned oak and heirloom recipes. 
              </p>
              <p>
                We offer custom-curated family-style menus, rare bourbon pairings, and dedicated pit counter carving services. For off-site gatherings, we prepare premium smokehouse catering trays loaded with hand-sliced brisket, pulled pork, and signature baked sides, fully arranged and ready to serve.
              </p>
            </div>
            
            <div className="pt-8 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 justify-start">
              <a 
                href={`mailto:${TEMPLATE_CONFIG.contact.email}?subject=Private Dining Inquiry`}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-patina text-patina hover:bg-patina hover:text-charcoal font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-500 rounded-none cursor-pointer text-center min-w-[220px] active:scale-95 block mb-4 sm:mb-0 sm:mr-4"
              >
                Inquire About Private Dining
              </a>
              <a 
                href={`mailto:${TEMPLATE_CONFIG.contact.email}?subject=Catering Inquiry`}
                className="w-full sm:w-auto px-8 py-4 bg-transparent border border-cloud-dancer/20 text-cloud-dancer/80 hover:border-patina hover:text-patina font-bold text-[10px] uppercase tracking-[0.25em] transition-all duration-500 rounded-none cursor-pointer text-center min-w-[220px] active:scale-95 block mt-2 sm:mt-0"
              >
                Request Catering Details
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Order/Contact Section */}
      <section id="order" className="section-spacing bg-white/[0.005] border-y border-cloud-dancer/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32">
            {/* Info */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-16"
            >
              <SectionHeader title={TEMPLATE_CONFIG.contact.sectionTitle} subtitle={TEMPLATE_CONFIG.contact.sectionSubtitle} />
              
              <div className="space-y-10">
                <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-full border border-cloud-dancer/10 flex items-center justify-center shrink-0 group-hover:border-patina transition-colors duration-500">
                    <MapPin className="w-5 h-5 text-patina" />
                  </div>
                  <div>
                    <h4 className="text-cloud-dancer text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Location</h4>
                    <p className="text-cloud-dancer/70 font-light leading-relaxed text-lg break-words">
                      {TEMPLATE_CONFIG.contact.addressLines.map((line, idx) => (
                        <React.Fragment key={idx}>{line}{idx < TEMPLATE_CONFIG.contact.addressLines.length - 1 && <br />}</React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-full border border-cloud-dancer/10 flex items-center justify-center shrink-0 group-hover:border-patina transition-colors duration-500">
                    <Clock className="w-5 h-5 text-patina" />
                  </div>
                  <div>
                    <h4 className="text-cloud-dancer text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Hours</h4>
                    <p className="text-cloud-dancer/70 font-light leading-relaxed text-lg break-words">
                      {TEMPLATE_CONFIG.contact.hoursLines.map((line, idx) => (
                        <React.Fragment key={idx}>{line}{idx < TEMPLATE_CONFIG.contact.hoursLines.length - 1 && <br />}</React.Fragment>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-8 group">
                  <div className="w-14 h-14 rounded-full border border-cloud-dancer/10 flex items-center justify-center shrink-0 group-hover:border-patina transition-colors duration-500">
                    <Phone className="w-5 h-5 text-patina" />
                  </div>
                  <div>
                    <h4 className="text-cloud-dancer text-[10px] uppercase tracking-[0.3em] font-bold mb-3">Contact</h4>
                    <p className="text-cloud-dancer/70 font-light leading-relaxed text-lg break-words">
                      {TEMPLATE_CONFIG.contact.phone} <br />
                      {TEMPLATE_CONFIG.contact.email}
                    </p>
                  </div>
                </div>
              </div>

            </motion.div>

            {/* Form */}
            <motion.div 
               initial={{ opacity: 0, scale: 0.98 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-charcoal p-10 md:p-16 border border-cloud-dancer/5 relative group overflow-hidden md:max-w-2xl md:mx-auto lg:max-w-none lg:mx-0 flex flex-col justify-between"
            >
              <div className="absolute inset-0 bg-patina/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              
              <div className="relative z-10 space-y-12 w-full">
                <div className="space-y-4">
                  <h3 className="text-2xl sm:text-3xl font-serif text-cloud-dancer font-light italic tracking-[0.05em] uppercase">
                    Book by Phone or Email
                  </h3>
                  <p className="text-cloud-dancer/60 text-sm font-sans tracking-wide leading-relaxed max-w-xl">
                    Experience the true craft of low-and-slow Central Texas barbecue. Secure your table, request exclusive cuts for your party, or organize a private event by contacting our team directly.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  {/* Call to Reserve Card */}
                  <a 
                    href={`tel:${TEMPLATE_CONFIG.contact.phone}`}
                    className="block p-8 border border-cloud-dancer/5 bg-white/[0.01] hover:border-patina/40 hover:bg-white/[0.02] transition-all duration-500 rounded-sm group/card"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="p-3 bg-patina/10 rounded-full text-patina group-hover/card:scale-110 transition-transform duration-500">
                        <Phone className="w-5 h-5" />
                      </span>
                      <h4 className="text-cloud-dancer font-serif text-lg tracking-wide uppercase font-light">Call to Reserve</h4>
                    </div>
                    <p className="text-cloud-dancer/40 text-xs mb-4 font-sans leading-relaxed">
                      Best for same-day bookings, immediate table availability, or parties larger than 6.
                    </p>
                    <span className="text-patina font-mono text-sm tracking-widest font-bold group-hover/card:text-white transition-colors duration-500">
                      {TEMPLATE_CONFIG.contact.phone} →
                    </span>
                  </a>

                  {/* Email for Reservations Card */}
                  <a 
                    href={`mailto:${TEMPLATE_CONFIG.contact.email}?subject=Reservation Request`}
                    className="block p-8 border border-cloud-dancer/5 bg-white/[0.01] hover:border-patina/40 hover:bg-white/[0.02] transition-all duration-500 rounded-sm group/card"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <span className="p-3 bg-patina/10 rounded-full text-patina group-hover/card:scale-110 transition-transform duration-500">
                        <Mail className="w-5 h-5" />
                      </span>
                      <h4 className="text-cloud-dancer font-serif text-lg tracking-wide uppercase font-light">Email for Reservations</h4>
                    </div>
                    <p className="text-cloud-dancer/40 text-xs mb-4 font-sans leading-relaxed">
                      Best for future bookings, general inquiries, and dietary requests.
                    </p>
                    <span className="text-patina font-mono text-sm tracking-widest font-bold group-hover/card:text-white transition-colors duration-500">
                      {TEMPLATE_CONFIG.contact.email} →
                    </span>
                  </a>
                </div>

                {/* Private Dining & Catering */}
                <div className="p-8 border border-cloud-dancer/5 bg-white/[0.01] rounded-sm relative overflow-hidden group/catering">
                  <div className="absolute inset-0 bg-patina/[0.02] opacity-0 group-hover/catering:opacity-100 transition-opacity duration-1000"></div>
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-2 max-w-md">
                      <div className="flex items-center gap-3">
                        <Flame className="w-4 h-4 text-patina" />
                        <span className="text-[10px] text-patina uppercase tracking-[0.3em] font-bold">Exclusive Services</span>
                      </div>
                      <h4 className="text-cloud-dancer font-serif text-xl tracking-wide uppercase font-light">Private Dining & Catering Inquiries</h4>
                      <p className="text-cloud-dancer/40 text-xs font-sans leading-relaxed">
                        Curate a custom Pitmaster experience featuring whole briskets, artisanal sides, and exclusive wood-fired pairing events for weddings, corporate retreats, and private parties.
                      </p>
                    </div>
                    <a 
                      href={`mailto:${TEMPLATE_CONFIG.contact.email}?subject=Private Dining or Catering Inquiry`}
                      className="px-8 py-5 bg-cloud-dancer text-charcoal hover:bg-patina hover:text-white text-[10px] uppercase font-black tracking-[0.4em] transition-all duration-500 rounded-sm hover:-translate-y-1 active:translate-y-0 text-center shadow-lg hover:shadow-patina/20"
                    >
                      Inquire Now
                    </a>
                  </div>
                </div>

              </div>
              
              <div className="pt-12 border-t border-cloud-dancer/5 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <p className="text-[9px] text-cloud-dancer/30 uppercase tracking-[0.3em] font-bold">
                  * Phone reservation hours: {TEMPLATE_CONFIG.contact.hoursLines[0] || "11:00 AM – 8:00 PM"}
                </p>
                <p className="text-[9px] text-cloud-dancer/30 uppercase tracking-[0.3em] font-bold">
                  Same-day bookings accepted daily until 2:00 PM
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 border-t border-cloud-dancer/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-16">
          <div className="flex flex-col items-center md:items-start gap-6">
            <div className="flex items-center gap-3">
              <Flame className="w-6 h-6 text-patina" />
              <span className="font-serif text-2xl font-light text-cloud-dancer uppercase tracking-tighter">{TEMPLATE_CONFIG.brand.name}</span>
            </div>
            <p className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/20">&copy; 2026 {TEMPLATE_CONFIG.brand.name} — {TEMPLATE_CONFIG.contact.addressLines[TEMPLATE_CONFIG.contact.addressLines.length - 1] || "Austin, Texas"}. Legacy of Smoke.</p>
          </div>

          <div className="grid grid-cols-2 gap-20">
             <div className="space-y-6">
               <h5 className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer font-bold">Navigation</h5>
               <ul className="flex flex-col gap-5">
                 <li>
                   <a href="#home" className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/30 hover:text-patina transition-colors font-bold block">HOME</a>
                 </li>
                 <li>
                   <a href="#menu" className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/30 hover:text-patina transition-colors font-bold block">MENU</a>
                 </li>
                 <li>
                   <a href="#about" className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/30 hover:text-patina transition-colors font-bold block">PHILOSOPHY</a>
                 </li>
               </ul>
             </div>
             <div className="space-y-6">
               <h5 className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer font-bold">Legal</h5>
               <ul className="flex flex-col gap-5">
                 <li>
                   <a href="#" className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/30 hover:text-patina transition-colors font-bold block">PRIVACY</a>
                 </li>
                 <li>
                   <a href="#" className="text-[9px] uppercase tracking-[0.4em] text-cloud-dancer/30 hover:text-patina transition-colors font-bold block">TERMS</a>
                 </li>
               </ul>
             </div>
          </div>
        </div>
      </footer>

      {/* Premium Toast Notifications Viewport */}
      <div className="fixed bottom-6 right-6 md:right-8 z-[9999] flex flex-col gap-3 max-w-sm w-[calc(100vw-3rem)] pointer-events-none">
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
