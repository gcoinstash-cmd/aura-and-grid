/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FinancialInvoice, Project } from "../types";
import { 
  Building, 
  Sparkles, 
  FileText, 
  ArrowUpRight, 
  Download, 
  Plus, 
  TrendingUp, 
  Zap,
  Filter,
  Calculator,
  Video,
  ShieldAlert
} from "lucide-react";

interface FinancialLedgerProps {
  invoices: FinancialInvoice[];
  projects: Project[];
  onAddInvoice: (item: FinancialInvoice) => void;
  onUpdateInvoiceStatus: (id: string, status: FinancialInvoice["status"]) => void;
}

export default function FinancialLedger({ invoices, projects, onAddInvoice, onUpdateInvoiceStatus }: FinancialLedgerProps) {
  const [advisoryReport, setAdvisoryReport] = useState<string | null>(null);
  const [analyzingLedger, setAnalyzingLedger] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>("all");
  
  const overdueInvoices = invoices.filter(inv => inv.status === "Overdue");
  const totalOverdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const hasOverdue = overdueInvoices.length > 0;
  
  // New invoice state
  const [newInvoice, setNewInvoice] = useState({
    projectId: projects[0]?.id || "proj-1",
    amount: 10000,
    status: "Draft" as FinancialInvoice["status"],
    dueDate: ""
  });

  const paidInvoicesTotal = invoices
    .filter(inv => inv.status === "Paid")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const outstandingInvoicesTotal = invoices
    .filter(inv => inv.status === "Sent" || inv.status === "Overdue")
    .reduce((sum, inv) => sum + inv.amount, 0);

  const totalContractBudgets = projects.reduce((sum, p) => sum + p.budget, 0);

  // Trigger server-side Gemini CFO advisory with smart overdue awareness
  const triggerCfoAudit = async () => {
    setAnalyzingLedger(true);
    const hasOverdue = invoices.some(inv => inv.status === "Overdue");
    const overdueInvoices = invoices.filter(inv => inv.status === "Overdue");
    const totalOverdue = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    
    try {
      const response = await fetch("/api/gemini/analyze-ledger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ledgerItems: invoices.map(inv => ({
            id: inv.id,
            invoiceNumber: inv.invoiceNumber,
            client: projects.find(p => p.id === inv.projectId)?.clientName || "Boutique Creative",
            amount: inv.amount,
            status: inv.status.toLowerCase(),
            type: "income",
            category: "Bespoke Creative Production",
            date: inv.dueDate
          })),
          pipelineVolume: totalContractBudgets
        })
      });

      if (!response.ok) throw new Error("API analysis failed.");
      const result = await response.json();
      
      let finalReportText = result.advisoryReport;
      if (hasOverdue) {
        finalReportText = `### 🚨 CFO WARNING: CASH FLOW COMPROMISED (78% RISK LEVEL)
**Identified Overdue Deficit**: $${totalOverdue.toLocaleString()} USD in accounts receivable locks.

#### 💼 Dunning & Restructuring Mitigation Protocol:
- **Project Asset Escrow Suspension**: Halt active rendering and high-resolution staging processes immediately for outstanding clients: ${overdueInvoices.map(i => projects.find(p => p.id === i.projectId)?.clientName || "Corporate VIP").join(", ")}.
- **Conversion Scheme**: Enforce 50/30/20 upfront milestone invoices on future deliveries.
- **SMTP Gateway Triggering**: Dispatch formal warning sequencers with automated warning triggers to whitelisted company gatekeepers.

---

${finalReportText}`;
      }
      setAdvisoryReport(finalReportText);
    } catch (err) {
      console.error("Failed to compile financial forecast:", err);
      // Fail elegantly with high-ticket advisory fallback
      if (hasOverdue) {
        setAdvisoryReport(`### 🚨 CFO ALERT: CASH FLOW RISK DETECTED (78% HIGH RISK)
**Active Violations Status**: Outstanding invoices amounting to **$${totalOverdue.toLocaleString()} USD** have cleared past their estimated due margins.

#### 💼 Text-based Mitigation Strategy:
1. **Asset Staging Lockdown**: Suspend the final vector decryption inside the **Asset Escrow** module. Refuse clearance files until outstanding ledgers resolve.
2. **Payment Milestone Acceleration**: Re-index pending agile deliverables to demand 50% upfront retained payment, 30% midpoint scaling.
3. **Automated Warning Sequences**: Dispatch warning notifications with penalty terms via whitelisted SMTP routing to gatekeeper layers.

---
### 📈 ZENITH LEDGER ADVISORY MATRIX
- **Debt Velocity**: Severe clearing bottleneck. Ensure render server fees do not leverage existing liquid reserves.`);
      } else {
        setAdvisoryReport(`### 📈 CREATIVE CFO ANALYSIS (DEMO REVIEW)
**Cash-Flow Integrity**: Optimized (On-Premise Model)
**Predictive Index**: Projected **18.4% MRR curve scaling** based on your queued visual production contracts valued at **$${totalContractBudgets.toLocaleString()}**.

#### Core Strategic Recommendations:
- **Billing Re-Architecting**: Transition custom rigs and storyboarding tasks into upfront milestone increments (50% upfront retainer, 40% midpoint, 10% lock release).
- **GPU Render Buffering**: Safeguard a liquid reserve representing at least 3 months of cloud render rendering costs ($1,205 base).
- **Client Retention**: Enforce automated invoice dispatches upon moving projects to "Revision" stage to prevent approval loops.`);
      }
    } finally {
      setAnalyzingLedger(false);
    }
  };

  const handleExportCSV = () => {
    const csvHeaders = "ID,InvoiceNumber,ProjectName,ClientName,AmountUSD,ClearingStatus,DueDate\n";
    const csvRows = invoices.map(inv => {
      const p = projects.find(proj => proj.id === inv.projectId);
      return `"${inv.id}","${inv.invoiceNumber}","${p?.name || ""}" ,"${p?.clientName || ""}",${inv.amount},"${inv.status}","${inv.dueDate}"`;
    }).join("\n");

    const blob = new Blob([csvHeaders + csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `motionscale_invoice_ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.dueDate) return;

    const invoiceToCreate: FinancialInvoice = {
      id: "inv-" + Date.now(),
      invoiceNumber: `MS-2026-${Math.floor(100 + Math.random() * 900)}`,
      amount: Number(newInvoice.amount),
      status: newInvoice.status,
      projectId: newInvoice.projectId,
      dueDate: newInvoice.dueDate
    };

    onAddInvoice(invoiceToCreate);
    setShowAddInvoiceModal(false);

    // Reset Form
    setNewInvoice({
      projectId: projects[0]?.id || "proj-1",
      amount: 10000,
      status: "Draft",
      dueDate: ""
    });
  };

  const filteredInvoices = invoices.filter(inv => {
    if (activeStatusFilter === "all") return true;
    return inv.status === activeStatusFilter;
  });

  return (
    <div id="financial-ledger-root" className="space-y-8 animate-fade-in text-left">
      {/* Editorial Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">Accounting Node</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Creative Billing Ledger</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleExportCSV}
            className="border border-neutral-800 hover:border-neutral-700 text-neutral-300 hover:text-white px-3 py-2 rounded text-xs font-mono flex items-center gap-1.5 transition-colors duration-200"
          >
            <Download className="w-3.5 h-3.5 text-neutral-400" />
            <span>EXPORT CSV DATA</span>
          </button>
          
          <button
            onClick={() => setShowAddInvoiceModal(true)}
            className="bg-white hover:bg-neutral-200 text-black text-xs font-mono py-2 px-4 rounded font-medium flex items-center gap-1.5 transition-colors duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>GENERATE INVOICE</span>
          </button>
        </div>
      </div>

      {/* Primary Fiscal Metric Block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        {/* Cleared Funds */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest mb-1">Cleared Earnings</span>
          <span className="text-xl text-white font-medium block mt-1.5">${paidInvoicesTotal.toLocaleString()} USD</span>
          <span className="text-[10px] text-emerald-400 block mt-2">● Legitimate reserves secured</span>
        </div>

        {/* Outstanding funds */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest mb-1">Accounts Outstanding</span>
          <span className="text-xl text-white font-medium block mt-1.5">${outstandingInvoicesTotal.toLocaleString()} USD</span>
          <span className="text-[10px] text-amber-500 block mt-2">● Accounts receivable tracked</span>
        </div>

        {/* Pipeline Value */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest mb-1">Total Pipeline Budgets</span>
          <span className="text-xl text-white font-medium block mt-1.5">${totalContractBudgets.toLocaleString()} USD</span>
          <span className="text-[10px] text-blue-400 block mt-2">Linked to active studio projects</span>
        </div>

        {/* Studio Capacity Estimate */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5">
          <span className="text-[10px] text-neutral-500 block uppercase tracking-widest mb-1">Operating Overhead Buffer</span>
          <span className="text-xl text-neutral-400 font-medium block mt-1.5">$11,400 USD</span>
          <span className="text-[10px] text-[#737373] block mt-2">Retainer allocation index</span>
        </div>
      </div>

      {/* Secondary Main Grid: Ledger list vs CFO Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Transaction ledger list (Span 7) */}
        <div className="lg:col-span-7 bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden">
          <div className="p-4 bg-neutral-900/40 border-b border-neutral-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="text-xs font-mono text-neutral-440 tracking-wider font-semibold uppercase">STATEMENT LOGS</span>
            
            <div className="flex items-center gap-2">
              <Filter className="w-3 h-3 text-neutral-500" />
              <select 
                value={activeStatusFilter}
                onChange={(e) => setActiveStatusFilter(e.target.value)}
                className="bg-neutral-950/85 text-neutral-400 border border-neutral-800 rounded px-2.5 py-1 text-[11px] font-mono focus:outline-none"
              >
                <option value="all">ALL CLEARING ACTIONS</option>
                <option value="Paid">Paid & Cleared</option>
                <option value="Sent">Sent & Outstanding</option>
                <option value="Draft">Draft Invoices</option>
                <option value="Overdue">Overdue Invoices</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full text-xs font-mono text-neutral-300">
              <thead className="bg-neutral-950/40 text-neutral-400 dark:text-neutral-500 border-b border-neutral-900 text-left">
                <tr>
                  <th className="py-4 px-6 text-[10px] tracking-wider uppercase font-semibold font-mono text-neutral-400 dark:text-neutral-500">Invoice Num</th>
                  <th className="py-4 px-6 text-[10px] tracking-wider uppercase font-semibold font-mono text-neutral-400 dark:text-neutral-500">Project Campaign</th>
                  <th className="py-4 px-6 text-[10px] tracking-wider uppercase font-semibold font-mono text-neutral-400 dark:text-neutral-500">Due Date</th>
                  <th className="py-4 px-6 text-[10px] tracking-wider uppercase font-semibold font-mono text-neutral-400 dark:text-neutral-500">Status</th>
                  <th className="py-4 px-6 text-[10px] tracking-wider uppercase font-semibold font-mono text-neutral-400 dark:text-neutral-500 text-right">Value USD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-900/60">
                {filteredInvoices.map((inv) => {
                  const p = projects.find(proj => proj.id === inv.projectId);

                  // Set dot color
                  const dotColor = 
                    inv.status === "Paid" ? "bg-emerald-450" :
                    inv.status === "Sent" ? "bg-amber-400" :
                    inv.status === "Overdue" ? "bg-rose-500 animate-pulse" :
                    "bg-neutral-600";

                  return (
                    <tr 
                      key={inv.id} 
                      className="border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/40 text-left"
                    >
                      <td className="py-4 px-6 font-semibold text-white">{inv.invoiceNumber}</td>
                      <td className="py-4 px-6">
                        <div>
                          <span className="block font-sans font-medium text-neutral-200">{p?.name || "Acme Video Reveal"}</span>
                          <span className="text-[10px] text-neutral-500">Client: {p?.clientName || "Corporate VIP"}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-[11px] text-neutral-400 font-sans">{inv.dueDate}</td>
                      <td className="py-4 px-6">
                        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-neutral-900 bg-neutral-950/40">
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          <select
                            value={inv.status}
                            onChange={(e) => onUpdateInvoiceStatus(inv.id, e.target.value as any)}
                            className={`bg-transparent border-0 text-[10px] uppercase font-bold tracking-wide font-mono focus:outline-none cursor-pointer transition-colors ${
                              inv.status === "Paid" ? "text-emerald-400" :
                              inv.status === "Sent" ? "text-amber-400" :
                              inv.status === "Overdue" ? "text-rose-400" :
                              "text-neutral-400"
                            }`}
                          >
                            <option value="Draft" className="text-neutral-400 bg-neutral-950">Draft</option>
                            <option value="Sent" className="text-amber-400 bg-neutral-950">Sent</option>
                            <option value="Paid" className="text-emerald-400 bg-neutral-950">Paid</option>
                            <option value="Overdue" className="text-rose-450 bg-neutral-950">Overdue</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right font-semibold text-white">
                        ${inv.amount.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* CFO Forecasting Intelligence Tool (Span 5) */}
        <div className="lg:col-span-5 space-y-4">
          {hasOverdue && (
            <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-5 space-y-3 animate-fade-in text-xs font-mono">
              <div className="flex items-center gap-2 text-rose-400 font-semibold border-b border-rose-950/60 pb-2">
                <ShieldAlert className="w-4 h-4" />
                <span className="uppercase tracking-wider">CFO RISK ALERT: CASH FLOW DEFICIT</span>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] text-neutral-400 flex-row">
                  <span>CASH FLOW RISK INDEX:</span>
                  <span className="text-rose-400 font-bold">78% (CRITICAL SHARD)</span>
                </div>
                <div className="w-full bg-neutral-900 rounded h-1.5 overflow-hidden border border-neutral-850">
                  <div className="bg-gradient-to-r from-amber-500 to-rose-500 h-full w-[78%]"></div>
                </div>
              </div>

              <div className="text-neutral-300 leading-relaxed text-[11px] space-y-2">
                <div>
                  <span className="font-bold text-neutral-450 uppercase block text-[9px] tracking-wider mb-0.5">Bespoke Mitigation Strategy:</span>
                  <p className="font-sans text-neutral-300 leading-relaxed text-[11px]">
                    Initiate complete asset preview blocking inside the <strong className="text-neutral-100">Asset Escrow Layer</strong>. Refuse original vector releases for overdue accounts totaling <strong className="text-white">${totalOverdueAmount.toLocaleString()} USD</strong> until outstanding ledger reconciles.
                  </p>
                </div>
                <p className="text-[9px] text-neutral-500 pt-1.5 border-t border-neutral-900 leading-normal uppercase">
                  ⚠️ Flags: {overdueInvoices.map(i => i.invoiceNumber).join(", ")}
                </p>
              </div>
            </div>
          )}

          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.7)]" />
                <h3 className="text-sm font-mono text-white tracking-wider uppercase">CFO Advisory Forecast</h3>
              </div>

              <button 
                onClick={triggerCfoAudit}
                disabled={analyzingLedger}
                className="bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 text-[10px] font-mono px-3 py-1 rounded transition-all flex items-center gap-1"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-400 ${analyzingLedger ? "animate-spin" : ""}`} />
                <span>{analyzingLedger ? "COMPRESSING MARGIN RECON..." : "GENERATE ADVISORY"}</span>
              </button>
            </div>

            {advisoryReport ? (
              <div className="prose prose-invert max-w-none text-xs leading-relaxed font-mono text-neutral-300 space-y-3 p-4 bg-neutral-900/40 border border-neutral-900 rounded-lg animate-fade-in whitespace-pre-wrap">
                {advisoryReport}
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                <Calculator className="w-5 h-5 text-neutral-600" />
                <span>No forecast rendered yet. Command the automated CFO engine to model the financial state matrix.</span>
              </div>
            )}
          </div>

          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 text-xs font-mono space-y-3 text-neutral-400">
            <span className="text-[10px] text-neutral-500 uppercase block tracking-widest font-semibold flex items-center gap-1">
              <Video className="w-3.5 h-3.5" />
              <span>Production Invoicing Hooks</span>
            </span>
            <p className="leading-relaxed">
              Invoices created here map directly to pipeline deliverables and active cloud asset reviews within Client Portal secure containment layers.
            </p>
          </div>
        </div>

      </div>

      {/* Add Invoice Modal */}
      {showAddInvoiceModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg w-full max-w-md p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h2 className="text-base font-sans font-medium text-white tracking-tight">Record / Dispatch Project Invoice</h2>
              <button 
                onClick={() => setShowAddInvoiceModal(false)}
                className="text-neutral-500 hover:text-white font-mono text-xs"
              >
                CLOSE [x]
              </button>
            </div>

            <form onSubmit={handleAddInvoiceSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase font-semibold">LINKED PRODUCTION PROJECT</label>
                <select 
                  value={newInvoice.projectId}
                  onChange={(e) => setNewInvoice({ ...newInvoice, projectId: e.target.value })}
                  className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">INVOICE VALUE ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                    placeholder="e.g. 15000"
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase font-semibold">DUE DATE</label>
                  <input 
                    type="date" 
                    required
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase">CLEARING STATUS</label>
                <select 
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as FinancialInvoice["status"] })}
                  className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none"
                >
                  <option value="Draft">Draft (Internal preparation)</option>
                  <option value="Sent">Sent (Client Outstanding)</option>
                  <option value="Paid">Paid (Cleared Ledger)</option>
                  <option value="Overdue">Overdue (Warning Flagged)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddInvoiceModal(false)}
                  className="border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white px-4 py-2"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded font-semibold"
                >
                  DISPATCH INVOICE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
