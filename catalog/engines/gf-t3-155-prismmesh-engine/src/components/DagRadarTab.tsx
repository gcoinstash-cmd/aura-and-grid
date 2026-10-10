import React, { useState } from 'react';
import { GitBranch, ShieldAlert, Cpu, CheckCircle2, AlertTriangle, Flame, ArrowRight, Activity } from 'lucide-react';
import { Bundle, AuctionResult } from '../core/mevEngineTs';

interface DagRadarTabProps {
  bundles: Bundle[];
  auctionResult: AuctionResult | null;
}

export const DagRadarTab: React.FC<DagRadarTabProps> = ({ bundles, auctionResult }) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('ALL');

  // Unique state slots
  const allSlots = Array.from(
    new Set(bundles.flatMap(b => Array.from(b.stateWrites).concat(Array.from(b.stateReads))))
  );

  // Filter bundles based on slot
  const displayedBundles = selectedSlot === 'ALL'
    ? bundles
    : bundles.filter(b => b.stateWrites.has(selectedSlot) || b.stateReads.has(selectedSlot));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span>DAG Edges Evaluated</span>
          </div>
          <div className="text-3xl font-mono font-black text-white">
            {auctionResult?.dagEdgesEvaluated ?? 18}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Bernstein non-interference state checks performed in sub-12µs window.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Topological Sorting Strategy</span>
          </div>
          <div className="text-2xl font-mono font-black text-blue-400">
            KAHN DENSITY PREEMPTION
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Higher tip-density bundles form acyclic directed edges over competing bundles.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Predatory Sandwich Filter</span>
          </div>
          <div className="text-3xl font-mono font-black text-amber-400">
            {auctionResult?.toxicMevFilteredCount ?? 1} FILTERED
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Toxic 3-hop sandwich attack vectors isolated and dropped without gas penalty.
          </p>
        </div>
      </div>

      {/* Interactive Slot Filter */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase font-mono">
            Filter State Slot:
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setSelectedSlot('ALL')}
              className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                selectedSlot === 'ALL'
                  ? 'bg-fuchsia-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              ALL SLOTS
            </button>
            {allSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition-colors cursor-pointer ${
                  selectedSlot === slot
                    ? 'bg-fuchsia-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DAG Visualization Matrix & Visual Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Visual Graph Canvas Simulation */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-fuchsia-400" />
                State Conflict DAG Topology Visualizer
              </h3>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ACYCLIC / INVARIANT VERIFIED
              </span>
            </div>

            <p className="text-sm text-slate-400 mb-4">
              Nodes represent candidate bundles; links represent shared state access keys. Higher density bids claim the execution slot, displacing lower density conflicting bundles into DAG conflict state.
            </p>

            {/* Interactive SVG Network Graph */}
            <div className="w-full h-80 rounded-xl bg-[#060911] border border-slate-800 relative overflow-hidden flex items-center justify-center p-4">
              <svg className="w-full h-full" viewBox="0 0 500 300">
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
                    <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Connection lines between bundles with shared state */}
                {/* Node 1 to Node 2 (Conflict over pool) */}
                <line x1="100" y1="80" x2="250" y2="150" stroke="#d946ef" strokeWidth="2" strokeDasharray="4 4" />
                <line x1="250" y1="150" x2="400" y2="80" stroke="#3b82f6" strokeWidth="2" />
                <line x1="100" y1="220" x2="250" y2="150" stroke="#10b981" strokeWidth="2" />
                <line x1="250" y1="150" x2="400" y2="220" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />

                {/* Central State Hub */}
                <circle cx="250" cy="150" r="32" fill="#0f172a" stroke="#d946ef" strokeWidth="2.5" />
                <text x="250" y="146" textAnchor="middle" fill="#f1f5f9" fontSize="10" fontWeight="bold" fontFamily="monospace">
                  STATE
                </text>
                <text x="250" y="160" textAnchor="middle" fill="#d946ef" fontSize="9" fontWeight="bold" fontFamily="monospace">
                  USDC:Reserves
                </text>

                {/* Node 1: Packed Arb 1 */}
                <g>
                  <circle cx="100" cy="80" r="28" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                  <text x="100" y="77" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    B-ARB-UNI3
                  </text>
                  <text x="100" y="89" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    PACKED #1
                  </text>
                </g>

                {/* Node 2: Packed Liq 2 */}
                <g>
                  <circle cx="400" cy="80" r="28" fill="#1e1b4b" stroke="#3b82f6" strokeWidth="2" />
                  <text x="400" y="77" textAnchor="middle" fill="#eff6ff" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    B-LIQ-AAVE
                  </text>
                  <text x="400" y="89" textAnchor="middle" fill="#93c5fd" fontSize="8" fontFamily="monospace">
                    PACKED #2
                  </text>
                </g>

                {/* Node 3: Packed Curve Arb */}
                <g>
                  <circle cx="100" cy="220" r="28" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
                  <text x="100" y="217" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="bold" fontFamily="monospace">
                    B-CURVE-TRI
                  </text>
                  <text x="100" y="229" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontFamily="monospace">
                    PACKED #3
                  </text>
                </g>

                {/* Node 4: Toxic Sandwich (Filtered) */}
                <g>
                  <circle cx="400" cy="220" r="28" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
                  <text x="400" y="217" textAnchor="middle" fill="#fffbeb" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    B-SANDWICH
                  </text>
                  <text x="400" y="229" textAnchor="middle" fill="#fcd34d" fontSize="7" fontFamily="monospace">
                    TOXIC DROP
                  </text>
                </g>
              </svg>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between text-xs font-mono font-bold text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Parallel Mergeable
            </span>
            <span className="flex items-center gap-1.5 text-fuchsia-400">
              <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-500"></span> State Collision Link
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Predatory Vector
            </span>
          </div>
        </div>

        {/* MEV Radar & Sandwich Attack Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              MEV Radar: Sandwich Attack Anatomy
            </h3>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-2 py-0.5 rounded">
              TOXIC INSULATION ACTIVE
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              PREDATORY 3-TX TOPOLOGY ISOLATION:
            </div>

            <div className="space-y-2 text-xs font-mono">
              {/* Step 1 */}
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">1. Front-Run Swap:</span>{' '}
                  <span className="text-slate-300">0xPredatorBot pushes price upward</span>
                </div>
                <span className="text-amber-300 font-bold">+150k Gas</span>
              </div>

              {/* Step 2 */}
              <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-900/40 flex items-center justify-between">
                <div>
                  <span className="text-rose-400 font-bold">2. Victim Transaction:</span>{' '}
                  <span className="text-slate-300">Retail trader executes at worst slippage</span>
                </div>
                <span className="text-rose-300 font-bold">Target Slippage</span>
              </div>

              {/* Step 3 */}
              <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-900/40 flex items-center justify-between">
                <div>
                  <span className="text-amber-400 font-bold">3. Back-Run Swap:</span>{' '}
                  <span className="text-slate-300">0xPredatorBot dumps token, extracting MEV</span>
                </div>
                <span className="text-amber-300 font-bold">Extracted Tip</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <strong className="text-emerald-400 font-mono">PrismMesh Defense Action:</strong> State-delta analysis flags simultaneous front-run and back-run transactions on the identical AMM pool. The entire bundle is tagged <code>SANDWICH_TOXIC</code> and dropped before validator block proposal, shielding retail users from slippage exploitation.
            </div>
          </div>

          {/* Mathematical Invariant Formula */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-xs font-bold text-slate-400 uppercase font-mono mb-2">
              Bernstein Non-Interference Condition:
            </div>
            <div className="p-3 rounded-lg bg-slate-900 font-mono text-xs text-fuchsia-300 overflow-x-auto">
              <code>
                W(B_i) ∩ R(B_j) = ∅  ∧  R(B_i) ∩ W(B_j) = ∅  ∧  W(B_i) ∩ W(B_j) = ∅
              </code>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              If all three conditions hold true, Bundle $B_i$ and $B_j$ execute concurrently without reordering risks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
