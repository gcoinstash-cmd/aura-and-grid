import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Utensils, Check, Eye } from 'lucide-react';
import { PROVISIONS_MENU } from '../data';
import { MenuItem } from '../types';

export default function ProvisionsMenu() {
  const [selectedCourse, setSelectedCourse] = useState<'All' | 'Small Plates' | 'Mains' | 'Final Notes'>('All');
  const [dietFilter, setDietFilter] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Filter logic
  const filteredItems = PROVISIONS_MENU.filter((item) => {
    const courseMatches = selectedCourse === 'All' || item.course === selectedCourse;
    const dietMatches = !dietFilter || (item.dietary && item.dietary.includes(dietFilter));
    return courseMatches && dietMatches;
  });

  const uniqueDiets = Array.from(
    new Set(PROVISIONS_MENU.flatMap((item) => item.dietary || []))
  );

  return (
    <div id="provisions-menu-section" className="space-y-12">
      
      {/* Decorative center accent */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal border border-white/10">
          <Utensils className="w-3.5 h-3.5 text-terracotta" />
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-gold font-bold">The Provisions</span>
        </div>
        <h2 className="font-serif text-4xl lg:text-5xl text-white font-medium tracking-tight">
          Southern Roots, Elegant Progressions
        </h2>
        <div className="w-16 h-px bg-gradient-to-r from-transparent via-terracotta to-transparent mx-auto mt-2" />
        <p className="max-w-2xl mx-auto text-sm text-stone-400 font-sans font-light leading-relaxed">
          Our provisions are a dialogue between legacy agricultural foodways of the Black American South and contemporary indoor-outdoor West Coast fine dining. Enjoy multi-course progressions staggered to the evening twilight.
        </p>
      </div>

      {/* Course and Lifestyle Selectors Panel */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/5 pb-6">
        
        {/* Main Courses */}
        <div className="flex flex-wrap gap-1.5 justify-center md:justify-start">
          {(['All', 'Small Plates', 'Mains', 'Final Notes'] as const).map((course) => {
            const isSelected = selectedCourse === course;
            return (
              <button
                key={course}
                onClick={() => {
                  setSelectedCourse(course);
                  setExpandedItemId(null);
                }}
                className={`px-4 py-2 text-xs font-mono tracking-wider uppercase rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gold border-gold text-obsidian font-bold shadow-lg shadow-gold/10'
                    : 'bg-stone-950/80 border-white/5 text-stone-400 hover:text-white hover:border-white/25'
                }`}
              >
                {course === 'All' ? 'Complete Progression' : course}
              </button>
            );
          })}
        </div>

        {/* Dietary Prefs */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-stone-500 uppercase tracking-wider">Lifestyles:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => {
                setDietFilter(null);
                setExpandedItemId(null);
              }}
              className={`px-2.5 py-1 text-[10px] font-mono tracking-wide rounded-md border transition-all cursor-pointer ${
                dietFilter === null
                  ? 'bg-terracotta/25 border-terracotta text-white'
                  : 'bg-stone-900 border-white/5 text-stone-400 hover:text-white'
              }`}
            >
              All Provisions
            </button>
            {uniqueDiets.map((diet) => {
              const isActive = dietFilter === diet;
              return (
                <button
                  key={diet}
                  onClick={() => {
                    setDietFilter(isActive ? null : diet);
                    setExpandedItemId(null);
                  }}
                  className={`px-2.5 py-1 text-[10px] font-mono tracking-wide rounded-md border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-terracotta/25 border-terracotta text-white'
                      : 'bg-stone-900 border-white/5 text-stone-400 hover:text-white'
                  }`}
                >
                  {diet}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Asymmetric Staggered Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
        
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const isHighlighted = item.highlighted;
            const isExpanded = expandedItemId === item.id;
            const isStaggered = index % 2 === 1; // Used for non-traditional offsets on desktop

            return (
              <motion.div
                key={item.id}
                layout="position"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className={`relative group ${isStaggered ? 'md:mt-10' : ''}`}
              >
                {/* Visual card glow decoration for chef highlights */}
                {isHighlighted && (
                  <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-terracotta/15 via-gold/15 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                )}

                {/* Main Card Frame */}
                <div 
                  className={`p-6 rounded-2xl border transition-all duration-300 relative bg-charcoal ${
                    isHighlighted 
                      ? 'border-gold/35 shadow-md shadow-gold/2' 
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Highlight tag */}
                  {isHighlighted && (
                    <div className="absolute -top-3.5 left-6 bg-gold text-obsidian font-mono text-[9px] font-extrabold uppercase px-2.5 py-1 rounded shadow-lg tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>Recommended Signature</span>
                    </div>
                  )}

                  {/* Header Row: Title and Price */}
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-stone-400 block mb-1">
                        {item.course}
                      </span>
                      <h3 className="font-serif text-xl lg:text-2xl text-stone-100 font-medium group-hover:text-gold transition-colors">
                        {item.name}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-serif text-xl text-gold font-semibold">
                        ${item.price}
                      </span>
                      {item.dietary && (
                        <div className="flex gap-1 mt-1">
                          {item.dietary.map((d) => (
                            <span 
                              key={d} 
                              className="text-[8px] font-mono uppercase bg-stone-900 border border-terracotta/30 text-terracotta px-1.5 py-0.2 rounded"
                            >
                              {d}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Main description text */}
                  <p className="text-sm font-sans text-stone-400 font-light leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Expand-Details button */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <button 
                      onClick={() => setExpandedItemId(isExpanded ? null : item.id)}
                      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-stone-400 hover:text-gold transition-colors focus:outline-none cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isExpanded ? 'Conceal Provision Notes' : 'Inspect Ingredients & Alchemy'}</span>
                    </button>
                    <span className="text-[10px] font-mono text-stone-500">
                      ID: AURA-{item.id.toUpperCase()}
                    </span>
                  </div>

                  {/* Expandable ingredients list section */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 mt-2 space-y-4 border-t border-dashed border-white/5">
                          <div>
                            <span className="font-mono text-[9px] uppercase text-terracotta tracking-widest block mb-1.5">
                              Culinary Component Chemistry
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {item.ingredients.map((ing) => (
                                <div 
                                  key={ing} 
                                  className="flex items-center gap-1 bg-stone-950 px-2 py-1 rounded text-[10px] text-gray-300 border border-white/5"
                                >
                                  <Check className="w-3 h-3 text-gold" />
                                  <span>{ing}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Suggested Pairing (Adds luxury feel) */}
                          <div className="p-3 rounded-lg bg-stone-950/60 border border-white/5">
                            <span className="font-mono text-[9px] text-gold uppercase tracking-wider block mb-1">
                              Sommelier Recommended Pairing Sync
                            </span>
                            <p className="text-[11px] text-stone-400 font-sans italic">
                              {item.course === 'Small Plates' && 'Uncle Nearest 1884 Small Batch Bourbon Neat or chilled rye elderflower sour.'}
                              {item.course === 'Mains' && 'Cabernet Sauvignon barrel matured with notes of dark smoke and organic black cherry.'}
                              {item.course === 'Final Notes' && 'House-drip dark chicory black cold foam brew, sweetened with peach demarara.'}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-charcoal/50">
          <p className="text-stone-400 font-mono text-sm">No culinary provisions match the specified configurations.</p>
          <button 
            onClick={() => { setSelectedCourse('All'); setDietFilter(null); }}
            className="mt-4 px-4 py-2 font-mono text-xs bg-terracotta text-white rounded hover:bg-terracotta-hover transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
}
