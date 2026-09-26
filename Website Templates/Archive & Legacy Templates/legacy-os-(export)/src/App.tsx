/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  DailyFocusBlock, 
  PremiumClient, 
  BusinessValuationMetric, 
  LegacyMilestone, 
  PipelineStage 
} from "./types";
import CommandCenter from "./components/CommandCenter";
import ClientVault from "./components/ClientVault";
import WealthHub from "./components/WealthHub";
import AIBenefitHub from "./components/AIBenefitHub";
import { 
  LayoutDashboard, 
  Users, 
  Coins, 
  Sparkles, 
  Menu, 
  X, 
  User,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<"command" | "crm" | "wealth" | "ai">("command");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Focus Blocks State (Prepopulated luxury 5-hour operational loop)
  const [focusBlocks, setFocusBlocks] = useState<DailyFocusBlock[]>([
    { id: "fb-1", hour: 1, priorityTitle: "Pipeline development and strategic client outreach.", category: "Revenue", status: "completed", durationMinutes: 60 },
    { id: "fb-2", hour: 2, priorityTitle: "Client delivery and digital product architecture.", category: "Product Delivery", status: "completed", durationMinutes: 60 },
    { id: "fb-3", hour: 3, priorityTitle: "Financial planning and asset optimization review.", category: "Wealth Planning", status: "active", durationMinutes: 60 },
    { id: "fb-4", hour: 4, priorityTitle: "Operations optimization and automation testing.", category: "Operations & Systems", status: "pending", durationMinutes: 60 },
    { id: "fb-5", hour: 5, priorityTitle: "Strategic rest and creative review.", category: "Zen Break", status: "pending", durationMinutes: 60 }
  ]);

  // CRM State (Onboarded Premium High-Ticket clients)
  const [clients, setClients] = useState<PremiumClient[]>([
    {
      id: "cl-nob",
      name: "John Doe",
      companyName: "Acme Corporation",
      email: "john@acme.com",
      retainerTier: "Strategy Retainer",
      retainerAmount: 45000,
      stage: "Active Execution",
      contractStatus: "Signed",
      contractText: `MASTER SERVICES AGREEMENT
BETWEEN: ACME CORPORATION ("Client")
AND: LEGACY OPERATIONS GROUP ("Consultant")

1. SERVICES: Provide full-scale operations engineering, custom integrations, and pipeline automation to accelerate service velocity.
2. TERMS: Recurring retainer of $45,000.00 USD payable monthly on the 1st.
3. COVENANTS: Intellectual property transfer to the trust asset portfolio upon invoice settlement. Mutual NDA active.`,
      onboardingChecklist: [
        { id: "ob-1", label: "Onboarding Questionnaire Signed", done: true },
        { id: "ob-2", label: "Initial Discovery Session Completed", done: true },
        { id: "ob-3", label: "Retainer Sourcing Account Configured", done: true },
        { id: "ob-4", label: "Secure Operations Folder Completed", done: false }
      ],
      milestones: [
        { id: "m-1", label: "System Operational Review", status: "Delivered" },
        { id: "m-2", label: "Wealth Strategy Set", status: "Active" },
        { id: "m-3", label: "Operational Asset Standardize", status: "Pending" }
      ],
      notes: "Onboarded and fully operational. Client active on high-end strategy retainer.",
      dateBoarded: "2026-01-15"
    },
    {
      id: "cl-onyx",
      name: "Jane Smith",
      companyName: "Global Tech Solutions",
      email: "jane@globaltech.com",
      retainerTier: "Operations OS",
      retainerAmount: 32500,
      stage: "Active Execution",
      contractStatus: "Signed",
      contractText: `STATEMENT OF WORK & SERVICES
BETWEEN: GLOBAL TECH SOLUTIONS ("Client")
AND: LEGACY OPERATIONS GROUP ("Consultant")

1. DELIVERABLES: Custom client pipeline setup, structured account systems, and AI drafting assistant fine-tuning.
2. FISCAL TERMS: $32,500.00 USD retainer monthly.
3. COMPLIANCE: Standard multi-jurisdictional non-disclosure in full effect.`,
      onboardingChecklist: [
        { id: "ob-11", label: "Client Discovery Review Completed", done: true },
        { id: "ob-12", label: "Identify Core Assets & Accounts", done: true },
        { id: "ob-13", label: "Initial Invoice Settlement Acknowledged", done: true },
        { id: "ob-14", label: "Platform Deployment Keys Configured", done: true }
      ],
      milestones: [
        { id: "m-11", label: "Operational Architecture Plan", status: "Delivered" },
        { id: "m-12", label: "Account Directory Transition Plan", status: "Delivered" }
      ],
      notes: "Scaling operational OS to streamline services and integrate client pipelines.",
      dateBoarded: "2026-03-20"
    },
    {
      id: "cl-ngs",
      name: "Marcus Vance",
      companyName: "Next Generation Security",
      email: "marcus@nextgensecurity.com",
      retainerTier: "Advisory",
      retainerAmount: 25000,
      stage: "Active Execution",
      contractStatus: "Signed",
      contractText: `ADVISORY ENGAGEMENT AGREEMENT
BETWEEN: NEXT GENERATION SECURITY ("Client")
AND: LEGACY OPERATIONS GROUP ("Consultant")

1. FORMA: Advisory board support, risk evaluation structures, and secure asset system designs.
2. FEES: $25,000.00 USD payable monthly.
3. TERM: Continuous engagement with 30-day exit clauses.`,
      onboardingChecklist: [
        { id: "ob-21", label: "Onboarding Questionnaire Signed", done: true },
        { id: "ob-22", label: "Initial Discovery Session Completed", done: true },
        { id: "ob-23", label: "Retainer Sourcing Account Configured", done: true },
        { id: "ob-24", label: "Establish Security Review Directives", done: true }
      ],
      milestones: [
        { id: "m-21", label: "Advisory Alignment Baseline", status: "Delivered" },
        { id: "m-22", label: "System Hardening Protocols", status: "Active" }
      ],
      notes: "Strategic advisory supporting cybersecurity scale, positioning holding constructs and secure data compliance.",
      dateBoarded: "2026-05-10"
    }
  ]);

  // Wealth assets ledger structure
  const [assets, setAssets] = useState<BusinessValuationMetric[]>([
    { id: "as-treasury", assetName: "Federal High-Yield Treasury", category: "High-Yield Treasury", currentValue: 1800000, appreciationRate: 5, beneficiaryName: "Legacy Estate Trust", status: "Fully Managed" },
    { id: "as-growth", assetName: "Aethelgard Strategic Growth Fund", category: "Strategic Growth Fund", currentValue: 1000000, appreciationRate: 12, beneficiaryName: "Legacy Estate Trust", status: "Fully Managed" },
    { id: "as-re", assetName: "Horizon Real Estate Holdings", category: "Real Estate Holdings", currentValue: 800000, appreciationRate: 8, beneficiaryName: "Legacy Estate Trust", status: "Active Funding" },
    { id: "as-reserves", assetName: "Liquid Operational Reserves", category: "Liquid Operational Reserves", currentValue: 400000, appreciationRate: 4, beneficiaryName: "Legacy Estate Trust", status: "Fully Managed" }
  ]);

  // Family Legacy Milestones
  const [milestones, setMilestones] = useState<LegacyMilestone[]>([
    { id: "mil-1", milestoneTitle: "Incorporate Family Holding Company LLC", category: "Succession Planning", targetDate: "2026-12-31", status: "Protected", notes: "Consolidate corporate shares and family holdings under a single entity structure." },
    { id: "mil-2", milestoneTitle: "Define Long-Term Trust Trustees & Trusteeship", category: "Succession Planning", targetDate: "2027-04-15", status: "In Progress", notes: "Draft transfer terms and allocate asset oversight responsibility." },
    { id: "mil-3", milestoneTitle: "Initiate Wealth System Orientation", category: "Generational Education", targetDate: "2027-09-01", status: "Planned", notes: "Implement core financial literacy and operational guidelines for asset oversight." }
  ]);

  // Core App Handlers
  const handleToggleBlockStatus = (id: string) => {
    setFocusBlocks(prev => {
      // Find current status
      const block = prev.find(b => b.id === id);
      if (!block) return prev;

      let nextStatus: DailyFocusBlock["status"] = "pending";
      if (block.status === "pending") {
        nextStatus = "active";
      } else if (block.status === "active") {
        nextStatus = "completed";
      } else {
        nextStatus = "pending";
      }

      // If opening one as active, set others currently active to pending
      return prev.map(b => {
        if (b.id === id) {
          return { ...b, status: nextStatus };
        }
        if (nextStatus === "active" && b.status === "active") {
          return { ...b, status: "pending" };
        }
        return b;
      });
    });
  };

  const handleUpdateBlockTitle = (id: string, newTitle: string) => {
    setFocusBlocks(prev => prev.map(b => b.id === id ? { ...b, priorityTitle: newTitle } : b));
  };

  const handleAddCustomBlock = () => {
    const nextHour = focusBlocks.length + 1;
    const newBlock: DailyFocusBlock = {
      id: "fb-" + Math.random().toString(36).substr(2, 9),
      hour: nextHour,
      priorityTitle: "Strategic Custom Imperative",
      category: "Operations & Systems",
      status: "pending",
      durationMinutes: 60
    };
    setFocusBlocks(prev => [...prev, newBlock]);
  };

  const handleAddNewClient = (client: PremiumClient) => {
    setClients(prev => [...prev, client]);
  };

  const handleUpdateClientStage = (clientId: string, nextStage: PipelineStage) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, stage: nextStage } : c));
  };

  const handleToggleOnboardingChecklist = (clientId: string, checkId: string) => {
    setClients(prev => prev.map(c => {
      if (c.id === clientId) {
        const updatedChecklist = c.onboardingChecklist.map(item => 
          item.id === checkId ? { ...item, done: !item.done } : item
        );
        return { ...c, onboardingChecklist: updatedChecklist };
      }
      return c;
    }));
  };

  const handleUpdateClientNotes = (clientId: string, notes: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, notes } : c));
  };

  const handleUpdateClientContractText = (clientId: string, contractText: string) => {
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, contractText } : c));
  };

  const handleAddAsset = (asset: BusinessValuationMetric) => {
    setAssets(prev => [...prev, asset]);
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  const handleAddMilestone = (milestone: LegacyMilestone) => {
    setMilestones(prev => [...prev, milestone]);
  };

  const handleToggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === "Protected" ? "In Progress" : "Protected" };
      }
      return m;
    }));
  };

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-gray-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header Navigation */}
      <div className="md:hidden bg-[#0B0B0C] border-b border-[#2A2A2D] p-4 flex items-center justify-between z-40">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-[#D4AF37]" />
          <span className="font-display tracking-[0.2em] font-medium text-white uppercase text-xs">
            Legacy OS
          </span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-gray-400 hover:text-white border border-[#2A2A2D] rounded bg-[#131315]"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Left Sidebar / Modern Premium Dock */}
      <aside className={`
        fixed md:relative inset-y-0 left-0 bg-[#0B0B0C] md:bg-[#0B0B0C] z-50 w-64 md:w-72 border-r border-[#2A2A2D] p-6 flex flex-col justify-between transition-transform duration-300 md:translate-x-0
        ${mobileMenuOpen ? "translate-x-0 bg-[#0B0B0C]/98 w-full max-w-[280px]" : "-translate-x-full"}
      `}>
        <div className="space-y-8">
          
          {/* Logo / Clean Corporate Header */}
          <div className="flex items-center gap-2 border-b border-[#2A2A2D] pb-6">
            <span className="font-display font-medium text-lg text-white uppercase tracking-[0.1em]">
              Legacy OS
            </span>
            <span className="text-[9px] font-mono tracking-wider font-medium text-[#D4AF37]/90 px-1.5 py-0.5 bg-[#D4AF37]/10 border border-[#D4AF37]/25 rounded">
              Workspace
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => {
                setActiveTab("command");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-mono uppercase tracking-wider text-left border cursor-pointer transition-all ${
                activeTab === "command"
                  ? "bg-[#131315] border-[#2A2A2D] text-[#D4AF37]"
                  : "bg-transparent border-transparent text-gray-400 hover:bg-[#131315]/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
              </div>
              {activeTab === "command" && <ChevronRight className="h-3 w-3 text-[#D4AF37]" />}
            </button>

            <button
              onClick={() => {
                setActiveTab("crm");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-mono uppercase tracking-wider text-left border cursor-pointer transition-all ${
                activeTab === "crm"
                  ? "bg-[#131315] border-[#2A2A2D] text-[#D4AF37]"
                  : "bg-transparent border-transparent text-gray-400 hover:bg-[#131315]/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4 w-4" />
                <span>Clients</span>
              </div>
              {activeTab === "crm" && <ChevronRight className="h-3 w-3 text-[#D4AF37]" />}
            </button>

            <button
              onClick={() => {
                setActiveTab("wealth");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-mono uppercase tracking-wider text-left border cursor-pointer transition-all ${
                activeTab === "wealth"
                  ? "bg-[#131315] border-[#2A2A2D] text-[#D4AF37]"
                  : "bg-transparent border-transparent text-gray-400 hover:bg-[#131315]/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Coins className="h-4 w-4" />
                <span>Wealth Hub</span>
              </div>
              {activeTab === "wealth" && <ChevronRight className="h-3 w-3 text-[#D4AF37]" />}
            </button>

            <button
              onClick={() => {
                setActiveTab("ai");
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded text-xs font-mono uppercase tracking-wider text-left border cursor-pointer transition-all ${
                activeTab === "ai"
                  ? "bg-[#131315] border-[#2A2A2D] text-[#D4AF37]"
                  : "bg-transparent border-transparent text-gray-400 hover:bg-[#131315]/40 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-4 w-4" />
                <span>AI Studio</span>
              </div>
              {activeTab === "ai" && <ChevronRight className="h-3 w-3 text-[#D4AF37]" />}
            </button>
          </nav>
        </div>

        {/* Minimalist Profile Panel */}
        <div className="pt-6 border-t border-[#2A2A2D]">
          <div className="p-3 bg-[#131315] border border-[#2A2A2D] rounded flex items-center gap-3">
            <div className="h-7 w-7 rounded-sm bg-[#D4AF37]/10 flex items-center justify-center">
              <User className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-mono text-gray-500 block leading-none uppercase">Account Owner</span>
              <span className="text-xs font-mono text-gray-300 mt-1 block truncate">
                gcoinstash@gmail.com
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 border-t md:border-t-0 md:border-l border-[#2A2A2D] min-w-0 bg-[#0B0B0C] overflow-y-auto">
        
        {/* Dynamic Navigation rendering */}
        {activeTab === "command" && (
          <CommandCenter
            focusBlocks={focusBlocks}
            clients={clients}
            onToggleBlock={handleToggleBlockStatus}
            onUpdateBlockTitle={handleUpdateBlockTitle}
            onAddBlock={handleAddCustomBlock}
            onCreateWealthGoal={() => setActiveTab("wealth")}
          />
        )}

        {activeTab === "crm" && (
          <ClientVault
            clients={clients}
            onAddClient={handleAddNewClient}
            onUpdateClientStage={handleUpdateClientStage}
            onToggleOnboardingCheck={handleToggleOnboardingChecklist}
            onUpdateClientNotes={handleUpdateClientNotes}
            onUpdateClientContractText={handleUpdateClientContractText}
          />
        )}

        {activeTab === "wealth" && (
          <WealthHub
            clients={clients}
            assets={assets}
            milestones={milestones}
            onAddAsset={handleAddAsset}
            onDeleteAsset={handleDeleteAsset}
            onAddMilestone={handleAddMilestone}
            onToggleMilestone={handleToggleMilestone}
          />
        )}

        {activeTab === "ai" && (
          <AIBenefitHub clients={clients} />
        )}

      </main>

    </div>
  );
}
