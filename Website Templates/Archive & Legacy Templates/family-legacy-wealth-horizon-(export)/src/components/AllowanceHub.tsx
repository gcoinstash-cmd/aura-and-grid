import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, ShieldCheck, Plus, Trash2, Users, Receipt, Copy, Check, Info } from 'lucide-react';
import { AllowanceChore, ChoreStatus } from '../types';

interface AllowanceHubProps {
  chores: AllowanceChore[];
  onToggleStatus: (id: string, nextStatus: ChoreStatus) => void;
  onAddChore: (chore: Omit<AllowanceChore, 'id'>) => void;
  onDeleteChore: (id: string) => void;
}

export default function AllowanceHub({
  chores,
  onToggleStatus,
  onAddChore,
  onDeleteChore,
}: AllowanceHubProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Form states
  const [task, setTask] = useState('');
  const [value, setValue] = useState(15);
  const [assignedTo, setAssignedTo] = useState('Leo');
  const [category, setCategory] = useState('Learning & Growth');

  const kidsList = ['Leo', 'Sophia', 'Maya'];

  // Calculate totals
  const kidsTotals = kidsList.reduce((acc, kid) => {
    const totalEarned = chores
      .filter((c) => c.assignedTo === kid && c.status === 'approved')
      .reduce((sum, c) => sum + c.value, 0);
    const pendingAmount = chores
      .filter((c) => c.assignedTo === kid && c.status === 'completed')
      .reduce((sum, c) => sum + c.value, 0);

    acc[kid] = { earned: totalEarned, pending: pendingAmount };
    return acc;
  }, {} as Record<string, { earned: number; pending: number }>);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    onAddChore({
      task,
      value: Number(value),
      assignedTo,
      status: 'pending',
      category,
    });
    setTask('');
    setValue(15);
    setShowAddForm(false);
  };

  const getStatusStyle = (status: ChoreStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-[#dd6b20]/10 text-[#b7791f] border-[#dd6b20]/20';
      case 'completed':
        return 'bg-[#3182ce]/10 text-[#2b6cb0] border-[#3182ce]/20';
      case 'approved':
        return 'bg-[#8A9A5B]/10 text-[#8A9A5B] border-[#8A9A5B]/20';
    }
  };

  // Notion formula of filtering and summing tasks matching specific criteria
  const notionRelationMapping = `/* Members DB and Chores/Contributions DB Relation Map */\nRelation property in "Members" pointing to "Chores"\nRollup in "Members":\nRelation: "Chores"\nProperty: "Value"\nCalculate: "Sum"\nFilter status dynamically in Notion 2.0:\nprop("Chores").filter(current.prop("Status") == "Approved").map(current.prop("Value")).sum()`;

  const sheetsRelationMapping = `=SUMIFS(C:C, D:D, "Leo", E:E, "Approved")\n[Where C is Values, D is AssignedTo, E is Status]`;

  return (
    <div id="allowance-hub-container" className="rounded-2xl border border-[#EBE8E4] bg-white p-8 shadow-sm text-[#2D2D2D]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#8A9A5B]">02 — Contribution Ledger</span>
          <h2 className="text-xl font-light tracking-tight text-[#1A1A1A] mt-1.5">
            Allowance Hub
          </h2>
          <p className="text-xs text-[#8C8C8C] mt-1 pr-4">
            Financial lessons linked to high-value household/growth work.
          </p>
        </div>
        <button
          id="btn-add-chore"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#8A9A5B] text-[#8A9A5B] bg-[#8A9A5B]/5 hover:bg-[#8A9A5B]/10 active:scale-98 transition duration-200 text-xs font-semibold uppercase tracking-wider cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Ledger Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {kidsList.map((kid) => (
          <div
            key={kid}
            className="p-4 rounded-xl border border-[#EBE8E4] bg-[#FDFCFB] hover:bg-white hover:shadow-md transition-all duration-300 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#8C8C8C] uppercase tracking-wider">
                <Users className="w-3.5 h-3.5 text-[#8A9A5B]" />
                <span>{kid}</span>
              </div>
              <div className="text-lg font-semibold text-[#1A1A1A] mt-1">
                ${kidsTotals[kid].earned.toFixed(2)}
              </div>
              <div className="text-[9px] text-[#8C8C8C] font-mono uppercase tracking-wide">
                Paid Balance
              </div>
            </div>
            {kidsTotals[kid].pending > 0 && (
              <div className="text-right">
                <span className="text-xs font-bold text-[#2b6cb0] font-mono">
                  +${kidsTotals[kid].pending.toFixed(2)}
                </span>
                <span className="block text-[8px] text-[#8C8C8C] font-mono uppercase tracking-tight">
                  Pending
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="popLayout">
        {showAddForm && (
          <motion.form
            id="form-add-chore"
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="mb-8 p-5 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2] grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Contribution Chore / Task</label>
              <input
                type="text"
                placeholder="e.g. Read 1 Invest book or complete coding lecture"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Assigned To</label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full h-[38px] px-4 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs appearance-none"
              >
                {kidsList.map((kid) => (
                  <option key={kid} value={kid}>{kid}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Value ($)</label>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono text-[#8C8C8C] uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-[38px] px-4 rounded-lg border border-[#EBE8E4] bg-white text-[#2D2D2D] focus:outline-none focus:border-[#8A9A5B] text-xs appearance-none"
              >
                <option value="Learning & Growth">Learning & Growth</option>
                <option value="Family Contribution">Family Contribution</option>
                <option value="Self Discipline">Self Discipline</option>
                <option value="Entrepreneurship">Entrepreneurship</option>
              </select>
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
                Create Task
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#EBE8E4] text-[10px] font-mono text-[#8C8C8C] uppercase text-left">
              <th className="pb-3 pl-2">Task Description</th>
              <th className="pb-3 pr-2 text-center">Assigned</th>
              <th className="pb-3 pr-2 text-center">Value</th>
              <th className="pb-3 pr-2 text-center">Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EBE8E4]/50">
            {chores.map((chore) => (
              <tr key={chore.id} className="group hover:bg-[#FDFCFB] transition-colors duration-150">
                <td className="py-4 pl-2">
                  <div>
                    <span className="text-xs font-semibold text-[#2D2D2D]">{chore.task}</span>
                    <span className="block text-[9px] text-[#8C8C8C] font-mono mt-0.5 uppercase tracking-wide">
                      {chore.category}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <span className="text-xs font-mono font-medium text-[#2D2D2D]">
                    {chore.assignedTo}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span className="text-xs font-semibold text-[#8A9A5B] font-mono">
                    ${chore.value.toFixed(2)}
                  </span>
                </td>
                <td className="py-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-mono border ${getStatusStyle(chore.status)}`}>
                    {chore.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-4 pr-2 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {chore.status === 'pending' && (
                      <button
                        onClick={() => onToggleStatus(chore.id, 'completed')}
                        title="Mark Status Completed"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white hover:bg-[#8A9A5B]/10 hover:text-[#8A9A5B] border border-[#EBE8E4] text-[10px] text-[#8C8C8C] font-mono transition cursor-pointer"
                      >
                        <CheckSquare className="w-3.5 h-3.5" />
                        <span>Done</span>
                      </button>
                    )}

                    {chore.status === 'completed' && (
                      <button
                        onClick={() => onToggleStatus(chore.id, 'approved')}
                        title="Parent Approval & Payout"
                        className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#8A9A5B]/10 hover:bg-[#8A9A5B]/20 text-[#8A9A5B] border border-[#8A9A5B]/20 text-[10px] font-mono transition cursor-pointer"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {chore.status === 'approved' && (
                      <span className="text-[10px] font-mono text-[#8C8C8C] flex items-center gap-1 pr-1.5">
                        <Receipt className="w-3 h-3 text-[#8C8C8C]" />
                        Settled
                      </span>
                    )}

                    <button
                      onClick={() => onDeleteChore(chore.id)}
                      className="p-1 px-1.5 text-gray-400 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/10 border border-transparent rounded transition cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Relations & Modeling Blueprint inside allowance hub */}
      <div className="mt-8 pt-6 border-t border-[#EBE8E4] space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#8A9A5B]" />
          <h4 className="text-xs font-mono tracking-wider uppercase text-[#8C8C8C]">
            Database Rollup Specs
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Notion Properties & Rollup */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Notion Relational Rollup</span>
              </span>
              <button
                onClick={() => handleCopy(notionRelationMapping, 'notion-allowance')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-[#2D2D2D] transition cursor-pointer"
                title="Copy Model Structure"
              >
                {copiedText === 'notion-allowance' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <p className="text-[10px] text-[#8C8C8C] leading-relaxed font-mono whitespace-pre-line h-24 overflow-y-auto bg-white p-2 rounded border border-[#EBE8E4]">
              {notionRelationMapping}
            </p>
          </div>

          {/* Sheets SUMIFS Blueprint */}
          <div className="p-4 rounded-xl border border-[#EBE8E4] bg-[#F7F5F2]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#2D2D2D] font-sans flex items-center gap-1">
                <span>Sheets SUMIFS Rollup</span>
              </span>
              <button
                onClick={() => handleCopy(sheetsRelationMapping, 'sheets-allowance')}
                className="p-1.5 rounded-lg hover:bg-[#EBE8E4] text-[#8C8C8C] hover:text-white transition cursor-pointer"
                title="Copy Formula"
              >
                {copiedText === 'sheets-allowance' ? <Check className="w-3.5 h-3.5 text-[#8A9A5B]" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="space-y-1.5 mb-2.5">
              <div className="flex justify-between text-[10px] font-mono border-b border-[#EBE8E4] pb-1">
                <span className="text-[#8C8C8C]">Rules</span>
                <span className="text-right">Matches member & Approved status</span>
              </div>
            </div>

            <div className="p-2 bg-white border border-[#EBE8E4] rounded-lg">
              <code className="text-[10px] font-mono text-[#8A9A5B] break-all select-all block h-10 overflow-y-auto pr-1">
                {sheetsRelationMapping}
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
