import React, { useState } from 'react';
import { X, ShieldCheck, FileText, CheckCircle2, Download, Award, Lock } from 'lucide-react';

interface TradeDressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TradeDressModal: React.FC<TradeDressModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyCitation = () => {
    navigator.clipboard?.writeText?.(
      'USPTO Docket #GF-CHRONO-2026-T2 | Ghost FactoryOS Trade-Dress Claim 35 U.S.C. § 171 | CHRONO-ARBITRAGE Quantum Hypercar'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDossier = () => {
    const text = `================================================================================
INSTITUTIONAL TRADE-DRESS & DESIGN PATENT SPECIFICATION
ASSET ID: GHOST-FACTORYOS-CHRONO-ARBITRAGE-T2
REGISTRATION DATE: 2026-10-04 | 35 U.S.C. § 171 / 35 U.S.C. § 101
================================================================================

CLAIM:
The ornamental design for a transparent concept hypercar chassis exposing a centralized
quantum computing manifold and dual-spectrum coherent optical conduits, as shown and described.

STRUCTURAL NOVELTY CLAIMS:
1. CANOPY & CHASSIS OPTICS:
   A continuous optical-grade transparent monocoque structure permitting unobstructed
   360-degree visual transmission of an internal cylindrical cryostat situated along the
   vehicle centerline.

2. INTEGRATED LASER WAVEGUIDES:
   Dual-spectrum coherent waveguides (532 nm emerald and 589 nm amber-gold) embedded
   co-axially within structural Grade 5 titanium pushrod suspension wishbones, providing
   both active stress telemetry and photon routing.

3. DUAL-PURPOSE AERODYNAMIC DIFFUSER:
   Stepped-throat carbon fiber underfloor diffuser tunnels terminating in twin multi-fin
   exhaust strakes, functioning simultaneously as aerodynamic ground-effect downforce
   generators and heat-sink dissipation arrays for helium dilution refrigeration.

4. VOLUMETRIC HOLOGRAPHIC FINANCIAL FIELD:
   Forward-projected dynamic vector array emitting from the transparent aero-splitter,
   visually rendering real-time sub-picosecond latency differential vectors.

CLEAN-ROOM CERTIFICATION:
- Contamination Check: 100% clean-room developed.
- License Compliance: Zero GPL / AGPL / SSPL contamination.
- Commercialization Rights: Full assignment eligible under standard APA and Monopoly Vault terms.
================================================================================`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CHRONO_ARBITRAGE_TRADE_DRESS_PATENT.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-emerald-400 font-bold uppercase">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              GHOST FACTORYOS · INTELLECTUAL PROPERTY DEFENSE
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Trade-Dress Defense Clause & Patent Specification
            </h2>
            <p className="text-sm text-zinc-300">
              USPTO 35 U.S.C. § 171 Design Patent Claims & Structural Novelty Registry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Patent Summary Card */}
        <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3.5">
          <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm font-mono gap-2 text-zinc-400">
            <div>
              DOCKET: <span className="text-white font-bold">GF-CHRONO-2026-T2</span>
            </div>
            <div>
              CLASS: <span className="text-emerald-400 font-bold">12-08 (MOTOR VEHICLES) / 14-02 (QUANTUM CORE)</span>
            </div>
            <div>
              FILING TIER: <span className="text-amber-400 font-bold">HYPERCAR FLAGSHIP</span>
            </div>
          </div>

          <div className="p-4 bg-black/50 rounded-xl border border-slate-800 font-mono text-sm text-zinc-200 leading-relaxed">
            <strong className="text-emerald-400 block mb-1.5 font-bold">CLAIM STATEMENT:</strong>
            "We claim the ornamental design for a futuristic transparent concept hypercar chassis exposing an ultra-advanced glowing quantum computing core named CHRONO-ARBITRAGE, with dual-spectrum laser conduits integrated along titanium suspension wishbones and carbon fiber aerodynamic diffusers, as substantially shown in the accompanying technical drawings."
          </div>
        </div>

        {/* 4 Core Structural Novelty Points */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
            Structural Novelty Declarations
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-base">
                <CheckCircle2 className="w-4 h-4" />
                <span>01. Longitudinal Sapphire Cryostat</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-sm">
                Central cylindrical vacuum housing enclosing 512 topological qubits at 12.4 mK, visible through 360° transparent crystal canopy with optical refraction index matching liquid glass.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-base">
                <CheckCircle2 className="w-4 h-4" />
                <span>02. Suspension Laser Conduits</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-sm">
                532 nm (emerald) and 589 nm (amber) optical waveguides routing coherent laser pulses along exposed Grade 5 titanium pushrods, combining structural suspension with sub-picosecond signal transport.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-base">
                <CheckCircle2 className="w-4 h-4" />
                <span>03. Thermodynamic Carbon Diffusers</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-sm">
                High-downforce stepped venturi tunnels generating up to 2,120 kgf suction while simultaneously channeling cryogenic helium exhaust over exposed aerodynamic diffusers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-base">
                <CheckCircle2 className="w-4 h-4" />
                <span>04. Holographic Vector Stream Field</span>
              </div>
              <p className="text-zinc-200 leading-relaxed text-sm">
                Volumetric heads-up display projecting cross-exchange latency arbitrage vectors directly forward through the transparent aero-splitter into the cockpit field of view.
              </p>
            </div>
          </div>
        </div>

        {/* Clean-Room Certification Bar */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6 text-emerald-400 shrink-0" />
            <div className="text-sm">
              <div className="font-bold text-emerald-300">Clean-Room IP Clearance Certified</div>
              <div className="text-zinc-300">
                Zero copyleft (GPL/AGPL) contamination · Permissive Apache/MIT foundation · Institutional transfer ready.
              </div>
            </div>
          </div>
          <div className="font-mono text-xs sm:text-sm text-emerald-400 font-bold px-3 py-1 bg-emerald-950/80 rounded border border-emerald-700/80 shrink-0">
            AUDIT PASSED
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopyCitation}
            className="w-full sm:w-auto px-4 py-2 text-xs font-mono rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{copied ? 'Citation Copied!' : 'Copy Legal Citation'}</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadDossier}
              className="w-full sm:w-auto px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Full Patent Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
