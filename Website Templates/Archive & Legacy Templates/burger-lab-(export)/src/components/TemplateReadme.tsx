/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FileText, ChevronRight, FileJson, SquareTerminal, CircleAlert, Globe } from 'lucide-react';
import { ThemeConfig } from '../types';

interface TemplateReadmeProps {
  currentTheme: ThemeConfig;
  accentColor: string;
}

type FileTab = 'readme' | 'presets' | 'guide';

export default function TemplateReadme({ currentTheme, accentColor }: TemplateReadmeProps) {
  const [activeTab, setActiveTab] = useState<FileTab>('readme');

  return (
    <div className={`border rounded-lg overflow-hidden flex flex-col h-[400px] text-xs font-mono ${currentTheme.borderColor} ${currentTheme.cardBg}`}>
      {/* File Tree Header */}
      <div className={`p-2.5 border-b flex justify-between items-center bg-black/15 ${currentTheme.borderColor}`}>
        <div className="flex items-center gap-2">
          <SquareTerminal className="w-3.5 h-3.5" style={{ color: accentColor }} />
          <span className="font-bold uppercase tracking-wider text-[10px]">Developer Asset Explorer</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded opacity-75 border" style={{ borderColor: `${accentColor}30` }}>
          SECURE BUNDLE
        </span>
      </div>

      {/* Navigation tabs */}
      <div className={`flex border-b bg-black/5 ${currentTheme.borderColor}`}>
        <button
          onClick={() => setActiveTab('readme')}
          className={`flex-1 py-1.5 text-center border-r hover:bg-black/10 cursor-pointer ${
            activeTab === 'readme' ? 'font-bold border-b-2' : 'opacity-60'
          }`}
          style={{ 
            borderBottomColor: activeTab === 'readme' ? accentColor : 'transparent',
            borderRightColor: currentTheme.borderColor.replace('border-', '') 
          }}
        >
          README.md
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 text-center border-r hover:bg-black/10 cursor-pointer ${
            activeTab === 'presets' ? 'font-bold border-b-2' : 'opacity-60'
          }`}
          style={{ 
            borderBottomColor: activeTab === 'presets' ? accentColor : 'transparent',
            borderRightColor: currentTheme.borderColor.replace('border-', '') 
          }}
        >
          brand_presets.ts
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 py-1.5 text-center hover:bg-black/10 cursor-pointer ${
            activeTab === 'guide' ? 'font-bold border-b-2' : 'opacity-60'
          }`}
          style={{ borderBottomColor: activeTab === 'guide' ? accentColor : 'transparent' }}
        >
          Setup Guide
        </button>
      </div>

      {/* Code view panel */}
      <div className="flex-1 overflow-y-auto p-4 leading-relaxed font-mono select-text bg-[#090909] text-gray-300">
        {activeTab === 'readme' && (
          <div className="space-y-4">
            <div>
              <span className="text-emerald-500 font-bold"># AURA & GRID: BURGER LAB PRESETS</span>
              <p className="text-gray-400 mt-1">Sleek, editorial-meets-experimental responsive theme for premium Gumroad asset markets.</p>
            </div>

            <div className="space-y-1">
              <span className="text-[#E1FF01] font-bold">## QUICKSTART LAUNCH GUIDE:</span>
              <p className="text-neutral-400">1. Clone or unpack the delivery file: <strong className="text-white">burger-lab-assets.zip</strong></p>
              <p className="text-neutral-400">2. Run <strong className="text-white">npm install</strong> inside your local directory.</p>
              <p className="text-neutral-400">3. Boot the dynamic development server: <strong className="text-white">npm run dev</strong></p>
              <p className="text-neutral-400">4. Tailor copy inside <strong className="text-white">/src/data.ts</strong> directly.</p>
            </div>

            <div className="space-y-1 pt-1.5">
              <span className="text-purple-400 font-bold">## FILE ARCHITECTURE:</span>
              <p className="text-neutral-400">├── src/</p>
              <p className="text-neutral-400">│   ├── <span className="text-white">data.ts</span> &lt;-- Swap burgers, prices, specs</p>
              <p className="text-neutral-400">│   ├── <span className="text-white">index.css</span> &lt;-- Define primary palettes & curves</p>
              <p className="text-neutral-400">│   ├── <span className="text-white">App.tsx</span> &lt;-- Structural Grid sections</p>
              <p className="text-neutral-400">├── package.json &lt;-- Standard React 19 + Tailwind v4 deps</p>
            </div>

            <div className="p-2 border border-red-500/20 rounded bg-red-950/10 flex items-start gap-2">
              <CircleAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[10px] text-red-300/90 leading-normal">
                To keep this site looking exceptionally premium, please adhere strictly to single sharp accent values and high negative spacing. Avoid neon rainbow styling.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'presets' && (
          <div className="space-y-3">
            <div>
              <span className="text-blue-400">export const</span> <span className="text-purple-400">BRAND_PRESETS</span> = &#123;
            </div>

            <div className="pl-4 space-y-1 text-gray-400">
              <div><span className="text-[#E1FF01]">"burger-lab"</span>: &#123;</div>
              <div className="pl-4">accentHex: <span className="text-amber-500">"#E1FF01"</span>,</div>
              <div className="pl-4">theme: <span className="text-amber-500">"bone-white"</span>,</div>
              <div className="pl-4">corners: <span className="text-amber-500">"rounded-none"</span>,</div>
              <div className="pl-4">gridMultiplier: <span className="text-yellow-500">1.2</span></div>
              <div>&#125;,</div>

              <div><span className="text-[#DC2626]">"smash-theory"</span>: &#123;</div>
              <div className="pl-4">accentHex: <span className="text-amber-500">"#DC2626"</span>,</div>
              <div className="pl-4">theme: <span className="text-amber-500">"matte-black"</span>,</div>
              <div className="pl-4">corners: <span className="text-amber-500">"rounded-sm"</span>,</div>
              <div className="pl-4 font-bold text-white">// Aggressive carbon edges</div>
              <div>&#125;,</div>
              
              <div><span className="text-[#1E3F20]">"field-notes"</span>: &#123;</div>
              <div className="pl-4">accentHex: <span className="text-amber-500">"#1E3F20"</span>,</div>
              <div className="pl-4">theme: <span className="text-amber-500">"natural-warm"</span>,</div>
              <div className="pl-4">corners: <span className="text-amber-500">"rounded-md"</span></div>
              <div>&#125;</div>
            </div>

            <div>&#125;;</div>

            <p className="text-[10px] opacity-60 text-neutral-400 pt-2 font-mono">
              // Custom hook automatically resolves these to primary root elements on trigger.
            </p>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-4">
            <div>
              <span className="text-amber-400 font-bold"># CUSTOMIZATION PROTOCOL</span>
              <p className="text-neutral-400 mt-1">To preserve premium visual value, follow these design mandates:</p>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">1. Typography Pairings</span>
                  <p className="text-neutral-400">Use <strong className="text-white">Space Grotesk</strong> for bold display titles to keep that tech-culinary product look. Pair it with standard <strong className="text-white">Inter</strong> for rich, compact description blocks.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">2. Accent Restraint</span>
                  <p className="text-neutral-400">Only color vital markers (e.g. active tab line, premium review stars, CTA icons). The background MUST remain neutral: either bone, dark charcoal, or brushed gray steel.</p>
                </div>
              </div>

              <div className="flex gap-2">
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">3. Clear Packaging Visuals</span>
                  <p className="text-neutral-400">When showcasing this template on Gumroad, screenshot the light and dark layouts side-by-side. Highlight the structured burger specs to justify the premium pricetag.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer info */}
      <div className={`p-2 border-t bg-black/10 text-[10px] opacity-80 flex items-center justify-between ${currentTheme.borderColor}`}>
        <span className="flex items-center gap-1">
          <Globe className="w-3 h-3 text-emerald-500" />
          <span>Vite standard build format validated</span>
        </span>
        <span>v2.8.1-production</span>
      </div>
    </div>
  );
}
