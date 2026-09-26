import React, { useState } from 'react';
import { Project, CopyPromptItem } from '../types';
import { COPY_PROMPTS, TEMPLATE_SETUP_GUIDE } from '../data';
import { Copy, Check, ArrowUpRight, Cpu, HelpCircle } from 'lucide-react';

interface AppUiProps {
  currentVariant: 'monograph' | 'studio' | 'residential';
  onChangeVariant: (variant: 'monograph' | 'studio' | 'residential') => void;
  onNavigateToPage: (page: string) => void;
  activePage: string;
  activeConsoleTab: 'variants' | 'prompts' | 'setup' | 'sales';
  onConsoleTabChange: (tab: 'variants' | 'prompts' | 'setup' | 'sales') => void;
  gridDensity: 'tight' | 'lax';
  onChangeGridDensity: (density: 'tight' | 'lax') => void;
  themeMode: 'muted' | 'high';
  onChangeThemeMode: (mode: 'muted' | 'high') => void;
}

export const AppUi: React.FC<AppUiProps> = ({
  currentVariant,
  onChangeVariant,
  onNavigateToPage,
  activePage,
  activeConsoleTab,
  onConsoleTabChange,
  gridDensity,
  onChangeGridDensity,
  themeMode,
  onChangeThemeMode
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedSetup, setCopiedSetup] = useState<boolean>(false);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopySetupGuide = () => {
    navigator.clipboard.writeText(TEMPLATE_SETUP_GUIDE);
    setCopiedSetup(true);
    setTimeout(() => setCopiedSetup(false), 2000);
  };

  return (
    <div className="font-mono text-xs border-[0.5px] border-stone-base/60 bg-[#FAFAF9]" id="developer-portfolio-sandbox">
      
      {/* Console Identity Header - Ultra Razor Thin */}
      <div className="border-b-[0.5px] border-stone-base/60 p-4 flex items-center justify-between bg-white text-graphite-dark">
        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-bronze-dark" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A]">
            PERSPECTIVE // CRITICAL MODULE
          </span>
        </div>
        <span className="text-[8px] bg-stone-dark text-white select-none px-1.5 py-0.5 uppercase tracking-widest">
          SYS STATUS: LIVE
        </span>
      </div>

      {/* PARAMETER CONTROL MATRIX - Two core interactive options requested */}
      <div className="grid grid-cols-2 border-b-[0.5px] border-stone-base/60 divide-x-[0.5px] divide-stone-base/60 bg-white">
        
        {/* Toggle 1: Grid Density */}
        <div className="p-3 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">GRID DENSITY</span>
            <span className="text-[8px] text-bronze-light font-bold">[{gridDensity === 'tight' ? 'TGT' : 'LAX'}]</span>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-stone-light/40 p-0.5 rounded-none border-[0.5px] border-stone-base/30">
            <button
              onClick={() => onChangeGridDensity('tight')}
              className={`py-1 text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                gridDensity === 'tight'
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Tight
            </button>
            <button
              onClick={() => onChangeGridDensity('lax')}
              className={`py-1 text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                gridDensity === 'lax'
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Lax
            </button>
          </div>
        </div>

        {/* Toggle 2: Contrast Theme Mode */}
        <div className="p-3 flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-[9px] text-gray-500 font-bold uppercase tracking-wider">CONTRAST MODE</span>
            <span className="text-[8px] text-bronze-light font-bold">[{themeMode === 'high' ? 'HI' : 'MUT'}]</span>
          </div>
          <div className="grid grid-cols-2 gap-1 bg-stone-light/40 p-0.5 rounded-none border-[0.5px] border-stone-base/30">
            <button
              onClick={() => onChangeThemeMode('muted')}
              className={`py-1 text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                themeMode === 'muted'
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              Muted
            </button>
            <button
              onClick={() => onChangeThemeMode('high')}
              className={`py-1 text-[9px] uppercase tracking-wider transition-all cursor-pointer ${
                themeMode === 'high'
                  ? 'bg-[#1A1A1A] text-white font-bold'
                  : 'text-gray-400 hover:text-[#1A1A1A]'
              }`}
            >
              High
            </button>
          </div>
        </div>

      </div>

      {/* Navigation Sub-Tabs */}
      <div className="grid grid-cols-4 border-b-[0.5px] border-stone-base/60 divide-x-[0.5px] divide-stone-base/60 bg-white text-center">
        {(['variants', 'prompts', 'setup', 'sales'] as const).map((tab) => (
          <button
            key={tab}
            id={`tab-btn-${tab}`}
            onClick={() => onConsoleTabChange(tab)}
            className={`py-2 text-[9px] uppercase tracking-widest transition-all cursor-pointer font-bold ${
              activeConsoleTab === tab
                ? 'bg-stone-dark text-white'
                : 'text-gray-400 hover:text-black hover:bg-stone-light/30'
            }`}
          >
            {tab === 'variants' && 'Variant'}
            {tab === 'prompts' && 'Prompts'}
            {tab === 'setup' && 'Manual'}
            {tab === 'sales' && 'Sales'}
          </button>
        ))}
      </div>

      {/* Tab Content Room - Mono layout with ultra-thin line framing */}
      <div className="p-4 bg-white/70 select-none">
        
        {/* VIEW 1: Variants Selector list */}
        {activeConsoleTab === 'variants' && (
          <div className="space-y-3 font-mono" id="toolkit-variants-pane">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed border-b border-dashed border-stone-base/40 pb-2">
              STRUCTURAL NARRATIVES:
            </div>
            
            <div className="space-y-2">
              {[
                {
                  id: 'monograph',
                  symbol: 'A',
                  title: 'Monograph Landing',
                  spec: 'Focus on a single raw concrete structure'
                },
                {
                  id: 'studio',
                  symbol: 'B',
                  title: 'Studio Philosophy',
                  spec: 'Highlight the geotech material lab values'
                },
                {
                  id: 'residential',
                  symbol: 'C',
                  title: 'Residential Grid',
                  spec: 'Focus on asymmetrical interior spaces'
                }
              ].map((v) => (
                <button
                  key={v.id}
                  id={`variant-sel-${v.id}`}
                  onClick={() => {
                    onChangeVariant(v.id as 'monograph' | 'studio' | 'residential');
                    onNavigateToPage('home');
                  }}
                  className={`w-full text-left p-3 border-[0.5px] transition-all flex flex-col gap-1.5 rounded-none ${
                    currentVariant === v.id
                      ? 'border-[#1A1A1A] bg-white text-black'
                      : 'border-stone-base/40 bg-stone-light/10 text-gray-400 hover:border-black/30 hover:bg-white hover:text-black'
                  }`}
                >
                  <div className="flex justify-between items-baseline w-full">
                    <span className="text-[11px] font-bold tracking-wider uppercase">
                      {v.symbol} // {v.title}
                    </span>
                    {currentVariant === v.id && (
                      <span className="text-[8px] bg-[#1A1A1A] text-white px-1 font-bold">ACTIVE</span>
                    )}
                  </div>
                  <span className="text-[10px] leading-relaxed font-light">
                    {v.spec}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 2: Copy Vault prompt system */}
        {activeConsoleTab === 'prompts' && (
          <div className="space-y-3 font-mono" id="toolkit-prompts-pane">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-dashed border-stone-base/40 pb-2 flex justify-between items-center">
              <span>PROMPT CLIPBOARD UTILITY</span>
              <span className="text-[8px] text-[#8C7A5B]">GEN-V1</span>
            </div>

            <div className="space-y-3 h-80 overflow-y-auto pr-1 no-scrollbar">
              {COPY_PROMPTS.map((prompt) => (
                <div key={prompt.id} className="border-[0.5px] border-stone-base/60 p-3 bg-white space-y-2">
                  <div className="flex justify-between items-center border-b border-stone-light pb-1.5">
                    <span className="text-[9px] text-[#8C7A5B] font-bold tracking-wider">{prompt.label}</span>
                    <button
                      id={`copy-prompt-btn-${prompt.id}`}
                      onClick={() => handleCopyText(prompt.prompt, prompt.id)}
                      className="text-gray-400 hover:text-black transition-all flex items-center gap-1 text-[8px] uppercase tracking-wider font-bold cursor-pointer"
                    >
                      {copiedId === prompt.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="text-[9px] text-gray-400 italic">
                    CTX: {prompt.context}
                  </div>
                  <div className="text-[10px] text-graphite-dark bg-stone-light/10 p-2 border-[0.5px] border-stone-base/30 leading-relaxed font-light pr-2 select-all break-words">
                    {prompt.prompt}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 3: Fine manuals */}
        {activeConsoleTab === 'setup' && (
          <div className="space-y-3 font-mono" id="toolkit-setup-pane">
            <div className="flex justify-between items-baseline border-b border-dashed border-stone-base/40 pb-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest">SETUP MANUAL</span>
              <button
                id="copy-setup-manual-inline"
                onClick={handleCopySetupGuide}
                className="text-[8px] uppercase text-[#8C7A5B] hover:text-black transition-all flex items-center gap-1 cursor-pointer font-bold"
              >
                {copiedSetup ? (
                  <>
                    <Check className="w-2.5 h-2.5 text-emerald-600" />
                    <span className="text-emerald-600">COPIED</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-2.5 h-2.5" />
                    <span>COPY RAW MD</span>
                  </>
                )}
              </button>
            </div>

            <div className="border-[0.5px] border-stone-base/60 bg-white p-3 h-80 overflow-y-auto no-scrollbar font-mono text-[10px] leading-relaxed space-y-4 pr-1 text-gray-600 font-light">
              <div>
                <span className="block text-black font-bold uppercase tracking-wider mb-1">[A1] CAD SHEET REPLACEMENTS</span>
                <p>
                  Deploy your transparent architectural design schemas in the SVG vector frames within `DirectCase.tsx`. Clean contrast guarantees seamless responsive fits on dynamic viewports.
                </p>
              </div>

              <div>
                <span className="block text-black font-bold uppercase tracking-wider mb-1">[A2] KEY-VALUE PROPERTIES</span>
                <p>
                  Metric properties (collaborators, gross areas, orientations) are queried dynamic from types.ts interface definitions. Refactor keys inside `data.ts` to refresh globally.
                </p>
              </div>

              <div>
                <span className="block text-black font-bold uppercase tracking-wider mb-1">[A3] DOMAIN DNS REDILECTION</span>
                <p>
                  Deploy via Gumroad / Vercel hooks. To attach a customized domain, match records directly to public namespaces with single-pointed CNAME rules.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Portfolio Sales Mechanics */}
        {activeConsoleTab === 'sales' && (
          <div className="space-y-3 font-mono" id="toolkit-sales-pane">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest border-b border-dashed border-stone-base/40 pb-2">
              COMMERCE POSITIONING ANGLE
            </div>

            <div className="border-[0.5px] border-stone-base/60 bg-white p-3 space-y-3">
              <span className="block text-[8px] text-bronze-light font-bold uppercase tracking-wide">
                MERCHANTS & DESIGNERS STRATEGY //
              </span>
              <p className="text-[10px] leading-relaxed text-gray-500 font-light">
                This presentation bundle is designed to elevate the pricing power of architectural studios. It highlights structural integrity over superficial decorating trends:
              </p>

              <div className="space-y-2 pt-1 border-t border-stone-light">
                <div className="flex gap-2 items-start text-[9.5px] leading-tight text-gray-600">
                  <span className="text-[#8C7A5B] font-bold">01</span>
                  <span><strong>Visual Blueprint Shifter</strong>: Proves CAD architectural precision immediately on active project screens.</span>
                </div>
                <div className="flex gap-2 items-start text-[9.5px] leading-tight text-gray-600">
                  <span className="text-[#8C7A5B] font-bold">02</span>
                  <span><strong>Multi-Narrative Home variants</strong>: Swaps home layouts between focused Monographs and full Studios cleanly.</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
