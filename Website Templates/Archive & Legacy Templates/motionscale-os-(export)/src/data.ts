/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Project, CreativeAsset, ClientPortal, FinancialInvoice } from "./types";

// Realistic elite mock data for MotionScale Creative Production OS

export const INITIAL_PROJECTS: Project[] = [
  {
    id: "proj-1",
    name: "Aetherius Brand Campaign: Chronos",
    status: "Rendering",
    deliveryDate: "2026-06-12",
    budget: 85000,
    clientName: "Aetherius Capital",
    animatorId: "Diana Prince",
    progress: 75,
    metrics: {
      predictiveDelayRisk: "Low",
      renderTimeEstimate: "14 hrs"
    }
  },
  {
    id: "proj-2",
    name: "Sterling Estates: Hyper-Realistic Walkthrough",
    status: "Asset Generation",
    deliveryDate: "2026-06-28",
    budget: 120000,
    clientName: "Sterling Luxury Estates",
    animatorId: "Tony Stark",
    progress: 40,
    metrics: {
      predictiveDelayRisk: "Medium",
      renderTimeEstimate: "48 hrs"
    }
  },
  {
    id: "proj-3",
    name: "Elysium Cybernetic Character Short",
    status: "Revision",
    deliveryDate: "2026-06-05",
    budget: 45000,
    clientName: "Elysium Group",
    animatorId: "Ada Lovelace",
    progress: 90,
    metrics: {
      predictiveDelayRisk: "High",
      renderTimeEstimate: "8 hrs"
    }
  },
  {
    id: "proj-4",
    name: "Vance Agency Luxury Logo Reveal",
    status: "Scripting",
    deliveryDate: "2026-07-15",
    budget: 15000,
    clientName: "Vance Agency Ltd",
    animatorId: "Bruce Wayne",
    progress: 15,
    metrics: {
      predictiveDelayRisk: "Low",
      renderTimeEstimate: "2 hrs"
    }
  }
];

export const INITIAL_CREATIVE_ASSETS: CreativeAsset[] = [
  {
    id: "asset-1",
    projectId: "proj-1",
    name: "Chronos Glass Timer 3D Mesh",
    type: "3D Model",
    version: "v2.1",
    status: "Approved",
    fileUrl: "/assets/mesh_timer_final.fbx"
  },
  {
    id: "asset-2",
    projectId: "proj-1",
    name: "Ambient Synthesizer Soundbed",
    type: "Audio",
    version: "v1.0",
    status: "Draft",
    fileUrl: "/assets/ambient_chrono_music.wav"
  },
  {
    id: "asset-3",
    projectId: "proj-2",
    name: "Main High-Atrium Rigging Model",
    type: "Rig",
    version: "v3.4",
    status: "Draft",
    fileUrl: "/assets/atrium_lighting_rig.blend"
  },
  {
    id: "asset-4",
    projectId: "proj-2",
    name: "Architectural Narrator Voiceover",
    type: "Voiceover",
    version: "v1.2",
    status: "Approved",
    fileUrl: "/assets/vo_walkthrough_stereo.mp3"
  },
  {
    id: "asset-5",
    projectId: "proj-3",
    name: "Elysium Cyber Cyborg Run Cycle",
    type: "Rig",
    version: "v1.1",
    status: "Approved",
    fileUrl: "/assets/cyborg_bipedal_rig.fbx"
  },
  {
    id: "asset-6",
    projectId: "proj-3",
    name: "Neon Volumetric Smoke FX Overlay",
    type: "B-Roll",
    version: "v2.0",
    status: "Draft",
    fileUrl: "/assets/volumetric_smoke_4k.mp4"
  }
];

export const INITIAL_PORTALS: ClientPortal[] = [
  {
    id: "portal-1",
    companyName: "Aetherius Capital",
    activeProjectIds: ["proj-1"],
    totalContractValue: 85000,
    mfaEnabled: true,
    securityLogs: [
      "Access authorized from London Node [IP: 188.40.23.11]",
      "3D Model Shard decrypted successfully for preview",
      "Draft audio overlay flagged for review revision"
    ]
  },
  {
    id: "portal-2",
    companyName: "Sterling Luxury Estates",
    activeProjectIds: ["proj-2"],
    totalContractValue: 120000,
    mfaEnabled: true,
    securityLogs: [
      "Principal architect logged in [IP: 74.125.19.14]",
      "Voiceover asset approved for production use",
      "Security audit sweep completed: clean"
    ]
  },
  {
    id: "portal-3",
    companyName: "Elysium Group",
    activeProjectIds: ["proj-3"],
    totalContractValue: 45000,
    mfaEnabled: false,
    securityLogs: [
      "Anonymous guest preview requested from IP [45.10.154.2]",
      "Caution: Multi-factor verification security is deactivated"
    ]
  }
];

export const INITIAL_INVOICES: FinancialInvoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "MS-2026-001",
    amount: 42500,
    status: "Paid",
    projectId: "proj-1",
    dueDate: "2026-05-10"
  },
  {
    id: "inv-2",
    invoiceNumber: "MS-2026-002",
    amount: 42500,
    status: "Sent",
    projectId: "proj-1",
    dueDate: "2026-06-15"
  },
  {
    id: "inv-3",
    invoiceNumber: "MS-2026-003",
    amount: 60000,
    status: "Paid",
    projectId: "proj-2",
    dueDate: "2016-05-20"
  },
  {
    id: "inv-4",
    invoiceNumber: "MS-2026-004",
    amount: 60000,
    status: "Draft",
    projectId: "proj-2",
    dueDate: "2026-07-01"
  },
  {
    id: "inv-5",
    invoiceNumber: "MS-2026-005",
    amount: 45000,
    status: "Overdue",
    projectId: "proj-3",
    dueDate: "2026-04-18"
  }
];

// High Ticket Marketing & Sales Blueprint Materials for MotionScale
export const GUMROAD_BLUEPRINT_SECTIONS = {
  header: "MotionScale Studio OS: The $1,000+ Production Blueprint",
  overview: "An elite creative studio operating system. Designed to streamline assets, timeline rendering milestones, client portal compliance review, and studio financials natively. Perfect for high-end boutique motion houses booking $10k+ to $50k+ commercial projects.",
  
  architecture: {
    title: "1. Connected Architecture Modules",
    desc: "Why agencies fail and how MotionScale OS establishes architectural control: it bridges complex creative assets directly into client review systems and dynamic billing models.",
    modules: [
      {
        name: "I. Render Pipelines & Timelines",
        desc: "Tracks project stages from Scripting/Storyboards to active Frame Rendering. Highlights real-time rendering statistics, estimated render frame times, and predictive delay warnings."
      },
      {
        name: "II. Asset Escrow & Versioning Shards",
        desc: "Strictly logs active 3D Meshes, rig maps, sound beds and voiceovers. Allows fast draft feedback and secure high-frequency deliverable approvals to prevent production loops."
      },
      {
        name: "III. Creative CFO Invoice Ledger",
        desc: "Integrates directly with outstanding project milestones. Automates midpoints, flags overdue invoices, and allows instant advisory generation to safeguard liquid buffers."
      },
      {
        name: "IV. Secured Granular Client Portals",
        desc: "Locks clients in isolated, multi-factor protected views so they only witness their specific production timelines, isolating internal creative feedback cycles."
      }
    ]
  },

  automation: {
    title: "3. Fully-Fledged Webhook & Integration Architecture",
    desc: "Scale the system from a $1,000 baseline framework to an elite $5,000+ custom orchestration by hooking up specialized automated workflows:",
    steps: [
      {
        mechanism: "Gemini Lead Score & Setup",
        trigger: "New video lead added to inbound system",
        effect: "Analyzes client narrative, estimates core budget value, calculates a creative complexity coefficient, and drafts a custom visual direction plan."
      },
      {
        mechanism: "AI Specs & Script Builder",
        trigger: "Inbound campaign flagged 'won'",
        effect: "Invokes our server-side Gemini endpoint to automatically write structural storyboards, tech specifications, and voiceover scripts."
      },
      {
        mechanism: "Automatic Billing Trigger",
        trigger: "Render status transitions to 'Revision'",
        effect: "Dispatches the midpoint invoice to the Client Portal automatically, locking high-res renders until 50% escrow value clears."
      }
    ]
  }
};
