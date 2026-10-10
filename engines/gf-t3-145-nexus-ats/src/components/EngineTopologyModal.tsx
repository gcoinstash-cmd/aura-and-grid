/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ghost FactoryOS GF-T3-145 (Nexus-ATS)
 * LMAX Disruptor & Kernel-Bypass Architectural Topology
 */

import React from 'react';
import { Cpu, Server, Network, ShieldCheck, Zap, Layers, GitBranch, Terminal } from 'lucide-react';

export const EngineTopologyModal: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/40 rounded-xl p-6 shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              Low-Latency Hardware Architecture
            </span>
            <h2 className="text-3xl font-black text-white mt-2">
              LMAX Disruptor Ring Buffer & Solarflare Kernel Bypass
            </h2>
            <p className="text-slate-300 text-base mt-1 max-w-4xl">
              Zero-copy, lock-free deterministic architecture engineered for sub-850 microsecond end-to-end matching SLAs with 0 dynamic heap allocations in the critical execution path.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-indigo-500/30 rounded-lg p-3 text-right">
              <div className="text-xs text-slate-400 font-bold uppercase">Ring Buffer Size</div>
              <div className="text-2xl font-black text-indigo-400 font-mono-numbers">65,536 Slots</div>
            </div>
            <div className="bg-slate-950/80 border border-emerald-500/30 rounded-lg p-3 text-right">
              <div className="text-xs text-slate-400 font-bold uppercase">Heap Contention</div>
              <div className="text-2xl font-black text-emerald-400 font-mono-numbers">0 Bytes / Hot Path</div>
            </div>
          </div>
        </div>
      </div>

      {/* ASCII Architectural Topology Diagram */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 font-mono-numbers">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4 text-slate-300 text-sm font-bold uppercase">
          <span className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" /> End-to-End Ingress/Egress Ring Flow
          </span>
          <span className="text-emerald-400">NIC RX -&gt; CORE 2 PIN -&gt; UDP MULTICAST</span>
        </div>
        <pre className="text-xs md:text-sm text-emerald-300 overflow-x-auto leading-relaxed p-2 bg-slate-950/90 rounded border border-emerald-950">
{`========================================================================================================
                                NEXUS-ATS MICROSECOND HARDWARE TOPOLOGY
========================================================================================================

 [Institutional Gateway: FIX 4.4 / SBE]               [REST / WebSockets OpenAPI 3.1]
              │                                                     │
              ▼                                                     ▼
 ┌──────────────────────────────────────┐             ┌──────────────────────────────────────┐
 │  Solarflare SFN8522 25GbE NIC        │             │  Epoll High-Speed Async Ingress Gateway│
 │  EF_VI Kernel-Bypass Direct Ring     │             │  (Pinned to CPU Core 1)              │
 └──────────────────┬───────────────────┘             └──────────────────┬───────────────────┘
                    │                                                    │
                    └─────────────────────► ┌───────────────────────────┐ ◄───────────────────────┘
                                           │ Lock-Free Disruptor Ring  │ (SPSC 65,536 Pre-Allocated)
                                           └─────────────┬─────────────┘
                                                         │
                                                         ▼
                             ┌────────────────────────────────────────────────────────┐
                             │ MATCHING CORE RING (Pinned to Dedicated Core 2)         │
                             │ • L3 Contiguous Price-Level Doubly Linked Order Tree  │
                             │ • Sub-Millisecond NBBO Dark Midpoint Crossing Engine  │
                             │ • Participant MPID Anti-Internalization Rule Filter   │
                             │ • 0 Hot-Path Allocations (Pre-Allocated Static Pools) │
                             └───────────┬────────────────────────────────┬───────────┘
                                         │                                │
                 ┌───────────────────────┴───────────────┐                │
                 ▼                                       ▼                ▼
 ┌───────────────────────────────┐     ┌───────────────────────────────┐ ┌──────────────────────────────┐
 │ Disruptor Egress Ring         │     │ Disruptor Market Data Feed    │ │ Disruptor Zero-RPO Ring      │
 │ (Order Confirmations / Fills) │     │ (UDP Multicast ITCH / BBO)    │ │ (Async AlloyDB 16 Journal)   │
 │ Pinned to CPU Core 4          │     │ Pinned to CPU Core 4          │ │ Pinned to CPU Core 5         │
 └───────────────────────────────┘     └───────────────────────────────┘ └──────────────────────────────┘
========================================================================================================`}
        </pre>
      </div>

      {/* 4 Core Architectural Tenets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-lg">
            <Cpu className="w-5 h-5" />
            <h3>CPU Core Pinning & OS Isolation</h3>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            The core matching engine is pinned exclusively to Linux <code className="text-emerald-400 font-mono-numbers">isolcpu=2</code> with zero task scheduling, zero context switches, and power management locked to C0/P0 states.
          </p>
          <div className="text-xs font-mono-numbers text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            Kernel boot: isolcpus=2,3,4,5 nohz_full=2,3,4,5 intel_idle.max_cstate=0 idle=poll
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
            <Zap className="w-5 h-5" />
            <h3>Zero-Copy SPSC Lock-Free Ring</h3>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            Inter-thread communications utilize Single-Producer Single-Consumer (SPSC) circular sequence rings with cache-line padding (64 bytes) to completely eliminate false sharing across CPU cores.
          </p>
          <div className="text-xs font-mono-numbers text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            Memory Layout: struct alignas(64) OrderRingSlot &#123; Order data; uint64_t seq; &#125;;
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
            <Layers className="w-5 h-5" />
            <h3>Level-3 Contiguous Order Tree</h3>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            Orders within the same discrete price level are stored in an unrolled doubly linked list enabling strict $O(1)$ FIFO execution and $O(1)$ dynamic order cancellation via pre-indexed lookup tables.
          </p>
          <div className="text-xs font-mono-numbers text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            Complexity: Match = O(1) • Cancel = O(1) • Best Bid/Ask = O(1)
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-lg">
            <ShieldCheck className="w-5 h-5" />
            <h3>Zero-RPO Asynchronous Journaling</h3>
          </div>
          <p className="text-slate-300 text-base leading-relaxed">
            Execution fills are posted to an asynchronous write-ahead ring buffer processed by Core 5, streaming zero-RPO financial ledgers directly into Google Cloud AlloyDB / PostgreSQL 16 partitions without stalling the matching engine.
          </p>
          <div className="text-xs font-mono-numbers text-slate-400 bg-slate-950 p-2.5 rounded border border-slate-800">
            Recovery: WAL + Snapshot daily partition recovery with 0 RPO guarantee
          </div>
        </div>
      </div>
    </div>
  );
};
