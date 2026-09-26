/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { CreativeAsset, Project } from "../types";
import { 
  FolderLock, 
  FileCode, 
  Music, 
  Mic, 
  Video, 
  Box, 
  Lock, 
  Plus, 
  CheckCircle, 
  RotateCw, 
  Download,
  Fingerprint,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  Layers,
  Cpu,
  BookmarkCheck,
  ShieldAlert
} from "lucide-react";

interface CreativeAssetLibraryProps {
  assets: CreativeAsset[];
  projects: Project[];
  onAddAsset: (asset: CreativeAsset) => void;
  onUpdateAssetStatus: (id: string, status: CreativeAsset["status"]) => void;
}

export interface EscrowRequirement {
  type: CreativeAsset["type"];
  label: string;
  isMet: boolean;
  status: 'Approved' | 'Draft' | 'Missing';
}

// Structured sync evaluation helper
export function evaluateEscrowPreflight(project: Project, projectAssets: CreativeAsset[]): {
  isPassed: boolean;
  requirements: EscrowRequirement[];
} {
  const reqs: EscrowRequirement[] = [];
  const status = project.status;

  // Define guidelines for high-ticket deliverables based on pipeline stage
  if (status === "Scripting" || status === "Storyboarding") {
    // No strict blockages early on
  } else if (status === "Asset Generation") {
    const hasModel = projectAssets.find(a => a.type === "3D Model");
    reqs.push({
      type: "3D Model",
      label: "3D Source Model (Asset Generation Block)",
      isMet: hasModel?.status === "Approved",
      status: hasModel ? hasModel.status : "Missing"
    });
  } else if (status === "Rendering") {
    const hasModel = projectAssets.find(a => a.type === "3D Model");
    const hasRig = projectAssets.find(a => a.type === "Rig");
    reqs.push(
      {
        type: "3D Model",
        label: "3D Mesh Source File",
        isMet: hasModel?.status === "Approved",
        status: hasModel ? hasModel.status : "Missing"
      },
      {
        type: "Rig",
        label: "Rigging Blueprint / Anim Node Shard",
        isMet: hasRig?.status === "Approved",
        status: hasRig ? hasRig.status : "Missing"
      }
    );
  } else {
    // Revision / Approved stage
    const hasModel = projectAssets.find(a => a.type === "3D Model");
    const hasRig = projectAssets.find(a => a.type === "Rig");
    const hasReviewAsset = projectAssets.find(a => a.type === "Voiceover" || a.type === "Audio" || a.type === "B-Roll");
    reqs.push(
      {
        type: "3D Model",
        label: "3D Mesh Source File",
        isMet: hasModel?.status === "Approved",
        status: hasModel ? hasModel.status : "Missing"
      },
      {
        type: "Rig",
        label: "Rigging Blueprint / Anim Node Shard",
        isMet: hasRig?.status === "Approved",
        status: hasRig ? hasRig.status : "Missing"
      },
      {
        type: "Voiceover",
        label: "Approved Master Soundbed / Voice Shard",
        isMet: hasReviewAsset?.status === "Approved",
        status: hasReviewAsset ? hasReviewAsset.status : "Missing"
      }
    );
  }

  const isPassed = reqs.every(r => r.isMet);
  return { isPassed, requirements: reqs };
}

export default function ClientPortal({
  assets,
  projects,
  onAddAsset,
  onUpdateAssetStatus
}: CreativeAssetLibraryProps) {
  // Views toggle: "grid" for structural All-Projects overview, "focused" for single project focus
  const [viewMode, setViewMode] = useState<"grid" | "focused">("grid");
  const [selectedProjectId, setSelectedProjectId] = useState<string>(projects[0]?.id || "proj-1");
  const [showAddAssetModal, setShowAddAssetModal] = useState(false);
  const [encryptionStatus, setEncryptionStatus] = useState<"Verified" | "Encrypting...">("Verified");

  // Local sequencer state for Temporal Secure CDN downloads
  const [downloadStates, setDownloadStates] = useState<Record<string, { stage: string; percent: number }>>({});

  // Collapsed sections for All-Projects view
  const [collapsedProjects, setCollapsedProjects] = useState<Record<string, boolean>>({});

  // New asset form state
  const [newAsset, setNewAsset] = useState({
    name: "",
    type: "3D Model" as CreativeAsset["type"],
    version: "v1.0",
    fileUrl: "",
    targetProjectId: projects[0]?.id || ""
  });

  const getAssetIcon = (type: CreativeAsset["type"]) => {
    switch (type) {
      case "3D Model": return <Box className="w-4 h-4 text-amber-400" />;
      case "Rig": return <FileCode className="w-4 h-4 text-blue-400" />;
      case "Audio": return <Music className="w-4 h-4 text-purple-400" />;
      case "Voiceover": return <Mic className="w-4 h-4 text-purple-300" />;
      case "B-Roll": return <Video className="w-4 h-4 text-emerald-400" />;
      case "Raw Footage": return <Video className="w-4 h-4 text-neutral-500" />;
    }
  };

  const handleAssetUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.fileUrl || !newAsset.targetProjectId) return;

    const assetToCreate: CreativeAsset = {
      id: "asset-" + Date.now(),
      projectId: newAsset.targetProjectId,
      name: newAsset.name,
      type: newAsset.type,
      version: newAsset.version,
      status: "Draft",
      fileUrl: newAsset.fileUrl
    };

    onAddAsset(assetToCreate);
    setShowAddAssetModal(false);

    // Reset Form
    setNewAsset({
      name: "",
      type: "3D Model",
      version: "v1.0",
      fileUrl: "",
      targetProjectId: selectedProjectId
    });
  };

  const triggerEncryptionAudit = () => {
    setEncryptionStatus("Encrypting...");
    setTimeout(() => {
      setEncryptionStatus("Verified");
    }, 1800);
  };

  // Secure interactive sequencer for download actions
  const triggerTemporalDownload = (asset: CreativeAsset) => {
    const id = asset.id;
    if (downloadStates[id]) return;

    setDownloadStates(prev => ({ 
      ...prev, 
      [id]: { stage: "Securing ECC Key Auth Handshake...", percent: 20 } 
    }));

    setTimeout(() => {
      setDownloadStates(prev => ({ 
        ...prev, 
        [id]: { stage: "Parsing temporal asset checksum...", percent: 55 } 
      }));
    }, 600);

    setTimeout(() => {
      setDownloadStates(prev => ({ 
        ...prev, 
        [id]: { stage: "Compiling secured mesh CDN link...", percent: 85 } 
      }));
    }, 1200);

    setTimeout(() => {
      setDownloadStates(prev => ({ 
        ...prev, 
        [id]: { stage: "Encrypted stream loaded! (Valid 60s) ✅", percent: 100 } 
      }));
    }, 1800);

    // Fade notification out after complete
    setTimeout(() => {
      setDownloadStates(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    }, 4500);
  };

  const toggleProjectCollapse = (pId: string) => {
    setCollapsedProjects(prev => ({ ...prev, [pId]: !prev[pId] }));
  };

  const currentProject = projects.find(p => p.id === selectedProjectId);

  return (
    <div id="assets-cabinet-root" className="space-y-8 animate-fade-in text-left">
      {/* Editorial Header */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-500 uppercase">Secure Media Hub</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Creative Assets Escrow Cabinets</h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">Multi-factor lockrooms safeguarding technical artifacts & source deliverables.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Layout Controls Toggle */}
          <div className="flex bg-neutral-950 border border-neutral-900 p-1 rounded font-mono text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded text-[10.5px] font-medium transition-all duration-150 ${viewMode === "grid" ? "bg-neutral-900 text-white border border-neutral-800" : "text-neutral-500 hover:text-white"}`}
            >
              ALL PROJECTS GRID
            </button>
            <button
              onClick={() => setViewMode("focused")}
              className={`px-3 py-1 rounded text-[10.5px] font-medium transition-all duration-150 ${viewMode === "focused" ? "bg-neutral-900 text-white border border-neutral-800" : "text-neutral-500 hover:text-white"}`}
            >
              SINGLE FOCUS DRAWER
            </button>
          </div>

          <button
            onClick={() => {
              setNewAsset(prev => ({ ...prev, targetProjectId: selectedProjectId }));
              setShowAddAssetModal(true);
            }}
            className="bg-white hover:bg-neutral-200 text-black text-xs font-mono py-2 px-4 rounded font-semibold flex items-center gap-1.5 transition-colors duration-200"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>DEPOSIT CREATIVE ASSET</span>
          </button>
        </div>
      </div>

      {/* Security alert simulation widget */}
      <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <FolderLock className="w-5 h-5 text-emerald-400" />
          <div>
            <span className="text-white font-medium block">Asset Pipeline Cryptography Handshake</span>
            <span className="text-[10px] text-neutral-500 block">Each uploaded asset is compiled with cryptographic checksum validation: [{encryptionStatus}]</span>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-between sm:justify-start">
          <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded border border-neutral-800">
            <Fingerprint className="w-3.5 h-3.5 text-neutral-400" />
            <span>ECC-256 KEYS:</span>
            <span className="font-bold text-emerald-400">ENFORCED</span>
          </div>

          <button
            onClick={triggerEncryptionAudit}
            disabled={encryptionStatus === "Encrypting..."}
            className="border border-neutral-800 hover:border-neutral-700 hover:text-white text-[10.5px] bg-neutral-900 hover:bg-neutral-800 px-3 py-1 rounded transition-all flex items-center gap-1.5"
          >
            <RotateCw className={`w-3 h-3 text-neutral-400 ${encryptionStatus === "Encrypting..." ? "animate-spin" : ""}`} />
            <span>{encryptionStatus === "Encrypting..." ? "SHUFFLING PIPELINE KEYS..." : "ROTATE KEYS"}</span>
          </button>
        </div>
      </div>

      {/* Primary Display Logic switcher */}
      {viewMode === "grid" ? (
        /* ================= 1. ALL PROJECTS GRID VIEW (GROUPED BY PROJECT) ================= */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((p) => {
              const projectAssets = assets.filter(a => a.projectId === p.id);
              const { isPassed, requirements } = evaluateEscrowPreflight(p, projectAssets);
              const isCollapsed = collapsedProjects[p.id] || false;

              return (
                <div 
                  key={p.id}
                  className="bg-neutral-950 border border-neutral-900 rounded-lg hover:border-neutral-800 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Project Header Info bar */}
                  <div className="p-5 border-b border-neutral-900 bg-neutral-900/10 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 block uppercase tracking-wider">PROJECT ESCROW CONTAINER</span>
                        <h3 className="text-base font-sans font-medium text-white tracking-tight mt-0.5">{p.name}</h3>
                        <span className="text-[11px] font-mono text-neutral-400">Client: {p.clientName}</span>
                      </div>
                      
                      <button 
                        onClick={() => toggleProjectCollapse(p.id)}
                        className="text-neutral-500 hover:text-white p-1 rounded hover:bg-neutral-900"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10.5px] font-mono pt-1 text-neutral-450 border-t border-neutral-900/60">
                      <div>
                        <span className="text-neutral-500">PIPELINE STAGE:</span>{" "}
                        <span className="text-white hover:underline cursor-help font-semibold uppercase">{p.status}</span>
                      </div>
                      <span className="text-neutral-800">•</span>
                      <div>
                        <span className="text-neutral-500">PROGRESS:</span>{" "}
                        <span className="text-amber-400 font-bold">{p.progress}%</span>
                      </div>
                      <span className="text-neutral-800">•</span>
                      <div>
                        <span className="text-neutral-500">ESCROW INTEGRITY:</span>{" "}
                        <span className={`font-bold ${isPassed ? "text-emerald-400" : "text-amber-500"}`}>
                          {isPassed ? "SECURED (100%)" : "HANDSHAKE PENDING"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* PRE-FLIGHT SYNC SPEC checklist */}
                  {!isCollapsed && (
                    <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-900 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1.5">
                          <Cpu className="w-3 h-3 text-neutral-400" />
                          <span>Pipeline Pre-flight Checklist</span>
                        </span>
                        
                        <span className={`text-[9.5px] font-mono px-2 py-0.5 rounded border ${
                          isPassed 
                            ? "bg-emerald-950/30 text-emerald-400 border-emerald-900/40" 
                            : "bg-amber-950/30 text-amber-500 border-amber-900/40"
                        }`}>
                          {isPassed ? "STAGE LOCK ENABLED ✅" : "ESCROW DEFICIT OUTSTANDING ⚠️"}
                        </span>
                      </div>

                      {requirements.length === 0 ? (
                        <p className="text-[11px] font-mono text-neutral-500 italic">No restrictive escrow checks required for early {p.status} stage.</p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {requirements.map((req, rid) => (
                            <div 
                              key={rid} 
                              className={`p-2 rounded border text-[11px] font-mono flex items-center justify-between ${
                                req.isMet 
                                  ? "bg-neutral-900/40 border-neutral-900 text-neutral-300" 
                                  : "bg-neutral-950 border-neutral-900 text-neutral-500"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                {req.isMet ? (
                                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                ) : (
                                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                                <span className="truncate pr-1">{req.type}</span>
                              </div>

                              <span className={`text-[9px] font-bold uppercase rounded px-1.5 py-0.5 ${
                                req.status === "Approved" ? "bg-emerald-950/20 text-emerald-400" :
                                req.status === "Draft" ? "bg-neutral-900 text-amber-400" :
                                "bg-rose-950/40 text-rose-400"
                              }`}>
                                {req.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Relational Assets list inside this Project card */}
                  {!isCollapsed && (
                    <div className="p-5 flex-1 space-y-3">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest block font-semibold mb-2">Deposited Assets: {projectAssets.length}</span>
                      
                      {projectAssets.length === 0 ? (
                        <div className="py-8 text-center text-neutral-600 font-mono text-[11px] border border-dashed border-neutral-900/80 rounded">
                          No assets deposited for this container yet. 
                        </div>
                      ) : (
                        <div className="space-y-2 md:max-h-[220px] overflow-y-auto pr-1">
                          {projectAssets.map((asset) => {
                            const dlState = downloadStates[asset.id];

                            return (
                              <div 
                                key={asset.id}
                                className="p-3 bg-neutral-900/20 border border-neutral-900 rounded-md hover:border-neutral-800 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="p-1.5 bg-neutral-900 border border-neutral-800 rounded shrink-0">
                                    {getAssetIcon(asset.type)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-sans font-medium text-white truncate max-w-[170px]">{asset.name}</span>
                                      <span className="text-[10px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded shrink-0">
                                        {asset.version}
                                      </span>
                                    </div>
                                    <code className="text-[10px] text-neutral-500 font-mono block truncate max-w-[200px] mt-0.5">{asset.fileUrl}</code>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                  {/* Monochrome Status Tag */}
                                  <button
                                    onClick={() => onUpdateAssetStatus(asset.id, asset.status === "Approved" ? "Draft" : "Approved")}
                                    className={`px-2 py-0.5 text-[9px] rounded font-mono font-bold border transition-colors ${
                                      asset.status === "Approved" 
                                        ? "bg-neutral-900 hover:bg-neutral-800 text-white border-neutral-800" 
                                        : "bg-amber-950/20 hover:bg-amber-900/20 text-amber-400 border-amber-900/30"
                                    }`}
                                    title="Click to toggle Approval Handshake state"
                                  >
                                    {asset.status.toUpperCase()}
                                  </button>

                                  {/* Temporal secure download trigger controls */}
                                  <button
                                    onClick={() => triggerTemporalDownload(asset)}
                                    disabled={!!dlState}
                                    className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 p-1.5 rounded text-neutral-400 hover:text-white transition-colors"
                                    title="Generate secured temporal CDN key download stream"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>

                                {/* Micro status progress bar */}
                                {dlState && (
                                  <div className="col-span-2 w-full pt-2 border-t border-neutral-900/60 font-mono text-[9px] text-[#a3a3a3] space-y-1">
                                    <div className="flex justify-between">
                                      <span className="animate-pulse">{dlState.stage}</span>
                                      <span>{dlState.percent}%</span>
                                    </div>
                                    <div className="w-full bg-neutral-900 h-1 overflow-hidden rounded">
                                      <div 
                                        className="bg-indigo-400 h-full transition-all duration-300" 
                                        style={{ width: `${dlState.percent}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Add File button to quick link */}
                  <div className="p-3 bg-neutral-900/15 border-t border-neutral-900/50 flex justify-end">
                    <button
                      onClick={() => {
                        setNewAsset(prev => ({ ...prev, targetProjectId: p.id }));
                        setShowAddAssetModal(true);
                      }}
                      className="border border-neutral-900 bg-neutral-950 hover:bg-neutral-900 text-neutral-400 hover:text-white font-mono text-[10px] px-3 py-1 flex items-center gap-1 transition-all rounded"
                    >
                      <Plus className="w-3 h-3" />
                      <span>DEPOSIT TO {p.clientName.toUpperCase()}</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ================= 2. DETAILED SINGLE-PROJECT FOCUS DRAWER VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Asset catalog (Span 8) */}
          <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-3">
              <div>
                <span className="text-xs font-mono text-neutral-500 block uppercase">Project Asset Escrow Files Drawer</span>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs font-mono text-neutral-400 uppercase font-semibold">ACTIVE PROJECT:</span>
                  <select 
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="bg-neutral-900 text-xs font-mono text-white border border-neutral-800 rounded px-2 py-0.5 focus:outline-none"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono flex items-center gap-1.5 bg-neutral-900/60 border border-neutral-800/40 px-2 py-1 rounded">
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
                <span>AES-256 Secured Cabinet Locker</span>
              </div>
            </div>

            {/* List layout of assets */}
            <div className="space-y-4">
              {assets.filter(a => a.projectId === selectedProjectId).length === 0 ? (
                <div className="py-16 text-center text-neutral-500 font-mono text-xs">
                  No active creative assets deposited under this production pipeline project yet.
                </div>
              ) : (
                assets.filter(a => a.projectId === selectedProjectId).map((asset) => {
                  const dlState = downloadStates[asset.id];

                  return (
                    <div 
                      key={asset.id}
                      className="p-4 bg-neutral-900/10 hover:bg-neutral-900/30 border border-neutral-900 hover:border-neutral-800 rounded-lg transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="bg-neutral-950 border border-neutral-800 rounded-md p-2.5 mt-0.5 shadow-sm">
                          {getAssetIcon(asset.type)}
                        </div>
                        
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-neutral-400 block uppercase tracking-widest">{asset.type}</span>
                            <span className="text-[9.5px] font-mono bg-neutral-900 border border-neutral-800 text-neutral-400 px-1.5 py-0.2 rounded font-medium">
                              {asset.version}
                            </span>
                          </div>
                          <h4 className="text-sm font-sans font-semibold text-white tracking-tight mt-1">{asset.name}</h4>
                          <code className="text-[10px] text-neutral-500 font-mono block mt-1 break-all bg-neutral-950/40 py-0.5 px-1.5 rounded border border-neutral-900/50 max-w-[340px] md:max-w-md">{asset.fileUrl}</code>
                        </div>
                      </div>

                      {/* Operational status and buttons */}
                      <div className="flex flex-col items-end gap-3 font-mono text-xs self-end sm:self-auto pt-2 sm:pt-0">
                        <div className="flex items-center gap-2.5">
                          <span className={`px-2 py-0.5 text-[9px] rounded font-bold uppercase ${
                            asset.status === "Approved" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/65" :
                            "bg-neutral-900 text-neutral-500 border border-neutral-800"
                          }`}>
                            {asset.status}
                          </span>

                          <button 
                            onClick={() => onUpdateAssetStatus(asset.id, asset.status === "Approved" ? "Draft" : "Approved")}
                            className={`px-2.5 py-1 text-[10px] uppercase border transition-all ${asset.status === "Approved" ? "bg-black text-neutral-400 hover:text-white border-neutral-800 font-medium" : "bg-white text-black border-neutral-100 hover:bg-neutral-200 font-semibold"}`}
                          >
                            {asset.status === "Approved" ? "MARK DRAFT" : "APPROVE"}
                          </button>

                          <button 
                            onClick={() => triggerTemporalDownload(asset)}
                            disabled={!!dlState}
                            className="bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 px-2.5 py-1.5 rounded text-neutral-400 hover:text-white transition-colors"
                            title="Generate Secure Temporal Stream Download"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Interactive progress loading */}
                        {dlState && (
                          <div className="w-48 text-right font-mono text-[9px] text-[#a3a3a3] space-y-1 mt-1.5">
                            <div className="flex justify-between">
                              <span className="truncate max-w-[120px]">{dlState.stage}</span>
                              <span>{dlState.percent}%</span>
                            </div>
                            <div className="w-full bg-neutral-900 h-1 overflow-hidden rounded">
                              <div 
                                className="bg-indigo-400 h-full" 
                                style={{ width: `${dlState.percent}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Columns: Guidelines and project context (Span 4) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Sync compliance checklist box */}
            <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4 text-xs font-mono text-left">
              <span className="text-[10px] text-neutral-500 uppercase block tracking-widest font-semibold">
                Strategic Pre-flight Cabinet
              </span>

              {currentProject ? (
                (() => {
                  const projectAssets = assets.filter(a => a.projectId === currentProject.id);
                  const { isPassed, requirements } = evaluateEscrowPreflight(currentProject, projectAssets);

                  return (
                    <div className="space-y-4">
                      <div className="text-white font-medium text-sm border-b border-neutral-900 pb-2">
                        {currentProject.name}
                      </div>

                      <div className="space-y-2 text-[11px] text-neutral-400">
                        <div className="flex justify-between">
                          <span>PIPELINE STAGE:</span>
                          <span className="text-white font-semibold uppercase">{currentProject.status}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>PROGRESS STAT:</span>
                          <span className="text-amber-400 font-semibold">{currentProject.progress}%</span>
                        </div>
                        <div className="pt-2 border-t border-neutral-900/40 text-[10px]">
                          <span className="text-neutral-500 block mb-2 font-semibold tracking-wider">PIPELINE SHIELD CHECKLIST:</span>
                          {requirements.length === 0 ? (
                            <span className="text-emerald-400 italic block">✅ Active Stage requirements cleared</span>
                          ) : (
                            <div className="space-y-1.5">
                              {requirements.map((req, rid) => (
                                <div key={rid} className="flex justify-between items-center bg-neutral-900 px-2.5 py-1.5 rounded font-mono text-[10px]">
                                  <span className="truncate pr-1 text-neutral-400">{req.type}</span>
                                  <span className={`font-semibold ${req.isMet ? "text-emerald-400" : "text-amber-500 animate-pulse-subtle"}`}>
                                    {req.status === "Approved" ? "SECURE ✓" : req.status === "Draft" ? "REQUIRES LOCK ⚠️" : "MISSING ❌"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <p>Please select an active project to view specifications.</p>
              )}
            </div>

            <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-3 text-xs font-mono text-left">
              <span className="text-[10px] text-neutral-500 uppercase block tracking-widest font-semibold flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                <span>Asset Escrow Rules</span>
              </span>
              <p className="text-neutral-400 leading-relaxed text-[11.5px]">
                MotionScale OS synchronizes the Cabinet with the production pipeline board. If a mandatory asset class is not both approved and locked of status in the Escrow Cabinet:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-[11px] text-neutral-400">
                <li>Progress transitions will log internal pipeline warnings or blockages in the production lanes.</li>
                <li>MFA-secured clients can preview and approve file versions securely within client portal frameworks.</li>
              </ol>
            </div>
          </div>

        </div>
      )}

      {/* Upload/Deposit Asset Modal */}
      {showAddAssetModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg w-full max-w-md p-6 space-y-5 animate-scale-up text-left">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h2 className="text-base font-sans font-medium text-white tracking-tight">Deposit Secured Creative Asset</h2>
              <button 
                onClick={() => setShowAddAssetModal(false)}
                className="text-neutral-500 hover:text-white font-mono text-xs"
              >
                CLOSE [x]
              </button>
            </div>

            <form onSubmit={handleAssetUploadSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase font-semibold">TARGET PRODUCTION PROJECT</label>
                <select 
                  value={newAsset.targetProjectId}
                  onChange={(e) => setNewAsset({ ...newAsset, targetProjectId: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                >
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.clientName})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase font-semibold">ASSET CONTAINER NAME</label>
                <input 
                  type="text" 
                  required
                  value={newAsset.name}
                  onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                  placeholder="e.g. Master Living Room Lighting Rig"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase font-semibold">ASSET COMPONENT TYPE</label>
                  <select 
                    value={newAsset.type}
                    onChange={(e) => setNewAsset({ ...newAsset, type: e.target.value as CreativeAsset["type"] })}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  >
                    <option value="3D Model">3D Model (FBX/OBJ)</option>
                    <option value="Rig">Rigging / Anim Node</option>
                    <option value="Audio">Audio Stream</option>
                    <option value="Voiceover">Voiceover Audio file</option>
                    <option value="B-Roll">B-Roll Footage overlay</option>
                    <option value="Raw Footage">Raw Camera Footage shard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase font-semibold">VERSION EMBED</label>
                  <input 
                    type="text" 
                    required
                    value={newAsset.version}
                    onChange={(e) => setNewAsset({ ...newAsset, version: e.target.value })}
                    placeholder="e.g. v1.4"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase font-semibold">SECURE CLOUD CDN FILE URL</label>
                <input 
                  type="text" 
                  required
                  value={newAsset.fileUrl}
                  onChange={(e) => setNewAsset({ ...newAsset, fileUrl: e.target.value })}
                  placeholder="e.g. /assets/living_atrium_rig_v1.zip"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowAddAssetModal(false)}
                  className="border border-neutral-850 hover:border-neutral-700 text-neutral-400 hover:text-white px-4 py-2"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded font-semibold"
                >
                  DEPOSIT FILE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
