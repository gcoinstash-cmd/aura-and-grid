import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Check, 
  Plus, 
  User, 
  Flame, 
  FileText,
  Volume2,
  VolumeX,
  X,
  MapPin,
  Compass,
  Printer
} from 'lucide-react';
import { CULINARY_EXPERIENCES } from './data';
import { ExperienceId, Dish } from './types';

// Structural Interfaces for high-commerce digital storefront template
export interface CourseItem {
  id: string;
  title: string;
  price: number;
  description: string;
  tags: string[];
  dietary: string[];
  method?: string;
  alignment?: string;
  // Compatibility properties
  name?: string;
  cookingMethod?: string;
  organicAlignment?: string;
  courseNumber?: string;
  imageUrl?: string;
}

export interface ExperienceMenu {
  id: string;
  title: string;
  tagline: string;
  description: string;
  quote?: string;
  hours: string;
  courses: CourseItem[];
  // Compatibility properties
  dishes: CourseItem[];
  subtitle: string;
  chefQuote: string;
  schedule: string;
  timeframe?: string;
}

// Safe, resilient image renderer utilizing React-controlled loading state
function DishImage({ imageUrl, name, className }: { imageUrl: string; name: string; className?: string }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [imageUrl]);

  const fallbackUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80";

  return (
    <img
      src={hasError || !imageUrl ? fallbackUrl : imageUrl}
      alt={name}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
    />
  );
}

interface PresetTexts {
  studioName: string;
  conceptName: string;
  locale: string;
  tagline: string;
  ethos: string;
}

export interface BrandConfig {
  studioName: string;
  conceptName: string;
  locale: string;
  activePreset: "culinaryAtelier" | "coastalTastingRoom";
}

const PRESETS: Record<"culinaryAtelier" | "coastalTastingRoom", PresetTexts> = {
  culinaryAtelier: {
    studioName: "AURA & GRID",
    conceptName: "The Winter Parlor",
    locale: "LOS ANGELES",
    tagline: "An intimate culinary retreat in the hills of View Park. Built around seasonal micro-farm harvests, slow oakwood smoke, and absolute culinary restraint.",
    ethos: "To dine is to read an essay written in texture, smoke, and memory."
  },
  coastalTastingRoom: {
    studioName: "AURA & GRID",
    conceptName: "The Coastal Tasting Room",
    locale: "PACIFIC SHELF",
    tagline: "A low-intervention maritime kitchen overlooking the Pacific shelf. Built around morning tides, kelp-bed foraging, and raw oceanic clarity.",
    ethos: "Every dish is an open, unadorned dialogue with the cold currents of the coast."
  }
};

// Ambient noise or simulated audio player state helper
export default function App() {
  const [isTablesideQR, setIsTablesideQR] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.location.search.includes('qr=') || window.location.hash.includes('table04');
    }
    return false;
  });

  const [brandConfig, setBrandConfig] = useState<BrandConfig>({
    studioName: "AURA & GRID",
    conceptName: "The Winter Parlor",
    locale: "LOS ANGELES",
    activePreset: "culinaryAtelier"
  });

  const handlePresetChange = (preset: "culinaryAtelier" | "coastalTastingRoom") => {
    const selected = PRESETS[preset];
    setBrandConfig({
      studioName: selected.studioName,
      conceptName: selected.conceptName,
      locale: selected.locale,
      activePreset: preset
    });
  };

  const [selectedExpId, setSelectedExpId] = useState<ExperienceId>('tasting');
  const [selectedDietary, setSelectedDietary] = useState<string>('All');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [sommelierPairing, setSommelierPairing] = useState<boolean>(false);

  const scrollToSection = (id: string) => {
    if (typeof window !== 'undefined') {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Load from localStorage on client-side mount (Hydration Safeguard)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedPreset = localStorage.getItem('aura_grid_brand_preset');
      if (savedPreset === "culinaryAtelier" || savedPreset === "coastalTastingRoom") {
        const selected = PRESETS[savedPreset];
        setBrandConfig({
          studioName: selected.studioName,
          conceptName: selected.conceptName,
          locale: selected.locale,
          activePreset: savedPreset
        });
      }
      
      const savedExpId = localStorage.getItem('aura_grid_selected_exp_id');
      if (savedExpId) {
        setSelectedExpId(savedExpId as ExperienceId);
      }
      const savedCourses = localStorage.getItem('aura_grid_selected_courses');
      if (savedCourses) {
        try {
          const parsed = JSON.parse(savedCourses);
          if (Array.isArray(parsed)) {
            setSelectedCourses(parsed);
          }
        } catch (e) {
          // Fallback silently
        }
      }
      const savedPairing = localStorage.getItem('aura_grid_sommelier_pairing');
      if (savedPairing !== null) {
        setSommelierPairing(savedPairing === 'true');
      }
    }
  }, []);

  // Sync to localStorage when states change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_grid_brand_preset', brandConfig?.activePreset || 'culinaryAtelier');
    }
  }, [brandConfig?.activePreset]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_grid_selected_exp_id', selectedExpId);
    }
  }, [selectedExpId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_grid_selected_courses', JSON.stringify(selectedCourses));
    }
  }, [selectedCourses]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('aura_grid_sommelier_pairing', String(sommelierPairing));
    }
  }, [sommelierPairing]);

  const resetItinerary = () => {
    setSelectedCourses([]);
    setSommelierPairing(false);
    setCurationResult(null);
    setCurationError(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aura_grid_selected_courses');
      localStorage.removeItem('aura_grid_sommelier_pairing');
    }
  };

  // Automatically trigger Chef's Tasting Table when tableside QR mode is active
  useEffect(() => {
    if (isTablesideQR) {
      setSelectedExpId('tasting');
    }
  }, [isTablesideQR]);
  
  // Interactive Seat Reservation Flow
  const [reservedGuests, setReservedGuests] = useState<number>(2);
  const [reservedTime, setReservedTime] = useState<string>('');
  const [isReserved, setIsReserved] = useState<boolean>(false);
  const [reservationName, setReservationName] = useState<string>('');
  const [reservationEmail, setReservationEmail] = useState<string>('');
  
  // Interactive detail inspection sidebar
  const [inspectingDish, setInspectingDish] = useState<Dish | null>(null);

  // Shopify tag guide collapse state for template creators
  const [showTagGuide, setShowTagGuide] = useState<boolean>(false);

  // Background audio simulation
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isTenseMode, setIsTenseMode] = useState<boolean>(false);

  // Find currently active experience of type ExperienceMenu
  const activeExperience = useMemo<ExperienceMenu>(() => {
    const rawExp = CULINARY_EXPERIENCES.find(e => e.id === selectedExpId) || CULINARY_EXPERIENCES[0];
    const mappedCourses: CourseItem[] = rawExp.dishes.map(d => ({
      id: d.id,
      title: d.name,
      name: d.name,
      price: d.price,
      description: d.description,
      tags: d.tags,
      dietary: d.dietary,
      method: d.cookingMethod,
      cookingMethod: d.cookingMethod,
      alignment: d.organicAlignment,
      organicAlignment: d.organicAlignment,
      courseNumber: d.courseNumber,
      imageUrl: d.imageUrl
    }));

    return {
      id: rawExp.id,
      title: rawExp.title,
      tagline: rawExp.subtitle,
      subtitle: rawExp.subtitle,
      description: rawExp.description,
      quote: rawExp.chefQuote,
      chefQuote: rawExp.chefQuote,
      hours: rawExp.schedule,
      schedule: rawExp.schedule,
      timeframe: rawExp.schedule,
      courses: mappedCourses,
      dishes: mappedCourses
    };
  }, [selectedExpId]);

  // Unique list of dietaries across all experiences to populate filter dynamically
  const dietaryFilters = ['All', 'Vegan', 'Non-Dairy', 'Gluten-Free', 'Vegetarian'];

  // Toggle dish in Custom Flight itinerary builder
  const toggleDishSelect = (id: string) => {
    setSelectedCourses(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Reset the customized itinerary flight if current experience changes
  const [curationLoading, setCurationLoading] = useState<boolean>(false);
  const [isCalculatingSensory, setIsCalculatingSensory] = useState<boolean>(false);
  const [curationError, setCurationError] = useState<string | null>(null);
  const [curationResult, setCurationResult] = useState<{
    sensoryNarrative: string;
    pairings: Array<{
      courseId: string;
      courseName: string;
      wineName: string;
      wineDesc: string;
    }>;
    harmonyIndex: number;
    harmonyExplanation: string;
    status?: string;
  } | null>(null);

  const handleExperienceChange = (id: ExperienceId) => {
    setSelectedExpId(id);
    setSelectedCourses([]);
    setReservedTime('');
    setIsReserved(false);
    setCurationResult(null);
    setCurationError(null);
    setIsCalculatingSensory(false);
  };

  const requestSensoryCuration = async () => {
    if (selectedCourses.length === 0) return;
    setCurationLoading(true);
    setIsCalculatingSensory(true);
    setCurationError(null);
    try {
      const selectedList = activeExperience.courses.filter(course => selectedCourses.includes(course.id));
      const res = await fetch('/api/gemini/curate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          experienceTitle: activeExperience.title,
          courses: selectedList
        })
      });
      if (!res.ok) {
        throw new Error('Our vintage cellars failed to return a sensory match. Please try again.');
      }
      const data = await res.json();
      setCurationResult(data);
    } catch (err: any) {
      setCurationError(err.message || 'Curation failed');
    } finally {
      setCurationLoading(false);
      setIsCalculatingSensory(false);
    }
  };

  // Clear curation result if course selections update
  useEffect(() => {
    setCurationResult(null);
  }, [selectedCourses]);

  // Price calculations for interactive flights with explicit initial type casting
  const flightTotals = useMemo(() => {
    const selectedList = activeExperience.courses.filter(course => selectedCourses.includes(course.id));
    const baseSum = selectedList.reduce<number>((acc, item) => acc + item.price, 0);
    const pairingAdded = sommelierPairing ? selectedList.length * 15 : 0;
    return {
      itemsCount: selectedList.length,
      base: baseSum,
      pairing: pairingAdded,
      total: baseSum + pairingAdded
    };
  }, [activeExperience, selectedCourses, sommelierPairing]);

  // Dynamic composition summary calculating average organic alignment and dietary alignment features of course items
  const compositionSummary = useMemo(() => {
    const selectedList = activeExperience.courses.filter(course => selectedCourses.includes(course.id));
    if (selectedList.length === 0) {
      return '[ No courses selected yet. Choose your items above to compose your dinner. ]';
    }

    // Extract average organic alignment with boundary safe checks and explicit type casting on reduce
    const alignments = selectedList
      .map(d => d.alignment ? parseInt(d.alignment.replace('%', '')) : null)
      .filter((v): v is number => v !== null && !isNaN(v));
    
    let alignmentStr = '';
    if (alignments.length > 0) {
      const avg = Math.round(alignments.reduce<number>((sum, val) => sum + val, 0) / alignments.length);
      alignmentStr = `${avg}% AVG ORGANIC ALIGNMENT`;
    }

    // Determine dietary trait dominance/conflict
    const hasVegan = selectedList.some(d => d.dietary.includes('Vegan'));
    const hasVegetarian = selectedList.some(d => d.dietary.includes('Vegetarian'));
    const hasMeat = selectedList.some(d => !d.dietary.includes('Vegan') && !d.dietary.includes('Vegetarian'));

    const allVegan = selectedList.every(d => d.dietary.includes('Vegan'));
    const allVegetarian = selectedList.every(d => d.dietary.includes('Vegetarian') || d.dietary.includes('Vegan'));
    const allGlutenFree = selectedList.every(d => d.dietary.includes('Gluten-Free'));
    const allNonDairy = selectedList.every(d => d.dietary.includes('Non-Dairy'));
    const allNutFree = selectedList.every(d => d.dietary.includes('Nut-Free'));

    let dietaryLabel = '';
    if ((hasVegan || hasVegetarian) && hasMeat) {
      dietaryLabel = 'MIXED DIETARY ALLIANCE';
    } else if (allVegan) {
      dietaryLabel = '100% VEGAN';
    } else if (allVegetarian) {
      dietaryLabel = '100% VEGETARIAN';
    } else if (allGlutenFree) {
      dietaryLabel = '100% GLUTEN-FREE';
    } else if (allNonDairy) {
      dietaryLabel = '100% NON-DAIRY';
    } else if (allNutFree) {
      dietaryLabel = '100% NUT-FREE';
    } else {
      dietaryLabel = 'MIXED DIETARY ALLIANCE';
    }

    if (alignmentStr) {
      return `[ CURRENT FLIGHT COMPOSITION: ${dietaryLabel} | ${alignmentStr} ]`;
    } else {
      return `[ CURRENT FLIGHT COMPOSITION: ${dietaryLabel} ]`;
    }
  }, [activeExperience, selectedCourses]);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservationName || !reservationEmail || !reservedTime) return;
    setIsReserved(true);
  };

  // FoodEstablishment and Menu JSON-LD structured data schema markup
  const schemaMarkup = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "FoodEstablishment",
      "name": "The Winter Parlor",
      "image": "https://ais-dev-73sbhowxu6z43w5jw77wit-434044503951.us-east1.run.app/images/parlor_cover.jpg",
      "@id": "https://ais-dev-73sbhowxu6z43w5jw77wit-434044503951.us-east1.run.app/#establishment",
      "url": "https://ais-dev-73sbhowxu6z43w5jw77wit-434044503951.us-east1.run.app",
      "telephone": "+13235550192",
      "priceRange": "$$$$",
      "servesCuisine": "Modern Californian, High-End Artisanal",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "3412 View Park Boulevard",
        "addressLocality": "Los Angeles",
        "addressRegion": "CA",
        "postalCode": "90043",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 34.0150,
        "longitude": -118.3490
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "17:00",
          "closes": "23:00"
        }
      ],
      "hasMenu": {
        "@type": "Menu",
        "name": "Winter Progressive Tasting & Hearth Menu",
        "hasMenuItem": CULINARY_EXPERIENCES.flatMap(exp => 
          exp.dishes.map(dish => ({
            "@type": "MenuItem",
            "name": dish.name,
            "description": dish.description,
            "offers": {
              "@type": "Offer",
              "price": dish.price.toFixed(2),
              "priceCurrency": "USD"
            }
          }))
        )
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-obsidian-950 text-cream-50 font-sans grain-bg overflow-x-hidden selection:bg-cream-100 selection:text-obsidian-950 pb-24 print:bg-white print:text-black print:min-h-0 print:pb-0">
      
      <div className="print:hidden">
        {/* Embedded JSON-LD Search Engine Optimization Schema */}
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
        />
      </div>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-12 md:pt-20 print:pt-0">
        
        {isTablesideQR ? (
          <div className="w-full max-w-2xl mx-auto space-y-12 pb-16 px-0" id="tableside-qr-view">
            {/* Minimalist table anchor banner */}
            <div className="bg-[#0b0c0d] p-6 text-center flex flex-col items-center justify-center space-y-2 border-0">
              <span className="text-[10px] font-mono tracking-widest text-[#A5F3FC]">● LIVE SITTING NODE</span>
              <h2 className="text-sm font-mono uppercase tracking-[0.25em] text-cream-100 italic">
                [ WELCOME TO TABLE 04 — LUNAR SITTING ]
              </h2>
              <p className="text-[9px] font-mono text-stone-muted uppercase tracking-wider">
                {(brandConfig?.conceptName || 'The Winter Parlor').toUpperCase()} // REAL-TIME TABLESIDE PORTAL
              </p>
            </div>

            {/* Elegant Active Experience Header */}
            <div className="space-y-4 text-center">
              <span className="text-[10px] font-mono tracking-[0.3em] text-[#D4AF37] uppercase block mb-1">
                — ACTIVE PROFILE: Chef's Tasting Table —
              </span>
              <h3 className="text-3xl font-serif italic text-cream-100">
                {activeExperience.subtitle}
              </h3>
              <p className="text-xs text-stone-light leading-relaxed font-light max-w-lg mx-auto">
                {activeExperience.description}
              </p>
              <div className="inline-block px-3 py-1 bg-[#101112] text-[#A5F3FC] text-[10px] font-mono tracking-wider">
                [ ALL RE-FILTERS SUSPENDED FOR CONTINUOUS FLIGHT ]
              </div>
            </div>

            {/* Simplified Single Column Dishes List with Zero Borders */}
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-2 border-b border-obsidian-900">
                <span className="text-[10px] font-mono tracking-widest text-stone-muted uppercase">
                  [ BOTANICAL COURSES TO SCROLL ]
                </span>
                <span className="text-[9px] font-mono text-[#D4AF37] uppercase">
                  {activeExperience.dishes.length} FLIGHTS
                </span>
              </div>

              <div className="space-y-4">
                {activeExperience.dishes.map((dish, idx) => {
                  const isSelectedForItinerary = selectedCourses.includes(dish.id);
                  return (
                    <div 
                      key={dish.id}
                      className="bg-[#0b0b0c] p-6 flex flex-col justify-between space-y-4 transition-all hover:bg-[#101011] border-0"
                    >
                      <div>
                        <div className="flex justify-between items-start text-[10px] font-mono">
                          <span className="text-stone-dark tracking-wider">
                            {dish.courseNumber || `COURSE 0${idx + 1}`}
                          </span>
                          
                          {/* Tags */}
                          <div className="flex gap-2">
                            {dish.dietary.map((d) => (
                              <span key={d} className="text-[9px] text-[#D4AF37] tracking-wider uppercase">
                                [{d}]
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3 flex justify-between items-baseline">
                          <h4 className="text-xl font-serif text-cream-100 italic">
                            {dish.name}
                          </h4>
                          <span className="text-sm font-mono text-[#D4AF37] ml-2">
                            ${dish.price}
                          </span>
                        </div>

                        {/* Scent note or details inline */}
                        {(dish.cookingMethod || dish.organicAlignment || dish.method || dish.alignment) && (
                          <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-mono text-stone-muted uppercase">
                            {(dish.cookingMethod || dish.method) && (
                              <span>[ FIRE: {String(dish.cookingMethod || dish.method)} ]</span>
                            )}
                            {(dish.organicAlignment || dish.alignment) && (
                              <span className="text-cream-200">[ PURE: {String(dish.organicAlignment || dish.alignment)} ]</span>
                            )}
                          </div>
                        )}

                        <p className="mt-3 text-xs text-stone-light font-light leading-relaxed">
                          {dish.description}
                        </p>
                      </div>

                      {/* Bottom course actions (Tableside quick triggers) */}
                      <div className="pt-3 border-t border-obsidian-900/60 flex justify-between items-center text-[10px] font-mono">
                        <button
                          onClick={() => setInspectingDish(dish)}
                          className="text-[#A5F3FC] hover:text-white transition-colors cursor-pointer"
                        >
                          [[ VIEW SOIL RECORD ]]
                        </button>
                        <button
                          onClick={() => toggleDishSelect(dish.id)}
                          className={`px-3 py-1 transition-all cursor-pointer ${
                            isSelectedForItinerary 
                              ? 'bg-cream-100 text-obsidian-950 font-semibold' 
                              : 'text-stone-light hover:text-white bg-[#151617]'
                          }`}
                        >
                          {isSelectedForItinerary ? '[[ X ]] COMPOSING' : '[[ + ]] SELECT'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Interactive Composed Ticket Summary */}
            <div className="bg-[#0e0f10] p-6 text-cream-50 space-y-6 border-0">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1">
                  [ TABLE 04 SITTED BILL TICKET ]
                </span>
                <h4 className="text-xl font-serif italic text-cream-100">
                  Your Customized Sitting Flight
                </h4>
                <p className="text-[11px] text-stone-light font-light leading-relaxed mt-1">
                  Review your selection below. Tapping a course above live-updates your table ticket composition.
                </p>
              </div>

              {/* Summary line */}
              <div className="text-[10px] text-[#A5F3FC]/90 tracking-widest leading-relaxed font-mono uppercase">
                {compositionSummary}
              </div>

              {selectedCourses.length === 0 ? (
                <div className="py-6 text-center bg-[#070708]">
                  <p className="text-xs font-mono text-stone-muted uppercase mb-2">
                    No courses chosen yet
                  </p>
                  <button 
                    onClick={() => setSelectedCourses(activeExperience.dishes.map(d => d.id))}
                    className="text-xs font-mono uppercase text-cream-200 hover:text-cream-100 underline cursor-pointer"
                  >
                    Select Full Tasting Flight ({activeExperience.dishes.length} Items)
                  </button>
                </div>
              ) : (
                <div className="space-y-4 font-mono text-xs">
                  <div className="space-y-2 border-t border-[#1a1b1c] pt-3">
                    {activeExperience.dishes.filter(d => selectedCourses.includes(d.id)).map(dish => (
                      <div key={dish.id} className="flex justify-between items-baseline text-stone-light">
                        <span className="truncate max-w-[200px]">{dish.name}</span>
                        <span className="text-stone-muted flex-grow border-b border-dotted border-[#1a1b1c] mx-2"></span>
                        <span>${dish.price}</span>
                      </div>
                    ))}

                    {sommelierPairing && (
                      <div className="flex justify-between items-baseline text-stone-light pt-1">
                        <span>Pairings ({selectedCourses.length}x)</span>
                        <span className="text-stone-muted flex-grow border-b border-dotted border-[#1a1b1c] mx-2"></span>
                        <span>${selectedCourses.length * 15}</span>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-[#1a1b1c] pt-3 flex justify-between items-baseline text-sm font-serif text-cream-100 font-bold">
                    <span>Estimated Total:</span>
                    <span>${flightTotals.total}</span>
                  </div>

                  {/* Quick Sommelier Toggler */}
                  <div className="pt-2">
                    <button
                      onClick={() => setSommelierPairing(!sommelierPairing)}
                      className="text-[10px] tracking-widest uppercase text-[#D4AF37] hover:text-cream-100 cursor-pointer"
                    >
                      {sommelierPairing ? '[[ X ]] BIODYNAMIC SOMMELIER ACTIVE' : '[[   ]] ADD SOMMELIER BIO-PAIRINGS (+$15/course)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Real-time Order transmission simulation */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    alert("Tableside sitting ticket successfully transmitted to The Winter Parlor kitchen.");
                  }}
                  disabled={selectedCourses.length === 0}
                  className="w-full py-4 text-center bg-cream-50 text-obsidian-950 font-mono uppercase text-xs font-semibold tracking-widest hover:bg-cream-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Transmit Composition to Kitchen
                </button>
              </div>
            </div>

            {/* Micro Table alignment and back option */}
            <div className="text-center pt-4">
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  setIsTablesideQR(false);
                }}
                className="text-[10px] font-mono tracking-widest text-[#D4AF37] hover:text-cream-100 uppercase cursor-pointer"
              >
                [[ EXIT TABLESIDE VIEW & GO TO RESERVATION FORM ]]
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Pure Masthead */}
            <div className="text-center space-y-6 md:space-y-8 mb-24 pt-10 md:pt-16 select-none print:hidden">
              <span className="text-stone-400 text-xs uppercase tracking-[0.35em] font-mono font-medium block">
                AURA & GRID
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic text-cream-100 tracking-tightest leading-relaxed">
                {brandConfig?.conceptName || 'The Winter Parlor'}
              </h1>
              <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-200 font-semibold leading-relaxed tracking-wide px-4">
                {(PRESETS[brandConfig?.activePreset || 'culinaryAtelier'] || PRESETS.culinaryAtelier).tagline}
              </p>
              
              {/* Call To Action Row */}
              <div className="flex justify-center items-center gap-6 pt-6 text-xs md:text-sm font-mono tracking-[0.25em] text-[#D4AF37]">
                <button
                  onClick={() => scrollToSection('sitting-layout-section')}
                  className="font-semibold hover:text-cream-100 transition-colors uppercase cursor-pointer"
                >
                  VIEW MENU
                </button>
                <span className="text-[#a8820c]/50 font-mono text-xs select-none px-1">•</span>
                <button
                  onClick={() => scrollToSection('reservation-desk')}
                  className="font-semibold hover:text-cream-100 transition-colors uppercase cursor-pointer"
                >
                  BOOK TASTING
                </button>
              </div>
              
              {/* Low-Contrast Status */}
              <p className="text-[11px] md:text-xs font-mono tracking-widest text-stone-400 uppercase pt-4 block font-semibold">
                LIMITED ENGAGEMENT — 3 SITTINGS REMAINING THIS INTERVAL
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
              {/* LEFT COLUMN: Sticky Brand Headline & Establishment Configurations (01 - ESTABLISH EXPERIENCE) */}
              <div className="lg:col-span-4 lg:sticky lg:top-8 lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto no-scrollbar space-y-8 lg:space-y-12 pb-8 lg:pr-8 border-stone-dark/0 lg:border-r-[0.5px] lg:border-stone-dark/30 print:border-none print:max-h-none print:overflow-visible pr-0">
                
                {/* Micro Live Table Tracker */}
                <div className="p-5 bg-[#0e0e0d] border-[0.5px] border-stone-dark/30 relative flex flex-col justify-between rounded-none shadow-none outline-none">
                <div>
                  <div className="flex justify-between items-center text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mb-4">
                    <span>[ HARVEST INDEX ]</span>
                    <span className="text-[#A5F3FC]">● ACTIVE</span>
                  </div>
                  <p className="text-xs sm:text-sm font-mono text-cream-200 uppercase tracking-wider mb-2 font-semibold">
                    ORGANIC ALIGNMENT: 98%
                  </p>
                  <p className="text-stone-200 text-xs sm:text-sm font-medium leading-relaxed mb-4">
                    Today, oats are being wood-milled, elderberry vinegar is at peak sourness, and wild chanterelles have successfully arrived from the high slopes.
                  </p>
                </div>
                <div className="border-t-[0.5px] border-stone-dark/30 pt-3 flex justify-between items-center text-[10px] font-mono">
                  <span className="text-stone-muted">CURATOR:</span>
                  <span className="text-cream-100 uppercase tracking-widest">MARCUS VANCE</span>
                </div>
              </div>

            {/* SECTION HEADER: Experience Navigation Tabs (Interactive Switcher) */}
            <div className="border-t-[0.5px] border-b-[0.5px] border-stone-dark/30 py-6">
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] font-mono tracking-editorial text-stone-muted uppercase block mb-1">
                    01 — ESTABLISH EXPERIENCE
                  </span>
                  <h2 className="text-lg font-serif text-cream-200 italic">
                    Choose weekly menu itinerary
                  </h2>
                </div>
                
                {/* Minimal Switcher Tabs */}
                <div className="flex flex-col gap-2 w-full" id="experience-tabs">
                  {(['tasting', 'brunch', 'friday'] as ExperienceId[]).map((id, index) => {
                    const isActive = selectedExpId === id;
                    const exp = CULINARY_EXPERIENCES.find(e => e.id === id)!;
                    return (
                      <button
                        key={id}
                        onClick={() => handleExperienceChange(id)}
                        className={`relative px-4 py-3.5 border-[0.5px] rounded-none shadow-none outline-none transition-all duration-300 text-left w-full cursor-pointer group ${
                          isActive 
                            ? 'border-stone-dark/50 bg-cream-100 text-obsidian-950 shadow-none' 
                            : 'border-stone-dark/20 bg-transparent text-stone-muted hover:text-cream-100 hover:bg-[#141413]'
                        }`}
                      >
                        <span className={`text-[9px] font-mono block mb-1 uppercase tracking-widest ${
                          isActive ? 'text-stone-dark' : 'text-stone-muted'
                        }`}>
                          0{index + 1} // WEEKLY {isActive ? '[ ACTIVE ]' : '[ SELECT ]'}
                        </span>
                        <span className="text-xs font-serif italic block font-semibold">
                          {exp.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ACTIVE EXPERIENCE SUMMARY & TEXT DIETARY FILTER */}
            <div className="space-y-6 pt-2">
              <div>
                <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#D4AF37] uppercase block mb-1 font-semibold">
                  [ {activeExperience.schedule} ]
                </span>
                <h3 className="text-2xl font-serif text-cream-100 italic mb-3">
                  {activeExperience.subtitle}
                </h3>
                <p className="text-sm md:text-base text-stone-200 leading-relaxed font-medium mb-4 text-justify">
                  {activeExperience.description}
                </p>
                <p className="text-xs sm:text-sm font-serif text-stone-300 italic border-l-2 border-[#D4AF37]/50 pl-4 py-1.5 leading-relaxed">
                  {selectedExpId === 'tasting' ? `“${(PRESETS[brandConfig?.activePreset || 'culinaryAtelier'] || PRESETS.culinaryAtelier).ethos}”` : activeExperience.chefQuote}
                </p>
              </div>

              {/* Interactive Dietary Micro-Filters */}
              <div className="bg-obsidian-900 border-[0.5px] border-stone-dark/45 p-5">
                <span className="text-[10px] font-mono tracking-widest text-stone-300 uppercase block mb-3 font-semibold">
                  DIETARY SELECTION & ALIGNMENT
                </span>
                <p className="text-xs md:text-sm text-stone-200 font-medium mb-4 leading-relaxed">
                  Select an option below to highlight matching courses on our print layout. Items that do not match are elegantly muted to sustain aesthetic integrity.
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs font-mono font-medium" id="dietary-filters">
                  {dietaryFilters.map((diet) => {
                    const isSelected = selectedDietary === diet;
                    return (
                      <button
                        key={diet}
                        onClick={() => setSelectedDietary(diet)}
                        className={`px-3 py-1.5 transition-all cursor-pointer rounded-none shadow-none outline-none border-[0.5px] uppercase tracking-wider font-semibold ${
                          isSelected 
                            ? 'text-obsidian-950 bg-cream-100 border-cream-100' 
                            : 'text-stone-200 hover:text-cream-100 hover:bg-[#111110] border-stone-dark/50'
                        }`}
                      >
                        {isSelected ? `[ X ] ${diet}` : `[   ] ${diet}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Scrolling Courses, Interactive Flight Builder, and Reservation Desk */}
          <div className="lg:col-span-8 space-y-16 lg:space-y-24 lg:pl-4 print:w-full">
            
            {/* 02 — THE WINTER SITTING LAYOUT */}
            <div id="sitting-layout-section">
              <div className="flex justify-between items-center border-b-[0.5px] border-stone-dark/30 pb-3 mb-8">
                <span className="text-[10px] font-mono tracking-editorial text-stone-muted uppercase">
                  02 — THE WINTER SITTING LAYOUT
                </span>
                <span className="text-[11px] font-serif italic text-stone-muted hidden sm:inline">
                  Click course names or [[ SELECT ]] to customize Sitting flight
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8" id="dishes-list">
                <AnimatePresence>
                  {activeExperience.dishes.map((dish, idx) => {
                    const colSpanClass = 'lg:col-span-6'; // fit perfectly inside our column
                    
                    const matchesFilter = selectedDietary === 'All' || 
                      dish.dietary.some(d => 
                        d.toLowerCase() === selectedDietary.toLowerCase() || 
                        d.toLowerCase().replace('-', ' ') === selectedDietary.toLowerCase().replace('-', ' ')
                      );
                    
                    const isSelectedForItinerary = selectedCourses.includes(dish.id);

                    return (
                      <motion.div
                        key={dish.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ 
                          opacity: matchesFilter ? 1 : 0.35, 
                          y: 0,
                          scale: matchesFilter ? 1 : 0.98
                        }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                        className={`${colSpanClass} group relative rounded-none shadow-none outline-none border-[0.5px] border-stone-dark/30 transition-all duration-300 ease-in-out flex flex-col lg:flex-row justify-between overflow-hidden ${
                          isSelectedForItinerary 
                            ? 'border-stone-dark/50 bg-stone-900/40' 
                            : 'border-stone-dark/20 bg-[#0E0E0E] hover:bg-[#121211]'
                        }`}
                      >
                        {/* Text Content and Controls */}
                        <div className="p-6 flex-1 flex flex-col justify-between">
                          <div>
                            {/* 1. Course Index */}
                            <div className="text-stone-dark text-[10px] font-mono uppercase tracking-widest mb-2">
                              {dish.courseNumber || `Item 0${idx + 1}`}
                            </div>
     
                            {/* 2. Title */}
                            <button
                              onClick={() => toggleDishSelect(dish.id)}
                              className="text-left w-full focus:outline-none cursor-pointer group mb-2"
                            >
                              <h4 className="text-2xl font-serif text-cream-100 group-hover:text-cream-200 transition-colors uppercase">
                                {dish.name}
                              </h4>
                            </button>
     
                            {/* 3. Supporting Tag */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {/* Unified base tags */}
                              {dish.tags.map((tag) => (
                                <span key={tag} className="text-[9px] text-[#D4AF37] tracking-wider uppercase font-mono bg-obsidian-950 px-2 py-0.5 rounded-none border-[0.5px] border-stone-dark/30 shadow-none outline-none select-none">
                                  [{tag}]
                                </span>
                              ))}
                              {/* Display cooking method directly */}
                              {dish.cookingMethod && (
                                <span className="text-cream-200 bg-[#141413] px-2 py-0.5 rounded-none border-[0.5px] border-stone-dark/20 text-[9px] font-mono uppercase tracking-widest select-none">
                                  [ {String(dish.cookingMethod || dish.method).toUpperCase()} ]
                                </span>
                              )}
                              {/* Display organic alignment directly */}
                              {dish.organicAlignment && (
                                <span className="text-cream-100 bg-[#141413] px-2 py-0.5 rounded-none border-[0.5px] border-stone-dark/20 text-[9px] font-mono uppercase tracking-widest select-none">
                                  [ {String(dish.organicAlignment || dish.alignment).toUpperCase()} ]
                                </span>
                              )}
                            </div>
     
                            {/* 4. Description */}
                            <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed max-w-lg mb-4">
                              {dish.description}
                            </p>
                          </div>
     
                          <div>
                            {/* 5. Price and dietary info grouped closely */}
                            <div className="border-t-[0.5px] border-stone-dark/30 pt-4 mt-4 flex items-center gap-4">
                              <span className="text-base font-serif text-cream-200">
                                ${dish.price}
                              </span>
                              <div className="flex gap-1.5">
                                {dish.dietary.map(d => (
                                  <span key={d} className="text-[9px] font-mono text-stone-muted uppercase">
                                    [{d}]
                                  </span>
                                ))}
                              </div>
                            </div>
     
                            {/* 6. Selection Anchor */}
                            <div className="flex gap-2 text-xs font-mono mt-4 justify-between items-center">
                              <button
                                onClick={() => setInspectingDish(dish)}
                                className="text-stone-muted hover:text-cream-100 transition-all duration-300 hover:tracking-widest uppercase tracking-widest text-[10px] rounded-none shadow-none outline-none cursor-pointer"
                              >
                                [[ SCENT & SOIL NOTE ]]
                              </button>
                              <button
                                onClick={() => toggleDishSelect(dish.id)}
                                className={`text-[10px] tracking-widest uppercase transition-all duration-300 px-3 py-1 rounded-none shadow-none outline-none border-[0.5px] ${
                                  isSelectedForItinerary 
                                    ? 'border-cream-100 bg-cream-100 text-obsidian-950 font-medium' 
                                    : 'border-stone-dark/30 text-stone-muted hover:text-cream-100 hover:bg-[#141413]'
                                }`}
                              >
                                {isSelectedForItinerary ? '[[ X ]] ADDED' : '[[   ]] SELECT'}
                              </button>
                            </div>
                          </div>
                        </div>
 
                        {/* 7. Asymmetrical Image */}
                        {dish.imageUrl && (
                          <div className="w-full lg:w-48 h-64 lg:h-auto relative overflow-hidden bg-[#0A0A09] border-t-[0.5px] lg:border-t-0 lg:border-l-[0.5px] border-stone-dark/30 rounded-none shadow-none flex-shrink-0">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2 opacity-60">
                              <Sparkles className="text-stone-dark stroke-[1px] mb-1" size={14} />
                              <span className="text-[8px] font-mono tracking-widest text-[#D4AF37]/80 uppercase">[ {dish.name} IMAGE ]</span>
                            </div>
                            <DishImage
                              imageUrl={dish.imageUrl}
                              name={dish.name}
                              className="w-full h-full object-cover grayscale brightness-95 group-hover:grayscale-0 group-hover:scale-105 ease-in-out z-10 relative"
                            />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>

            {/* Elegant separation line with low-vibrancy microheading for spacing balance */}
            <div className="py-10 lg:py-14 flex items-center justify-center select-none">
              <div className="h-[0.5px] w-1/4 bg-stone-dark/20" />
              <div className="mx-4 text-[9px] font-mono tracking-[0.3em] text-stone-muted/50 uppercase">[ COMPENDIUM SITTING BUILDER ]</div>
              <div className="h-[0.5px] w-1/4 bg-stone-dark/20" />
            </div>

            {/* INTERACTIVE FLIGHT BUILDER & DYNAMIC CALCULATOR */}
            <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 border-[0.5px] border-stone-dark/30 rounded-none shadow-none p-8 md:p-12 transition-all duration-300 ease-in-out ${
              sommelierPairing ? 'bg-stone-900/40' : 'bg-obsidian-900'
            }`}>
              
              <div className="lg:col-span-7">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-[10px] font-mono tracking-editorial text-stone-muted uppercase block">
                    03 — INTERACTIVE CUSTOM SITTING BUILDER
                  </span>
                  <button
                    type="button"
                    onClick={resetItinerary}
                    className="text-[9px] font-mono tracking-[0.25em] text-cream-200/60 hover:text-cream-100 transition-all uppercase cursor-pointer bg-transparent border-none p-0 outline-none"
                  >
                    [[ RESET ITINERARY ]]
                  </button>
                </div>
                <h3 className="text-3xl font-serif text-cream-100 italic mb-4">
                  Build your tasting menu
                </h3>
                <p className="text-base md:text-lg text-stone-200 font-semibold leading-relaxed mb-6">
                  Toggle specific dishes by selecting them above. Build a custom composition aligning with your dietary, timing, or conceptual appetite. 
                </p>

                {/* Customizer Option Toggles */}
                <div className="space-y-4 border-t-[0.5px] border-stone-dark/30 pt-6">
                  <button
                    type="button"
                    onClick={() => setSommelierPairing(!sommelierPairing)}
                    className="flex items-start gap-4 text-left cursor-pointer group focus:outline-none focus:ring-0 active:outline-none select-none rounded-none shadow-none"
                  >
                    <div className="font-mono text-sm tracking-widest text-[#D4AF37] select-none shrink-0 transition-transform duration-300 group-hover:scale-105 font-bold">
                      {sommelierPairing ? '[ X ]' : '[   ]'}
                    </div>
                    <div>
                      <span className="text-sm font-mono uppercase tracking-wider text-cream-100 block transition-all duration-300 group-hover:tracking-[0.11em] group-hover:text-cream-50 font-semibold">
                        {sommelierPairing ? '[ PAIRINGS ACTIVE ]' : '[ INCLUDE SOMMELIER BIODYNAMIC PAIRINGS ]'} (+ $15 per course)
                      </span>
                      <span className="text-xs md:text-sm text-stone-300 font-semibold block mt-1 leading-relaxed">
                        Aligns every organic dish with cellared wild ferments, low-intervention pet-nats, or unreleased vintage port.
                      </span>
                    </div>
                  </button>

                  {/* AI Sensory Curation & Sommelier Journey Trigger */}
                  <div className="mt-8 pt-6 border-t-[0.5px] border-stone-dark/30">
                    <div className="flex items-center gap-2 mb-4 select-none">
                      <Sparkles className="text-cream-200/60 w-3.5 h-3.5 shrink-0" />
                      <span className="text-[10px] md:text-xs font-mono tracking-[0.25em] text-cream-200/80 uppercase font-semibold">Premium AI sensory add-on</span>
                    </div>
                    
                    {selectedCourses.length === 0 ? (
                      <p className="text-[10px] md:text-xs font-mono tracking-[0.2em] text-cream-200/60 uppercase font-semibold">
                        [ SELECT ONE OR MORE COURSES ABOVE TO PREVIEW SOMMELIER FLIGHT ]
                      </p>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-sm md:text-base text-stone-200 font-medium leading-relaxed">
                          Request an integrated sensory description and specific biodynamic stellar pairings tailored directly by our digital Sommelier.
                        </p>
                        <button
                          type="button"
                          onClick={requestSensoryCuration}
                          disabled={curationLoading}
                          className="px-5 py-2.5 bg-[#141413] border border-stone-dark/30 hover:border-[#D4AF37]/60 hover:bg-[#1c1c1b] text-cream-200/80 hover:text-cream-100 transition-all text-xs font-mono uppercase tracking-[0.2em] rounded-none shadow-none outline-none cursor-pointer disabled:opacity-50 font-semibold"
                        >
                          {curationLoading ? '⟳ RECONSTRUCTING SENSORY MAPS...' : '✦ GENERATE SENSORY NARRATIVE'}
                        </button>
                        
                        {curationError && (
                          <p className="text-sm text-red-400 font-mono font-medium">
                            ✕ {curationError}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing Calculation Bill-Of-Fare Column */}
              <div className="lg:col-span-5 border-t-[0.5px] lg:border-t-0 lg:border-l-[0.5px] border-stone-dark/30 pt-8 lg:pt-0 lg:pl-12 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-4">
                    [ THE COMPOSITION BILL ]
                  </span>

                  <div className="mb-4 tracking-widest text-[#A5F3FC]/90 text-[11px] font-mono uppercase leading-relaxed">
                    {compositionSummary}
                  </div>

                  {flightTotals.itemsCount === 0 ? (
                    <div className="py-8 text-center border-[0.5px] border-dashed border-stone-dark/30 rounded-none shadow-none">
                      <p className="text-xs font-mono text-stone-muted uppercase">
                        No dishes selected
                      </p>
                      <p className="text-xs text-stone-muted font-light mt-1">
                        Select courses above to begin composing.
                      </p>
                      <button 
                        onClick={() => setSelectedCourses(activeExperience.dishes.map(d => d.id))}
                        className="mt-4 text-xs font-mono uppercase text-cream-200 hover:text-cream-100 hover:tracking-[0.13em] transition-all duration-300 underline decoration-stone-dark cursor-pointer rounded-none shadow-none outline-none"
                      >
                        Load Full Experience ({activeExperience.dishes.length} Items)
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 font-mono text-xs">
                      {activeExperience.dishes.filter(d => selectedCourses.includes(d.id)).map(dish => (
                        <div key={dish.id} className="flex justify-between items-baseline text-stone-light">
                          <span className="truncate max-w-[240px]">{dish.name}</span>
                          <span className="text-stone-muted shrink-0 border-b-[0.5px] border-dotted border-stone-dark/30 flex-grow mx-2"></span>
                          <span className="text-cream-100 text-right">${dish.price}</span>
                        </div>
                      ))}

                      {sommelierPairing && (
                        <div className="flex justify-between items-baseline text-stone-light pt-2">
                          <span>Wine Pairing ({flightTotals.itemsCount}x)</span>
                          <span className="text-stone-muted shrink-0 border-b-[0.5px] border-dotted border-stone-dark/30 flex-grow mx-2"></span>
                          <span className="text-cream-100 text-right">${flightTotals.pairing}</span>
                        </div>
                      )}

                      <div className="border-t-[0.5px] border-stone-dark/30 pt-3 mt-4 flex justify-between items-baseline text-sm font-serif">
                        <span className="text-cream-100">Estimated Total:</span>
                        <span className="text-cream-100 font-bold">${flightTotals.total}</span>
                      </div>
                      <p className="text-[9px] text-stone-muted leading-relaxed uppercase mt-2">
                        *Excludes local sales taxes and a standard 18% culinary operational service charge.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <a 
                    href="#reservation-desk"
                    className="w-full py-4 bg-cream-50 text-obsidian-950 font-mono uppercase text-xs tracking-widest font-semibold hover:bg-cream-100 transition-colors flex justify-center items-center gap-2 text-center"
                  >
                    Proceed to Reservation Desk <ArrowRight size={14} />
                  </a>
                </div>
              </div>

            </div>

            {/* AI SENSORY ANALYSIS & SOMMELIER JOURNEY OUTCOME */}
            <AnimatePresence>
              {(isCalculatingSensory || curationResult) && (
                <motion.div
                  key="sensory-outcome"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="border-[0.5px] border-t-0 border-stone-dark/30 bg-[#0c0c0b] p-8 md:p-12 relative overflow-hidden"
                >
                  {isCalculatingSensory ? (
                    <motion.div
                      animate={{ opacity: [0.2, 0.5, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="space-y-8"
                    >
                      {/* Skeletal Header */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-stone-dark/20 pb-4 gap-4">
                        <div className="space-y-2 w-full md:w-1/2">
                          <div className="h-2 w-24 bg-stone-500/25 rounded-none" />
                          <div className="h-5 w-48 bg-stone-500/15 rounded-none" />
                        </div>
                        <div className="h-6 w-32 bg-stone-500/20 rounded-none border-[0.5px] border-stone-dark/20" />
                      </div>

                      {/* Skeletal Two Columns */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 text-left">
                        {/* Skeletal Col 1: Poetic Narrative Essay */}
                        <div className="lg:col-span-6 space-y-4">
                          <div className="h-2 w-32 bg-stone-500/20 rounded-none" />
                          <div className="space-y-2">
                            <div className="h-3 w-full bg-stone-900/30 border-[0.5px] border-stone-dark/20 rounded-none" />
                            <div className="h-3 w-[94%] bg-stone-900/30 border-[0.5px] border-stone-dark/20 rounded-none" />
                            <div className="h-3 w-[88%] bg-stone-900/30 border-[0.5px] border-stone-dark/20 rounded-none" />
                            <div className="h-3 w-[91%] bg-stone-900/30 border-[0.5px] border-stone-dark/20 rounded-none" />
                          </div>
                          <div className="bg-[#141413] border-[0.5px] border-stone-dark/20 p-4 space-y-2 rounded-none">
                            <div className="h-2 w-20 bg-[#D4AF37]/20 rounded-none" />
                            <div className="h-3 w-[80%] bg-stone-500/10 rounded-none" />
                          </div>
                        </div>

                        {/* Skeletal Col 2: Wine Matches */}
                        <div className="lg:col-span-6 space-y-4">
                          <div className="h-2 w-40 bg-[#D4AF37]/25 rounded-none" />
                          <div className="space-y-5">
                            {[1, 2, 3].map((n) => (
                              <div key={n} className="border-l border-stone-muted/10 pl-4 space-y-2">
                                <div className="h-2 w-16 bg-stone-500/15 rounded-none" />
                                <div className="h-3.5 w-32 bg-stone-900/40 border-[0.5px] border-stone-dark/25 rounded-none" />
                                <div className="h-2 w-[85%] bg-stone-500/10 rounded-none" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : curationResult ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="space-y-8"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline border-b border-stone-dark/20 pb-4 gap-4">
                        <div>
                          <span className="text-[9px] font-mono tracking-[0.25em] text-[#D4AF37]/90 uppercase block mb-1">
                            03.B — EXPERT AIS SOMMELIER & SENSORY OUTCOME
                          </span>
                          <h4 className="text-2xl font-serif italic text-cream-100">
                            The Narrative of Your Selected Flight
                          </h4>
                        </div>
                        <div className="flex items-center gap-3 font-mono text-[10px]">
                          <span className="text-stone-muted tracking-widest">GASTRONOMIC SYNERGY:</span>
                          <span className="text-[#D4AF37] font-bold tracking-widest bg-stone-900 border-[0.5px] border-[#D4AF37]/30 px-2.5 py-1">
                            {curationResult.harmonyIndex}%
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
                        {/* Column 1: Poetic Narrative Essay */}
                        <div className="lg:col-span-6 space-y-4 text-left">
                          <p className="text-[10px] md:text-xs font-mono text-stone-400 uppercase tracking-[0.25em] block font-semibold">
                            [ FLAVOR PROGRESSION NARRATIVE ]
                          </p>
                          <p className="text-base sm:text-lg lg:text-xl font-medium text-cream-100 font-serif italic leading-relaxed">
                            "{curationResult.sensoryNarrative}"
                          </p>
                          <div className="bg-[#141413] border-[0.5px] border-stone-dark/20 p-5 font-mono text-xs md:text-sm text-stone-300 uppercase tracking-[0.15em] leading-relaxed rounded-none font-medium">
                            <span className="text-cream-100 block mb-1 font-bold">✦ SOMMELIER HYPOTHESIS:</span>
                            {curationResult.harmonyExplanation}
                          </div>
                        </div>

                        {/* Column 2: Specific wine/sake pairings */}
                        <div className="lg:col-span-6 space-y-4 text-left">
                          <p className="text-[10px] md:text-xs font-mono text-cream-200/80 uppercase tracking-[0.25em] block font-semibold">
                            [ CUSTOM BIODYNAMIC VINTAGE MATCHES ]
                          </p>
                          <div className="space-y-5">
                            {curationResult.pairings.map((p, index) => (
                              <div key={index} className="border-l-[0.5px] border-stone-muted/20 pl-4 space-y-1">
                                <span className="text-[10px] md:text-xs font-mono text-stone-400 uppercase tracking-widest block font-medium">
                                  {p.courseName}
                                </span>
                                <h5 className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-[#A5F3FC] font-semibold">
                                  {p.wineName}
                                </h5>
                                <p className="text-xs md:text-sm text-stone-200 font-medium leading-relaxed">
                                  {p.wineDesc}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESERVATION STEP: SECURE ENTRY DESK */}
            <section id="reservation-desk" className="pt-8">
              <div className="border-t border-obsidian-800 pt-12">
                <div className="text-center max-w-xl mx-auto mb-12">
                  <span className="text-[10px] font-mono tracking-editorial text-stone-muted uppercase block mb-2">
                    04 — RESERVATIONS
                  </span>
                  <h3 className="text-4xl font-serif text-cream-100 italic">
                    Request Your Table Sitting
                  </h3>
                  <p className="text-xs text-stone-light font-light leading-relaxed mt-3">
                    Sitting capacity is strictly held to 12 seats per interval to honor culinary peace. Completing this reservation allocates your customized menu composition.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto bg-obsidian-900 border border-obsidian-800 p-8 md:p-12 relative">
                  <AnimatePresence mode="wait">
                    {!isReserved ? (
                      <motion.form
                        key="booking-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onSubmit={handleBookingSubmit}
                        className="space-y-6"
                      >
                        
                        {/* Visual Sitting Time Slot Selection */}
                        <div className="space-y-3">
                          <label className="block text-xs font-mono uppercase tracking-wider text-stone-light">
                            Select Available Sitting Hour
                          </label>
                          <div className="grid grid-cols-2 gap-3" id="sitting-times">
                            {[
                              { time: '18:00', seatsLeft: 4, label: 'Early Dusk Sitting' },
                              { time: '20:30', seatsLeft: 2, label: 'Late Candlelit Sitting' }
                            ].map((slot) => (
                              <button
                                key={slot.time}
                                type="button"
                                onClick={() => setReservedTime(slot.time)}
                                className={`p-4 border-[0.5px] rounded-none shadow-none outline-none text-left flex flex-col justify-between transition-all cursor-pointer ${
                                  reservedTime === slot.time 
                                    ? 'border-stone-dark/50 bg-cream-100 text-obsidian-950' 
                                    : 'border-stone-dark/30 bg-transparent text-stone-muted hover:text-cream-100 hover:bg-[#141413]'
                                }`}
                              >
                                <span className={`text-lg font-serif italic ${reservedTime === slot.time ? 'text-obsidian-950 font-semibold' : 'text-cream-200'}`}>
                                  {slot.time}
                                </span>
                                <span className={`text-[10px] font-mono mt-2 block ${reservedTime === slot.time ? 'text-stone-dark' : 'text-stone-muted'}`}>
                                  {slot.label} / {slot.seatsLeft} SEATS LEFT
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Guests selector */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-stone-light">
                              Guests Count
                            </label>
                            <select 
                              value={reservedGuests}
                              onChange={(e) => setReservedGuests(Number(e.target.value))}
                              className="w-full bg-obsidian-950 border-[0.5px] border-stone-dark/30 p-3 text-xs font-mono text-cream-100 uppercase tracking-wide focus:border-stone-muted focus:ring-0 rounded-none shadow-none outline-none cursor-pointer"
                            >
                              <option value="1">1 Guest</option>
                              <option value="2">2 Guests</option>
                              <option value="4">4 Guests</option>
                              <option value="6">6 Guests</option>
                            </select>
                          </div>

                          {/* Associated menu flight view */}
                          <div className="space-y-1.5 bg-[#0A0A09] border-[0.5px] border-stone-dark/30 p-3 flex flex-col justify-center rounded-none shadow-none outline-none">
                            <span className="text-[9px] font-mono tracking-wider text-stone-muted uppercase">
                              Menu Alignment:
                            </span>
                            <span className="text-xs font-serif italic text-cream-100">
                              {activeExperience.title}
                            </span>
                            <span className="text-[9px] font-mono text-stone-muted mt-1">
                              {flightTotals.itemsCount > 0 
                                ? `${flightTotals.itemsCount} Custom courses selected` 
                                : 'Full experience curated selection'}
                            </span>
                          </div>
                        </div>

                        {/* Client contact info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-stone-muted">
                              Client full name
                            </label>
                            <input 
                              type="text" 
                              required
                              value={reservationName}
                              onChange={(e) => setReservationName(e.target.value)}
                              placeholder="e.g. Alister Sterling"
                              className="w-full bg-obsidian-950 border-[0.5px] border-stone-dark/30 p-3 text-xs text-cream-100 placeholder:text-stone-dark focus:border-stone-muted focus:ring-0 rounded-none shadow-none outline-none"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-xs font-mono uppercase tracking-wider text-[#A5F3FC]">
                              Secure notify email
                            </label>
                            <input 
                              type="email" 
                              required
                              value={reservationEmail}
                              onChange={(e) => setReservationEmail(e.target.value)}
                              placeholder="e.g. alister@sterling.luxury"
                              className="w-full bg-obsidian-950 border-[0.5px] border-stone-dark/30 p-3 text-xs text-cream-100 placeholder:text-stone-dark focus:border-stone-muted focus:ring-0 rounded-none shadow-none outline-none"
                            />
                          </div>
                        </div>

                        {/* Submit Invitation */}
                        <div className="pt-4">
                          <button 
                            type="submit"
                            className="w-full py-4 bg-cream-50 text-obsidian-950 font-mono uppercase text-xs tracking-widest font-semibold hover:bg-cream-100 transition-colors uppercase cursor-pointer"
                            id="submit-reservation"
                          >
                            Request Reservation
                          </button>
                        </div>

                      </motion.form>
                    ) : (
                      <motion.div
                        key="booking-success"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center py-12 space-y-6"
                      >
                        <div className="w-12 h-12 border border-cream-100 flex items-center justify-center mx-auto mb-4">
                          <Check className="text-cream-100 stroke-[1.5px]" size={20} />
                        </div>
                        <span className="text-xs font-mono tracking-editorial text-stone-muted uppercase block">
                          TOKEN ALLOCATED: SECURE ENTRY
                        </span>
                        <h4 className="text-3xl font-serif text-cream-100 italic">
                          Sanctuary Awaits
                        </h4>
                        
                        <div className="max-w-md mx-auto bg-obsidian-950 border border-obsidian-800 p-6 text-left font-mono text-xs text-stone-light space-y-3">
                          <div className="flex justify-between">
                            <span className="text-stone-muted">CLIENT:</span>
                            <span className="text-cream-100 uppercase">{reservationName}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-muted">EXPERIENCE:</span>
                            <span className="text-cream-100">{activeExperience.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-muted">SITTING TIME:</span>
                            <span className="text-[#A5F3FC]">{reservedTime} sitting</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-muted">GUESTS AT LEVEL:</span>
                            <span className="text-cream-100">{reservedGuests} Guests</span>
                          </div>
                          <div className="flex justify-between border-t border-obsidian-800 pt-3">
                            <span className="text-stone-muted font-bold text-[9px] tracking-widest">SECURE LINK TOKEN:</span>
                            <span className="text-[#D4AF37] text-[10px]">AURA-{Math.random().toString(36).substring(2, 8).toUpperCase()}</span>
                          </div>
                        </div>

                        <p className="text-sm text-stone-300 max-w-md mx-auto leading-relaxed font-medium">
                          A personalized cryptographic invitation has been dispatched to <span className="text-cream-300 font-semibold">{reservationEmail}</span>. Please verify prior to Thursday dusk sittings.
                        </p>

                        <button
                          type="button"
                          onClick={() => setIsReserved(false)}
                          className="text-xs font-mono text-cream-200 underline hover:text-cream-100 mt-4 cursor-pointer font-bold"
                        >
                          [ Request Another Table Sitting ]
                        </button>
                        
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* BRUTALIST ALIGNMENT DETAILS / ADDITIONAL EDITORIAL LOOKBOOK STATS */}
            <section className="pt-16 border-t border-obsidian-800 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono">
              <div className="space-y-4">
                <span className="text-[#D4AF37] block uppercase tracking-widest text-[10px] font-bold">01 / SOIL INTEGRITY</span>
                <p className="text-stone-200 font-semibold leading-relaxed text-xs sm:text-sm">
                  Every root, stem, flower, and grain matches direct botanical trace coordinate maps. We completely discard standard regional wholesaling, opting instead to support 4 hyper-local small plots.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-[#D4AF37] block uppercase tracking-widest text-[10px] font-bold">02 / TEMPERATURE & WOOD</span>
                <p className="text-stone-200 font-semibold leading-relaxed text-xs sm:text-sm">
                  We burn seasoned cherry and coastal oak tree fall from seasonal storms. Our flame chambers are manually monitored every 15 minutes to guarantee moisture lock.
                </p>
              </div>
              <div className="space-y-4">
                <span className="text-[#D4AF37] block uppercase tracking-widest text-[10px] font-bold">03 / ATMOSPHERIC PEACE</span>
                <p className="text-stone-200 font-semibold leading-relaxed text-xs sm:text-sm">
                  To minimize modern noise, we prohibit flash lenses and active phone displays inside the primary room. We provide secure canvas pocket envelopes for personal screens upon intake.
                </p>
              </div>
            </section>

          </div>

        </div>
          </>
        )}

        {/* SHOPIFY TAG ARCHITECTURE: Storefront Creator Integration Guide */}
        <div className="mt-20 border-t-[0.5px] border-stone-dark/30 pt-10" id="shopify-creator-documentation">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block mb-1 font-bold">
                [ INTEGRATION MANUAL ]
              </span>
              <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-cream-100 font-semibold">
                Shopify Tag Architecture Specification
              </h4>
              <p className="text-xs sm:text-sm text-stone-300 font-medium mt-1 leading-relaxed">
                Developer guidelines for dynamic metadata rendering across digital menus & custom sittings.
              </p>
            </div>
            <button
              onClick={() => setShowTagGuide(!showTagGuide)}
              className="px-4 py-2 bg-[#0e0e0d] border-[0.5px] border-stone-dark/30 hover:border-stone-muted text-stone-200 hover:text-cream-100 font-mono text-xs font-semibold tracking-widest uppercase transition-all duration-300 cursor-pointer"
              id="toggle-shopify-guide-btn"
            >
              {showTagGuide ? '[ HIDE SPECIFICATION ]' : '[ REVEAL SPECIFICATION ]'}
            </button>
          </div>

          <AnimatePresence>
            {showTagGuide && (
              <motion.div
                key="shopify-tag-guide"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="bg-stone-950/40 border-[0.5px] border-stone-800/60 rounded-none p-6 md:p-8 space-y-8 font-mono text-xs sm:text-sm text-stone-200 tracking-wide leading-relaxed font-medium">
                  
                  {/* Shopify Tag Integration Directory */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                      <span>◆ SPEC 01 :</span>
                      <span>E-Commerce Real-Time Routing Hooks</span>
                    </div>
                    <p className="text-stone-300 font-medium leading-relaxed">
                      Liaise cart state parameters instantly across client sessions using secure Shopify storefront tag hooks. Every interactive parameter binds context-aware data arrays dynamically:
                    </p>
                    
                    <div className="overflow-x-auto pt-2">
                      <table className="w-full text-left font-mono border-collapse text-xs">
                        <thead>
                          <tr className="border-b-[0.5px] border-stone-800/60 text-[#A5F3FC] text-[10px] md:text-xs tracking-widest uppercase">
                            <th className="py-3 pr-4 font-bold text-stone-300">SHOPIFY INTEGRATION TAG</th>
                            <th className="py-3 px-4 font-bold text-stone-300">DYNAMIC ENGINE ROUTING RULE</th>
                            <th className="py-3 pl-4 font-bold text-stone-300">CORE MATRIX INTERFACE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y-[0.5px] divide-stone-800/40 text-stone-200">
                          <tr>
                            <td className="py-4 pr-4 font-bold text-cream-100 font-mono">custom-sitting-itinerary</td>
                            <td className="py-4 px-4 font-medium text-stone-300">
                              Maps dynamic arrays from localStorage to checkout line-item attributes.
                            </td>
                            <td className="py-4 pl-4 text-[#D4AF37] uppercase tracking-wider text-[10px] font-bold font-mono">
                              line-item-attributes
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-4 font-bold text-cream-100 font-mono">sommelier-pairing-active</td>
                            <td className="py-4 px-4 font-medium text-stone-300">
                              Injects conditional variable modifiers (+$15/course) directly into the shopify cart matrix.
                            </td>
                            <td className="py-4 pl-4 text-[#D4AF37] uppercase tracking-wider text-[10px] font-bold font-mono">
                              cart-matrix-modifier
                            </td>
                          </tr>
                          <tr>
                            <td className="py-4 pr-4 font-bold text-cream-100 font-mono">capacity-interval-lock</td>
                            <td className="py-4 px-4 font-medium text-stone-300">
                              Routes seat counts to real-time checkout product inventory limits.
                            </td>
                            <td className="py-4 pl-4 text-[#D4AF37] uppercase tracking-wider text-[10px] font-bold font-mono">
                              realtime-inventory-latch
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-[0.5px] border-stone-800/40" />

                  {/* Spec 02: Dynamic Attribute Resolvers */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-xs uppercase tracking-wider">
                      <span>◆ SPEC 02 :</span>
                      <span>Catalog Metadata Resolution & Namespace Filtering</span>
                    </div>
                    <p className="text-stone-300 font-medium leading-relaxed text-xs sm:text-sm">
                      Products synchronized from the Shopify catalog populate custom header labels dynamically by parsing designated namespaces in the product tag stream. 
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                       <div className="bg-stone-900/60 border-[0.5px] border-stone-800/60 p-4 rounded-none">
                         <span className="text-[#A5F3FC] block mb-2 text-[10px] uppercase font-bold">TAG PARAM: METHOD</span>
                         <div className="bg-stone-950/80 p-2 text-cream-100 font-mono text-[10px] mb-2 border-[0.5px] border-stone-800/60">
                           method:CLAY BAKED
                         </div>
                         <p className="text-xs text-stone-200 font-medium leading-relaxed">
                           Maps a customized culinary style directly into the detailed course description. Supports any dynamic alphanumeric phrase (e.g. <span className="text-cream-200 font-mono">method:EMBER ROASTED</span>).
                         </p>
                       </div>

                      <div className="bg-stone-900/60 border-[0.5px] border-stone-800/60 p-4 rounded-none">
                        <span className="text-[#A5F3FC] block mb-2 text-[10px] uppercase font-bold">TAG PARAM: ALIGNMENT</span>
                        <div className="bg-stone-950/80 p-2 text-cream-100 font-mono text-[10px] mb-2 border-[0.5px] border-stone-800/60">
                          alignment:98%
                        </div>
                        <p className="text-[11px] text-stone-muted leading-relaxed">
                          Sets the certified organic alignment rating shown in calculations. Must terminate with a percentage sign (<span className="text-cream-200 font-mono">%</span>) for accurate mathematical aggregation.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t-[0.5px] border-stone-800/40" />

                  {/* Spec 03: Zero-Code Dietary Mappings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">
                      <span>◆ SPEC 03 :</span>
                      <span>Zero-Code Case-Insensitive Dietary & Conflict Engines</span>
                    </div>
                    <p className="text-stone-muted font-light leading-relaxed">
                      Filters list views feed directly from your localized catalog tags. Whenever conflicting tags (such as animal-derived meats and plant-exclusive proteins) appear concurrently in the Custom Sitting Flight, the aggregation engine gracefully updates to <span className="text-[#A5F3FC]">[ MIXED DIETARY ALLIANCE ]</span> to protect diner trust.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t-[0.5px] border-stone-800/40" />

                  {/* Spec 04: Hardware & Environment System Injections */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold text-[11px] uppercase tracking-wider">
                      <span>◆ SPEC 04 :</span>
                      <span>[[ HARDWARE & ENVIRONMENT SYSTEM INJECTIONS ]]</span>
                    </div>
                    <p className="text-stone-muted font-light leading-relaxed">
                      Override hardware-synthesized olfactory nodes, trigger high-fidelity thermal print rasterization headers, or toggle active localized storefront microclimate definitions:
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      {/* Control 1: Active Storefront Preset (Atelier vs Maritime) */}
                      <div className="bg-stone-900/40 border-[0.5px] border-stone-800/60 p-4 rounded-none flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[#A5F3FC] block text-[10px] uppercase font-bold">[ LOCAL STOREFRONT PRESET ]</span>
                          <span className="text-[10px] text-stone-muted block mt-1 leading-normal">Changes brand theme & concept context</span>
                        </div>
                        <div className="flex items-center gap-1 bg-stone-950/80 border-[0.5px] border-stone-800/60 p-1.5 justify-around">
                          <button 
                            onClick={() => handlePresetChange("culinaryAtelier")}
                            className={`px-2 py-1 uppercase text-[9px] font-mono tracking-widest transition-all cursor-pointer ${
                              (brandConfig?.activePreset || 'culinaryAtelier') === "culinaryAtelier" ? "text-cream-50 bg-[#c5a12d]/25 border-[0.5px] border-[#D4AF37]" : "text-[#7a735c] border-[0.5px] border-transparent hover:text-[#D4AF37]"
                            }`}
                          >
                            Atelier
                          </button>
                          <span className="text-stone-850 select-none">/</span>
                          <button 
                            onClick={() => handlePresetChange("coastalTastingRoom")}
                            className={`px-2 py-1 uppercase text-[9px] font-mono tracking-widest transition-all cursor-pointer ${
                              (brandConfig?.activePreset || 'culinaryAtelier') === "coastalTastingRoom" ? "text-cream-50 bg-[#c5a12d]/25 border-[0.5px] border-[#D4AF37]" : "text-[#7a735c] border-[0.5px] border-transparent hover:text-[#D4AF37]"
                            }`}
                          >
                            Maritime
                          </button>
                        </div>
                      </div>

                      {/* Control 2: Visual Print Engine */}
                      <div className="bg-stone-900/40 border-[0.5px] border-stone-800/60 p-4 rounded-none flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[#A5F3FC] block text-[10px] uppercase font-bold">[ RASTER PRINT DRIVER ]</span>
                          <span className="text-[10px] text-stone-muted block mt-1 leading-normal">Render raw table menu layout</span>
                        </div>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            window.print();
                          }}
                          className="w-full text-center bg-stone-950/80 border-[0.5px] border-stone-800/60 py-2 hover:bg-[#c5a12d]/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-widest text-[9px] font-mono text-[#D4AF37] flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Printer className="w-3 h-3 text-[#D4AF37]" />
                          <span>TRIGGER PRINT</span>
                        </button>
                      </div>

                      {/* Control 3: Olfactory Node override */}
                      <div className="bg-stone-900/40 border-[0.5px] border-stone-800/60 p-4 rounded-none flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[#A5F3FC] block text-[10px] uppercase font-bold">[ ATMO SCENT EMITTER ]</span>
                          <span className="text-[10px] text-stone-muted block mt-1 leading-normal">Toggle synthesized scent valves</span>
                        </div>
                        <button 
                          onClick={() => setIsMuted(!isMuted)} 
                          className="w-full text-center bg-stone-950/80 border-[0.5px] border-stone-800/60 py-2 hover:bg-[#c5a12d]/10 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 uppercase tracking-widest text-[9px] font-mono text-stone-muted flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-3 h-3 text-stone-muted" /> : <Volume2 className="w-3 h-3 text-[#D4AF37]" />}
                          <span>{isMuted ? 'EMITTER: OFF' : 'BURNT CEDAR'}</span>
                        </button>
                      </div>

                      {/* Control 4: Tableside Terminal Link */}
                      <div className="bg-stone-900/40 border-[0.5px] border-stone-800/60 p-4 rounded-none flex flex-col justify-between space-y-3">
                        <div>
                          <span className="text-[#A5F3FC] block text-[10px] uppercase font-bold">[ TABLESIDE LUNAR QR ]</span>
                          <span className="text-[10px] text-stone-muted block mt-1 leading-normal">Simulate diner interface projection</span>
                        </div>
                        <button
                          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            e.preventDefault();
                            const newMode = !isTablesideQR;
                            setIsTablesideQR(newMode);
                            if (newMode) {
                              setSelectedExpId('tasting');
                            }
                          }}
                          className={`w-full text-center bg-stone-950/80 border-[0.5px] py-2 transition-all duration-300 uppercase tracking-widest text-[9px] font-mono flex items-center justify-center gap-1.5 cursor-pointer ${
                            isTablesideQR ? 'border-[#A5F3FC] text-[#A5F3FC] bg-[#A5F3FC]/10' : 'border-stone-800/60 hover:border-[#A5F3FC] text-[#A5F3FC]'
                          }`}
                        >
                          <Compass className="w-3 h-3" />
                          <span>{isTablesideQR ? 'EXIT LUNAR QR' : 'SIMULATE QR'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </main>

      {/* FOOTER: Exquisite low-vibrancy branding */}
      <footer className="mt-28 border-t border-obsidian-800 pt-12 pb-16 px-6 md:px-12 max-w-7xl mx-auto space-y-8">
        {/* Storefront Credibility Layer */}
        <div className="text-center md:text-left border-b border-obsidian-900 pb-6">
          <p className="text-[9px] font-mono text-stone-muted/50 uppercase tracking-[0.25em]">
            [ AURA & GRID PREMIUM HOSPITALITY ARCHITECTURE • FULLY CUSTOMIZABLE VIA CONFIG • PRODUCTION READY ]
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h5 className="text-lg font-serif italic text-cream-100">{brandConfig?.conceptName || 'The Winter Parlor'}</h5>
            <p className="text-[10px] font-mono text-stone-muted uppercase tracking-widest mt-1">
              © 2026 AURA & GRID STUDIOS. ALL RIGHTS RESERVED.
            </p>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-8 text-[10px] font-mono text-stone-muted uppercase tracking-wider">
            <a href="#" className="hover:text-cream-100 transition-colors">[ CULINARY ETHOS ]</a>
            <a href="#" className="hover:text-cream-100 transition-colors">[ FARMLAND DIRECTORY ]</a>
            <a href="#" className="hover:text-cream-100 transition-colors">[ TERMS OF SERVICE ]</a>
          </div>
        </div>
      </footer>

      {/* DISH SCENT & SOIL DETAILED SIDE DRAWER (Interactive Overlay) */}
      <AnimatePresence>
        {inspectingDish && (
          <motion.div
            key="inspecting-dish-drawer-wrapper"
            className="fixed inset-0 z-50 flex justify-end"
          >
            
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setInspectingDish(null)}
              className="absolute inset-0 bg-black/90 pointer-events-auto"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-[#0D0D0C] border-l border-obsidian-800 p-8 md:p-12 text-cream-50 overflow-y-auto flex flex-col justify-between"
            >
              <div>
                {/* Close handle */}
                <div className="flex justify-between items-center border-b border-obsidian-800 pb-6 mb-8">
                  <span className="text-[10px] font-mono text-stone-muted tracking-widest uppercase">
                    [ RECORD INSPECTOR ]
                  </span>
                  <button 
                    onClick={() => setInspectingDish(null)}
                    className="text-stone-light hover:text-cream-100 transition-colors p-2 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <span className="text-[10px] font-mono text-[#D4AF37] uppercase tracking-widest block mb-2">
                  {inspectingDish.courseNumber || 'Winter Special Block'}
                </span>
                <h3 className="text-3xl md:text-4xl font-serif text-cream-100 italic">
                  {inspectingDish.name}
                </h3>
                <p className="text-xs text-stone-muted font-mono mt-2 uppercase tracking-wide">
                  Composition Cost: ${inspectingDish.price}
                </p>

                {inspectingDish.imageUrl && (
                  <div className="my-6 border border-stone-dark/30 bg-[#121211] relative overflow-hidden aspect-[16/10] flex items-center justify-center">
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                      <Sparkles className="text-stone-dark stroke-[1px] mb-2" size={24} />
                      <span className="text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase mb-1">[ {inspectingDish.name} ]</span>
                      <span className="text-[8px] font-mono tracking-widest text-stone-muted uppercase">[ HAND-SELECTED INGREDIENT HARVEST ]</span>
                    </div>
                    <DishImage
                      imageUrl={inspectingDish.imageUrl}
                      name={inspectingDish.name}
                      className="absolute inset-0 w-full h-full object-cover grayscale brightness-95 hover:grayscale-0 transition-all duration-700 z-10"
                    />
                  </div>
                )}

                <div className="mt-8 space-y-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
                      SENSORY & TEXTURAL ESSENCE
                    </span>
                    <p className="text-sm text-stone-light font-light leading-relaxed">
                      {inspectingDish.description} Our pastry chefs spin and bake custom batches to synchronize exactly with our wood fire temperature shifts.
                    </p>
                  </div>

                  {/* Botanical profile and farmers metadata */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
                      BOTANICAL COORDINATE RECORD
                    </span>
                    
                    <div className="space-y-3 font-mono text-xs bg-obsidian-950 p-4 border border-obsidian-800">
                      <div className="flex justify-between border-b border-obsidian-900 pb-1.5">
                        <span className="text-stone-dark">Primary Farm:</span>
                        <span className="text-cream-200">Wild Heights Organics</span>
                      </div>
                      <div className="flex justify-between border-b border-obsidian-900 pb-1.5">
                        <span className="text-stone-dark">Soil Chemistry:</span>
                        <span className="text-cream-200">Volcanic Loam, Clay Rich</span>
                      </div>
                      <div className="flex justify-between border-b border-obsidian-900 pb-1.5">
                        <span className="text-stone-dark">Harvest Date:</span>
                        <span className="text-cream-200">Morning, Yesterday</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-dark">Altitude:</span>
                        <span className="text-cream-200">1,420 Feet</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-stone-muted block mb-2">
                      DIETARY ALIGNMENT INDEX
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {inspectingDish.dietary.map(d => (
                        <span key={d} className="text-xs font-mono text-[#A5F3FC]">
                          [ {d} ]
                        </span>
                      ))}
                      {inspectingDish.dietary.length === 0 && (
                        <span className="text-xs font-mono text-stone-muted">
                          [ No Restrictive Markers ]
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-obsidian-800 mt-8 flex flex-col gap-3">
                <button
                  onClick={() => {
                    toggleDishSelect(inspectingDish.id);
                    setInspectingDish(null);
                  }}
                  className="w-full py-4 bg-cream-50 text-obsidian-950 font-mono uppercase text-xs tracking-widest font-semibold hover:bg-cream-100 transition-colors text-center"
                >
                  {selectedCourses.includes(inspectingDish.id) 
                    ? 'Remove from custom Sitting flight' 
                    : 'Select for custom Sitting flight'}
                </button>
                <button
                  onClick={() => setInspectingDish(null)}
                  className="w-full py-3 border border-obsidian-800 hover:border-stone-muted text-stone-light hover:text-cream-100 font-mono uppercase text-xs tracking-widest transition-colors text-center"
                >
                  Return to Lookbook
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Micro-Navigation Action Rail */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-obsidian-950/95 backdrop-blur-md border-t border-obsidian-800 py-4 px-6 flex justify-around items-center z-40 select-none">
        <a 
          href="#experience-tabs" 
          className="text-xs font-mono tracking-widest text-stone-light hover:text-cream-50 transition-all duration-300 hover:tracking-widest uppercase cursor-pointer"
        >
          [ VIEW MENU ]
        </a>
        <div className="h-4 w-[0.5px] bg-obsidian-800" />
        <a 
          href="#reservation-desk" 
          className="text-xs font-mono tracking-widest text-[#D4AF37] hover:text-cream-100 transition-all duration-300 hover:tracking-widest uppercase cursor-pointer"
        >
          [ BOOK TASTING ]
        </a>
      </div>

      {/* 
        SOPHISTICATED PRINT-ONLY LAYOUT
        Only visible during printing, mimicking a physical high-end tableside menu card.
      */}
      <div className="hidden print:block print:w-full print:max-w-2xl print:mx-auto print:text-black print:bg-white print:p-12 print:font-serif">
        <div className="text-center border-b-[0.5px] border-black pb-8 mb-10">
          <p className="text-[10px] font-mono tracking-editorial uppercase mb-2 text-stone-600">{(brandConfig?.studioName || 'AURA & GRID')} BLUEPRINT // TABLESIDE MENU</p>
          <h1 className="text-4xl font-semibold italic">{activeExperience.title}</h1>
          <p className="text-xs uppercase tracking-widest font-mono mt-2 text-stone-700">{activeExperience.timeframe}</p>
          <p className="text-xs font-light italic mt-4 max-w-lg mx-auto leading-relaxed text-stone-600">{activeExperience.description}</p>
        </div>

        <div className="space-y-8">
          {(selectedCourses.length > 0 
            ? activeExperience.dishes.filter(d => selectedCourses.includes(d.id))
            : activeExperience.dishes
          ).map((dish, index) => (
            <div key={dish.id} className="break-inside-avoid pb-4">
              <div className="flex justify-between items-baseline border-b-[0.5px] border-dotted border-black/40 pb-1 mb-2">
                <h3 className="text-lg italic font-medium">
                  <span className="font-mono text-[10px] mr-3 font-normal">{(index + 1).toString().padStart(2, '0')}</span>
                  {dish.name}
                </h3>
                <span className="text-sm font-mono">${dish.price}</span>
              </div>
              <p className="text-xs font-light leading-relaxed font-sans mb-2 text-stone-700">
                {dish.description}
              </p>
              <div className="flex gap-2 text-[8px] font-mono uppercase tracking-wider text-stone-500">
                <span>[ DIETARY: {dish.dietary.join(', ') || 'NONE'} ]</span>
                {dish.organicAlignment && <span>// [ ORGANIC ALIGNMENT: {dish.organicAlignment} ]</span>}
              </div>
            </div>
          ))}
        </div>

        {sommelierPairing && selectedCourses.length > 0 && (
          <div className="mt-8 p-4 border-[0.5px] border-black border-dashed break-inside-avoid bg-stone-50">
            <h4 className="text-xs font-mono tracking-widest uppercase mb-1 text-stone-800">[ ACTIVATED ADD-ON ]</h4>
            <p className="text-sm italic font-medium text-black">Included Sommelier Biodynamic Pairings (+ $15 per course)</p>
            <p className="text-xs font-sans font-light mt-1 text-stone-600 leading-relaxed">
              Every curated course is aligned with unique low-intervention pet-nats, unreleased ports, or wild-fermented cellared vintages.
            </p>
          </div>
        )}

        <div className="mt-16 pt-8 border-t-[0.5px] border-black flex justify-between items-center text-[9px] font-mono tracking-widest text-stone-500 uppercase">
          <div>
            <p>CURATOR: MARCUS VANCE</p>
            <p className="mt-1">ESTABLISHMENT: {(brandConfig?.conceptName || 'The Winter Parlor').toUpperCase()}</p>
          </div>
          <div className="text-right">
            <p>{brandConfig?.locale || 'LOS ANGELES'} // 34.0150° N, 118.3490° W</p>
            <p className="mt-1">Printed: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

    </div>
  );
}
