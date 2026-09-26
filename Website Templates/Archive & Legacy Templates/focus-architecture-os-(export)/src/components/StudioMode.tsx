import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Edit, Plus, Trash2, Layout, Sliders, Eye, EyeOff, CheckCircle, Clock, AlertCircle, Sparkles, Send, ArrowRight } from "lucide-react";

export interface Deliverable {
  id: string;
  milestone: string;
  status: "Drafting" | "Staged for Review" | "Client Approved" | "Delivered";
  deliveryDate: string;
  value: string;
  responsibleCode: string;
}

export interface ReviewAsset {
  id: string;
  title: string;
  category: "Lookbook" | "Typography Specs" | "Boutique Frontage" | "Creative Pitch";
  src: string;
  notes: string;
  specs: {
    fontFamily: string;
    primaryColor: string;
    aspectRatio: string;
  };
  comments: string[];
}

export const DEFAULT_DELIVERABLES: Deliverable[] = [
  {
    id: "del_1",
    milestone: "Luxury Retreat Launch Styleframes",
    status: "Client Approved",
    deliveryDate: "2026-06-15",
    value: "$12,500",
    responsibleCode: "CREATIVE_DIR"
  },
  {
    id: "del_2",
    milestone: "Interactive Editorial Grid Framework",
    status: "Staged for Review",
    deliveryDate: "2026-06-20",
    value: "$8,200",
    responsibleCode: "LEAD_ARCHITECT"
  },
  {
    id: "del_3",
    milestone: "Full-Bleed 4K Video Background Assets",
    status: "Drafting",
    deliveryDate: "2026-06-28",
    value: "$14,000",
    responsibleCode: "MEDIA_TEAM"
  },
  {
    id: "del_4",
    milestone: "Production Hand-off Package & Styleguides",
    status: "Drafting",
    deliveryDate: "2026-07-05",
    value: "$6,500",
    responsibleCode: "LEAD_DESIGNER"
  }
];

export const DEFAULT_ASSETS: ReviewAsset[] = [
  {
    id: "ast_1",
    title: "Autumn / Winter 2026 Lookbook",
    category: "Lookbook",
    src: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200",
    notes: "Utilizes ultra-generous margins, asymmetrical text alignment, and rich sand-and-slate overlay grids to create high-fashion depth.",
    specs: {
      fontFamily: "Space Grotesk & Playfair",
      primaryColor: "#FAF9F6 / #121212",
      aspectRatio: "4:5 Portrait Grid"
    },
    comments: [
      "The asymmetry is sublime. Let's make sure the entry animations stay fluid.",
      "The sand palette matches the tactile linen material perfectly."
    ]
  },
  {
    id: "ast_2",
    title: "Editorial Typography Grid Specification",
    category: "Typography Specs",
    src: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&q=80&w=1200",
    notes: "Configured with strict Inter baseline rhythms, custom letter-spacing tags, and extreme contrast display values for boutique focus.",
    specs: {
      fontFamily: "Inter Variable Mono",
      primaryColor: "#C5A85C / #FFFFFF",
      aspectRatio: "12-Column Responsive Layout"
    },
    comments: [
      "Typography is highly readable. The gold highlights are perfectly distributed."
    ]
  },
  {
    id: "ast_3",
    title: "Boutique Frontage Visual Render",
    category: "Boutique Frontage",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200",
    notes: "Visual blueprint mockup demonstrating natural lime wash textures and signature brass detailing under volumetric lighting overlays.",
    specs: {
      fontFamily: "Outfit Light",
      primaryColor: "#1C1C1E / #C5A85C",
      aspectRatio: "16:9 Cinematic Display"
    },
    comments: [
      "Stunning! The stone grain alignment feels earthy yet premium.",
      "Lighting matches our Dusk preset precisely."
    ]
  }
];

interface StudioModeProps {
  presentationMode: boolean;
  setPresentationMode: (val: boolean) => void;
  demoMode?: boolean;
  setDemoMode?: (val: boolean) => void;
}

export const StudioMode: React.FC<StudioModeProps> = ({
  presentationMode,
  setPresentationMode,
  demoMode = false,
  setDemoMode
}) => {
  // Deliverables State (pright, clean-slate empty baseline by default on first load)
  const [deliverables, setDeliverables] = useState<Deliverable[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_deliverables");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  // Assets State (pristine, clean-slate empty baseline by default on first load)
  const [assets, setAssets] = useState<ReviewAsset[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_assets");
      return saved ? JSON.parse(saved) : [];
    } catch (_) {
      return [];
    }
  });

  const displayedDeliverables = demoMode ? DEFAULT_DELIVERABLES : deliverables;
  const displayedAssets = demoMode ? DEFAULT_ASSETS : assets;

  const [activeAssetId, setActiveAssetId] = useState<string>(DEFAULT_ASSETS[0].id);
  const [newComment, setNewComment] = useState("");

  // New Deliverable Form State
  const [showAddDel, setShowAddDel] = useState(false);
  const [formMilestone, setFormMilestone] = useState("");
  const [formStatus, setFormStatus] = useState<Deliverable["status"]>("Drafting");
  const [formDate, setFormDate] = useState("");
  const [formValue, setFormValue] = useState("");
  const [formResponsible, setFormResponsible] = useState("CREATIVE_DIR");

  // Save Deliverables
  useEffect(() => {
    localStorage.setItem("focus_planner_deliverables", JSON.stringify(deliverables));
  }, [deliverables]);

  // Save Assets
  useEffect(() => {
    localStorage.setItem("focus_planner_assets", JSON.stringify(assets));
  }, [assets]);

  const activeAsset = displayedAssets.find((a) => a.id === activeAssetId) || displayedAssets[0];

  const handleAddDeliverable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMilestone.trim()) return;

    const newDel: Deliverable = {
      id: "del_" + Math.random().toString(),
      milestone: formMilestone,
      status: formStatus,
      deliveryDate: formDate || new Date().toISOString().split("T")[0],
      value: formValue || "$0",
      responsibleCode: formResponsible
    };

    setDeliverables([...deliverables, newDel]);
    setFormMilestone("");
    setFormValue("");
    setFormDate("");
    setShowAddDel(false);
  };

  const handleDeleteDeliverable = (id: string) => {
    setDeliverables(deliverables.filter((d) => d.id !== id));
  };

  const handleUpdateStatus = (id: string, nextStatus: Deliverable["status"]) => {
    setDeliverables(
      deliverables.map((d) => (d.id === id ? { ...d, status: nextStatus } : d))
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    setAssets(
      assets.map((a) => {
        if (a.id === activeAssetId) {
          return {
            ...a,
            comments: [...a.comments, newComment.trim()]
          };
        }
        return a;
      })
    );
    setNewComment("");
  };

  const getStatusBadge = (status: Deliverable["status"]) => {
    switch (status) {
      case "Client Approved":
        return (
          <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-sm bg-emerald-950/40 text-emerald-400 border border-emerald-900/45 text-[9px] font-mono tracking-wider uppercase">
            <CheckCircle size={10} />
            <span>Client Approved</span>
          </span>
        );
      case "Staged for Review":
        return (
          <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-sm bg-[#C5A85C]/15 text-[#C5A85C] border border-[#C5A85C]/35 text-[9px] font-mono tracking-wider uppercase animate-pulse">
            <Clock size={10} />
            <span>Staged for Review</span>
          </span>
        );
      case "Delivered":
        return (
          <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-sm bg-blue-950/40 text-blue-400 border border-blue-900/40 text-[9px] font-mono tracking-wider uppercase">
            <CheckCircle size={10} />
            <span>Delivered</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 py-1 px-2.5 rounded-sm bg-stone-900 text-stone-400 border border-stone-800 text-[9px] font-mono tracking-wider uppercase">
            <AlertCircle size={10} />
            <span>Drafting</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 text-left" id="dedicated-studio-dashboard">
      
      {/* HEADER SECTION WITH STATEMENT */}
      <div className="bg-[#161616]/40 border border-stone-900/20 rounded-sm py-6 md:py-8 px-8 md:px-12 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#C5A85C]/5 to-transparent pointer-events-none" />
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center w-full gap-4">
            <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A85C]">
              <span>Profile Variation</span>
              <span className="text-stone-700">&bull;</span>
              <span>Boutique & Agency Studio Mode</span>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Demo Mode Toggle */}
              <div className="flex items-center space-x-2 bg-stone-950/45 border border-stone-900 py-1.5 px-3 rounded-sm">
                <span className="text-[10px] font-mono text-stone-400 tracking-wider uppercase select-none">Demo / Preview</span>
                <button
                  onClick={() => setDemoMode?.(!demoMode)}
                  className={`relative inline-flex h-4.5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    demoMode ? "bg-[#C5A85C]" : "bg-stone-800"
                  }`}
                  id="studio-demo-mode-toggle"
                  title="Toggle elegant demo dataset"
                >
                  <span
                    className={`pointer-events-none inline-block h-3.5 w-3.5 transform rounded-full bg-[#121212] transition duration-200 ease-in-out ${
                      demoMode ? "translate-x-4.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Presentation Mode Toggle button */}
              <button
                onClick={() => setPresentationMode(!presentationMode)}
                className={`flex items-center space-x-2 text-[10px] font-mono tracking-wider px-3.5 py-1.5 rounded-sm border transition-all duration-300 cursor-pointer focus:outline-none ${
                  presentationMode 
                    ? "bg-[#C5A85C] text-stone-950 border-[#C5A85C] font-semibold" 
                    : "bg-transparent border-stone-850 text-stone-450 hover:text-stone-200 hover:border-stone-700"
                }`}
                id="presentation-toggle-banner"
                title="Toggle client-facing presentation mode layout"
              >
                {presentationMode ? <EyeOff size={11} /> : <Eye size={11} />}
                <span>{presentationMode ? "Presentation Mode Live" : "Toggle Presentation Mode"}</span>
              </button>
            </div>
          </div>

          <h2 className="font-serif text-2xl text-stone-100 font-light tracking-tight">Studio Stage / Presentation Portal</h2>
          <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-xl">
            A specialized architectural hub tailored to showcase milestone execution and review aesthetic design systems. Trigger Presentation Mode above to hide backlogs and focus client interaction on beautiful stage assets.
          </p>
        </div>
      </div>

      {/* Presentation Mode Status Strip (When Active) */}
      {presentationMode && (
        <div className="p-4 bg-[#C5A85C]/5 border border-[#C5A85C]/25 rounded-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" />
            <p className="text-[10px] font-mono tracking-wider text-[#C5A85C] uppercase">
              Client Showcase Active &mdash; Internal backlogs and cognitive routing inputs hidden
            </p>
          </div>
          <button 
            onClick={() => setPresentationMode(false)}
            className="text-[9px] font-mono text-[#C5A85C] border-b border-[#C5A85C]/20 hover:border-[#C5A85C] pb-0.5"
          >
            Disable Presentation Filter
          </button>
        </div>
      )}

      {/* 1. CLIENT DELIVERABLES MATRIX */}
      <section className="space-y-4" id="deliverables-matrix-section">
        <div className="flex justify-between items-end border-b border-stone-900 pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#C5A85C]/80 tracking-widest block">Operational Core</span>
            <h3 className="font-serif text-lg text-stone-100 font-light tracking-tight mt-1">Client Deliverables Matrix</h3>
          </div>
          {!presentationMode && (
            <button
              onClick={() => setShowAddDel(!showAddDel)}
              className="flex items-center space-x-1.5 text-[10px] font-mono text-stone-400 hover:text-stone-100 transition-colors bg-stone-900/60 border border-stone-850 px-3 py-1.5 rounded-sm cursor-pointer"
            >
              <Plus size={12} />
              <span>Add Target Milestone</span>
            </button>
          )}
        </div>

        {/* Form to add deliverable */}
        <AnimatePresence>
          {showAddDel && (
            <motion.form
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              onSubmit={handleAddDeliverable}
              className="bg-stone-950/60 border border-stone-850 rounded-sm p-5 space-y-4 overflow-hidden"
              id="new-deliverable-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-stone-500 block">Milestone Title</label>
                  <input
                    type="text"
                    required
                    value={formMilestone}
                    onChange={(e) => setFormMilestone(e.target.value)}
                    placeholder="e.g. Autumn / Winter Styleframes Deliverable"
                    className="w-full bg-stone-900 border border-stone-800 rounded-sm text-xs text-stone-200 p-2.5 focus:outline-none focus:border-[#C5A85C]/40 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-stone-500 block">Status Level</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-sm text-xs text-stone-200 p-2 focus:outline-none focus:border-[#C5A85C]/40 font-sans"
                  >
                    <option value="Drafting">Drafting</option>
                    <option value="Staged for Review">Staged for Review</option>
                    <option value="Client Approved">Client Approved</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-stone-500 block">Target Delivery Date</label>
                  <input
                    type="date"
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-sm text-xs text-stone-200 p-2 focus:outline-none focus:border-[#C5A85C]/40 font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-mono uppercase text-stone-500 block">Contract Value</label>
                  <input
                    type="text"
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="e.g. $12,500"
                    className="w-full bg-stone-900 border border-stone-800 rounded-sm text-xs text-stone-200 p-2.5 focus:outline-none focus:border-[#C5A85C]/40 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDel(false)}
                  className="bg-transparent text-stone-500 hover:text-stone-300 py-1.5 px-4 text-[10px] font-mono uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#C5A85C] hover:bg-[#C5A85C]/90 text-stone-950 px-5 py-1.5 text-[10px] font-mono uppercase tracking-wider font-bold rounded-sm cursor-pointer"
                >
                  Confirm Milestone
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Matrix Grid Container */}
        <div className="border border-stone-900/60 rounded-sm overflow-hidden bg-[#151515]/20">
          <div className="hidden sm:grid grid-cols-12 gap-2 bg-stone-950/45 p-3 px-4 border-b border-stone-900/60 text-[9px] font-mono uppercase text-stone-500 tracking-wider">
            <span className="col-span-5">Milestone / Deliverable</span>
            <span className="col-span-3 text-center">Status States</span>
            <span className="col-span-2 text-right">Delivery Date</span>
            <span className="col-span-2 text-right">Valuation</span>
          </div>

          <div className="divide-y divide-stone-900/40">
            {displayedDeliverables.length > 0 ? (
              displayedDeliverables.map((del) => (
                <div
                  key={del.id}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 items-center hover:bg-stone-900/10 transition-colors"
                >
                  <div className="col-span-5 flex flex-col space-y-1">
                    <span className="font-serif text-sm text-stone-150 leading-snug">{del.milestone}</span>
                    <span className="font-mono text-[8px] text-stone-550 uppercase tracking-wider">
                      Author assignment ID: {del.responsibleCode}
                    </span>
                  </div>

                  <div className="col-span-3 flex flex-wrap justify-start sm:justify-center items-center gap-1.5">
                    {getStatusBadge(del.status)}
                    
                    {!presentationMode && (
                      <div className="relative inline-block text-left">
                        <select
                          value={del.status}
                          onChange={(e) => handleUpdateStatus(del.id, e.target.value as any)}
                          className="bg-stone-950 border border-stone-850 hover:border-stone-700 text-stone-400 hover:text-stone-200 text-[8px] font-mono py-0.5 px-1 rounded-sm focus:outline-none cursor-pointer"
                        >
                          <option value="Drafting">Draft</option>
                          <option value="Staged for Review">Stage</option>
                          <option value="Client Approved">Approve</option>
                          <option value="Delivered">Deliver</option>
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="col-span-2 text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[9px] font-mono text-stone-500 sm:hidden uppercase">Delivery:</span>
                    <span className="font-mono text-[10.5px] text-stone-400 tracking-tight">
                      {new Date(del.deliveryDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="col-span-2 text-left sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end">
                    <span className="text-[9px] font-mono text-stone-500 sm:hidden uppercase">Value:</span>
                    <span className="font-mono text-[11px] font-semibold text-[#C5A85C]/90 tracking-wide">
                      {del.value}
                    </span>
                    {!presentationMode && (
                      <button
                        onClick={() => handleDeleteDeliverable(del.id)}
                        className="text-stone-600 hover:text-red-400 transition-colors p-1 rounded-sm cursor-pointer ml-4 sm:ml-0 mt-0.5 block"
                        title="Delete Milestone target"
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </div>

                </div>
              ))
            ) : (
              <p className="p-8 text-center text-xs text-stone-550 font-serif italic">
                No active milestone targets listed in the deliverables matrix.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 2. ASSET REVIEW PIPELINE */}
      <section className="space-y-4" id="asset-review-pipeline-section">
        <div className="border-b border-stone-900 pb-3">
          <span className="text-[10px] font-mono uppercase text-[#C5A85C]/80 tracking-widest block">Signature Staging</span>
          <h3 className="font-serif text-lg text-stone-100 font-light tracking-tight mt-1">Asset Review Pipeline</h3>
        </div>

        {/* Interactive Asset Switcher Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          
          {/* Asset List Side Rail */}
          <div className="space-y-2 flex flex-col justify-stretch">
            {displayedAssets.length > 0 ? (
              displayedAssets.map((ast) => {
                const isActive = ast.id === activeAssetId;
                return (
                  <button
                    key={ast.id}
                    onClick={() => setActiveAssetId(ast.id)}
                    className={`group w-full flex flex-col text-left p-3 border rounded-sm transition-all duration-300 cursor-pointer focus:outline-none ${
                      isActive
                        ? "bg-[#161616]/75 border-[#C5A85C]/35 shadow-sm"
                        : "bg-[#141414]/10 border-stone-900/35 hover:bg-stone-900/10 hover:border-stone-850"
                    }`}
                  >
                    <div className="flex justify-between items-start w-full">
                      <span className={`text-[8.5px] font-mono uppercase transition-colors tracking-widest ${
                        isActive ? "text-[#C5A85C] font-semibold" : "text-stone-550 group-hover:text-stone-400"
                      }`}>
                        {ast.category}
                      </span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                      )}
                    </div>
                    <span className={`text-[11.5px] font-serif tracking-normal mt-2 transition-colors ${isActive ? "text-stone-105" : "text-stone-400"}`}>
                      {ast.title}
                    </span>
                    <span className="text-[9px] font-mono text-stone-550 mt-1 block">
                      {ast.comments.length} reviewer comments
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="p-4 border border-dashed border-stone-900 text-center text-[10px] font-mono text-stone-600 rounded-sm">
                No pipeline assets staged.
              </div>
            )}
          </div>

          {/* Active Asset Centered Showpiece */}
          {activeAsset ? (
            <div className="md:col-span-2 border border-stone-900 bg-stone-950/60 rounded-sm p-4 flex flex-col justify-between space-y-4">
              
              {/* Image Stage Container */}
              <div className="relative aspect-[16/10] bg-stone-950 border border-stone-900/85 overflow-hidden group rounded-sm select-none">
                <img
                  src={activeAsset.src}
                  alt={activeAsset.title}
                  className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 flex flex-col text-left">
                  <span className="text-[9px] font-sans text-stone-400 font-light lowercase">Active Target Asset Portfolio Preview</span>
                  <span className="text-[12.5px] font-serif italic text-stone-100 font-semibold tracking-wide">
                    {activeAsset.title}
                  </span>
                </div>
              </div>

              {/* Spec metadata tags */}
              <div className="grid grid-cols-3 gap-2.5 bg-stone-900/25 border border-stone-900/40 p-2.5 rounded-sm">
                <div>
                  <span className="text-[8px] font-mono uppercase text-stone-550 block">Font Core</span>
                  <span className="text-[10px] text-stone-300 font-sans tracking-wide block mt-0.5 truncate">{activeAsset.specs?.fontFamily || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase text-[#C5A85C]/80 block">Palette Root</span>
                  <span className="text-[10px] text-[#C5A85C] font-mono block mt-0.5 truncate">{activeAsset.specs?.primaryColor || "N/A"}</span>
                </div>
                <div>
                  <span className="text-[8px] font-mono uppercase text-stone-550 block">Dimensions Layout</span>
                  <span className="text-[10px] text-stone-300 font-sans tracking-wide block mt-0.5 truncate">{activeAsset.specs?.aspectRatio || "N/A"}</span>
                </div>
              </div>

              {/* Explanatory notes */}
              <div className="text-left space-y-1.5 border-l-2 border-[#C5A85C]/35 pl-3.5">
                <span className="text-[8.5px] font-mono uppercase text-[#C5A85C]/80 tracking-widest block">Staging Statement Notes</span>
                <p className="text-xs text-stone-300 font-sans font-light leading-relaxed">
                  {activeAsset.notes}
                </p>
              </div>

              {/* Live Comment Stream & Input */}
              <div className="pt-2 border-t border-stone-900/60 space-y-3.5">
                
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1">
                  <span className="text-[8px] font-mono uppercase text-stone-550 tracking-wider block">Stage Feedback Stream</span>
                  {activeAsset.comments?.map((comment, index) => (
                    <div key={index} className="bg-stone-900/30 border border-stone-900/35 p-2 rounded-sm text-[10.5px] font-sans font-light text-stone-350 leading-relaxed text-left flex items-start space-x-1.5">
                      <span className="text-[8.5px] font-mono text-[#C5A85C] mt-0.5">0{index + 1}</span>
                      <p className="flex-1">"{comment}"</p>
                    </div>
                  )) || (
                    <span className="text-xs text-stone-605 italic block pl-1">No feedback logs found.</span>
                  )}
                </div>

                {/* Add comment form */}
                <div className="flex gap-2 bg-stone-950/80 border border-stone-900/80 rounded-sm p-1">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddComment();
                    }}
                    className="flex-1 bg-transparent border-none text-[10.5px] text-stone-300 tracking-wide focus:outline-none focus:ring-0 px-2 placeholder-stone-605"
                    placeholder="Annotate staging review commentary..."
                  />
                  <button
                    onClick={handleAddComment}
                    className="bg-stone-900 hover:bg-[#C5A85C]/15 border border-stone-850 hover:border-[#C5A85C]/30 text-stone-400 hover:text-[#C5A85C] p-2.5 rounded-sm transition-all focus:outline-none cursor-pointer"
                    title="Submit Stage review annotation"
                  >
                    <Send size={11} />
                  </button>
                </div>

              </div>

            </div>
          ) : (
            <div className="md:col-span-2 border border-stone-900 bg-stone-950/30 rounded-sm p-10 flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
              <Layout size={32} className="text-stone-600 animate-pulse" />
              <div className="space-y-1">
                <h4 className="font-serif text-stone-350 text-sm">Review pipeline empty</h4>
                <p className="text-[11px] text-stone-500 max-w-sm font-sans leading-relaxed">
                  Enable <strong className="text-[#C5A85C] font-normal">Demo / Preview Mode</strong> inside System Preferences to temporarily see fully operational lookbooks, feedback, and staging pipelines.
                </p>
              </div>
            </div>
          )}

        </div>

      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="p-6 bg-stone-900/20 border border-[#C5A85C]/20 rounded-sm text-center space-y-3">
        <p className="text-xs text-stone-400 font-sans max-w-md mx-auto leading-relaxed font-light">
          Share coordinates, custom layouts, design specs, and milestone approvals of the boutique brand pipeline.
        </p>
        <button
          onClick={() => setPresentationMode(!presentationMode)}
          className="bg-[#C5A85C]/10 border border-[#C5A85C]/40 hover:bg-[#C5A85C] hover:text-stone-950 text-[#C5A85C] font-mono text-[11px] uppercase tracking-wider px-6 py-2.5 rounded-sm transition-all cursor-pointer inline-flex items-center space-x-2"
          id="studio-stage-share"
        >
          <span>{presentationMode ? "Switch to Interactive Backlog" : "Pristine Screen Share Mode Active"}</span>
          <ArrowRight size={11} />
        </button>
      </section>

    </div>
  );
};
