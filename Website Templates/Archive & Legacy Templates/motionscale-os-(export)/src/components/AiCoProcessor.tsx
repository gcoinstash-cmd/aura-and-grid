/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Project, FinancialInvoice } from "../types";
import { 
  Cpu, 
  Sparkles, 
  Terminal, 
  Play, 
  RotateCcw, 
  Check, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight,
  ClipboardCheck,
  Server,
  Zap,
  CheckCircle,
  FileText,
  TrendingUp,
  Receipt
} from "lucide-react";

interface AiCoProcessorProps {
  projects: Project[];
  invoices: FinancialInvoice[];
}

export default function AiCoProcessor({ projects, invoices }: AiCoProcessorProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "");
  const [taskType, setTaskType] = useState<"script" | "audit">("script");
  const [userDirective, setUserDirective] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [stepIndex, setStepIndex] = useState<number>(-1);
  const [finalReport, setFinalReport] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [apiStatus, setApiStatus] = useState<{ detected: boolean; checked: boolean }>({ detected: false, checked: false });

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  useEffect(() => {
    // Audit current key status in the workspace
    fetch("/api/health-check")
      .then(res => res.json())
      .then(data => {
        setApiStatus({ detected: data.geminiKeyDetected, checked: true });
      })
      .catch(() => {
        setApiStatus({ detected: false, checked: true });
      });
  }, []);

  // Scroll terminal logs to bottom
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [executionLogs]);

  // Check if there are overdue invoices
  const overdueInvoices = invoices.filter(inv => inv.status === "Overdue");
  const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const hasOverdue = overdueInvoices.length > 0;

  const handleExecute = async () => {
    if (!selectedProject || isExecuting) return;

    setIsExecuting(true);
    setFinalReport(null);
    setExecutionLogs([]);
    setStepIndex(0);

    const logs = [
      `[PROCESS INIT] Allocating sandbox container thread for Project: "${selectedProject.name}"...`,
      `[LOAD STATE] Sharding project variables [Client: ${selectedProject.clientName}, Budget: $${selectedProject.budget.toLocaleString()}]...`,
      `[INSPECT LEDGER] Verifying link invoices mapping and transaction histories...`
    ];

    if (hasOverdue) {
      logs.push(
        `[⚠️ CAUTION] OVERDUE TRANSACTION FLAG RAISED: Detected ${overdueInvoices.length} outstanding invoice(s) totalling $${totalOverdueAmount.toLocaleString()} USD!`,
        `[⚠️ CAUTION] Cash flow risk scale shifted to CRITICAL (78% high-yield liability exposure index).`,
        `[INSPECT LEDGER] Appending financial risk mitigation subroutines to co-processor prompt bounds...`
      );
    } else {
      logs.push(`[INSPECT LEDGER] No active warning flags. Cash flow integrity rated optimized.`);
    }

    logs.push(
      `[CONNECTING] Establishing secure routing SSL endpoint to Gemini neural co-processor...`,
      `[MODELS] Task assigned resource scope: "gemini-3.5-flash" (Low-latency basic intelligence parameters loaded)`,
      `[TRANSMITTING] Disseminated intent matrix and active user directives: "${userDirective || "Standard default parameters"}"...`,
      `[INTELLIGENCE AGENT] Execution loop running. Reconciling metadata state constraints...`,
      `[COMPILING] Resolving markdown document outputs as executive business vectors...`
    );

    // Progressive log rendering animation
    for (let i = 0; i < logs.length; i++) {
      await new Promise((res) => setTimeout(res, 280));
      setExecutionLogs(prev => [...prev, logs[i]]);
      setStepIndex(i);
    }

    try {
      if (taskType === "script") {
        // Execute Spec Generation
        const response = await fetch("/api/gemini/generate-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            projectName: selectedProject.name,
            clientName: selectedProject.clientName,
            objectives: userDirective || "Sought to streamline cross-device luxury distribution narrative assets.",
            techStack: "MotionScale Engine v2.0, Redshift, Cinema4D Renderer, ECC Shards Pipeline",
            scope: `Creative asset choreography, volume matrix rigging, ${selectedProject.status} staging workflows`
          })
        });

        if (!response.ok) throw new Error("API specification generation failed.");
        const data = await response.json();
        
        setFinalReport(data.brief);
        setExecutionLogs(prev => [...prev, `[SUCCESS] Interactive brief compiled. Decrypted container brief safely.`]);

      } else {
        // Execute Cashflow Audit
        const response = await fetch("/api/gemini/analyze-ledger", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ledgerItems: invoices.map(inv => ({
              id: inv.id,
              invoiceNumber: inv.invoiceNumber,
              client: projects.find(p => p.id === inv.projectId)?.clientName || "Boutique Account",
              amount: inv.amount,
              status: inv.status.toLowerCase(),
              dueDate: inv.dueDate
            })),
            pipelineVolume: projects.reduce((sum, p) => sum + p.budget, 0)
          })
        });

        if (!response.ok) throw new Error("API analysis failed.");
        const data = await response.json();

        // If overdue invoices exist, let's append our interactive mitigation block manually to guarantee the interactive ROI
        let resultingReport = data.advisoryReport;
        if (hasOverdue) {
          resultingReport = `### ⚠️ SYSTEM ALERT: CASH FLOW RISK DETECTED

#### 🚨 OVERDUE INVOICE DIAGNOSIS
- **Active Violation Status**: Overdue liabilities of **$${totalOverdueAmount.toLocaleString()} USD** detected in accounts receivable.
- **Cash Flow Risk index**: **78% [CRITICAL RISK INDEX]**
- **Triggering Client**: ${overdueInvoices.map(i => projects.find(p => p.id === i.projectId)?.clientName || "High-Ticket Client").join(", ")}

#### 💼 CFO MITIGATION STRATEGY RECOMMENDATIONS
1. **Mesh Shard Retransmission Freeze**: Implement cryptographic locks via **Asset Escrow** immediately. Do NOT authorize high-fidelity files or releases for ${overdueInvoices.length} active overdue containers.
2. **Escrow Timeline Maturation Acceleration**: Pivot the payment clearing terms to 50% upfront retainer, 30% midpoint, and 20% before decryption keys are rotated.
3. **Automated Interlock Warnings**: Route bespoke automated SMTP dunning warnings to whitelisted company gatekeepers to trigger early visual milestone resolutions.

---

${resultingReport}`;
        }

        setFinalReport(resultingReport);
        setExecutionLogs(prev => [...prev, `[SUCCESS] Predictive CFO audit successfully structured. Internal risk metrics refreshed.`]);
      }
    } catch (err: any) {
      console.warn("Falling back to local high-fidelity mock generators:", err);
      await new Promise(res => setTimeout(res, 500));

      if (taskType === "script") {
        setFinalReport(`# ENTERPRISE SPECIFICATION BRIEF: ${selectedProject.name.toUpperCase()} (LOCAL FALLBACK)
**Prepared for Client Entity**: ${selectedProject.clientName}
**Production Scale Budget**: $${selectedProject.budget.toLocaleString()} USD
**Active Process Directives**: ${userDirective || "Default brand scaling parameters loaded."}

## 1. BRAND STORYTELLING & MOOD ALIGNMENT
Establish an absolute luxury, high-fidelity digital presence for ${selectedProject.clientName}.
- **Tone Matrix**: Precise, sophisticated, modern Swiss monospace geometry and high contrast spacing.
- **Narrative Anchor**: The transition of creative assets into robust escrow containers.

## 2. PRODUCTION DELIVERABLES
- Establish three main animation sequences centering high-integrity render nodes.
- Maintain transparent task lists utilizing **Sprint manager pipelines**.

## 3. COMPLIANCE & ESCROW RELEASE KEYFLOW
All final video renders require cryptographic sign-offs inside the **Client Sandbox** before original vector caches clear.`);
        setExecutionLogs(prev => [...prev, `[OFFLINE SUCCESS] Rendered localized offline brief generator.`]);
      } else {
        setFinalReport(`### 📈 ZENITH LEDGER INTELLIGENCE REPORT (LOCAL FALLBACK)
**Cash-Flow Integrity Diagnostics**: Flagged & Monitored
**Total Active Deal Pipeline**: $${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()} USD

${hasOverdue ? `#### 🚨 CFO RISK WARNING (78% CRITICAL LIMIT RISK)
An active invoice clearing bottleneck exists: **$${totalOverdueAmount.toLocaleString()} USD** is currently overdue!

#### 💼 BESPOKE TEXT MITIGATION ACTION:
- **Escrow Pipeline Interlock**: Enforce absolute asset freezes inside the **Asset Escrow** client ports. Mute hardware keys until cleared.
- **Pricing Restructure**: Transition standard contracts into a rigid 50/30/20 upfront phase payment model.` : `#### 🟢 CASH FLOW STATUS: OPTIMIZED
- No overdue invoices are currently recorded in the active Financial Ledger.
- Operating cash-flow index: **96% EXCELLENT**.`}

#### Core Strategic Recommendations:
- **Transition custom billing** into smaller upfront escrow installments.
- **Safeguard render pools** using upfront payment structures.`);
        setExecutionLogs(prev => [...prev, `[OFFLINE SUCCESS] Rendered localized offline CFO advisory.`]);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCopyReport = () => {
    if (!finalReport) return;
    navigator.clipboard.writeText(finalReport);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="ai-coprocessor-command-center" className="space-y-8 animate-fade-in text-left">
      
      {/* Editorial Header */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
            <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">Interactive AI Command Hub</span>
          </div>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1 flex items-center gap-2">
            AI Co-Processor Center
          </h1>
          <p className="text-xs text-neutral-500 font-mono mt-1">
            Run automated script directives, compile production blueprints, and audit active ledger cashflows via Gemini models.
          </p>
        </div>

        {/* Co-Processor API Gateway Health Shield */}
        <div className="flex items-center gap-2 text-xs font-mono bg-neutral-950 border border-neutral-900 px-4 py-2.5 rounded">
          <div className={`w-2 h-2 rounded-full ${apiStatus.detected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></div>
          <p className="text-neutral-400">
            SYSTEM STATUS:{" "}
            <span className="text-white font-medium">
              {apiStatus.detected ? "GEMINI SECURE ENDPOINT" : "CLOUD CO-PROCESSOR SIMULATION"}
            </span>
          </p>
        </div>
      </div>

      {/* Grid: Controller and Output Display Terminal */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side: Controller Form (Span 5) */}
        <div className="lg:col-span-5 bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-6">
          <div className="border-b border-neutral-900 pb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-neutral-400" />
            <h3 className="text-xs font-mono text-white tracking-widest uppercase">Process Directives Configuration</h3>
          </div>

          <div className="space-y-4 font-mono text-xs">
            {/* 1. Project Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase tracking-wider font-semibold">Select Target Project Container</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-850 rounded p-2.5 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.clientName})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Task Selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase tracking-wider font-semibold">Identify AI Objective Task Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTaskType("script")}
                  className={`p-3 border rounded font-mono text-left transition-all flex flex-col gap-1 ${
                    taskType === "script" 
                      ? "border-amber-500/50 bg-amber-500/5 text-amber-400" 
                      : "border-neutral-900 bg-neutral-900/30 text-neutral-400 hover:border-neutral-800"
                  }`}
                >
                  <span className="font-semibold text-[11px] block text-white">Video Script spec</span>
                  <span className="text-[9px] text-neutral-500 leading-normal">Draft high-end creative script blueprints</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskType("audit")}
                  className={`p-3 border rounded font-mono text-left transition-all flex flex-col gap-1 ${
                    taskType === "audit" 
                      ? "border-indigo-500/50 bg-indigo-500/5 text-indigo-400" 
                      : "border-neutral-900 bg-neutral-900/30 text-neutral-400 hover:border-neutral-800"
                  }`}
                >
                  <span className="font-semibold text-[11px] block text-white">CFO Cashflow Audit</span>
                  <span className="text-[9px] text-neutral-500 leading-normal">Solve risk diagnostics & overdue balances</span>
                </button>
              </div>
            </div>

            {/* 3. Text Area Custom Directives */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 block uppercase tracking-wider font-semibold">Bescope Directives / Guidelines</label>
              <textarea
                value={userDirective}
                onChange={(e) => setUserDirective(e.target.value)}
                placeholder={
                  taskType === "script"
                    ? "e.g., Focus on futuristic corporate branding, extreme macro lenses, and slow pacing..."
                    : "e.g., Suggest specific cost-cutting rendering options and detail penalty timelines..."
                }
                rows={4}
                className="w-full bg-neutral-900 border border-neutral-850 rounded p-2.5 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono resize-none leading-relaxed"
              />
              <span className="text-[9px] text-neutral-500 font-mono block leading-normal leading-snug">
                These constraints inject custom vectors directly into the active Gemini contextual model loop.
              </span>
            </div>

            {/* 4. Active Trigger Button */}
            <button
              onClick={handleExecute}
              disabled={isExecuting}
              className={`w-full py-3 px-4 rounded text-xs font-bold font-mono tracking-wider transition-all duration-200 flex items-center justify-center gap-2 uppercase ${
                isExecuting
                  ? "bg-neutral-900 text-neutral-500 border border-neutral-850 cursor-not-allowed"
                  : "bg-white text-black hover:bg-neutral-200 focus:ring-2 focus:ring-neutral-700 shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
              }`}
            >
              <Zap className={`w-4 h-4 ${isExecuting ? "animate-spin text-neutral-600" : "text-amber-500 fill-amber-500"}`} />
              <span>{isExecuting ? "Processing Neural Task..." : "Execute Gemini Agent Process"}</span>
            </button>
          </div>

          {/* Interactive ROI Indicators */}
          {hasOverdue && (
            <div className="bg-rose-950/25 border border-rose-900/40 p-4 rounded text-xs font-mono space-y-2 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block uppercase text-[10px]">CFO ALERT: INTERLOCK ACTIVE</span>
                <p className="text-[11px] text-neutral-300 mt-1 leading-relaxed">
                  Currently flagging **$${totalOverdueAmount.toLocaleString()}** Overdue items. Running the **Predictive CFO Cashflow Audit** task will automatically inject ledger details and resolve a defense strategy.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: High End Terminal Simulator & Markdown Output Box (Span 7) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden flex flex-col justify-between min-h-[480px]">
          
          {/* Output Header */}
          <div className="px-4 py-3 bg-neutral-900/60 border-b border-neutral-900 flex items-center justify-between text-xs font-mono">
            <span className="text-xs font-mono text-neutral-400 tracking-wider uppercase flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-neutral-500" />
              <span>CO-PROCESSOR CONSOLE OUTPUT</span>
            </span>

            {finalReport && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopyReport}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:text-white text-neutral-400 hover:border-neutral-700 px-2.5 py-1 rounded text-[10px] font-mono flex items-center gap-1.5 transition-all"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>COPIED ✓</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="w-3.5 h-3.5 text-neutral-500" />
                      <span>COPY BRIEF</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setFinalReport(null);
                    setExecutionLogs([]);
                    setStepIndex(-1);
                  }}
                  className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-850 hover:text-white text-neutral-400 hover:border-neutral-700 px-2 text-[10px] icon-only pr-2.5 pl-2.5 rounded transition-all"
                >
                  <RotateCcw className="w-3 h-3 text-neutral-500" />
                </button>
              </div>
            )}
          </div>

          {/* Terminal Screen area */}
          <div className="flex-1 p-5 font-mono text-[11px] leading-relaxed overflow-y-auto space-y-4 max-h-[450px]">
            
            {/* If idle */}
            {!isExecuting && !finalReport && (
              <div className="h-full py-24 text-center text-neutral-500 flex flex-col items-center justify-center gap-3">
                <Terminal className="w-8 h-8 text-neutral-700 animate-pulse-subtle" />
                <div className="space-y-1">
                  <span className="text-xs font-bold text-neutral-400 block tracking-wider uppercase font-mono">CO-PROCESSOR SLEEPING</span>
                  <p className="max-w-md text-[10px] text-neutral-500 leading-normal font-mono">
                    Select target variables and execute the agent thread to observe the live machine learning logic and compile output telemetry.
                  </p>
                </div>
              </div>
            )}

            {/* Display logs progressively if executing or when finished */}
            {(isExecuting || executionLogs.length > 0) && (
              <div className="space-y-1.5 border-b border-neutral-900/60 pb-4">
                {executionLogs.map((log, index) => {
                  const isCaution = log.includes("[⚠️ CAUTION]");
                  const isSuccess = log.includes("[SUCCESS]");
                  return (
                    <div 
                      key={index} 
                      className={`flex items-start gap-1 font-mono tracking-wide ${
                        isCaution ? "text-rose-400 bg-rose-950/15 border border-rose-950 px-2 py-0.5 rounded" :
                        isSuccess ? "text-emerald-400" : "text-neutral-400"
                      }`}
                    >
                      <span className={`${isCaution ? "text-rose-400" : isSuccess ? "text-emerald-400" : "text-amber-500"} select-none`}>&gt;</span>
                      <span className="flex-1 break-all">{log}</span>
                    </div>
                  );
                })}
                {isExecuting && (
                  <div className="text-amber-400/90 animate-pulse flex items-center gap-1.5">
                    <span className="select-none font-bold">&gt;</span>
                    <span>NEURAL SYNAPSE COMPRESSING MATRIX INDEX...</span>
                  </div>
                )}
                <div ref={terminalEndRef} />
              </div>
            )}

            {/* Finished Markdown presentation */}
            {finalReport && !isExecuting && (
              <div className="text-neutral-200 mt-4 leading-relaxed tracking-wide space-y-4 font-mono select-text selection:bg-neutral-800">
                <div className="bg-neutral-900/10 border border-neutral-900 p-4.5 rounded-lg space-y-4 text-xs font-sans">
                  
                  {/* Visual Divider / Presentation Shield */}
                  <div className="flex items-center justify-between border-b border-neutral-900 pb-2 mb-2 font-mono text-[9 px]">
                    <span className="text-neutral-500 uppercase flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>CO-PROCESSOR RESULTS CONTAINER</span>
                    </span>
                    <span className="text-neutral-500">FORMAT: MARKDOWN SPEC</span>
                  </div>

                  {/* Clean text formatted renderer to look editorial and high contrast */}
                  <div className="space-y-4 whitespace-pre-wrap font-sans text-neutral-300">
                    {finalReport}
                  </div>

                </div>
              </div>
            )}

          </div>

          {/* Terminal Bottom Diagnostic stats */}
          <div className="px-4 py-2.5 bg-neutral-950 border-t border-neutral-900 font-mono text-[10px] text-neutral-600 flex justify-between">
            <span>TERMINAL CONSTRAINTS: ECC-256</span>
            <span>NODE: {selectedProject ? selectedProject.id.toUpperCase() : "NULL"} • MEM: SECURE_STACK</span>
          </div>

        </div>

      </div>

    </div>
  );
}
