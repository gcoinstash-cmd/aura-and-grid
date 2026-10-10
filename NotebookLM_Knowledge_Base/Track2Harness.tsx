import React, { useState, useEffect, useMemo } from 'react';
import { 
  TRACK_3_ENGINES, 
  Track3Engine, 
  EngineEndpoint, 
  getTrack3EngineById, 
  DEFAULT_TRACK_3_ENGINE 
} from '../data/track3Engines';
import { 
  Activity, 
  Terminal, 
  Download, 
  Send, 
  RotateCcw, 
  Copy, 
  Check, 
  Cpu, 
  Zap, 
  FileCode, 
  Sparkles,
  Radio,
  Play,
  Pause
} from 'lucide-react';

interface Track2HarnessProps {
  initialEngineId?: string;
  onSelectEngine?: (engine: Track3Engine) => void;
  className?: string;
}

export const Track2Harness: React.FC<Track2HarnessProps> = ({
  initialEngineId,
  onSelectEngine,
  className = ''
}) => {
  // Engine Selection State (Defaulting to GF-T3-138 or requested initial)
  const [selectedEngine, setSelectedEngine] = useState<Track3Engine>(() => {
    if (initialEngineId) {
      const match = getTrack3EngineById(initialEngineId);
      if (match) return match;
    }
    return DEFAULT_TRACK_3_ENGINE;
  });

  // Selected Endpoint State
  const [selectedEndpointId, setSelectedEndpointId] = useState<string>(() => {
    return selectedEngine.primaryEndpoints[0]?.id || '';
  });

  // Active State Machine State
  const [activeMachineState, setActiveMachineState] = useState<string>(() => {
    return selectedEngine.initialState || selectedEngine.stateMachineStates[0] || 'NOMINAL';
  });

  // Dynamic Payload Editor State
  const [payloadText, setPayloadText] = useState<string>('');
  const [responseView, setResponseView] = useState<any>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lastExecutionMs, setLastExecutionMs] = useState<number>(selectedEngine.nominalLatencyMs);

  // Telemetry Gauge Dynamic Jitter
  const [autoSimulate, setAutoSimulate] = useState(true);
  const [jitterLatency, setJitterLatency] = useState(selectedEngine.nominalLatencyMs);
  const [jitterThroughput, setJitterThroughput] = useState(selectedEngine.nominalThroughputReqSec);
  const [cycleTickCount, setCycleTickCount] = useState(0);

  // Copy notification states
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // Sync state when selectedEngine changes
  useEffect(() => {
    setSelectedEndpointId(selectedEngine.primaryEndpoints[0]?.id || '');
    setActiveMachineState(selectedEngine.initialState || selectedEngine.stateMachineStates[0] || 'NOMINAL');
    setJitterLatency(selectedEngine.nominalLatencyMs);
    setJitterThroughput(selectedEngine.nominalThroughputReqSec);
    setResponseView(selectedEngine.primaryEndpoints[0]?.sampleResponse || null);
    setResponseStatus(200);
  }, [selectedEngine]);

  // Current active endpoint object
  const activeEndpoint = useMemo<EngineEndpoint | undefined>(() => {
    return selectedEngine.primaryEndpoints.find((e) => e.id === selectedEndpointId) || selectedEngine.primaryEndpoints[0];
  }, [selectedEngine, selectedEndpointId]);

  // Sync payload text when endpoint changes
  useEffect(() => {
    if (activeEndpoint && activeEndpoint.samplePayload) {
      setPayloadText(JSON.stringify(activeEndpoint.samplePayload, null, 2));
    } else {
      setPayloadText('');
    }
    if (activeEndpoint) {
      setResponseView(activeEndpoint.sampleResponse);
      setResponseStatus(200);
    }
  }, [activeEndpoint]);

  // Animated Telemetry Pulse Loop (ADHD-friendly visual heartbeat)
  useEffect(() => {
    if (!autoSimulate) return;

    const interval = setInterval(() => {
      setCycleTickCount((c) => c + 1);
      
      // Jitter Latency +/- 4%
      const latDelta = (Math.random() - 0.5) * 0.08 * selectedEngine.nominalLatencyMs;
      const newLat = Math.max(0.01, Number((selectedEngine.nominalLatencyMs + latDelta).toFixed(3)));
      setJitterLatency(newLat);

      // Jitter Throughput +/- 3%
      const tputDelta = (Math.random() - 0.5) * 0.06 * selectedEngine.nominalThroughputReqSec;
      const newTput = Math.round(selectedEngine.nominalThroughputReqSec + tputDelta);
      setJitterThroughput(newTput);
    }, 400);

    return () => clearInterval(interval);
  }, [autoSimulate, selectedEngine]);

  // Execute Probe / Dispatch Request
  const handleExecuteProbe = () => {
    setIsExecuting(true);
    const start = performance.now();

    setTimeout(() => {
      let parsed = null;
      try {
        if (payloadText.trim()) {
          parsed = JSON.parse(payloadText);
        }
      } catch (err) {
        // Syntax error in custom input
        setResponseView({
          error: "INVALID_JSON_PAYLOAD",
          detail: "Malformed input JSON rejected by client-side parser",
          raw: payloadText
        });
        setResponseStatus(422);
        setIsExecuting(false);
        return;
      }

      // Simulate dynamic endpoint response
      const elapsed = Number((performance.now() - start + selectedEngine.nominalLatencyMs).toFixed(2));
      setLastExecutionMs(elapsed);
      setJitterLatency(elapsed);

      if (parsed) {
        // Dynamically reflect submitted fields into sample response
        if (typeof activeEndpoint?.sampleResponse === 'object' && !Array.isArray(activeEndpoint?.sampleResponse)) {
          setResponseView({
            ...activeEndpoint.sampleResponse,
            _echo_inbound: parsed,
            _timestamp_sim_ns: Date.now() * 1000000,
            _roundtrip_ms: elapsed
          });
        } else {
          setResponseView(activeEndpoint?.sampleResponse || { status: "PROBE_SUCCESS" });
        }
      } else {
        setResponseView(activeEndpoint?.sampleResponse || { status: "PROBE_SUCCESS" });
      }

      setResponseStatus(200);
      setIsExecuting(false);
    }, 180);
  };

  // Reset Payload to Default Sample
  const handleResetPayload = () => {
    if (activeEndpoint && activeEndpoint.samplePayload) {
      setPayloadText(JSON.stringify(activeEndpoint.samplePayload, null, 2));
    } else {
      setPayloadText('');
    }
  };

  // Generate cURL command
  const generatedCurl = useMemo(() => {
    if (!activeEndpoint) return '';
    const baseUrl = `http://127.0.0.1:8080`;
    if (activeEndpoint.method === 'GET' || activeEndpoint.method === 'DELETE') {
      return `curl -X ${activeEndpoint.method} "${baseUrl}${activeEndpoint.path}"`;
    }
    const bodyStr = payloadText.trim() ? payloadText.replace(/"/g, '\\"') : '{}';
    return `curl -X ${activeEndpoint.method} "${baseUrl}${activeEndpoint.path}" \\\n  -H "Content-Type: application/json" \\\n  -d "${bodyStr.replace(/\n/g, '')}"`;
  }, [activeEndpoint, payloadText]);

  // Copy cURL to clipboard
  const handleCopyCurl = () => {
    navigator.clipboard.writeText(generatedCurl);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2000);
  };

  // Copy response JSON to clipboard
  const handleCopyResponse = () => {
    if (!responseView) return;
    navigator.clipboard.writeText(JSON.stringify(responseView, null, 2));
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  // Trigger ENGINE_SPEC.md download
  const handleDownloadSpec = () => {
    const blob = new Blob([selectedEngine.specContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = selectedEngine.specFileName || `ENGINE_SPEC_${selectedEngine.id}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Trigger Dockerfile download
  const handleDownloadDockerfile = () => {
    const blob = new Blob([selectedEngine.dockerfileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dockerfile.${selectedEngine.id.toLowerCase()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Vertical badge colors
  const verticalBadgeColor = useMemo(() => {
    if (selectedEngine.vertical.includes('Vertical A')) return 'bg-cyan-950/60 text-cyan-400 border-cyan-500/40';
    if (selectedEngine.vertical.includes('Vertical B')) return 'bg-emerald-950/60 text-emerald-400 border-emerald-500/40';
    return 'bg-purple-950/60 text-purple-400 border-purple-500/40';
  }, [selectedEngine]);

  return (
    <div className={`w-full bg-[#0A0A0B] text-slate-100 font-mono rounded-2xl border-2 border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden ${className}`}>
      {/* ==================================================================== */}
      {/* TOP DECK: COCKPIT HUD HEADER & FLEET MATRIX SWITCHER */}
      {/* ==================================================================== */}
      <div className="bg-black/90 border-b border-emerald-500/30 p-4 sm:p-5">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                UNIVERSAL TRACK 2 HARNESS // TELEMETRY COCKPIT
              </span>
              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${verticalBadgeColor}`}>
                {selectedEngine.vertical}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] bg-slate-900 border border-slate-700 text-slate-300">
                SLOT: {selectedEngine.id}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{selectedEngine.name}</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
              <strong className="text-emerald-400">MATH CORE:</strong> {selectedEngine.mathCore}
            </p>
          </div>

          {/* Quick HUD Actions & Auto-Sim Toggle */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setAutoSimulate(!autoSimulate)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                autoSimulate 
                  ? 'bg-emerald-950/70 text-emerald-300 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                  : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}
              title="Toggle simulated telemetry stream jitter"
            >
              {autoSimulate ? <Pause size={13} className="text-emerald-400" /> : <Play size={13} className="text-slate-400" />}
              <span>{autoSimulate ? 'STREAM ACTIVE' : 'STREAM PAUSED'}</span>
            </button>

            <button
              onClick={handleDownloadSpec}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition-all shadow-sm"
              title={`Download ${selectedEngine.specFileName}`}
            >
              <Download size={13} />
              <span>SPEC.MD</span>
            </button>

            <button
              onClick={handleDownloadDockerfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/40 hover:border-amber-400 transition-all shadow-sm"
              title="Download container Dockerfile"
            >
              <FileCode size={13} />
              <span>DOCKERFILE</span>
            </button>
          </div>
        </div>

        {/* 14-Engine Fleet Switcher Bar (ADHD-friendly single-click switcher) */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
            <span>FLEET MATRIX // 14 TRACK 3 PRODUCTION REFERENCE ENGINES:</span>
            <span className="text-emerald-400 font-mono">SELECTED: {selectedEngine.id}</span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-emerald-500/20">
            {TRACK_3_ENGINES.map((eng) => {
              const isCurrent = eng.id === selectedEngine.id;
              let dotColor = 'bg-cyan-400';
              if (eng.vertical.includes('Vertical B')) dotColor = 'bg-emerald-400';
              if (eng.vertical.includes('Vertical C')) dotColor = 'bg-purple-400';

              return (
                <button
                  key={eng.id}
                  onClick={() => {
                    setSelectedEngine(eng);
                    if (onSelectEngine) onSelectEngine(eng);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                    isCurrent
                      ? 'bg-emerald-500 text-black border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.5)] scale-[1.02]'
                      : 'bg-slate-950/80 text-slate-300 hover:text-white border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isCurrent ? 'bg-black' : dotColor}`} />
                  <span>{eng.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MIDDLE DECK: 4 CYBERPUNK TELEMETRY DIALS / GAUGES */}
      {/* ==================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gradient-to-b from-slate-950/90 to-black border-b border-emerald-500/20">
        {/* GAUGE 1: LATENCY (ms) */}
        <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3.5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-emerald-400">
              <Zap size={13} /> P99 LATENCY
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-emerald-500/30 text-emerald-300">
              TARGET: {selectedEngine.nominalLatencyMs} ms
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              {jitterLatency.toFixed(3)}
            </span>
            <span className="text-sm font-bold text-emerald-400">ms</span>
            <span className="text-[10px] text-slate-400 font-mono ml-auto">
              ({(jitterLatency * 1000).toFixed(0)} µs)
            </span>
          </div>

          {/* Segmented Cyber-Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800 flex gap-0.5">
              {[...Array(12)].map((_, idx) => {
                const filled = idx < 9;
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-sm transition-all duration-300 ${
                      filled 
                        ? idx > 7 ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-emerald-600'
                        : 'bg-slate-800/40'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>JITTER: ±0.04 ms</span>
              <span className="text-emerald-400 font-bold">SUB-MS OK</span>
            </div>
          </div>
        </div>

        {/* GAUGE 2: THROUGHPUT (req/s) */}
        <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-3.5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-cyan-400">
              <Activity size={13} /> THROUGHPUT
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300">
              PEAK BANDWIDTH
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black text-white font-mono tracking-tight">
              {jitterThroughput.toLocaleString()}
            </span>
            <span className="text-sm font-bold text-cyan-400">req/s</span>
          </div>

          {/* Tachometer Bar */}
          <div className="space-y-1">
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div 
                className="bg-gradient-to-r from-cyan-600 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_8px_#22d3ee]"
                style={{ width: `${Math.min(100, Math.max(30, (jitterThroughput / (selectedEngine.nominalThroughputReqSec * 1.2)) * 100))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>LOAD: 84% SAT</span>
              <span className="text-cyan-400 font-bold">RADIX CORE</span>
            </div>
          </div>
        </div>

        {/* GAUGE 3: CYCLE RATE (Hz) */}
        <div className="bg-slate-900/60 border border-purple-500/30 rounded-xl p-3.5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-purple-400">
              <Radio size={13} /> CLOCK FREQUENCY
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/60 border border-purple-500/30 text-purple-300 font-mono">
              TICK #{cycleTickCount}
            </span>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {selectedEngine.cycleFrequency}
            </span>
          </div>

          {/* Oscilloscope Waveform Graphic */}
          <div className="space-y-1">
            <div className="h-6 w-full bg-slate-950 rounded border border-slate-800 px-1 flex items-center overflow-hidden">
              <svg className="w-full h-full stroke-purple-400 fill-none" viewBox="0 0 100 24">
                <path
                  d="M0 12 L20 12 L25 4 L30 20 L35 12 L55 12 L60 4 L65 20 L70 12 L90 12 L95 4 L100 20"
                  strokeWidth="1.8"
                  className={autoSimulate ? 'animate-pulse' : ''}
                />
              </svg>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>PERIOD: {selectedEngine.tickPeriodMs} ms</span>
              <span className="text-purple-400 font-bold">DETERMINISTIC</span>
            </div>
          </div>
        </div>

        {/* GAUGE 4: STATE MACHINE COCKPIT */}
        <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-3.5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
              <Cpu size={13} /> STATE MACHINE
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold">
              GATE 1 PASS
            </span>
          </div>

          <div className="my-2">
            <div className="text-xs text-slate-400 mb-1">ACTIVE STATE:</div>
            <div className="px-2.5 py-1 rounded bg-black/80 border border-amber-500/50 text-amber-300 font-black text-xs sm:text-sm tracking-wide inline-flex items-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{activeMachineState}</span>
            </div>
          </div>

          {/* Interactive State Selector Chips */}
          <div className="space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">SIMULATE TRANSITION:</div>
            <div className="flex flex-wrap gap-1">
              {selectedEngine.stateMachineStates.map((st) => (
                <button
                  key={st}
                  onClick={() => setActiveMachineState(st)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all border ${
                    activeMachineState === st
                      ? 'bg-amber-400 text-black border-amber-300 font-black'
                      : 'bg-black/60 text-slate-400 hover:text-white border-slate-800 hover:border-slate-600'
                  }`}
                >
                  {st.split('_')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* LOWER DECK: DYNAMIC OPENAPI PAYLOAD INSPECTOR & RUNNER */}
      {/* ==================================================================== */}
      <div className="p-4 sm:p-6 space-y-5">
        {/* Endpoint Selector Tabs */}
        <div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Terminal size={14} className="text-emerald-400" /> OPENAPI 3.1 ENDPOINTS ({selectedEngine.primaryEndpoints.length}):
            </span>
            <span className="text-slate-400 text-[11px]">SELECT ROUTE TO INSPECT & PROBE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {selectedEngine.primaryEndpoints.map((ep) => {
              const isSelected = ep.id === activeEndpoint?.id;
              let methodColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
              if (ep.method === 'POST') methodColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40';
              if (ep.method === 'DELETE') methodColor = 'text-rose-400 bg-rose-950/60 border-rose-500/40';
              if (ep.method === 'PUT') methodColor = 'text-amber-400 bg-amber-950/60 border-amber-500/40';

              return (
                <button
                  key={ep.id}
                  onClick={() => setSelectedEndpointId(ep.id)}
                  className={`text-left p-2.5 rounded-xl transition-all border flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-900 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] scale-[1.01]'
                      : 'bg-black/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${methodColor}`}>
                      {ep.method}
                    </span>
                    <span className="text-xs font-bold text-white truncate font-mono">
                      {ep.path}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {ep.summary}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Dual-Pane Inspector: Inbound Request Editor vs Live Outbound Response */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* LEFT PANE: INBOUND REQUEST PAYLOAD EDITOR */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wide">REQUEST PAYLOAD</span>
                  <span className="text-[10px] text-slate-400 font-mono">application/json</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {activeEndpoint?.samplePayload && (
                    <button
                      onClick={handleResetPayload}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
                      title="Reset payload to default schema sample"
                    >
                      <RotateCcw size={11} />
                      <span>RESET</span>
                    </button>
                  )}
                  <button
                    onClick={handleCopyCurl}
                    className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-cyan-950/40 hover:bg-cyan-950/80 border border-cyan-500/40 transition-colors"
                    title="Copy cURL command to clipboard"
                  >
                    {copiedCurl ? <Check size={11} /> : <Copy size={11} />}
                    <span>{copiedCurl ? 'COPIED cURL' : 'cURL'}</span>
                  </button>
                </div>
              </div>

              {activeEndpoint?.samplePayload ? (
                <div className="relative">
                  <textarea
                    value={payloadText}
                    onChange={(e) => setPayloadText(e.target.value)}
                    rows={12}
                    className="w-full bg-black/80 text-emerald-300 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 resize-y"
                    placeholder="Enter valid JSON payload..."
                    spellCheck={false}
                  />
                </div>
              ) : (
                <div className="bg-black/40 border border-dashed border-slate-800 rounded-lg p-8 text-center text-xs text-slate-400 flex flex-col items-center justify-center min-h-[240px]">
                  <Terminal size={24} className="text-slate-400 mb-2" />
                  <span className="font-bold text-slate-300">NO REQUEST BODY REQUIRED</span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    {activeEndpoint?.method} {activeEndpoint?.path} is a parameter-free or query-driven route.
                  </span>
                </div>
              )}
            </div>

            {/* Execute Probe Action Button */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                PROBE LATENCY: <strong className="text-emerald-400">{lastExecutionMs} ms</strong>
              </span>

              <button
                onClick={handleExecuteProbe}
                disabled={isExecuting}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer disabled:opacity-50"
              >
                <Send size={13} className={isExecuting ? 'animate-bounce' : ''} />
                <span>{isExecuting ? 'PROBING RUNTIME...' : 'EXECUTE PROBE'}</span>
              </button>
            </div>
          </div>

          {/* RIGHT PANE: LIVE OUTBOUND RESPONSE VIEWER */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-slate-300 uppercase tracking-wide">RESPONSE TELEMETRY</span>
                  {responseStatus && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                      HTTP {responseStatus}
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopyResponse}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 transition-colors"
                >
                  {copiedResponse ? <Check size={11} /> : <Copy size={11} />}
                  <span>{copiedResponse ? 'COPIED' : 'COPY JSON'}</span>
                </button>
              </div>

              {/* JSON Response View */}
              <div className="relative">
                <pre className="bg-black/90 text-cyan-300 font-mono text-xs p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-[300px] scrollbar-thin scrollbar-thumb-cyan-500/20">
                  {responseView ? JSON.stringify(responseView, null, 2) : '// No response probe recorded yet'}
                </pre>
              </div>
            </div>

            {/* Response Footer Stats */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-emerald-400" />
                <span>STATE: <strong className="text-emerald-400">{activeMachineState}</strong></span>
              </span>
              <span>SIMULATED HARNESS RESPONSE</span>
            </div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* FOOTER AUDIT & M&A APA VALUES */}
        {/* ==================================================================== */}
        <div className="bg-black/60 border border-slate-800/80 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-slate-300 font-bold">MONOPOLY VALUATION:</span>
            <span className="text-emerald-400 font-bold font-mono">APA FLOOR: {selectedEngine.apaValueFloor}</span>
            <span className="text-cyan-400 font-bold font-mono">CEILING: {selectedEngine.monopolyCeiling}</span>
            <span className="text-purple-400 font-mono">{selectedEngine.monthlySeatLicense}</span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            TAG: {selectedEngine.truthBadge}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Track2Harness;
