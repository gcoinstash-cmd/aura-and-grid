/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { BusinessValuationMetric, LegacyMilestone, PremiumClient } from "../types";
import { 
  Building2, 
  Coins, 
  Home, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle, 
  Lock, 
  Sliders, 
  Plus, 
  Trash2, 
  User, 
  Calendar,
  Sparkles,
  RefreshCw,
  FolderOpen,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  ArrowDownRight,
  Clock,
  Filter,
  CheckCircle2,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface WealthHubProps {
  clients: PremiumClient[];
  assets: BusinessValuationMetric[];
  milestones: LegacyMilestone[];
  onAddAsset: (asset: BusinessValuationMetric) => void;
  onDeleteAsset: (id: string) => void;
  onAddMilestone: (milestone: LegacyMilestone) => void;
  onToggleMilestone: (id: string) => void;
}

interface TransactionLedgerItem {
  id: string;
  entity: string;
  serviceType: string;
  amount: number;
  invoiceDate: string;
  status: "Paid" | "Processing";
}

export default function WealthHub({
  clients = [],
  assets = [],
  milestones = [],
  onAddAsset,
  onDeleteAsset,
  onAddMilestone,
  onToggleMilestone
}: WealthHubProps) {
  // Asset creation form state
  const [assetName, setAssetName] = useState("");
  const [category, setCategory] = useState<BusinessValuationMetric["category"]>("High-Yield Treasury");
  const [currentValue, setCurrentValue] = useState(1500000);
  const [appreciationRate, setAppreciationRate] = useState(8);
  const [beneficiaryName, setBeneficiaryName] = useState("Holding Trust Co.");
  const [status, setStatus] = useState<BusinessValuationMetric["status"]>("Fully Managed");

  // Milestone creation form state
  const [milestoneTitle, setMilestoneTitle] = useState("");
  const [milestoneCategory, setMilestoneCategory] = useState<LegacyMilestone["category"]>("Succession Planning");
  const [targetDate, setTargetDate] = useState("2027-12-31");
  const [milestoneNotes, setMilestoneNotes] = useState("");

  // Compound future calculations slide state
  const [projectionYears, setProjectionYears] = useState(10);

  // Transaction ledger states & filter
  const [invoiceFilter, setInvoiceFilter] = useState<"all" | "paid" | "processing">("all");
  const [ledgerItems, setLedgerItems] = useState<TransactionLedgerItem[]>([
    { id: "tx-1", entity: "Acme Corporation", serviceType: "Strategy Retainer", amount: 45000, invoiceDate: "2026-06-01", status: "Paid" },
    { id: "tx-2", entity: "Global Tech Solutions", serviceType: "Operations OS", amount: 32500, invoiceDate: "2026-05-25", status: "Paid" },
    { id: "tx-3", entity: "Next Generation Security", serviceType: "Advisory", amount: 25000, invoiceDate: "2026-05-18", status: "Paid" },
    { id: "tx-4", entity: "Acme Corporation", serviceType: "Custom Roadmap Review", amount: 15000, invoiceDate: "2026-06-10", status: "Processing" },
    { id: "tx-5", entity: "Global Tech Solutions", serviceType: "Quarterly Audit", amount: 12500, invoiceDate: "2026-07-01", status: "Processing" }
  ]);

  // Form states to log new invoice
  const [newTxEntity, setNewTxEntity] = useState("");
  const [newTxService, setNewTxService] = useState("Premium Operations Retainer");
  const [newTxAmount, setNewTxAmount] = useState(15000);
  const [newTxDate, setNewTxDate] = useState("2026-06-01");
  const [newTxStatus, setNewTxStatus] = useState<"Paid" | "Processing">("Paid");
  const [isAddingInvoice, setIsAddingInvoice] = useState(false);

  // Derived Financial Metrics
  const totalCurrentValue = useMemo(() => {
    return assets.reduce((sum, item) => sum + item.currentValue, 0);
  }, [assets]);

  const aggregatedARR = useMemo(() => {
    return clients.reduce((sum, client) => sum + client.retainerAmount, 0) * 12;
  }, [clients]);

  const cashReserves = useMemo(() => {
    // Computed from Liquid Operational Reserves or dynamic default
    const operationalReserves = assets
      .filter((a) => a.category === "Liquid Operational Reserves")
      .reduce((sum, a) => sum + a.currentValue, 0);
    return operationalReserves > 0 ? operationalReserves : 400000;
  }, [assets]);

  // Projected growth target derived from weighted model appreciation
  const projectedQ3Growth = useMemo(() => {
    if (assets.length === 0) return 14.5;
    const avgAppreciation = assets.reduce((sum, a) => sum + a.appreciationRate, 0) / assets.length;
    return Number((avgAppreciation * 1.8).toFixed(1));
  }, [assets]);

  // Compound simulation calculations
  const calculateFutureValue = (val: number, rate: number, years: number) => {
    return val * Math.pow(1 + rate / 100, years);
  };

  const totalFutureValueCompounded = useMemo(() => {
    return assets.reduce((sum, item) => {
      return sum + calculateFutureValue(item.currentValue, item.appreciationRate, projectionYears);
    }, 0);
  }, [assets, projectionYears]);

  const totalAppreciationGained = totalFutureValueCompounded - totalCurrentValue;

  // Render SVG points based on compounding slider
  const dynamicChartPoints = useMemo(() => {
    const steps = [0, 0.25, 0.5, 0.75, 1];
    return steps.map((fraction) => {
      const years = projectionYears * fraction;
      const valuationAtYears = assets.reduce((sum, item) => {
        return sum + calculateFutureValue(item.currentValue, item.appreciationRate, years);
      }, 0);
      return {
        label: fraction === 0 ? "Baseline" : `Yr ${Math.round(years)}`,
        value: valuationAtYears,
      };
    });
  }, [assets, projectionYears]);

  const chartSVGConfig = useMemo(() => {
    const minVal = Math.min(...dynamicChartPoints.map(p => p.value)) * 0.95;
    const maxVal = Math.max(...dynamicChartPoints.map(p => p.value)) * 1.05;
    const valRange = maxVal - minVal || 1;

    const points = dynamicChartPoints.map((pt, index) => {
      const x = (index / (dynamicChartPoints.length - 1)) * 500 + 25; // x from 25 to 525 (width 550)
      const y = 95 - ((pt.value - minVal) / valRange) * 75; // y coordinate from 20 to 95 (height 120)
      return { x, y, label: pt.label, value: pt.value };
    });

    const pathD = points.reduce((acc, pt, index) => {
      if (index === 0) return `M ${pt.x} ${pt.y}`;
      return `${acc} L ${pt.x} ${pt.y}`;
    }, "");

    const areaD = `${pathD} L ${points[points.length - 1].x} 115 L ${points[0].x} 115 Z`;

    return { points, pathD, areaD };
  }, [dynamicChartPoints]);

  // Asset category allocation percentages calculation
  const categoryAllocations = useMemo(() => {
    const counts: Record<string, number> = {
      "High-Yield Treasury": 0,
      "Strategic Growth Fund": 0,
      "Real Estate Holdings": 0,
      "Liquid Operational Reserves": 0,
      "Business Equity": 0,
      "Holding Company Reserve": 0,
      "Real Estate Ledger": 0,
      "Liquid Trusts": 0,
    };

    assets.forEach((a) => {
      if (counts[a.category] !== undefined) {
        counts[a.category] += a.currentValue;
      } else {
        counts[a.category] = a.currentValue;
      }
    });

    return Object.entries(counts)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => {
        const ratio = totalCurrentValue > 0 ? (value / totalCurrentValue) * 100 : 0;
        return {
          name,
          value,
          percentage: Number(ratio.toFixed(1)),
        };
      });
  }, [assets, totalCurrentValue]);

  // Filtered transaction items
  const filteredLedger = useMemo(() => {
    return ledgerItems.filter((item) => {
      if (invoiceFilter === "paid") return item.status === "Paid";
      if (invoiceFilter === "processing") return item.status === "Processing";
      return true;
    });
  }, [ledgerItems, invoiceFilter]);

  // Event handlers
  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetName.trim()) return;

    const newAsset: BusinessValuationMetric = {
      id: "as-" + Math.random().toString(36).substr(2, 9),
      assetName,
      category,
      currentValue,
      appreciationRate,
      beneficiaryName: beneficiaryName || "Family Trust",
      status
    };

    onAddAsset(newAsset);

    // Reset fields
    setAssetName("");
    setCurrentValue(50000);
    setAppreciationRate(6);
    setBeneficiaryName("");
  };

  const handleCreateMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!milestoneTitle.trim()) return;

    const newMilestone: LegacyMilestone = {
      id: "mil-" + Math.random().toString(36).substr(2, 9),
      milestoneTitle,
      category: milestoneCategory,
      targetDate,
      status: "Planned",
      notes: milestoneNotes
    };

    onAddMilestone(newMilestone);

    // Reset
    setMilestoneTitle("");
    setMilestoneNotes("");
  };

  const handleRegisterInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const entityName = newTxEntity.trim() || (clients.length > 0 ? clients[0].companyName : "Acme Corporation");
    
    const newItem: TransactionLedgerItem = {
      id: "tx-" + Math.random().toString(36).substr(2, 9),
      entity: entityName,
      serviceType: newTxService,
      amount: newTxAmount,
      invoiceDate: newTxDate,
      status: newTxStatus
    };

    setLedgerItems((prev) => [newItem, ...prev]);
    setIsAddingInvoice(false);
    setNewTxEntity("");
    setNewTxAmount(15000);
  };

  // Icon switcher for asset categories
  const getAssetIcon = (cat: BusinessValuationMetric["category"]) => {
    switch (cat) {
      case "High-Yield Treasury":
        return <Coins className="h-5 w-5 text-[#D4AF37]" />;
      case "Strategic Growth Fund":
        return <TrendingUp className="h-5 w-5 text-amber-500" />;
      case "Real Estate Holdings":
        return <Home className="h-5 w-5 text-amber-300" />;
      case "Liquid Operational Reserves":
        return <Lock className="h-5 w-5 text-emerald-500" />;
      case "Business Equity":
        return <Building2 className="h-5 w-5 text-[#D4AF37]" />;
      case "Holding Company Reserve":
        return <Coins className="h-5 w-5 text-amber-500" />;
      case "Real Estate Ledger":
        return <Home className="h-5 w-5 text-amber-300" />;
      case "Liquid Trusts":
        return <Lock className="h-5 w-5 text-[#D4AF37]" />;
      default:
        return <Building2 className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-8" id="generational-wealth-module">
      
      {/* Editorial Title Block */}
      <div className="border-b border-[#2A2A2D] pb-6">
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#D4AF37] px-2.5 py-1 bg-amber-500/10 rounded border border-[#2A2A2D]">
          Financial operations
        </span>
        <h1 className="mt-4 font-display text-3xl font-light tracking-tight text-white md:text-4xl">
          Wealth Hub
        </h1>
        <p className="mt-2 text-sm text-gray-400 font-sans max-w-2xl">
          Consolidated estate valuations, cash liquidity coordinates, client retainer execution ledgers, and interactive appreciation trajectory analysis.
        </p>
      </div>

      {/* 1. SUMMARY METRICS STRIP (4-Column Layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="wealth-metrics-strip">
        {/* Metric Card 1: Total Account Valuation */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between border-b border-[#2A2A2D]/55 pb-3">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">Total Account Valuation</span>
            <Building2 className="h-4.5 w-4.5 text-[#D4AF37]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-white block">
              ${totalCurrentValue.toLocaleString()}
            </span>
            <span className="text-[10px] text-gray-400 font-sans block mt-1 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-400" /> Dynamic valuation base
            </span>
          </div>
        </div>

        {/* Metric Card 2: Aggregated Annual Run Rate (ARR) & MRR */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between border-b border-[#2A2A2D]/55 pb-3">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">Recurring Revenue (MRR/ARR)</span>
            <Coins className="h-4.5 w-4.5 text-[#D4AF37]" />
          </div>
          <div className="mt-4 space-y-1.5">
            <div className="flex items-baseline justify-between select-none">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Aggregated ARR:</span>
              <span className="text-xl font-display font-semibold text-white tracking-tight">
                ${aggregatedARR.toLocaleString()}
              </span>
            </div>
            <div className="flex items-baseline justify-between border-t border-[#2A2A2D]/40 pt-1.5 select-none">
              <span className="text-[10px] font-mono text-gray-500 uppercase">Current MRR:</span>
              <span className="text-sm font-mono font-bold text-[#D4AF37]">
                ${(aggregatedARR / 12).toLocaleString()}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-sans block pt-1 flex items-center gap-1">
              <Activity className="h-3 w-3 text-[#D4AF37]" /> Premium retainer scale achieved
            </span>
          </div>
        </div>

        {/* Metric Card 3: Cash Reserves */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between border-b border-[#2A2A2D]/55 pb-3">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">Liquid Cash Reserves</span>
            <Lock className="h-4.5 w-4.5 text-emerald-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-white block">
              ${cashReserves.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#D4AF37]/90 font-sans block mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-[#D4AF37]" /> Managed holding allocations
            </span>
          </div>
        </div>

        {/* Metric Card 4: Projected Q3 Growth */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 flex flex-col justify-between hover:border-gray-700 transition-all">
          <div className="flex items-center justify-between border-b border-[#2A2A2D]/55 pb-3">
            <span className="text-[10px] uppercase font-mono text-gray-400 tracking-wider">Projected Q3 Growth</span>
            <ArrowUpRight className="h-4.5 w-4.5 text-[#D4AF37]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-[#D4AF37] block">
              +{projectedQ3Growth}%
            </span>
            <span className="text-[10px] text-emerald-400 font-mono block mt-1 flex items-center gap-1 font-semibold">
              +14.85% expansion target
            </span>
          </div>
        </div>
      </div>

      {/* GRID STRUCTURE: Ledger, Trajectory Charts, Registries & Allocations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPREHENSIVE AREA (8 Columns of Grid) */}
        <div className="lg:col-span-8 space-y-8">

          {/* 4. DYNAMIC TRAJECTORY SVG CHART / INTERACTIVE SIMULATOR */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2D]/55 pb-4 gap-3">
              <div>
                <h3 className="text-base font-display font-medium text-white">
                  Corporate Appreciation Trajectory
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Visualizes dynamic estate compound returns across the allocated calendar years.
                </p>
              </div>

              {/* Slider Controller integrated directly inline */}
              <div className="bg-[#0B0B0C] border border-[#2A2A2D] px-3.5 py-1.5 rounded-md flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] font-mono text-gray-400 whitespace-nowrap">Timeline Horizon:</span>
                <input
                  type="range"
                  min="1"
                  max="40"
                  value={projectionYears}
                  onChange={(e) => setProjectionYears(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#D4AF37] cursor-pointer h-1 bg-[#1A1A1C] rounded-lg border border-[#2A2A2D]"
                />
                <span className="text-[11px] font-mono text-[#D4AF37] font-semibold">{projectionYears}Y</span>
              </div>
            </div>

            {/* Premium Trajectory Display Block */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              
              {/* Dynamic projections value strip */}
              <div className="md:col-span-4 bg-[#0B0B0C]/50 border border-[#2A2A2D] p-4.5 rounded-lg space-y-1.5 relative overflow-hidden text-left h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4AF37]/5 rounded-bl-full" />
                <div>
                  <span className="text-[9px] font-mono uppercase bg-[#1A1A1C] border border-[#2A2A2D] px-2 py-0.5 text-gray-400 rounded">
                    Future Compounded Valuation
                  </span>
                  <div className="text-2xl font-display font-medium text-[#D4AF37] mt-3">
                    ${Math.round(totalFutureValueCompounded).toLocaleString()}
                  </div>
                </div>
                <div className="text-[10px] text-gray-500 font-mono space-y-0.5">
                  <div className="text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{Math.round(totalAppreciationGained / totalCurrentValue * 100 || 0).toFixed(0)}% appreciation growth</span>
                  </div>
                  <div>+${Math.round(totalAppreciationGained).toLocaleString()} net change</div>
                </div>
              </div>

              {/* Dynamic SVG Sparkline Chart */}
              <div className="md:col-span-8 bg-[#0B0B0C]/40 border border-[#2A2A2D] rounded-lg p-4 flex flex-col justify-between h-full min-h-[140px]">
                <div className="w-full">
                  <svg viewBox="0 0 550 120" className="w-full overflow-visible">
                    <defs>
                      <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal helper grid lines */}
                    <line x1="25" y1="20" x2="525" y2="20" stroke="#2A2A2D" strokeDasharray="3 3" />
                    <line x1="25" y1="58" x2="525" y2="58" stroke="#2A2A2D" strokeDasharray="3 3" />
                    <line x1="25" y1="95" x2="525" y2="95" stroke="#2A2A2D" strokeDasharray="3 3" />

                    {/* Glowing gradient Area beneath */}
                    <path d={chartSVGConfig.areaD} fill="url(#chartGlow)" />

                    {/* Chart Line path */}
                    <path
                      d={chartSVGConfig.pathD}
                      fill="none"
                      stroke="#D4AF37"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />

                    {/* Points markers and value anchors */}
                    {chartSVGConfig.points.map((pt, i) => (
                      <g key={i} className="group/dot cursor-pointer">
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r="4"
                          fill="#1A1A1C"
                          stroke="#D4AF37"
                          strokeWidth="2.5"
                          className="transition-all duration-100 group-hover/dot:r-5 group-hover/dot:fill-[#D4AF37]"
                        />
                        {/* Dynamic labels */}
                        <text
                          x={pt.x}
                          y={pt.y - 10}
                          textAnchor="middle"
                          fill="#D4AF37"
                          fontSize="9"
                          fontWeight="bold"
                          className="font-mono"
                        >
                          ${(pt.value / 1000000).toFixed(2)}M
                        </text>
                        {/* Period descriptor */}
                        <text
                          x={pt.x}
                          y="114"
                          textAnchor="middle"
                          fill="#88888b"
                          fontSize="8"
                          className="font-mono"
                        >
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* 2. RETAINER CONTRACTS & TRANSACTION LEDGER */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#2A2A2D]/55 pb-4 gap-4">
              <div>
                <h3 className="text-base font-display font-medium text-white flex items-center gap-2">
                  <FileSpreadsheet className="h-4.5 w-4.5 text-[#D4AF37]" />
                  Retainer Ledger & Contracts
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Chronological log of retainer settlements, custom contract invoice structures, and payment schedules.
                </p>
              </div>

              {/* Filtering Controls */}
              <div className="flex items-center gap-2">
                <div className="flex bg-[#0B0B0C] border border-[#2A2A2D] p-1 rounded-md text-[10px] font-mono">
                  <button
                    onClick={() => setInvoiceFilter("all")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      invoiceFilter === "all" ? "bg-[#1A1A1C] text-[#D4AF37]" : "text-gray-400"
                    }`}
                  >
                    All Invoice Ledger
                  </button>
                  <button
                    onClick={() => setInvoiceFilter("paid")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      invoiceFilter === "paid" ? "bg-[#1A1A1C] text-emerald-400" : "text-gray-400"
                    }`}
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => setInvoiceFilter("processing")}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      invoiceFilter === "processing" ? "bg-[#1A1A1C] text-amber-500" : "text-gray-400"
                    }`}
                  >
                    Processing
                  </button>
                </div>

                <button
                  onClick={() => setIsAddingInvoice(!isAddingInvoice)}
                  className="px-2.5 py-1.5 bg-[#D4AF37] hover:bg-[#b59223] text-black rounded text-[10px] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  {isAddingInvoice ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  Issue Invoice
                </button>
              </div>
            </div>

            {/* Quick Invoice SOW registration */}
            <AnimatePresence>
              {isAddingInvoice && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleRegisterInvoice}
                  className="bg-black/30 border border-[#2A2A2D]/80 p-4.5 rounded-lg space-y-4 font-sans text-left overflow-hidden"
                >
                  <span className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block border-b border-[#2A2A2D] pb-1.5">
                    Register Retainer Contract Invoice Record
                  </span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 block uppercase">Client / Entity</label>
                      <select
                        value={newTxEntity}
                        onChange={(e) => setNewTxEntity(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="">-- Choose Client --</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.companyName}>
                            {c.companyName}
                          </option>
                        ))}
                        <option value="Acme Corporation">Acme Corporation</option>
                        <option value="Global Tech Solutions">Global Tech Solutions</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 block uppercase">Service Type</label>
                      <select
                        value={newTxService}
                        onChange={(e) => setNewTxService(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Premium Operations Retainer">Premium Retainer</option>
                        <option value="Strategic Systems Residency">Systems Build residency</option>
                        <option value="Joint Venture Proposal SOW">JV Platform SOW</option>
                        <option value="Custom Code Infrastructure">Infrastructure Deliverables</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 block uppercase">Retainer Value ($ amount)</label>
                      <input
                        type="number"
                        required
                        value={newTxAmount}
                        onChange={(e) => setNewTxAmount(Number(e.target.value))}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-1.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 block uppercase">Invoice Settlement Date</label>
                      <input
                        type="date"
                        required
                        value={newTxDate}
                        onChange={(e) => setNewTxDate(e.target.value)}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-1.5 text-xs text-white font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-mono text-gray-500 block uppercase">Payment Status</label>
                      <select
                        value={newTxStatus}
                        onChange={(e) => setNewTxStatus(e.target.value as "Paid" | "Processing")}
                        className="w-full bg-[#0B0B0C] border border-[#2A2A2D] rounded p-2 text-xs text-white focus:outline-none"
                      >
                        <option value="Paid">Paid</option>
                        <option value="Processing">Processing</option>
                      </select>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-1.5 px-3 bg-[#D4AF37] hover:bg-yellow-600 text-black rounded text-[11px] font-mono font-bold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Log Ledger Entry
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Enterprise Transaction Data Table */}
            <div className="overflow-x-auto border border-[#2A2A2D] rounded-lg">
              <table className="w-full text-left border-collapse font-sans text-xs">
                <thead>
                  <tr className="border-b border-[#2A2A2D] bg-[#121214]">
                    <th className="p-3 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Entity & Contact</th>
                    <th className="p-3 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Service Type</th>
                    <th className="p-3 text-[10px] uppercase font-mono text-gray-400 tracking-wider text-right">Invoice Amount</th>
                    <th className="p-3 text-[10px] uppercase font-mono text-gray-400 tracking-wider">Invoice Date</th>
                    <th className="p-3 text-[10px] uppercase font-mono text-gray-400 tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A2A2D]">
                  {filteredLedger.map((item) => {
                    const isPaid = item.status === "Paid";
                    return (
                      <tr key={item.id} className="hover:bg-[#151517] transition-all">
                        {/* Entity */}
                        <td className="p-3 font-semibold text-white tracking-wide">
                          {item.entity}
                        </td>
                        {/* Service Type */}
                        <td className="p-3 text-gray-400 font-sans">
                          {item.serviceType}
                        </td>
                        {/* Retainer invoice amount */}
                        <td className="p-3 text-right font-mono font-medium text-white">
                          ${item.amount.toLocaleString()}
                        </td>
                        {/* Invoice Date */}
                        <td className="p-3 font-mono text-gray-400">
                          {item.invoiceDate}
                        </td>
                        {/* Status badge - strict sentence-case matching guidelines */}
                        <td className="p-3 text-center">
                          <span
                            className={`text-[9px] font-mono px-2 py-0.5 rounded border inline-block ${
                              isPaid
                                ? "text-emerald-400 bg-emerald-950/25 border-emerald-900/40"
                                : "text-amber-500 bg-amber-950/15 border-amber-900/40"
                            }`}
                          >
                            {isPaid ? "Paid" : "Processing"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredLedger.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-gray-500 font-mono text-[11px]">
                        No contract receipts tracked matching selected configuration.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ASSET LINE MANAGEMENT */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#2A2A2D]/55 pb-4">
              <div>
                <h2 className="text-base font-display font-medium text-white tracking-wide">
                  Corporate & Estate Assets Registry
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Valuations and asset registries earmarked for generational estate protection.
                </p>
              </div>

              {/* Aggregated Quick Total */}
              <div className="text-right">
                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-widest block">Valuation Net Asset Base</span>
                <span className="text-xl font-display font-medium text-[#D4AF37]">
                  ${totalCurrentValue.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Asset Ledger list */}
            <div className="space-y-3.5 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              <AnimatePresence initial={false}>
                {assets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layoutId={`asset-${asset.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 bg-[#0B0B0C]/40 border border-[#2A2A2D] hover:border-gray-700/80 rounded-lg flex items-center justify-between gap-4 transition-all group"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="h-10 w-10 border border-[#2A2A2D] rounded-lg flex items-center justify-center bg-black">
                        {getAssetIcon(asset.category)}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-display font-semibold text-white">
                            {asset.assetName}
                          </h4>
                          <span className="text-[9px] font-mono bg-black px-2 py-0.5 border border-[#2A2A2D] rounded text-gray-400 font-semibold uppercase">
                            {asset.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-550 font-sans mt-0.5 flex items-center gap-1.5">
                          <User className="h-3 w-3 text-[#D4AF37]" /> Beneficiary: <span className="text-gray-300 font-medium">{asset.beneficiaryName}</span>
                          &bull; Status: <span className="text-amber-500 font-mono text-[9px]">{asset.status}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-white block">
                          ${asset.currentValue.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono block mt-0.5 font-bold">
                          +{asset.appreciationRate}% appreciation
                        </span>
                      </div>
                      
                      <button
                        onClick={() => onDeleteAsset(asset.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-400 bg-black/40 hover:bg-black rounded border border-[#2A2A2D] transition-all cursor-pointer"
                        title="Dismantle asset record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {assets.length === 0 && (
                <div className="text-center py-10 bg-black/15 border border-[#2A2A2D] border-dashed rounded text-gray-500">
                  <FolderOpen className="h-8 w-8 mx-auto text-gray-600 mb-2" />
                  <p className="text-xs font-mono">No wealth assets actively registered in your ledger.</p>
                </div>
              )}
            </div>

            {/* Quick Add Asset Form */}
            <form onSubmit={handleCreateAsset} className="bg-black/30 border border-[#2A2A2D] p-4.5 rounded-lg space-y-4 font-sans text-left">
              <span className="text-[10px] font-mono tracking-widest uppercase text-gray-400 block border-b border-[#2A2A2D] pb-1.5 font-bold mb-2">
                Register New Asset Valuation Line
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Asset Line Title (e.g. Acme Hold)"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  className="bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as BusinessValuationMetric["category"])}
                  className="bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                >
                  <option value="High-Yield Treasury">High-Yield Treasury</option>
                  <option value="Strategic Growth Fund">Strategic Growth Fund</option>
                  <option value="Real Estate Holdings">Real Estate Holdings</option>
                  <option value="Liquid Operational Reserves">Liquid Operational Reserves</option>
                  <option value="Business Equity">Business Equity</option>
                  <option value="Holding Company Reserve">Holding Co Reserves</option>
                  <option value="Real Estate Ledger">Real Estate Ledger</option>
                  <option value="Liquid Trusts">Liquid Trusts</option>
                </select>
                <input
                  type="number"
                  required
                  placeholder="Valuation baseline amount"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(Number(e.target.value))}
                  className="bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500">Projected APY Rate (% value)</label>
                  <input
                    type="number"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(Number(e.target.value))}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-1.5 focus:outline-none cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-gray-500">Estate Beneficiary Trustee</label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Trust Co"
                    value={beneficiaryName}
                    onChange={(e) => setBeneficiaryName(e.target.value)}
                    className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-1.5 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-1.5 px-3 bg-[#D4AF37] hover:bg-yellow-600 text-black rounded text-xs tracking-wider font-display font-medium flex items-center justify-center gap-1 cursor-pointer uppercase"
                  >
                    <Plus className="h-3 w-3" />
                    Register asset line
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* RIGHT AREA (4 Columns of Grid) */}
        <div className="lg:col-span-4 space-y-6">

          {/* 3. MODULAR ALLOCATION CARDS AREA */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 space-y-6">
            <div className="border-b border-[#2A2A2D]/55 pb-3">
              <h3 className="font-display text-sm font-medium text-white tracking-widest uppercase">
                Asset Allocation Distributions
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                Asset distributions and ratios split dynamically based on registered valuations.
              </p>
            </div>

            {/* Asset Allocations charts strip */}
            <div className="space-y-4">
              {categoryAllocations.map((alloc) => (
                <div key={alloc.name} className="space-y-1 text-left">
                  <div className="flex items-center justify-between text-[11px] font-sans">
                    <span className="text-gray-300 font-medium">{alloc.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-gray-400 font-semibold">${alloc.value.toLocaleString()}</span>
                      <span className="text-[#D4AF37] font-mono text-[10px] font-bold">({alloc.percentage}%)</span>
                    </div>
                  </div>
                  
                  {/* Luxury themed progress blocks */}
                  <div className="h-1.5 w-full bg-[#0B0B0C] rounded-full overflow-hidden border border-[#2a2a2d]/45">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${alloc.percentage}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full bg-linear-to-r from-amber-500 to-[#D4AF37] rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#0B0B0C] border border-[#2A2A2D] rounded p-3 text-center">
              <span className="text-[10px] font-mono text-gray-400 block tracking-wider uppercase">Retainer Liquidity Balance:</span>
              <span className="text-base font-mono font-bold text-emerald-400 block mt-1">
                92.5% Treasury Cap Secure
              </span>
            </div>
          </div>

          {/* WEALTH MILESTONES WORKSPACE */}
          <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-5 space-y-6">
            <div className="border-b border-[#2A2A2D]/55 pb-3">
              <h3 className="font-display text-sm font-medium text-white tracking-widest uppercase">
                Wealth Milestones
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">
                Secure corporate trust milestones, holding accounts, and family succession programs.
              </p>
            </div>

            {/* Milestones list */}
            <div className="space-y-4 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
              {milestones.map((mil) => {
                const isCompleted = mil.status === "Protected";
                return (
                  <div
                    key={mil.id}
                    onClick={() => onToggleMilestone(mil.id)}
                    className="p-3 bg-black/35 hover:bg-black/60 border border-[#2A2A2D] hover:border-gray-600 rounded-md flex items-start gap-3 transition-colors cursor-pointer group"
                  >
                    <button className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-[#D4AF37]" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-gray-600 group-hover:border-[#D4AF37]" />
                      )}
                    </button>

                    <div className="text-left space-y-1">
                      <h4 className={`text-xs font-semibold ${isCompleted ? "line-through text-gray-550" : "text-white"}`}>
                        {mil.milestoneTitle}
                      </h4>
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-tight flex items-center gap-1.5">
                        <Calendar className="h-2.5 w-2.5 text-gray-650" /> Target: {mil.targetDate}
                      </p>
                      {mil.notes && (
                        <p className="text-[10px] text-gray-450 italic mt-1 font-sans leading-relaxed">
                          &ldquo;{mil.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Add Succession Milestone Form */}
            <form onSubmit={handleCreateMilestone} className="border-t border-[#2A2A2D] pt-4 space-y-3 font-sans text-left">
              <span className="text-[10px] font-mono text-gray-400 tracking-wider block font-semibold mb-1">Add Milestone Action Step</span>
              <input
                type="text"
                required
                placeholder="Milestone Action Title"
                value={milestoneTitle}
                onChange={(e) => setMilestoneTitle(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
              />
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={milestoneCategory}
                  onChange={(e) => setMilestoneCategory(e.target.value as LegacyMilestone["category"])}
                  className="bg-[#0B0B0C] border border-[#2A2A2D] text-[10px] text-white rounded p-1.5 focus:outline-none"
                >
                  <option value="Trust Setup">Trust Setup</option>
                  <option value="Succession Planning">Succession Plan</option>
                  <option value="Asset Protection">Asset Protection</option>
                  <option value="Generational Education">Legacy Ed</option>
                </select>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="bg-[#0B0B0C] border border-[#2A2A2D] text-[10px] text-white rounded p-1.5 focus:outline-none font-mono"
                />
              </div>
              <input
                type="text"
                placeholder="Supporting notes..."
                value={milestoneNotes}
                onChange={(e) => setMilestoneNotes(e.target.value)}
                className="w-full bg-[#0B0B0C] border border-[#2A2A2D] text-xs text-white rounded p-2 focus:outline-none focus:border-[#D4AF37]"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-[#0B0B0C] hover:bg-black hover:text-[#D4AF37] border border-[#2A2A2D] rounded text-xs font-mono text-gray-300 transition-colors cursor-pointer"
              >
                Register Milestone
              </button>
            </form>
          </div>

          <div className="bg-[#0B0B0C] border border-[#2A2A2D] rounded-lg p-5 text-center space-y-4">
            <div className="h-10 w-10 bg-[#D4AF37]/15 rounded-full flex items-center justify-center mx-auto border border-[#D4AF37]/35">
              <ShieldAlert className="h-5 w-5 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-display font-medium text-white uppercase tracking-wider">
                Asset Protection Protocols
              </h4>
              <p className="text-[10px] text-gray-450 font-sans leading-relaxed">
                Accounts managed using Legacy OS automatically inherit estate protection, high-end business valuation audits, and secure legal trust templates.
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
