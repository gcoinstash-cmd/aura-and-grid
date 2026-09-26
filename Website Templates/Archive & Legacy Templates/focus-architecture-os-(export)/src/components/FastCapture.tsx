import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { TaskStatus, EnergyLevel } from "../types";

interface FastCaptureProps {
  onRouteTask: (title: string, route: "easy" | "deep" | "inbox") => void;
}

export const FastCapture: React.FC<FastCaptureProps> = ({ onRouteTask }) => {
  const [inputValue, setInputValue] = useState("");
  const [routingFeedback, setRoutingFeedback] = useState<string | null>(null);

  const parseText = (text: string) => {
    const lower = text.toLowerCase();
    
    // LOW-ENERGY Keywords
    const lowEnergyKeywords = [
      "brain is fried", 
      "exhausted", 
      "tired", 
      "quick", 
      "admin", 
      "easy", 
      "routine",
      "fatigued",
      "low energy",
      "low battery"
    ];
    const isLowEnergy = lowEnergyKeywords.some(keyword => lower.includes(keyword));

    // DEEP WORK Keywords
    const deepWorkKeywords = [
      "write the master", 
      "design", 
      "code", 
      "architect", 
      "synthesize", 
      "refine seo",
      "build",
      "creative",
      "manifesto",
      "art",
      "refining",
      "refine"
    ];
    const isDeepWork = deepWorkKeywords.some(keyword => lower.includes(keyword));

    if (isLowEnergy) {
      return "easy";
    } else if (isDeepWork) {
      return "deep";
    } else {
      return "inbox";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const route = parseText(inputValue);
    onRouteTask(inputValue.trim(), route);

    // Provide a subtle, elegant monospace routing explanation
    if (route === "easy") {
      setRoutingFeedback("→ Saved to Simple Tasks");
    } else if (route === "deep") {
      setRoutingFeedback("→ Created as Active Deep Work");
    } else {
      setRoutingFeedback("→ Saved to your Inbox for later review");
    }

    setInputValue("");
    setTimeout(() => {
      setRoutingFeedback(null);
    }, 4000);
  };

  const currentRoute = inputValue.trim() ? parseText(inputValue) : null;

  return (
    <div className="w-full max-w-2xl mx-auto py-2" id="quick-capture-container">
      <form onSubmit={handleSubmit} className="relative flex flex-wrap items-center justify-between border-b border-stone-850 focus-within:border-[#C5A85C] transition-colors py-2 gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Unload mental loops or capture a high-leverage objective..."
          className="flex-1 bg-transparent text-stone-100 placeholder-zinc-500 text-sm sm:text-base md:text-lg font-sans font-semibold tracking-wide focus:outline-none focus:ring-0 border-none px-1 py-1"
          id="quick-capture-input"
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className={`flex items-center justify-center p-2 rounded-full transition-all duration-500 ease-[0.16,1,0.3,1] flex-shrink-0 ${
            inputValue.trim()
              ? "bg-[#C5A85C]/10 text-[#C5A85C] border border-[#C5A85C]/30 hover:bg-[#C5A85C]/20 hover:text-stone-100 cursor-pointer"
              : "bg-transparent text-stone-700 border border-transparent cursor-not-allowed"
          }`}
          id="quick-capture-submit"
          title="Add Focus Task"
        >
          <ArrowRight size={16} />
        </button>
      </form>
      
      {/* Invisible dynamic helper feedback */}
      <div className="min-h-[18px] mt-2 text-left pl-1 transition-all text-xs">
        {routingFeedback ? (
          <span className="text-[#C5A85C] font-serif italic text-xs animate-pulse">{routingFeedback}</span>
        ) : currentRoute ? (
          <span className="text-stone-500 font-sans tracking-normal text-xs font-light">
            Cognitive router destination:{" "}
            <strong className="text-[#C5A85C] font-normal">
              {currentRoute === "easy" ? "Administrative Ritual (low charge)" : currentRoute === "deep" ? "Precision Execution (high charge)" : "Unsorted Vault Queue (inbox)"}
            </strong>
          </span>
        ) : (
          <div className="flex items-center gap-1.5 font-sans text-xs tracking-normal text-stone-500">
            <span className="font-medium text-stone-400 animate-pulse">Instant Capture Engine</span>
            <span className="text-stone-700">&mdash;</span>
            <span className="text-stone-500/85 font-light">Cognitive offloading, sorted instantly.</span>
          </div>
        )}
      </div>
    </div>
  );
};
