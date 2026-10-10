/**
 * Vanguard-ECLSS: Production OpenAPI 3.1.0 Contract & Interactive Test Console
 * Upgraded Font Floor & High-Legibility Typography
 */

import React, { useState } from 'react';
import { Server, Play, Copy, Check, Send, CheckCircle2, Shield } from 'lucide-react';
import { OPENAPI_SPEC_JSON } from '../../artifacts/openapiSpec';
import { solveMimoMpcStep, solveSabatierKinetics } from '../../engine/physics';

export const OpenApiView: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<'/atmosphere/balance' | '/water/recovery' | '/fdir/triage'>('/atmosphere/balance');

  // Test Console Inputs
  const [balancePtot, setBalancePtot] = useState(101.325);
  const [balancePpO2, setBalancePpO2] = useState(21.28);
  const [balancePpCO2, setBalancePpCO2] = useState(0.36);
  const [balanceCrew, setBalanceCrew] = useState(6);

  // Response State
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [responseLatency, setResponseLatency] = useState<number | null>(null);

  const handleCopySpec = () => {
    navigator.clipboard.writeText(JSON.stringify(OPENAPI_SPEC_JSON, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const executeSimulatedRequest = () => {
    const t0 = performance.now();

    if (activeEndpoint === '/atmosphere/balance') {
      const mockState = {
        totalPressureKpa: balancePtot,
        ppO2Kpa: balancePpO2,
        ppCO2Kpa: balancePpCO2,
        ppN2Kpa: balancePtot - balancePpO2 - balancePpCO2 - 1.2,
        ppH2OKpa: 1.2,
        temperatureCelsius: 21.5,
        relativeHumidityPct: 45.0,
        dewPointCelsius: 9.3,
        enthalpyKjPerKg: 42.8,
        traceVocPpm: 0.02,
        coPpm: 1.1,
        ch4Ppm: 3.4,
      };

      const crew = {
        crewCount: balanceCrew,
        metabolicActivity: 'NOMINAL' as const,
        o2ConsumptionKgPerDayPerCrew: 0.84,
        co2ProductionKgPerDayPerCrew: 1.0,
        metabolicWaterProductionLPerDay: 0.35,
        perspirationLPerDay: 1.8,
        urineProductionLPerDay: 1.5,
        heatOutputWattsPerCrew: 120,
      };

      const mpcResult = solveMimoMpcStep(mockState, crew, 1.0);
      const t1 = performance.now();
      setResponseLatency(Math.round((t1 - t0) * 1000) / 1000);

      setApiResponse({
        status: mpcResult.activeConstraintViolations.length === 0 ? 'OPTIMAL' : 'CONSTRAINED',
        solverLatencyMs: mpcResult.executionDurationMs,
        actuatorCommands: {
          o2InjectionRateGps: mpcResult.suggestedO2InjectionGps,
          n2InjectionRateGps: mpcResult.suggestedN2InjectionGps,
          co2ScrubberBlowerDutyPct: mpcResult.suggestedCo2ScrubberDutyPct,
          condensingHeatExchangerTempC: mpcResult.suggestedChxTempC,
        },
        projectedState1Min: mpcResult.predictedState,
        activeConstraintViolations: mpcResult.activeConstraintViolations,
      });
    } else if (activeEndpoint === '/water/recovery') {
      const sabatierSol = solveSabatierKinetics(850, 3400, 400, 150);
      const potableYield = 3.85 * 0.984 + sabatierSol.waterYieldLitersPerHour;
      const t1 = performance.now();
      setResponseLatency(Math.round((t1 - t0) * 1000) / 1000);

      setApiResponse({
        potableYieldLph: Math.round(potableYield * 100) / 100,
        loopRecoveryEfficiencyPct: 98.4,
        totalOrganicCarbonPpb: 120,
        potableQualityStandardMet: true,
        filterSaturationIndexPct: 14.5,
        estimatedFilterBedHoursRemaining: 1850.0,
      });
    } else {
      const t1 = performance.now();
      setResponseLatency(Math.round((t1 - t0) * 1000) / 1000);
      setApiResponse({
        incidentId: `INC-${Date.now().toString(36).toUpperCase()}`,
        severity: 'CRITICAL',
        rootCauseProbabilities: [
          { hypothesis: 'Module Alpha Outer Seal Failure', probability: 0.74 },
          { hypothesis: 'Micrometeorite Penetration in Bay 3', probability: 0.22 },
          { hypothesis: 'Relief Valve Stuck Open', probability: 0.04 },
        ],
        prescribedProtocol: 'ENGAGE_ISOLATION_SECTOR_A + HIGH_FLOW_N2_INJECTION',
        automatedValvesEngaged: ['ISO-V101-ALPHA', 'ISO-V102-ALPHA-RETURN'],
        crewEgressAdvisory: 'SEAL_COMPARTMENT_ALPHA_EVACUATE_TO_CORE_NODE',
      });
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white flex items-center gap-3">
            <Server className="w-8 h-8 text-emerald-400" />
            OPENAPI 3.1.0 PROTOCOL SPECIFICATION & TEST HARNESS
          </h2>
          <p className="text-base text-slate-300 font-medium mt-1">
            Machine-readable REST contracts with strict RFC 7807 error structures and JWT bearer token authorization.
          </p>
        </div>

        <button
          onClick={handleCopySpec}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-base font-bold font-mono transition cursor-pointer shadow-md"
        >
          {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
          <span>{copied ? 'JSON SPEC COPIED' : 'COPY OPENAPI_SPEC.JSON'}</span>
        </button>
      </div>

      {/* Interactive API Test Harness */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Play className="w-6 h-6 text-cyan-400" />
            <h3 className="text-xl font-bold font-mono text-white">INTERACTIVE SIMULATION CONSOLE</h3>
          </div>
          <span className="text-sm font-bold px-3 py-1 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
            LIVE EDGE SOLVER
          </span>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex gap-3 border-b border-slate-800 pb-3 overflow-x-auto">
          <button
            onClick={() => {
              setActiveEndpoint('/atmosphere/balance');
              setApiResponse(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-mono font-bold transition cursor-pointer ${
              activeEndpoint === '/atmosphere/balance'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-900/40'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            POST /eclss/atmosphere/balance
          </button>

          <button
            onClick={() => {
              setActiveEndpoint('/water/recovery');
              setApiResponse(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-mono font-bold transition cursor-pointer ${
              activeEndpoint === '/water/recovery'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-900/40'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            POST /eclss/water/recovery
          </button>

          <button
            onClick={() => {
              setActiveEndpoint('/fdir/triage');
              setApiResponse(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-mono font-bold transition cursor-pointer ${
              activeEndpoint === '/fdir/triage'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-900/40'
                : 'bg-slate-950 text-slate-200 border border-slate-800 hover:bg-slate-800'
            }`}
          >
            POST /eclss/fdir/triage
          </button>
        </div>

        {/* Dynamic Test Inputs */}
        {activeEndpoint === '/atmosphere/balance' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm">
            <div>
              <label className="text-slate-300 font-medium">Total Pressure (kPa):</label>
              <input
                type="number"
                step="0.1"
                value={balancePtot}
                onChange={(e) => setBalancePtot(parseFloat(e.target.value))}
                className="w-full mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">ppO2 (kPa):</label>
              <input
                type="number"
                step="0.1"
                value={balancePpO2}
                onChange={(e) => setBalancePpO2(parseFloat(e.target.value))}
                className="w-full mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">ppCO2 (kPa):</label>
              <input
                type="number"
                step="0.01"
                value={balancePpCO2}
                onChange={(e) => setBalancePpCO2(parseFloat(e.target.value))}
                className="w-full mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono text-base font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-medium">Crew Count:</label>
              <input
                type="number"
                min="1"
                max="16"
                value={balanceCrew}
                onChange={(e) => setBalanceCrew(parseInt(e.target.value, 10))}
                className="w-full mt-2 p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white font-mono text-base font-bold"
              />
            </div>
          </div>
        )}

        {/* Send Action */}
        <div className="flex items-center justify-between">
          <button
            onClick={executeSimulatedRequest}
            className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold font-mono text-base shadow-lg shadow-cyan-950/50 transition cursor-pointer"
          >
            <Send className="w-5 h-5" />
            <span>DISPATCH API REQUEST</span>
          </button>

          {responseLatency !== null && (
            <div className="flex items-center gap-2 text-sm font-mono text-emerald-400 bg-emerald-950/80 px-4 py-2 rounded-lg border border-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>HTTP 200 OK · Latency: {responseLatency} ms</span>
            </div>
          )}
        </div>

        {/* Response Viewer */}
        {apiResponse && (
          <div className="space-y-3 font-mono">
            <div className="text-sm font-bold text-slate-300 uppercase tracking-wider">JSON Response Payload:</div>
            <pre className="p-5 rounded-xl bg-slate-950 border border-cyan-900/70 text-sm sm:text-base text-cyan-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* OpenAPI Specification Full JSON Viewer */}
      <div className="p-6 sm:p-7 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-mono text-base font-bold text-white">OPENAPI_SPEC.json (OpenAPI 3.1.0 Validated)</span>
          </div>
          <span className="text-sm font-mono text-slate-400">RFC 7807 Problem Details</span>
        </div>

        <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-slate-200 overflow-x-auto max-h-[500px]">
          {JSON.stringify(OPENAPI_SPEC_JSON, null, 2)}
        </pre>
      </div>
    </div>
  );
};
