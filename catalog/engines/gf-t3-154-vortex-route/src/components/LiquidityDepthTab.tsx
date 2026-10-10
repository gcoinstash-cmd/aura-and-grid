import React, { useState } from 'react';
import { Layers, Activity, Play, Pause, RefreshCw, Zap } from 'lucide-react';
import { VenueId, VenueInfo } from '../types/router';

interface LiquidityDepthTabProps {
  venues: Record<VenueId, VenueInfo>;
  isStreaming: boolean;
  onToggleStreaming: () => void;
  onManualTick: () => void;
}

export const LiquidityDepthTab: React.FC<LiquidityDepthTabProps> = ({
  venues,
  isStreaming,
  onToggleStreaming,
  onManualTick,
}) => {
  const [selectedVenue, setSelectedVenue] = useState<VenueId | 'ALL'>('ALL');

  // Compute Consolidated Order Book (SCOB)
  const allBids = Object.values(venues).flatMap((v) =>
    v.bids.map((b) => ({ ...b, venue: v.id, venueName: v.name, color: v.color }))
  ).sort((a, b) => b.price - a.price);

  const allAsks = Object.values(venues).flatMap((v) =>
    v.asks.map((a) => ({ ...a, venue: v.id, venueName: v.name, color: v.color }))
  ).sort((a, b) => a.price - b.price);

  const topConsolidatedBid = allBids[0]?.price || 67449.70;
  const topConsolidatedAsk = allAsks[0]?.price || 67450.40;
  const consolidatedSpreadUsd = topConsolidatedAsk - topConsolidatedBid;
  const consolidatedSpreadBps = (consolidatedSpreadUsd / topConsolidatedBid) * 10000;

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase font-mono flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-violet-400" />
            Cross-Venue Level 2 Liquidity Depth (5 Institutional Exchanges)
          </h2>
          <p className="text-sm font-semibold text-slate-300 mt-1">
            Real-time multi-exchange market data feed synchronized with microsecond co-location timestamps
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onManualTick}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-sm font-mono font-black flex items-center gap-2 transition-all shadow-md"
          >
            <RefreshCw className="w-4 h-4 text-violet-400" />
            INJECT TICK
          </button>

          <button
            onClick={onToggleStreaming}
            className={`px-4 py-2.5 rounded-xl text-sm font-mono font-black uppercase flex items-center gap-2 transition-all shadow-md ${
              isStreaming
                ? 'bg-emerald-600/25 text-emerald-300 border border-emerald-500/60 hover:bg-emerald-600/35'
                : 'bg-amber-600/25 text-amber-300 border border-amber-500/60 hover:bg-amber-600/35'
            }`}
          >
            {isStreaming ? (
              <>
                <Pause className="w-4 h-4 text-emerald-400" />
                STREAM: ACTIVE (150ms)
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-amber-400" />
                STREAM: PAUSED
              </>
            )}
          </button>
        </div>
      </div>

      {/* Aggregated Consolidated Order Book (SCOB) Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            Best Consolidated Bid
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            ${topConsolidatedBid.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">
            Lead Venue: <span className="text-emerald-300 font-black">{allBids[0]?.venue}</span>
          </div>
        </div>

        <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            Best Consolidated Ask
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-rose-400">
            ${topConsolidatedAsk.toFixed(2)}
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">
            Lead Venue: <span className="text-rose-300 font-black">{allAsks[0]?.venue}</span>
          </div>
        </div>

        <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            Consolidated Spread
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            ${consolidatedSpreadUsd.toFixed(2)}
          </div>
          <div className="text-xs font-black text-violet-400 font-mono mt-1">
            {consolidatedSpreadBps.toFixed(2)} BPS TIGHT SPREAD
          </div>
        </div>

        <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-5 shadow-md">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-1">
            Total Top-Book Depth
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-violet-300">
            {(
              allBids.slice(0, 5).reduce((a, b) => a + b.qty, 0) +
              allAsks.slice(0, 5).reduce((a, b) => a + b.qty, 0)
            ).toFixed(1)} BTC
          </div>
          <div className="text-xs font-bold text-slate-300 mt-1">
            Consolidated 5 Venues
          </div>
        </div>
      </div>

      {/* Side-by-Side 5 Exchange Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Object.values(venues).map((venue) => {
          const bestBid = venue.bids[0]?.price || 0;
          const bestAsk = venue.asks[0]?.price || 0;
          const venueSpread = bestAsk - bestBid;
          const venueSpreadBps = (venueSpread / bestBid) * 10000;

          return (
            <div
              key={venue.id}
              className="bg-[#0d121f] border border-slate-800 hover:border-violet-500/60 rounded-xl p-4 flex flex-col justify-between shadow-lg transition-all"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: venue.color }}
                    />
                    <span className="font-mono font-black text-base text-white uppercase">
                      {venue.id}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-black text-violet-300">
                    {venue.latencyUs} µs
                  </span>
                </div>

                {/* Micro Stats */}
                <div className="grid grid-cols-2 gap-1.5 text-xs font-mono text-slate-300 mb-3 bg-[#07090e] p-2.5 rounded-lg border border-slate-800/80">
                  <div>
                    Taker: <span className="text-white font-bold">{venue.takerFeeBps} bps</span>
                  </div>
                  <div>
                    Spread: <span className="text-white font-bold">{venueSpreadBps.toFixed(1)} bps</span>
                  </div>
                  <div>
                    Rebate: <span className="text-emerald-400 font-bold">{venue.makerRebateBps} bps</span>
                  </div>
                  <div>
                    Recov: <span className="text-slate-200 font-bold">{venue.replenishRate}/ms</span>
                  </div>
                </div>

                {/* Level 2 Asks (Red, ascending) */}
                <div className="space-y-1 mb-2">
                  <div className="text-xs font-black uppercase tracking-wider text-rose-400 pb-0.5">
                    ASKS (SELL WALL)
                  </div>
                  {venue.asks.slice(0, 3).reverse().map((ask, idx) => (
                    <div
                      key={`ask-${idx}`}
                      className="flex justify-between items-center text-sm font-mono px-2.5 py-1.5 rounded bg-rose-950/25 text-rose-300 border border-rose-900/30"
                    >
                      <span className="font-black">${ask.price.toFixed(2)}</span>
                      <span className="text-slate-300 font-bold">{ask.qty.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Mid-Market Divider */}
                <div className="py-1.5 px-2.5 my-2.5 rounded-lg bg-slate-900 text-center font-mono text-xs font-bold text-slate-300 border border-slate-800">
                  SPREAD: ${venueSpread.toFixed(2)}
                </div>

                {/* Level 2 Bids (Green, descending) */}
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-wider text-emerald-400 pb-0.5">
                    BIDS (BUY WALL)
                  </div>
                  {venue.bids.slice(0, 3).map((bid, idx) => (
                    <div
                      key={`bid-${idx}`}
                      className="flex justify-between items-center text-sm font-mono px-2.5 py-1.5 rounded bg-emerald-950/25 text-emerald-300 border border-emerald-900/30"
                    >
                      <span className="font-black">${bid.price.toFixed(2)}</span>
                      <span className="text-slate-300 font-bold">{bid.qty.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Depth Volume Indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs font-mono text-slate-300 flex justify-between font-bold">
                <span>Book Depth:</span>
                <span className="font-black text-white">
                  {(venue.bids.reduce((a, b) => a + b.qty, 0) + venue.asks.reduce((a, b) => a + b.qty, 0)).toFixed(1)} BTC
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Consolidated Order Book (SCOB) Depth Matrix */}
      <div className="bg-[#0d121f] border border-slate-800 rounded-xl p-6 shadow-xl">
        <h3 className="text-xl font-black tracking-tight text-white uppercase font-mono mb-4 flex items-center gap-2.5">
          <Zap className="w-6 h-6 text-violet-400" />
          Consolidated Top-of-Book Depth Ladder (Composite Aggregator)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
          {/* Top 6 Bids across all venues */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-3 pb-1.5 border-b border-slate-800 flex justify-between">
              <span>Venue / Exchange</span>
              <span>Composite Bid Price</span>
              <span>Volume (BTC)</span>
            </div>
            <div className="space-y-2">
              {allBids.slice(0, 6).map((bid, idx) => (
                <div
                  key={`c-bid-${idx}`}
                  className="flex justify-between items-center p-3 rounded-lg bg-[#07090e] border border-slate-800"
                >
                  <span
                    className="font-black px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: `${bid.color}25`, color: bid.color }}
                  >
                    {bid.venue}
                  </span>
                  <span className="font-black text-emerald-400">${bid.price.toFixed(2)}</span>
                  <span className="text-slate-200 font-black">{bid.qty.toFixed(2)} BTC</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top 6 Asks across all venues */}
          <div>
            <div className="text-xs font-black uppercase tracking-wider text-rose-400 mb-3 pb-1.5 border-b border-slate-800 flex justify-between">
              <span>Venue / Exchange</span>
              <span>Composite Ask Price</span>
              <span>Volume (BTC)</span>
            </div>
            <div className="space-y-2">
              {allAsks.slice(0, 6).map((ask, idx) => (
                <div
                  key={`c-ask-${idx}`}
                  className="flex justify-between items-center p-3 rounded-lg bg-[#07090e] border border-slate-800"
                >
                  <span
                    className="font-black px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: `${ask.color}25`, color: ask.color }}
                  >
                    {ask.venue}
                  </span>
                  <span className="font-black text-rose-400">${ask.price.toFixed(2)}</span>
                  <span className="text-slate-200 font-black">{ask.qty.toFixed(2)} BTC</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
