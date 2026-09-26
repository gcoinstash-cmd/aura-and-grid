/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { Project, CreativeAsset, ClientPortal } from "../types";
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Terminal, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Plus, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  Server, 
  Fingerprint, 
  Cpu, 
  Zap, 
  Radio, 
  Video, 
  Globe, 
  Key,
  Database,
  ArrowRight,
  Sparkles,
  RotateCw,
  FolderLock,
  Download,
  Check,
  Activity,
  UserCheck
} from "lucide-react";

interface ClientSandboxProps {
  portals: ClientPortal[];
  projects: Project[];
  assets: CreativeAsset[];
  onUpdateProject: (project: Project) => void;
  onUpdateAssetStatus: (id: string, status: CreativeAsset["status"]) => void;
  onUpdatePortal: (portal: ClientPortal) => void;
}

interface ReviewComment {
  id: string;
  timestamp: string; // Timecode in video e.g. "00:00:14"
  author: string;
  text: string;
  date: string;
}

export default function ClientSandbox({
  portals,
  projects,
  assets,
  onUpdateProject,
  onUpdateAssetStatus,
  onUpdatePortal
}: ClientSandboxProps) {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedPortalId, setSelectedPortalId] = useState<string>("");
  const [authStage, setAuthStage] = useState<"idle" | "handshake" | "key_verify" | "node_auth" | "success">("idle");
  const [authLogs, setAuthLogs] = useState<string[]>([]);
  const [mfaCode, setMfaCode] = useState<string>("");
  const [isBiometricScanning, setIsBiometricScanning] = useState<boolean>(false);

  // Active client session details
  const [activePortal, setActivePortal] = useState<ClientPortal | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string>("");

  // Media Player states
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playProgress, setPlayProgress] = useState<number>(30); // Start at 30% for visual flavor
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Review comment timeline (local persistence keying on project ID)
  const [projectComments, setProjectComments] = useState<Record<string, ReviewComment[]>>({
    "proj-1": [
      {
        id: "c1",
        timestamp: "00:00:12:15",
        author: "Aetherius Admins (Group MD)",
        text: "The glass material looks stunning. Reflections shift clean.",
        date: "Today at 2:42 PM"
      },
      {
        id: "c2",
        timestamp: "00:00:34:04",
        author: "Diana Prince (Lead Animator)",
        text: "Calibrated particle vectors here to improve gravity fall velocity.",
        date: "Today at 1:15 PM"
      }
    ],
    "proj-2": [
      {
        id: "c3",
        timestamp: "00:00:05:00",
        author: "Sterling Luxury Estates (Director)",
        text: "Sunbeams look breathtaking but narrative overlay sounds flat.",
        date: "Yesterday at 6:30 PM"
      }
    ],
    "proj-3": [
      {
        id: "c4",
        timestamp: "00:00:18:22",
        author: "Elysium Group (Principal)",
        text: "Kinematic joints outline seems correctly centered. Checking run cycles.",
        date: "2 days ago at 9:02 AM"
      }
    ]
  });

  const [newCommentText, setNewCommentText] = useState<string>("");
  const [commentManualTime, setCommentManualTime] = useState<string>("");

  // Cryptographic audit state
  const [auditRunning, setAuditRunning] = useState<boolean>(false);
  const [encryptionMatrix, setEncryptionMatrix] = useState<string>("B827EB9A72A4E290");
  const [localAuditLogs, setLocalAuditLogs] = useState<string[]>([]);

  // Selection project calculation
  const clientProjects = activePortal 
    ? projects.filter(p => activePortal.activeProjectIds.includes(p.id))
    : [];

  const selectedProject = clientProjects.find(p => p.id === activeProjectId) || clientProjects[0];

  // Sync session with core changes
  useEffect(() => {
    if (activePortal) {
      const updated = portals.find(p => p.id === activePortal.id);
      if (updated) setActivePortal(updated);
    }
  }, [portals, activePortal?.id]);

  useEffect(() => {
    if (activePortal && clientProjects.length > 0 && !activeProjectId) {
      setActiveProjectId(clientProjects[0].id);
    }
  }, [activePortal, clientProjects, activeProjectId]);

  // Video timeline loop
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = setInterval(() => {
        setPlayProgress(prev => {
          if (prev >= 100) {
            return 0; // Loop around
          }
          return prev + 0.5;
        });
      }, 100);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    }
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, [isPlaying]);

  // Push audit log helper
  const addAuditLog = (msg: string) => {
    const time = new Date().toISOString().split("T")[1].substring(0, 8);
    setLocalAuditLogs(prev => [`[${time}] ${msg}`, ...prev]);
  };

  // Convert progress (0-100) to timecode HH:MM:SS:FF
  const getTimecode = (progressPercent: number) => {
    const totalFrames = 2520; // 1 minute and 24 seconds at 30 fps
    const currentFrame = Math.floor((progressPercent / 100) * totalFrames);
    
    const minutes = Math.floor(currentFrame / 1800);
    const seconds = Math.floor((currentFrame % 1800) / 30);
    const frames = Math.floor(currentFrame % 30);

    const pad = (num: number) => String(num).padStart(2, "0");
    return `00:${pad(minutes)}:${pad(seconds)}:${pad(frames)}`;
  };

  // Run mock biometrics authentication
  const triggerBiometrics = (portal: ClientPortal) => {
    setIsBiometricScanning(true);
    setAuthLogs([`Initializing Secure Shard Session...`]);
    setAuthStage("handshake");

    setTimeout(() => {
      setAuthLogs(l => [...l, `[ECC-256 Handshake] Exchanging public key tokens...`]);
      setAuthStage("key_verify");
    }, 400);

    setTimeout(() => {
      setAuthLogs(l => [...l, `[TLS 1.3] Authorized node key: ${encryptionMatrix}`]);
      setAuthLogs(l => [...l, `[GATEWAY NETWORK] IP Verified against whitelist node.`]);
      setAuthStage("node_auth");
    }, 900);

    setTimeout(() => {
      setAuthLogs(l => [...l, `[VERIFIED] Signature matched. Granting container session.`]);
      setAuthStage("success");
      setIsBiometricScanning(false);
      
      // Successfully authenticated
      setTimeout(() => {
        setIsAuthenticated(true);
        setActivePortal(portal);
        const related = projects.filter(p => portal.activeProjectIds.includes(p.id));
        if (related.length > 0) {
          setActiveProjectId(related[0].id);
        }
        
        // Add default client audit log
        addAuditLog(`Vault Session Cleared for ${portal.companyName}`);
        addAuditLog(`Auth token validation verified using ECC-256 ECC-CipherKey`);
        if (portal.mfaEnabled) {
          addAuditLog(`Multi-Factor Hardware Key verification checked: [OK]`);
        }
      }, 500);
    }, 1500);
  };

  // Handle post comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText || !selectedProject) return;

    const timecode = commentManualTime || getTimecode(playProgress);
    const newComment: ReviewComment = {
      id: "comment-" + Date.now(),
      timestamp: timecode,
      author: `${activePortal?.companyName || "Client"} Admins`,
      text: newCommentText,
      date: "Just now"
    };

    setProjectComments(prev => ({
      ...prev,
      [selectedProject.id]: [newComment, ...(prev[selectedProject.id] || [])]
    }));

    // Update the portal's security logs
    if (activePortal) {
      const logMsg = `Media Review Annotation posted at timecode [${timecode}] on Project [${selectedProject.name}]`;
      onUpdatePortal({
        ...activePortal,
        securityLogs: [logMsg, ...activePortal.securityLogs]
      });
      addAuditLog(`Client posted frame feedback - frame tracking: ${timecode}`);
    }

    setNewCommentText("");
    setCommentManualTime("");
  };

  // Approve & Clear final deliverable
  const handleApproveProject = () => {
    if (!selectedProject || !activePortal) return;

    // 1. Update project status in parent state
    const updatedProj: Project = {
      ...selectedProject,
      status: "Approved",
      progress: 100,
      metrics: {
        ...selectedProject.metrics,
        predictiveDelayRisk: "Low"
      }
    };
    onUpdateProject(updatedProj);

    // 2. Loop and approve all assets of this project
    const projectAssets = assets.filter(a => a.projectId === selectedProject.id);
    projectAssets.forEach(asset => {
      if (asset.status !== "Approved") {
        onUpdateAssetStatus(asset.id, "Approved");
      }
    });

    // 3. Update active audits and write logs
    const certHash = "SHA-256-" + Math.random().toString(16).substring(2, 10).toUpperCase() + "EA0B3C" + Math.random().toString(16).substring(2, 6).toUpperCase();
    const logMsg = `[ESCROW SHARDS MATURED] Project [${selectedProject.name}] fully cleared & approved. Auth Seal: ${certHash}`;
    
    onUpdatePortal({
      ...activePortal,
      securityLogs: [logMsg, ...activePortal.securityLogs]
    });

    addAuditLog(`PROJECT APPROVED: ${selectedProject.name} status updated to Approved [100%]`);
    addAuditLog(`Cryptographic signature seal applied: ${certHash}`);
    addAuditLog(`Escrow pipelines satisfied. All deliverable files locked & cleared for transport.`);

    // Instantly rotate key
    setEncryptionMatrix(Math.random().toString(16).substring(2, 18).toUpperCase());
  };

  // Trigger Gemini neural audit
  const runNeuralAudit = async () => {
    if (!selectedProject || !activePortal || auditRunning) return;

    setAuditRunning(true);
    addAuditLog(`Initiating Server-Side Neural Audit Evaluation via Gemini API Proxy...`);
    addAuditLog(`Packing asset structures and authentication vectors...`);

    try {
      const projectAssets = assets.filter(a => a.projectId === selectedProject.id);
      const payload = {
        name: selectedProject.name,
        company: activePortal.companyName,
        budget: activePortal.totalContractValue,
        timeline: `Delivery: ${selectedProject.deliveryDate}. Stage: ${selectedProject.status}`,
        industry: "VIP Boutique Production Escrow",
        needs: `Compliance Sweep. Active Project Status: ${selectedProject.status}. Progress: ${selectedProject.progress}%. Assets count: ${projectAssets.length}. Assets array metadata: ${JSON.stringify(projectAssets)}`
      };

      const response = await fetch("/api/gemini/score-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Compliance network response failed.");
      const result = await response.json();

      const complianceScore = activePortal.mfaEnabled 
        ? Math.min(100, result.score + 15) 
        : Math.max(20, result.score - 25);

      addAuditLog(`Neural evaluate resolved score: ${complianceScore}% Integrity Level.`);
      addAuditLog(`Audit Statement: ${result.reasoning?.[0] || "All creative delivery checksums within operational boundaries"}`);
      
      onUpdatePortal({
        ...activePortal,
        securityLogs: [
          `[NEURAL SERVICE AUDIT] Compliance Score: ${complianceScore}%. Checksums validated.`,
          ...activePortal.securityLogs
        ]
      });

    } catch (err) {
      console.warn("Falling back to local offline audit engine...");
      // Simulate slow neural parsing before offline fallthrough
      await new Promise(resolve => setTimeout(resolve, 800));

      const complianceScore = activePortal.mfaEnabled ? 98 : 64;
      addAuditLog(`Neural evaluate resolved: Compliance Score at ${complianceScore}% Integrity index.`);
      addAuditLog(`Audit Statement: Offline fallback checks validated pipeline asset structures successfully.`);
      
      onUpdatePortal({
        ...activePortal,
        securityLogs: [
          `[OFFLINE COMPLIANCE SCRUB] Decoupled trace completed. Score: ${complianceScore}%.`,
          ...activePortal.securityLogs
        ]
      });
    } finally {
      setAuditRunning(false);
    }
  };

  const handleRotateVaultKey = () => {
    const nextKey = Math.random().toString(16).substring(2, 18).toUpperCase();
    setEncryptionMatrix(nextKey);
    addAuditLog(`ECC-256 Encryption key rotated to: ${nextKey}`);
    if (activePortal) {
      onUpdatePortal({
        ...activePortal,
        securityLogs: [`Secure key rotation initiated. New active Matrix: ${nextKey}`, ...activePortal.securityLogs]
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActivePortal(null);
    setAuthStage("idle");
    setAuthLogs([]);
  };

  // Helper method to draw dynamic SVGs inside our review player
  const renderSVGPlayheadVisualization = () => {
    if (!selectedProject) return null;
    
    const progress = playProgress / 100;

    if (selectedProject.id === "proj-1") {
      // 1. CHRONOS HOURS GLASS
      // Dynamic calculations: Sand levels
      const topSandHeight = Math.max(0, 45 - (progress * 45));
      const bottomSandHeight = Math.min(45, progress * 45);
      const sandStreamWeight = progress > 0 ? 3 : 0;

      return (
        <svg viewBox="0 0 200 160" className="w-full h-full text-neutral-400">
          <defs>
            <radialGradient id="glassGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#d97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="sandGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* BG grid lines */}
          <g stroke="#171717" strokeWidth="0.5">
            <line x1="0" y1="40" x2="200" y2="40" />
            <line x1="0" y1="80" x2="200" y2="80" />
            <line x1="0" y1="120" x2="200" y2="120" />
            <line x1="50" y1="0" x2="50" y2="160" />
            <line x1="100" y1="0" x2="100" y2="160" />
            <line x1="150" y1="0" x2="150" y2="160" />
          </g>

          <text x="10" y="20" className="font-mono text-[8px] fill-neutral-600" letterSpacing="1">MODEL: CHRONOS_MESH_S2</text>
          <text x="10" y="30" className="font-mono text-[7px] fill-amber-500/80">REFRAC INDEX: 1.458 (GLASS) • VER: v2.1</text>

          {/* Glowing central orb background */}
          <rect x="70" y="50" width="60" height="60" fill="url(#glassGlow)" className="animate-pulse" />

          {/* Hourglass Glass Silhouette framework */}
          <path d="M 75,35 L 125,35 L 120,40 L 108,75 Q 105,80 108,85 L 120,120 L 125,125 L 75,125 L 80,120 L 92,85 Q 95,80 92,75 L 80,40 Z" fill="none" stroke="#262626" strokeWidth="2" />
          <path d="M 85,40 L 115,40 L 105,75 Q 100,80 105,85 L 115,120 L 85,120 L 95,85 Q 100,80 95,75 Z" fill="none" stroke="#404040" strokeWidth="0.75" strokeDasharray="3 2" />

          {/* Hourglass wood bases */}
          <rect x="68" y="30" width="64" height="6" fill="#171717" rx="1.5" stroke="#404040" strokeWidth="0.5" />
          <rect x="68" y="124" width="64" height="6" fill="#171717" rx="1.5" stroke="#404040" strokeWidth="0.5" />

          {/* Sand: Top Chamber (Diminishes) */}
          {topSandHeight > 0 && (
            <path d={`M ${100 - (topSandHeight * 0.3)}, ${75 - topSandHeight} L ${100 + (topSandHeight * 0.3)}, ${75 - topSandHeight} L 103, 75 Q 100, 77 97, 75 Z`} fill="url(#sandGrad)" opacity="0.9" />
          )}

          {/* Sand Stream (Falling) */}
          {progress > 0 && progress < 0.98 && (
            <line x1="100" y1="76" x2="100" y2="120" stroke="url(#sandGrad)" strokeWidth={sandStreamWeight} strokeDasharray="4 2" />
          )}

          {/* Sand: Bottom Chamber (Accumulates) */}
          {bottomSandHeight > 0 && (
            <path d={`M ${100 - (bottomSandHeight * 0.33)}, 120 L ${100 + (bottomSandHeight * 0.33)}, 120 L ${100 + (bottomSandHeight * 0.15)}, ${120 - (bottomSandHeight * 0.6)} Q 100, ${120 - (bottomSandHeight * 0.82)} ${100 - (bottomSandHeight * 0.15)}, ${120 - (bottomSandHeight * 0.6)} Z`} fill="url(#sandGrad)" opacity="0.9" />
          )}

          {/* Dynamic Coordinates info */}
          <g className="font-mono text-[7px] fill-neutral-500">
            <text x="145" y="60">VERTICES: 842,109</text>
            <text x="145" y="70">GRAVITY: 9.81m/s²</text>
            <text x="145" y="80" className="fill-amber-500">FLOW SPEED: ACTIVE</text>
            <text x="145" y="90">CACHE: SECURED</text>
          </g>

          {/* Playhead keypoints */}
          <circle cx={40 + (progress * 120)} cy="142" r="3" fill="#f59e0b" />
          <line x1={40 + (progress * 120)} y1="142" x2={40 + (progress * 120)} y2="135" stroke="#f59e0b" strokeWidth="0.75" />
          <line x1="40" y1="142" x2="160" y2="142" stroke="#262626" strokeWidth="1" />
        </svg>
      );
    } else if (selectedProject.id === "proj-2") {
      // 2. STERLING LUXURY WALKTHROUGH (ATRIUM ROTATION)
      // Rotational matrix illusion based on progress
      const rot = progress * 360;
      const r_sin = Math.sin(rot * Math.PI / 180) * 15;
      const r_cos = Math.cos(rot * Math.PI / 180) * 15;

      return (
        <svg viewBox="0 0 200 160" className="w-full h-full text-neutral-400">
          {/* BG grids */}
          <g stroke="#121212" strokeWidth="0.5">
            <circle cx="100" cy="80" r="40" fill="none" />
            <circle cx="100" cy="80" r="60" fill="none" />
            <line x1="40" y1="80" x2="160" y2="80" />
            <line x1="100" y1="20" x2="100" y2="140" />
          </g>

          <text x="10" y="20" className="font-mono text-[8px] fill-neutral-600" letterSpacing="1">RIG: ATRIUM_RAYTRACE_3D</text>
          <text x="10" y="30" className="font-mono text-[7px] fill-emerald-500/80">RENDER NODE: ACTIVE (48 HRS EST)</text>

          {/* Dynamic 3D Room lines skeleton representing architectural viewport */}
          <g stroke="#ffffff" strokeOpacity="0.15" strokeWidth="1" fill="none">
            {/* Center ceiling point */}
            <circle cx="100" cy="50" r="2" fill="none" stroke="#10b981" strokeWidth="1.5" />
            
            {/* Corner columns shifting perspective based on playhead */}
            <line x1="40" y1="130" x2={`${100 - r_cos}`} y2={`${80 - r_sin}`} stroke="#404040" />
            <line x1="160" y1="130" x2={`${100 + r_cos}`} y2={`${80 + r_sin}`} stroke="#404040" />
            <line x1="50" y1="30" x2={`${100 - r_cos * 0.5}`} y2={`${70 - r_sin * 0.5}`} stroke="#404040" />
            <line x1="150" y1="30" x2={`${100 + r_cos * 0.5}`} y2={`${70 + r_sin * 0.5}`} stroke="#404040" />

            {/* Connecting luxury glass skylight frame */}
            <polygon points={`
              ${100 - r_cos},${80 - r_sin} 
              ${100 - r_cos * 0.5},${70 - r_sin * 0.5} 
              ${100 + r_cos * 0.5},${70 + r_sin * 0.5} 
              ${100 + r_cos},${80 + r_sin}
            `} stroke="#10b981" strokeWidth="0.75" />
            
            {/* Base block floors */}
            <line x1="20" y1="130" x2="180" y2="130" stroke="#374151" strokeWidth="2" />
            
            {/* Moving light vector ray */}
            <line x1={`${100 + r_cos * 0.8}`} y1={`${80 + r_sin * 0.8}`} x2="100" y2="50" stroke="#10b981" strokeWidth="0.5" strokeDasharray="3 3" />
          </g>

          <g className="font-mono text-[7px] fill-neutral-500">
            <text x="142" y="60">ROT: {rot.toFixed(1)}°</text>
            <text x="142" y="70">Z-SHARDS: Gated</text>
            <text x="142" y="80" className="fill-emerald-400">FPS: 60.00</text>
            <text x="142" y="90">LIGHT: ON_RAY</text>
          </g>

          {/* Wireframe overlay indicators */}
          <rect x="70" y="145" width="60" height="4" fill="#0c0a09" border="none" stroke="#262626" strokeWidth="0.5" />
          <rect x="70" y="145" width={60 * progress} height="4" fill="#10b981" border="none" />
        </svg>
      );
    } else {
      // 3. ELYSIUM CYBERNETIC CHARACTER (RUN CYCLE)
      // Simulated skeletal kinematics running coordinates
      const phase = progress * Math.PI * 4; // Two complete strides
      const leg1Angle = Math.sin(phase) * 20;
      const leg2Angle = -Math.sin(phase) * 20;
      const headBob = Math.abs(Math.sin(phase * 2)) * 3;

      const hipX = 100;
      const hipY = 85 - headBob;
      
      const knee1X = hipX - 10 + Math.sin(phase) * 10;
      const knee1Y = hipY + 20 + Math.cos(phase) * 5;
      const foot1X = knee1X + Math.sin(phase + 0.5) * 15;
      const foot1Y = hipY + 40;

      const knee2X = hipX + 10 - Math.sin(phase) * 10;
      const knee2Y = hipY + 20 - Math.cos(phase) * 5;
      const foot2X = knee2X - Math.sin(phase + 0.5) * 15;
      const foot2Y = hipY + 40;

      return (
        <svg viewBox="0 0 200 160" className="w-full h-full text-neutral-400">
          {/* Background coordinates matrix */}
          <g stroke="#18181b" strokeWidth="0.5" strokeDasharray="1 3">
            <line x1="0" y1="40" x2="200" y2="40" />
            <line x1="0" y1="80" x2="200" y2="80" />
            <line x1="0" y1="125" x2="200" y2="125" />
            <line x1="75" y1="0" x2="75" y2="160" />
            <line x1="125" y1="0" x2="125" y2="160" />
          </g>

          <text x="10" y="20" className="font-mono text-[8px] fill-neutral-600" letterSpacing="1">RIGID: INDIVIDUAL_BONES</text>
          <text x="10" y="30" className="font-mono text-[7px] fill-indigo-400/80">INVERSE KINEMATICS: VERIFIED (90%)</text>

          {/* Ground alignment matrix line */}
          <line x1="30" y1="125" x2="170" y2="125" stroke="#27272a" strokeWidth="1.5" />

          {/* Skeleton drawing */}
          <g stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Spine */}
            <line x1={hipX} y1={hipY} x2={hipX} y2={hipY - 25} stroke="#a5b4fc" />
            
            {/* Shoulders */}
            <line x1={hipX - 12} y1={hipY - 22} x2={hipX + 12} y2={hipY - 22} stroke="#a5b4fc" />
            
            {/* Head */}
            <circle cx={hipX} cy={hipY - 34} r="5" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />

            {/* Arm 1 (swings opposite leg) */}
            <line x1={hipX - 10} y1={hipY - 22} x2={hipX - 18 + Math.sin(phase + Math.PI) * 8} y2={hipY - 5} />
            <line x1={hipX - 18 + Math.sin(phase + Math.PI) * 8} y1={hipY - 5} x2={hipX - 12 + Math.sin(phase + Math.PI) * 12} y2={hipY + 8} />

            {/* Arm 2 */}
            <line x1={hipX + 10} y1={hipY - 22} x2={hipX + 18 - Math.sin(phase + Math.PI) * 8} y2={hipY - 5} />
            <line x1={hipX + 18 - Math.sin(phase + Math.PI) * 8} y1={hipY - 5} x2={hipX + 12 - Math.sin(phase + Math.PI) * 12} y2={hipY + 8} />

            {/* Pelvis hips line */}
            <line x1={hipX - 8} y1={hipY} x2={hipX + 8} y2={hipY} stroke="#818cf8" />

            {/* Leg 1 */}
            <line x1={hipX - 8} y1={hipY} x2={knee1X} y2={knee1Y} stroke="#818cf8" />
            <line x1={knee1X} y1={knee1Y} x2={foot1X} y2={125} stroke="#6366f1" />
            <line x1={foot1X} y1={125} x2={foot1X + 6} y2={125} stroke="#4f46e5" strokeWidth="3" />

            {/* Leg 2 */}
            <line x1={hipX + 8} y1={hipY} x2={knee2X} y2={knee2Y} stroke="#818cf8" />
            <line x1={knee2X} y1={knee2Y} x2={foot2X} y2={125} stroke="#6366f1" />
            <line x1={foot2X} y1={125} x2={foot2X + 6} y2={125} stroke="#4f46e5" strokeWidth="3" />
          </g>

          <g className="font-mono text-[7px] fill-neutral-500">
            <text x="138" y="60">BONE_L1: {knee1Y.toFixed(0)}px</text>
            <text x="138" y="70">GAIT VEL: 1.4 m/s</text>
            <text x="138" y="80" className="fill-indigo-400">COMP RATE: OK</text>
            <text x="138" y="90">T-POS CHK: PASS</text>
          </g>

          {/* Small status matrix panel */}
          <rect x="25" y="145" width="150" height="4" fill="#0d0d12" stroke="#222235" strokeWidth="0.5" />
          <rect x="25" y="145" width={150 * progress} height="4" fill="#6366f1" />
        </svg>
      );
    }
  };

  if (!isAuthenticated) {
    /* ========================================================================= */
    /*   1. PREMIUM SIMULATED AUTH GATEWAY / LOCKSCREEN                          */
    /* ========================================================================= */
    return (
      <div id="client-escrow-auth-root" className="min-h-[80vh] flex items-center justify-center py-12 px-4 animate-fade-in relative z-10 text-left">
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg max-w-xl w-full p-8 space-y-8 shadow-2xl relative overflow-hidden">
          {/* Subtle branding details inside vault */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-44 h-44 bg-neutral-850/30 rounded-full blur-2xl pointer-events-none"></div>

          <div className="border-b border-neutral-900 pb-5 space-y-2">
            <div className="flex items-center gap-2 text-neutral-400 font-mono text-[10.5px] uppercase tracking-[0.2em]">
              <Key className="w-3.5 h-3.5 text-amber-500" />
              <span>MotionScale Container OS</span>
            </div>
            <h1 className="text-2xl font-sans font-medium text-white tracking-tight">Secured Client Containment Portal</h1>
            <p className="text-xs text-neutral-500 font-mono">Select a VIP company portal sequence to simulate encryption validation and enter sandbox environment.</p>
          </div>

          {authStage === "idle" ? (
            <div className="space-y-4">
              <label className="text-[10px] font-mono text-neutral-400 block uppercase tracking-wider font-semibold">SELECT SIMULATED ID GATEWAY:</label>
              
              <div className="space-y-3">
                {portals.map((portal) => {
                  const projectCount = projects.filter(p => portal.activeProjectIds.includes(p.id)).length;
                  return (
                    <button
                      key={portal.id}
                      onClick={() => triggerBiometrics(portal)}
                      className="w-full text-left bg-neutral-950 hover:bg-neutral-900/50 border border-neutral-900 hover:border-neutral-800 p-4 rounded-md transition-all duration-200 flex items-center justify-between group"
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 font-mono block tracking-widest uppercase">ENTERPRISE PORTAL</span>
                        <h3 className="text-sm font-sans font-medium text-white group-hover:text-amber-400 transition-colors">{portal.companyName}</h3>
                        <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-400">
                          <span>Value: ${(portal.totalContractValue / 1000).toFixed(0)}k</span>
                          <span>•</span>
                          <span>{projectCount} Active Pipeline{projectCount === 1 ? "" : "s"}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {portal.mfaEnabled && (
                          <span className="text-[9px] font-mono bg-emerald-950/20 text-emerald-400 border border-emerald-900/40 px-1.5 py-0.5 rounded uppercase font-semibold">
                            MFA Shard
                          </span>
                        )}
                        <span className="bg-neutral-900 p-2 rounded border border-neutral-850 group-hover:bg-neutral-800 transition-colors">
                          <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-neutral-900/20 border border-neutral-900 p-3.5 rounded font-mono text-[10.5px] text-neutral-500 flex gap-2.5 items-start mt-6">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                <p className="leading-normal">
                  Our Secure Containment System locks down all client assets under isolated ECC-256 validation rooms. Internal financial ledgers, task distributions, and employee rosters are entirely stripped from client endpoints.
                </p>
              </div>
            </div>
          ) : (
            /* ================= SIMULATING AUTHENTICATION HANDSHAKE LOADER ================= */
            <div className="space-y-6 py-6 flex flex-col items-center justify-center text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-neutral-900 flex items-center justify-center">
                  <Fingerprint className={`w-8 h-8 text-amber-500 ${isBiometricScanning ? "animate-pulse" : ""}`} />
                </div>
                {authStage !== "success" && (
                  <div className="absolute inset-0 border-t-2 border-amber-500 rounded-full animate-spin"></div>
                )}
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-mono text-white uppercase tracking-widest">
                  {authStage === "handshake" && "Initiating Key Verification..."}
                  {authStage === "key_verify" && "Analyzing SHA Tokens..."}
                  {authStage === "node_auth" && "Authorizing Secure Port..."}
                  {authStage === "success" && "Access Sequence Loaded ✅"}
                </h3>
                <p className="text-[10.5px] text-neutral-500 font-mono">ECC-256 Bit Locker System is authorizing connection.</p>
              </div>

              {/* Shifting log block */}
              <div className="w-full bg-neutral-950/80 border border-neutral-900 p-3 text-left rounded-md font-mono text-[10px] space-y-1 h-36 overflow-y-auto">
                {authLogs.map((log, idx) => (
                  <div key={idx} className="text-neutral-400 flex items-start gap-1">
                    <span className="text-amber-500 select-none">&gt;</span>
                    <span className="truncate">{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /*   2. EXCLUSIVE LUXURY DARK SESSION UI                                     */
  /* ========================================================================= */
  return (
    <div id="secured-client-vault-session" className="space-y-8 animate-fade-in text-left">
      
      {/* Session Title Bar */}
      <div className="border-b border-neutral-900 pb-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>SECURED VAULT CONTAINER CONSOLE</span>
            </span>
            <span className="text-[9px] font-mono bg-emerald-950/20 text-emerald-400 border border-emerald-950 px-1.5 py-0.2 rounded uppercase font-semibold">
              TLS 1.3 SIGNED
            </span>
          </div>

          <h1 className="text-3xl font-sans font-medium text-white tracking-tight mt-1 flex items-center gap-2">
            <span>{activePortal?.companyName}</span>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 border border-neutral-900 px-2 py-0.5 rounded ml-2">
              ID: {activePortal?.id.toUpperCase()}
            </span>
          </h1>

          <p className="text-xs text-neutral-400 font-mono mt-1">
            Enterprise Deliverable Review Station & Cryptographic Sandbox Locker.
          </p>
        </div>

        {/* Top Session Actions */}
        <div className="flex gap-3">
          <button
            onClick={() => {
              addAuditLog(`Manual integrity refresh requested by customer.`);
              handleRotateVaultKey();
            }}
            className="border border-neutral-900 hover:border-neutral-800 hover:text-white bg-neutral-950 text-neutral-400 font-mono text-xs px-3.5 py-2 flex items-center gap-1.5 transition-all rounded"
          >
            <RotateCw className="w-3.5 h-3.5 text-neutral-500" />
            <span>ROTATE KEYS</span>
          </button>

          <button
            onClick={handleLogout}
            className="bg-white hover:bg-neutral-200 text-black font-semibold text-xs font-mono px-4 py-2 flex items-center gap-1.5 transition-all rounded"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>DISCONNECT VAULT</span>
          </button>
        </div>
      </div>

      {/* Main Container Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Active connection item card */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 font-mono text-xs flex flex-row items-center gap-3">
          <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-amber-400">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">CLIENT SIGNATURE</span>
            <span className="text-white block font-medium">ECC-256 VERIFIED</span>
          </div>
        </div>

        {/* MFA block item card */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 font-mono text-xs flex flex-row items-center gap-3">
          <div className={`p-2.5 rounded border ${
            activePortal?.mfaEnabled 
              ? "bg-emerald-950/20 text-emerald-400 border-emerald-900/30" 
              : "bg-red-950/20 text-red-400 border-red-900/30"
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">MFA SECURED</span>
            <span className="text-white block font-semibold uppercase">{activePortal?.mfaEnabled ? "Hardware Token active" : "HARDWARE MUTED"}</span>
          </div>
        </div>

        {/* IP autorization code */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 font-mono text-xs flex flex-row items-center gap-3">
          <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-indigo-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">IP NODE CODE</span>
            <span className="text-white block font-medium">188.40.23.11 [SECURE]</span>
          </div>
        </div>

        {/* Active Project list context */}
        <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-4 font-mono text-xs flex flex-row items-center gap-3">
          <div className="p-2.5 bg-neutral-900 rounded border border-neutral-800 text-purple-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-neutral-500 block uppercase font-bold">SECURED CONTRACT VALUE</span>
            <span className="text-white block font-semibold">${(activePortal?.totalContractValue || 0).toLocaleString()} USD</span>
          </div>
        </div>

      </div>

      {/* Primary Deliverable Review Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Media Player (Span 8) */}
        <div className="lg:col-span-8 bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-5 flex flex-col justify-between overflow-hidden">
          
          {/* Deliverable review header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-900 pb-3 font-mono text-xs">
            <div>
              <span className="text-[10px] text-neutral-500 block uppercase font-semibold">Active Review Target File</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-white font-medium uppercase text-sm">SELECT RE-RENDER DECK:</span>
                <select
                  value={activeProjectId}
                  onChange={(e) => setActiveProjectId(e.target.value)}
                  className="bg-neutral-900 text-xs font-mono text-white border border-neutral-800 rounded px-2.5 py-1 focus:outline-none"
                >
                  {clientProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:items-end text-[10px] text-neutral-400 space-y-0.5">
              <div>
                <span>BUDGET:</span> <span className="font-semibold text-white">${selectedProject?.budget.toLocaleString()}</span>
              </div>
              <div>
                <span>EST. RENDER:</span> <span className="font-semibold text-amber-400">{selectedProject?.metrics.renderTimeEstimate}</span>
              </div>
            </div>
          </div>

          {/* Media Player Frame Container */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg overflow-hidden flex flex-col relative">
            
            {/* Top diagnostic metadata layer overlay */}
            <div className="p-3 bg-neutral-950 border-b border-neutral-900/60 font-mono text-[10px] flex items-center justify-between z-10 text-neutral-400">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isPlaying ? "bg-red-500 animate-pulse" : "bg-neutral-600"}`}></div>
                <span>STREAM: DECRYPTED_DIRECT_MESH_SERVER</span>
              </div>
              <div className="text-[9px] bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded text-neutral-500">
                FRAME RATE: 30FPS • PROGRESS: {playProgress.toFixed(0)}%
              </div>
            </div>

            {/* Simulated interactive video display workspace */}
            <div className="h-64 sm:h-80 bg-neutral-950/60 flex items-center justify-center p-6 relative">
              {/* Dynamic canvas schematic vector drawings */}
              {renderSVGPlayheadVisualization()}
              
              {/* Timecode absolute HUD badge */}
              <div className="absolute bottom-3 left-4 bg-black/80 backdrop-blur-sm border border-neutral-900 px-3 py-1 rounded font-mono text-xs tracking-widest text-[#22c55e]">
                {getTimecode(playProgress)}
              </div>

              {/* Status prompt badge if fully approved */}
              {selectedProject?.status === "Approved" && (
                <div className="absolute inset-x-0 inset-y-0 bg-black/60 flex items-center justify-center p-4 z-20">
                  <div className="bg-neutral-950 border border-neutral-800 rounded p-6 max-w-sm text-center space-y-3.5 shadow-xl font-mono text-xs">
                    <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
                    <div>
                      <span className="text-white font-bold block uppercase tracking-widest">FINAL ASS-CLEARED</span>
                      <p className="text-[11px] text-neutral-400 mt-1 leading-normal">This deliverable is locked & certified. High-res transport links have matured.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Play controls bar panel */}
            <div className="p-3.5 bg-neutral-900/40 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
              
              {/* Scrub timeline bar */}
              <div className="w-full flex items-center gap-3.5">
                <span className="text-[10px] text-neutral-500 select-none">00:00</span>
                <div 
                  className="flex-1 bg-neutral-950 border border-neutral-900 h-2.5 rounded-full cursor-pointer relative overflow-hidden"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = (clickX / rect.width) * 100;
                    setPlayProgress(percent);
                    addAuditLog(`Scrubbed visual timeline to: ${getTimecode(percent)}`);
                  }}
                >
                  <div 
                    className="bg-amber-500 h-full transition-all duration-75 relative" 
                    style={{ width: `${playProgress}%` }}
                  >
                    {/* Glowing endpoint handle */}
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]"></div>
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500 select-none">01:24</span>
              </div>

              {/* Functional playback controls buttons row */}
              <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-neutral-300 hover:text-white p-2 rounded transition-colors"
                    title={isPlaying ? "Pause review" : "Play review stream"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => {
                      setPlayProgress(0);
                      setIsPlaying(false);
                      addAuditLog(`Rewound review media back to frame zero [00:00]`);
                    }}
                    className="bg-neutral-950 hover:bg-neutral-900 border border-neutral-900 text-neutral-300 hover:text-white p-2 rounded transition-colors"
                    title="Rewind"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-neutral-500 hover:text-white p-1 transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-emerald-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="text-[10px] text-neutral-500 uppercase">Stereo Shards</span>
                </div>
              </div>

            </div>

          </div>

          {/* Secure Download triggers overlay */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 font-mono text-xs">
            
            <div className="bg-neutral-900/10 border border-neutral-900/80 rounded-md p-3.5 flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold text-left">Pipeline Phase Lock</span>
                <p className="text-[11px] text-neutral-400 mt-1 leading-normal text-left">
                  This media review window shows a sandboxed client version hash. The escrow pipeline restricts high-fidelity source meshes until signature clearance is active.
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] pt-3 mt-3 border-t border-neutral-900/40">
                <span className="text-neutral-500">ESCROW CHECKLIST:</span>
                <span className={`font-semibold uppercase ${selectedProject?.status === "Approved" ? "text-emerald-400" : "text-amber-500 animate-pulse-subtle"}`}>
                  {selectedProject?.status === "Approved" ? "CLEARED ✓" : "ESCROW ACTIVE ⚠️"}
                </span>
              </div>
            </div>

            {/* Elite Command Action approve deliverable */}
            <div className="bg-neutral-900/10 border border-neutral-900/80 rounded-md p-3.5 flex flex-col justify-between gap-3">
              <div>
                <span className="text-[10px] text-neutral-500 block uppercase font-bold text-left text-amber-500">Final Clearance Action</span>
                <p className="text-[11px] text-neutral-400 mt-1 leading-normal text-left">
                  Approve and clear this project deliverable. This action dispatches a cryptographic TLS lock on active meshes and triggers creative CFO invoices from billing lanes.
                </p>
              </div>

              {selectedProject?.status === "Approved" ? (
                <div className="bg-emerald-950/25 border border-emerald-900/40 text-emerald-400 font-bold p-2.5 rounded font-mono text-center flex items-center justify-center gap-1.5 uppercase">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>PROJECT CERTIFIED & LOCKED</span>
                </div>
              ) : (
                <button
                  onClick={handleApproveProject}
                  className="w-full bg-[#10b981] hover:bg-[#059669] text-black font-semibold text-xs py-2.5 rounded flex items-center justify-center gap-1.5 transition-colors uppercase"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Approve & Clear Final Asset</span>
                </button>
              )}
            </div>

          </div>

        </div>

        {/* Right Column: Review timeline & Security Logs (Span 4) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Deliverable review station timeline comments */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
            <span className="text-xs font-mono text-neutral-500 uppercase block tracking-widest font-semibold border-b border-neutral-900 pb-2">
              Review Annotation Log
            </span>

            {/* Input Comment action */}
            <form onSubmit={handleAddComment} className="space-y-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-neutral-500 uppercase tracking-wide">POST TIMESTAMP ANNOTATION</label>
                  <button 
                    type="button"
                    onClick={() => setCommentManualTime(getTimecode(playProgress))}
                    className="text-[9.5px] text-amber-500 hover:underline"
                  >
                    Set playhead time [{getTimecode(playProgress).substring(3, 8)}]
                  </button>
                </div>
                <input 
                  type="text"
                  required
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="e.g. Highlight refraction looks heavy in lower quadrant..."
                  className="w-full bg-neutral-900 border border-neutral-850 rounded px-2.5 py-1.8 text-[11px] text-white focus:outline-none focus:border-neutral-600 font-mono"
                />
              </div>

              <div className="flex gap-2">
                <input 
                  type="text"
                  value={commentManualTime}
                  onChange={(e) => setCommentManualTime(e.target.value)}
                  placeholder="Time override (e.g. 00:00:30)"
                  className="w-1/2 bg-neutral-900 border border-neutral-850 rounded px-2.5 py-1.5 text-[10px] text-neutral-300 focus:outline-none focus:border-neutral-600 font-mono"
                />
                <button
                  type="submit"
                  className="w-1/2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-white font-semibold text-[11px]"
                >
                  LOG ANNOTATION
                </button>
              </div>
            </form>

            {/* Comments List rendering */}
            <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
              {!selectedProject || !projectComments[selectedProject.id] || projectComments[selectedProject.id].length === 0 ? (
                <p className="text-[11px] font-mono text-neutral-600 italic text-center py-6">No annotations posted under this review file yet.</p>
              ) : (
                projectComments[selectedProject.id].map((com) => (
                  <div key={com.id} className="p-3 bg-neutral-900/30 border border-neutral-900/40 rounded text-left space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-white truncate max-w-[150px]">{com.author}</span>
                      <span className="text-neutral-500 text-[9px] shrink-0">{com.date}</span>
                    </div>
                    <div className="font-mono text-[9px] text-amber-400 bg-neutral-950/80 px-1 rounded border border-neutral-900/50 inline-block">
                      At {com.timestamp}
                    </div>
                    <p className="text-xs text-neutral-400 font-sans leading-normal pt-1 break-words">{com.text}</p>
                  </div>
                ))
              )}
            </div>

          </div>

          {/* Cryptographic Security Box */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-2">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest font-semibold flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-neutral-400" />
                <span>ECC-256 Auth Monitor</span>
              </span>
              <span className="text-[9.5px] font-mono text-[#10b981] bg-[#14532d]/25 px-1.5 rounded uppercase">Encrypted</span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="bg-neutral-950/80 border border-neutral-900 p-2.5 rounded space-y-1 text-neutral-400">
                <div className="flex justify-between text-[10px]">
                  <span>ECC HANDSHAKE CODE:</span>
                  <span className="text-white font-bold">{encryptionMatrix}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>MFA CIPHER SHARD:</span>
                  <span className="text-neutral-500 font-semibold uppercase">{activePortal?.mfaEnabled ? "Key Matched OK" : "Muted"}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>SESSION IP AUTH:</span>
                  <span className="text-amber-500 font-semibold truncate max-w-[130px]">188.40.23.11</span>
                </div>
              </div>

              {/* Run Compliance Audit button */}
              <button
                onClick={runNeuralAudit}
                disabled={auditRunning}
                className="w-full border border-neutral-850 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-850 text-[10.5px] py-1.8 rounded flex items-center justify-center gap-1.5 transition-all text-neutral-300 hover:text-white"
              >
                <Sparkles className={`w-3.5 h-3.5 text-neutral-400 ${auditRunning ? "animate-pulse" : ""}`} />
                <span>{auditRunning ? "SCRUBBING PIPELINES..." : "COMPLIANCE NEURAL AUDIT"}</span>
              </button>
            </div>

          </div>

          {/* live audit log of this sandbox */}
          <div className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest block font-semibold">
                Locker Event Audits
              </span>
              <span className="text-[9px] font-mono bg-neutral-900 text-neutral-500 px-1.5 rounded">REAL-TIME</span>
            </div>

            <div className="bg-neutral-950/60 border border-neutral-900 rounded-md p-3 font-mono text-[10px] space-y-2 h-44 overflow-y-auto text-left">
              {localAuditLogs.length === 0 ? (
                <div className="py-12 text-center text-neutral-600 italic">Locker pipeline is clean. Waiting for events...</div>
              ) : (
                localAuditLogs.map((log, index) => (
                  <div key={index} className="text-neutral-400 border-b border-neutral-900/60 pb-1 flex items-start gap-1">
                    <span className="text-[#a3a3a3] select-none">&gt;</span>
                    <span className="leading-normal break-words w-full">{log}</span>
                  </div>
                ))
              )}
            </div>
            
            <p className="text-[10px] font-mono text-neutral-500 italic leading-snug">
              Each customer activity is hashed and signed on server-side nodes to guarantee immutable creative delivery compliance records.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
