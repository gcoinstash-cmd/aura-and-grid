/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { X, Check, Plus, Minus, Layers, Flame, Compass, Sparkles, CheckCircle2 } from 'lucide-react';
import { ThemeConfig } from '../types';

interface CustomBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeConfig;
  accentColor: string;
}

interface Ingredient {
  id: string;
  name: string;
  price: number;
  calories: number;
  category: 'patty' | 'cheese' | 'sauce' | 'premium';
  description: string;
}

const PRESET_BASES = [
  { id: 'single', name: 'SINGLE SMASH BASE', price: 14, calories: 450, desc: '100% chuck blend single patty on toasted organic brioche' },
  { id: 'double', name: 'DOUBLE SMASH BASE', price: 18, calories: 655, desc: 'Signature double 80/20 chuck patty stack with brioche' },
  { id: 'wagyu', name: 'A5 SHIN-WAGYU BASE', price: 23, calories: 730, desc: 'Rich artisanal Wagyu single ribbon seared crisp' }
];

const PREMIUM_INGREDIENTS: Ingredient[] = [
  { id: 'extra-patty', name: 'Extra Premium Patty', price: 4.50, calories: 210, category: 'patty', description: 'Additional 110g seasoned artisan beef patty seared at 450°F' },
  { id: 'bone-marrow', name: 'Smoked Bone-Marrow Aioli', price: 2.00, calories: 75, category: 'sauce', description: 'Rich roasted marrow whipped with garlic & local oil blend' },
  { id: 'truffle-glaze', name: 'White Truffle Reduction Glaze', price: 3.50, calories: 45, category: 'premium', description: 'Fragrant earth-forward truffle reduction spray-glazed to finish' },
  { id: 'aged-gruyere', name: 'Melted Swiss Gruyère Crust', price: 2.50, calories: 95, category: 'cheese', description: 'Nutty, high-melt cave-aged cheese crusting the smash crown' },
  { id: 'crispy-prosciutto', name: 'Crispy Prosciutto Tallow Sheet', price: 3.00, calories: 60, category: 'premium', description: 'Paper-thin cured prosciutto crisped inside Wagyu beef tallow' },
  { id: 'confit-garlic', name: 'Confit Wild Garlic Puree', price: 1.50, calories: 50, category: 'sauce', description: 'Slow slow-stewed organic cloves pureed into sweet butter smear' },
  { id: 'pickled-chanterelle', name: 'Cold-Brined Chanterelle Buttons', price: 3.00, calories: 25, category: 'premium', description: 'Acidity lift with local forest mushrooms cold-pickled in dill flour' }
];

export default function CustomBuildModal({
  isOpen,
  onClose,
  currentTheme,
  accentColor
}: CustomBuildModalProps) {
  const [selectedBaseId, setSelectedBaseId] = useState('double');
  const [selectedAddons, setSelectedAddons] = useState<string[]>(['bone-marrow']);
  const [orderedSuccess, setOrderedSuccess] = useState(false);
  const [customName, setCustomName] = useState('Smash Prototype #01');

  const activeBase = useMemo(() => {
    return PRESET_BASES.find(b => b.id === selectedBaseId) || PRESET_BASES[1];
  }, [selectedBaseId]);

  const toggleAddon = (id: string) => {
    if (selectedAddons.includes(id)) {
      setSelectedAddons(selectedAddons.filter(a => a !== id));
    } else {
      setSelectedAddons([...selectedAddons, id]);
    }
  };

  const calculatedMetrics = useMemo(() => {
    let price = activeBase.price;
    let calories = activeBase.calories;
    let maillardBase = 8.5;

    selectedAddons.forEach(addonId => {
      const ingredient = PREMIUM_INGREDIENTS.find(i => i.id === addonId);
      if (ingredient) {
        price += ingredient.price;
        calories += ingredient.calories;
        
        // Add metric modifiers
        if (ingredient.category === 'patty') maillardBase += 0.8;
        if (ingredient.id === 'truffle-glaze') maillardBase += 0.3;
        if (ingredient.id === 'bone-marrow') maillardBase += 0.2;
      }
    });

    const isLight = currentTheme.id === 'light';
    const computedMaillard = Math.min(10.0, maillardBase);
    const computedHydration = Math.floor(62 + (selectedAddons.length * 1.5));

    return {
      price,
      calories,
      maillardIndex: computedMaillard.toFixed(1),
      hydration: `${computedHydration}%`,
      sku: `CUST-${activeBase.id.toUpperCase()}-${selectedAddons.length.toString().padStart(2, '0')}`
    };
  }, [activeBase, selectedAddons, currentTheme]);

  const handleCustomOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderedSuccess(true);
  };

  if (!isOpen) return null;

  const isLight = currentTheme.id === 'light';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xs transition-opacity duration-300">
      
      {/* Outer Click dismiss */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Main Panel Box */}
      <div
        className={`relative w-full max-w-3xl rounded-none border overflow-hidden shadow-2xl transition-all duration-300 flex flex-col md:flex-row z-10 ${currentTheme.cardBg} ${currentTheme.borderColor} ${currentTheme.textColor}`}
        id="culinary-customizer-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 border border-transparent hover:border-zinc-500/20 rounded-full transition-all cursor-pointer text-current z-25 bg-black/10"
          aria-label="Dismiss customizer"
        >
          <X className="w-4 h-4" />
        </button>

        {!orderedSuccess ? (
          <>
            {/* Left Sidebar: Real-Time Dynamic Blueprint Calculator & Diagnostics */}
            <div className={`md:w-5/12 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-300/10 min-h-[380px] md:min-h-[500px] bg-black/15`}>
              
              <div className="space-y-6">
                <div>
                  <span className="inline-block px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase mb-2.5" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                    LAB TESTING ENHANCED
                  </span>
                  
                  <h3 className="text-xl font-grotesk tracking-tight font-black uppercase">
                    Interactive Build
                  </h3>
                  <p className="text-[11px] opacity-70 font-sans mt-1">
                    Design a bespoke culinary build of balanced ingredients and review real-time thermodynamic feedback metrics.
                  </p>
                </div>

                {/* Simulated Wireframe Blueprint Burger Visual Block */}
                <div 
                  className={`p-4 border rounded-none flex flex-col justify-center items-center border-dashed font-mono text-[9px] relative min-h-[140px] bg-black/5 overflow-hidden`}
                  style={{ borderColor: `${accentColor}25` }}
                >
                  <div className="absolute top-2 left-2 text-[8px] opacity-40 font-mono">CAD SIMULATOR</div>
                  
                  {/* Dynamic Layers stack */}
                  <div className="flex flex-col-reverse items-center justify-center space-y-reverse space-y-1 w-full max-w-[170px] py-2 z-10">
                    <div className="w-full h-2.5 bg-amber-700/35 border border-dashed border-amber-600/40 rounded-b text-center text-[7px] leading-none opacity-90 font-bold uppercase py-[1px]">Toasted Heel Bun</div>
                    
                    {/* Add-ons layers in correct stack order */}
                    {selectedAddons.includes('pickled-chanterelle') && (
                      <div className="w-[85%] h-1.5 bg-emerald-950/40 border border-emerald-500/30 text-center text-[7px] leading-none py-0.2 select-none">Pickled Chanterelles</div>
                    )}
                    {selectedAddons.includes('confit-garlic') && (
                      <div className="w-[88%] h-1.5 bg-yellow-900/30 border border-yellow-500/30 text-center text-[7px] leading-none py-0.2 select-none">Garlic Butter Puree</div>
                    )}
                    {selectedAddons.includes('aged-gruyere') && (
                      <div className="w-[90%] h-1.5 bg-yellow-600/30 border border-yellow-500/40 text-center text-[7px] leading-none py-0.2 select-none">Aged Gruyère Slices</div>
                    )}
                    
                    {/* Base Patties Layer */}
                    <div className="w-[94%] h-4 bg-red-950/40 border border-red-500/40 rounded-sm text-center text-[7px] leading-none flex items-center justify-center font-bold font-mono py-0.5 select-none relative">
                      {selectedBaseId === 'wagyu' ? 'A5 Wagyu Patty Block' : selectedBaseId === 'double' ? 'Double Smash Beef Stack' : 'Single Smash Beef Ribbon'}
                      {selectedAddons.includes('extra-patty') && (
                        <span className="absolute -top-1 right-2 text-[6px] font-mono text-zinc-400 bg-black px-1 border border-zinc-800">+1 Patty</span>
                      )}
                    </div>
                    
                    {selectedAddons.includes('crispy-prosciutto') && (
                      <div className="w-[92%] h-1 bg-red-800/40 border border-red-500/30 text-center text-[6px] leading-none select-none">Crispy Prosciutto Sheet</div>
                    )}
                    {selectedAddons.includes('truffle-glaze') && (
                      <div className="w-[90%] h-1 bg-zinc-900/60 border border-neutral-600 text-center text-[5px] leading-none select-none italic text-neutral-400">Truffle Reduction Spray</div>
                    )}
                    {selectedAddons.includes('bone-marrow') && (
                      <div className="w-[90%] h-1.5 bg-amber-950/40 border border-amber-500/30 text-center text-[7px] leading-none py-0.2 select-none">Smoked Marrow Smear</div>
                    )}
                    
                    <div className="w-full h-3 bg-amber-600/30 border border-amber-600/40 rounded-t text-center text-[7px] leading-none font-bold uppercase py-0.5">Brioche Crown Bun</div>
                  </div>

                  {/* Crosshairs & subtle grid */}
                  <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed opacity-10 pointer-events-none" />
                  <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed opacity-10 pointer-events-none" />
                </div>

                {/* Grid of Dynamic Diagnostics */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono uppercase bg-black/20 p-3 border border-neutral-300/5">
                  <div className="border-r border-neutral-300/10 pr-2 pb-1 text-left space-y-0.5">
                    <span className="block text-[8px] opacity-40">Maillard Score</span>
                    <span className="font-extrabold text-[#E1FF01] flex items-center gap-1 leading-none text-xs" style={{ color: accentColor }}>
                      <Flame className="w-3 h-3 text-red-500 animate-pulse" />
                      {calculatedMetrics.maillardIndex} / 10.0
                    </span>
                  </div>
                  <div className="pl-2 pb-1 text-left space-y-0.5">
                    <span className="block text-[8px] opacity-40">CALORIC INTENSITY</span>
                    <span className="font-bold text-zinc-100 flex items-center gap-1 leading-none text-xs">
                      <Layers className="w-2.5 h-2.5 opacity-60 text-emerald-400" />
                      {calculatedMetrics.calories} kcal
                    </span>
                  </div>
                  <div className="border-r border-neutral-300/10 pr-2 pt-1 border-t text-left space-y-0.5">
                    <span className="block text-[8px] opacity-40">Bun Moisture</span>
                    <span className="font-bold text-zinc-100 flex items-center gap-1 leading-none text-xs">
                      <Compass className="w-2.5 h-2.5 opacity-60 text-sky-400" />
                      {calculatedMetrics.hydration}
                    </span>
                  </div>
                  <div className="pl-2 pt-1 border-t text-left space-y-0.5">
                    <span className="block text-[8px] opacity-40">CULINARY SKU</span>
                    <span className="font-mono text-zinc-300 font-medium text-[9px] truncate tracking-tight">
                      {calculatedMetrics.sku}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Tag & Dynamic Footprint */}
              <div className="pt-4 border-t border-neutral-300/10 mt-6 flex justify-between items-baseline">
                <div>
                  <span className="block text-[8px] font-mono opacity-50 uppercase">Calculated Value</span>
                  <span className="text-3xl font-black font-grotesk tracking-tight" style={{ color: isLight ? undefined : accentColor }}>
                    ${calculatedMetrics.price.toFixed(2)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block text-[8px] font-mono opacity-50 uppercase">Build Configuration</span>
                  <span className="text-[10px] font-mono text-zinc-400">[{selectedAddons.length + 1} elements loaded]</span>
                </div>
              </div>

            </div>

            {/* Right Pane: Option selectors */}
            <form onSubmit={handleCustomOrder} className="p-6 md:w-7/12 flex flex-col justify-between space-y-6">
              
              <div className="space-y-5 overflow-y-auto max-h-[380px] pr-1">
                <div className="space-y-1">
                  <span className="text-xs font-mono tracking-widest opacity-40 uppercase block">Step 01 / Bun & Meat Preset</span>
                  <h4 className="text-sm font-sans font-extrabold uppercase tracking-tight">
                    Select Your Baseline System
                  </h4>
                </div>

                {/* Preset bases list */}
                <div className="grid grid-cols-1 gap-2">
                  {PRESET_BASES.map(preset => {
                    const isSelected = selectedBaseId === preset.id;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setSelectedBaseId(preset.id)}
                        className={`p-3 text-left border rounded-none transition-all cursor-pointer relative ${
                          isSelected 
                            ? 'bg-zinc-800/10 font-bold border-current' 
                            : `${currentTheme.cardBg} ${currentTheme.borderColor} hover:bg-neutral-500/5`
                        }`}
                        style={{ borderColor: isSelected ? accentColor : undefined }}
                      >
                        <div className="flex justify-between items-center pr-4">
                          <span className="text-xs font-mono uppercase tracking-tight">{preset.name}</span>
                          <span className="text-xs font-mono font-bold" style={{ color: isSelected ? accentColor : undefined }}>${preset.price} • {preset.calories} kcal</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-sans mt-0.5 max-w-sm">
                          {preset.desc}
                        </p>
                        {isSelected && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-xs font-mono tracking-widest opacity-40 uppercase block">Step 02 / Premium Layer Infusion</span>
                  <h4 className="text-sm font-sans font-extrabold uppercase tracking-tight">
                    Infuse Premium Accessories
                  </h4>
                </div>

                {/* Add-ons list with checklist and descriptions */}
                <div className="space-y-2">
                  {PREMIUM_INGREDIENTS.map(ingredient => {
                    const isChecked = selectedAddons.includes(ingredient.id);
                    return (
                      <div
                        key={ingredient.id}
                        onClick={() => toggleAddon(ingredient.id)}
                        className={`p-2.5 border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isChecked 
                            ? 'bg-zinc-800/10 border-current' 
                            : `${currentTheme.borderColor} hover:bg-neutral-500/5`
                        }`}
                        style={{ 
                          borderColor: isChecked ? accentColor : undefined,
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 border flex items-center justify-center text-xs shrink-0 select-none transition-colors"
                            style={{ 
                              borderColor: isChecked ? accentColor : '#a1a1a140', 
                              backgroundColor: isChecked ? accentColor : 'transparent',
                              color: isChecked ? '#000000' : 'transparent'
                            }}
                          >
                            <Check className="w-3.5 h-3.5 font-bold" />
                          </div>

                          <div className="space-y-0.5">
                            <span className="text-[11px] font-semibold uppercase tracking-tight block">{ingredient.name}</span>
                            <span className="text-[9px] text-zinc-500 font-sans leading-none block line-clamp-1">{ingredient.description}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono font-bold block" style={{ color: isChecked ? accentColor : undefined }}>
                            +${ingredient.price.toFixed(2)}
                          </span>
                          <span className="text-[9px] font-mono opacity-60 block">+{ingredient.calories} kcal</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Prototype Ident Code custom name setting */}
                <div className="pt-2">
                  <label className="block text-[8px] font-mono uppercase tracking-wider mb-1 opacity-50">
                    Solder Custom Build ID Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Smash Prototype #01"
                    maxLength={28}
                    className={`w-full text-[10px] p-2 rounded bg-transparent border ${currentTheme.borderColor} focus:outline-none focus:ring-1 font-mono uppercase tracking-wider`}
                    style={{ '--tw-ring-color': accentColor } as React.CSSProperties}
                  />
                </div>

              </div>

              {/* Submit custom formula */}
              <div className="pt-3 border-t border-neutral-300/10">
                <button
                  type="submit"
                  className="w-full p-3 font-mono font-bold text-xs uppercase tracking-widest cursor-pointer flex items-center justify-center gap-2 hover:opacity-90 leading-none transition-all"
                  style={{ backgroundColor: accentColor, color: '#000000' }}
                >
                  <Sparkles className="w-4 h-4 animate-spin-slow" />
                  Order Custom Build System
                </button>
                <p className="text-[8px] font-mono opacity-50 text-center mt-2.5">
                  Submitting will transmit custom formula and mock price details directly into our kitchen terminal queue.
                </p>
              </div>

            </form>
          </>
        ) : (
          /* Ordered/Calculated receipt summary */
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-6 w-full py-14">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full animate-bounce" style={{ backgroundColor: `${accentColor}15` }}>
              <CheckCircle2 className="w-9 h-9" style={{ color: accentColor }} />
            </div>

            <div className="space-y-2 max-w-md">
              <span className="text-[10px] font-mono uppercase tracking-widest opacity-60 block">TRANSMISSION COMPLETED</span>
              <h3 className="text-2xl font-grotesk font-black uppercase tracking-tight">KITCHEN QUEUE INJECTED!</h3>
              <p className="text-xs opacity-75 font-sans leading-relaxed">
                Your custom craft formula <span className="font-mono text-white px-1.5 py-0.5 rounded bg-zinc-800" style={{ color: accentColor }}>"{customName}"</span> has been compiled and printed at our primary smash station.
              </p>
            </div>

            {/* Compiled Recipe Card Receipt */}
            <div className="p-4 w-full max-w-md border text-left font-mono text-[11px] divide-y divide-neutral-300/10 bg-black/25 relative" style={{ borderColor: `${accentColor}40` }}>
              <div className="pb-3 flex justify-between items-center text-zinc-400">
                <span>CULINARY BLUEPRINT:</span>
                <span className="font-bold text-white">{calculatedMetrics.sku}</span>
              </div>
              
              <div className="py-2.5 space-y-1.5">
                <div className="flex justify-between">
                  <span className="opacity-60">System Base:</span>
                  <span className="uppercase font-bold">{activeBase.name}</span>
                </div>
                
                {selectedAddons.length > 0 && (
                  <div className="space-y-0.5">
                    <span className="opacity-60 block">Loaded Enhancements:</span>
                    {selectedAddons.map(addonId => {
                      const ing = PREMIUM_INGREDIENTS.find(i => i.id === addonId);
                      return (
                        <div key={addonId} className="pl-3 text-[10px] font-mono text-zinc-400 flex justify-between">
                          <span>+ {ing?.name}</span>
                          <span>+${ing?.price.toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="py-2.5 space-y-1">
                <div className="flex justify-between">
                  <span className="opacity-60">Maillard Score:</span>
                  <span className="font-bold text-[#E1FF01]" style={{ color: accentColor }}>{calculatedMetrics.maillardIndex} / 10.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Solder Heat Profile:</span>
                  <span className="font-bold text-zinc-300">450°F Skillet</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Total Weight Estim:</span>
                  <span className="font-bold text-zinc-300">{(0.35 + (selectedAddons.length * 0.04)).toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Thermodynamic Volume:</span>
                  <span className="font-bold font-sans text-white">{calculatedMetrics.calories} kcal</span>
                </div>
              </div>

              <div className="pt-3 flex justify-between items-baseline font-grotesk text-sm">
                <span className="font-mono text-[10px] uppercase opacity-75">Solder Base Price:</span>
                <span className="text-xl font-bold font-grotesk" style={{ color: accentColor }}>
                  ${calculatedMetrics.price.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="space-y-2.5 pt-4">
              <p className="text-[10px] font-mono opacity-50">
                SIMULATION TRANSMIT TICK: <strong className="font-bold text-zinc-200">#{(Math.random() * 95000 + 4000).toFixed(0)}-CUST</strong>
              </p>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setOrderedSuccess(false);
                    setSelectedAddons(['bone-marrow']);
                    setCustomName('Smash Prototype #01');
                  }}
                  className="px-4 py-2 border rounded-none text-[10px] font-mono uppercase tracking-widest hover:bg-neutral-100/10 cursor-pointer"
                  style={{ borderColor: `${accentColor}30`, color: accentColor }}
                >
                  Configure Another
                </button>
                <button
                  onClick={() => {
                    setOrderedSuccess(false);
                    onClose();
                  }}
                  className="px-4 py-2 border rounded-none text-[10px] font-mono uppercase tracking-widest bg-zinc-900 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 cursor-pointer text-white"
                >
                  Return to Storefront
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
