/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Project, ProjectMetrics, CreativeAsset } from "../types";
import { evaluateEscrowPreflight } from "./ClientPortal";
import { 
  Video, 
  Plus, 
  Sliders, 
  Calendar, 
  User, 
  Percent, 
  TrendingUp, 
  Clock, 
  BellRing,
  AlertTriangle,
  Play,
  BookmarkCheck,
  ShieldAlert
} from "lucide-react";

interface ProjectPipelineProps {
  projects: Project[];
  assets: CreativeAsset[];
  onAddProject: (project: Project) => void;
  onUpdateProject: (project: Project) => void;
}

export default function SprintManager({
  projects,
  assets,
  onAddProject,
  onUpdateProject
}: ProjectPipelineProps) {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New project forms state
  const [newProject, setNewProject] = useState({
    name: "",
    clientName: "",
    animatorId: "Diana Prince",
    budget: 50000,
    deliveryDate: "",
    status: "Scripting" as Project["status"],
    predictiveDelayRisk: "Low" as ProjectMetrics["predictiveDelayRisk"],
    renderTimeEstimate: "8 hrs"
  });

  const triggerNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleCreateProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.clientName || !newProject.deliveryDate) return;

    const projectToCreate: Project = {
      id: "proj-" + Date.now(),
      name: newProject.name,
      status: newProject.status,
      deliveryDate: newProject.deliveryDate,
      budget: Number(newProject.budget),
      clientName: newProject.clientName,
      animatorId: newProject.animatorId,
      progress: 10, // Initial scripting progress,
      metrics: {
        predictiveDelayRisk: newProject.predictiveDelayRisk,
        renderTimeEstimate: newProject.renderTimeEstimate
      }
    };

    onAddProject(projectToCreate);
    setShowNewProjectModal(false);
    triggerNotification(`New project dispatched: "${newProject.name}" for ${newProject.clientName}`);

    // Reset Form
    setNewProject({
      name: "",
      clientName: "",
      animatorId: "Diana Prince",
      budget: 50000,
      deliveryDate: "",
      status: "Scripting",
      predictiveDelayRisk: "Low",
      renderTimeEstimate: "8 hrs"
    });
  };

  const handleUpdateStatus = (projId: string, nextStatus: Project["status"]) => {
    const target = projects.find(p => p.id === projId);
    if (target) {
      // Automatically adjust progress relative to selected stage
      let nextProgress = target.progress;
      if (nextStatus === "Scripting") nextProgress = 15;
      else if (nextStatus === "Storyboarding") nextProgress = 30;
      else if (nextStatus === "Asset Generation") nextProgress = 50;
      else if (nextStatus === "Rendering") nextProgress = 75;
      else if (nextStatus === "Revision") nextProgress = 90;
      else if (nextStatus === "Approved") nextProgress = 100;

      const updated: Project = { 
        ...target, 
        status: nextStatus,
        progress: nextProgress
      };
      
      onUpdateProject(updated);
      triggerNotification(`Project status updated: "${target.name}" transitioned to ${nextStatus}`);
    }
  };

  const handleProgressSliderChange = (projId: string, val: number) => {
    const target = projects.find(p => p.id === projId);
    if (target) {
      // Set status based on slider checkpoints
      let nextStatus = target.status;
      if (val >= 100) nextStatus = "Approved";
      else if (val >= 85) nextStatus = "Revision";
      else if (val >= 65) nextStatus = "Rendering";
      else if (val >= 35) nextStatus = "Asset Generation";
      else if (val >= 20) nextStatus = "Storyboarding";
      else nextStatus = "Scripting";

      const updated: Project = { 
        ...target, 
        progress: val,
        status: nextStatus
      };
      onUpdateProject(updated);
    }
  };

  const getRiskLabelColor = (risk: ProjectMetrics["predictiveDelayRisk"]) => {
    switch (risk) {
      case "High": return "text-rose-400 bg-rose-950/40 border-rose-900/60";
      case "Medium": return "text-amber-400 bg-amber-950/40 border-amber-900/60";
      case "Low": return "text-emerald-400 bg-emerald-950/40 border-emerald-900/60";
    }
  };

  // Split projects into structural columns representing MotionScale pipelines
  const pipelineStages: { label: Project["status"]; desc: string }[] = [
    { label: "Scripting", desc: "Storyboard text & pacing" },
    { label: "Storyboarding", desc: "Visual keyframes layout" },
    { label: "Asset Generation", desc: "3D Models, audio overlays" },
    { label: "Rendering", desc: "Active GPU calculations" },
    { label: "Revision", desc: "Post-render client feedback" },
    { label: "Approved", desc: "Locked and ready for delivery" }
  ];

  return (
    <div id="pipeline-module-root" className="space-y-8 animate-fade-in text-left">
      {/* Module Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono tracking-[0.25em] text-neutral-400 uppercase">Production Engine</span>
          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1">Creative Production Pipelines</h1>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="bg-white hover:bg-neutral-200 text-black text-xs font-mono py-2 px-4 rounded font-medium flex items-center gap-1.5 transition-colors duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>DISPATCH NEW PROJECT</span>
          </button>
        </div>
      </div>

      {/* Real-time notification toast */}
      {notificationMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-800 text-xs font-mono text-white p-4 rounded-lg shadow-2xl flex items-center gap-3 animate-slide-up">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <BellRing className="w-4 h-4 text-emerald-400" />
          <span>{notificationMsg}</span>
        </div>
      )}

      {/* Grid containing stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {pipelineStages.map((stage) => {
          const matchedProjects = projects.filter(p => p.status === stage.label);

          return (
            <div key={stage.label} className="bg-neutral-950 border border-neutral-900 rounded-lg p-3 flex flex-col min-h-[580px]">
              {/* Stage Header Info */}
              <div className="border-b border-neutral-900 pb-2 mb-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono font-medium text-white tracking-wide uppercase truncate max-w-[80%]">{stage.label}</h3>
                  <span className="text-[10px] font-mono bg-neutral-900 text-neutral-400 px-2 py-0.5 rounded border border-neutral-800">
                    {matchedProjects.length}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-neutral-500 block truncate mt-0.5">{stage.desc}</span>
              </div>

              {/* Projects List within Stage */}
              <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                {matchedProjects.length === 0 ? (
                  <div className="h-full min-h-[120px] border border-dashed border-neutral-900/60 rounded flex items-center justify-center p-3">
                    <span className="text-[9px] font-mono text-neutral-700 uppercase tracking-wider text-center">
                      Pipeline Vacant
                    </span>
                  </div>
                ) : (
                  matchedProjects.map((p) => {
                    const projectAssets = assets.filter(a => a.projectId === p.id);
                    const { isPassed: isEscrowPassed, requirements: escrowReqs } = evaluateEscrowPreflight(p, projectAssets);

                    return (
                      <div 
                        key={p.id}
                        className="bg-neutral-900/30 hover:bg-neutral-900/80 border border-neutral-900 hover:border-neutral-800 p-3 rounded-lg transition-all duration-200 relative group text-xs space-y-3"
                      >
                        {/* Upper Metrics / Integrity Alerts row */}
                        <div className="flex flex-col gap-1.5 border-b border-neutral-900/40 pb-2">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`text-[8px] font-mono tracking-widest border uppercase px-1.5 py-0.5 rounded ${getRiskLabelColor(p.metrics.predictiveDelayRisk)}`}>
                              {p.metrics.predictiveDelayRisk} Delay Risk
                            </span>
                            
                            <span className={`text-[8px] font-mono tracking-widest border uppercase px-1.5 py-0.5 rounded ${
                              escrowReqs.length === 0 ? "text-neutral-500 bg-neutral-900 border-neutral-800" :
                              isEscrowPassed ? "text-emerald-400 bg-emerald-950/20 border-emerald-900/40" :
                              "text-amber-500 bg-amber-950/20 border-amber-900/40 animate-pulse-subtle"
                            }`}>
                              {escrowReqs.length === 0 ? "No Escrow Req" : isEscrowPassed ? "Escrow Locked ✓" : "Escrow Pending ⚠️"}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[9px] text-neutral-500 font-mono">
                            <span>RENDER WEIGHT:</span>
                            <span className="text-neutral-350">{p.metrics.renderTimeEstimate}</span>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-sans text-neutral-200 leading-snug font-medium group-hover:text-white transition-colors">
                            {p.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 font-mono block">Client: {p.clientName}</span>
                        </div>

                        {/* Pipeline Preflight Compliance Checklist on card */}
                        {escrowReqs.length > 0 && (
                          <div className="py-2 px-2 bg-neutral-950/70 border border-neutral-900 rounded font-mono text-[9px] space-y-1">
                            <span className="text-neutral-500 font-bold block uppercase tracking-wider text-[8px]">Pre-flight Escrow Checklist:</span>
                            <div className="space-y-1">
                              {escrowReqs.map((req, rIdx) => (
                                <div key={rIdx} className="flex justify-between items-center">
                                  <span className="truncate max-w-[110px] text-neutral-400">{req.type}</span>
                                  <span className={req.isMet ? "text-emerald-400 font-semibold" : "text-amber-500 font-semibold"}>
                                    {req.status === "Approved" ? "✓" : "PENDING"}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                      {/* Interactive Progress Bar Sliders */}
                      <div className="space-y-1.5 pt-1.5 border-t border-neutral-900/80">
                        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                          <span className="flex items-center gap-1">
                            <Percent className="w-2.5 h-2.5" />
                            <span>PROGRESS:</span>
                          </span>
                          <span className="text-white font-medium">{p.progress}%</span>
                        </div>
                        <input 
                          type="range"
                          min="0"
                          max="100"
                          value={p.progress || 0}
                          onChange={(e) => handleProgressSliderChange(p.id, Number(e.target.value))}
                          className="w-full accent-white bg-neutral-950 h-1 rounded cursor-pointer"
                        />
                      </div>

                      {/* Animator and Budget Specs */}
                      <div className="flex justify-between items-center text-[9.5px] font-mono text-neutral-400 pt-1">
                        <span className="flex items-center gap-1.5">
                          <User className="w-3 h-3 text-neutral-500" />
                          <span className="truncate max-w-[80px]">{p.animatorId}</span>
                        </span>
                        <span className="text-white font-medium">${p.budget.toLocaleString()}</span>
                      </div>

                      {/* Stage Transitions selectors */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pt-2 border-t border-neutral-900 flex justify-between items-center gap-2">
                        <span className="text-[8px] font-mono text-neutral-500 uppercase">TRANSITION:</span>
                        <select
                          value={p.status}
                          onChange={(e) => handleUpdateStatus(p.id, e.target.value as Project["status"])}
                          className="bg-neutral-950 text-[9px] font-mono text-neutral-300 border border-neutral-800 rounded px-1.5 py-0.5 focus:outline-none"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="Scripting">Scripting</option>
                          <option value="Storyboarding">Storyboarding</option>
                          <option value="Asset Generation">Asset Generation</option>
                          <option value="Rendering">Rendering</option>
                          <option value="Revision">Revision</option>
                          <option value="Approved">Approved</option>
                        </select>
                      </div>
                    </div>
                  );
                })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal: Dispatch Project */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 rounded-lg w-full max-w-md p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h2 className="text-base font-sans font-medium text-white tracking-tight">Dispatch Creative Studio Project</h2>
              <button 
                onClick={() => setShowNewProjectModal(false)}
                className="text-neutral-500 hover:text-white font-mono text-xs"
              >
                CLOSE [x]
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs font-mono">
              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase">PROJECT CAMPAIGN NAME</label>
                <input 
                  type="text" 
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Acme Inc Cyberpunk 3D Character Film"
                  className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">CLIENT COMPANY</label>
                  <input 
                    type="text" 
                    required
                    value={newProject.clientName}
                    onChange={(e) => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="e.g. Sterling Luxury"
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">DELIVERY DEADLINE</label>
                  <input 
                    type="date" 
                    required
                    value={newProject.deliveryDate}
                    onChange={(e) => setNewProject({ ...newProject, deliveryDate: e.target.value })}
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">CONTRACT BUDGET ($)</label>
                  <input 
                    type="number" 
                    required
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">ASSIGNED LEAD</label>
                  <select 
                    value={newProject.animatorId}
                    onChange={(e) => setNewProject({ ...newProject, animatorId: e.target.value })}
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  >
                    <option value="Diana Prince">Diana Prince</option>
                    <option value="Tony Stark">Tony Stark</option>
                    <option value="Ada Lovelace">Ada Lovelace</option>
                    <option value="Bruce Wayne">Bruce Wayne</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">PREDICTIVE DELAY RISK</label>
                  <select 
                    value={newProject.predictiveDelayRisk}
                    onChange={(e) => setNewProject({ ...newProject, predictiveDelayRisk: e.target.value as ProjectMetrics["predictiveDelayRisk"] })}
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  >
                    <option value="Low">Low Risk</option>
                    <option value="Medium">Medium Risk</option>
                    <option value="High">High Risk</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-neutral-500 block uppercase">EST. RENDER TIME</label>
                  <input 
                    type="text" 
                    value={newProject.renderTimeEstimate}
                    onChange={(e) => setNewProject({ ...newProject, renderTimeEstimate: e.target.value })}
                    placeholder="e.g. 12 hrs"
                    className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-neutral-500 block uppercase">INITIAL PIPELINE STAGE</label>
                <select 
                  value={newProject.status}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project["status"] })}
                  className="w-full bg-neutral-905 border border-neutral-800 rounded p-2 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                >
                  <option value="Scripting">Scripting</option>
                  <option value="Storyboarding">Storyboarding</option>
                  <option value="Asset Generation">Asset Generation</option>
                  <option value="Rendering">Rendering</option>
                </select>
              </div>

              <div className="pt-4 border-t border-neutral-900 flex justify-end gap-3 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white px-4 py-2"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="bg-white text-black hover:bg-neutral-200 px-4 py-2 rounded font-semibold"
                >
                  DISPATCH TO PIPELINE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
