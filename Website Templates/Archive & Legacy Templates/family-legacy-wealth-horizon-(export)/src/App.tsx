import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, HelpCircle, BookOpen, Compass, FileSpreadsheet, Layers, Info } from 'lucide-react';
import { HorizonGoal, AllowanceChore, ChoreStatus } from './types';
import HorizonTracker from './components/HorizonTracker';
import AllowanceHub from './components/AllowanceHub';
import WealthBlueprint from './components/WealthBlueprint';
import NotionSheetsBlueprint from './components/NotionSheetsBlueprint';

// Seed Initial Premium Demo Data
const initialGoals: HorizonGoal[] = [
  {
    id: 'goal-1',
    name: 'Sophia & Leo Higher Education Fund',
    category: 'education',
    targetDate: '2032-09',
    targetAmount: 150000,
    currentAmount: 48000,
  },
  {
    id: 'goal-2',
    name: 'Pacific Coast Multi-Generational Holding Cabin',
    category: 'real_estate',
    targetDate: '2038-06',
    targetAmount: 380000,
    currentAmount: 112000,
  },
  {
    id: 'goal-3',
    name: 'Family Micro-Venture Seed Incubator Fund',
    category: 'legacy_fund',
    targetDate: '2045-12',
    targetAmount: 250000,
    currentAmount: 35000,
  },
];

const initialChores: AllowanceChore[] = [
  {
    id: 'chore-1',
    task: 'Read "The Richest Man in Babylon" & present 3 major tenets',
    value: 45.0,
    assignedTo: 'Sophia',
    status: 'approved',
    category: 'Learning & Growth',
  },
  {
    id: 'chore-2',
    task: 'Aggregate and cross-examine family utility bill trends for Q1',
    value: 20.0,
    assignedTo: 'Leo',
    status: 'completed',
    category: 'Entrepreneurship',
  },
  {
    id: 'chore-3',
    task: 'Audit household recycling sorting accuracy & suggest 3 system tweaks',
    value: 15.0,
    assignedTo: 'Maya',
    status: 'pending',
    category: 'Family Contribution',
  },
  {
    id: 'chore-4',
    task: 'Complete Introduction to Microeconomics 10-module study course',
    value: 60.0,
    assignedTo: 'Leo',
    status: 'approved',
    category: 'Learning & Growth',
  },
  {
    id: 'chore-5',
    task: 'Prepare weekly presentation mapping compound interest charts',
    value: 20.0,
    assignedTo: 'Sophia',
    status: 'completed',
    category: 'Learning & Growth',
  },
];

export default function App() {
  const [goals, setGoals] = useState<HorizonGoal[]>(initialGoals);
  const [chores, setChores] = useState<AllowanceChore[]>(initialChores);

  // Goal State Updaters
  const handleUpdateGoalCurrent = (id: string, increment: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const updated = g.currentAmount + increment;
          return { ...g, currentAmount: Math.min(updated, g.targetAmount) };
        }
        return g;
      })
    );
  };

  const handleAddGoal = (newGoal: Omit<HorizonGoal, 'id'>) => {
    const id = `goal-${Date.now()}`;
    setGoals((prev) => [...prev, { ...newGoal, id }]);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Allowance/Chore State Updaters
  const handleToggleChoreStatus = (id: string, nextStatus: ChoreStatus) => {
    setChores((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const handleAddChore = (newChore: Omit<AllowanceChore, 'id'>) => {
    const id = `chore-${Date.now()}`;
    setChores((prev) => [...prev, { ...newChore, id }]);
  };

  const handleDeleteChore = (id: string) => {
    setChores((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#2D2D2D] selection:bg-[#8A9A5B]/20 selection:text-[#2D2D2D] antialiased font-sans relative overflow-x-hidden">
      {/* Soft Ambient Background Elements */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8A9A5B]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12 md:py-16 relative">
        {/* Navigation & Brand Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 border-b border-[#EBE8E4] pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded bg-[#8A9A5B]/10 text-[#8A9A5B] text-[10px] font-mono font-semibold uppercase tracking-wider">
                Horizon Spec
              </span>
              <span className="h-4 w-px bg-[#EBE8E4]" />
              <div className="flex items-center gap-1 text-[10px] font-mono text-[#8C8C8C]">
                <Sparkles className="w-3.5 h-3.5 text-[#8A9A5B]" />
                <span>Zen Minimalist Alignment</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-light tracking-tight text-[#1A1A1A] mt-2">
              Wealth Horizon
            </h1>
            <p className="text-xs text-[#8C8C8C] mt-1 uppercase tracking-widest font-medium">
              The Family Legacy Dashboard
            </p>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto text-right md:-mb-1">
            <div className="text-right">
              <p className="text-xs text-[#8C8C8C] uppercase tracking-widest mb-0.5">Current Date</p>
              <p className="text-md font-light">May 20, 2026</p>
            </div>
          </div>
        </header>

        {/* Core Educational Introduction Hero Banner */}
        <section className="mb-12 p-8 rounded-2xl border border-[#EBE8E4] bg-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7F5F2] rounded-full blur-2xl pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-mono text-[#8A9A5B] uppercase tracking-widest block mb-1">
                Philosophical Core
              </span>
              <h2 className="text-xl md:text-2xl font-light text-[#1A1A1A] tracking-tight">
                Aligning Multi-generational Focus with Modern Workflows
              </h2>
              <p className="text-xs text-brand-muted leading-relaxed mt-2 text-[#8C8C8C]">
                This workbench serves as a functional visual engine and a detailed schema planner. Parents assign high-value educational contribution tasks, kids log completions to generate a ledger-allocated allowance, and the entire unit visualizes how those combined cash streams compound over generational time curves.
              </p>
            </div>
            
            <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2] grid grid-cols-3 gap-3 font-mono text-center">
              <div className="p-2">
                <span className="block text-[10px] text-[#8C8C8C] uppercase">Tracked Goals</span>
                <span className="block text-base font-semibold text-[#1A1A1A] mt-1">{goals.length}</span>
              </div>
              <div className="p-2 border-x border-[#EBE8E4]">
                <span className="block text-[10px] text-[#8C8C8C] uppercase">Ledger Tasks</span>
                <span className="block text-base font-semibold text-[#8A9A5B] mt-1">{chores.length}</span>
              </div>
              <div className="p-2">
                <span className="block text-[10px] text-[#8C8C8C] uppercase">Active Kids</span>
                <span className="block text-base font-semibold text-[#1A1A1A] mt-1">3</span>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid layout combining tools */}
        <div className="space-y-12">
          
          {/* Section 1: Goals and Chores Side-by-Side or Stacked */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <HorizonTracker
              goals={goals}
              onUpdateGoalCurrent={handleUpdateGoalCurrent}
              onAddGoal={handleAddGoal}
              onDeleteGoal={handleDeleteGoal}
            />

            <AllowanceHub
              chores={chores}
              onToggleStatus={handleToggleChoreStatus}
              onAddChore={handleAddChore}
              onDeleteChore={handleDeleteChore}
            />
          </div>

          {/* Section 2: Wealth Blueprint Calculator and Charts */}
          <WealthBlueprint />

          {/* Section 3: Interactive Notion and Sheet Blueprints */}
          <NotionSheetsBlueprint />

        </div>

        {/* Compact, Clean Footer - No telemetry larping */}
        <footer className="mt-20 pt-8 border-t border-[#EBE8E4] flex flex-col sm:flex-row justify-between items-center text-xs text-[#8C8C8C] font-mono gap-4">
          <div>
            <span>Family Legacy Wealth Horizon Dashboard</span>
          </div>
          <div className="flex gap-4">
            <span>Designed for parents & children</span>
            <span>•</span>
            <span>Zen Architect v1.0.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
