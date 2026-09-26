import React, { useState } from 'react';
import { GearItem } from '../types';
import { GEAR_LIST, MODE_LABEL_CONFIG } from '../data';
import { Cpu, HardDrive, Zap, Info, Layers, ToggleLeft, ToggleRight, Check } from 'lucide-react';

interface GearListProps {
  gearItems?: GearItem[];
  setGearItems?: React.Dispatch<React.SetStateAction<GearItem[]>>;
  activeCables?: Record<string, boolean>;
  setActiveCables?: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  templateMode?: 'PRODUCER_MATRIX' | 'CREATIVE_ENTERPRENEUR';
}

export const GearList: React.FC<GearListProps> = ({
  gearItems: propGearItems,
  setGearItems: propSetGearItems,
  activeCables,
  setActiveCables,
  templateMode = 'PRODUCER_MATRIX'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeGearId, setActiveGearId] = useState<string>('gear_01');
  const [localGearItems, setLocalGearItems] = useState<GearItem[]>(GEAR_LIST);

  const gearItems = propGearItems || localGearItems;
  const setGearItems = propSetGearItems || setLocalGearItems;

  const categories = ['ALL', 'Synthesizer', 'Drum Machine', 'Effect Processor', 'Eurorack Module'];

  const filteredItems = selectedCategory === 'ALL' 
    ? gearItems 
    : gearItems.filter(item => item.category === selectedCategory);

  const activeGear = gearItems.find(item => item.id === activeGearId) || gearItems[0];

  const togglePatchStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid switching selection
    const item = gearItems.find(g => g.id === id);
    if (!item) return;

    if (item.status !== 'inactive' && activeCables && activeCables[id]) {
      // Cable is present, so click toggles it off
      if (setActiveCables) {
        setActiveCables(prev => ({ ...prev, [id]: false }));
      }
    } else {
      // Cable is off (or item is inactive), so let's change status and turn cable ON
      setGearItems(prev => prev.map(g => {
        if (g.id === id) {
          let nextStatus: GearItem['status'] = 'inactive';
          if (g.status === 'inactive') nextStatus = 'online';
          else if (g.status === 'online') nextStatus = 'patched';
          else nextStatus = 'inactive';

          const isNextActive = nextStatus !== 'inactive';
          if (setActiveCables) {
            setActiveCables(prev => ({ ...prev, [id]: isNextActive }));
          }
          return { ...g, status: nextStatus };
        }
        return g;
      }));
    }
  };

  return (
    <div id="echo-hardware-section" className="bg-[#050505] border border-[#1A1A1A] p-6 lg:p-8 flex flex-col gap-6 relative">
      <div className="absolute top-0 right-0 w-24 h-24 bg-radial from-cyan-500/5 to-transparent pointer-events-none" />

      {/* Title & Section Label */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#1A1A1A] pb-5">
        <div>
          <span className="text-cyan-400 text-[10px] font-mono uppercase tracking-[0.25em] font-bold">
            {MODE_LABEL_CONFIG[templateMode].gearManifestSub}
          </span>
          <h2 className="text-white text-xl font-light tracking-tight uppercase">
            {MODE_LABEL_CONFIG[templateMode].gearListTitle}
          </h2>
        </div>
        
        {/* Quick Category Filter Pills */}
        <div className="flex flex-wrap gap-1 bg-[#090909] p-1 border border-stone-900 rounded">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[9px] font-mono uppercase tracking-wide transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-stone-800 text-white font-bold' 
                  : 'text-stone-500 hover:text-stone-300'
              }`}
            >
              {cat.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* List of hardware in small monospace font - taking 7/12 width */}
        <div className="lg:col-span-7 flex flex-col gap-2 h-[340px] overflow-y-auto pr-2">
          {filteredItems.map((item) => {
            const isSelected = item.id === activeGearId;
            return (
              <div
                key={item.id}
                onClick={() => setActiveGearId(item.id)}
                className={`group p-3 border text-left cursor-pointer transition-all flex justify-between items-center ${
                  isSelected 
                    ? 'border-[#00F0FF]/30 bg-[#00F0FF]/3 text-white' 
                    : 'border-[#141414] bg-[#070707] text-stone-400 hover:border-stone-800 hover:bg-[#0A0A0A]'
                }`}
                title="Click to view detailed board specifications"
              >
                <div className="space-y-1.5 flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-cyan-500 bg-cyan-950/30 px-1 py-0.2">
                      {item.id}
                    </span>
                    <h3 className="text-white text-xs font-mono font-bold truncate group-hover:text-cyan-400 transition-colors">
                      {item.brand.toUpperCase()} {item.name.toUpperCase()}
                    </h3>
                  </div>
                  
                  {/* Specs excerpt inside list using tiny monospaced view */}
                  <div className="flex items-center gap-3 text-[9px] font-mono text-stone-500">
                    <span className="bg-stone-900 px-1 text-[8px] uppercase">{item.category}</span>
                    <span className="truncate">
                      {Object.entries(item.specs).slice(0, 2).map(([k,v]) => `${k}:${v}`).join(' | ')}
                    </span>
                  </div>
                </div>

                {/* Status Indicator & Interactive Patch Connector */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right flex flex-col items-end">
                    <span className="text-[8px] font-mono text-stone-500 uppercase">SYS PATCH</span>
                    {(() => {
                      const isCableActive = activeCables ? !!activeCables[item.id] : false;
                      let badgeClass = '';
                      let badgeText = '';

                      if (item.status === 'online') {
                        if (isCableActive) {
                          badgeClass = 'text-black bg-[#00FF41] border-[#00FF41] shadow-[0_0_8px_rgba(0,255,65,0.5)] font-extrabold';
                          badgeText = '● ONLINE';
                        } else {
                          badgeClass = 'text-[#00FF41] bg-neutral-950 border-[#00FF41]/30 opacity-70';
                          badgeText = '○ STBY';
                        }
                      } else if (item.status === 'patched') {
                        if (isCableActive) {
                          badgeClass = 'text-black bg-cyan-450 border-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.5)] font-extrabold bg-cyan-400';
                          badgeText = '● PATCHED';
                        } else {
                          badgeClass = 'text-cyan-400 bg-neutral-950 border-cyan-400/30 opacity-70';
                          badgeText = '○ STBY';
                        }
                      } else {
                        badgeClass = 'text-stone-500 bg-neutral-900 border-stone-800';
                        badgeText = '○ OFFLINE';
                      }

                      return (
                        <button
                          id={`patch-badge-${item.id}`}
                          onClick={(e) => togglePatchStatus(item.id, e)}
                          className={`text-[9px] font-mono uppercase py-0.5 px-2 rounded border transition-all cursor-pointer select-none ${badgeClass}`}
                          title={isCableActive ? "Click to toggle/bypass physical SVG cable line" : "Click to connect/cycle hardware status"}
                        >
                          {badgeText}
                        </button>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Technical Specification Inspector Board - taking 5/12 width */}
        <div className="lg:col-span-5 bg-[#080808] border border-[#141414] p-4 flex flex-col justify-between h-[340px] relative">
          
          {/* Cyber accents */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-800" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-800" />

          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[8px] font-mono text-stone-500 uppercase tracking-widest block">Unit Spec Inspector</span>
                <span className="text-white text-sm font-mono font-bold tracking-tight uppercase">
                  {activeGear.brand} {activeGear.name}
                </span>
              </div>
              <Cpu className="w-5 h-5 text-stone-600" />
            </div>

            <p className="text-[10px] font-mono text-stone-400 leading-relaxed bg-[#0A0A0A] p-2 border border-stone-900">
              {activeGear.description}
            </p>

            {/* Micro specs key-value table */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[9px] font-mono text-stone-500 uppercase block tracking-wider">HARDWARE REGISTERS:</span>
              <div className="divide-y divide-[#151515] overflow-y-auto max-h-32 text-[10px] font-mono pr-1">
                {Object.entries(activeGear.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1 items-baseline">
                    <span className="text-stone-500 select-none uppercase text-[9px]">{key}</span>
                    <span className="text-stone-300 text-right truncate pl-4 max-w-[200px]" title={value}>
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Electronic current and Rack Dimension Specs Footer */}
          <div className="border-t border-[#141414] pt-3 flex justify-between items-center text-[9px] font-mono text-stone-600">
            <div className="flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-cyan-600" />
              <span>SIZE: {activeGear.rackSpace || 'DESKTOP'}</span>
            </div>
            {activeGear.powerDraw && (
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3 text-[#00FF41]" />
                <span>LOAD: {activeGear.powerDraw}</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
