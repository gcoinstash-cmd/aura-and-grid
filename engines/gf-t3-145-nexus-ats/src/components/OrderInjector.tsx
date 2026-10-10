/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * Institutional Order Injector & Execution Terminal
 */

import React, { useState } from 'react';
import { OrderSide, OrderType, ExecutionVenue, Order, TradeExecution } from '../types/trading';
import { DarkCrossingResult } from '../engine/DarkPoolEngine';
import { Send, CheckCircle2, AlertCircle, ShieldAlert, Zap, ArrowRight } from 'lucide-react';

interface OrderInjectorProps {
  currentNbbo: { bid: number; ask: number; midpoint: number };
  onSubmitOrder: (order: Partial<Order>) => {
    order: Order;
    trades: TradeExecution[];
    darkResult?: DarkCrossingResult;
    latencyUs: number;
  };
  selectedPrice?: number | null;
  selectedSide?: OrderSide | null;
}

export const OrderInjector: React.FC<OrderInjectorProps> = ({
  currentNbbo,
  onSubmitOrder,
  selectedPrice,
  selectedSide
}) => {
  const [side, setSide] = useState<OrderSide>(selectedSide || 'BUY');
  const [type, setType] = useState<OrderType>('LIMIT');
  const [venue, setVenue] = useState<ExecutionVenue>('LIT');
  const [price, setPrice] = useState<number>(selectedPrice || 100.00);
  const [quantity, setQuantity] = useState<number>(500);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [mpid, setMpid] = useState<string>('GHTF');
  const [antiInternalize, setAntiInternalize] = useState<boolean>(true);

  const [lastResult, setLastResult] = useState<{
    order: Order;
    trades: TradeExecution[];
    darkResult?: DarkCrossingResult;
    latencyUs: number;
  } | null>(null);

  // Sync props when user clicks price in L2 Book
  React.useEffect(() => {
    if (selectedPrice) setPrice(selectedPrice);
    if (selectedSide) setSide(selectedSide);
  }, [selectedPrice, selectedSide]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = onSubmitOrder({
      side,
      type,
      venue: type === 'MIDPOINT_PEG' ? 'DARK' : venue,
      price: type === 'MARKET' || type === 'MIDPOINT_PEG' ? 0 : price,
      quantity,
      minQuantity,
      participantMpid: mpid,
      antiInternalization: antiInternalize
    });
    setLastResult(res);
  };

  const institutionalBrokers = [
    { code: 'GHTF', name: 'Ghost Institutional Desk' },
    { code: 'CITD', name: 'Citadel Securities' },
    { code: 'JPMC', name: 'JPMorgan Prime' },
    { code: 'VIRT', name: 'Virtu Financial' },
    { code: 'GSCO', name: 'Goldman Sachs' },
    { code: 'MSCO', name: 'Morgan Stanley' },
    { code: 'HRTE', name: 'Hudson River Trading' },
    { code: 'JANE', name: 'Jane Street Capital' }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 shadow-2xl flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Send className="w-5 h-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-white tracking-wide">
            Institutional Order Injector <span className="text-slate-400 text-base font-medium">(Direct SBE Gateway)</span>
          </h2>
        </div>
        <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono-numbers">
          FIX 4.4 / SBE Ready
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 mt-3 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          {/* Side Selector (BUY / SELL) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSide('BUY')}
              className={`py-2.5 rounded-lg text-lg font-extrabold tracking-wide uppercase transition-all ${
                side === 'BUY'
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950 border-2 border-emerald-300'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-emerald-800'
              }`}
            >
              BUY (Bid)
            </button>
            <button
              type="button"
              onClick={() => setSide('SELL')}
              className={`py-2.5 rounded-lg text-lg font-extrabold tracking-wide uppercase transition-all ${
                side === 'SELL'
                  ? 'bg-rose-500 text-slate-950 shadow-lg shadow-rose-950 border-2 border-rose-300'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-rose-800'
              }`}
            >
              SELL (Offer)
            </button>
          </div>

          {/* Order Type & Venue */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                Order Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as OrderType;
                  setType(newType);
                  if (newType === 'MIDPOINT_PEG') {
                    setVenue('DARK');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-semibold text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="LIMIT">LIMIT (GTC)</option>
                <option value="MARKET">MARKET</option>
                <option value="MIDPOINT_PEG">MIDPOINT PEG (Dark)</option>
                <option value="IOC">IOC (Immediate or Cancel)</option>
                <option value="FOK">FOK (Fill or Kill)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                Execution Venue
              </label>
              <select
                value={venue}
                onChange={(e) => setVenue(e.target.value as ExecutionVenue)}
                disabled={type === 'MIDPOINT_PEG'}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-semibold text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              >
                <option value="LIT">LIT CLOB</option>
                <option value="DARK">DARK POOL</option>
                <option value="HYBRID_SWEEP">HYBRID SWEEP (Dark -&gt; Lit)</option>
              </select>
            </div>
          </div>

          {/* Price & Quantity Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                Limit Price (USD)
              </label>
              <input
                type="number"
                step="0.01"
                disabled={type === 'MARKET' || type === 'MIDPOINT_PEG'}
                value={type === 'MARKET' || type === 'MIDPOINT_PEG' ? currentNbbo.midpoint : price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-mono-numbers font-bold text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                Order Quantity
              </label>
              <input
                type="number"
                step="100"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 100)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-mono-numbers font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Institutional Flags: MinQty & MPID */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                MinQty (Block Protection)
              </label>
              <input
                type="number"
                step="100"
                min="0"
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 0)}
                placeholder="0 (No minimum)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-mono-numbers font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 uppercase mb-1">
                Participant MPID
              </label>
              <select
                value={mpid}
                onChange={(e) => setMpid(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-base font-semibold text-white focus:outline-none focus:border-emerald-500"
              >
                {institutionalBrokers.map((b) => (
                  <option key={b.code} value={b.code}>
                    {b.code} - {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anti-Internalization Checkbox */}
          <div className="flex items-center gap-2 bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-2">
            <input
              type="checkbox"
              id="antiInternalize"
              checked={antiInternalize}
              onChange={(e) => setAntiInternalize(e.target.checked)}
              className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
            />
            <label htmlFor="antiInternalize" className="text-sm font-medium text-slate-300 cursor-pointer">
              Enforce Anti-Internalization (Prevent Self-Trades against {mpid})
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl ${
              side === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950'
                : 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-950'
            }`}
          >
            <Zap className="w-5 h-5 fill-current" />
            <span>SUBMIT {side} {type} ORDER ({quantity.toLocaleString()} SHS)</span>
          </button>
        </div>
      </form>

      {/* Execution Feedback Banner */}
      {lastResult && (
        <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-base">
          <div className="flex items-center justify-between font-mono-numbers text-xs text-slate-400 border-b border-slate-800/80 pb-1 mb-1.5">
            <span className="text-emerald-400 font-bold">{lastResult.order.id}</span>
            <span className="text-slate-300">Latency: {lastResult.latencyUs} µs</span>
          </div>
          <div className="flex items-center justify-between text-base">
            <span className="font-bold text-white">Status:</span>
            <span className={`font-black font-mono-numbers ${
              lastResult.order.status === 'FILLED'
                ? 'text-emerald-400'
                : lastResult.order.status === 'PARTIALLY_FILLED'
                ? 'text-amber-400'
                : lastResult.order.status === 'RESTING_DARK'
                ? 'text-amber-300'
                : lastResult.order.status === 'CANCELED'
                ? 'text-rose-400'
                : 'text-blue-400'
            }`}>
              {lastResult.order.status}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Filled: <span className="text-white font-bold font-mono-numbers">{lastResult.order.filledQuantity}</span> / {lastResult.order.quantity} shs
            {lastResult.trades.length > 0 && ` (${lastResult.trades.length} fill events executed)`}
          </div>
        </div>
      )}
    </div>
  );
};
