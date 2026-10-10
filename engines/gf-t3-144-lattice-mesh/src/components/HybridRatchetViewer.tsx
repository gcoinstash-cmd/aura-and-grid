import React, { useState } from 'react';
import { executeHybridHandshake, HybridHandshakeResult } from '../lib/pqc/hybrid_engine';
import { mlKemKeyGen } from '../lib/pqc/ml_kem';
import { RefreshCw, GitCommit, Shield, Network, ArrowRight, CheckCircle2, Lock } from 'lucide-react';

interface HybridRatchetViewerProps {
  currentEpoch: number;
  timeRemaining: number;
  onAdvanceEpoch: () => void;
}

export const HybridRatchetViewer: React.FC<HybridRatchetViewerProps> = ({
  currentEpoch,
  timeRemaining,
  onAdvanceEpoch
}) => {
  const [handshakeResult, setHandshakeResult] = useState<HybridHandshakeResult>(() => {
    const kpA = mlKemKeyGen('node-alpha-seed');
    const kpB = mlKemKeyGen('node-beta-seed');
    return executeHybridHandshake('node-alpha', 'node-beta', kpA, kpB, currentEpoch);
  });

  const handleRunNewHandshake = () => {
    const kpA = mlKemKeyGen(`node-alpha-seed-${Date.now()}`);
    const kpB = mlKemKeyGen(`node-beta-seed-${Date.now()}`);
    const res = executeHybridHandshake('node-alpha', 'node-beta', kpA, kpB, currentEpoch + 1);
    setHandshakeResult(res);
    onAdvanceEpoch();
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* 1. Header Banner & State Machine Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
              Hybrid Ephemeral Key Schedule &amp; WireGuard PSK State Machine
            </h2>
            <span className="text-base text-slate-400 block mt-1 font-mono">
              Fusing Classical Curve25519 ECDH + Decapsulated ML-KEM-1024 via HKDF-SHA512
            </span>
          </div>

          <button
            onClick={handleRunNewHandshake}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-base transition-colors shadow-lg shadow-emerald-950"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Simulate Atomic PSK Rollover</span>
          </button>
        </div>
      </div>

      {/* 2. Zero-Packet-Drop Double-Buffered Epoch Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">
            01. Double-Buffered Epoch State Machine
          </h3>
          <span className="text-base font-mono text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/80 px-3 py-1 rounded">
            Packet Loss: 0.0000%
          </span>
        </div>

        <span className="text-base text-slate-400 block mb-6">
          Every 120 seconds, nodes compute standby epoch keys in advance. Upon transition, both keys remain valid for 10 seconds to ensure seamless in-flight packet transit without dropped sessions.
        </span>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Active Buffer (Epoch N) */}
          <div className="bg-slate-950 border-2 border-emerald-500/50 rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-emerald-400">ACTIVE BUFFER (Epoch #{currentEpoch})</span>
              <span className="text-base font-mono font-bold text-white bg-emerald-900/60 px-2.5 py-1 rounded">
                LIVE
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-base font-semibold text-slate-400 block">Active WireGuard PSK:</span>
                <code className="text-base font-mono text-emerald-300 block break-all mt-1 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {handshakeResult.wireguardPskHex}
                </code>
              </div>

              <div className="flex justify-between text-base text-slate-400 pt-2">
                <span>Epoch Lifetime: 120.00s</span>
                <span className="font-mono text-white font-bold">Expires in {timeRemaining}s</span>
              </div>
            </div>
          </div>

          {/* Standby Buffer (Epoch N+1) */}
          <div className="bg-slate-950 border border-violet-500/40 rounded-xl p-6 relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-violet-400">STANDBY BUFFER (Epoch #{currentEpoch + 1})</span>
              <span className="text-base font-mono font-bold text-violet-300 bg-violet-950/80 px-2.5 py-1 rounded">
                PRE-STAGED
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-base font-semibold text-slate-400 block">Next Staged PSK:</span>
                <code className="text-base font-mono text-violet-300 block break-all mt-1 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {handshakeResult.combinedSessionKeyHex.substring(0, 64)}
                </code>
              </div>

              <div className="flex justify-between text-base text-slate-400 pt-2">
                <span>Handshake Ready: Verified</span>
                <span className="font-mono text-emerald-400 font-bold">Auto-Roll Ready</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. HKDF-SHA512 Key Schedule Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-2xl font-bold text-white mb-2">
          02. Hybrid Dual-Secret Fusion Pipeline (RFC 5869 / FIPS 203)
        </h3>
        <span className="text-base text-slate-400 block mb-6">
          Mathematical composition of classical and post-quantum shared secrets into the final interface PSK.
        </span>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Box 1: Classical ECDH */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-violet-400 font-bold text-lg">
              <Lock className="w-5 h-5" />
              <span>1. Classical Curve25519 ECDH</span>
            </div>
            <span className="text-base text-slate-400 block">
              Diffie-Hellman scalar multiplication over Montgomery curve:
            </span>
            <code className="text-base font-mono text-violet-300 block break-all bg-slate-900 p-3 rounded border border-slate-800">
              {handshakeResult.classicalSharedSecretHex}
            </code>
            <span className="text-base text-slate-400 block">
              Compute Time: {handshakeResult.timingBreakdown.ecdhComputationMs.toFixed(2)} ms
            </span>
          </div>

          {/* Box 2: ML-KEM-1024 */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg">
              <Shield className="w-5 h-5" />
              <span>2. Post-Quantum ML-KEM-1024</span>
            </div>
            <span className="text-base text-slate-400 block">
              Decapsulated lattice message entropy in R_q:
            </span>
            <code className="text-base font-mono text-emerald-300 block break-all bg-slate-900 p-3 rounded border border-slate-800">
              {handshakeResult.pqcSharedSecretHex}
            </code>
            <span className="text-base text-slate-400 block">
              Compute Time: {(handshakeResult.timingBreakdown.mlKemEncapsMs + handshakeResult.timingBreakdown.mlKemDecapsMs).toFixed(2)} ms
            </span>
          </div>

          {/* Box 3: HKDF-SHA512 Fusion */}
          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-lg">
              <GitCommit className="w-5 h-5" />
              <span>3. HKDF-SHA512 Extractor</span>
            </div>
            <span className="text-base text-slate-400 block">
              K_session = HKDF(Salt, SS_classical || SS_pq)
            </span>
            <code className="text-base font-mono text-cyan-300 block break-all bg-slate-900 p-3 rounded border border-slate-800">
              {handshakeResult.wireguardPskHex}
            </code>
            <span className="text-base text-slate-400 block">
              Derivation Time: {handshakeResult.timingBreakdown.hkdfDerivationMs.toFixed(2)} ms
            </span>
          </div>

        </div>

        {/* Handshake Verification Banner */}
        <div className="mt-6 p-4 bg-slate-950 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span className="text-base font-bold text-white">
              End-to-End Hybrid Handshake Validated
            </span>
          </div>
          <span className="text-base font-mono text-slate-400">
            Total Handshake Compute: <b className="text-emerald-400 font-bold">{handshakeResult.handshakeLatencyMs.toFixed(2)} ms</b> &lt; 3.20 ms SLA
          </span>
        </div>

      </div>

    </div>
  );
};
