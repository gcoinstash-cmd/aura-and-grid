/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { GUMROAD_BLUEPRINT_SECTIONS } from "../data";
import { PricingVariable } from "../types";
import { 
  Sparkles, 
  Cpu, 
  FileText, 
  Zap,
  Calculator,
  Video,
  FileCode,
  Fingerprint
} from "lucide-react";

interface MarketingBlueprintProps {
  onAddInvoice?: (item: any) => void;
}

export default function MarketingBlueprint({ onAddInvoice }: MarketingBlueprintProps) {
  const [selectedSandboxSection, setSelectedSandboxSection] = useState<"roi" | "ai" | "api">("roi");
  
  // Interactive Project Brief Generator Inputs
  const [draftingBrief, setDraftingBrief] = useState(false);
  const [briefOutput, setBriefOutput] = useState<string | null>(null);
  const [briefInput, setBriefInput] = useState({
    projectName: "Luxury Real Estate 3D Reveal",
    clientName: "Sterling Luxury Estates",
    objectives: "Centralize project asset pipelines (3D Models, Rigs), tracking rendering timelines, and secure deliverables room.",
    techStack: "Blender Cycles Engine, Unreal Engine 5.4, esbuild Node APIs, Google GenAI client",
    scope: "Creative Asset Escrow Drawer, Project Pipeline Boards, Billing invoice modules, Secured Portal compliance"
  });

  // Dynamic ROI Calculator State
  const [pricingVars, setPricingVars] = useState<PricingVariable>({
    developerRate: 150,
    designTimeHours: 12,
    consultingPremium: 2500,
    gumroadPrice: 1000,
    customSetupFee: 5000
  });

  const [weeklyHoursSaved, setWeeklyHoursSaved] = useState(20);

  // ROI calculations
  const alternativeRenderingOverheadCostYear = (250 * 12) + (150 * 12) + (199 * 12); // Custom render SaaS platforms
  const implementationHoursSelfBuilt = 120; // 120 hours of custom coding from scratch
  const customBuildExpenseValue = implementationHoursSelfBuilt * pricingVars.developerRate;
  
  const totalAnnualValueSaved = (weeklyHoursSaved * 52 * pricingVars.developerRate) + alternativeRenderingOverheadCostYear;
  const standardRoiMultiplier = totalAnnualValueSaved / pricingVars.gumroadPrice;

  // Trigger server-side code API compiling beautiful Markdown project brief
  const compileProjectBrief = async () => {
    setDraftingBrief(true);
    try {
      const response = await fetch("/api/gemini/generate-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(briefInput)
      });

      if (!response.ok) throw new Error("API build failure.");
      const data = await response.json();
      setBriefOutput(data.brief);
    } catch (err) {
      console.error("Failed to compile project brief:", err);
      // Fallback response matching MotionScale design guidelines
      setBriefOutput(`# ENTERPRISE SPECIFICATION BRIEF: ${briefInput.projectName.toUpperCase()}
**Client Entity**: ${briefInput.clientName}
**Fulfillment Timeline**: 60 Days Production Span

## 1. STRATEGIC MISSION & OBJECTIVES
Empower animators and technical artists to coordinate high-ticket renders without administrative delays.
- **Minimize Asset Bleed**: Optimize custom pipelines to protect $${weeklyHoursSaved * pricingVars.developerRate}/wk in core velocity.
- **Real-Time Client Escrow**: Centralize revision checks.

## 2. SYSTEM STACK
- **Orchestra Integration**: Target ${briefInput.techStack} pipeline tools.
- **Functional Modules**: ${briefInput.scope} under Luxury Zen constraints.

## 3. PROFESSIONAL SERVICES QUOTE
Custom server orchestration & pipeline asset sync hooks: **$${pricingVars.customSetupFee.toLocaleString()} USD**.`);
    } finally {
      setDraftingBrief(false);
    }
  };

  return (
    <div id="marketing-blueprint-root" className="space-y-10 animate-fade-in text-left">
      
      {/* Editorial Title Block */}
      <div className="border-b border-neutral-850 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">Operational Blueprint</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">High-Ticket Studio Blueprint</h1>
        </div>
        <div className="flex bg-neutral-900 border border-neutral-800 p-1 rounded font-mono text-xs">
          {(["roi", "ai", "api"] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSandboxSection(sec)}
              className={`px-3 py-1 rounded text-[11px] font-medium transition-all duration-150 ${selectedSandboxSection === sec ? "bg-white text-black font-semibold" : "text-neutral-400 hover:text-white"}`}
            >
              {sec === "roi" ? "ROI VALUE CALCULATOR" : sec === "ai" ? "AUTOMATED AI BRIEF" : "API PLAYGROUND"}
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic view switcher */}
      {selectedSandboxSection === "roi" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* ROI Calculator Section & Pitching Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Value model (Span 7) */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-6">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Financial Proof</span>
                <h2 className="text-xl font-sans font-medium text-white tracking-tight mt-1">MotionScale ROI: Save $10,000+/yr & 20+ Hours Weekly</h2>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  Design studios bleed critical billable hours managing unvetted client feedback loops and messy asset deliveries. MotionScale OS binds asset escrowing and render tracking into one system—turning administrative leakage into pure margins.
                </p>
              </div>

              {/* Sliders widget */}
              <div className="space-y-5 bg-neutral-900/20 border border-neutral-900/60 p-5 rounded-lg font-mono text-xs">
                {/* Developer rate slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-300">ESTIMATED CREATIVE SENIOR HOURLY RATE:</span>
                    <span className="text-white font-bold">${pricingVars.developerRate}/hr</span>
                  </div>
                  <input 
                    type="range" 
                    min="50" 
                    max="350" 
                    step="10"
                    value={pricingVars.developerRate}
                    onChange={(e) => setPricingVars({ ...pricingVars, developerRate: Number(e.target.value) })}
                    className="w-full accent-white bg-neutral-800 rounded-lg appearance-none h-1 cursor-pointer"
                  />
                </div>

                {/* Hours saved slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-300">ADMINISTRATIVE HOURS SAVED WEEKLY:</span>
                    <span className="text-amber-400 font-bold">{weeklyHoursSaved} Hours / week</span>
                  </div>
                  <input 
                    type="range" 
                    min="5" 
                    max="45" 
                    step="1"
                    value={weeklyHoursSaved}
                    onChange={(e) => setWeeklyHoursSaved(Number(e.target.value))}
                    className="w-full accent-white bg-neutral-800 rounded-lg appearance-none h-1 cursor-pointer"
                  />
                </div>

                {/* Gumroad price slider */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-300">MOTIONSCALE OS BASE PURCHASE (GUMROAD):</span>
                    <span className="text-white font-bold">${pricingVars.gumroadPrice} USD</span>
                  </div>
                  <input 
                    type="range" 
                    min="499" 
                    max="1999" 
                    step="100"
                    value={pricingVars.gumroadPrice}
                    onChange={(e) => setPricingVars({ ...pricingVars, gumroadPrice: Number(e.target.value) })}
                    className="w-full accent-white bg-neutral-800 rounded-lg appearance-none h-1 cursor-pointer"
                  />
                </div>
              </div>

              {/* Connected relations explanation */}
              <div className="border-t border-neutral-900 pt-5 text-xs text-neutral-400 space-y-3 leading-relaxed">
                <h4 className="font-sans font-medium text-white">How MotionScale OS justifies the price out-of-the-box:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-mono">
                  <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded">
                    <span className="text-white block font-medium">I. Consolidate Assets & Renders</span>
                    <span>Replaces frame.io, Dropbox, and independent ledger software saving over $${alternativeRenderingOverheadCostYear.toLocaleString()}/yr.</span>
                  </div>
                  <div className="bg-neutral-900/40 border border-neutral-900 p-3 rounded">
                    <span className="text-white block font-medium">II. Eliminate Custom Integration Lag</span>
                    <span>Instead of hiring developer consulting for 120+ hours (Value: ${customBuildExpenseValue.toLocaleString()} USD), deploy our system instantly.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Live calculation outcomes (Span 5) */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-6">
              <div>
                <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Calculated value</span>
                <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">Live Economic Assessment</h3>
              </div>

              <div className="space-y-4 font-mono text-xs">
                {/* Year savings metric */}
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/60 rounded-lg text-left animate-pulse-subtle">
                  <span className="text-[10px] text-emerald-400 block uppercase tracking-widest">Compounded Annual Return (ROI Value)</span>
                  <span className="text-2xl text-emerald-300 font-bold block mt-1.5">${totalAnnualValueSaved.toLocaleString()} USD</span>
                  <p className="text-[10px] text-neutral-400 mt-2">
                    Value derived from saving **{weeklyHoursSaved * 52} technical hours** annually, plus legacy rendering software overhead.
                  </p>
                </div>

                {/* ROI multiplier */}
                <div className="p-4 bg-neutral-900/40 border border-neutral-800 rounded-lg text-left">
                  <span className="text-[10px] text-[#a3a3a3] block uppercase tracking-widest">Base License Value multiplier</span>
                  <span className="text-xl text-white font-bold block mt-1">{standardRoiMultiplier.toFixed(1)}x return</span>
                  <p className="text-[10px] text-neutral-500 mt-1.5">
                    For every $1 invested, MotionScale OS returns **${standardRoiMultiplier.toFixed(1)}** back in pure operational efficiency.
                  </p>
                </div>

                <div className="border-t border-neutral-900 pt-5 space-y-3.5">
                  <span className="text-[10px] text-neutral-500 uppercase block tracking-widest flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5 text-neutral-400" />
                    <span>The Custom Pitch Vector</span>
                  </span>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    "Secure absolute ownership of your asset libraries. Deploy MotionScale OS, protect your renders, and maintain immediate financial control limits."
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Deep Architectural Relations Grid */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-5 text-left">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Structural Integrity</span>
              <h2 className="text-lg font-sans font-medium text-white tracking-tight mt-1">{GUMROAD_BLUEPRINT_SECTIONS.header}</h2>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2.5">
                Each of the interconnected database modules is shipped fully configured. Direct relational tables tie invoices, projects, assets, and portal logins safely.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {GUMROAD_BLUEPRINT_SECTIONS.architecture.modules.map((mod, i) => (
                <div key={i} className="bg-neutral-900/30 border border-neutral-900 p-4 rounded-lg flex gap-3">
                  <span className="text-neutral-500 select-none text-sm font-semibold">{i + 1}.</span>
                  <div className="space-y-1">
                    <span className="text-white block font-medium font-mono">{mod.name}</span>
                    <p className="text-neutral-400 font-sans leading-relaxed text-[11px]">{mod.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {selectedSandboxSection === "ai" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* AI Brief Sandbox Header */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-3">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Orchestrator Sandbox</span>
            <h2 className="text-xl font-sans font-medium text-white tracking-tight">AI Brief Compiler & Pipeline Automation</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Our **$5,000+ specialized implementation services** link your MotionScale template to automated rendering APIs, cloud storage systems, and specialized generative AI brief tools. Test-drive the server-side compiler below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Input fields */}
            <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4 text-xs font-mono">
              <span className="text-[10px] text-neutral-500 block uppercase font-semibold">AI COMPILATION INPUTS</span>
              
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block uppercase">PROJECT TITLE</label>
                <input 
                  type="text"
                  value={briefInput.projectName}
                  onChange={(e) => setBriefInput({ ...briefInput, projectName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block uppercase">CLIENT ENTITY</label>
                <input 
                  type="text"
                  value={briefInput.clientName}
                  onChange={(e) => setBriefInput({ ...briefInput, clientName: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block uppercase">SYSTEM PIPELINE COMPONENTS</label>
                <input 
                  type="text"
                  value={briefInput.techStack}
                  onChange={(e) => setBriefInput({ ...briefInput, techStack: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-400 block uppercase">CAMPAIGN OBJECTIVES</label>
                <textarea 
                  rows={3}
                  value={briefInput.objectives}
                  onChange={(e) => setBriefInput({ ...briefInput, objectives: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={compileProjectBrief}
                  disabled={draftingBrief}
                  className="w-full bg-white hover:bg-neutral-200 text-black text-xs font-mono py-2.5 rounded font-bold transition-all duration-200 flex items-center justify-center gap-1.5"
                >
                  <Cpu className={`w-3.5 h-3.5 ${draftingBrief ? "animate-spin" : ""}`} />
                  <span>{draftingBrief ? "COMPILING SYSTEM SPEC..." : "COMPILE PROJECT BRiEF SPEC"}</span>
                </button>
              </div>
            </div>

            {/* AI compilation output box */}
            <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-neutral-400" />
                  <span className="text-xs font-mono text-white uppercase font-bold">Generated Markdown Document</span>
                </div>
                <span className="text-[10px] font-mono bg-neutral-900 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded uppercase">
                  Gemini Flash 3.5
                </span>
              </div>

              {briefOutput ? (
                <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono text-neutral-300 p-4 bg-neutral-900/30 border border-neutral-900 rounded-lg whitespace-pre-wrap max-h-[400px] overflow-y-auto animate-fade-in text-left">
                  {briefOutput}
                </div>
              ) : (
                <div className="py-24 text-center text-neutral-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <Video className="w-5 h-5 text-neutral-600 animate-pulse-subtle" />
                  <span>Trigger the Pipeline Compiler to render an optimized project specifications report.</span>
                </div>
              )}
            </div>

          </div>

          {/* Webhook Triggers Schema table */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-5 text-left">
            <div>
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block">Automation Map</span>
              <h3 className="text-lg font-sans font-medium text-white tracking-tight mt-1">Webhook & Delivery Integrations</h3>
              <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                Our custom integration services automate rendering server alerts, invoice dispatches, secure file escrow transfers, and custom cloud CDN logs cleanly.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs font-mono text-neutral-300">
                <thead className="bg-[#171717]/40 text-neutral-400 dark:text-neutral-500 border-b border-neutral-900 text-left">
                  <tr>
                    <th className="py-4 px-6 font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Automation Node</th>
                    <th className="py-4 px-6 font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Source Event Name</th>
                    <th className="py-4 px-6 font-mono text-xs tracking-wider text-neutral-400 dark:text-neutral-500 font-semibold uppercase">Automated End Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900/60">
                  {GUMROAD_BLUEPRINT_SECTIONS.automation.steps.map((step, i) => (
                    <tr 
                      key={i} 
                      className="border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 text-left"
                    >
                      <td className="py-4 px-6 font-semibold text-white">{step.mechanism}</td>
                      <td className="py-4 px-6 text-neutral-500">{step.trigger}</td>
                      <td className="py-4 px-6 text-neutral-400 font-sans leading-relaxed">{step.effect}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {selectedSandboxSection === "api" && (
        <div className="space-y-8 animate-fade-in">
          
          {/* API Docs info */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block font-semibold">API specification</span>
            <h2 className="text-xl font-sans font-medium text-white tracking-tight">Standard API Gateways Mock-up</h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We ship documented webhook endpoints. High-end clients can integrate external render servers, Jenkins pipelines, or custom frame processors safely via our secure proxy layer.
            </p>
          </div>

          {/* Code API routes */}
          <div className="space-y-6 text-left">
            
            {/* Route 1 */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2.5 py-0.5 rounded font-mono font-bold">POST</span>
                  <span className="text-white font-mono font-semibold">/api/gemini/score-lead</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">SECURE RISKS ENGINE</span>
              </div>
              <p className="font-sans text-neutral-400 leading-relaxed text-[11px]">
                Appraises a new client platform and MFA layer, updating logs and calculating security risks using artificial neural estimators.
              </p>
              
              <div className="bg-neutral-900/40 border border-neutral-900 p-4 rounded text-left">
                <span className="text-[10px] text-neutral-500 font-mono block mb-2 font-bold uppercase">Sample Parameters</span>
                <pre className="text-neutral-305 font-mono text-[10px] overflow-x-auto">
{`{
  "name": "Secured Vault Room",
  "company": "Sterling Luxury Estates",
  "budget": 85000,
  "timeline": "Immediate launch security",
  "industry": "Real Estate Studio",
  "needs": "Vulnerability assessment for custom 3D files and render escrows"
}`}
                </pre>
              </div>
            </div>

            {/* Route 2 */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-3 text-xs">
              <div className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2.5 py-0.5 rounded font-mono font-bold text-xs">POST</span>
                  <span className="text-white font-mono font-semibold">/api/gemini/generate-brief</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">SPECIFICATION GENERATOR</span>
              </div>
              <p className="font-sans text-neutral-400 leading-relaxed text-[11px]">
                Compiles fully formatted project brief summaries for target rendering layouts using server-proxied GenAI calls.
              </p>
              
              <div className="bg-neutral-900/40 border border-neutral-900 p-4 rounded text-left font-mono">
                <span className="text-[10px] text-neutral-500 block mb-2 font-bold uppercase">Success JSON response structure</span>
                <pre className="text-neutral-300 text-[10px] overflow-x-auto">
{`{
  "brief": "# ENTERPRISE SPECIFICATION BRIEF\\n**Prepared for**: Sterling estates...",
  "simulated": false
}`}
                </pre>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
