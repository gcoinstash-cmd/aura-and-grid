import React from 'react';
import { Shield, Download, RefreshCw, Cpu, Activity, Lock } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  epochCounter: number;
  timeRemaining: number;
  onExportBundle: () => void;
  isExporting: boolean;
  onManualRekey: () => void;
  isRekeying: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  epochCounter,
  timeRemaining,
  onExportBundle,
  isExporting,
  onManualRekey,
  isRekeying
}) => {
  const navItems = [
    { id: 'cockpit', label: 'Mesh Telemetry' },
    { id: 'math', label: 'M-LWE Lattice Math' },
    { id: 'ratchet', label: 'Hybrid Key Ratchet' },
    { id: 'schema', label: 'AlloyDB DDL' },
    { id: 'openapi', label: 'OpenAPI 3.1' },
    { id: 'legal', label: 'Legal & APA Contract' },
    { id: 'spec', label: 'Engine Spec' }
  ];

  return (
    <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
      <div className="w-full px-6 py-4 flex flex-col xl:flex-row items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark with security icon */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-white block">
                GF-T3-144 Lattice-Mesh
              </span>
              <span className="text-base text-slate-400 block font-mono">
                Post-Quantum Cryptographic Engine · NIST FIPS 203 ML-KEM-1024
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links with active underline indicator */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full pb-2 xl:pb-0">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-4 py-2 text-base font-semibold transition-colors whitespace-nowrap rounded-md ${
                activeTab === item.id
                  ? 'bg-slate-800 text-emerald-400 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-900'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions and Epoch Rotation Counter */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-lg">
            <Activity className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-base text-slate-400 block">Epoch #{epochCounter}</span>
              <span className="text-base font-mono font-bold text-white tabular-nums">
                Rotation in {timeRemaining}s
              </span>
            </div>
          </div>

          <button
            onClick={onManualRekey}
            disabled={isRekeying}
            className="flex items-center gap-2 px-4 py-2.5 bg-violet-950/80 hover:bg-violet-900 text-violet-200 border border-violet-700/50 rounded-lg text-base font-semibold transition-colors disabled:opacity-50"
            title="Trigger instant out-of-band lattice re-key across all nodes"
          >
            <RefreshCw className={`w-5 h-5 ${isRekeying ? 'animate-spin' : ''}`} />
            <span>{isRekeying ? 'Rotating PSK...' : 'Force Re-Key'}</span>
          </button>

          <button
            onClick={onExportBundle}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-base shadow-lg shadow-emerald-950 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>{isExporting ? 'Packaging Zip...' : 'EXPORT 10/10 BUNDLE'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
