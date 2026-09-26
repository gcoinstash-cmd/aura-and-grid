/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Vendor } from "../types";
import { Search, MapPin, Star, Sparkles, Send, X, ArrowUpRight, DollarSign, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface VendorDirectoryProps {
  vendors: Vendor[];
  onContactVendor: (vendor: Vendor) => void;
}

const CATEGORIES = ["All Domains", "Florals", "Catering", "Acoustics", "Couture", "Production", "Scent Design"];
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

// Curated high-fashion, high-contrast, moody editorial photographs mapped specifically to each vendor ID
const EDITORIAL_PARTNER_IMAGES: Record<string, string> = {
  "v-01": "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=800&auto=format&fit=crop", // Atelier de Fleurs (Florals)
  "v-02": "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop", // Banquets d'Or (Catering)
  "v-03": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop", // Campagne de Luxe (Catering - Champagne)
  "v-04": "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", // Dior Couture (Couture)
  "v-05": "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=800&auto=format&fit=crop", // Echo Soundscapes (Acoustics)
  "v-06": "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?q=80&w=800&auto=format&fit=crop", // Feu d'Artifice Kinetic (Production)
  "v-07": "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop", // Grande Illuminateur (Production - Light)
  "v-08": "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=800&auto=format&fit=crop", // Harmonie Symphonique Noir (Acoustics)
  "v-09": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=800&auto=format&fit=crop", // Imperial Fragrance Mixology (Catering)
  "v-10": "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=800&auto=format&fit=crop", // Jardin Sauvage Landscape (Florals)
  "v-11": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop", // Kuroko Silent Logistics (Production)
  "v-12": "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop", // Maison de Parfum Bespoke (Scent Design)
  "v-13": "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", // Nouvelle Gastronomie Lab (Catering)
  "v-14": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format&fit=crop", // Orphée Vinyl Archives (Acoustics)
  "v-15": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", // Pierre & Platinum Arch (Production)
  "v-16": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop", // Royal Archival Textiles (Couture)
  "v-17": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop", // Silence Custom Acoustics (Acoustics)
  "v-18": "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=800&auto=format&fit=crop", // Torches de Marseille (Production)
  "v-19": "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800&auto=format&fit=crop", // Vantage Suspended Stages (Production)
  "v-20": "https://images.unsplash.com/photo-1447069387593-a5de0862481e?q=80&w=800&auto=format&fit=crop", // Whispering Pines Living Forests (Florals)
  "v-21": "https://images.unsplash.com/photo-1535223289827-42f1e9919769?q=80&w=800&auto=format&fit=crop", // Zenith Kinetic Holograms (Production)
  "Default": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop"
};

export default function VendorDirectory({ vendors, onContactVendor }: VendorDirectoryProps) {
  const safeVendors = vendors || [];
  const [selectedLetter, setSelectedLetter] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Domains");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [drawerVendorId, setDrawerVendorId] = useState<string | null>(null);

  // Filter vendors based on Alphabet representation, Categories, and Query search
  const filteredVendors = useMemo(() => {
    return safeVendors.filter((vendor) => {
      if (!vendor) return false;
      const matchLetter = selectedLetter === "All" || vendor.alphabet === selectedLetter;
      const matchCat = selectedCategory === "All Domains" || vendor.category === selectedCategory;
      const matchSearch =
        !searchQuery
          ? true
          : (vendor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (vendor.about || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (vendor.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (vendor.location || "").toLowerCase().includes(searchQuery.toLowerCase());
      return matchLetter && matchCat && matchSearch;
    });
  }, [safeVendors, selectedLetter, selectedCategory, searchQuery]);

  // Deep details overview finder
  const activeDrawerVendor = useMemo(() => {
    return safeVendors.find((v) => v && v.id === drawerVendorId) || null;
  }, [safeVendors, drawerVendorId]);

  // Dynamic sizing selector for editorial magazine architecture (prominent tier versus subtle items)
  const getCardLayoutClass = (id: string) => {
    const prominentIds = ["v-01", "v-02", "v-11", "v-15", "v-19", "v-21"];
    if (prominentIds.includes(id)) {
      // 2 columns wide on medium+ screens to portray luxurious authority
      return "col-span-1 md:col-span-2 row-span-1 border border-neutral-800 bg-[#0C0C0C]/80 shadow-xl shadow-black/45 pb-6 overflow-hidden md:flex md:flex-col justify-between";
    }
    // Elegant single vertical lookbook card 
    return "col-span-1 border border-neutral-900 bg-[#070707] hover:bg-[#0A0A0A]/90 transition-all duration-300 pb-5 overflow-hidden flex flex-col justify-between";
  };

  const getImageAspectClass = (id: string) => {
    const prominentIds = ["v-01", "v-02", "v-11", "v-15", "v-19", "v-21"];
    if (prominentIds.includes(id)) {
      // Wide format for big feature cards
      return "aspect-[16/10] md:aspect-[21/9] lg:aspect-[16/8] w-full bg-obsidian";
    }
    // High-fashion vertical orientation for standard list
    return "aspect-[4/5] w-full bg-obsidian";
  };

  // Defensive empty/null state guard to prevent any mapping/filtering crash
  if (safeVendors.length === 0) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12" id="curated-partners-directory">
        <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-neutral-900 pb-10 mb-14">
          <div>
            <span className="text-[10px] tracking-[0.4em] text-gold uppercase block mb-3 font-sans font-medium">
              02 / LES MAÎTRES DE SCÈNE
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-stark-white font-light tracking-wide italic">
              Curated Partners Directory
            </h2>
          </div>
        </div>
        <div className="border border-dashed border-neutral-800 p-16 text-center bg-[#070707] text-neutral-500 font-sans text-xs tracking-widest uppercase">
          No luxury partners available in this directory formulation at this time.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12" id="curated-partners-directory">
      
      {/* Title block with premium editorial typography and margins */}
      <div className="flex flex-col md:flex-row justify-between items-baseline border-b border-neutral-900 pb-10 mb-14">
        <div>
          <span className="text-[10px] tracking-[0.4em] text-gold uppercase block mb-3 font-sans font-medium">
            02 / LES MAÎTRES DE SCÈNE
          </span>
          <h2 className="text-4xl md:text-5xl font-serif text-stark-white font-light tracking-wide italic">
            Curated Partners Directory
          </h2>
        </div>
        <p className="max-w-md text-xs tracking-wider text-platinum/70 leading-relaxed font-sans font-light mt-4 md:mt-0">
          An elite selection of florists, culinary designers, master acousticians, and kinetic light engineers hand-selected to elevate grand-scale celebrations. Defaulting to desaturated stillness, shifting dynamically to deep color on cursor contact.
        </p>
      </div>

      {/* Modern minimal filters bar */}
      <div className="flex flex-col gap-6 lg:flex-row justify-between items-stretch lg:items-center bg-[#090909] border border-neutral-900 p-6 mb-10 shadow-lg shadow-black/20">
        
        {/* Domain Toggles */}
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`domain-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 text-[9.5px] tracking-[0.25em] uppercase transition-all duration-300 rounded-none cursor-pointer font-sans font-medium ${
                selectedCategory === cat
                  ? "bg-white text-black font-semibold border border-white"
                  : "bg-transparent border border-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Brand search field styled as a modern minimal bottom-bordered segment */}
        <div className="relative min-w-[280px]">
          <span className="absolute left-1 top-1/2 -translate-y-1/2 text-neutral-500">
            <Search size={13} />
          </span>
          <input
            id="curated-partner-search"
            type="text"
            placeholder="Search Curators, Ateliers, Cities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-b border-neutral-900 text-xs text-stark-white pl-8 pr-4 py-3 placeholder:text-neutral-600 focus:placeholder:opacity-30 placeholder:tracking-widest focus:outline-none focus:border-white transition-all duration-500 font-sans font-light"
          />
        </div>
      </div>

      {/* Main layout container split with Sidebar and lookbook catalog */}
      <div className="flex flex-col lg:flex-row gap-10 items-start relative pb-16">
        
        {/* Alphabetical navigation layout with dedicated golden dots */}
        <div className="w-full lg:w-16 flex flex-row lg:flex-col items-center justify-between lg:justify-start gap-1 p-2 bg-[#080808] border border-neutral-900 lg:sticky lg:top-24 max-h-[80vh] overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto scrollbar-none z-20 shadow-md">
          <button
            id="alphabet-all-filter"
            onClick={() => setSelectedLetter("All")}
            className={`w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center text-[10px] font-mono tracking-tighter uppercase shrink-0 transition-all cursor-pointer ${
              selectedLetter === "All"
                ? "bg-white text-black font-bold"
                : "text-neutral-500 hover:bg-neutral-900 hover:text-white"
            }`}
          >
            All
          </button>
          
          <div className="h-[1px] w-8 bg-neutral-900 my-1 hidden lg:block" />
          
          {ALPHABET.map((letter) => {
            const hasPartners = safeVendors.some((v) => v && v.alphabet === letter);
            const isSelected = selectedLetter === letter;

            return (
              <button
                key={letter}
                id={`alphabet-select-${letter}`}
                disabled={!hasPartners}
                onClick={() => setSelectedLetter(letter)}
                className={`w-8 h-8 lg:w-10 lg:h-10 flex items-center justify-center text-[10px] font-mono tracking-widest shrink-0 transition-all ${
                  isSelected
                    ? "bg-white text-black font-bold"
                    : hasPartners
                    ? "text-stark-white hover:bg-neutral-900 hover:text-gold cursor-pointer"
                    : "text-neutral-700 cursor-not-allowed opacity-20"
                }`}
              >
                {letter}
              </button>
            );
          })}
        </div>

        {/* Responsive curated editorial grid (supports 12 column layout mapping dynamically) */}
        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredVendors.length > 0 ? (
              filteredVendors.map((vendor) => {
                const imgUrl = EDITORIAL_PARTNER_IMAGES[vendor.id] || EDITORIAL_PARTNER_IMAGES.Default;
                const isProminent = ["v-01", "v-02", "v-11", "v-15", "v-19", "v-21"].includes(vendor.id);
                
                return (
                  <motion.div
                    key={vendor.id}
                    layout
                    id={`partner-card-${vendor.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    onClick={() => setDrawerVendorId(vendor.id)}
                    className={`group cursor-pointer relative transition-all duration-500 hover:border-neutral-700/80 p-4 ${getCardLayoutClass(vendor.id)}`}
                  >
                    <div>
                      {/* HIGH-CONTRAST DESATURATED-TO-COLOR EDITORIAL IMAGE BOX */}
                      <div className={`overflow-hidden relative mb-5 border border-neutral-900/40 group-hover:border-neutral-800 transition-colors ${getImageAspectClass(vendor.id)}`}>
                        <img
                          src={imgUrl}
                          alt={vendor.name}
                          className="w-full h-full object-cover filter grayscale contrast-[1.12] brightness-[0.88] saturate-[0.10] group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 group-hover:saturate-100 transition-all duration-1000 ease-out scale-101 group-hover:scale-[1.03]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-65 group-hover:opacity-40 transition-opacity duration-700" />
                        
                        {/* Elite standard code tags */}
                        {isProminent && (
                          <span className="absolute top-3.5 left-3.5 bg-black/90 border border-gold-muted/30 text-[8px] font-mono tracking-[0.3em] text-gold uppercase px-3 py-1">
                            MAÎTRE EXCLUSIF
                          </span>
                        )}
                        
                        <span className="absolute bottom-3 right-3 text-[14px] font-serif text-white/50 tracking-wide block italic">
                          {vendor.alphabet}
                        </span>
                      </div>

                      {/* Header row pairing Celebratory Serif & Small Uppercase Sans */}
                      <div className="flex justify-between items-baseline mb-2 pb-1.5 border-b border-neutral-900/60">
                        <span className="text-[9px] uppercase tracking-[0.22em] font-sans font-medium text-neutral-400">
                          {vendor.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-[8.5px] text-gold font-mono tracking-widest uppercase">
                          <Star size={7.5} fill="#D4AF37" />
                          <span>{vendor.rating}</span>
                        </div>
                      </div>

                      {/* BRAND CURATOR NAME IN 'CELEBRATORY' SERIF TYPOGRAPHY (Cormorant Garamond) */}
                      <h3 className="text-2.5xl md:text-3xl font-serif text-stark-white group-hover:text-gold transition-colors duration-500 font-light tracking-wide italic leading-snug">
                        {vendor.name}
                      </h3>

                      {/* Short bio preview */}
                      <p className="text-[11.5px] font-sans font-light leading-relaxed text-platinum/50 hover:text-platinum/70 line-clamp-2 mt-2.5">
                        {vendor.about}
                      </p>
                    </div>

                    {/* Footer showing tiered hierarchy metrics */}
                    <div className="flex justify-between items-end border-t border-neutral-900/80 mt-5 pt-4">
                      <div>
                        <span className="block text-[7.5px] tracking-[0.25em] text-neutral-500 uppercase font-mono mb-1">
                          MINIMUM ENGAGEMENT VALUE
                        </span>
                        <span className="text-xs font-mono font-medium text-stark-white tracking-widest">
                          {vendor.startingPrice}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-neutral-900 flex items-center justify-center text-neutral-500 group-hover:text-gold group-hover:border-neutral-700 transition-all duration-300">
                        <ArrowUpRight size={13} />
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full border border-dashed border-neutral-800 p-16 text-center bg-[#070707] text-neutral-500 font-sans text-xs tracking-widest uppercase">
                No luxury ateliers matched the category or alphabet filter criteria.
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bespoke side drawer leveraging smooth springs and fine alignment lines */}
      <AnimatePresence>
        {activeDrawerVendor && (
          <>
            {/* Dark glass backdrop filter */}
            <motion.div
              id="drawer-overlay-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerVendorId(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Premium Drawer Container */}
            <motion.div
              id="curated-dossier-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 190 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-obsidian border-l border-neutral-800 shadow-2xl p-6 md:p-10 z-50 overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-6 border-b border-neutral-900">
                <span className="font-mono text-[9px] tracking-[0.35em] text-gold uppercase block">
                  PARTNER DOSSIER CACHET
                </span>
                <button
                  id="close-lookbook-drawer"
                  onClick={() => setDrawerVendorId(null)}
                  className="w-10 h-10 border border-neutral-900 rounded-full flex items-center justify-center text-neutral-400 hover:text-white hover:border-white transition-all cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer lookbook elements */}
              <div className="py-8 space-y-8">
                
                {/* Immersive headshot header block */}
                <div className="relative h-56 border border-neutral-900 overflow-hidden bg-neutral-950">
                  <img
                    src={EDITORIAL_PARTNER_IMAGES[activeDrawerVendor.id] || EDITORIAL_PARTNER_IMAGES.Default}
                    alt={activeDrawerVendor.name}
                    className="w-full h-full object-cover opacity-75"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <span className="text-[8.5px] font-sans font-semibold tracking-widest text-[#D4AF37] uppercase bg-black border border-neutral-800 px-2.5 py-1">
                      {activeDrawerVendor.category}
                    </span>
                    <h4 className="text-3xl font-serif italic text-stark-white mt-2 leading-tight font-light">
                      {activeDrawerVendor.name}
                    </h4>
                  </div>
                </div>

                {/* Exclusive Bio */}
                <div className="space-y-3">
                  <span className="text-[9px] tracking-widest text-neutral-500 uppercase font-mono block">
                    BIOGRAPHY & DISCRETION AUDIT
                  </span>
                  <p className="text-xs font-sans font-light leading-relaxed text-platinum/90 text-justify">
                    {activeDrawerVendor.about}
                  </p>
                </div>

                {/* Operations & concierge metadata */}
                <div className="grid grid-cols-2 gap-4 border-t border-b border-neutral-900 py-6">
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase font-mono block mb-1.5 tracking-wider">
                      BASE OF OPERATIONS
                    </span>
                    <span className="text-xs font-serif text-stark-white flex items-center gap-1.5 italic font-light">
                      <MapPin size={9.5} className="text-gold" /> {activeDrawerVendor.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-[8px] text-neutral-500 uppercase font-mono block mb-1.5 tracking-wider">
                      AUDITED STANDWARDS
                    </span>
                    <span className="text-xs font-serif text-[#D4AF37] italic flex items-center gap-1.5">
                      <Star size={9.5} fill="#D4AF37" /> {activeDrawerVendor.rating}
                    </span>
                  </div>
                </div>

                {/* Bespoke tiers or arrangements list */}
                <div className="space-y-4">
                  <span className="text-[9px] tracking-widest text-neutral-500 uppercase font-mono block">
                    AVAILABLE RESERVES & CONSTELLATIONS
                  </span>

                  <div className="space-y-2">
                    {activeDrawerVendor.tiers?.map((tier, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-[#080808] border border-neutral-900 flex items-center justify-between"
                      >
                        <span className="text-xs font-sans font-light text-neutral-300">
                          {tier}
                        </span>
                        <div className="h-1 w-1 bg-[#D4AF37]" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Engagement panel CTA */}
                <div className="pt-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] text-neutral-500 uppercase font-mono">
                      STARTING AUDITED AGREEMENT
                    </span>
                    <span className="text-2xl font-serif text-gold font-light">
                      {activeDrawerVendor.startingPrice}
                    </span>
                  </div>

                  <button
                    id={`concierge-cta-${activeDrawerVendor.id}`}
                    onClick={() => {
                      onContactVendor(activeDrawerVendor);
                      setDrawerVendorId(null);
                    }}
                    className="w-full py-4.5 text-[10px] tracking-[0.3em] bg-white text-black uppercase font-bold hover:bg-gold hover:text-black transition-colors duration-500 shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send size={11} /> REQUEST SECURE ENGAGEMENT
                  </button>

                  <p className="text-[8px] text-neutral-500 tracking-[0.25em] text-center font-mono uppercase">
                    CERTIFIED ENGAGEMENT CHRONICLE • CASE COUNT: {activeDrawerVendor.portfolioCount}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
