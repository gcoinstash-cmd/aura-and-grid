/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * High-Contrast Institutional L2 Order Book & NBBO Midpoint HUD
 */

import React from 'react';
import { OrderBookSnapshot, BookLevel } from '../types/trading';
import { ShieldCheck, TrendingUp, TrendingDown, Layers, Zap } from 'lucide-react';

interface OrderBookHUDProps {
  snapshot: OrderBookSnapshot;
  instrument: string;
  onSelectPrice: (price: number, side: 'BUY' | 'SELL') => void;
}

export const OrderBookHUD: React.FC<OrderBookHUDProps> = ({
  snapshot,
  instrument,
  onSelectPrice
}) => {
  const { bids, asks, nbboBid, nbboAsk, midpoint, spread, spreadBps, totalBidVolume, totalAskVolume } = snapshot;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col h-full">
      {/* Header Info */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            L2 Order Book <span className="text-slate-400 text-base font-medium">({instrument})</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/70 text-emerald-300 border border-emerald-700/50 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> FIFO Price-Time Priority
          </span>
          <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            O(1) Tree
          </span>
        </div>
      </div>

      {/* Book Column Headers */}
      <div className="grid grid-cols-4 text-slate-400 text-base font-bold py-2 px-3 border-b border-slate-800/80 bg-slate-950/40 mt-2 rounded">
        <div className="text-left">Orders</div>
        <div className="text-right">Volume</div>
        <div className="text-right">Price (USD)</div>
        <div className="text-right">Depth Cum.</div>
      </div>

      {/* ASKS (Sells) - Rendered High to Low */}
      <div className="flex-1 flex flex-col justify-end space-y-1 py-1 overflow-hidden">
        {asks.slice(0, 8).reverse().map((level: BookLevel, idx: number) => (
          <div
            key={`ask-${level.price}-${idx}`}
            onClick={() => onSelectPrice(level.price, 'BUY')}
            className="relative grid grid-cols-4 text-base font-mono-numbers py-1 px-3 rounded hover:bg-rose-950/40 cursor-pointer transition-colors group"
          >
            {/* Red Depth Fill Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-rose-500/15 rounded pointer-events-none transition-all duration-150"
              style={{ width: `${level.depthPct}%` }}
            />
            <div className="relative z-10 text-left text-slate-400 font-medium">
              {level.orderCount}
            </div>
            <div className="relative z-10 text-right text-slate-200 font-bold">
              {level.volume.toLocaleString()}
            </div>
            <div className="relative z-10 text-right text-rose-400 font-extrabold flex items-center justify-end gap-1">
              <TrendingDown className="w-4 h-4 text-rose-500 opacity-60 group-hover:opacity-100" />
              <span>${level.price.toFixed(2)}</span>
            </div>
            <div className="relative z-10 text-right text-slate-400 font-medium">
              {level.totalCumulative.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* NBBO Midpoint Banner & Spread Bar */}
      <div className="my-2 py-2.5 px-4 bg-gradient-to-r from-emerald-950/80 via-amber-950/90 to-rose-950/80 border-y border-amber-500/40 rounded-lg flex items-center justify-between shadow-inner">
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-emerald-400 font-mono-numbers">
            BID: ${nbboBid.toFixed(2)}
          </span>
          <span className="text-slate-500 font-bold">•</span>
          <span className="text-base font-extrabold text-rose-400 font-mono-numbers">
            ASK: ${nbboAsk.toFixed(2)}
          </span>
        </div>

        {/* Amber Midpoint Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/80 rounded-md flex items-center gap-1.5 shadow-lg shadow-amber-950">
            <span className="text-xs uppercase font-extrabold text-amber-300 tracking-wider">
              NBBO Midpoint:
            </span>
            <span className="text-lg font-black text-amber-300 font-mono-numbers">
              ${midpoint.toFixed(4)}
            </span>
          </div>
        </div>

        {/* Spread Info */}
        <div className="flex items-center gap-2 text-base font-mono-numbers">
          <span className="text-slate-300 font-medium">Spread:</span>
          <span className="text-amber-400 font-extrabold">${spread.toFixed(2)}</span>
          <span className="text-xs font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
            {spreadBps} bps
          </span>
        </div>
      </div>

      {/* BIDS (Buys) - Rendered High to Low */}
      <div className="flex-1 flex flex-col justify-start space-y-1 py-1 overflow-hidden">
        {bids.slice(0, 8).map((level: BookLevel, idx: number) => (
          <div
            key={`bid-${level.price}-${idx}`}
            onClick={() => onSelectPrice(level.price, 'SELL')}
            className="relative grid grid-cols-4 text-base font-mono-numbers py-1 px-3 rounded hover:bg-emerald-950/40 cursor-pointer transition-colors group"
          >
            {/* Green Depth Fill Bar */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-500/15 rounded pointer-events-none transition-all duration-150"
              style={{ width: `${level.depthPct}%` }}
            />
            <div className="relative z-10 text-left text-slate-400 font-medium">
              {level.orderCount}
            </div>
            <div className="relative z-10 text-right text-slate-200 font-bold">
              {level.volume.toLocaleString()}
            </div>
            <div className="relative z-10 text-right text-emerald-400 font-extrabold flex items-center justify-end gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500 opacity-60 group-hover:opacity-100" />
              <span>${level.price.toFixed(2)}</span>
            </div>
            <div className="relative z-10 text-right text-slate-400 font-medium">
              {level.totalCumulative.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total Volume Summary */}
      <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4 text-base">
        <div className="bg-emerald-950/30 border border-emerald-900/40 rounded-lg p-2 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Total Bids:</span>
          <span className="text-emerald-400 font-extrabold font-mono-numbers">
            {totalBidVolume.toLocaleString()} shs
          </span>
        </div>
        <div className="bg-rose-950/30 border border-rose-900/40 rounded-lg p-2 flex items-center justify-between">
          <span className="text-slate-400 font-medium">Total Asks:</span>
          <span className="text-rose-400 font-extrabold font-mono-numbers">
            {totalAskVolume.toLocaleString()} shs
          </span>
        </div>
      </div>
    </div>
  );
};
