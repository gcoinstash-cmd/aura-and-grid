import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../context/AppContext';
import { MenuItem } from '../types';
import { Flame, Check, Sparkles, Filter, X, ChevronRight, Info } from 'lucide-react';

export const Menu: React.FC = () => {
  const { menuItems, loading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'All' | MenuItem['category']>('All');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categories: ('All' | MenuItem['category'])[] = ['All', 'Tacos', 'Sides', 'Drinks', 'Specials'];

  const filteredItems = menuItems.filter(
    (item) => (selectedCategory === 'All' || item.category === selectedCategory) && item.available
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120 } },
  };

  const renderSpicyLevel = (level: number) => {
    return (
      <div className="flex gap-0.5 text-chipotle-500" title={`Spicy Level: ${level}/3`}>
        {Array.from({ length: 3 }).map((_, i) => (
          <Flame
            key={i}
            className={`w-4 h-4 ${i < level ? 'fill-chipotle-500 stroke-chipotle-600' : 'text-zinc-800 opacity-30'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div id="digital-menu" className="space-y-10">
      {/* Editorial Category Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-zinc-900 pb-6">
        <div>
          <span className="font-mono text-xs text-agave-400 font-bold tracking-widest uppercase flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" />
            Gastronomy Catalog
          </span>
          <h3 className="font-display font-medium text-3xl text-white mt-1">Explore the Ritual.</h3>
        </div>

        {/* Categories Scroller */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-150 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold shadow-lg'
                  : 'bg-zinc-950 border border-zinc-850 text-zinc-500 hover:text-zinc-300 hover:border-zinc-750'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-2 border-agave-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-zinc-500 text-xs font-mono mt-4">Tuning the blue corn griddle...</p>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedCategory}
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-charcoal border border-zinc-850/80 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-zinc-750 transition-all duration-300 relative hover:shadow-2xl hover:shadow-black/60"
              >
                {/* Image & Badges */}
                <div className="relative h-52 overflow-hidden bg-obsidian">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-90" />
                  
                  {/* Floating tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[80%]">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-obsidian/90 backdrop-blur-md text-[9px] text-zinc-300 border border-zinc-800 font-mono uppercase tracking-wider py-1 px-2 rounded-md font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Price Plate */}
                  <div className="absolute bottom-4 right-4 bg-white text-black font-mono font-bold text-sm px-3 py-1 rounded-lg shadow-xl">
                    ${item.price.toFixed(2)}
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] text-zinc-500 tracking-wider uppercase font-bold">
                        {item.category}
                      </span>
                      {item.spicyLevel > 0 && renderSpicyLevel(item.spicyLevel)}
                    </div>
                    <h4 className="font-display text-xl text-zinc-100 font-semibold group-hover:text-white transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-zinc-400 text-xs line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Micro list of ingredient chips */}
                  <div className="flex flex-wrap gap-1 pt-2">
                    {item.ingredients.slice(0, 3).map((ing) => (
                      <span
                        key={ing}
                        className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-900"
                      >
                        {ing}
                      </span>
                    ))}
                    {item.ingredients.length > 3 && (
                      <span className="text-[9px] font-mono text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded">
                        +{item.ingredients.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-zinc-300 hover:text-white text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Info className="w-3.5 h-3.5 text-agave-400" />
                      View Ingredients
                    </button>
                    <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest flex items-center gap-1">
                      <Check className="w-3 h-3 text-agave-500" /> Fresh Daily
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Ingredient Detail Modal Popup */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-charcoal border border-zinc-800 rounded-3xl w-full max-w-lg overflow-hidden relative z-10 shadow-2xl"
            >
              {/* Header Image */}
              <div className="h-44 relative bg-obsidian">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-black/60 border border-zinc-800 text-zinc-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Contents */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="bg-zinc-900 border border-zinc-850 text-[10px] font-mono text-agave-400 px-2 py-0.5 rounded font-bold uppercase">
                      {selectedItem.category}
                    </span>
                    {selectedItem.spicyLevel > 0 && renderSpicyLevel(selectedItem.spicyLevel)}
                  </div>
                  <h4 className="font-display font-medium text-2xl text-white">
                    {selectedItem.name}
                  </h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {selectedItem.description}
                  </p>
                </div>

                {/* Complete Recipe/Ingredients Grid */}
                <div className="space-y-3">
                  <h5 className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    Heirloom Composition
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedItem.ingredients.map((ing) => (
                      <div
                        key={ing}
                        className="bg-obsidian border border-zinc-900 px-4 py-2 rounded-xl text-xs text-zinc-300 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-agave-500" />
                        {ing}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Metadata */}
                <div className="pt-4 border-t border-zinc-900 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 block">BASE ESTIMATE</span>
                    <span className="text-xl font-mono font-bold text-white">${selectedItem.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {selectedItem.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="bg-agave-950/20 border border-agave-900/30 text-[10px] font-mono text-agave-400 py-1 px-2 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
