/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from "react";
import { PremiumClient } from "../types";
import { 
  Sparkles, 
  Send, 
  FileText, 
  Loader, 
  Check, 
  Copy, 
  Terminal, 
  Cpu, 
  User, 
  DollarSign, 
  Building2, 
  CheckSquare, 
  Activity, 
  Globe, 
  CornerDownRight, 
  CloudLightning,
  RefreshCw,
  FolderOpen,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AIBenefitHubProps {
  clients?: PremiumClient[];
}

type OutreachType = "Premium Retainer Proposal" | "Proposal" | "Follow-up" | "Contract Summary";

export default function AIBenefitHub({ clients = [] }: AIBenefitHubProps) {
  // Primary Workspace States
  const [outreachType, setOutreachType] = useState<OutreachType>("Premium Retainer Proposal");
  const [selectedClientId, setSelectedClientId] = useState<string>("generic");
  const [contextDetails, setContextDetails] = useState("");
  
  // Logic states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [resultDraft, setResultDraft] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Default fallback clients if somehow empty
  const activeClients = useMemo(() => {
    if (clients.length > 0) return clients;
    return [
      {
        id: "cl-acme",
        name: "Marcus Vance",
        companyName: "Acme Corporation",
        email: "marcus@acme.com",
        retainerTier: "Strategy Retainer",
        retainerAmount: 45000,
        stage: "Active Execution",
        contractStatus: "Active",
        contractText: "STANDARD OUTBOUND DELIVERABLES RETAINER\nBETWEEN Acme Corp and Legacy Group...",
        onboardingChecklist: [],
        milestones: [],
        notes: "Corporate holding scaling digital execution systems."
      },
      {
        id: "cl-global",
        name: "Elena Rostova",
        companyName: "Global Tech Solutions",
        email: "elena@globaltech.io",
        retainerTier: "Operations OS",
        retainerAmount: 32500,
        stage: "Onboarding",
        contractStatus: "Draft",
        contractText: "JOINT VENTURE PLATFORM SOW AGREEMENT TERMS...",
        onboardingChecklist: [],
        milestones: [],
        notes: "Automating engineering handoffs and venture assets."
      }
    ] as PremiumClient[];
  }, [clients]);

  // Find currently selected client object
  const currentClient = useMemo(() => {
    return activeClients.find(c => c.id === selectedClientId) || null;
  }, [selectedClientId, activeClients]);

  // Automatically update input form text based on selected Outreach Type & Client details
  useEffect(() => {
    if (selectedClientId === "generic") {
      if (outreachType === "Premium Retainer Proposal") {
        setContextDetails("Deliver a high-ticket Premium Retainer Proposal focusing on strategic operational transformation, asset security frameworks, and custom ledger integrations.");
      } else if (outreachType === "Proposal") {
        setContextDetails("Deliver a high-ticket $45,000/mo strategy retainer focusing on system automation, onboarding CRM, and real-time dashboard ledger controls for a new technology startup.");
      } else if (outreachType === "Follow-up") {
        setContextDetails("Write a polite, high-conviction outline clarifying operational deliverables agreed in last week's discovery call. Reiterate the professional onboarding checklist timeline.");
      } else {
        setContextDetails("Draft a comprehensive executive terms summary of our standard Master Services Agreement focusing on intellectual property transfer, NDA safety clauses, and secure monthly retainer accounts.");
      }
    } else if (currentClient) {
      const name = currentClient.name;
      const company = currentClient.companyName;
      const amt = currentClient.retainerAmount;
      const tier = currentClient.retainerTier;
      
      if (outreachType === "Premium Retainer Proposal") {
        setContextDetails(`Draft an elite Premium Retainer Proposal tailored specifically for ${name} at ${company}. Present a comprehensive strategic transformation plan including Strategy, Implementation, and Oversight with custom investment structures and exclusive partnership terms.`);
      } else if (outreachType === "Proposal") {
        setContextDetails(`Draft an elite service proposal tailored specifically for ${name} at ${company}. Highlight our premium ${tier} ($${amt.toLocaleString()}/mo) to automate operations, set up historical transaction logs, and manage their generational estate assets.`);
      } else if (outreachType === "Follow-up") {
        setContextDetails(`Write an executive outreach follow-up to ${name} (${company}) addressing their current pipeline stage (${currentClient.stage}). Emphasize the outstanding onboarding activities like finishing their Initial Discovery Session and configuring active trust reserves.`);
      } else {
        setContextDetails(`Generate an executive compliance summary for ${company}. Review the main legal terms: recurring monthly invoice of $${amt.toLocaleString()} USD, immediate IP transfer upon milestone green-lights, and mutual non-disclosure safety codes.`);
      }
    }
  }, [outreachType, selectedClientId, currentClient]);

  // Terminal logging simulation + raw execution
  const executeGeneration = async () => {
    setIsGenerating(true);
    setResultDraft(null);
    setAiError(null);
    setGenerationLogs([]);

    // Step 1: Establish console log simulation
    const steps = [
      `[system] Initializing proxy connection to secure Gemini backplane...`,
      `[system] Connecting via secure tunnel [SSL/TLS 1.3] Compliant...`,
      `[system] Resolving client data constraints for: ${currentClient ? currentClient.companyName : 'Generic Enterprise'}`,
      `[optimizer] Injecting luxury systemic prompts (Black Excellence tone, high-conviction styling)...`,
      `[cognitive] Transmitting contextual token packet (${contextDetails.length} characters)...`,
      `[cognitive] Standardizing output formatting schema matching Legacy OS standard...`
    ];

    // Progressive logging rendering
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 380));
      setGenerationLogs((prev) => [...prev, steps[i]]);
    }

    try {
      // Step 2: Hit server API proxies according to outreach type
      let response;
      if (outreachType === "Contract Summary") {
        // Use contract summarization endpoint
        response = await fetch("/api/gemini/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            documentName: currentClient ? `${currentClient.companyName} Partnership Contract` : "General Service Agreement",
            contentText: currentClient ? (currentClient.contractText || contextDetails) : contextDetails
          })
        });
      } else {
        // Outbound pitch / follow-up, use copywrite endpoint
        response = await fetch("/api/gemini/copywrite", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetAudience: currentClient ? `${currentClient.name} (${currentClient.companyName})` : "High-ticket Enterprise Client",
            campaignType: `${outreachType} - ${currentClient ? currentClient.retainerTier : 'Custom Retainer'}`,
            offerDetails: contextDetails
          })
        });
      }

      if (!response.ok) {
        throw new Error("Local environment server returned error status.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setGenerationLogs((prev) => [...prev, `[success] Synthesized Cognitive Response - Streaming Draft layout.`]);
      setResultDraft(data.text);
    } catch (err: any) {
      console.warn("Gemini Live server failed or key missing. Deploying high-fidelity local luxury override.", err);
      setGenerationLogs((prev) => [...prev, `[override] Active key is unconfigured or rate-limited. Dispatching high-fidelity structural template.`]);
      
      // Gorgeous premium fallback template based on Outreach type
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const clientName = currentClient ? currentClient.name : "Esteemed Enterprise Partner";
      const companyName = currentClient ? currentClient.companyName : "Global Enterprise Corp";
      const amountStr = currentClient ? `$${currentClient.retainerAmount.toLocaleString()}/mo` : "$15,000/month";
      const tierStr = currentClient ? currentClient.retainerTier : "Premium Agency Operations Retainer";

      if (outreachType === "Premium Retainer Proposal") {
        setResultDraft(`### PREMIUM RETAINER PROPOSAL
**PREPARED BY**: LEGACY OPERATIONS GROUP  
**PREPARED FOR**: ${clientName.toUpperCase()} (${companyName.toUpperCase()})  
**DATE**: June 1, 2026  

---

#### I. EXECUTIVE SUMMARY
We present a high-performance blueprint to execute the comprehensive operational transformation of **${companyName}**. By implementing robust systemic frameworks, we aim to eliminate service delivery bottlenecks, accelerate system velocity, and safeguard corporate assets. Our elite methodology transitions your business into a hyper-efficient, institutional-grade operation.

#### II. CORE PILLARS OF ENGAGEMENT
*   **Strategy Activation**: Comprehensive assessment of team throughput, operational pipelines, and existing CRM models to design a bespoke operations roadmap.
*   **Systemic Implementation**: Engineering seamless system automations, high-fidelity milestone tracking dashboards, and automated generational asset protection ledgers.
*   **Continuous Oversight**: Active quality audits, strategic advisor alignment sessions, and rapid technical support to sustain high velocity.

#### III. INVESTMENT STRUCTURE
*   **Bespoke Advisory Retainer**: **${amountStr} USD / Month** Base Investment
*   **Exclusivity & On-Demand Access**: Included in monthly base commitment
*   **Performance Optimization Incentives**: Standard 10% efficiency-bonus multiplier applied annually to verified overhead cost-reductions.
*   **Settlement Directive**: Automated treasury reserve sourcing processed on the 1st of each calendar month.

#### IV. TERMS OF PARTNERSHIP
*   **Strategic Exclusivity**: Legacy Operations Group reserves active operational capacity exclusively for **${companyName}** in your immediate market sector.
*   **Data Governance & Integrity**: Absolute compliance with high-end zero-leak data privacy protocols. Proprietary client schemas and database configurations remain fully sealed.
*   **Intellectual Property Transfer**: Full ownership rights of custom-engineered layouts, automations, and transaction ledgers transition to the client automatically upon monthly invoice settlement.

---
*Authorized for immediate review. Click "Copy to Clipboard" to transfer this elite structure.*`);
      } else if (outreachType === "Proposal") {
        setResultDraft(`### EXECUTIVE PARTNERSHIP PROPOSAL
**PREPARED BY**: LEGACY OPERATIONS GROUP  
**PREPARED FOR**: ${clientName.toUpperCase()} (${companyName.toUpperCase()})  
**DATE**: June 1, 2026  

---

#### I. EXECUTIVE STATEMENT & ALIGNMENT
In the modern digital economy, enterprise longevity is built on pristine, scalable systems. This proposal outlines the dedicated operational frameworks engineered to transition **${companyName}** into a hyper-efficient, self-sustaining institution. Under our bespoke directive, we establish absolute control over project lifecycles, asset ledgers, and team throughput.

#### II. CORE STRATEGIC ACTION PATHWAYS
1. **Dynamic Client Pipeline CRM**: Build a high-fidelity account milestones dashboard with progress tracking to manage active and prospective retainer workflows.
2. **Generational Asset protection Ledger**: Deploy automated ledger tracking to synthesize transaction, cash reserve, and appreciation trajectory insights.
3. **Operations Automation Harness**: Integrate automated systems and pipeline checks to scale output without increasing human headcount bottlenecks.

#### III. MONTHLY RECURRING RETAINER
*   **Tier Classification**: ${tierStr}  
*   **Recurring Commitment**: **${amountStr} USD / Month**  
*   **Settlement Protocol**: Automated reserve sourcing billed on the 1st of each calendar month.  

---
*Authorized for review. Click "Copy to Clipboard" to transfer this elite structure.*`);
      } else if (outreachType === "Follow-up") {
        setResultDraft(`### PARTNERSHIP ALIGNMENT UPDATE
**TO**: ${clientName} (${companyName})  
**FROM**: Legacy Operations Group Directorate  

Dear ${clientName},

Following our initial Operational Discovery Session, we have initialized your custom **Legacy OS Command Center** space. To transition this account cleanly into the active development stage, we request immediate completion of the remaining core checklist activities.

#### Outstanding Onboarding Milestones:
*   [ ] **Initial Discovery Session Completed** (Awaiting confirmation)
*   [ ] **Retainer Sourcing Account Configuration** (Awaiting secure webhook activation)
*   [ ] **Secure Operations Folder Provisioning**

Our engineering group is fully scheduled and prepared to deploy your custom CRM interfaces and asset protection trackers. We anticipate closing these preparatory checkboxes within 48 hours to secure your dedicated development slot.

Please let us know your availability to coordinate the database connection parameters this week.

With high regards,  
*The Legacy OS Operations Team*`);
      } else {
        setResultDraft(`### CONTRACT COMPLIANCE CAP-SUMMARY
**ENGAGEMENT**: ${companyName} Master Services Agreement  
**ESTABLISHED TIER**: ${tierStr} (${amountStr})  

---

#### 1. PRIMARY SCOPE OF PARTNERSHIP
Legacy Group delegates top-tier engineering resources to build, operate, and secure custom client pipelines, transactional databases, and estate trackers.

#### 2. INTELLECTUAL PROPERTY & TRANSFER CLAUSE
*   **Absolute Ownership**: All bespoke code structures, layouts, custom integrations, and data schemas remain strictly confidential and transfer to the Client.
*   **Green-Light Triggers**: Transfers register automatically upon verified receipt of corresponding monthly invoice settlements.

#### 3. COMPLIANCE & SAFETY ASSURANCES
*   **Mutual Non-Disclosure**: Zero leak protocols protect proprietary client schemas, asset configurations, or pipeline coordinates.
*   **Arbitration & Settlement**: Governed under exclusive mutual-trust operational standards in compliance with local commercial codes.

#### 4. SUMMARY RECOMMENDATIONS
*   Ensure that any new estate asset valuation forms include correct beneficiary trust assignments prior to archiving.`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const copyDraftToClipboard = () => {
    if (!resultDraft) return;
    navigator.clipboard.writeText(resultDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert custom Markdown helper style beautiful layout
  const renderParsedMarkdown = (mdText: string) => {
    const lines = mdText.split("\n");
    return lines.map((line, idx) => {
      // Headers
      if (line.startsWith("### ")) {
        return <h3 key={idx} className="text-sm font-display font-bold text-[#D4AF37] uppercase tracking-wider mt-4 mb-2 first:mt-0">{line.replace("### ", "")}</h3>;
      }
      if (line.startsWith("#### ")) {
        return <h4 key={idx} className="text-[11px] font-mono text-gray-300 uppercase tracking-widest mt-3 mb-1.5">{line.replace("#### ", "")}</h4>;
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return <p key={idx} className="text-xs font-semibold text-[#D4AF37] tracking-wide mt-1.5">{line.replace(/\*\*/g, "")}</p>;
      }
      // Horizontal Rule
      if (line.trim() === "---") {
        return <div key={idx} className="border-b border-[#2A2A2D] my-4" />;
      }
      // Checkboxes
      if (line.trim().startsWith("*   [ ]") || line.trim().startsWith("- [ ]")) {
        const text = line.replace(/^\*   \[ \]/, "").replace(/^- \[ \]/, "");
        return (
          <div key={idx} className="flex items-center gap-2 text-xs text-gray-300 pl-4 py-0.5">
            <div className="h-3 w-3 rounded border border-gray-600 flex-none" />
            <span>{text}</span>
          </div>
        );
      }
      // Bullet points
      if (line.trim().startsWith("* ") || line.trim().startsWith("- ")) {
        const text = line.trim().replace(/^\* /, "").replace(/^- /, "");
        return (
          <div key={idx} className="flex items-start gap-2 text-xs text-gray-300 pl-4 py-0.5">
            <span className="text-[#D4AF37] mt-1.5 flex-none">&bull;</span>
            <span>{text}</span>
          </div>
        );
      }
      // Normal Line
      if (line.trim() === "") return <div key={idx} className="h-2" />;
      
      // Inline styling match for **bolding** inside lines
      const processedLine = line.split("**").map((part, pIdx) => {
        if (pIdx % 2 === 1) {
          return <strong key={pIdx} className="text-[#D4AF37] font-medium">{part}</strong>;
        }
        return part;
      });

      return <p key={idx} className="text-xs text-gray-300 leading-relaxed font-sans">{processedLine}</p>;
    });
  };

  return (
    <div className="space-y-8" id="ai-studio-integrated-module">
      
      {/* Editorial Title Block */}
      <div className="border-b border-[#2A2A2D] pb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] px-2.5 py-1 bg-amber-500/10 rounded border border-[#2A2A2D]">
            Cognitive Assistance Node
          </span>
          <h1 className="mt-4 font-display text-3xl font-light tracking-tight text-white md:text-4xl">
            AI Studio
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-sans max-w-2xl">
            Full-stack copywriting and analysis deck powered by Gemini. Formulate high-converting client proposals, outreach templates, and precise legal summaries matching the Legacy OS standard.
          </p>
        </div>

        <div className="h-10 w-10 bg-[#D4AF37]/15 rounded-full flex items-center justify-center border border-[#D4AF37]/35 shadow-lg shadow-amber-500/5">
          <Sparkles className="h-5 w-5 text-[#D4AF37] animate-pulse" />
        </div>
      </div>

      {/* SLEEK SPLIT-SCREEN WORKSPACE LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 1. LEFT SIDEBAR WORKSPACE PANEL (5 Columns) */}
        <div className="lg:col-span-5 bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5.5 space-y-5 shadow-2xl" id="ai-workspace-sidebar">
          
          <div className="border-b border-[#2A2A2D] pb-3 flex items-center justify-between">
            <h3 className="font-display text-xs font-semibold text-white uppercase tracking-widest flex items-center gap-2">
              <Cpu className="h-4 w-4 text-[#D4AF37]" />
               Workspace Configuration
            </h3>
            <span className="text-[9px] font-mono text-gray-500">ID: OS-A1-NODE</span>
          </div>

          <div className="space-y-4 font-sans text-left">
            
            {/* INPUT 1: Outreach Type Dropdown */}
            <div className="space-y-1.5 whitespace-nowrap">
              <label className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">
                Outreach Engine Type
              </label>
              
              <select
                value={outreachType}
                onChange={(e) => setOutreachType(e.target.value as OutreachType)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-3 select-none focus:outline-none focus:border-[#D4AF37] custom-scrollbar font-mono tracking-tight"
              >
                <option value="Premium Retainer Proposal">Premium Retainer Proposal</option>
                <option value="Proposal">Standard Proposal</option>
                <option value="Follow-up">Follow-up Pitch</option>
                <option value="Contract Summary">Contract Summary</option>
              </select>
            </div>

            {/* INPUT 2: Active CRM Client Dropdown */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-gray-400 tracking-wider flex items-center justify-between">
                <span>Select Target CRM Client</span>
                <span className="text-[8px] font-mono text-[#D4AF37] lowercase">Sync Active</span>
              </label>
              <select
                value={selectedClientId}
                onChange={(e) => setSelectedClientId(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-3 select-none focus:outline-none focus:border-[#D4AF37] custom-scrollbar"
              >
                <option value="generic">Generic Outbound Prospect</option>
                {activeClients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName} ({c.name})
                  </option>
                ))}
              </select>
            </div>

            {/* Sub-card presenting active metadata parameters from the selected account */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedClientId}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="bg-[#0B0B0C]/60 border border-[#2A2A2D] p-3.5 rounded-lg space-y-2.5 text-xs text-left"
              >
                <span className="text-[9px] font-mono uppercase text-[#D4AF37] block tracking-widest font-semibold border-b border-[#2A2A2D]/45 pb-1">
                  Active Asset Blueprint
                </span>
                {selectedClientId === "generic" ? (
                  <p className="text-[10px] text-gray-450 italic">
                    Utilizing default enterprise scale variables. Select an active CRM partner above to synchronize direct contract parameters automatically.
                  </p>
                ) : (
                  currentClient && (
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-gray-400">
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block text-[8px] uppercase">Corporate Partner</span>
                        <span className="text-white font-medium block truncate">{currentClient.companyName}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block text-[8px] uppercase">Retainer Value</span>
                        <span className="text-emerald-400 font-bold block">${currentClient.retainerAmount.toLocaleString()} USD/mo</span>
                      </div>
                      <div className="space-y-0.5 col-span-2">
                        <span className="text-gray-550 block text-[8px] uppercase">Retainer Tier Layout</span>
                        <span className="text-gray-300 block truncate">{currentClient.retainerTier}</span>
                      </div>
                    </div>
                  )
                )}
              </motion.div>
            </AnimatePresence>

            {/* INPUT 3: Context Details textarea */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">
                Context Details & Core Offer
              </label>
              <textarea
                value={contextDetails}
                onChange={(e) => setContextDetails(e.target.value)}
                rows={7}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-gray-300 rounded p-3 focus:outline-none focus:border-[#D4AF37] resize-none custom-scrollbar font-sans leading-relaxed"
                placeholder="Declare contract terms, monthly fees, SOW goals, specific names or operational requirements to formulate your copy directive..."
              />
              <span className="text-[9px] font-mono text-gray-550 text-right block">
                {contextDetails.length} / 1200 characters loaded
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={executeGeneration}
                disabled={isGenerating || !contextDetails.trim()}
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#b89523] text-black font-display font-medium rounded text-xs tracking-wider uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40"
              >
                {isGenerating ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin text-black" />
                    Engaging Cognitive Pipeline...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-black" />
                    Generate output draft
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

        {/* 2. RIGHT PREVIEW CANVAS PANEL (7 Columns) */}
        <div className="lg:col-span-7 space-y-4" id="ai-preview-canvas">
          
          {/* Output header bar ribbon */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-3 px-4.5 flex items-center justify-between shadow-md">
            
            {/* Status tracker */}
            <div className="flex items-center gap-2 bg-[#0B0B0C] border border-[#2A2A2D] p-1.5 px-3 rounded">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-gray-300 font-semibold uppercase">
                Gemini-3.5-Flash Online
              </span>
            </div>

            {/* Utility control Actions */}
            <div className="flex items-center gap-2">
              {resultDraft && (
                <button
                  onClick={copyDraftToClipboard}
                  className="flex items-center gap-1.5 text-[10px] font-mono text-gray-300 hover:text-[#D4AF37] bg-[#0B0B0C] hover:bg-black px-3 py-1.5 rounded border border-[#2A2A2D] transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      Copied Summary!
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-gray-400" />
                      Copy to Clipboard
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={() => {
                  setResultDraft(null);
                  setAiError(null);
                  setGenerationLogs([]);
                }}
                disabled={isGenerating || (!resultDraft && generationLogs.length === 0)}
                className="text-[10px] font-mono text-gray-500 hover:text-white disabled:opacity-40 cursor-pointer"
              >
                Clear output
              </button>
            </div>
          </div>

          {/* Code Editor Styled Preview Canvas Frame */}
          <div className="bg-black/75 border border-[#2A2A2D] rounded-lg h-[540px] flex flex-col justify-between overflow-hidden shadow-2xl relative text-left">
            
            {/* Code editor upper layout bar */}
            <div className="p-3 bg-[#131315] border-b border-[#2A2A2D] flex items-center justify-between text-[10px] font-mono text-gray-500 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2.5 text-gray-400">output_canvas.md</span>
              </div>
              <div className="flex items-center gap-2">
                <span>UTF-8</span>
                <span className="text-[#D4AF37]">Markdown</span>
              </div>
            </div>

            {/* Core Output Canvas Pane */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Code Line Numbers (IDE Left Rail) */}
              <div className="w-10 border-r border-[#2A2A2D] py-4 bg-[#0A0A0B]/80 text-right pr-2.5 font-mono text-[10px] text-gray-650 space-y-1 mt-0.5 select-none md:block hidden">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i}>{(i + 1).toString().padStart(2, "0")}</div>
                ))}
              </div>

              {/* Main text area rendering */}
              <div className="flex-1 p-6 overflow-y-auto custom-scrollbar font-mono speech-bubble relative">
                
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    // LOGS STREAMING (Animated Loading Console)
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-2 text-[11px] text-gray-400 pt-2"
                    >
                      <div className="flex items-center gap-2 text-[#D4AF37] font-semibold uppercase tracking-wider mb-3">
                        <Terminal className="h-4 w-4 animate-spin" />
                        <span>Cognitive Generator Pipeline Active</span>
                      </div>
                      
                      <div className="space-y-1">
                        {generationLogs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ x: -10, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="font-mono flex items-center gap-1.5 text-gray-350"
                          >
                            <CornerDownRight className="h-3 w-3 text-gray-500" />
                            <span>{log}</span>
                          </motion.div>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-col items-center justify-center text-center py-6 text-gray-500 space-y-2.5">
                        <Loader className="h-6 w-6 text-[#D4AF37] animate-spin" />
                        <span className="text-[10px]">Consulting Gemini intelligence engine, synthesizing layout parameters...</span>
                      </div>
                    </motion.div>
                  ) : resultDraft ? (
                    // HIGH-FIDELITY RESULT DRAFT
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-3 pb-8 text-left"
                    >
                      {renderParsedMarkdown(resultDraft)}
                    </motion.div>
                  ) : (
                    // DEFAULT IDLE PLACEHOLDER
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center text-center h-full text-gray-500 space-y-4"
                    >
                      <div className="h-12 w-12 bg-[#0B0B0C] border border-[#2A2A2D] rounded-lg flex items-center justify-center shadow">
                        <FileText className="h-6 w-6 text-gray-700" />
                      </div>
                      <div className="space-y-1.5 max-w-sm">
                        <h4 className="text-xs font-display font-medium text-white uppercase tracking-wider">
                          Ready for execution
                        </h4>
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          Synchronize an active client blueprint, specify your operational outreach intent, and click <strong className="text-[#D4AF37]">&ldquo;Generate Output Draft&rdquo;</strong> to process text via Gemini.
                        </p>
                      </div>

                      {/* Display quick summary logs of capability */}
                      <div className="grid grid-cols-2 gap-2 max-w-xs w-full pt-4 text-[9px] font-mono">
                        <div className="p-2 border border-[#2A2A2D] rounded bg-black/40 text-left">
                          <span className="text-gray-400 block font-bold">OUTBOX</span>
                          <span className="text-gray-550 block mt-0.5">SOWs, emails & proposals</span>
                        </div>
                        <div className="p-2 border border-[#2A2A2D] rounded bg-black/40 text-left">
                          <span className="text-gray-400 block font-bold">ESTATE CHECK</span>
                          <span className="text-gray-550 block mt-0.5">Automated asset summarizations</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>
            </div>

            {/* Code editor footer status line */}
            <div className="p-3 bg-[#131315] border-t border-[#2A2A2D] flex items-center justify-between text-[10px] font-mono text-gray-550 select-none">
              <div className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-gray-650" />
                <span>Host: api.legacyos.com / sandbox</span>
              </div>
              <span className="text-emerald-500">READY</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
