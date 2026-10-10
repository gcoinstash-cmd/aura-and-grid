import React from 'react';

export interface CockpitMetricsProps {
  className?: string;
  isCompact?: boolean;
}

export const CockpitMetrics: React.FC<CockpitMetricsProps> = ({
  className = '',
  isCompact = false
}) => {
  return (
    <section className={`w-full font-mono ${className}`}>
      {/* 4-CARD EXECUTIVE VALUATION HUD HIERARCHY (DESCENDING ORDER: $3.63M -> $2.28M -> $1.75M -> $1.05M) */}
      <div className={`grid grid-cols-1 ${isCompact ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-4'} gap-3.5 text-xs sm:text-sm w-full`}>
        
        {/* CARD 1 (FIRST / HIGHEST VALUE — $3.63M) */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border border-purple-500/50 hover:border-purple-400 transition-all min-h-[250px] bg-zinc-950/90 shadow-xl shadow-purple-950/20 w-full group">
          <div className="flex flex-col items-center w-full">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase mx-auto mb-2 text-purple-300 bg-purple-950/90 border border-purple-500/50 shadow-sm shadow-purple-500/20">
              TOTAL RETAIL PRICE
            </span>
            <h4 className="text-xs sm:text-[13px] font-black tracking-widest uppercase text-zinc-300 text-center mb-1 whitespace-normal leading-snug">
              TOTAL MSRP STICKER PRICE
            </h4>
            <span className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-center my-2 bg-gradient-to-r from-cyan-400 via-purple-300 to-purple-400 bg-clip-text text-transparent block group-hover:scale-105 transition-transform drop-shadow-md">
              $3.63M
            </span>
            <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed px-1">
              Portfolio Monopoly Asking Price &amp; Strategic Transfer Ceiling
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-center mt-auto pt-2.5 border-t border-zinc-800/80 block w-full">
            160 Active Units combined retail anchor value
          </span>
        </div>

        {/* CARD 2 (SECOND / COMMERCIAL APPRAISAL — $2.28M) */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border border-amber-500/50 hover:border-amber-400 transition-all min-h-[250px] bg-zinc-950/90 shadow-xl shadow-amber-950/20 w-full group">
          <div className="flex flex-col items-center w-full">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase mx-auto mb-2 text-amber-300 bg-amber-950/90 border border-amber-500/50 shadow-sm shadow-amber-500/20">
              WHOLESALE BASELINE PRICE
            </span>
            <h4 className="text-xs sm:text-[13px] font-black tracking-widest uppercase text-zinc-300 text-center mb-1 whitespace-normal leading-snug">
              COMMERCIAL AGENCY REPLACEMENT APPRAISAL
            </h4>
            <span className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-center my-2 text-amber-400 block group-hover:scale-105 transition-transform drop-shadow-md">
              $2.28M
            </span>
            <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed px-1">
              $2.28M Tier 2/3 Enterprise Dev Replacement Benchmark
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-center mt-auto pt-2.5 border-t border-zinc-800/80 block w-full">
            160 Units × $14,250 average institutional custom dev replacement
          </span>
        </div>

        {/* CARD 3 (THIRD / HARD CAPITALIZED FLOOR — $1.75M) */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border border-emerald-500/50 hover:border-emerald-400 transition-all min-h-[250px] bg-zinc-950/90 shadow-xl shadow-emerald-950/20 w-full group">
          <div className="flex flex-col items-center w-full">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase mx-auto mb-2 text-emerald-300 bg-emerald-950/90 border border-emerald-500/50 shadow-sm shadow-emerald-500/20">
              ASC 350-40 AUDITED REPLACEMENT BASELINE
            </span>
            <h4 className="text-xs sm:text-[13px] font-black tracking-widest uppercase text-zinc-300 text-center mb-1 whitespace-normal leading-snug">
              AS-IS BARE MINIMUM (THE HARD WALK-AWAY FLOOR)
            </h4>
            <div className="flex items-baseline justify-center gap-1.5 my-2">
              <span className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-center text-emerald-400 block group-hover:scale-105 transition-transform drop-shadow-md">
                $1.75M
              </span>
            </div>
            <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed px-1">
              $1,751,840 Audited Capitalized Development Floor
            </p>
            <div className="text-[11px] text-amber-300 font-bold text-center leading-relaxed px-2 py-1.5 bg-amber-950/40 border border-amber-500/40 rounded-lg mt-2 w-full">
              Dealership Rule: The Hard Walk-Away Price. We do not negotiate or sell below this baseline (160 units × 100 hrs @ $109.49/hr Senior Architect standard).
            </div>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-center mt-auto pt-2.5 border-t border-zinc-800/80 block w-full">
            16,000 Engineering Hours (@ $109.49/hr Senior Architect Floor)
          </span>
        </div>

        {/* CARD 4 (FOURTH / LOWEST DOWNSIDE FLOOR — $1.05M) */}
        <div className="flex flex-col items-center justify-between p-4 sm:p-5 rounded-2xl border border-rose-500/50 hover:border-rose-400 transition-all min-h-[250px] bg-zinc-950/90 shadow-xl shadow-rose-950/20 w-full group">
          <div className="flex flex-col items-center w-full">
            <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-widest uppercase mx-auto mb-2 text-rose-300 bg-rose-950/90 border border-rose-500/50 shadow-sm shadow-rose-500/20">
              EMERGENCY LIQUIDATION RESERVE
            </span>
            <h4 className="text-xs sm:text-[13px] font-black tracking-widest uppercase text-zinc-300 text-center mb-1 whitespace-normal leading-snug">
              THE PANIC FLOOR PRICE
            </h4>
            <span className="text-4xl xl:text-5xl font-mono font-black tracking-tight text-center my-2 text-rose-500 block group-hover:scale-105 transition-transform drop-shadow-md">
              $1.05M
            </span>
            <p className="text-xs text-zinc-300 text-center font-medium leading-relaxed px-1">
              Distressed Acquisition &amp; Immediate Cash Downside Floor
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 text-center mt-auto pt-2.5 border-t border-zinc-800/80 block w-full">
            Worst-case distress liquidation floor strictly maintained &gt;$1.0M
          </span>
        </div>

      </div>
    </section>
  );
};

export default CockpitMetrics;
