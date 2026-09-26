import React, { useState } from "react";
import { Edit2, Play, Shield, HelpCircle, CheckCircle2 } from "lucide-react";
import { FocusTask } from "../types";

interface NextStepProps {
  task: FocusTask;
  onStartSprint: () => void;
  onEditTask: (updatedPrimary: string) => void;
  onBackToDump: () => void;
}

export default function NextStep({
  task,
  onStartSprint,
  onEditTask,
  onBackToDump,
}: NextStepProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task?.primaryStep || "");
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSave = () => {
    if (editedText.trim()) {
      onEditTask(editedText.trim());
      setIsEditing(false);
    }
  };

  const getEnergyBadgeColor = (level: string) => {
    switch (level) {
      case "Calm":
        return "bg-teal-500/10 text-teal-400 border-teal-500/20";
      case "Steady":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "High":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-fade-in py-6">
      
      {/* Mini top guide */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 border-b border-slate-900 pb-3">
        <span>Mind Extraction Workspace</span>
        <button
          id="back-to-raw"
          onClick={onBackToDump}
          className="hover:text-slate-300 transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <span>← Return to Raw Dump</span>
          <kbd className="hidden sm:inline-block px-1 py-0.5 text-[8px] font-mono text-slate-500 bg-slate-900 border border-slate-800 rounded leading-none">Esc</kbd>
        </button>
      </div>

      {/* Main Single Action Card */}
      <div className="bg-slate-950 border border-slate-900 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden group">
        
        {/* Category & Energy indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-900/40">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-sans font-semibold tracking-wide uppercase bg-slate-900 border border-slate-800 text-slate-300 px-3 py-1 rounded-lg">
              {task?.category || "Task"}
            </span>
            <span className={`text-xs font-sans font-semibold tracking-wide uppercase border px-3 py-1 rounded-lg ${getEnergyBadgeColor(task?.energyLevel || "Steady")}`}>
              {task?.energyLevel || "Steady"} Energy
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-sans font-semibold text-emerald-400 tracking-wide uppercase">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Perfectionism Shield Active</span>
          </div>
        </div>

        {/* Huge, uncluttered single focus statement */}
        <div className="space-y-4">
          <span className="text-xs sm:text-sm uppercase font-sans tracking-wide text-slate-400 block font-semibold leading-relaxed">
            Your Absolute Next Action
          </span>
 
          {isEditing ? (
            <div className="space-y-3">
              <textarea
                id="edit-primary-step-input"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-slate-750 text-slate-100 text-base sm:text-lg p-4 rounded-xl outline-none font-sans min-h-[90px] leading-relaxed font-normal"
                maxLength={160}
              />
              <div className="flex justify-end gap-2">
                <button
                  id="cancel-edit-btn"
                  onClick={() => {
                    setEditedText(task?.primaryStep || "");
                    setIsEditing(false);
                  }}
                  className="px-3 py-1 font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  id="save-edit-btn"
                  onClick={handleSave}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-white text-slate-950 font-mono text-xs font-bold rounded-lg transition-colors cursor-pointer uppercase tracking-wider"
                >
                  Confirm Tweak
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-serif text-slate-100 font-medium leading-relaxed tracking-wide italic">
                  "{task?.primaryStep || ""}"
                </h3>
                <button
                  id="edit-step-toggle"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded hover:bg-slate-900 border border-transparent hover:border-slate-800 text-slate-500 hover:text-slate-300 transition-all shrink-0 mt-1 cursor-pointer"
                  title="Tweak this wording"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
              
              {/* Supportive/reassuring reasoning */}
              {task?.reassuringReason && (
                <p className="text-sm sm:text-base font-sans text-slate-300 font-light leading-relaxed italic pr-2 tracking-wide">
                  {task?.reassuringReason}
                </p>
              )}
            </div>
          )}
        </div>
 
        {/* Micro-Step Pathway Breakdown */}
        {task?.subSteps && task.subSteps.length > 0 && (
          <div className="space-y-4 pt-5 border-t border-slate-900/80">
            <span className="text-xs sm:text-sm uppercase font-sans tracking-wide text-slate-400 block font-semibold">
              Micro-Step Pathway Breakdowns
            </span>
            <div className="space-y-2.5">
              {task.subSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-3.5 bg-slate-900/20 border border-slate-900/60 p-4 rounded-xl">
                  <span className="w-7 h-7 rounded-full bg-slate-950 border border-slate-800 text-slate-300 flex items-center justify-center text-xs font-sans shrink-0 font-bold select-none">
                    0{idx + 1}
                  </span>
                  <span className="text-sm text-slate-200 font-sans tracking-wide leading-relaxed font-semibold">
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
 
        {/* Done Enough Definition */}
        {task?.doneEnoughReason && (
          <div className="bg-slate-900/20 border border-slate-900/50 rounded-xl p-5 space-y-2">
            <span className="text-xs sm:text-sm font-sans text-slate-400 uppercase tracking-wide block font-semibold">
              Boundary Definition (What "Done Enough" Looks Like)
            </span>
            <p className="text-xs sm:text-sm font-sans text-slate-200 leading-relaxed font-light tracking-wide">
              {task.doneEnoughReason}
            </p>
          </div>
        )}
 
        {/* Done Enough Metric slider-like visualization */}
        <div className="space-y-4 pt-5 border-t border-slate-900/80">
          <div className="flex justify-between items-center text-xs sm:text-sm font-mono">
            <span className="text-slate-300 flex items-center gap-1 font-bold tracking-wide">
              "Done Enough" Utility Peak
              <button
                id="toggle-metric-explain"
                onClick={() => setShowExplanation(!showExplanation)}
                className="text-slate-500 hover:text-slate-400 cursor-pointer"
                aria-label="Explain done enough metric"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </span>
            <span className="text-amber-500 font-bold">{task?.doneEnoughMetric ?? 70}% Completeness</span>
          </div>

          <div className="h-2 w-full bg-slate-900/80 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 bottom-0 bg-emerald-500/25 border-r border-emerald-500/40 animate-pulse"
              style={{ width: `${task?.doneEnoughMetric ?? 70}%` }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 bg-rose-500/5"
              style={{ width: `${100 - (task?.doneEnoughMetric ?? 70)}%` }}
            />
          </div>

          <div className="flex justify-between text-[9px] text-slate-600 font-mono">
            <span>Minimum Viable</span>
            <span>Perfectionist Overkill Zone</span>
          </div>

          {showExplanation && (
            <p className="text-[11px] text-slate-400 font-sans leading-relaxed bg-slate-900/40 p-3.5 rounded-lg border border-slate-900 animate-fade-in mb-2">
              Done Enough caps output at <strong>{task?.doneEnoughMetric ?? 70}% reference standards</strong>. Any effort spent pushing beyond this is diminishing returns driven by executive perfectionism. Relinquish the loop and ship the segment.
            </p>
          )}
        </div>

      </div>

      {/* Big Action CTA */}
      <button
        id="initiate-sprint"
        onClick={onStartSprint}
        className="w-full py-4 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-md active:scale-[99%] cursor-pointer"
      >
        <Play className="text-slate-950 fill-slate-950 w-3.5 h-3.5" />
        <span>Immerse Into Finish Mode</span>
      </button>

    </div>
  );
}
