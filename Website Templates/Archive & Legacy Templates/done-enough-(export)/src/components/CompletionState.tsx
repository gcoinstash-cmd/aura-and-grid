import React, { useState } from "react";
import { Sparkles, Smile, ShieldCheck, ArrowRight, CheckCircle2, Leaf, Undo2 } from "lucide-react";
import { FocusTask } from "../types";

interface CompletionStateProps {
  task: FocusTask;
  primaryStep: string;
  category: string;
  durationMinutes: number;
  xpAwarded: number;
  totalShipped: number;
  totalXp: number;
  wasDoneEnough: boolean;
  onNextTask: () => void;
  onGoToResetDashboard: () => void;
}

export default function CompletionState({
  task,
  primaryStep,
  category,
  durationMinutes,
  xpAwarded,
  totalShipped,
  totalXp,
  wasDoneEnough,
  onNextTask,
  onGoToResetDashboard,
}: CompletionStateProps) {
  const [reflectionText, setReflectionText] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const PHILOSOPHICAL_NOTES = [
    "Perfectionism is just procrastination holding a high-end handbag. You did the brave thing by stopping.",
    "Shipping is a skill. By releasing this, you cleared mental bandwidth to breathe.",
    "Your worth is not tied to the final 10% of unnecessary polishing. Celebrate the core.",
    "By refusing to overthink, you earned back hours of free time. Spend them without an agenda."
  ];

  // Random philosophical comfort
  const stepLength = primaryStep ? primaryStep.length : 0;
  const quote = PHILOSOPHICAL_NOTES[Math.floor(stepLength % PHILOSOPHICAL_NOTES.length)];

  // Derive the 3 structured calming outputs
  const completedSubSteps = task.subSteps ? task.subSteps.filter((s) => s.completed) : [];
  const incompleteSubSteps = task.subSteps ? task.subSteps.filter((s) => !s.completed) : [];
  const nextMove = incompleteSubSteps.length > 0 ? incompleteSubSteps[0] : null;

  return (
    <div className="w-full max-w-xl mx-auto space-y-8 animate-fade-in py-6">
      
      {/* Visual Seal of Delivery */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 scale-105 animate-pulse">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <div className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
            Session Completed & Sealed
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-100 italic font-light tracking-tight px-4 leading-relaxed">
            "{primaryStep || "MVP Segment"}"
          </h2>
        </div>
      </div>

      {/* REASSURING STRUCTURED 3 CALMING OUTPUTS */}
      <div className="space-y-5">
        
        {/* Output 1: What You Finished (Celebrate the execution) */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900/60">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
              1. What You Finished
            </h4>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-sans text-slate-200 leading-relaxed font-light">
              You showed up and successfully shipped the essential core of: <strong className="font-semibold text-slate-100">"{primaryStep}"</strong>.
            </p>
            
            {completedSubSteps.length > 0 ? (
              <div className="bg-slate-900/35 border border-slate-90/80 p-3 rounded-lg space-y-1.5 mt-2">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block">Completed Milestones:</span>
                <div className="space-y-1.5">
                  {completedSubSteps.map((s) => (
                    <div key={s.id} className="flex items-start gap-2 text-xs text-slate-300 font-sans font-light">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 shrink-0 mt-1.5" />
                      <span>{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-xs italic text-slate-400 pt-0.5">
                You focused deeply, avoided stalling, and laid a strong, functioning starting foundation.
              </p>
            )}
          </div>
        </div>

        {/* Output 2: What Is Good Enough For Now (Normalize stopping) */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900/60">
            <Leaf className="w-4 h-4 text-teal-400 shrink-0" />
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
              2. What is Good Enough For Now
            </h4>
          </div>
          
          <div className="space-y-2.5">
            <p className="text-sm font-sans text-slate-300 leading-relaxed font-light">
              You safely closed the session at your target completion boundary. The remaining details are deferred. Pushing further would represent diminishing returns.
            </p>
            
            <div className="bg-slate-900/30 p-3.5 rounded-xl border border-slate-900/65">
              <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 block mb-1">Your Done Enough Definition:</span>
              <p className="text-xs text-slate-400 leading-relaxed italic font-light font-sans">
                "{task.doneEnoughReason || "An incremental version that delivers immediate utility without edge-case polishing."}"
              </p>
            </div>
            
            <span className="text-[10px] font-mono text-slate-500 block">
              ✓ Protected by Perfectionism Shield • Boundary: {task.doneEnoughMetric ?? 70}% reference standards
            </span>
          </div>
        </div>

        {/* Output 3: Your Next Small Move (Lower future activation friction) */}
        <div className="bg-slate-950 border border-slate-900 rounded-2xl p-5 sm:p-6 space-y-3.5 shadow-xl">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-900/60">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <h4 className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
              3. Your Next Small Move
            </h4>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm font-sans text-slate-350 leading-relaxed font-light">
              When you return to this focus segment, do not worry about a massive laundry list. Your starting block to re-enter is designed to be intentionally light:
            </p>
            
            <div className="bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-800 text-left">
              {nextMove ? (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-amber-500 block font-semibold">Low-Friction Block:</span>
                  <p className="text-xs font-sans text-slate-200 leading-relaxed font-medium">
                    "{nextMove.text}"
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-[9px] font-mono uppercase text-emerald-400 block font-semibold">Mission Completed:</span>
                  <p className="text-xs font-sans text-slate-300 leading-relaxed italic font-light">
                    "Take a deep, full breath. Close your browser tabs, shut the screen, and step away. Today is complete."
                  </p>
                </div>
              )}
            </div>
            
            <p className="text-[10.5px] font-mono text-slate-500">
              Low mental load required—merely 2 minutes of low-barrier activity to re-engage later.
            </p>
          </div>
        </div>

      </div>

      {/* Rewards Row (Quiet metrics presentation) */}
      <div className="flex justify-between items-center text-xs font-mono text-slate-500 bg-slate-900/15 border-y border-slate-900 py-3 px-1 select-none">
        <span>XP gained: <strong className="text-amber-500">+{xpAwarded} XP</strong></span>
        <span>Total: {totalXp} XP</span>
        <span>Completed: {totalShipped} MVPs</span>
      </div>

      {/* Philosophical Note */}
      <blockquote className="bg-slate-900/20 border-l border-slate-800 p-4 rounded-r-xl italic text-xs text-slate-400 font-sans leading-relaxed text-center">
        "{quote}"
      </blockquote>

      {/* Option to capture reflections */}
      <div className="space-y-3 bg-slate-950 p-4 border border-slate-900 rounded-xl text-left">
        <label htmlFor="reflection-textarea" className="block text-xs uppercase font-mono tracking-widest text-slate-500">
          Shame-Free Check-In (Optional)
        </label>
        
        {isSaved ? (
          <p className="text-xs text-emerald-400 font-mono flex items-center justify-center gap-1 animate-fade-in py-1">
            ✓ Reflection captured silently. Releasing mental weight complete.
          </p>
        ) : (
          <div className="space-y-2">
            <textarea
              id="reflection-textarea"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="What feel-good thing will you do today now that you got this finished?"
              className="w-full bg-slate-900/50 border border-slate-800 focus:border-slate-750 text-slate-200 text-xs rounded-lg p-3 outline-none font-sans placeholder:text-slate-600 min-h-[60px] resize-none"
              maxLength={200}
            />
            <div className="flex justify-end">
              <button
                id="save-reflection"
                onClick={() => setIsSaved(true)}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-mono text-[10px] rounded cursor-pointer transition-colors"
              >
                Release Note
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action triggers */}
      <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
        <button
          id="another-dump-btn"
          onClick={onNextTask}
          className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-mono text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-250 cursor-pointer shadow-md"
        >
          <span>Dump Another Chaotic Thought</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>

        <button
          id="view-resets-btn"
          onClick={onGoToResetDashboard}
          className="py-3.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-all duration-250 cursor-pointer"
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span>Verify Reset Board</span>
        </button>
      </div>

    </div>
  );
}
