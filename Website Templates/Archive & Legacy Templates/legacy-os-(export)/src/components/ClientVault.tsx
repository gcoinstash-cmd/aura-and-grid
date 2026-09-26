/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { PremiumClient, PipelineStage } from "../types";
import { 
  Building, 
  Mail, 
  Search, 
  Filter, 
  Plus, 
  X, 
  Loader, 
  Sparkles, 
  FileText, 
  Send, 
  CheckSquare, 
  FileCheck, 
  Calendar,
  DollarSign,
  ChevronRight,
  User,
  ShieldAlert,
  ClipboardList,
  MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ClientVaultProps {
  clients: PremiumClient[];
  onAddClient: (client: PremiumClient) => void;
  onUpdateClientStage: (clientId: string, nextStage: PipelineStage) => void;
  onToggleOnboardingCheck: (clientId: string, checkId: string) => void;
  onUpdateClientNotes: (clientId: string, notes: string) => void;
  onUpdateClientContractText: (clientId: string, contractText: string) => void;
}

export default function ClientVault({
  clients,
  onAddClient,
  onUpdateClientStage,
  onToggleOnboardingCheck,
  onUpdateClientNotes,
  onUpdateClientContractText
}: ClientVaultProps) {
  // Navigation filters and query states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "active" | "onboarding">("all");

  // Selection state for slide-out detail drawer
  const [selectedClient, setSelectedClient] = useState<PremiumClient | null>(null);

  // Form states for creating a new client
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [retainerTier, setRetainerTier] = useState("Premium Operations Retainer");
  const [retainerAmount, setRetainerAmount] = useState(15000);
  const [stage, setStage] = useState<PipelineStage>("Inquiry");
  const [contractText, setContractText] = useState("");
  const [dateBoarded, setDateBoarded] = useState("2026-06-01");

  // AI copywriting & summarization states
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [summaryResult, setSummaryResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  
  const [campaignType, setCampaignType] = useState("Premium Service Retainer Proposal");
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [pitchResult, setPitchResult] = useState<string | null>(null);

  // Stage options
  const stages: PipelineStage[] = [
    "Inquiry", 
    "Proposal Sent", 
    "Contract Signed", 
    "Onboarding", 
    "Active Execution", 
    "Account Review"
  ];

  // Helper method to resolve date formatting
  const formatDateString = (dateStr?: string) => {
    if (!dateStr) return "N/A";
    try {
      const parts = dateStr.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthNum = parseInt(parts[1], 10);
        const day = parts[2];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[monthNum - 1] || "Jun"} ${parseInt(day, 10)}, ${year}`;
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Form submission handler
  const handleCreateClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !companyName) return;

    const defaultContractText = `MASTER SERVICES AGREEMENT
BETWEEN: ${companyName.toUpperCase()} ("Client")
AND: LEGACY OPERATIONS GROUP ("Consultant")

1. SERVICES: The Consultant agrees to dedicate daily strategic operational assistance to accelerate client systems and workflow scaling.
2. FEES & COMPENSATION: Recurring retainer of $${retainerAmount.toLocaleString()} USD is payable monthly.
3. INTELLECTUAL PROPERTY: All custom deliverables, digital systems, and code structures transfer to the Client upon milestone payments.
4. CONFIDENTIALITY: All shared business plans, metrics, and systems are governed by mutual non-disclosure.`;

    const newClient: PremiumClient = {
      id: "cl-" + Math.random().toString(36).substr(2, 9),
      name,
      companyName,
      email,
      retainerTier,
      retainerAmount,
      stage,
      contractStatus: "Draft",
      contractText: contractText || defaultContractText,
      dateBoarded: dateBoarded || "2026-06-01",
      onboardingChecklist: [
        { id: "ob-1", label: "Onboarding Questionnaire Signed", done: true },
        { id: "ob-2", label: "Initial Discovery Session Completed", done: false },
        { id: "ob-3", label: "Retainer Sourcing Account Configured", done: false },
        { id: "ob-4", label: "Secure Operations Folder Completed", done: false }
      ],
      milestones: [
        { id: "m-1", label: "System Operational Review", status: "Active" },
        { id: "m-2", label: "Wealth Strategy Align", status: "Pending" },
        { id: "m-3", label: "Secure Systems Infrastructure", status: "Pending" }
      ],
      notes: "Growth-focused partnership scaling digital systems and optimizing operational efficiency."
    };

    onAddClient(newClient);
    setIsCreating(false);

    // Reset Form fields
    setName("");
    setCompanyName("");
    setEmail("");
    setRetainerAmount(15000);
    setContractText("");
    setDateBoarded("2026-06-01");
  };

  // Launch Server-Side AI contract summarizer
  const handleSummarizeContract = async (client: PremiumClient) => {
    setIsSummarizing(true);
    setSummaryResult(null);
    setAiError(null);

    try {
      const response = await fetch("/api/gemini/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentName: `${client.companyName} Partnership Contract`,
          contentText: client.contractText
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to contact the Legacy AI server.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setSummaryResult(data.text);
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred while communicating with Gemini API.");
    } finally {
      setIsSummarizing(false);
    }
  };

  // Launch AI Copywriter pitch generator
  const handleGenerateCopywrite = async (client: PremiumClient) => {
    setIsGeneratingPitch(true);
    setPitchResult(null);
    setAiError(null);

    const offerDetails = `Premium agency operations retainer with ${client.name} from ${client.companyName}. Delivering a $${client.retainerAmount}/mo systems optimization tier that accelerates daily output and automates standard workflows.`;

    try {
      const response = await fetch("/api/gemini/copywrite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetAudience: `${client.name} (${client.companyName})`,
          campaignType: campaignType,
          offerDetails: offerDetails,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach Legacy AI copywriting server.");
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      setPitchResult(data.text);
    } catch (err: any) {
      setAiError(err.message || "An unexpected error occurred while reaching the copywriting pipeline.");
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  // Search and filter memoized logic
  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      // 1. Filter by search query (Client name or company name)
      const matchesSearch = 
        client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // 2. Filter by status categorization
      if (filterType === "active") {
        return client.stage === "Active Execution";
      }
      if (filterType === "onboarding") {
        return (
          client.stage === "Onboarding" || 
          client.stage === "Contract Signed" || 
          client.stage === "Proposal Sent"
        );
      }
      return true; // "all"
    });
  }, [clients, searchQuery, filterType]);

  return (
    <div className="space-y-8" id="client-pipeline-module">
      {/* Editorial Title Block */}
      <div className="border-b border-[#2A2A2D] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] px-2.5 py-1 bg-amber-500/10 rounded border border-[#2A2A2D]">
            Corporate Directory
          </span>
          <h1 className="mt-4 font-display text-3xl font-light tracking-tight text-white md:text-4xl">
            Client pipeline
          </h1>
          <p className="mt-2 text-sm text-gray-400 font-sans max-w-2xl">
            Audit high-fidelity account milestones, client contracts, and configure onboarding checklists across all client pipelines.
          </p>
        </div>
        <div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-[#D4AF37] hover:bg-[#b08e28] text-black font-display font-medium rounded text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer justify-center"
          >
            <Plus className="h-4 w-4" />
            + Add New Client
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-[#1A1A1C] border border-[#2A2A2D] p-4 rounded-lg">
        {/* Search input field */}
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clients..."
            className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded-md py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-[#D4AF37] placeholder-gray-500 font-sans"
          />
        </div>

        {/* Filter Tab buttons */}
        <div className="flex bg-[#0B0B0C] border border-[#2A2A2D] p-1 rounded-md w-full md:w-auto">
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded text-[11px] font-mono uppercase transition-all ${
              filterType === "all"
                ? "bg-[#1A1A1C] text-[#D4AF37] font-semibold border border-[#2A2A2D]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All Clients
          </button>
          <button
            onClick={() => setFilterType("active")}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded text-[11px] font-mono uppercase transition-all ${
              filterType === "active"
                ? "bg-[#1A1A1C] text-[#D4AF37] font-semibold border border-[#2A2A2D]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilterType("onboarding")}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded text-[11px] font-mono uppercase transition-all ${
              filterType === "onboarding"
                ? "bg-[#1A1A1C] text-[#D4AF37] font-semibold border border-[#2A2A2D]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Onboarding
          </button>
        </div>
      </div>

      {/* CORE CLENT DATA TABLE */}
      <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2A2D] bg-[#131315]/80">
                <th className="p-4 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Client Name</th>
                <th className="p-4 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Primary Contact</th>
                <th className="p-4 text-[10px] uppercase font-mono text-gray-400 tracking-wider text-right">Monthly Retainer Value</th>
                <th className="p-4 text-[10px] uppercase font-mono text-gray-400 tracking-wider text-center">Project Phase</th>
                <th className="p-4 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Date Boarded</th>
                <th className="p-3 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2D]">
              {filteredClients.length > 0 ? (
                filteredClients.map((client) => {
                  // Determine Badges beautifully according to our standardized casing guidelines
                  let badgeText = client.stage;
                  let badgeClass = "text-gray-400 bg-[#1A1A1C] border border-[#2A2A2D]";

                  if (client.stage === "Active Execution") {
                    badgeText = "Active execution";
                    badgeClass = "text-emerald-400 bg-emerald-950/25 border border-emerald-900/40";
                  } else if (client.stage === "Onboarding") {
                    badgeText = "Onboarding";
                    badgeClass = "text-amber-400 bg-amber-950/25 border border-amber-900/40";
                  } else if (client.stage === "Contract Signed") {
                    badgeText = "Contract signed";
                    badgeClass = "text-blue-400 bg-blue-950/25 border border-blue-900/40";
                  } else if (client.stage === "Account Review") {
                    badgeText = "Account review";
                    badgeClass = "text-purple-400 bg-purple-950/25 border border-purple-900/40";
                  } else if (client.stage === "Proposal Sent") {
                    badgeText = "Proposal sent";
                    badgeClass = "text-sky-400 bg-sky-950/25 border border-sky-900/40";
                  } else if (client.stage === "Inquiry") {
                    badgeText = "Inquiry";
                    badgeClass = "text-zinc-400 bg-zinc-950/25 border border-zinc-900/40";
                  }

                  return (
                    <tr
                      key={client.id}
                      onClick={() => {
                        setSelectedClient(client);
                        setSummaryResult(null);
                        setPitchResult(null);
                        setAiError(null);
                      }}
                      className="hover:bg-[#131315]/40 transition-colors pointer-events-auto cursor-pointer group"
                    >
                      {/* Client Name Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-[#0B0B0C] border border-[#2A2A2D] flex items-center justify-center text-gray-400 group-hover:border-[#D4AF37] transition-all">
                            <Building className="h-4 w-4 text-[#D4AF37]" />
                          </div>
                          <div>
                            <span className="text-sm font-display font-medium text-white block group-hover:text-[#D4AF37] transition-colors">
                              {client.companyName}
                            </span>
                            <span className="text-[10px] font-mono text-gray-500 block mt-0.5">
                              {client.retainerTier}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Primary Contact Column */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="text-xs text-gray-300 block font-sans">{client.name}</span>
                          <span className="text-[10px] text-gray-500 block font-mono flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {client.email}
                          </span>
                        </div>
                      </td>

                      {/* Monthly Retainer */}
                      <td className="p-4 text-right">
                        <span className="text-sm font-mono font-medium text-white">
                          ${client.retainerAmount.toLocaleString()}
                        </span>
                        <span className="text-[9px] text-gray-500 block font-sans">USD/mo</span>
                      </td>

                      {/* Phase Inline Badge */}
                      <td className="p-4 text-center">
                        <span className={`text-[9px] font-mono px-2.5 py-0.5 rounded border inline-block ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </td>

                      {/* Date Boarded Custom Column */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-mono">
                          <Calendar className="h-3.5 w-3.5 text-gray-500" />
                          <span>{formatDateString(client.dateBoarded)}</span>
                        </div>
                      </td>

                      {/* Chevron expand trigger */}
                      <td className="p-4 text-center">
                        <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-[#D4AF37] transition-all transform group-hover:translate-x-0.5" />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 font-mono text-xs">
                    No agency partners found matching query search preferences.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RIGHT SIDE EXPANDABLE ACCOUNT DETAILS DRAWER */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setSelectedClient(null)} />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-4xl bg-[#1A1A1C] border-l border-[#2A2A2D] h-full flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              {/* Drawer Header Toolbar */}
              <div className="p-6 border-b border-[#2A2A2D] bg-[#1A1A1C] flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2 py-0.5 bg-amber-500/10 text-[#D4AF37] rounded border border-amber-500/20">
                      {selectedClient.retainerTier}
                    </span>
                    <span className="text-[10px] font-mono text-gray-500">Boarded {formatDateString(selectedClient.dateBoarded)}</span>
                  </div>
                  <h2 className="font-display text-xl text-white font-medium mt-1">
                    {selectedClient.companyName}
                  </h2>
                </div>
                
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="p-1.5 bg-[#0B0B0C] border border-[#2A2A2D] text-gray-400 hover:text-white rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Main Content */}
              <div className="p-6 flex-1 space-y-6 overflow-y-auto custom-scrollbar">
                
                {/* Meta details cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded-lg p-4 flex gap-3.5 items-center">
                    <div className="h-9 w-9 rounded bg-[#1A1A1C] border border-[#2A2A2D] flex items-center justify-center">
                      <User className="h-4.5 w-4.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 block uppercase">Lead Partner</span>
                      <span className="text-xs font-semibold text-white mt-0.5 block">{selectedClient.name}</span>
                      <span className="text-[10px] font-mono text-gray-400 block">{selectedClient.email}</span>
                    </div>
                  </div>

                  <div className="bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded-lg p-4 flex gap-3.5 items-center">
                    <div className="h-9 w-9 rounded bg-[#1A1A1C] border border-[#2A2A2D] flex items-center justify-center">
                      <DollarSign className="h-4.5 w-4.5 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[9px] font-mono text-gray-500 block uppercase">Account Retainer</span>
                      <span className="text-xs font-semibold text-white mt-0.5 block">
                        ${selectedClient.retainerAmount.toLocaleString()} USD
                      </span>
                      <span className="text-[10px] font-mono text-gray-400 block">Monthly recurring fee</span>
                    </div>
                  </div>
                </div>

                {/* Stage Stepper Management Selector */}
                <div className="space-y-2 select-none">
                  <label className="text-xs font-mono uppercase text-gray-400 tracking-widest block">
                    Account details
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {stages.map((stg) => {
                      const isActive = selectedClient.stage === stg;
                      return (
                        <button
                          key={stg}
                          onClick={() => {
                            onUpdateClientStage(selectedClient.id, stg);
                            setSelectedClient({ ...selectedClient, stage: stg });
                          }}
                          className={`py-2 px-1 rounded font-mono text-[9px] tracking-tight border text-center transition-all cursor-pointer ${
                            isActive 
                              ? "bg-[#D4AF37] text-black border-[#D4AF37] font-semibold" 
                              : "bg-[#0B0B0C]/40 border-[#2A2A2D] text-gray-400 hover:border-gray-500 hover:text-white"
                          }`}
                        >
                          {stg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Grid of Checklists & Strategic Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Onboarding Checklist Card */}
                  <div className="bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded-lg p-4 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] flex items-center justify-between border-b border-[#2A2A2D] pb-3">
                      <span>Onboarding checklist</span>
                      <ClipboardList className="h-4 w-4" />
                    </h4>
                    
                    <div className="space-y-3 pt-1">
                      {selectedClient.onboardingChecklist.map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            onToggleOnboardingCheck(selectedClient.id, item.id);
                            const updatedList = selectedClient.onboardingChecklist.map(o => 
                              o.id === item.id ? { ...o, done: !o.done } : o
                            );
                            setSelectedClient({ ...selectedClient, onboardingChecklist: updatedList });
                          }}
                          className="flex items-center gap-2.5 text-sm cursor-pointer hover:text-[#D4AF37] transition-all group"
                        >
                          {item.done ? (
                            <FileCheck className="h-4.5 w-4.5 text-[#D4AF37] flex-none" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-gray-600 group-hover:border-[#D4AF37] flex-none" />
                          )}
                          <span className={`text-xs ${item.done ? "line-through text-gray-550" : "text-gray-300"}`}>
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strategic Notes Card */}
                  <div className="bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded-lg p-4 space-y-3">
                    <h4 className="text-xs font-mono uppercase tracking-widest text-[#D4AF37] flex items-center justify-between border-b border-[#2A2A2D] pb-3">
                      <span>Confidential Strategic Notes</span>
                      <MessageSquare className="h-4 w-4" />
                    </h4>
                    
                    <textarea
                      value={selectedClient.notes}
                      onChange={(e) => {
                        onUpdateClientNotes(selectedClient.id, e.target.value);
                        setSelectedClient({ ...selectedClient, notes: e.target.value });
                      }}
                      rows={6}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-gray-300 text-xs rounded p-3 focus:outline-none focus:border-[#D4AF37] resize-none font-sans"
                      placeholder="Add strategic account updates, meeting summaries, or compliance goals..."
                    />
                  </div>
                </div>

                {/* AI Integration Section */}
                <div className="border-t border-[#2A2A2D] pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display text-sm font-medium text-white flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                      Client Pipeline AI Engine (Gemini)
                    </h4>
                    <span className="text-[9px] uppercase font-mono text-gray-400 bg-[#0B0B0C] border border-[#2A2A2D] px-2 py-0.5 rounded">
                      Model: Gemini 3.5 Flash
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left segment: Editable Contract text */}
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono uppercase text-gray-400 block">
                        Contract draft terms / text
                      </span>
                      <textarea
                        value={selectedClient.contractText}
                        onChange={(e) => {
                          onUpdateClientContractText(selectedClient.id, e.target.value);
                          setSelectedClient({ ...selectedClient, contractText: e.target.value });
                        }}
                        rows={6}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-gray-350 text-xs font-mono rounded p-2.5 focus:outline-none focus:border-[#D4AF37] custom-scrollbar"
                        placeholder="Add agreement terms or project scopes..."
                      />
                      <button
                        onClick={() => handleSummarizeContract(selectedClient)}
                        disabled={isSummarizing}
                        className="w-full py-2 px-3 bg-[#0B0B0C] border border-[#2A2A2D] hover:border-[#D4AF37] text-[#D4AF37] rounded font-mono text-[10px] uppercase tracking-wider hover:bg-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSummarizing ? (
                          <>
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                            Summarizing Draft...
                          </>
                        ) : (
                          <>
                            <FileText className="h-3.5 w-3.5" />
                            Summarize Draft via Gemini
                          </>
                        )}
                      </button>
                    </div>

                    {/* Right segment: Automated Copy pitch builder */}
                    <div className="space-y-2.5 bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded p-4 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#D4AF37] block mb-2 font-semibold">
                          Automated Partnership Outreaches
                        </span>
                        <div className="space-y-1.5">
                          <label className="text-[9px] text-gray-400 font-mono block">Outreach Campaign Intent:</label>
                          <select
                            value={campaignType}
                            onChange={(e) => setCampaignType(e.target.value)}
                            className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded text-xs text-white p-2 focus:outline-none focus:border-[#D4AF37]"
                          >
                            <option value="Premium Service Retainer Proposal">Service Agreement Proposal</option>
                            <option value="Elite Platform Joint Venture Draft">Joint Venture SOW</option>
                            <option value="Quarterly Executive Succession Update">Operations Progress Update</option>
                          </select>
                        </div>
                      </div>

                      <button
                        onClick={() => handleGenerateCopywrite(selectedClient)}
                        disabled={isGeneratingPitch}
                        className="w-full py-2.5 px-3 bg-[#D4AF37] hover:bg-[#c49e2a] text-black font-display font-medium rounded text-[10px] tracking-wider uppercase transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isGeneratingPitch ? (
                          <>
                            <Loader className="h-3.5 w-3.5 animate-spin" />
                            Drafting Content...
                          </>
                        ) : (
                          <>
                            <Send className="h-3.5 w-3.5" />
                            Generate copy pitch
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Gemini Generation Results */}
                  {(summaryResult || pitchResult || aiError) && (
                    <div className="bg-[#0B0B0C] border border-[#2A2A2D] rounded-lg p-5 mt-4 text-left relative">
                      <button 
                        onClick={() => {
                          setSummaryResult(null);
                          setPitchResult(null);
                          setAiError(null);
                        }}
                        className="absolute top-3.5 right-3.5 p-1 bg-[#1A1A1C] hover:bg-[#2A2A2D] text-gray-400 rounded-full transition-colors cursor-pointer"
                        title="Clear output"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      {aiError && (
                        <div className="space-y-1">
                          <h5 className="text-xs font-mono font-bold text-red-400">Intelligence Processing Error</h5>
                          <p className="text-xs text-gray-400">{aiError}</p>
                        </div>
                      )}

                      {summaryResult && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 border-b border-[#2A2A2D] pb-2">
                            <FileCheck className="h-4 w-4 text-[#D4AF37]" />
                            <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                              Executive Partnership Summary
                            </h5>
                          </div>
                          <div className="text-xs text-gray-300 space-y-2 leading-relaxed custom-scrollbar max-h-[250px] overflow-y-auto whitespace-pre-wrap font-sans">
                            {summaryResult}
                          </div>
                        </div>
                      )}

                      {pitchResult && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-1.5 border-b border-[#2A2A2D] pb-2">
                            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
                            <h5 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                              Generated Brand Copy Asset
                            </h5>
                          </div>
                          <div className="text-xs text-gray-300 space-y-2 leading-relaxed custom-scrollbar max-h-[250px] overflow-y-auto whitespace-pre-wrap font-sans">
                            {pitchResult}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer controls */}
              <div className="p-6 border-t border-[#2A2A2D] bg-[#1A1A1C] flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="px-5 py-2.5 bg-[#0B0B0C] border border-[#2A2A2D] hover:bg-black rounded text-[11px] font-mono tracking-wider text-gray-400 hover:text-white uppercase"
                >
                  Close Account view
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* NEW PARTNER CREATION DRAWER slide-in from right */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs">
            <div className="absolute inset-0" onClick={() => setIsCreating(false)} />
            
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-xl bg-[#1A1A1C] border-l border-[#2A2A2D] h-full flex flex-col justify-between shadow-2xl"
            >
              {/* Drawer Form Header */}
              <div className="p-6 border-b border-[#2A2A2D] bg-[#1A1A1C] flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg text-white font-medium">
                    Onboard Premium Partner
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-sans">
                    Register a new strategic enterprise client, specify their monthly recurring retainer, and deploy initial checklists.
                  </p>
                </div>
                <button 
                  onClick={() => setIsCreating(false)}
                  className="p-1.5 bg-[#0B0B0C] border border-[#2A2A2D] text-gray-400 hover:text-white rounded-md transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Form Body */}
              <form onSubmit={handleCreateClientSubmit} className="flex-1 flex flex-col justify-between overflow-hidden">
                <div className="p-6 space-y-4 flex-1 overflow-y-auto custom-scrollbar font-sans text-left">
                  
                  {/* Lead Partner Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Lead Partner Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  {/* Company/Agency Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Company / Agency Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="e.g. Acme Corporation"
                    />
                  </div>

                  {/* Email address */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Confidential Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      placeholder="e.g. john@acme.com"
                    />
                  </div>

                  {/* Pricing and pricing retainer input */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Retainer Pricing Tier</label>
                      <select
                        value={retainerTier}
                        onChange={(e) => setRetainerTier(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        <option value="Premium Operations Retainer">Premium Retainer - $15k/mo</option>
                        <option value="Strategic Systems Residency">Systems Build - $30k/mo</option>
                        <option value="Enterprise Advisory Tier">Advisory Tier - $10k/mo</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Active Retainer ($ Amount)</label>
                      <input
                        type="number"
                        required
                        value={retainerAmount}
                        onChange={(e) => setRetainerAmount(Number(e.target.value))}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Initial pipeline placement and onboarding date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Initial Pipeline Placement</label>
                      <select
                        value={stage}
                        onChange={(e) => setStage(e.target.value as PipelineStage)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                      >
                        {stages.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-mono text-gray-400 block tracking-wider">Boarding Date</label>
                      <input
                        type="date"
                        required
                        value={dateBoarded}
                        onChange={(e) => setDateBoarded(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono"
                      />
                    </div>
                  </div>

                  {/* Contract document text */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-mono text-[#D4AF37] block tracking-wider">Initial SOW / Contract Terms</label>
                    <textarea
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      rows={4}
                      className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] font-mono custom-scrollbar"
                      placeholder="Optional details, deliverable limits, and legal terms..."
                    />
                  </div>
                </div>

                {/* Form CTA Buttons */}
                <div className="p-6 border-t border-[#2A2A2D] bg-[#1C1C1E] flex justify-end gap-3.5">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="px-5 py-2.5 bg-[#0B0B0C] hover:bg-black border border-[#2A2A2D] rounded text-xs text-gray-400 tracking-wide font-mono transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#D4AF37] text-black hover:bg-[#c49e2a] font-display font-medium rounded text-xs tracking-wider uppercase shadow-md cursor-pointer transition-transform duration-100"
                  >
                    Execute Onboarding
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
