import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GALLERY_ITEMS } from '../data';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Share2, Heart, Sparkles } from 'lucide-react';
import GalleryCard from './GalleryCard';

export default function EditorialGallery() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = ['all', 'Cuts', 'Color', 'Editorial', 'Atmosphere'];

  const filteredItems = activeCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeCategory);

  const openLightbox = (item: GalleryItem) => {
    const originalIndex = GALLERY_ITEMS.findIndex(g => g.id === item.id);
    setSelectedItem(item);
    setSelectedIndex(originalIndex);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
    setSelectedIndex(-1);
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextIdx = (selectedIndex + 1) % GALLERY_ITEMS.length;
    setSelectedIndex(nextIdx);
    setSelectedItem(GALLERY_ITEMS[nextIdx]);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const prevIdx = (selectedIndex - 1 + GALLERY_ITEMS.length) % GALLERY_ITEMS.length;
    setSelectedIndex(prevIdx);
    setSelectedItem(GALLERY_ITEMS[prevIdx]);
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="editorial" className="relative py-28 md:py-36 bg-[#0d0d0d] overflow-hidden border-b border-white/[0.03]">
      
      {/* Decorative radial gradients */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E6C587]/[0.01] rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Title block */}
        <div className="max-w-2xl mb-16">
          <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-[#E6C587] font-semibold">
            CREATIVE ARCHIVES
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-white font-light tracking-tight">
            Visual Editorial <span className="italic">Gallery</span>
          </h2>
          <p className="mt-4 text-xs md:text-sm text-[#F7F4EB]/80 tracking-wide font-light">
            A moody archive documenting structural shape, physical texture transformations, and chemical-free tone balance. Click on any frame to inspect the composition notes.
          </p>
        </div>

        {/* Gallery categories filter tabs */}
        <div className="flex flex-wrap gap-3 md:gap-4 mb-12 pb-4">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`text-[9px] md:text-[10px] font-sans uppercase tracking-[0.22em] px-5 py-2.5 transition-all duration-300 relative cursor-pointer ${
                  isActive
                    ? 'bg-[#E6C587] text-[#0d0d0d] font-bold border border-[#E6C587] shadow-[0_4px_16px_rgba(230,197,135,0.2)]'
                    : 'bg-white/[0.02] text-[#F7F4EB]/60 hover:text-white border border-white/10 hover:border-white/20 font-light hover:bg-white/[0.04]'
                }`}
              >
                <span>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Asymmetric Masonry Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative md:auto-rows-[340px]">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <GalleryCard
                key={item.id}
                item={item}
                onClick={() => openLightbox(item)}
                liked={!!likedItems[item.id]}
                onLikeToggle={(e) => toggleLike(e, item.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Cinematic Lightbox Modal */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-12"
            >
              {/* Escape handlers & metadata */}
              <div className="absolute top-6 left-6 flex items-center space-x-2">
                <span className="font-serif text-lg tracking-[0.15em] uppercase text-white/50">
                  Crown & <span className="italic font-normal">Collective</span>
                </span>
                <span className="text-[8px] font-mono text-[#E6C587] tracking-widest bg-white/5 px-2 py-0.5 border border-[#E6C587]/10 uppercase">
                  ARCHIVES
                </span>
              </div>

              {/* Top controls */}
              <div className="absolute top-6 right-6 flex items-center space-x-6 z-55">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(selectedItem.url);
                    alert('Editorial link copied to clipboard.');
                  }}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                  title="Share Asset Link"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={closeLightbox}
                  className="p-2 text-white/60 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Content Area */}
              <div
                className="relative max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrev}
                  className="absolute left-0 lg:-left-12 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all z-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute right-0 lg:-right-12 top-1/2 -translate-y-1/2 p-3 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all z-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Left Immersive Image Frame */}
                <div className="col-span-1 lg:col-span-8 bg-[#121212] p-1.5 border border-white/10 max-h-[75vh] flex justify-center items-center overflow-hidden">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[70vh] w-full object-contain"
                  />
                </div>

                {/* Right Specification Data Panel */}
                <div className="col-span-1 lg:col-span-4 text-left p-6 lg:p-0">
                  <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#E6C587] font-semibold">
                    COUTE COMPOSITION INDEX • {selectedItem.category}
                  </span>
                  
                  <h3 className="font-serif text-3xl text-white font-light tracking-wide mt-4">
                    {selectedItem.title}
                  </h3>
                  
                  <div className="h-px bg-white/10 my-6" />

                  <div className="space-y-4">
                    <div>
                      <span className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 font-medium">
                        LAB CRITIQUE
                      </span>
                      <p className="text-xs text-[#F7F4EB]/85 leading-relaxed font-light mt-1.5">
                        A pristine, high-end integration of raw cutting parameters adjusted specifically for coily and curly volume profiles. Engineered with precision moisture balance and custom hydration rituals.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 font-medium">
                          COMPILER
                        </span>
                        <span className="text-[11px] font-serif text-[#E6C587] block mt-1 font-medium">
                          Nia Crowne
                        </span>
                      </div>
                      <div>
                        <span className="block text-[8px] font-mono tracking-widest uppercase text-zinc-400 font-medium">
                          METRIC ID
                        </span>
                        <span className="text-[11px] font-mono text-[#F7F4EB]/90 block mt-1">
                          MSN_ARC_002
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <button
                      onClick={(e) => toggleLike(e, selectedItem.id)}
                      className="flex items-center space-x-2 text-[10px] font-sans uppercase tracking-[0.2em] text-[#F7F4EB] hover:text-[#E6C587] transition-all"
                    >
                      <Heart className={`w-4 h-4 ${likedItems[selectedItem.id] ? 'fill-[#E6C587] text-[#E6C587]' : ''}`} />
                      <span>{likedItems[selectedItem.id] ? 'Saved to collection' : 'Save Composition'}</span>
                    </button>

                    <span className="flex items-center space-x-1 text-[9px] font-mono text-zinc-400">
                      <Sparkles className="w-3 h-3 text-[#E6C587]/80" />
                      <span>LOS ANGELES</span>
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
