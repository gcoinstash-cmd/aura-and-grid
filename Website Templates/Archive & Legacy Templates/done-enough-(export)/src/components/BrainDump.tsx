import React, { useState, useEffect } from "react";
import { Mic, RefreshCw, PenTool, Sparkles, BookOpen, Laptop, FileText, CheckCircle2, Shield, Heart } from "lucide-react";
import { FocusTask } from "../types";
import { analyzeBrainDump } from "../data/mockSuggestions";

interface BrainDumpProps {
  onAnalyze: (task: FocusTask) => void;
  userName: string;
  initialText?: string;
}

export default function BrainDump({ onAnalyze, userName, initialText = "" }: BrainDumpProps) {
  const [text, setText] = useState(initialText);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulated ADHD brain dumps to tap into immediately for fast user-time-to-value
  const PRESETS = [
    {
      label: "💼 Tech/Code Task",
      text: "so I need to build this mockup interface, optimize the tailwind layouts, write static props, then make sure it compiles clean, but I keep refactoring the margins because they don't feel beautifully aligned and I'm totally stuck in CSS sandbox mode"
    },
    {
      label: "🌿 Unclutter Desk",
      text: "my work table has accumulated coffee cups, scattered receipts, random notes on stickies, and I want to organize the shelves, clean the laptop keyboard, wipe everything down, but looking at it just makes me want to close my eyes"
    },
    {
      label: "📊 Admin / Tax Anxiety",
      text: "it's time to gather invoices for that one contractor, check bank summaries, find the missing digital PDF receipt from April, verify Excel totals to see if they're standard and clean, but there's forty different logins"
    },
    {
      label: "📝 Essay / Studying",
      text: "I have to read chapters 4 and 5 of this neurology textbook, memorize the glossary terms, complete the practice worksheet questions, and write a thesis paragraph outline but I keep checking clinical case studies instead"
    }
  ];

  const SPARK_PROMPTS = [
    {
      question: "“What is the single project making you feel heavy right now?”",
      prefix: "Right now, the single project that is feeling incredibly heavy to start or finish is "
    },
    {
      question: "“If you could only ship one line of code today, what is it?”",
      prefix: "If I could only ship one single line of code or absolute MVP piece today, it would be "
    },
    {
      question: "“What task are you polishing that is already working?”",
      prefix: "I am currently overthinking and polishing a task that is honestly already fully functional: "
    }
  ];

  const CHIPS = [
    {
      id: "client-work",
      label: "Client Work",
      prompt: "I need to respond to the client's design review, but I'm getting completely anxious that their comments will reopen older decisions and derail our timeline..."
    },
    {
      id: "launch-anxiety",
      label: "Launch Anxiety",
      prompt: "I am ready to release this update, but I keep stalling by introducing minor code tweaks, trying to make it perfect before anyone sees it..."
    },
    {
      id: "over-editing",
      label: "Over-Editing",
      prompt: "I have been editing the absolute same paragraph for two hours, shifting words around and obsessing over minor layout details instead of finishing the actual build..."
    },
    {
      id: "inbox-avoidance",
      label: "Inbox Avoidance",
      prompt: "I am actively avoiding my email inbox because there are too many unanswered notifications, making me freeze up and work on low-priority distractions..."
    }
  ];

  const [currentSparkIndex, setCurrentSparkIndex] = useState(0);

  // Voice recording simulation effect
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTimer((prev) => {
          if (prev >= 6) {
            setIsRecording(false);
            // Insert chaotic simulated voice text
            setText("um... so I really need to finally write that product launch newsletter draft but I'm overthinking the greeting, then I need to find the graphics assets from our shared storage and double check if they have the proper brand colors so it's all aligned...");
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordingTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSimulateVoice = () => {
    setIsRecording(true);
    setText("");
  };

  const handleAnalyzeClick = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    
    // Determine dynamic API URL endpoint
    let apiUrl = "/api/analyze";
    const isProd = (import.meta as any).env?.PROD || (typeof process !== "undefined" && process?.env?.NODE_ENV === "production");
    if (isProd) {
      if (typeof window !== "undefined") {
        apiUrl = `${window.location.origin}/api/analyze`;
      }
    } else {
      apiUrl = "http://localhost:3000/api/analyze";
    }
    
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // If server signals that the Gemini API Key is missing, seamlessly fall back to local heuristics engine.
      if (data.useLocalHeuristics) {
        console.info("[Done Enough Client] Server signaled missing Gemini Key. Seamlessly utilizing local heuristic engine.");
        const offlineTask = analyzeBrainDump(text);
        onAnalyze(offlineTask);
        return;
      }
      
      // Enforce robust client-side slices to keep 3 to 5 tasks
      const slicedSteps = (data.subSteps || []).slice(0, 5);
      if (slicedSteps.length < 3) {
        while (slicedSteps.length < 3) {
          slicedSteps.push("Take a brief 30-second breath break to stabilize focus");
        }
      }

      const formattedTask: FocusTask = {
        id: `task_${Date.now()}`,
        sourceText: text,
        primaryStep: data.primaryStep || "Standard Next Step",
        reassuringReason: data.reassuringReason || "Starting now is the ultimate cure for overthinking.",
        subSteps: slicedSteps.map((stepText: string, idx: number) => ({
          id: `sub_${idx}_${Date.now()}`,
          text: stepText,
          completed: false,
        })),
        energyLevel: data.energyLevel as "Calm" | "Steady" | "High" || "Steady",
        doneEnoughMetric: Number(data.doneEnoughMetric) || 75,
        doneEnoughReason: data.doneEnoughReason || "You have achieved a solid foundation.",
        category: data.category as any || "Work",
      };
      
      onAnalyze(formattedTask);
    } catch (e) {
      console.warn("Could not query Gemini API, using premium offline resilience fallback:", e);
      // Resilience fallback: offline analyzer parsing context clues locally
      const offlineTask = analyzeBrainDump(text);
      onAnalyze(offlineTask);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Listen for 'Cmd + Enter' or 'Ctrl + Enter' to instantly trigger the "Initiate Flow Space" action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        if (text.trim() && !isRecording && !isAnalyzing) {
          e.preventDefault();
          handleAnalyzeClick();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [text, isRecording, isAnalyzing]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-fade-in py-4 pb-24 sm:pb-6">
      
      {/* Intro Header */}
      <div className="space-y-4">
        <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold font-serif text-slate-100 italic tracking-tight leading-[1.1] select-none">
          How is your mind structured, <span className="text-slate-300 font-extrabold not-italic">{userName}</span>?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-slate-300 font-sans max-w-2xl leading-relaxed tracking-wide font-light">
          Empty everything here. The perfectionist edits, the chaotic tangents, the fears of doing it wrong. Don't worry about punctuation, structure, or logic. Let it be beautifully messy.
        </p>
      </div>

      {/* Main Input Box */}
      <div className="relative bg-slate-950 border border-slate-900 rounded-2xl p-5 sm:p-7 shadow-inner focus-within:border-slate-800 transition-all duration-300">
        
        {/* Simulate Voice overlay */}
        {isRecording && (
          <div className="absolute inset-0 bg-slate-950/95 rounded-2xl z-20 flex flex-col items-center justify-center space-y-4">
            <div className="flex gap-1.5 items-center justify-center">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((bar) => (
                <span
                  key={bar}
                  className="w-1.5 bg-amber-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.floor(Math.random() * 24) + 12}px`,
                    animationDelay: `${bar * 0.1}s`,
                    animationDuration: `${0.4 + bar * 0.05}s`
                  }}
                />
              ))}
            </div>
            <p className="text-xs font-mono text-amber-500 font-semibold tracking-wider uppercase">
              Capturing messiness... {recordingTimer}s / 6s
            </p>
            <p className="text-[11px] sm:text-xs text-slate-450 italic max-w-xs text-center px-4 font-mono leading-relaxed">
              "Letting you speak your mind raw, so your hands can stay completely still."
            </p>
          </div>
        )}

        {/* AI Processing Thinking Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-slate-950/95 rounded-2xl z-20 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
            <div className="space-y-1.5 text-center font-mono">
              <p className="text-sm text-slate-100 font-semibold tracking-wider">Done Enough AI at work...</p>
              <p className="text-xs text-slate-450 tracking-wide">Stripping perfectionist deadlocks. Finding the MVP.</p>
            </div>
          </div>
        )}

        <textarea
          id="brain-dump-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="E.g., I need to write that newsletter but I'm getting stressed by finding the perfect image and formatting, then there's receipts and tomorrow's presentation and I keep changing the typography of my notes..."
          className="w-full h-[32vh] sm:h-56 md:h-64 bg-transparent text-slate-150 placeholder:text-slate-500 text-base sm:text-lg md:text-xl leading-relaxed tracking-wide outline-none resize-none font-sans font-semibold overflow-y-auto"
          maxLength={1000}
          disabled={isRecording || isAnalyzing}
        />

        {/* Cohesive Spark & Blocks Tooling Group */}
        <div className="mt-4 pt-4 border-t border-slate-900/40 space-y-4">
          
          {/* Spark Prompt Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-start sm:items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-500/70 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
                <span className="text-[9px] font-mono uppercase tracking-wider text-slate-500 font-semibold select-none">Spark:</span>
                <button
                  id="spark-prompt-trigger"
                  type="button"
                  onClick={() => setText(SPARK_PROMPTS[currentSparkIndex].prefix)}
                  className="text-left text-[11.5px] text-slate-400 hover:text-amber-400 transition-colors duration-200 italic cursor-pointer underline decoration-dotted decoration-slate-700 hover:decoration-amber-400 font-light"
                  title="Click to pre-populate and jumpstart typing rhythm"
                >
                  {SPARK_PROMPTS[currentSparkIndex].question}
                </button>
              </div>
            </div>
            
            <button
              id="cycle-spark-prompt-btn"
              type="button"
              onClick={() => setCurrentSparkIndex((prev) => (prev + 1) % SPARK_PROMPTS.length)}
              className="flex items-center gap-1 text-[9px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase shrink-0 bg-slate-900/30 border border-slate-900 hover:border-slate-800 px-2 py-0.5 rounded cursor-pointer self-end sm:self-auto"
              title="Try next guiding prompt"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Cycle</span>
            </button>
          </div>

          {/* Interactive Blocks Chips */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="text-xs sm:text-sm font-sans uppercase tracking-wider text-slate-400 mr-1 select-none font-semibold">Blocks:</span>
            {CHIPS.map((chip) => (
              <button
                id={`chip-${chip.id}`}
                key={chip.id}
                type="button"
                onClick={() => setText(chip.prompt)}
                className="px-3.5 py-2 text-[13px] sm:text-sm rounded-lg bg-slate-900/40 hover:bg-slate-900/80 border border-slate-900/80 hover:border-slate-800 text-slate-350 hover:text-slate-100 font-semibold transition-all duration-250 cursor-pointer font-sans"
                title="Click to pre-fill with a relatable prompt"
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>

        {/* Action bar inside text box */}
        <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-900 text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-1.5">
            <button
              id="voice-capture-btn"
              type="button"
              onClick={handleSimulateVoice}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors px-2 py-1 hover:bg-slate-900 rounded cursor-pointer"
              title="Speak your mind instead of typing"
            >
              <Mic className="w-3.5 h-3.5 text-amber-500" />
              <span>Voice Capture</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-[10px]">{text.length}/1000 chars</span>
          </div>

          <button
            id="clear-dump-btn"
            type="button"
            onClick={() => setText("")}
            className="hover:text-slate-300 transition-colors px-2 py-1 cursor-pointer"
          >
            Reset Board
          </button>
        </div>
      </div>

      {/* Premium, Low-Stimulation Trust Ribbon with Thin-Stroke Icons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 py-3 px-6 rounded-2xl bg-slate-900/10 border border-slate-900/40 max-w-2xl mx-auto select-none">
        <div className="flex items-center gap-2 text-slate-400 text-[13px] sm:text-sm font-semibold font-sans">
          <Shield className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 stroke-[1.5]" />
          <span>✓ Private by default</span>
        </div>
        <span className="hidden sm:inline text-slate-800" aria-hidden="true">•</span>
        <div className="flex items-center gap-2 text-slate-400 text-[13px] sm:text-sm font-semibold font-sans">
          <Heart className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 stroke-[1.5]" />
          <span>✓ No guilt mechanics</span>
        </div>
        <span className="hidden sm:inline text-slate-800" aria-hidden="true">•</span>
        <div className="flex items-center gap-2 text-slate-400 text-[13px] sm:text-sm font-semibold font-sans">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500/80 shrink-0 stroke-[1.5]" />
          <span>✓ Built for creative overwhelm</span>
        </div>
      </div>

      {/* Primary Action */}
      <div className="space-y-4 pt-2">
        {/* Trigger Button - Anchored at sticky bottom for mobile thumb-zone layout, standard layout on desktop */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-slate-950/90 backdrop-blur-md border-t border-slate-900 sm:relative sm:inset-auto sm:p-0 sm:bg-transparent sm:border-none z-30 shadow-2xl sm:shadow-none">
          <button
            id="analyze-submit-btn"
            onClick={handleAnalyzeClick}
            disabled={!text.trim() || isRecording || isAnalyzing}
            className={`w-full py-4 px-8 rounded-xl font-sans text-base sm:text-lg font-bold tracking-wider uppercase transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
              text.trim()
                ? "bg-white hover:bg-slate-200 text-black font-extrabold shadow-xl active:scale-[98.5%]"
                : "bg-slate-900 border border-slate-800/80 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-5 h-5 shrink-0 text-amber-500" />
            <span>Initiate Flow Space • Strip Perfectionism</span>
            <kbd className={`hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-mono rounded font-normal leading-none ml-1.5 ${
              text.trim()
                ? "bg-slate-900/10 text-slate-600 border border-slate-900/15"
                : "bg-slate-950 text-slate-700 border border-slate-900"
            }`}>
              ⌘↵
            </kbd>
          </button>
        </div>
      </div>

      {/* Preset Inspirations to bypass Blank Page Syndrome */}
      <div className="space-y-6 pt-8 border-t border-slate-900/50">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold font-sans text-slate-400 uppercase tracking-widest">
          <PenTool className="w-4 h-4 text-slate-450" />
          <span>Or seed with high-overthinking examples:</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRESETS.map((preset) => (
            <button
              id={`preset-${preset.label.replace(/[^a-zA-Z]/g, "")}`}
              key={preset.label}
              type="button"
              onClick={() => setText(preset.text)}
              className="text-left p-6 sm:p-8 rounded-2xl bg-slate-950/30 border border-slate-900 hover:border-slate-800/80 hover:bg-slate-900/20 transition-all duration-300 font-sans flex flex-col justify-between min-h-[140px] sm:min-h-[160px] group cursor-pointer"
            >
              <div className="space-y-3">
                <span className="font-bold text-slate-200 block text-lg sm:text-xl group-hover:text-amber-400 transition-colors duration-200">
                  {preset.label}
                </span>
                <p className="line-clamp-3 text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed font-medium font-sans">
                  {preset.text}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
