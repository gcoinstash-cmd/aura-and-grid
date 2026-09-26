import React from 'react';
import { Sparkles, Compass, AlertCircle, FileText } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  appCount: number;
  openHostDashboard: () => void;
}

export default function Header({ currentTab, setCurrentTab, appCount, openHostDashboard }: HeaderProps) {
  return (
    <header className="border-b border-ink/10 sticky top-0 bg-alabaster/95 backdrop-blur-md z-40 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: Brand logo & design subtitle */}
        <div className="flex flex-col">
          <div 
            onClick={() => setCurrentTab('portfolio')} 
            className="cursor-pointer font-serif text-2xl font-semibold tracking-wider text-ink hover:opacity-80 transition"
          >
            RETREAT <span className="font-light italic text-ochre">OS</span>
          </div>
          <span className="text-[9px] uppercase tracking-[0.25em] text-[#5A6455] font-semibold mt-0.5">
            Boutique E-Commerce System
          </span>
        </div>

        {/* Center: Editorial navigation */}
        <nav className="hidden md:flex items-center space-x-10 text-[11px] uppercase tracking-[0.2em] font-medium text-ink/75">
          <button
            onClick={() => setCurrentTab('portfolio')}
            className={`hover:text-ink transition relative py-1 cursor-pointer ${
              currentTab === 'portfolio' ? 'text-ink font-semibold' : 'text-ink/60'
            }`}
          >
            Digital Storefront
            {currentTab === 'portfolio' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ochre" />
            )}
          </button>
          
          <button
            onClick={() => setCurrentTab('details')}
            className={`hover:text-ink transition relative py-1 cursor-pointer ${
              currentTab === 'details' ? 'text-ink font-semibold' : 'text-ink/60'
            }`}
          >
            Program Details
            {currentTab === 'details' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ochre" />
            )}
          </button>

          <button
            onClick={() => setCurrentTab('host')}
            className={`hover:text-ink transition relative py-1 cursor-pointer ${
              currentTab === 'host' ? 'text-ink font-semibold' : 'text-ink/60'
            }`}
          >
            Expert Credentials
            {currentTab === 'host' && (
              <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-ochre" />
            )}
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center space-x-4">
          {appCount > 0 && (
            <button
              onClick={openHostDashboard}
              aria-label="View submitted applications"
              className="group hidden sm:flex items-center space-x-2 text-[10px] uppercase tracking-widest text-[#C4A482] bg-[#C4A482]/5 hover:bg-[#C4A482]/10 border border-[#C4A482]/25 px-3 py-1.5 rounded transition duration-200 cursor-pointer"
            >
              <FileText size={12} className="text-ochre animate-pulse" />
              <span>[ {appCount} APPLICATION{appCount > 1 ? 'S' : ''} ]</span>
            </button>
          )}

          <button
            onClick={() => setCurrentTab('apply')}
            className="bg-ink hover:bg-[#5A6455] text-alabaster hover:text-white text-[11px] uppercase tracking-[0.2em] font-medium px-5 py-2.5 transition duration-300 hover:shadow-sm cursor-pointer"
          >
            Purchase Template
          </button>
        </div>
      </div>
    </header>
  );
}
