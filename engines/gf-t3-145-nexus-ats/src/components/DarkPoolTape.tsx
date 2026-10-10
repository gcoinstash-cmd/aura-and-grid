/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Dark Pool Crossing Tape & Non-Displayed Peg Feed
 */

import React from 'react';
import { TradeExecution, Order } from '../types/trading';
import { Shield, Sparkles, Clock, ArrowRightLeft, DollarSign, CheckCircle2 } from 'lucide-react';

interface DarkPoolTapeProps {
  trades: TradeExecution[];
  restingBuyPegs: Order[];
  restingSellPegs: Order[];
  totalDarkVolume: number;
}

export const DarkPoolTape: React.FC<DarkPoolTapeProps> = ({
  trades,
  restingBuyPegs,
  restingSellPegs,
  totalDarkVolume
}) => {
  const darkTrades = trades.filter(t => t.venue === 'DARK' || t.isDarkCross);
  const totalSavings = darkTrades.reduce((acc, t) => acc + (t.midpointSavedPrice * t.quantity), 0);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            Dark Pool Crossing Tape <span className="text-amber-400 text-base font-bold">(Midpoint Pegs)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold uppercase px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-600/50">
            Reg ATS Compliant
          </span>
        </div>
      </div>

      {/* Metrics Header Cards */}
      <div className="grid grid-cols-2 gap-3 my-3">
        <div className="bg-amber-950/25 border border-amber-500/30 rounded-lg p-3">
          <div className="text-sm font-semibold text-amber-300/80 uppercase tracking-wide flex items-center gap-1.5">
            <DollarSign className="w-4 h-4 text-amber-400" />
            Midpoint Price Improvement
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono-numbers mt-1">
            +${totalSavings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Direct spread savings vs lit book
          </div>
        </div>

        <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3">
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
            <ArrowRightLeft className="w-4 h-4 text-slate-300" />
            Dark Volume Filled
          </div>
          <div className="text-2xl font-black text-white font-mono-numbers mt-1">
            {totalDarkVolume.toLocaleString()} shs
          </div>
          <div className="text-xs text-emerald-400 mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Zero Market Impact
          </div>
        </div>
      </div>

      {/* Active Resting Non-Displayed Pegs */}
      <div className="mb-3 bg-slate-950/50 border border-slate-800/80 rounded-lg p-2.5">
        <div className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between mb-1.5">
          <span>Resting Midpoint Peg Orders (Non-Displayed)</span>
          <span className="text-amber-400 font-mono-numbers">{restingBuyPegs.length + restingSellPegs.length} Active</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {restingBuyPegs.map((peg, idx) => (
            <span key={`dk-b-${idx}`} className="text-xs font-semibold px-2 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-700/50 flex items-center gap-1 font-mono-numbers">
              <span className="font-bold">BUY PEG</span> {peg.remainingQuantity.toLocaleString()} shs ({peg.participantMpid}) [Min: {peg.minQuantity}]
            </span>
          ))}
          {restingSellPegs.map((peg, idx) => (
            <span key={`dk-s-${idx}`} className="text-xs font-semibold px-2 py-1 rounded bg-rose-950/60 text-rose-300 border border-rose-700/50 flex items-center gap-1 font-mono-numbers">
              <span className="font-bold">SELL PEG</span> {peg.remainingQuantity.toLocaleString()} shs ({peg.participantMpid}) [Min: {peg.minQuantity}]
            </span>
          ))}
          {restingBuyPegs.length === 0 && restingSellPegs.length === 0 && (
            <span className="text-xs text-slate-500 italic py-1">No resting non-displayed pegs. Submit a Midpoint Peg order to rest liquidity.</span>
          )}
        </div>
      </div>

      {/* Tape List Headers */}
      <div className="grid grid-cols-5 text-slate-400 text-base font-bold py-1.5 px-3 border-b border-slate-800/80 bg-slate-950/40 rounded">
        <div>Time / ID</div>
        <div className="text-center">Venue</div>
        <div className="text-right">Price</div>
        <div className="text-right">Quantity</div>
        <div className="text-right">Participants</div>
      </div>

      {/* Live Dark & Lit Trades Scroll Feed */}
      <div className="flex-1 overflow-y-auto space-y-1.5 py-1.5 pr-1 max-h-[360px]">
        {trades.slice(0, 18).map((trade) => {
          const isDark = trade.venue === 'DARK' || trade.isDarkCross;
          const timeStr = new Date(trade.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

          return (
            <div
              key={trade.execId}
              className={`grid grid-cols-5 items-center text-base py-2 px-3 rounded-lg border transition-all ${
                isDark 
                  ? 'bg-amber-950/20 border-amber-600/40 text-amber-200 animate-dark-cross'
                  : 'bg-slate-950/40 border-slate-800/60 text-slate-300'
              }`}
            >
              {/* Time & ID */}
              <div className="flex flex-col font-mono-numbers text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> {timeStr}
                </span>
                <span className="text-slate-500 text-[11px] truncate">{trade.execId.slice(-8)}</span>
              </div>

              {/* Venue Badge */}
              <div className="flex justify-center">
                {isDark ? (
                  <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase tracking-wide">
                    DARK MID
                  </span>
                ) : (
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    LIT CLOB
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="text-right font-mono-numbers font-extrabold text-base">
                <span className={isDark ? 'text-amber-300' : trade.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>
                  ${trade.price.toFixed(2)}
                </span>
              </div>

              {/* Quantity */}
              <div className="text-right font-mono-numbers font-bold text-base text-white">
                {trade.quantity.toLocaleString()}
              </div>

              {/* MPIDs */}
              <div className="text-right font-mono-numbers text-xs text-slate-400 flex flex-col items-end">
                <span className="text-emerald-400 font-bold">{trade.takerMpid}</span>
                <span className="text-slate-500">vs {trade.makerMpid}</span>
              </div>
            </div>
          );
        })}

        {trades.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-base italic">
            Waiting for order executions... Inject orders or toggle simulation flow.
          </div>
        )}
      </div>
    </div>
  );
};
