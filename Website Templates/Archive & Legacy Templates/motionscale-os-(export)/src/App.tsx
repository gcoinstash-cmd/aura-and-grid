/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Project, 
  CreativeAsset, 
  ClientPortal, 
  FinancialInvoice 
} from "./types";
import { 
  INITIAL_PROJECTS, 
  INITIAL_CREATIVE_ASSETS, 
  INITIAL_PORTALS, 
  INITIAL_INVOICES 
} from "./data";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import CrmModule from "./components/CrmModule";
import SprintManager from "./components/SprintManager";
import FinancialLedger from "./components/FinancialLedger";
import ClientPortalComponent from "./components/ClientPortal";
import MarketingBlueprint from "./components/MarketingBlueprint";
import ClientSandbox from "./components/ClientSandbox";
import AiCoProcessor from "./components/AiCoProcessor";
import DevOpsHub from "./components/DevOpsHub";

import { 
  Activity, 
  Users, 
  Layers, 
  CreditCard, 
  ShieldAlert, 
  Globe, 
  Command,
  AlignRight,
  X,
  ShieldCheck,
  Sparkles,
  Cpu
} from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // MotionScale Unified State Engine
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [assets, setAssets] = useState<CreativeAsset[]>(INITIAL_CREATIVE_ASSETS);
  const [portals, setPortals] = useState<ClientPortal[]>(INITIAL_PORTALS);
  const [invoices, setInvoices] = useState<FinancialInvoice[]>(INITIAL_INVOICES);

  // Dynamic state synchronizations & callback handlers
  const handleAddProject = (newProj: Project) => {
    setProjects([newProj, ...projects]);
    
    // Automatically trigger an outstanding draft invoice for high-ticket setups (50% upfront)
    const milestoneInvoice: FinancialInvoice = {
      id: "inv-gen-" + Date.now(),
      invoiceNumber: `MS-2026-${Math.floor(100 + Math.random() * 900)}`,
      amount: Math.round(newProj.budget * 0.5),
      status: "Draft",
      projectId: newProj.id,
      dueDate: newProj.deliveryDate
    };
    setInvoices(prev => [milestoneInvoice, ...prev]);
  };

  const handleUpdateProject = (updatedProj: Project) => {
    setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const handleAddAsset = (newAsset: CreativeAsset) => {
    setAssets([newAsset, ...assets]);
  };

  const handleUpdateAssetStatus = (id: string, status: CreativeAsset["status"]) => {
    setAssets(assets.map(a => a.id === id ? { ...a, status } : a));
  };

  const handleAddPortal = (newPortal: ClientPortal) => {
    setPortals([newPortal, ...portals]);
  };

  const handleUpdatePortal = (updatedPortal: ClientPortal) => {
    setPortals(portals.map(p => p.id === updatedPortal.id ? updatedPortal : p));
  };

  const handleAddInvoice = (newInv: FinancialInvoice) => {
    setInvoices([newInv, ...invoices]);
  };

  const handleUpdateInvoiceStatus = (id: string, status: FinancialInvoice["status"]) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status } : inv));
  };

  // Compute stats to pass into sidebar or header
  const totalContractBudgets = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div id="motionscale-app-root" className="min-h-screen bg-[#070707] text-[#f5f5f5] font-sans antialiased flex flex-col md:flex-row relative">
      
      {/* Decorative luxury ambient glow backdrops */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neutral-900/10 rounded-full blur-[160px] pointer-events-none select-none"></div>
      <div className="absolute bottom-12 left-12 w-[350px] h-[350px] bg-neutral-950/20 rounded-full blur-[120px] pointer-events-none select-none"></div>

      {/* Corporate Left Sidebar Workspace Bounds */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-900/60 flex flex-col justify-between py-6 px-5 relative z-40 shrink-0 md:min-h-screen">
        
        <div className="space-y-8">
          {/* Elite Branding Line */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-white rounded flex items-center justify-center text-black font-semibold">
                <Command className="w-4 h-4 text-black stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-sans font-medium text-white tracking-tight">MotionScale</span>
                <span className="text-[9px] font-mono font-medium text-neutral-500 tracking-[0.12em] block uppercase">Operating OS</span>
              </div>
            </div>

            {/* Mobile menu toggle triggers */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden text-neutral-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <AlignRight className="w-5 h-5 text-neutral-400" />}
            </button>
          </div>

          {/* Navigation Items (Desktop default) */}
          <nav className={`${mobileMenuOpen ? "block" : "hidden"} md:block space-y-1.5 pt-4 md:pt-0`}>
            
            <button
              onClick={() => { setCurrentTab("dashboard"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "dashboard" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Activity className="w-4 h-4 text-neutral-500" />
              <span>COMMAND PANEL</span>
            </button>

            <button
              onClick={() => { setCurrentTab("crm"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "crm" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Users className="w-4 h-4 text-neutral-500" />
              <span>CLIENT PORTALS</span>
            </button>

            <button
              onClick={() => { setCurrentTab("sprints"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "sprints" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>STUDIO PIPELINES</span>
            </button>

            <button
              onClick={() => { setCurrentTab("ledger"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "ledger" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <CreditCard className="w-4 h-4 text-neutral-500" />
              <span>CREATIVE BILLING</span>
            </button>

            <button
              onClick={() => { setCurrentTab("coprocessor"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "coprocessor" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Sparkles className="w-4 h-4 text-neutral-500" />
              <span>AI CO-PROCESSOR</span>
            </button>

            <button
              onClick={() => { setCurrentTab("client"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "client" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <ShieldAlert className="w-4 h-4 text-neutral-500" />
              <span>ASSET ESCROW</span>
            </button>

            <button
              onClick={() => { setCurrentTab("sandbox"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "sandbox" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <ShieldCheck className="w-4 h-4 text-neutral-500" />
              <span>CLIENT SANDBOX</span>
            </button>

            <button
              onClick={() => { setCurrentTab("blueprint"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "blueprint" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Globe className="w-4 h-4 text-neutral-500" />
              <span>STUDIO BLUEPRINT</span>
            </button>

            <button
              onClick={() => { setCurrentTab("devops"); setMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono tracking-wide text-left transition-all duration-200 ${currentTab === "devops" ? "bg-neutral-900 text-white font-semibold shadow-inner border-l-2 border-white" : "text-neutral-400 hover:text-white hover:bg-neutral-900/30"}`}
            >
              <Cpu className="w-4 h-4 text-neutral-500" />
              <span>DEVOPS HUB</span>
            </button>

          </nav>
        </div>

        {/* Footer info: Version control & identity logs */}
        <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block pt-6 border-t border-neutral-900/80 text-[10px] font-mono text-neutral-500 space-y-1.5`}>
          <div className="flex justify-between">
            <span>OPERATIONAL ROLE:</span>
            <span className="text-white">COCKPIT MAIN</span>
          </div>
          <div className="flex justify-between">
            <span>CLIENT CV VALUE:</span>
            <span className="text-white">${(totalContractBudgets / 1000).toFixed(0)}k</span>
          </div>
          <div className="pt-2 text-[9px] text-[#525252] leading-snug">
            MotionScale OS Framework v2.0 • Luxury Zen Editorial Edition
          </div>
        </div>

      </aside>

      {/* Main Command Workspace (Scrollable area) */}
      <main className="flex-1 min-w-0 bg-[#0a0a0a]/40 p-4 md:p-10 z-10 relative overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          
          {/* Dynamically active viewport render */}
          {currentTab === "dashboard" && (
            <ExecutiveDashboard 
              projects={projects}
              assets={assets}
              portals={portals}
              invoices={invoices}
              onNavigateToTab={(tabId) => setCurrentTab(tabId)}
            />
          )}

          {currentTab === "crm" && (
            <CrmModule 
              portals={portals}
              projects={projects}
              onAddPortal={handleAddPortal}
              onUpdatePortal={handleUpdatePortal}
            />
          )}

          {currentTab === "sprints" && (
            <SprintManager 
              projects={projects}
              assets={assets}
              onAddProject={handleAddProject}
              onUpdateProject={handleUpdateProject}
            />
          )}

          {currentTab === "ledger" && (
            <FinancialLedger 
              invoices={invoices}
              projects={projects}
              onAddInvoice={handleAddInvoice}
              onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            />
          )}

          {currentTab === "coprocessor" && (
            <AiCoProcessor 
              projects={projects}
              invoices={invoices}
            />
          )}

          {currentTab === "client" && (
            <ClientPortalComponent 
              assets={assets}
              projects={projects}
              onAddAsset={handleAddAsset}
              onUpdateAssetStatus={handleUpdateAssetStatus}
            />
          )}

          {currentTab === "sandbox" && (
            <ClientSandbox 
              portals={portals}
              projects={projects}
              assets={assets}
              onUpdateProject={handleUpdateProject}
              onUpdateAssetStatus={handleUpdateAssetStatus}
              onUpdatePortal={handleUpdatePortal}
            />
          )}

          {currentTab === "blueprint" && (
            <MarketingBlueprint 
              onAddInvoice={handleAddInvoice}
            />
          )}

          {currentTab === "devops" && (
            <DevOpsHub />
          )}

        </div>
      </main>

    </div>
  );
}
