import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Search, Terminal, Play, Pause, RotateCcw, AlertCircle, CheckCircle, Truck, PackageCheck, Radio } from "lucide-react";

interface StatusStep {
  id: string;
  label: string;
  subtitle: string;
  details: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TRACKING_STEPS: StatusStep[] = [
  {
    id: "step-1",
    label: "PROTOCOL ESTABLISHED",
    subtitle: "ORDER SIGNALS RECEIVED & LOCKED",
    details: "Your order ledger has been decrypted, authorized, and injected into our direct tactical kitchen pipeline.",
    icon: CheckCircle
  },
  {
    id: "step-2",
    label: "PACKING LOADOUT",
    subtitle: "SEARING UNDERWAY IN SECTOR PREP",
    details: "Searing A5 Wagyu brisket/Al Pastor ribbons and packaging inside insulated charcoal-mesh containers.",
    icon: PackageCheck
  },
  {
    id: "step-3",
    label: "IN TRANSIT VIA SECTOR 9",
    subtitle: "INTERCEPT VEHICLE IN MOTION",
    details: "Mobile transport unit is cruising down Sector 9 arterial roads at high velocity. Tactical courier assigned.",
    icon: Truck
  },
  {
    id: "step-4",
    label: "ARRIVED AT CONCRETE DEPOT",
    subtitle: "ANCHOR SECURED AT RENDEZVOUS",
    details: "Courier vehicle has landed. Cargo safe inside thermal box. Ready for distribution handoff.",
    icon: Terminal
  }
];

// Presets for super easy user interaction
const PRESET_IDS = [
  { id: "TX-PSTR-02", name: "CHEF // SECTOR-02", type: "Al Pastor" },
  { id: "TX-WAGYU-A5", name: "VIP // COURIER-A5", type: "A5 Wagyu" },
  { id: "VOID-ZERO-9", name: "SYS // SECTOR-9", type: "Mystery Load" }
];

export const OrderStatusTracking: React.FC = () => {
  const [typedId, setTypedId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // System step sequence logic
  useEffect(() => {
    if (!isStarted || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < TRACKING_STEPS.length - 1) {
          const nextStep = prev + 1;
          // Generate new logs matching transition
          pushLog(`System transitioned to State [${TRACKING_STEPS[nextStep].label}] [${nextStep + 1}/${TRACKING_STEPS.length}]`);
          if (nextStep === 1) {
            pushLog("KITCHEN MODULE INSTRUCTION: Engage dual infrared torches for deep sear");
            pushLog("METRIC: Griddle thermal status steady at 450°C");
          } else if (nextStep === 2) {
            pushLog("CARGO LOCKDOWN: Mesh container sealed at 68°C core temp");
            pushLog("SECTOR GRID MAP: Pinpointing shortest telemetry path via Interstate Corridor 9");
            pushLog("AGENT STATUS: Dispatcher Unit S9-Courier engaged and rolling");
          } else if (nextStep === 3) {
            pushLog("SIGNAL: Proximity sensor tripped at Concrete Depot outer boundary");
            pushLog("CORRESPONDENCE: Dispatch successfully arrived at destination");
            pushLog("TERMINAL ACCESS: Order ready for manual key retrieval");
          }
          return nextStep;
        } else {
          setIsPlaying(false);
          pushLog("TELEMETRY STREAM: Complete. System listening on idle...");
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isStarted, isPlaying]);

  const pushLog = (text: string) => {
    const timestamp = new Date().toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    setLogs((prev) => [...prev, `[${timestamp}] ${text}`]);
  };

  // Scroll terminal to bottom
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const startTracking = (id: string) => {
    const cleanId = id.trim().toUpperCase() || "SEC-8809";
    setActiveId(cleanId);
    setTypedId(cleanId);
    setIsStarted(true);
    setCurrentStep(0);
    setIsPlaying(true);
    
    // =========================================================================
    // DEVELOPER HOOKUP // INSERT YOUR POS LINK HERE / EXTERNAL TRACKING API
    // =========================================================================
    // By default, this terminal simulates delivery milestones using local timers.
    // Replace this simulation by loading data from your live logistics system,
    // like Mapbox, ShipEngine, Toast Delivery, or an AWS/GCP telemetry stream.
    // E.g.:
    //   fetch(`/api/orders/track?id=${cleanId}`)
    //     .then(res => res.json())
    //     .then(data => {
    //       setCurrentStep(data.currentStepIndex); // 0 to 3
    //       setLogs(prev => [...prev, `[LOG] Loaded real status: ${data.status}`]);
    //     });
    // =========================================================================
    
    // Initialize standard terminal start logs
    const now = new Date().toLocaleTimeString("en-US", { hour12: false });
    setLogs([
      `[${now}] INITIALIZING DECRYPTOR SIGNAL // KEY ID: [${cleanId}]`,
      `[${now}] CONNECTING TO CENTRAL TELEMETRY GATEWAY - SECTOR 18...`,
      `[${now}] CONNECTION ESTABLISHED // HANDSHAKE OK`,
      `[${now}] BOUND TO STREAM INDEX: dispatch_telemetry_${cleanId.toLowerCase()}`,
      `[${now}] QUERY SUCCESS: Matches existing kitchen workload queue`,
      `[${now}] State bound to: [${TRACKING_STEPS[0].label}]`
    ]);
  };

  const handleApplyPreset = (presetId: string) => {
    startTracking(presetId);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedId.trim()) {
      startTracking(typedId);
    }
  };

  const handleReset = () => {
    setIsStarted(false);
    setActiveId("");
    setTypedId("");
    setCurrentStep(0);
    setLogs([]);
  };

  return (
    <section id="order-tracking" className="py-20 bg-[#0B0B0C] border-b border-brand-border px-6 relative overflow-hidden">
      {/* Visual cyber mesh background & circular glows */}
      <div className="absolute top-[30%] right-[5%] w-[45%] h-[40%] bg-brand-accent/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[5%] w-[35%] h-[35%] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] pointer-events-none opacity-40" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* Header visual block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-brand-border pb-8">
          <div className="space-y-2 text-left">
            <span className="font-mono text-xs text-brand-accent uppercase tracking-widest font-black flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
              SYSTEM PROTOCOL // DELIVERIES
            </span>
            <div className="space-y-1">
              <h2 className="font-display text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                TACTICAL ORDER TELEMETRY
              </h2>
              <span className="block font-mono text-[11px] text-brand-muted uppercase tracking-wider">
                (Real-Time Tracking)
              </span>
            </div>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-brand-muted font-sans leading-relaxed text-left md:text-right">
            Tap a preset courier ID or type a tracking key to lock into real-time kitchen status feeds and monitor dispatch intercepts.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Panel: Credentials Entry */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Card glowColor="orange" className="flex-1 flex flex-col justify-between p-6 sm:p-8 border border-brand-border bg-brand-card relative">
              
              <div className="space-y-6 text-left">
                <span className="font-mono text-[10px] text-brand-orange tracking-widest uppercase block font-black">
                  // TELEMETRY GATEWAY ID
                </span>
                
                <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight leading-none">
                  INITIATE SECURE LINK
                </h3>

                <p className="text-xs sm:text-sm text-brand-muted font-sans leading-relaxed">
                  Type a custom tracking signature code key, or engage one of our pre-existing telemetry signals from active courier runs down below.
                </p>

                {/* Tracking ID Form */}
                <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
                  <label htmlFor="trackingIdInput" className="sr-only">Enter Tracking ID</label>
                  <div className="relative">
                    <input
                      id="trackingIdInput"
                      type="text"
                      className="w-full bg-[#080809] border border-brand-border font-mono text-sm px-4 py-3.5 pr-12 text-white placeholder-brand-muted focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent uppercase letter-spacing-1.5 transition-all"
                      placeholder="e.g. TX-PSTR-02"
                      value={typedId}
                      onChange={(e) => setTypedId(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-accent transition-colors"
                      aria-label="Track Order Status"
                    >
                      <Search className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <Button
                    type="submit"
                    variant={typedId.trim() ? "orange" : "secondary"}
                    className="w-full h-12 text-xs flex items-center justify-center gap-2 font-mono font-bold"
                  >
                    <Radio className={`w-4 h-4 ${isStarted && isPlaying ? "animate-pulse text-brand-accent" : ""}`} />
                    ENGAGE SIGNAL & ACTIVATE
                  </Button>
                </form>

                {/* Preset List */}
                <div className="pt-6 border-t border-brand-border/60 space-y-3">
                  <span className="block font-mono text-[10px] text-brand-muted tracking-widest uppercase font-bold">
                    ACTIVE TELEMETRY PRESETS
                  </span>
                  
                  <div className="grid grid-cols-1 gap-2.5">
                    {PRESET_IDS.map((p) => {
                      const isActive = activeId === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handleApplyPreset(p.id)}
                          type="button"
                          className={`w-full flex items-center justify-between p-3 border font-mono text-xs text-left transition-all rounded-sm cursor-pointer ${
                            isActive 
                              ? "bg-brand-accent/5 border-brand-accent text-brand-accent shadow-[0_0_10px_rgba(204,255,0,0.05)]" 
                              : "bg-brand-bg/60 border-brand-border text-brand-text/80 hover:border-brand-text/30 hover:bg-brand-bg/90"
                          }`}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-black text-[11px] tracking-wider text-white">ID: {p.id}</span>
                            <span className="text-[9px] text-brand-muted uppercase font-bold">{p.name} // {p.type}</span>
                          </div>
                          
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                            {isActive ? (
                              <span className="flex h-2 w-2 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                              </span>
                            ) : null}
                            <span>LOAD LINK</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Console Reset */}
              {isStarted && (
                <div className="pt-6 mt-6 border-t border-brand-border flex items-center justify-between">
                  <span className="font-mono text-[10px] text-brand-muted">
                    LINK STABLE // ENCRYPTED AES
                  </span>
                  <button
                    onClick={handleReset}
                    className="font-mono text-[10px] text-brand-orange hover:text-white transition-colors flex items-center gap-1 select-none font-bold cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    TERMINATE CONNECTION
                  </button>
                </div>
              )}

            </Card>
          </div>

          {/* Right Panel: Live-updating Terminal Progress Timeline */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="bg-[#111112] border border-brand-border p-6 rounded-sm relative flex flex-col justify-between min-h-[500px] overflow-hidden">
              
              {/* Terminal static background overlays */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(ellipse_at_top_right,rgba(204,255,0,0.08),transparent)] pointer-events-none" />
              <div className="absolute inset-0 bg-[#000]/10 pointer-events-none" />

              {/* Terminal Window Header */}
              <div className="flex items-center justify-between border-b border-brand-border/80 pb-4 mb-6 z-10">
                <div className="flex items-center gap-2">
                  {/* Status Indicator Dot */}
                  <span className="relative flex h-3 w-3">
                    {isStarted ? (
                      <>
                        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isPlaying ? "bg-brand-accent" : "bg-brand-orange"} opacity-75`}></span>
                        <span className={`relative inline-flex rounded-full h-3 w-3 ${isPlaying ? "bg-brand-accent" : "bg-brand-orange"}`}></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#334155]"></span>
                    )}
                  </span>
                  
                  <div className="font-mono text-[11px] font-black text-left">
                    <span className="text-brand-muted">CON-TTY :: </span>
                    <span className="text-white uppercase font-bold">
                      {isStarted ? `PORT_ACTIVE // KEY: ${activeId}` : "STATUS_LISTEN // IDLE"}
                    </span>
                  </div>
                </div>

                {isStarted && (
                  <div className="flex items-center gap-3">
                    {/* Controls (Play/Pause) */}
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="p-1 px-1.5 border border-brand-border/80 hover:border-brand-accent bg-brand-bg text-brand-muted hover:text-brand-accent flex items-center gap-1 font-mono text-[9px] font-bold rounded-sm cursor-pointer"
                      title={isPlaying ? "Pause Stream" : "Resume Stream"}
                    >
                      {isPlaying ? (
                        <>
                          <Pause className="w-2.5 h-2.5" /> PAUSE
                        </>
                      ) : (
                        <>
                          <Play className="w-2.5 h-2.5 text-brand-accent" /> RESUME
                        </>
                      )}
                    </button>
                    <span className="font-mono text-[10px] text-brand-muted bg-brand-bg px-2 py-0.5 border border-brand-border/40 font-bold">
                      STEP {currentStep + 1}/{TRACKING_STEPS.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Content Switching Block */}
              <AnimatePresence mode="wait">
                {!isStarted ? (
                  // Welcome idle state screen
                  <motion.div
                    key="idle-state"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto relative z-10"
                  >
                    <div className="p-4 rounded-full bg-brand-accent/5 border border-brand-accent/20 animate-pulse">
                      <Terminal className="w-10 h-10 text-brand-accent" />
                    </div>
                    <div className="space-y-1.5">
                      <h4 className="font-mono text-sm font-black text-white uppercase tracking-wider">
                        AWAITING COURIER TELEMETRY SIGNALS
                      </h4>
                      <p className="max-w-xs text-xs text-brand-muted font-sans leading-relaxed mx-auto">
                        Bind a tracking signature to intercept active courier transceivers. Standby grid lines listening...
                      </p>
                    </div>
                    <div className="font-mono text-[9px] text-brand-accent/80 bg-brand-accent/5 px-3 py-1 border border-brand-accent/20 font-bold">
                      STATUS // PROTOCOL_READY_FOR_HANDSHAKE
                    </div>
                  </motion.div>
                ) : (
                  // Active timeline screen
                  <motion.div
                    key="active-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 flex flex-col justify-between space-y-6 text-left relative z-10"
                  >
                    {/* Vertical Progress Timeline */}
                    <div className="relative pl-6 space-y-6 border-l-2 border-brand-border/60 ml-3.5 pt-1.5 pb-1">
                      {TRACKING_STEPS.map((step, idx) => {
                        const isCompleted = idx < currentStep;
                        const isCurrent = idx === currentStep;
                        const isPending = idx > currentStep;
                        
                        const StepIcon = step.icon;

                        // Blinking/Active status color configuration
                        let circleColorClass = "border-brand-border bg-[#161618] text-brand-muted";
                        let borderGlow = "";
                        let textHighlight = "text-brand-muted";
                        
                        if (isCompleted) {
                          circleColorClass = "border-brand-accent bg-[#0B0B0C] text-brand-accent";
                          borderGlow = "shadow-[0_0_10px_rgba(204,255,0,0.3)]";
                          textHighlight = "text-brand-text";
                        } else if (isCurrent) {
                          circleColorClass = "border-brand-orange bg-[#0B0B0C] text-brand-orange";
                          borderGlow = "shadow-[0_0_12px_rgba(255,69,0,0.5)]";
                          textHighlight = "text-white font-black";
                        }

                        return (
                          <div 
                            key={step.id} 
                            id={`timeline_${step.id}`}
                            className={`relative transition-all duration-300 ${isCurrent ? "scale-[1.01]" : ""}`}
                          >
                            {/* Blinking indicator circle node on timeline */}
                            <span className="absolute -left-[35px] top-1.5 flex h-4 w-4 items-center justify-center">
                              {isCurrent && (
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                              )}
                              {isCompleted && (
                                <span className="animate-pulse absolute inline-flex h-3 w-3 rounded-full bg-brand-accent opacity-45"></span>
                              )}
                              <span className={`relative rounded-full border-2 h-4.5 w-4.5 flex items-center justify-center transition-all duration-300 ${circleColorClass} ${borderGlow}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${
                                  isCompleted ? "bg-brand-accent" : isCurrent ? "bg-brand-orange animate-pulse" : "bg-[#2A2A2D]"
                                }`} />
                              </span>
                            </span>

                            {/* Text metadata content block */}
                            <div className="space-y-1 pl-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className={`font-mono text-xs tracking-wider uppercase font-bold ${textHighlight}`}>
                                  {step.label}
                                </h5>

                                {isCurrent && (
                                  <span className="bg-brand-orange/10 text-brand-orange border border-brand-orange/40 font-mono text-[8px] font-extrabold px-1.5 py-0.5 uppercase rounded-sm flex items-center gap-1.5 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />
                                    LIVE IN PROGRESS
                                  </span>
                                )}
                                {isCompleted && (
                                  <span className="bg-brand-accent/15 text-brand-accent border border-brand-accent/30 font-mono text-[8px] font-extrabold px-1.5 py-0.5 uppercase rounded-sm">
                                    LOCKED COMPLETE
                                  </span>
                                )}
                              </div>

                              <span className="text-[10px] font-mono text-brand-muted block font-semibold leading-none uppercase">
                                {step.subtitle}
                              </span>

                              {isCurrent && (
                                <motion.p 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  className="text-[11px] sm:text-xs text-brand-text/80 font-sans leading-relaxed pt-1 max-w-lg"
                                >
                                  {step.details}
                                </motion.p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Monospace live-scrolling terminal logs at bottom */}
                    <div className="space-y-1.5 pt-4 border-t border-brand-border/60">
                      <div className="flex justify-between items-center text-[9px] font-mono text-brand-muted tracking-widest uppercase">
                        <span className="flex items-center gap-1">
                          <Terminal className="w-3 h-3 text-brand-accent" />
                          RAW TELEMETRY TELETYPE OUTPUT
                        </span>
                        <span>GRID // S9_LOGGER</span>
                      </div>

                      <div 
                        ref={logContainerRef}
                        className="bg-[#080809] border border-brand-border/50 h-28 p-3 overflow-y-auto font-mono text-[10px] text-brand-accent/90 space-y-1 select-text scrollbar-thin scrollbar-thumb-brand-border"
                      >
                        {logs.map((log, index) => {
                          const isError = log.includes("Error") || log.includes("ALERT") || log.includes("WARNING");
                          return (
                            <div 
                              key={index} 
                              className={`leading-normal border-l-2 pl-2 text-left bg-brand-bg/25 break-all ${
                                isError ? "text-brand-orange border-brand-orange" : "border-brand-accent/20"
                              }`}
                            >
                              {log}
                            </div>
                          );
                        })}
                        {isPlaying && (
                          <div className="flex items-center gap-1 border-l-2 border-brand-accent/40 pl-2 text-brand-accent/60">
                            <span>_ SYSTEM WAITING FOR DISPATCH RETRIEVAL SIGNALS...</span>
                            <span className="w-1.5 h-3.5 bg-brand-accent/70 animate-pulse inline-block" />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
