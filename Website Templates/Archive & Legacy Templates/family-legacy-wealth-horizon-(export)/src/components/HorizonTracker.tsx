import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Calendar, Plus, Trash2, ArrowUpRight, Copy, Check, FileSpreadsheet } from 'lucide-react';
import { HorizonGoal, GoalCategory } from '../types';

interface HorizonTrackerProps {
  goals: HorizonGoal[];
  onUpdateGoalCurrent: (id: string, amount: number) => void;
  onAddGoal: (goal: Omit<HorizonGoal, 'id'>) => void;
  onDeleteGoal: (id: string) => void;
}

export default function HorizonTracker({
  goals,
  onUpdateGoalCurrent,
  onAddGoal,
  onDeleteGoal,
}: HorizonTrackerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedFormula, setCopiedFormula] = useState<string | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GoalCategory>('legacy_fund');
  const [targetDate, setTargetDate] = useState('2035-12');
  const [targetAmount, setTargetAmount] = useState(100000);
  const [currentAmount, setCurrentAmount] = useState(15000);

  // Notion Formula 2.0 and Sheets Sparkline formulas
  const notionProgressFormula = `let(pct, prop("Current") / prop("Target"), repeat("◆", clamp(round(pct * 10), 0, 10)) + repeat("◇", clamp(10 - round(pct * 10), 0, 10)) + " " + round(clamp(pct * 100, 0, 100)) + "%")`;
  const sheetsProgressFormula = `=SPARKLINE(C2, {"charttype", "bar"; "max", D2; "color1", "#00FFA3"})`;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormula(id);
    setTimeout(() => setCopiedFormula(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddGoal({
      name,
      category,
      targetDate,
      targetAmount: Number(targetAmount),
      currentAmount: Number(currentAmount),
    });
    // Reset form
    setName('');
    setTargetAmount(50000);
    setCurrentAmount(5000);
    setShowAddForm(false);
  };

  const getCategoryColor = (cat: GoalCategory) => {
    switch (cat) {
      case 'education': return 'text-[#2b6cb0] bg-[#3182ce]/10 border-[#3182ce]/20';
      case 'real_estate': return 'text-[#b7791f] bg-[#dd6b20]/10 border-[#dd6b20]/20';
      case 'experiences': return 'text-[#b83280] bg-[#e11d48]/10 border-[#e11d48]/20';
      case 'legacy_fund': return 'text-[#8A9A5B] bg-[#8A9A5B]/10 border-[#8A9A5B]/20';
    }
  };

  return (
    <div id="horizon-tracker-container" className="rounded-2xl border border-[#EBE8E4] bg-white p-8 shadow-sm text-[#2D2D2D]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B]">01 — Shared Horizon Tracker</span>
          <h2 className="text-xl font-light tracking-tight text-[#1A1A1A] mt-1.5">
            Legacy Objectives
          </h2>
          <p className="text-xs text-[#8C8C8C] mt-1 pr-4">
            Long-term family goals, milestone allocations, and structural horizons.
          </p>
        </div>
        <button
          id="btn-add-horizon-goal"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8A9A5B] text-[#8A9A5B] bg-[#8A9A5B]/5 hover:bg-[#8A9A5B]/10 active:scale-98 transition duration-200 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Goal</span>
        </button>
      </div>

      <AnimatePresence mode="popLayout">
        {showAddForm && (
          <motion.form
            id="form-add-horizon-goal"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="mb-8 p-5 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2] grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Goal Name</label>
              <input
                type="text"
                placeholder="e.g. Kids University Endowment or Family Land Hold"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GoalCategory)}
                className="w-full h-[38px] px-4 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs appearance-none"
              >
                <option value="legacy_fund">Generational Fund</option>
                <option value="education">Educational Endowment</option>
                <option value="real_estate">Legacy Real Estate</option>
                <option value="experiences">Shared Landmarks & Travel</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Target Date</label>
              <input
                type="month"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Target Amount ($)</label>
              <input
                type="number"
                min="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Contribution ($)</label>
              <input
                type="number"
                min="0"
                value={currentAmount}
                onChange={(e) => setCurrentAmount(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-1.5 rounded-lg text-[#8C8C8C] hover:text-[#2D2D2D] transition text-xs cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-[#8A9A5B] text-white font-medium hover:bg-[#7a8a4f] transition text-xs cursor-pointer"
              >
                Create Goal
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {goals.map((goal) => {
          const percent = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
          
          return (
            <div
              key={goal.id}
              className="group p-5 rounded-xl border border-[#EBE8E4] bg-[#FDFCFB] hover:bg-white hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-[#F7F5F2] text-[#8C8C8C] group-hover:text-[#8A9A5B] transition-colors">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-medium text-[#2D2D2D]">{goal.name}</h3>
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${getCategoryColor(goal.category)}`}>
                        {goal.category.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-[#8C8C8C] font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#8C8C8C]" />
                        Target: {goal.targetDate}
                      </span>
                      <span>•</span>
                      <span>Target: ${goal.targetAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#1A1A1A]">
                      ${goal.currentAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#8C8C8C] font-mono">
                      Current Holding
                    </div>
                  </div>
                  
                  {/* Quick Add Contribution Buttons */}
                  <div className="flex items-center gap-1 ml-2">
                    <button
                      title="Contribute $1k"
                      onClick={() => onUpdateGoalCurrent(goal.id, 1000)}
                      className="px-2 py-1 bg-white hover:bg-[#8A9A5B]/10 hover:text-[#8A9A5B] border border-[#EBE8E4] rounded text-[10px] font-mono text-[#8C8C8C] transition cursor-pointer"
                    >
                      +$1K
                    </button>
                    <button
                      title="Contribute $5k"
                      onClick={() => onUpdateGoalCurrent(goal.id, 5000)}
                      className="px-2 py-1 bg-white hover:bg-[#8A9A5B]/10 hover:text-[#8A9A5B] border border-[#EBE8E4] rounded text-[10px] font-mono text-[#8C8C8C] transition cursor-pointer"
                    >
                      +$5K
                    </button>
                    <button
                      title="Remove Goal"
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1 px-1.5 text-[#8C8C8C] hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent rounded transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Bar Visualizer */}
              <div className="relative pt-1">
                <div className="flex mb-1.5 items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8C8C8C]">Progression</span>
                  <span className="text-[#8A9A5B] font-semibold">{percent}% Complete</span>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded-full bg-[#F0F0F0]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#8A9A5B] rounded-full"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notion and Sheets Blueprint Formulas Inside this Module */}
      <div className="mt-8 pt-6 border-t border-[#EBE8E4]">
        <div className="flex items-center gap-2 mb-4">
          <FileSpreadsheet className="w-4 h-4 text-[#8A9A5B]" />
          <h4 className="text-xs font-mono tracking-wider uppercase text-[#8C8C8C]">
            Goal Blueprint Integrations
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notion Blueprint Spec */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Notion Progress Bar</span>
              </span>
              <button
                onClick={() => handleCopy(notionProgressFormula, 'notion-goal')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-white transition cursor-pointer"
                title="Copy Formula"
              >
                {copiedFormula === 'notion-goal' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            
            <div className="space-y-1.5 mb-2.5">
              <div className="flex justify-between text-[10px] font-mono border-b border-[#EBE8E4] pb-1">
                <span className="text-[#8C8C8C]">Fields</span>
                <span className="text-right">Name, Target, Current</span>
              </div>
            </div>

            <div className="p-2 bg-white border border-[#EBE8E4] rounded-lg">
              <code className="text-[10px] font-mono text-[#8A9A5B] break-all select-all block h-10 overflow-y-auto pr-1">
                {notionProgressFormula}
              </code>
            </div>
          </div>

          {/* Google Sheets Blueprint Spec */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Sheets Sparkline bar</span>
              </span>
              <button
                onClick={() => handleCopy(sheetsProgressFormula, 'sheets-goal')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-white transition cursor-pointer"
                title="Copy Formula"
              >
                {copiedFormula === 'sheets-goal' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 mb-2.5">
              <div className="flex justify-between text-[10px] font-mono border-b border-[#EBE8E4] pb-1">
                <span className="text-[#8C8C8C]">Usage</span>
                <span className="text-right">A: Goal, C: Current, D: Target</span>
              </div>
            </div>

            <div className="p-2 bg-white border border-[#EBE8E4] rounded-lg">
              <code className="text-[10px] font-mono text-[#8A9A5B] break-all select-all block h-10 overflow-y-auto pr-1">
                {sheetsProgressFormula}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
