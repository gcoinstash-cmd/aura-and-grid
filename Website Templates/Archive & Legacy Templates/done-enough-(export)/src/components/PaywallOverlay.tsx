import React from "react";
import { X, Sparkles, Check, Flame } from "lucide-react";

interface PaywallOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier?: "free" | "pro" | "studio";
  onSelectTier?: (tier: "free" | "pro" | "studio") => void;
}

export default function PaywallOverlay({
  isOpen,
  onClose,
  selectedTier,
  onSelectTier,
}: PaywallOverlayProps) {
  if (!isOpen) return null;

  const tiers = [
    {
      id: "free" as const,
      name: "The Basic Calm",
      price: "$0",
      description: "Quiet work for standard micro-tasks.",
      features: [
        "3 Brain dumps per day",
        "Standard 'Done Enough' metric generator",
        "10-min Interactive focus timer",
        "No shame-free weekly resets logs"
      ],
      cta: "Current Plan",
      premium: false
    },
    {
      id: "pro" as const,
      name: "Done Enough Pro",
      price: "$15",
      period: "/ mo",
      description: "Essential relief for high-paralysis creators & founders.",
      features: [
        "Infinite raw Brain Dumps",
        "Advanced 'Anti-Loop' proactive nudges",
        "Unlimited focus timers (10m / 25m / Custom)",
        "Daily streak shielding (Shame-Free Resets)",
        "Premium milestone XP multiplier"
      ],
      cta: "Unlock Done Enough Pro",
      premium: true,
      popular: true
    },
    {
      id: "studio" as const,
      name: "Studio Deep Calm",
      price: "$29",
      period: "/ mo",
      description: "Dedicated flow insurance for high-overthinking executives.",
      features: [
        "Everything in Pro",
        "AI Co-Pilot live rewrites",
        "Focus audio ambient integration",
        "Premium support channels",
        "CSV history and micro-log data export"
      ],
      cta: "Secure Studio Access",
      premium: true
    }
  ];

  return (
    <div id="paywall-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        id="paywall-container"
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8"
      >
        {/* Absolute Close Header */}
        <button
          id="close-paywall"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors duration-150"
          aria-label="Close paywall"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Intro Heading */}
        <div className="text-center mb-8 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Guilt-Free Productivity</span>
          </div>
          <h2 className="text-3xl font-serif text-slate-100 tracking-tight mb-2">
            Invest in Finished.
          </h2>
          <p className="text-sm text-slate-400 font-sans">
            Bypass perfectionism traps. Unlock unlimited focus sprint engines, automated shame-free resilience resets, and custom threshold metrics.
          </p>
        </div>

        {/* Dynamic Matrix of Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const isCurrent = selectedTier === tier.id;
            return (
              <div
                key={tier.id}
                id={`tier-card-${tier.id}`}
                className={`relative flex flex-col justify-between p-6 rounded-xl border transition-all duration-300 ${
                  tier.popular
                    ? "bg-slate-900/60 border-slate-600 shadow-xl"
                    : "bg-slate-900/20 border-slate-800 hover:border-slate-700"
                } ${isCurrent ? "ring-1 ring-amber-500/50" : ""}`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-[10px] font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <Flame className="w-3 h-3" /> Popular Choice
                  </span>
                )}

                <div>
                  <h3 className="text-lg font-serif text-slate-100 mb-1">{tier.name}</h3>
                  <p className="text-xs text-slate-400 mb-4 h-8 leading-tight">{tier.description}</p>
                  
                  <div className="flex items-baseline gap-1 mb-5">
                    <span className="text-3xl font-mono text-slate-100">{tier.price}</span>
                    {tier.period && <span className="text-xs text-slate-400">{tier.period}</span>}
                  </div>

                  <ul className="space-y-2.5 mb-6 text-xs text-slate-300">
                    {tier.features.map((feat, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  id={`cta-${tier.id}`}
                  onClick={() => {
                    if (onSelectTier) onSelectTier(tier.id);
                    onClose();
                  }}
                  className={`w-full py-2.5 px-4 rounded-lg font-mono text-xs transition-all duration-200 ${
                    tier.popular
                      ? "bg-slate-100 hover:bg-white text-slate-950 font-semibold"
                      : "bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200"
                  }`}
                >
                  {isCurrent ? "Your Calm State" : tier.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* High-Contrast Bottom Trust Stamp */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500 font-mono">
            Cancel with a single click. Zero guilt. No awkward feedback boxes required. Done is better than perfect.
          </p>
        </div>
      </div>
    </div>
  );
}
