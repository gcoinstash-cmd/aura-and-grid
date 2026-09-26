/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DailyFocusBlock, PremiumClient } from "../types";
import { 
  Play, 
  CheckCircle, 
  Hourglass, 
  Plus, 
  TrendingUp, 
  Briefcase, 
  FolderLock, 
  Zap, 
  Clock, 
  DollarSign, 
  Award,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommandCenterProps {
  focusBlocks: DailyFocusBlock[];
  clients: PremiumClient[];
  onToggleBlock: (id: string) => void;
  onUpdateBlockTitle: (id: string, newTitle: string) => void;
  onAddBlock: () => void;
  onCreateWealthGoal: () => void;
}

export default function CommandCenter({
  focusBlocks,
  clients,
  onToggleBlock,
  onUpdateBlockTitle,
  onAddBlock,
  onCreateWealthGoal
}: CommandCenterProps) {
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState("");

  // Aggregated quick statistics
  const activeRetainersSum = clients.reduce((acc, c) => acc + c.retainerAmount, 0);
  const onboardingClients = clients.filter(c => c.stage === "Onboarding" || c.stage === "Contract Signed").length;
  const projectDeliveryProgress = focusBlocks.length > 0 
    ? Math.round((focusBlocks.filter(b => b.status === "completed").length / focusBlocks.length) * 100)
    : 0;

  // Active focus block
  const activeFocusBlock = focusBlocks.find(b => b.status === "active");

  const startEditing = (block: DailyFocusBlock) => {
    setEditingBlockId(block.id);
    setTempTitle(block.priorityTitle);
  };

  const saveBlockTitle = (id: string) => {
    if (tempTitle.trim() !== "") {
      onUpdateBlockTitle(id, tempTitle);
    }
    setEditingBlockId(null);
  };

  return (
    <div className="space-y-8" id="command-center-module">
      {/* Editorial Sophisticated Header */}
      <div className="border-b border-[#2A2A2D] pb-6">
        <h1 className="font-display text-3xl font-light tracking-tight text-white md:text-4xl">
          Operational Overview
        </h1>
        <p className="mt-2 text-sm text-gray-400 font-sans max-w-2xl">
          Real-time metrics and daily performance tracking.
        </p>
      </div>

      {/* Grid of Precision Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric Card 1 */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] p-5 rounded-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4AF37]/5 rounded-bl-full group-hover:bg-[#D4AF37]/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Monthly Recurring Revenue (MRR)</span>
            <DollarSign className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-white">
              ${activeRetainersSum.toLocaleString()}
            </span>
            <div className="flex items-center mt-1 text-xs text-emerald-400">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Active Retainers</span>
            </div>
          </div>
        </div>

        {/* Metric Card 2 */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] p-5 rounded-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-16 w-16 bg-white/5 rounded-bl-full group-hover:bg-white/10 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Active High-Ticket Clients</span>
            <Briefcase className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-white">
              {clients.length}
            </span>
            <div className="flex items-center mt-1 text-xs text-amber-400 font-mono">
              <Zap className="h-3 w-3 mr-1" />
              <span>{clients.length} Active Accounts • {onboardingClients} in onboarding</span>
            </div>
          </div>
        </div>

        {/* Metric Card 3 */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] p-5 rounded-lg flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Daily block progression</span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-white">
              {projectDeliveryProgress}% <span className="text-xs font-mono font-normal text-[#D4AF37]">complete</span>
            </span>
            <div className="h-1.5 w-full bg-[#0B0B0C] rounded-full mt-2 overflow-hidden border border-[#2A2A2D]">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-[#D4AF37] rounded-full transition-all duration-500"
                style={{ width: `${projectDeliveryProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2.5 text-[10px] font-mono text-gray-400">
              <span>Today's Routine</span>
              <span>{focusBlocks.filter(b => b.status === "completed").length} of {focusBlocks.length} complete</span>
            </div>
          </div>
        </div>

        {/* Metric Card 4 */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] p-5 rounded-lg flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-gray-400">Enterprise Security Index</span>
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-display font-medium text-[#D4AF37]">
              Secure
            </span>
            <div className="flex items-center mt-1 text-xs text-gray-400">
              <FolderLock className="h-3 w-3 mr-1" />
              <span>System Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Chart showing MRR and strategic velocity */}
      <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 space-y-6" id="mrr-growth-chart">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2A2A2D] pb-4">
          <div>
            <h3 className="text-base font-display font-medium text-white tracking-wide">
              MRR Growth Trajectory
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Acquisition momentum and active portfolio expansion tracking.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Current MRR</span>
              <span className="text-[#D4AF37] font-semibold">${activeRetainersSum.toLocaleString()}</span>
            </div>
            <div className="h-8 w-px bg-[#2A2A2D]" />
            <div className="text-right">
              <span className="text-gray-500 block text-[9px] uppercase tracking-wider">Growth Rate</span>
              <span className="text-emerald-400 font-semibold">+18.4%</span>
            </div>
          </div>
        </div>

        {/* Custom Premium SVG Sparkline */}
        <div className="relative h-28 w-full pt-1 pl-12">
          {/* Y-Axis scale indicators */}
          <div className="absolute left-0 top-0 bottom-0 w-10 flex flex-col justify-between pointer-events-none text-[8px] font-mono text-gray-500/80 pr-1 select-none z-10 text-right">
            <span>$120K</span>
            <span>$80K</span>
            <span>$40K</span>
            <span>$0</span>
          </div>

          {/* Grid lines */}
          <div className="absolute inset-y-0 right-0 left-12 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-[#2A2A2D] w-full h-0" />
            <div className="border-b border-[#2A2A2D] w-full h-0" />
            <div className="border-b border-[#2A2A2D] w-full h-0" />
          </div>

          <svg className="w-full h-full overflow-visible" viewBox="0 0 600 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chart-glow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#A37F1C" />
                <stop offset="50%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#F5D061" />
              </linearGradient>
            </defs>

            {/* Path glow area */}
            <path
              d="M 10,90 L 120,80 L 230,65 L 340,68 L 450,40 L 590,15 L 590,100 L 10,100 Z"
              fill="url(#chart-glow)"
            />

            {/* Smooth sparkline */}
            <path
              d="M 10,90 C 65,85 65,80 120,80 C 175,80 175,65 230,65 C 285,65 285,68 340,68 C 395,68 395,40 450,40 C 520,40 520,15 590,15"
              fill="none"
              stroke="url(#line-gradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Glowing active node end-point */}
            <circle cx="590" cy="15" r="5" className="fill-[#D4AF37]" />
            <circle cx="590" cy="15" r="10" className="fill-transparent stroke-[#D4AF37]/50 stroke-1 animate-ping" />
          </svg>
        </div>

        {/* X-axis custom labels */}
        <div className="flex justify-between text-[8px] sm:text-[10px] font-mono text-gray-500 pt-1 px-1 pl-12">
          <span className="text-left">Q1 Baseline</span>
          <span className="text-center transition-opacity duration-300 opacity-0 sm:opacity-100">H1 Target</span>
          <span className="text-center">Q2 Actual</span>
          <span className="text-center transition-opacity duration-300 opacity-0 md:opacity-100">Q3 Target</span>
          <span className="text-center">Projected Growth</span>
          <span className="text-right text-[#D4AF37] font-medium">Active (${(activeRetainersSum/1000).toFixed(0)}K)</span>
        </div>
      </div>

      {/* Main split dashboard block */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Elite 5-Hour Focus Block (Takes 2 Columns) */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 lg:col-span-2 space-y-6" id="five-hour-block-tracker">
          <div className="flex items-center justify-between border-b border-[#2A2A2D] pb-4">
            <div>
              <h2 className="text-lg font-display font-medium text-white tracking-wide">
                Today's Focus Blocks
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                A 5-hour daily system designed to prioritize high-impact business operations.
              </p>
            </div>
            <button 
              onClick={onAddBlock}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#0B0B0C] hover:bg-black border border-[#2A2A2D] hover:border-[#D4AF37] rounded text-xs text-gray-300 transition-all font-mono"
            >
              + Add Focus Block
            </button>
          </div>

          {/* Core Daily Loop List */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {focusBlocks.map((block, idx) => {
                const isActive = block.status === "active";
                const isCompleted = block.status === "completed";

                return (
                  <motion.div
                    key={block.id}
                    layoutId={`block-${block.id}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isActive 
                      ? { 
                          opacity: 1, 
                          y: 0,
                          scale: [1, 1.008, 1],
                          borderColor: ["#2A2A2D", "#D4AF37", "#2A2A2D"]
                        } 
                      : { 
                          opacity: 1, 
                          y: 0, 
                          scale: 1,
                          borderColor: isCompleted ? "rgba(42, 42, 45, 0.4)" : "#2A2A2D"
                        }
                    }
                    transition={isActive 
                      ? {
                          scale: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                          borderColor: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                          default: { duration: 0.3 }
                        }
                      : { duration: 0.3 }
                    }
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 border ${
                      isActive 
                        ? "bg-[#D4AF37]/5 glow-accent" 
                        : isCompleted 
                        ? "bg-black/20" 
                        : "bg-[#0B0B0C]/40"
                    } rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-[background-color,box-shadow,opacity] hover:bg-[#1f1f22]/50 group`}
                  >
                    <div className="flex items-start gap-4 flex-1">
                      {/* Left Numeric Badge */}
                      <span className={`h-8 w-8 flex-none rounded-full flex items-center justify-center font-mono text-xs border ${
                        isActive 
                          ? "bg-[#D4AF37] text-black border-[#D4AF37]" 
                          : isCompleted 
                          ? "bg-black/40 text-gray-500 border-[#2A2A2D]" 
                          : "bg-[#0B0B0C] text-[#D4AF37] border-[#2A2A2D]"
                      }`}>
                        H{block.hour}
                      </span>

                      {/* Title & Editable Section */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase bg-black px-2 py-0.5 rounded border border-[#2A2A2D] text-[#D4AF37]">
                            {block.category}
                          </span>
                          <span className="text-xs text-gray-500 font-mono">
                            {block.durationMinutes} minutes
                          </span>
                        </div>

                        {editingBlockId === block.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              type="text"
                              value={tempTitle}
                              onChange={(e) => setTempTitle(e.target.value)}
                              className="bg-[#0B0B0C] border border-[#D4AF37] text-white text-sm rounded px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] w-full max-w-sm"
                              autoFocus
                            />
                            <button
                              onClick={() => saveBlockTitle(block.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-xs hover:bg-emerald-500 transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingBlockId(null)}
                              className="px-2 py-1 bg-gray-850 hover:bg-gray-850 text-gray-400 rounded text-xs transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p 
                            className={`text-sm ${
                              isCompleted ? "line-through text-gray-500" : "text-white"
                            } font-medium group-hover:text-amber-100 cursor-pointer flex items-center gap-1`}
                            onClick={() => startEditing(block)}
                            title="Click to edit focus block title"
                          >
                            {block.priorityTitle}
                            <span className="opacity-0 group-hover:opacity-100 text-[10px] text-amber-500 font-mono ml-2">
                              (edit)
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Management Bar */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleBlock(block.id)}
                        className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border transition-all ${
                          isCompleted
                            ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/40 hover:bg-emerald-950/40"
                            : isActive
                            ? "bg-amber-950/40 text-amber-300 border-amber-900/60 hover:bg-amber-900/20"
                            : "bg-[#0B0B0C] text-gray-400 border-[#2A2A2D] hover:text-[#D4AF37] hover:border-[#D4AF37]"
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="h-3.5 w-3.5" />
                            Completed
                          </>
                        ) : isActive ? (
                          <>
                            <Hourglass className="h-3.5 w-3.5 animate-spin" />
                            In Progress
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            Start Block
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Real-time Retainer Ledger & Fast Pipeline Overview (1 Column) */}
        <div className="bg-[#1A1A1C] border border-[#2A2A2D] rounded-lg p-6 space-y-6 flex flex-col justify-between" id="retainer-ledger">
          <div className="space-y-4">
            <div className="border-b border-[#2A2A2D] pb-3">
              <h2 className="text-lg font-display font-medium text-white tracking-wide">
                Active Retainers
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Current client partnerships and contract values.
              </p>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {clients.map(client => (
                <div 
                  key={client.id}
                  className="bg-[#0B0B0C]/60 border border-[#2A2A2D] p-3 rounded-md flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-white truncate max-w-[140px]">
                      {client.companyName || client.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[140px]">
                      {client.name}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end justify-center">
                    <span className="text-xs font-mono font-bold text-[#D4AF37]">
                      ${client.retainerAmount.toLocaleString()}
                    </span>
                    {(() => {
                      let badgeText: string = client.stage;
                      let badgeClass = "text-gray-400 bg-gray-900/40 border border-gray-800/60";
                      
                      if (client.stage === "Active Execution") {
                        badgeText = "Active execution";
                        badgeClass = "text-emerald-400 bg-emerald-950/30 border border-emerald-900/40";
                      } else if (client.stage === "Onboarding") {
                        badgeText = "Onboarding";
                        badgeClass = "text-amber-400 bg-amber-950/30 border border-amber-900/40";
                      } else if (client.stage === "Contract Signed") {
                        badgeText = "Contract signed";
                        badgeClass = "text-blue-400 bg-blue-950/30 border border-blue-900/40";
                      } else if (client.stage === "Account Review") {
                        badgeText = "Account review";
                        badgeClass = "text-purple-400 bg-purple-950/30 border border-purple-900/40";
                      } else if (client.stage === "Proposal Sent") {
                        badgeText = "Proposal sent";
                        badgeClass = "text-sky-400 bg-sky-950/30 border border-sky-900/40";
                      } else if (client.stage === "Inquiry") {
                        badgeText = "Inquiry";
                        badgeClass = "text-zinc-400 bg-zinc-950/30 border border-zinc-900/40";
                      }
                      
                      return (
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border mt-1.5 inline-block ${badgeClass}`}>
                          {badgeText}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#0B0B0C] border border-[#2A2A2D] rounded p-4 text-center space-y-3 mt-4">
            <div className="mx-auto h-8 w-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Award className="h-4 w-4 text-[#D4AF37]" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-medium text-white">Next Generation Security</h4>
              <p className="text-[10px] text-gray-400">
                Synchronize your business entity valuation in the Wealth Hub immediately.
              </p>
            </div>
            <button 
              onClick={onCreateWealthGoal}
              className="w-full py-1.5 bg-[#1A1A1C] hover:bg-[#D4AF37] hover:text-black border border-[#2A2A2D] rounded text-xs font-mono text-gray-300 transition-all"
            >
              Open Wealth Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
