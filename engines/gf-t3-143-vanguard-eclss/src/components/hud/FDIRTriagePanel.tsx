/**
 * Vanguard-ECLSS: Fault Detection, Isolation, and Recovery (FDIR) Triage Engine
 * Zero-RPO Automated Containment & Isolation Panel
 * Upgraded Font Floor & High-Legibility Typography
 */

import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle2, RefreshCw, ZapOff, Wind, Flame, Radio } from 'lucide-react';
import { FDIRIncident } from '../../types/eclss';

interface FDIRTriagePanelProps {
  incidents: FDIRIncident[];
  onTriggerAnomaly: (type: 'DECOMPRESSION' | 'SABATIER_QUENCH' | 'ELECTROLYZER_DEGRADE' | 'VOC_SPIKE') => void;
  onResolveIncident: (id: string) => void;
  onResolveAll: () => void;
}

export const FDIRTriagePanel: React.FC<FDIRTriagePanelProps> = ({
  incidents,
  onTriggerAnomaly,
  onResolveIncident,
  onResolveAll,
}) => {
  return (
    <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400" />
            FAULT DETECTION, ISOLATION, AND RECOVERY (FDIR) TRIAGE ENGINE
          </h3>
          <p className="text-base text-slate-300 font-medium mt-1">
            Autonomous probabilistic root-cause estimation and sub-second actuator valve isolation sequencing.
          </p>
        </div>

        {incidents.length > 0 && (
          <button
            onClick={onResolveAll}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-base font-bold border border-slate-600 transition cursor-pointer"
          >
            <RefreshCw className="w-5 h-5 text-cyan-400" />
            <span>RESET / MITIGATE ALL FAULTS</span>
          </button>
        )}
      </div>

      {/* Anomaly Injection Hardware Testbed Simulator Controls */}
      <div className="p-5 rounded-xl bg-slate-950 border border-slate-800">
        <div className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
          <Radio className="w-5 h-5 text-amber-400" />
          <span>FAULT INJECTION HARNESS (F1 SKUNKWORKS TESTBED)</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => onTriggerAnomaly('DECOMPRESSION')}
            className="flex items-center justify-between p-4 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-700 text-rose-100 text-base font-bold transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Wind className="w-5 h-5 text-rose-400" />
              <span>Rapid Decompression</span>
            </div>
            <span className="text-sm font-mono text-rose-400 font-bold">-0.18 kPa/s</span>
          </button>

          <button
            onClick={() => onTriggerAnomaly('SABATIER_QUENCH')}
            className="flex items-center justify-between p-4 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700 text-amber-100 text-base font-bold transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <Flame className="w-5 h-5 text-amber-400" />
              <span>Sabatier Quenching</span>
            </div>
            <span className="text-sm font-mono text-amber-400 font-bold">&lt;340 °C</span>
          </button>

          <button
            onClick={() => onTriggerAnomaly('ELECTROLYZER_DEGRADE')}
            className="flex items-center justify-between p-4 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-700 text-purple-100 text-base font-bold transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <ZapOff className="w-5 h-5 text-purple-400" />
              <span>PEM Degradation</span>
            </div>
            <span className="text-sm font-mono text-purple-400 font-bold">+180 mV ΔV</span>
          </button>

          <button
            onClick={() => onTriggerAnomaly('VOC_SPIKE')}
            className="flex items-center justify-between p-4 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-700 text-cyan-100 text-base font-bold transition cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              <span>Trace VOC Spike</span>
            </div>
            <span className="text-sm font-mono text-cyan-400 font-bold">0.42 ppm</span>
          </button>
        </div>
      </div>

      {/* Incident List or All Clear Banner */}
      {incidents.length === 0 ? (
        <div className="p-8 rounded-xl bg-slate-950 border border-emerald-900/70 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <h4 className="text-xl font-bold text-white font-mono">ALL SUBSYSTEMS NOMINAL · ZERO ACTIVE FAULTS</h4>
          <p className="text-base text-slate-300 max-w-2xl mx-auto font-medium">
            Triple-Modular Redundant (TMR) sensors report steady-state closed-loop equilibrium across barometric, Sabatier, PEM electrolysis, and water recovery assemblies.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className={`p-6 rounded-xl border ${
                incident.severity === 'CRITICAL'
                  ? 'bg-rose-950/40 border-rose-600 shadow-xl shadow-rose-950/50'
                  : incident.severity === 'WARNING'
                  ? 'bg-amber-950/40 border-amber-600 shadow-lg shadow-amber-950/40'
                  : 'bg-cyan-950/40 border-cyan-700'
              } space-y-4`}
            >
              {/* Incident Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-md text-sm font-extrabold font-mono tracking-wider ${
                      incident.severity === 'CRITICAL'
                        ? 'bg-rose-600 text-white'
                        : incident.severity === 'WARNING'
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-cyan-500 text-slate-950'
                    }`}
                  >
                    {incident.severity}
                  </span>
                  <span className="text-lg font-bold font-mono text-white">
                    {incident.anomalyCode}
                  </span>
                  <span className="text-sm text-slate-300 font-mono">
                    [{incident.subsystem}] · {new Date(incident.timestampUtc).toLocaleTimeString()}
                  </span>
                </div>

                <button
                  onClick={() => onResolveIncident(incident.id)}
                  className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm font-mono transition cursor-pointer"
                >
                  EXECUTE MITIGATION
                </button>
              </div>

              {/* Description */}
              <p className="text-base text-slate-100 font-medium">
                {incident.description}
              </p>

              {/* Probabilistic Root-Cause Distribution */}
              <div className="space-y-3">
                <div className="text-sm font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Probabilistic Root Cause Vector:
                </div>
                <div className="space-y-2">
                  {incident.rootCauseProbability.map((rc, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm font-mono font-medium">
                        <span className="text-slate-200">{rc.hypothesis}</span>
                        <span className="text-cyan-300 font-bold text-base">{(rc.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-cyan-400 h-2 rounded-full"
                          style={{ width: `${rc.probability * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Automated Isolation Valve Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-sm font-mono">
                <div className="text-slate-300">
                  Prescribed Protocol: <strong className="text-amber-300 text-base">{incident.mitigationProtocol}</strong>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Valves Engaged:</span>
                  {incident.isolationValvesEngaged.map((v, i) => (
                    <span key={i} className="px-2.5 py-1 rounded bg-slate-800 text-rose-300 border border-slate-700 font-bold text-sm">
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
