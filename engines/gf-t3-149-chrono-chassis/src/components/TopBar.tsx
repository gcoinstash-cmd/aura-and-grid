import React from 'react';

interface TopBarProps {
  onOpenTradeDress: () => void;
  onOpenDealership: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenTradeDress,
  onOpenDealership,
  activeSection,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#06080c]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 py-4 w-full">
        {/* Zone 1: Single text element wordmark with guaranteed clearance */}
        <a
          href="#showroom"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('showroom');
          }}
          className="text-lg font-black tracking-wider text-white font-display hover:text-emerald-400 transition-colors shrink-0 mr-6"
        >
          CHRONO-ARBITRAGE
        </a>

        {/* Zone 2: Navigation links with gap-2 sm:gap-4 and overflow handling */}
        <nav className="flex items-center gap-2 sm:gap-4 shrink overflow-x-auto text-xs font-mono font-medium text-slate-400 py-1 scrollbar-none">
          <button
            onClick={() => onNavigate('showroom')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap relative ${
              activeSection === 'showroom'
                ? 'bg-slate-800/80 text-emerald-400 font-bold'
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Showroom
          </button>

          <button
            onClick={() => onNavigate('telemetry')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap relative ${
              activeSection === 'telemetry'
                ? 'bg-slate-800/80 text-emerald-400 font-bold'
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Telemetry HUD
          </button>

          <button
            onClick={() => onNavigate('specifications')}
            className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap relative ${
              activeSection === 'specifications'
                ? 'bg-slate-800/80 text-emerald-400 font-bold'
                : 'hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Engineering
          </button>

          <button
            onClick={onOpenTradeDress}
            className="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-amber-400/90 hover:text-amber-300 hover:bg-slate-800/50"
          >
            Trade-Dress IP
          </button>

          <button
            onClick={onOpenDealership}
            className="px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/50"
          >
            Fleet Vault
          </button>
        </nav>

        {/* Zone 3: Primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenDealership}
            className="px-4 py-2 text-xs font-mono font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Acquire Flagship
          </button>
        </div>
      </div>
    </header>
  );
};
