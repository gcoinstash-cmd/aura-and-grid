/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { Project, CreativeAsset, ClientPortal, FinancialInvoice, SystemHealth } from "../types";
import { 
  TrendingUp, 
  Cpu, 
  ShieldCheck, 
  Activity, 
  Layers, 
  Sliders, 
  CheckCircle, 
  Database,
  ArrowUpRight,
  Sparkles,
  Video
} from "lucide-react";

interface ExecutiveDashboardProps {
  projects: Project[];
  assets: CreativeAsset[];
  portals: ClientPortal[];
  invoices: FinancialInvoice[];
  onNavigateToTab: (tabId: string) => void;
}

export default function ExecutiveDashboard({
  projects,
  assets,
  portals,
  invoices,
  onNavigateToTab
}: ExecutiveDashboardProps) {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const [analyticsHoverIndex, setAnalyticsHoverIndex] = useState<number | null>(null);

  // Fetch real-time backend health
  useEffect(() => {
    fetch("/api/health-check")
      .then((res) => res.json())
      .then((data) => {
        setHealth(data);
        setLoadingHealth(false);
      })
      .catch((err) => {
        console.error("Failed to load health check status:", err);
        setLoadingHealth(false);
      });
  }, []);

  // Gorgeous interactive custom data values representing MotionScale studio parameters
  const studioOutputData = [
    { month: "Jan", standard: 15000, specialized: 15000, details: "Focus: MVP Core Render Pipeline" },
    { month: "Feb", standard: 19500, specialized: 24000, details: "Focus: Launch of Asset Escrow Cabinet" },
    { month: "Mar", standard: 28000, specialized: 38000, details: "Focus: Secured $120k Sterling walkthrough contract" },
    { month: "Apr", standard: 34000, specialized: 56000, details: "Focus: MotionScale Studio v1.2 Release" },
    { month: "May", standard: 45000, specialized: 82000, details: "Focus: Full-scale pipeline diagnostics active" },
    { month: "Jun (Est)", standard: 52000, specialized: 115000, details: "Focus: Integration of Gemini Script builder assets" },
  ];

  // Dynamic high-ticket metrics calculations
  const totalPipelineBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeRenderCount = projects.filter(p => p.status === "Rendering").length;
  const totalClearedRevenue = invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalSecuredAssetsCount = assets.length;

  // Recent studio event streams
  const recentEvents = [
    { id: 1, type: "render", msg: "Glass Timer 3D Mesh asset compiled", time: "5 mins ago", desc: "Linked to project: Aetherius Brand Campaign [Approved]" },
    { id: 2, type: "invoice", msg: "Automated milestone invoice dispatched", time: "1 hour ago", desc: "Sent with total value $42,500 to Sterling Client Portal" },
    { id: 3, type: "security", msg: "MFA security status audited for Elysium Group", time: "4 hours ago", desc: "Warning flagged: Multi-factor verification is inactive" },
    { id: 4, type: "generation", msg: "Gemini script proposal drafted successfully", time: "Daily Sync Complete", desc: "Synthesizing walkthrough layout parameters using server-side AI" },
  ];

  return (
    <div id="dashboard-tab-root" className="space-y-8 animate-fade-in">
      {/* Editorial Title Block */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">MotionScale Cockpit</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Studio Operating System</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded text-xs font-mono text-neutral-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>STUDIO MONITOR ACTIVE</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-neutral-405 max-w-2xl leading-relaxed">
        Welcome to your unified creative headquarters. This operating system tracks and harmonizes the five core pillars of your premium studio: render pipelines, verified creative asset locks, billing invoice engines, isolated customer vaults, and automated strategic narrative proposals.
      </p>

      {/* Top row metrics cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 hover:border-neutral-800 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-white group-hover:bg-neutral-300 transition-colors duration-300"></div>
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">Pipeline Volume</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-2xl font-mono text-white">${totalPipelineBudget.toLocaleString()}</h2>
            <span className="text-[10px] font-mono bg-neutral-900 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span>4 Projects</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">From connected relational contracts</p>
        </div>

        {/* Metric 2 */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 hover:border-neutral-800 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-red-950 group-hover:bg-red-900 transition-colors duration-300"></div>
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">Active Rendering</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-2xl font-mono text-white">{activeRenderCount} Pipeline Renders</h2>
            <span className="text-[10px] font-mono bg-neutral-900 text-red-400 border border-neutral-800 px-2 py-0.5 rounded flex items-center gap-1">
              <Video className="w-3 h-3" />
              <span>GPU Active</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Est GPU buffer remaining: 14h</p>
        </div>

        {/* Metric 3 */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 hover:border-neutral-800 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-950 group-hover:bg-emerald-900 transition-colors duration-300"></div>
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">Cleared Earnings</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-2xl font-mono text-white">${totalClearedRevenue.toLocaleString()}</h2>
            <span className="text-[10px] font-mono bg-neutral-900 text-emerald-400 border border-neutral-800 px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              <span>Paid Invoices</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Verified liquid reserves</p>
        </div>

        {/* Metric 4 */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 hover:border-neutral-800 transition-colors duration-300 relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-950 group-hover:bg-blue-900 transition-colors duration-300"></div>
          <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block mb-1">Escrow Assets Locks</span>
          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-2xl font-mono text-white">{totalSecuredAssetsCount} Shard Files</h2>
            <span className="text-[10px] font-mono bg-neutral-900 text-blue-400 border border-neutral-800 px-2 py-0.5 rounded flex items-center gap-1">
              <Layers className="w-3 h-3" />
              <span>Ver. Control</span>
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-2">Drafts protected with hashing</p>
        </div>
      </div>

      {/* Main Row: Custom SVG Graph and Backend Diagnostic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Luxury Predictive MRR Chart (Interactive SVG) */}
        <div className="lg:col-span-2 bg-neutral-950 border border-neutral-900 rounded-lg p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block">Production Curve Tracker</span>
              <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">Creative Output Projections: Custom Pipelines vs Standard</h3>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-neutral-600 rounded"></span>
                <span className="text-neutral-400">Regular Lic.</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-1 bg-white rounded"></span>
                <span className="text-white">MotionScale Custom</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-neutral-500 mb-6">
            Hover point metrics across the spline curves below to trace dynamic studio evaluations representing regular self-served licenses versus bespoke enterprise implementations.
          </p>

          {/* Interactive SVG Chart Layer */}
          <div className="relative w-full h-64 bg-neutral-950/60 rounded border border-neutral-900 flex items-center justify-center p-2 group">
            <svg viewBox="0 0 600 240" className="w-full h-full text-neutral-600">
              {/* Grid Lines */}
              <line x1="50" y1="20" x2="550" y2="20" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3"/>
              <line x1="50" y1="70" x2="550" y2="70" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="120" x2="550" y2="120" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="170" x2="550" y2="170" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="50" y1="210" x2="550" y2="210" stroke="#262626" strokeWidth="1" />

              {/* Baseline Path (Grey) */}
              <path 
                d="M 50 170 C 130 160, 180 140, 250 130 C 320 120, 380 95, 450 80 C 500 70, 520 70, 550 65" 
                fill="none" 
                stroke="#404040" 
                strokeWidth="2.5" 
                strokeLinecap="round"
              />

              {/* Specialized Path (White with glow) */}
              <path 
                d="M 50 170 C 130 150, 180 125, 250 105 C 320 85, 380 55, 450 45 C 500 35, 520 25, 550 20" 
                fill="none" 
                stroke="#ffffff" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              />

              {/* Interactive nodes */}
              {studioOutputData.map((d, index) => {
                const xVal = 50 + index * 100;
                const baseMapY = [170, 155, 130, 110, 80, 65];
                const projMapY = [170, 145, 105, 70, 45, 20];
                const hoverActive = analyticsHoverIndex === index;

                return (
                  <g key={d.month} className="cursor-pointer">
                    {/* Tick line */}
                    <line x1={xVal} y1="210" x2={xVal} y2="218" stroke="#404040" strokeWidth="1" />
                    
                    {/* Hover hotspot line */}
                    <line 
                      x1={xVal} y1="20" x2={xVal} y2="210" 
                      stroke={hoverActive ? "rgba(255,255,255,0.15)" : "transparent"} 
                      strokeWidth={hoverActive ? "2" : "10"}
                      onMouseEnter={() => setAnalyticsHoverIndex(index)}
                      onMouseLeave={() => setAnalyticsHoverIndex(null)}
                    />

                    {/* Nodes for Projected Curve */}
                    <circle 
                      cx={xVal} cy={projMapY[index]} r={hoverActive ? 6 : 4} 
                      fill="#ffffff" 
                      stroke="#0a0a0a" 
                      strokeWidth="2"
                    />

                    {/* Nodes for Standard Curve */}
                    <circle 
                      cx={xVal} cy={baseMapY[index]} r={hoverActive ? 5 : 3.5} 
                      fill="#525252" 
                      stroke="#0a0a0a" 
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })}

              {/* X Axis Indicators */}
              <text x="50" y="232" fill="#737373" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">JAN</text>
              <text x="150" y="232" fill="#737373" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">FEB</text>
              <text x="250" y="232" fill="#737373" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">MAR</text>
              <text x="350" y="232" fill="#737373" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">APR</text>
              <text x="450" y="232" fill="#737373" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">MAY</text>
              <text x="550" y="232" fill="#ffffff" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">JUN (EST)</text>
            </svg>

            {/* Hover Tooltip Overlay */}
            {analyticsHoverIndex !== null && (
              <div 
                className="absolute z-10 bg-neutral-900 border border-neutral-800 rounded p-3 text-xs shadow-xl animate-fade-in pointer-events-none"
                style={{ 
                  left: `${Math.min(72, Math.max(8, (analyticsHoverIndex * 16.6) + 12))}%`, 
                  top: "20%" 
                }}
              >
                <div className="font-mono font-medium text-white block">
                  {studioOutputData[analyticsHoverIndex].month} Output Metrics
                </div>
                <div className="mt-1.5 space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between gap-8 text-neutral-400">
                    <span>Base Output:</span> 
                    <span className="text-neutral-300 font-medium">${studioOutputData[analyticsHoverIndex].standard.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between gap-8 text-white font-bold">
                    <span>MotionScale OS:</span> 
                    <span className="text-white">${studioOutputData[analyticsHoverIndex].specialized.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-amber-400 pt-1 border-t border-neutral-800 mt-1">
                    {studioOutputData[analyticsHoverIndex].details}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-[11px] font-mono text-neutral-500 pt-4 border-t border-neutral-900 mt-2">
            <span>Graph engine: Vector-scalable responsive Canvas</span>
            <span className="text-[#a3a3a3]">Rendering metrics aligned</span>
          </div>
        </div>

        {/* Neural AI Core Services Status */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#a3a3a3] uppercase block">Microservices Integration</span>
            <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">AI Co-Processor Health</h3>
            
            <div className="mt-5 space-y-4">
              {/* Gemini health */}
              <div className="bg-neutral-900/40 border border-neutral-900 p-3.5 rounded flex items-start gap-3 animate-pulse-subtle">
                <Cpu className={`w-4 h-4 mt-0.5 ${loadingHealth ? "text-neutral-500 animate-spin" : health?.geminiKeyDetected ? "text-emerald-400" : "text-amber-500"}`} />
                <div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-xs font-mono font-medium text-white">Gemini 3.5 Flash Model</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${health?.geminiKeyDetected ? "bg-emerald-950 text-emerald-300 border border-emerald-900" : "bg-amber-950 text-amber-300 border border-amber-900"}`}>
                      {loadingHealth ? "RESOLVING" : health?.geminiKeyDetected ? "ACTIVE API" : "SIMULATION"}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    {health?.geminiKeyDetected 
                      ? "Server-side pipeline established. Generates production-ready script specs & briefs on-demand."
                      : "Using elite offline-first simulation engine. High-fidelity storyboards drafted instantly."}
                  </p>
                </div>
              </div>

              {/* Cloud backup */}
              <div className="bg-neutral-900/40 border border-neutral-900 p-3.5 rounded flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 justify-between">
                    <span className="text-xs font-mono font-medium text-white">Asset Security Shard</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-900/30 text-emerald-400 border border-emerald-900/50">
                      ENCRYPTED FEED
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                    Local state persistency verified. Hash verification for 3D FBX, Voice MP3 and Rig configurations active.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 mt-4">
            <button 
              onClick={() => onNavigateToTab("clients")}
              className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-xs font-mono text-white py-2 rounded transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Database className="w-3.5 h-3.5 text-neutral-400" />
              <span>SECURITY STATUS AUDIT</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Third row: Event Webhooks stream & Business Pipeline Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Real-time automated activities streaming */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#a3a3a3] uppercase block">Interactive Terminal</span>
              <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">Automated Studio Operations (Real-time Audit log)</h3>
            </div>
            <Activity className="w-4 h-4 text-neutral-500" />
          </div>

          <div className="space-y-3.2 font-mono">
            {recentEvents.map((ev) => (
              <div key={ev.id} className="text-xs flex items-start justify-between p-3 bg-neutral-900/20 border border-neutral-900/60 hover:bg-neutral-900/40 rounded transition-colors duration-200">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {ev.type === "render" && <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 block animate-pulse"></span>}
                    {ev.type === "invoice" && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block"></span>}
                    {ev.type === "security" && <span className="w-2.5 h-2.5 rounded-full bg-red-400 block animate-pulse"></span>}
                    {ev.type === "generation" && <span className="w-2.5 h-2.5 rounded-full bg-purple-400 block"></span>}
                  </div>
                  <div>
                    <span className="text-white block font-medium">{ev.msg}</span>
                    <span className="text-[11px] text-neutral-400 mt-0.5 block">{ev.desc}</span>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500">{ev.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Blueprint Quick Launch Panel */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase block">High-Value Pitching</span>
            <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">High-Ticket Pitch ROI Sandbox</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mt-3">
              This system is built of elite relational templates tailored for production workflow constraints. By demonstrating state-of-the-art automation and asset escrow tools to prospects, you raise visual design deals to $5,000+ packages.
            </p>
            <div className="bg-neutral-900/30 border border-neutral-900 rounded p-3 mt-4 text-xs font-mono text-neutral-400 space-y-2">
              <div className="flex justify-between">
                <span>Self-serve template:</span>
                <span className="text-white">$1,000 / License</span>
              </div>
              <div className="flex justify-between">
                <span>VIP Custom Studio Setup:</span>
                <span className="text-amber-400">$5,000+ Engagement</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button 
              onClick={() => onNavigateToTab("sandbox")}
              className="w-full bg-white text-black hover:bg-neutral-200 text-xs font-mono py-2.5 rounded font-medium transition-all duration-200 flex items-center justify-center gap-1.5"
            >
              <span>INSPECT PITCH SANDBOX</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
