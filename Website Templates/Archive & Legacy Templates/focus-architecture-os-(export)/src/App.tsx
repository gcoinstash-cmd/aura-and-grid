/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FastCapture } from "./components/FastCapture";
import { ActiveFocusChamber } from "./components/ActiveFocusChamber";
import { MicroWorkspaces } from "./components/MicroWorkspaces";
import { SystemGuide } from "./components/SystemGuide";
import { WeeklyReset } from "./components/WeeklyReset";
import { StudioMode, DEFAULT_DELIVERABLES, DEFAULT_ASSETS } from "./components/StudioMode";
import { Task, InboxItem, Habit, EnergyLevel, Horizon, TaskStatus } from "./types";
import { Settings, RotateCcw, X, Info, ShieldAlert, Download } from "lucide-react";

/**
 * ============================================================================
 * 💎 AURA & GRID: CUSTOMIZATION & EDITABILITY BLUEPRINT
 * ============================================================================
 * This application is designed with strict minimalist editorial principles.
 * Grouped below are the core theme structures and assets that the buyer / customizer
 * can easily adjust. Modify these values to instantly align the workspace to 
 * your target boutique brand or premium product.
 */
export const WORKSPACE_THEME_CONFIG = {
  // Brand Header Title
  BRAND_NAME: "Focus OS",
  
  // Tagline shown across metadata and title screens
  BRAND_TAGLINE: "Clear your mind. Start one task.",

  // Primary Theme Colors (Muted Champagne Gold accent with deep Obsidian slate background)
  ACCENT_COLOR_HEX: "#C5A85C",
  ACCENT_TEXT_CLASS: "text-[#C5A85C]",
  ACCENT_BG_CLASS: "bg-[#C5A85C]",
  ACCENT_BORDER_CLASS: "border-[#C5A85C]",
  SELECTION_CLASS: "selection:bg-[#C5A85C]/25",

  // Base Aesthetics (Slate Dark Theme Backgrounds & Overrides)
  BACKGROUND_COLOR: "bg-[#121212]",
  TEXT_PRIMARY: "text-stone-100",
  TEXT_MUTED: "text-stone-400",
  TEXT_DIMMED: "text-stone-500",

  // Typography Families (Change these to match space-grotesk, fira-code, etc)
  FONT_SANS_CLASS: "font-sans",
  FONT_MONO_CLASS: "font-mono",
  FONT_SERIF_CLASS: "font-serif",
  
  // Vertical column grid constraints to maintain generous editorial whitespace
  CONTAINER_MAX_WIDTH: "max-w-2xl",
};

const DEFAULT_TASKS: Task[] = [];

const DEFAULT_INBOX: InboxItem[] = [];

const DEFAULT_HABITS: Habit[] = [
  { id: "h1", title: "Establish visual baseline: curate lookbook styleframes", completedDays: {}, category: "Ritual", timeOfDay: "Morning" },
  { id: "h2", title: "Hydrate and clear physical workspace layout of all stray objects", completedDays: {}, category: "Nourish", timeOfDay: "Morning" },
  { id: "h3", title: "Unplug completely from screens and sit silently for five minutes", completedDays: {}, category: "Ritual", timeOfDay: "Evening" }
];

const DEMO_TASKS: Task[] = [
  {
    id: "demo_t1",
    title: "Launch a luxury hospitality retreat brand and curate the debut visual identity styleframes",
    status: TaskStatus.IN_PROGRESS,
    completed: false,
    energy: EnergyLevel.HIGH_CHARGE,
    horizon: Horizon.NOW,
    paralyzed: false,
    parentWorkspaceId: "deep",
    subtasks: [],
    notes: "Review typography pairings (Space Grotesk & Playfair), bespoke margin grids, and brand voice alignment.",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo_t2",
    title: "Review interactive editorial layouts with the design team",
    status: TaskStatus.NEXT_UP,
    completed: false,
    energy: EnergyLevel.HIGH_CHARGE,
    horizon: Horizon.NOW,
    paralyzed: false,
    parentWorkspaceId: "deep",
    subtasks: [],
    notes: "Evaluate spacing consistency across masonry galleries and check font-contrast guidelines.",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo_t3",
    title: "Draft strategic advisory insights summary for the private equity investment board",
    status: TaskStatus.NEXT_UP,
    completed: false,
    energy: EnergyLevel.LOW_BATTERY,
    horizon: Horizon.NEXT,
    paralyzed: false,
    parentWorkspaceId: "executive",
    subtasks: [],
    notes: "Highlight structural market shifts towards boutique scale and curated hospitality offerings.",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo_t4",
    title: "Audit typographic kerning values on the premium showcase digital map labels",
    status: TaskStatus.NEXT_UP,
    completed: false,
    energy: EnergyLevel.HIGH_CHARGE,
    horizon: Horizon.NOW,
    paralyzed: false,
    parentWorkspaceId: "deep",
    subtasks: [],
    notes: "Refine geographic markers to maintain a highly polished minimalist directory flow.",
    createdAt: new Date().toISOString()
  },
  {
    id: "demo_t5",
    title: "Commission custom brass sound timers to anchor active focus sessions physically",
    status: TaskStatus.NEXT_UP,
    completed: false,
    energy: EnergyLevel.LOW_BATTERY,
    horizon: Horizon.NEXT,
    paralyzed: false,
    parentWorkspaceId: "today",
    subtasks: [],
    notes: "A tactile analog timepiece to support offline attention blocks.",
    createdAt: new Date().toISOString()
  }
];

const DEMO_INBOX: InboxItem[] = [
  { id: "demo_in_1", content: "Review interactive editorial layouts with the design team", processed: false, createdAt: new Date().toISOString() },
  { id: "demo_in_2", content: "Launch a luxury hospitality retreat brand and consolidate the master assets", processed: false, createdAt: new Date().toISOString() }
];

const DEMO_HABITS: Habit[] = [
  { id: "demo_h1", title: "Establish visual baseline: curate lookbook styleframes", completedDays: {}, category: "Ritual", timeOfDay: "Morning" },
  { id: "demo_h2", title: "Hydrate and clear physical workspace layout of all stray objects", completedDays: {}, category: "Nourish", timeOfDay: "Morning" },
  { id: "demo_h3", title: "Unplug completely from screens and sit silently for five minutes", completedDays: {}, category: "Ritual", timeOfDay: "Evening" }
];

export default function App() {
  // CLS-Free Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [demoMode, setDemoMode] = useState<boolean>(false);

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_tasks");
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch {
      return DEFAULT_TASKS;
    }
  });

  const [inboxItems, setInboxItems] = useState<InboxItem[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_inbox");
      return saved ? JSON.parse(saved) : DEFAULT_INBOX;
    } catch {
      return DEFAULT_INBOX;
    }
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_habits");
      return saved ? JSON.parse(saved) : DEFAULT_HABITS;
    } catch {
      return DEFAULT_HABITS;
    }
  });

  const displayedTasks = demoMode ? DEMO_TASKS : tasks;
  const displayedInboxItems = demoMode ? DEMO_INBOX : inboxItems;
  const displayedHabits = demoMode ? DEMO_HABITS : habits;

  // System settings panel modal state
  const [showSettings, setShowSettings] = useState(false);

  // Simple, elegant onboarding state
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [onboardingStep, setOnboardingStep] = useState<number>(0);

  useEffect(() => {
    if (isHydrated) {
      try {
        const completed = localStorage.getItem("focus_planner_onboarding_completed");
        if (completed !== "true") {
          setShowOnboarding(true);
        }
      } catch {
        setShowOnboarding(true);
      }
    }
  }, [isHydrated]);

  // Monk Mode / Shield View state shared level
  const [isShielded, setIsShielded] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_is_shielded");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // Dedicated Immersive Focus State
  const [isFocusActive, setIsFocusActive] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_is_focus_active");
      return saved === "true";
    } catch {
      return false;
    }
  });

  // System Guide Opened State for "How to Run Focus OS"
  const [systemGuideOpen, setSystemGuideOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("focus_planner_guide_open");
      return saved !== "false"; // default to true
    } catch {
      return true;
    }
  });

  // System Framework active pillar state ("focus", "loops", "studio", "vault", "reset")
  const [activePillar, setActivePillar] = useState<"focus" | "loops" | "studio" | "vault" | "reset">("focus");

  // Presentation mode for live client reviews (hides internal backlogs and inputs)
  const [presentationMode, setPresentationMode] = useState<boolean>(false);

  // Active tab inside the offline vault schema preview
  const [vaultPreviewTab, setVaultPreviewTab] = useState<"task" | "loops" | "metrics">("task");

  // Synchronizers
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_tasks", JSON.stringify(tasks));
    }
  }, [tasks, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_inbox", JSON.stringify(inboxItems));
    }
  }, [inboxItems, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_habits", JSON.stringify(habits));
    }
  }, [habits, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_is_shielded", String(isShielded));
    }
  }, [isShielded, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_is_focus_active", String(isFocusActive));
    }
  }, [isFocusActive, isHydrated]);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("focus_planner_guide_open", String(systemGuideOpen));
    }
  }, [systemGuideOpen, isHydrated]);

  // Comprehensive Export Action compiling data to raw Markdown output
  const handleExportWorkspace = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    const exportDateStr = new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      timeZoneName: "short"
    });

    // Subdivide tasks safely for clear representation
    const activeFocusItem = displayedTasks.find((t) => t.status === TaskStatus.IN_PROGRESS && !t.completed) || displayedTasks.find((t) => !t.completed);
    const pendingTasks = displayedTasks.filter((t) => !t.completed && t.id !== activeFocusItem?.id);
    const completedTasks = displayedTasks.filter((t) => t.completed);

    // Retrieve Weekly Reset calibrators safely
    let resetAnchor1 = "";
    let resetAnchor2 = "";
    let resetAnchor3 = "";
    let resetRight = "";
    let resetLever = "";
    if (demoMode) {
      resetAnchor1 = "Launch boutique retreat design guidelines & baseline aesthetic";
      resetAnchor2 = "Conduct staging review of active lookbooks with client group";
      resetAnchor3 = "Complete layout parameters typography sheet and verify contrast scores";
      resetRight = "Integrated high-end lookbook layout feedback into CSS styling grids flawlessly.";
      resetLever = "Refine geographic markers on digital showcase directory to maintain custom kerning.";
    } else {
      try {
        resetAnchor1 = localStorage.getItem("weekly_reset_anchor_1") || "";
        resetAnchor2 = localStorage.getItem("weekly_reset_anchor_2") || "";
        resetAnchor3 = localStorage.getItem("weekly_reset_anchor_3") || "";
        resetRight = localStorage.getItem("weekly_reset_reflective_right") || "";
        resetLever = localStorage.getItem("weekly_reset_reflective_lever") || "";
      } catch (_) {}
    }

    // Retrieve Studio deliverables and assets safely
    let deliverables: any[] = [];
    let assets: any[] = [];
    if (demoMode) {
      deliverables = DEFAULT_DELIVERABLES;
      assets = DEFAULT_ASSETS;
    } else {
      try {
        const savedDel = localStorage.getItem("focus_planner_deliverables");
        if (savedDel) deliverables = JSON.parse(savedDel);
      } catch (_) {}
      try {
        const savedAssets = localStorage.getItem("focus_planner_assets");
        if (savedAssets) assets = JSON.parse(savedAssets);
      } catch (_) {}
    }

    const hasWeeklyResetData = resetAnchor1 || resetAnchor2 || resetAnchor3 || resetRight || resetLever;
    const currentWeekNum = Math.ceil((new Date().getDate() - new Date(new Date().getFullYear(), 0, 1).getDate()) / 7);

    let markdownDoc = `# 🏛️ Focus Architecture OS — Sovereign Workspace Vault

This represents your fully localized visual and execution workspace archive. No cloud indexers, no trackers. 100% portable attention metrics.

---

## 📊 Workspace Metadata
- **Export Date**: ${exportDateStr}
- **Shield / Monk Mode**: ${isShielded ? "🔴 ACTIVE (Distractions Blocked)" : "⚪ INACTIVE"}
- **Active Focus Timer Status**: ${isFocusActive ? "⏱️ Running / Engaged" : "💤 Suspended"}
- **Active Structural Pillar**: ${activePillar.toUpperCase()}
- **Current Cycle Code**: \`${new Date().getFullYear()}-W${currentWeekNum}\`
- **Total Local Objectives**: ${displayedTasks.length} item(s)
- **Active Open Loops**: ${displayedInboxItems.length} item(s)
- **Daily Rituals Tracked**: ${displayedHabits.length} item(s)

---

## ⚡ Current Main Focus Target
${activeFocusItem ? `- [ ] **${activeFocusItem.title}**
  - *Energy Profile*: ${activeFocusItem.energy || 'Normal'}
  - *Temporal Horizon*: ${activeFocusItem.horizon || 'Now'}
  - *Status*: ${activeFocusItem.status === TaskStatus.IN_PROGRESS ? "IN FOCUS" : "QUEUED"}
  - *Metadata Notes*: ${activeFocusItem.notes || 'No notes curated.'}` : '*Your Focus Chamber is currently clear. No active focus target is locked-in. Rest, reflect, or draft a new high-leverage objective.*'}

---

## 📥 Open Loops Queue (${displayedInboxItems.length})
These represent untriaged peripheral loops captured of raw attention. Clear or transition them fully to standard execution horizons.

${displayedInboxItems.length > 0 ? displayedInboxItems.map((item, index) => `- [ ] ${item.content} *(Captured: ${new Date(item.createdAt).toLocaleDateString()})*`).join('\n') : '*No open loops captured. Your working cognitive bandwith is pristine.*'}

---

## 🎯 Secondary Planning Horizon (${pendingTasks.length})
These represent next-up tasks and long-term milestones.

${pendingTasks.length > 0 ? pendingTasks.map((t) => `- [ ] ${t.title}
  - *Horizon*: ${t.horizon}
  - *Energy Charge*: ${t.energy}
  - *Reference Notes*: ${t.notes || "None"}`).join('\n') : '*No secondary deliverables are currently queued in the active focus planner.*'}

---

## 🔁 Daily Rituals & Habit Tracks
${displayedHabits.length > 0 ? displayedHabits.map((h) => {
  const isCompletedToday = h.completedDays && !!h.completedDays[todayStr];
  return `- [${isCompletedToday ? 'x' : ' '}] ${h.title} *(${h.category} • ${h.timeOfDay})*`;
}).join('\n') : '*No daily habits or rituals currently active.*'}

---

## 🏁 Completed Execution Record (${completedTasks.length})
Sovereign momentum built, session-by-session.

${completedTasks.length > 0 ? completedTasks.map((t) => `- [x] ~~${t.title}~~ *(Completed)*`).join('\n') : '*No tasks archived as completed in your active database session yet.*'}

---

## 📆 Weekly Reset & Reflection Logs
${hasWeeklyResetData ? `### ⚓ Cycle Objectives & Anchors
1. **Anchor 01**: ${resetAnchor1 || "Not specified."}
2. **Anchor 02**: ${resetAnchor2 || "Not specified."}
3. **Anchor 03**: ${resetAnchor3 || "Not specified."}

### 🧠 Reflections
- **What went right or stayed pure?**: 
  > ${resetRight || "No feedback logged yet."}
- **Primary leverage focal point for the next cycle?**: 
  > ${resetLever || "No lever selected yet."}` : '*Weekly Reset calibrator has not been initialized or completed for this cycle.*'}

---

## 🎨 Asset Review Pipeline & Deliverables
This represents curated specifications, lookbook elements, and technical targets tracking.

### 📐 Project Deliverables (${deliverables.length})
${deliverables.length > 0 ? deliverables.map((d) => `- [${d.completed ? 'x' : ' '}] **${d.milestone}**
  - *Target Spec Date*: \`${d.dueDate || "N/A"}\`
  - *Estimated Valuation*: \`${d.estimatedValue || "N/A"}\`
  - *Workspace Parent*: ${d.workspace || "General"}`).join('\n') : '*No studio deliverables curated yet.*'}

### 📼 Creative Asset Portfolio (${assets.length})
${assets.length > 0 ? assets.map((a) => {
  const ratingStars = "★".repeat(a.rating || 0) + "☆".repeat(5 - (a.rating || 0));
  return `### 🖼️ Asset: ${a.title} (\`${a.type}\`)
- **Status Evaluation**: \`${a.status.toUpperCase()}\`
- **Curation Rating**: ${ratingStars}
- **Creative Specs**:
  - *Font Pairing Core*: \`${a.specs?.fontFamily || "Default"}\`
  - *Base Layout Ratio*: \`${a.specs?.aspectRatio || "Default"}\`
  - *Primary Palette Roots*: \`${a.specs?.palette?.join(', ') || "Default"}\`
- **Feedback log stream**:
  ${a.feedback && a.feedback.length > 0 ? a.feedback.map((f: string) => `> - ${f}`).join('\n  ') : '*No localized stream feedback logged.*'}`;
}).join('\n\n') : '*No studio creative assets portfolio generated yet.*'}

---

*Thank you for practicing protective focus space. Maintain complete local data sovereignty of your attention.*
`;

    const element = document.createElement("a");
    const file = new Blob([markdownDoc], { type: "text/markdown;charset=utf-8" });
    const fileURL = URL.createObjectURL(file);
    element.href = fileURL;
    element.download = "focus-os-vault.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(fileURL);
  };

  // Derive active focus task (first incomplete task, preferring in_progress)
  const activeFocusTask = displayedTasks.find((t) => t.status === TaskStatus.IN_PROGRESS && !t.completed) || displayedTasks.find((t) => !t.completed);

  // Check if first focus target has been cleared
  const hasCompletedFirstTask = displayedTasks.some((t) => t.completed);

  // Focus-routing handler: automatically places tasks in Simple Tasks, Deep Work, or Inbox based on input text keywords
  const handleRouteCapturedTask = (title: string, route: "easy" | "deep" | "inbox") => {
    if (route === "easy") {
      // LOW-ENERGY AUTO-ROUTE -> Status: "Next Up" | Category: "Easy Tasks" (EnergyLevel.LOW_BATTERY)
      handleAddTask(title, {
        status: TaskStatus.NEXT_UP,
        energy: EnergyLevel.LOW_BATTERY,
        parentWorkspaceId: "executive",
        horizon: Horizon.NEXT,
        notes: "Automatically categorized as a Simple Task.",
      });
    } else if (route === "deep") {
      // DEEP WORK AUTO-ROUTE -> Status: "In Progress" | Category: "Deep Work" (EnergyLevel.HIGH_CHARGE)
      const demotedTasks = tasks.map((t) =>
        t.status === TaskStatus.IN_PROGRESS ? { ...t, status: TaskStatus.NEXT_UP } : t
      );
      const newTask: Task = {
        id: "task_deep_" + Math.random().toString(),
        title,
        status: TaskStatus.IN_PROGRESS,
        completed: false,
        energy: EnergyLevel.HIGH_CHARGE,
        horizon: Horizon.NOW,
        paralyzed: false,
        parentWorkspaceId: "deep",
        subtasks: [],
        notes: "Automatically categorized as Active Deep Work.",
        createdAt: new Date().toISOString(),
      };
      setTasks([newTask, ...demotedTasks]);
      setIsFocusActive(true);
    } else {
      // DEFAULT DROPOFF -> drop raw task into background queue labeled "Inbox" (stored in inboxItems)
      const newInboxItem: InboxItem = {
        id: "in_" + Math.random().toString(),
        content: title,
        processed: false,
        createdAt: new Date().toISOString(),
      };
      setInboxItems([newInboxItem, ...inboxItems]);
    }
  };

  const handleAddTask = (title: string, options?: Partial<Task>) => {
    const isCompleted = options?.completed ?? false;
    const defaultStatus = options?.status || (isCompleted ? TaskStatus.COMPLETE : TaskStatus.IN_PROGRESS);

    // If making something active, demote other active items
    let targetTasks = [...tasks];
    if (defaultStatus === TaskStatus.IN_PROGRESS && !isCompleted) {
      targetTasks = targetTasks.map((t) =>
        t.status === TaskStatus.IN_PROGRESS ? { ...t, status: TaskStatus.NEXT_UP } : t
      );
    }

    const newTask: Task = {
      id: "task_" + Math.random().toString(),
      title,
      status: defaultStatus,
      completed: isCompleted,
      energy: options?.energy || EnergyLevel.LOW_BATTERY,
      horizon: options?.horizon || Horizon.NOW,
      paralyzed: options?.paralyzed || false,
      parentWorkspaceId: options?.parentWorkspaceId || "deep",
      subtasks: options?.subtasks || [],
      notes: options?.notes || "",
      createdAt: new Date().toISOString(),
    };
    setTasks([newTask, ...targetTasks]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    let syncedTask = { ...updatedTask };
    if (syncedTask.completed && syncedTask.status !== TaskStatus.COMPLETE) {
      syncedTask.status = TaskStatus.COMPLETE;
    } else if (!syncedTask.completed && syncedTask.status === TaskStatus.COMPLETE) {
      syncedTask.status = TaskStatus.IN_PROGRESS;
    }
    
    // Auto active focus session if status becomes In Progress
    if (syncedTask.status === TaskStatus.IN_PROGRESS && !syncedTask.completed) {
      setIsFocusActive(true);
    }

    setTasks(tasks.map((t) => (t.id === syncedTask.id ? syncedTask : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const handleToggleHabit = (habitId: string, dateStr: string) => {
    setHabits(
      habits.map((h) => {
        if (h.id === habitId) {
          const completedDays = { ...h.completedDays };
          if (completedDays[dateStr]) {
            delete completedDays[dateStr];
          } else {
            completedDays[dateStr] = true;
          }
          return { ...h, completedDays };
        }
        return h;
      })
    );
  };

  const handleConvertInboxItem = (item: InboxItem) => {
    const newTask: Task = {
      id: "task_elevated_" + Math.random().toString(),
      title: item.content,
      status: TaskStatus.IN_PROGRESS,
      completed: false,
      energy: EnergyLevel.LOW_BATTERY,
      horizon: Horizon.NOW,
      paralyzed: false,
      parentWorkspaceId: "deep",
      subtasks: [],
      createdAt: new Date().toISOString(),
    };

    const demotedTasks = tasks.map((t) =>
      t.status === TaskStatus.IN_PROGRESS ? { ...t, status: TaskStatus.NEXT_UP } : t
    );

    setTasks([newTask, ...demotedTasks]);
    setInboxItems(inboxItems.filter((i) => i.id !== item.id));
    setIsFocusActive(true);
  };

  const handleDeleteInboxItem = (id: string) => {
    setInboxItems(inboxItems.filter((i) => i.id !== id));
  };

  const handleAddInboxItem = (content: string) => {
    const newInboxItem: InboxItem = {
      id: "in_" + Math.random().toString(),
      content,
      processed: false,
      createdAt: new Date().toISOString(),
    };
    setInboxItems((prev) => [newInboxItem, ...prev]);
  };

  const handleResetHabitsForNewCycle = () => {
    setHabits((prev) => prev.map((h) => ({ ...h, completedDays: {} })));
  };

  const handleClearCompletedTasks = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  const handleResetToDefaults = () => {
    setTasks(DEFAULT_TASKS);
    setInboxItems(DEFAULT_INBOX);
    setHabits(DEFAULT_HABITS);
    localStorage.removeItem("focus_planner_notes");
    setShowSettings(false);
  };

  const todayFormatted = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const isCurrentlyImmersive = isFocusActive && !!activeFocusTask;
  const isSecondaryDimmed = (isShielded || isCurrentlyImmersive) && !!activeFocusTask;

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-[#121212] text-stone-250 noise-overlay flex flex-col font-sans px-8 md:px-16 py-16 md:py-28 relative" id="focus-planner-application">
        {/* 1. SKELETON HEADER */}
        <header className="w-full max-w-2xl mx-auto flex justify-between items-center pb-10 md:pb-12 border-b border-stone-900/25 opacity-40">
          <div className="flex flex-col text-left">
            <span className="tracking-widest text-[11px] uppercase font-mono font-medium text-stone-300">
              Focus OS
            </span>
            <span className="tracking-widest text-[9px] uppercase font-mono text-stone-600 mt-1.5 font-medium animate-pulse">
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </span>
          </div>
          <div className="w-[18px] h-[18px] bg-stone-800 rounded-full animate-pulse" />
        </header>

        {/* 2. SKELETON MAIN ASSEMBLY */}
        <main className="flex-1 w-full flex flex-col justify-start py-8 md:py-12 space-y-12 md:space-y-16">
          <section className="w-full max-w-2xl mx-auto text-center space-y-3 opacity-30">
            <h1 className="font-serif text-3xl md:text-5xl text-stone-300 tracking-tighter leading-tight font-light animate-pulse">
              Clear your mind. Start one task.
            </h1>
            <div className="h-4 bg-stone-900/50 rounded-sm w-2/3 mx-auto animate-pulse mt-2" />
          </section>

          <section className="w-full max-w-2xl mx-auto opacity-30">
            <div className="h-[54px] bg-stone-900/40 border border-stone-850/60 rounded-sm w-full animate-pulse" />
          </section>

          <section className="w-full max-w-2xl mx-auto border-b border-stone-900/25 pb-4 md:pb-6 opacity-30">
            <div className="h-40 bg-stone-900/30 border border-stone-850/60 rounded-sm w-full animate-pulse" />
          </section>
        </main>

        {/* SKELETON FOOTER */}
        <footer className="w-full max-w-2xl mx-auto pt-16 border-t border-stone-800/30 flex flex-col sm:flex-row justify-between items-center text-[10px] font-sans text-stone-605 gap-4 opacity-30">
          <div>
            <span>Focus OS &mdash; Clear your mind. Start one task.</span>
          </div>
          <div className="w-40 h-3 bg-stone-900/50 rounded-sm animate-pulse" />
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-stone-250 noise-overlay flex flex-col justify-start font-sans transition-all px-6 md:px-12 pt-5 pb-16 md:pt-8 md:pb-24 selection:bg-[#C5A85C]/25 selection:text-white relative" id="focus-planner-application">
      {/* Ambient Edge Vignette */}
      <div 
        className={`pointer-events-none fixed inset-0 z-40 transition-opacity duration-1000 ease-[0.16,1,0.3,1] ${
          isShielded || isCurrentlyImmersive ? "opacity-100" : "opacity-0"
        } bg-[radial-gradient(circle,_transparent_70%,_rgba(0,0,0,0.45)_100%)]`}
        aria-hidden="true"
      />

      {/* Premium Desktop Software Frame simulation top bar */}
      <div className={`w-full max-w-2xl mx-auto flex items-center justify-between pb-5 pt-1 text-[9px] font-mono text-stone-600 uppercase tracking-[0.22em] select-none transition-opacity duration-500 ${isCurrentlyImmersive ? "opacity-20" : "opacity-100"}`} id="software-frame-chrome">
        <div className="flex space-x-1.5 items-center">
          <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-850/60 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-850/60 block" />
          <span className="w-2.5 h-2.5 rounded-full bg-stone-900 border border-stone-850/60 block" />
        </div>
        <span className="text-[8px] text-stone-400 flex items-center space-x-1 px-2.5 py-1 bg-stone-950/40 border border-stone-900/40 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]/50 inline-block shrink-0" />
          <span>Local Sovereign Workspace</span>
        </span>
      </div>

      {/* 1. HEADER */}
      <header className={`w-full max-w-2xl mx-auto flex justify-between items-center pb-8 border-b border-stone-900/10 transition-all duration-500 ease-[0.16,1,0.3,1] ${isCurrentlyImmersive ? "opacity-35" : isSecondaryDimmed ? "opacity-20 pointer-events-none select-none" : "opacity-100"}`} id="editorial-header">
        <div className="flex flex-col text-left">
          <button
            onClick={() => setIsFocusActive(false)}
            className="tracking-[0.2em] text-[13px] uppercase font-mono font-black text-stone-100 hover:text-[#C5A85C] transition-colors text-left focus:outline-none cursor-pointer block"
            id="brand-logo"
            title="Return to Home Screen"
          >
            Focus OS
          </button>
          <span className="tracking-widest text-[11px] uppercase font-mono text-stone-400 mt-1.5 font-semibold">
            {todayFormatted}
          </span>
        </div>

        <button
          onClick={() => setShowSettings(true)}
          className="text-[9px] font-mono uppercase tracking-[0.22em] text-stone-500 hover:text-[#C5A85C] transition-all duration-300 py-1.5 px-3 border border-stone-900/15 hover:border-[#C5A85C]/25 rounded-sm cursor-pointer focus:outline-none flex items-center space-x-1.5"
          id="toggle-settings-btn"
          title="Workspace Configuration"
        >
          <span>Workspace Configuration</span>
          <span className="text-stone-600 block">&bull;</span>
          <Settings size={11} className="text-stone-400" />
        </button>
      </header>

      {/* SYSTEM FRAMEWORK ARCHITECTURAL PILLARS ROW */}
      <section className={`w-full max-w-2xl mx-auto mt-6 mb-2 transition-all duration-500 ease-[0.16,1,0.3,1] ${isCurrentlyImmersive ? "opacity-25" : isSecondaryDimmed ? "opacity-20 pointer-events-none select-none" : "opacity-100"}`} id="system-framework-bar">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full pb-4 border-b border-stone-850/50" id="pillars-container">
          {[
            { id: "focus", num: "01", name: "FOCUS", desc: "Deep Execution" },
            { id: "loops", num: "02", name: "OPEN LOOPS", desc: "Mind Unloading" },
            { id: "studio", num: "03", name: "STUDIO STAGE", desc: "Showcase Hub" },
            { id: "vault", num: "04", name: "OFFLINE VAULT", desc: "Sovereign Vaults" },
            { id: "reset", num: "05", name: "WEEKLY RESET", desc: "Focus Calibration" }
          ].map((pillar) => {
            const active = activePillar === pillar.id;
            return (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id as any)}
                className={`group flex flex-col justify-between text-left p-4 border rounded-sm h-28 w-full transition-all duration-300 cursor-pointer focus:outline-none ${
                  active
                    ? "bg-[#161616]/75 border-[#C5A85C]/40 shadow-sm"
                    : "bg-[#141414]/15 border-stone-900/40 hover:border-stone-850 text-stone-500 hover:text-stone-350"
                }`}
                id={`pillar-btn-${pillar.id}`}
              >
                <div className="flex justify-between items-start w-full">
                  <span className={`text-[9px] font-mono transition-colors ${active ? "text-[#C5A85C] font-semibold" : "text-stone-600 group-hover:text-stone-400"}`}>
                    {pillar.num}
                  </span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C] animate-pulse" />
                  )}
                </div>
                <div className="space-y-0.5 mt-2">
                  <span className={`text-[10px] font-mono tracking-widest font-bold block transition-colors ${active ? "text-stone-100" : "text-stone-400"}`}>
                    {pillar.name}
                  </span>
                  <span className={`text-[9.5px] font-sans font-light block transition-colors leading-tight ${active ? "text-stone-300" : "text-stone-650 group-hover:text-stone-400"}`}>
                    {pillar.desc}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. MAIN SINGLE COLUMN ASSEMBLY */}
      <main className="w-full flex flex-col justify-start py-4 space-y-6 md:space-y-8" id="planner-main-column">
        {presentationMode ? (
          <StudioMode
            presentationMode={presentationMode}
            setPresentationMode={setPresentationMode}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
          />
        ) : (
          <>
            {activePillar === "focus" && (
          <>
            {/* HERO TITLE BLOCK */}
            <section 
              className={`w-full max-w-2xl mx-auto text-center space-y-2 transition-all duration-700 ease-[0.16,1,0.3,1] ${
                isCurrentlyImmersive 
                  ? "hidden" 
                  : isSecondaryDimmed 
                    ? "opacity-20 pointer-events-none select-none" 
                    : "opacity-100"
              } bg-[#161616]/40 border border-stone-900/20 rounded-sm py-6 md:py-8 px-8 md:px-14 shadow-sm`} 
              id="hero-title-block"
            >
              <h1 className="font-serif text-3xl md:text-5xl text-stone-100 tracking-tighter leading-tight font-light">
                Clear your mind. Start one task.
              </h1>
              <p className="text-stone-400 text-xs md:text-sm font-light max-w-md mx-auto leading-relaxed">
                Capture what’s in your head and get one clear next step.
              </p>
            </section>

            {/* SYSTEM OPERATING MANUAL & POSITIONING */}
            <section 
              id="system-guide-module" 
              className={`transition-all duration-700 ease-[0.16,1,0.3,1] ${
                isCurrentlyImmersive 
                  ? "hidden" 
                  : isSecondaryDimmed 
                    ? "opacity-20 pointer-events-none select-none" 
                    : "opacity-100"
              }`}
            >
              <SystemGuide
                isOpen={systemGuideOpen}
                onToggle={() => setSystemGuideOpen(prev => !prev)}
              />
            </section>

            {/* CURRENT FOCUS CARD PANEL (CENTRAL OBJECTIVE VIEW) */}
            <section 
              id="current-focus-module" 
              className={isCurrentlyImmersive 
                ? "w-full max-w-2xl mx-auto" 
                : "relative w-full max-w-2xl mx-auto bg-stone-900/30 border border-stone-850 p-6 md:p-8 rounded-sm shadow-xl overflow-hidden transition-all duration-750 ease-[0.16,1,0.3,1]"
              }
            >
              {!isCurrentlyImmersive && (
                <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A85C]/35 to-transparent animate-pulse" style={{ animationDuration: "3500ms" }} />
              )}
              <ActiveFocusChamber
                activeFocusTask={activeFocusTask}
                onUpdateTask={handleUpdateTask}
                isFocusActive={isFocusActive}
                onFocusActiveChange={setIsFocusActive}
              />
            </section>

            {/* HABIT STATISTICS & FOCUS INSIGHTS MINI-DASHBOARD */}
            <section 
              id="focus-insights-dashboard"
              className={`transition-all duration-700 ease-[0.16,1,0.3,1] ${
                isCurrentlyImmersive 
                  ? "hidden" 
                  : isSecondaryDimmed 
                    ? "opacity-20 pointer-events-none select-none" 
                    : "opacity-100"
              } w-full max-w-2xl mx-auto`}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#161616]/20 border border-stone-900/60 p-4 rounded-sm">
                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-mono uppercase text-stone-300 block tracking-wider font-semibold">Deep Work Yield</span>
                  <div className="flex items-baseline space-x-1.5 font-sans">
                    <span className="text-base font-serif text-stone-200">84%</span>
                    <span className="text-[8.5px] text-emerald-400 font-mono font-medium">+3.2% vs prev</span>
                  </div>
                </div>
                
                <div className="space-y-1 text-left font-sans">
                  <span className="text-[9px] font-mono uppercase text-stone-300 block tracking-wider font-semibold">Pristine Hours</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-serif text-stone-200">18.5h</span>
                    <span className="text-[8.5px] text-stone-500 font-mono font-light">logged weekly</span>
                  </div>
                </div>

                <div className="space-y-1 text-left font-sans">
                  <span className="text-[9px] font-mono uppercase text-stone-300 block tracking-wider font-semibold">Streak Rhythm</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-serif text-stone-200">5 Days</span>
                    <span className="text-[8.5px] text-[#C5A85C] font-mono font-bold">★ COHERENT</span>
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <span className="text-[9px] font-mono uppercase text-stone-300 block tracking-wider font-semibold">Attention Coherence</span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-base font-serif text-stone-200">92%</span>
                    <span className="text-[8.5px] text-[#C5A85C]/75 font-mono">CALIBRATED</span>
                  </div>
                </div>
              </div>
            </section>

            {/* PROGRESSIVE DISCLOSURE TUCKED-AWAY MODULES */}
            <section 
              id="disclosed-modules" 
              className={`transition-all duration-700 ease-[0.16,1,0.3,1] ${
                isCurrentlyImmersive 
                  ? "hidden" 
                  : ""
              }`}
            >
              <MicroWorkspaces
                tasks={displayedTasks}
                inboxItems={displayedInboxItems}
                habits={displayedHabits}
                onToggleHabit={handleToggleHabit}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onConvertInboxItem={handleConvertInboxItem}
                onDeleteInboxItem={handleDeleteInboxItem}
                isShielded={isShielded}
                onShieldedChange={setIsShielded}
                isSecondaryDimmed={isSecondaryDimmed}
                hideInboxTab={true}
                onResetAll={() => setInboxItems([])}
              />
            </section>
          </>
        )}

        {activePillar === "loops" && (
          <>
            {/* QUICK CAPTURE INPUT FIELD */}
            <section 
              id="capture-module" 
              className="bg-[#161616]/40 border border-[#C5A85C]/15 rounded-sm py-5 md:py-6 px-8 md:px-12 shadow-sm"
            >
              <FastCapture onRouteTask={handleRouteCapturedTask} />
            </section>

            {/* OPEN LOOPS DETAILS & PROCESSING */}
            <section id="disclosed-modules" className="transition-all duration-500">
              <MicroWorkspaces
                tasks={displayedTasks}
                inboxItems={displayedInboxItems}
                habits={displayedHabits}
                onToggleHabit={handleToggleHabit}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onConvertInboxItem={handleConvertInboxItem}
                onDeleteInboxItem={handleDeleteInboxItem}
                isShielded={isShielded}
                onShieldedChange={setIsShielded}
                isSecondaryDimmed={false}
                forcedTab="inbox"
                hideInboxTab={false}
                onResetAll={() => setInboxItems([])}
              />
            </section>
          </>
        )}

        {activePillar === "studio" && (
          <StudioMode
            presentationMode={presentationMode}
            setPresentationMode={setPresentationMode}
            demoMode={demoMode}
            setDemoMode={setDemoMode}
          />
        )}

        {activePillar === "vault" && (
          <section id="dedicated-vault-dashboard" className="w-full max-w-2xl mx-auto space-y-8 text-left">
            <div className="bg-[#161616]/40 border border-stone-900/20 rounded-sm py-6 md:py-8 px-8 md:px-12 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-[#C5A85C]/5 to-transparent pointer-events-none" />
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-[#C5A85C]">
                  <span>Pillar 04</span>
                  <span className="text-stone-700">&bull;</span>
                  <span>Data Sovereignty & Portability</span>
                </div>
                <h2 className="font-serif text-2xl text-stone-100 font-light tracking-tight">Sovereign Vault Archive</h2>
                <p className="text-xs text-stone-400 font-sans font-light leading-relaxed max-w-xl">
                  Focus OS runs entirely localized within an Isolated Local Environment. Your tasks, habits, and notes never leak to secondary cloud indices. Keep your psychological slate clear of Cognitive Clutter.
                </p>
              </div>
            </div>

            {/* SOVEREIGN ADVANTAGE GRID CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-stone-950/25 border border-stone-900/60 rounded-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                  <h4 className="text-xs font-mono uppercase text-stone-200 tracking-wider">Local Privacy</h4>
                </div>
                <p className="text-[11px] text-stone-400 font-sans font-light leading-relaxed">
                  Confined strictly to an Isolated Local Environment. Zero external analytics, zero tracking telemetry, and 100% private.
                </p>
              </div>

              <div className="p-5 bg-stone-950/25 border border-stone-900/60 rounded-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                  <h4 className="text-xs font-mono uppercase text-stone-200 tracking-wider">Full Ownership</h4>
                </div>
                <p className="text-[11px] text-stone-400 font-sans font-light leading-relaxed">
                  You own 100% of your data. Export your entire psychological workspace in standard markdown formats at any time.
                </p>
              </div>

              <div className="p-5 bg-stone-950/25 border border-stone-900/60 rounded-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                  <h4 className="text-xs font-mono uppercase text-stone-200 tracking-wider">Zero Cloud Dependency</h4>
                </div>
                <p className="text-[11px] text-stone-400 font-sans font-light leading-relaxed">
                  Operates flawlessly in deep cabins, offline workspaces, or airplanes. Zero intermediate servers or network latencies.
                </p>
              </div>

              <div className="p-5 bg-[#C5A85C]/5 border border-[#C5A85C]/25 rounded-sm space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A85C]" />
                  <h4 className="text-xs font-mono uppercase text-stone-100 tracking-wider">100% Obsidian Compatibility</h4>
                </div>
                <p className="text-[11px] text-stone-400 font-sans font-light leading-relaxed">
                  Adheres strictly to markdown layout standards. Place directly into Obsidian vaults with dynamic tags and Wiki links support.
                </p>
              </div>
            </div>

            {/* STATS MATRIX */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Active Objectives", val: tasks.filter(t => !t.completed).length },
                { label: "Completed Milestones", val: tasks.filter(t => t.completed).length },
                { label: "Pending Open Loops", val: inboxItems.length },
                { label: "Daily Routines", val: habits.length }
              ].map((stat, idx) => (
                <div key={idx} className="p-4 bg-stone-900/10 border border-stone-900 rounded-sm">
                  <span className="text-[9px] font-mono uppercase text-stone-350 block tracking-wider">{stat.label}</span>
                  <span className="text-xl font-serif font-light text-stone-200 mt-1 block">{stat.val}</span>
                </div>
              ))}
            </div>

            {/* PREVIEW CONTAINER WITH TAB TOGGLES */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-stone-900 pb-2">
                <span className="text-[10px] font-mono uppercase text-stone-400 tracking-widest block">Formatted Vault Schema Preview (.md)</span>
                
                {/* Visual tabs selectors */}
                <div className="flex space-x-1.5 bg-stone-950 p-1 border border-stone-900 rounded-sm">
                  {[
                    { id: "task", name: "Task.md" },
                    { id: "loops", name: "Open Loops.md" },
                    { id: "metrics", name: "Weekly Metrics.md" }
                  ].map((tab) => {
                    const active = vaultPreviewTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setVaultPreviewTab(tab.id as any)}
                        className={`text-[9px] font-mono px-3 py-1 rounded-sm cursor-pointer transition-all ${
                          active 
                            ? "bg-[#161616] border border-stone-850 text-[#C5A85C] font-semibold" 
                            : "text-stone-350 hover:text-stone-200"
                        }`}
                      >
                        {tab.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* MD Render Block */}
              <pre className="bg-stone-950/80 border border-stone-900/60 rounded-sm p-5 font-mono text-[10.5px] text-stone-350 overflow-auto h-72 select-all leading-relaxed appointment-pre select-none">
                {vaultPreviewTab === "task" && (
`---
id: "t1"
title: "Launch luxury hospitality retreat brand"
status: "IN_PROGRESS"
completed: false
energy: "HIGH_CHARGE"
horizon: "NOW"
created_at: "${new Date().toISOString()}"
parent_workspace: "deep"
---

# ⚡ Client Deliverable: Launch luxury hospitality retreat brand

## Metadata Spec
- **Current Status**: #status/active
- **Attention Power Required**: #energy/high
- **Temporal Horizon Placement**: #horizon/immediate

## Creative Audit Notes
- Review typography choices, custom styling grids, and editorial alignment.
- Evaluate spacing consistency across masonry galleries and check accessibility.

## 🎯 Deliverable Milestones
- [x] Establish visual baseline: curate lookbook styleframes
- [ ] Render high-resolution lime wash frontage elevations
- [ ] Formulate client feedback response`
                )}

                {vaultPreviewTab === "loops" && (
`# 📥 Open Loops Repository

Unprocessed psychological static and raw mental feedback captures waiting for strategic triage.

## 📌 Captures List
- [ ] Review interactive editorial layouts with the design team <!-- ID: in_1 -->
- [ ] Launch a luxury hospitality retreat brand and consolidate the master assets <!-- ID: in_2 -->

## Triage Guideline
Move elements directly to standard \`.md\` dossiers when routed to structured horizons.`
                )}

                {vaultPreviewTab === "metrics" && (
`---
cycle: "${new Date().getFullYear()}-W${Math.ceil((new Date().getDate() - new Date(new Date().getFullYear(), 0, 1).getDate()) / 7)}"
alignment_score: "92%"
completed_milestones: ${tasks.filter(t => t.completed).length}
active_open_loops: ${inboxItems.length}
---

# 📆 Weekly Reset Calibration Dossier

## ⚓ Cycle Anchors
1. **Anchor 01**: ${localStorage.getItem("weekly_reset_anchor_1") || "Critical strategic audit for client launch..."}
2. **Anchor 02**: ${localStorage.getItem("weekly_reset_anchor_2") || "Refine lookup architectural templates..."}
3. **Anchor 03**: ${localStorage.getItem("weekly_reset_anchor_3") || "Establish local back archive files sync..."}

## 🧠 Reflection Logs
- **What went right?**: ${localStorage.getItem("weekly_reset_reflective_right") || "The design alignment stayed extremely pure, zeroing out peripheral distraction vectors completely."}
- **Primary lever for next week?**: ${localStorage.getItem("weekly_reset_reflective_lever") || "Finalize raw lime wash render assets and hand-off vector design specifications."}

## 🌸 Habit Status Tracker
- [x] Establish visual baseline: curate lookbook styleframes
- [x] Hydrate and clear physical workspace layout of all stray objects
- [ ] Unplug completely from screens and sit silently for five minutes`
                )}
              </pre>
            </div>

            {/* LARGE DOWNLOAD ACTION */}
            <div className="p-6 bg-stone-900/20 border border-[#C5A85C]/20 rounded-sm text-center space-y-4">
              <p className="text-xs text-stone-400 font-sans max-w-md mx-auto leading-relaxed font-light">
                Secure your complete attention data logs locally inside a standard Markdown document readable on Obsidian, Logan, or text editors.
              </p>
              <button
                onClick={handleExportWorkspace}
                className="bg-[#C5A85C] hover:bg-[#C5A85C]/90 text-stone-950 font-mono text-[11px] font-semibold uppercase tracking-wider px-6 py-2.5 rounded-sm transition-all cursor-pointer inline-flex items-center space-x-2"
                id="vault-dashboard-export"
              >
                <Download size={11} />
                <span>Download Sovereign Vault (.md)</span>
              </button>
            </div>
          </section>
        )}

        {activePillar === "reset" && (
          <WeeklyReset
            tasks={tasks}
            inboxItems={inboxItems}
            habits={habits}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onConvertInboxItem={handleConvertInboxItem}
            onDeleteInboxItem={handleDeleteInboxItem}
            onAddInboxItem={handleAddInboxItem}
            onExportWorkspace={handleExportWorkspace}
            onResetHabitsForNewCycle={handleResetHabitsForNewCycle}
            onClearCompletedTasks={handleClearCompletedTasks}
          />
        )}
          </>
        )}

      </main>

      {/* 4. LOCAL SOVEREIGN DATA FEATURE CARD */}
      {!isCurrentlyImmersive && !isSecondaryDimmed && activePillar !== "vault" && activePillar !== "reset" && !presentationMode && (
        <section id="sovereign-data-vault" className="w-full max-w-2xl mx-auto mt-16 p-6 rounded-sm bg-[#161616]/15 border border-stone-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all duration-500 ease-[0.16,1,0.3,1] hover:border-stone-800">
          <div className="space-y-1 text-left">
            <h4 className="font-serif text-sm text-stone-400 font-light tracking-wide">Offline Storage</h4>
            <p className="text-[11px] text-stone-600 font-sans font-light">Download your workspace as plain text. Keep complete ownership of your tasks with offline portability.</p>
          </div>
          <button
            onClick={handleExportWorkspace}
            className="text-[11px] font-mono tracking-wider uppercase text-stone-400 hover:text-stone-200 hover:border-stone-600 bg-stone-950/25 border border-stone-900/30 px-3.5 py-2 rounded-sm transition-all duration-500 ease-[0.16,1,0.3,1] cursor-pointer shrink-0"
            id="sovereign-export-btn"
            title="Export complete session archive to Markdown document"
          >
            Download Vault (.md)
          </button>
        </section>
      )}

      {/* FOOTER */}
      <footer className={`w-full max-w-2xl mx-auto pt-10 pb-16 border-t border-stone-900/15 flex flex-col sm:flex-row justify-between items-center text-[10px] font-mono text-stone-400 gap-4 transition-all duration-500 ease-[0.16,1,0.3,1] ${isCurrentlyImmersive ? "opacity-20" : isSecondaryDimmed ? "opacity-20 pointer-events-none select-none" : "opacity-100"}`} id="planner-footer">
        <div>
          <span>FOCUS OS — A minimalist workspace for deep execution.</span>
        </div>
      </footer>

      {/* SETTINGS OVERLAY PANEL */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#121212]/95 backdrop-blur-md z-50 flex items-center justify-center p-6"
            id="settings-modal"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#171717] border border-stone-850 max-w-md w-full p-8 rounded-sm text-left space-y-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowSettings(false)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-200 transition-colors cursor-pointer"
                id="close-settings-btn"
              >
                <X size={18} />
              </button>

              <div className="space-y-2">
                <span className="text-[10px] font-mono text-[#C5A85C] uppercase tracking-widest block">
                  System Preferences
                </span>
                <h3 className="font-serif text-2xl text-stone-100 font-light tracking-tight">
                  Workspace Configuration
                </h3>
                <p className="text-xs text-stone-200 font-sans leading-relaxed font-light">
                  Deconstruct cognitive friction. Configure premium guidelines engineered for complete local sovereignty, offline reliability, and aesthetic precision.
                </p>
              </div>

              <div className="border-t border-stone-900 pt-4 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-stone-300">Default Blueprints</span>
                  <button
                    onClick={handleResetToDefaults}
                    className="text-[10px] font-mono uppercase bg-stone-900 border border-stone-800 hover:border-red-900 text-stone-400 py-2 px-4 rounded-sm flex items-center space-x-2 transition-all cursor-pointer animate-none"
                    id="factory-reset-btn"
                  >
                    <RotateCcw size={11} />
                    <span>Restore Defaults</span>
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-stone-300">Data Sovereignty</span>
                  <button
                    onClick={handleExportWorkspace}
                    className="text-[10px] font-mono uppercase bg-stone-900 border border-stone-800 hover:border-[#C5A85C]/60 text-[#C5A85C] py-2 px-4 rounded-sm transition-all cursor-pointer"
                    id="settings-export-btn"
                    title="Export complete session archive to Markdown document"
                  >
                    Export Workspace (.md)
                  </button>
                </div>

                <div className="flex justify-between items-center text-xs pt-3 border-t border-stone-900/40">
                  <div className="flex flex-col text-left">
                    <span className="text-stone-300 font-sans font-medium">Demo / Preview Mode</span>
                    <span className="text-[10px] text-stone-500 font-sans mt-0.5">Load premium lookbooks & milestones</span>
                  </div>
                  <button
                    onClick={() => setDemoMode(!demoMode)}
                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border border-transparent transition-all duration-250 ease-in-out focus:outline-none ${
                      demoMode ? "bg-[#C5A85C]" : "bg-stone-850 border border-stone-800"
                    }`}
                    id="demo-mode-toggle-settings"
                    title="Toggle high-fidelity interactive demo dataset"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-[#121212] transition-transform duration-250 ease-in-out ${
                        demoMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              <div className="border-t border-stone-900 pt-4 text-[10px] text-stone-500 font-mono flex items-center space-x-2">
                <Info size={11} className="text-[#C5A85C]" />
                <span>ADHD Support Active</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3-STEP ELEGANT ONBOARDING MODAL */}
      <AnimatePresence>
        {showOnboarding && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#060608]/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            id="onboarding-overlay"
          >
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-lg bg-[#0e0e11] border border-stone-850 p-6 md:p-8 rounded-sm shadow-2xl relative overflow-hidden text-left"
              id="onboarding-card"
            >
              {/* Top ambient line */}
              <div className="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-[#C5A85C]/60 to-transparent" />
              
              <div className="space-y-6 text-left">
                {/* Step indicator */}
                <div className="flex justify-between items-center border-b border-stone-900 pb-3">
                  <span className="text-[10px] font-mono tracking-[0.25em] text-[#C5A85C] uppercase font-bold">
                    System Initialization
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    Step {onboardingStep + 1} of 3
                  </span>
                </div>

                {onboardingStep === 0 && (
                  <motion.div
                    key="step-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-mono text-stone-500 block">01 / CONCEPT</span>
                    <h2 className="font-serif text-2xl text-stone-100 font-light tracking-tight leading-snug">
                      Sovereign Workspace Architecture
                    </h2>
                    <p className="text-stone-300 text-xs md:text-sm font-sans font-light leading-relaxed">
                      Welcome to Focus OS. This is a highly protective environment engineered strictly of raw local state to zero out psychological noise and help you maintain sovereign control of your attention.
                    </p>
                    <p className="text-stone-450 text-xs font-sans font-light leading-relaxed">
                      There are zero external indices, zero web trackers, and zero cloud backups. Everything you architect remains completely localized in your browser.
                    </p>
                  </motion.div>
                )}

                {onboardingStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-mono text-stone-500 block">02 / WORKFLOW</span>
                    <h2 className="font-serif text-2xl text-stone-100 font-light tracking-tight leading-snug">
                      Inbox Loops to Deep Focus
                    </h2>
                    <p className="text-stone-300 text-xs md:text-sm font-sans font-light leading-relaxed">
                      Offload peripheral thoughts and raw inputs instantly into your <strong className="text-stone-200">Open Loops</strong>. This keeps your working memory clear and avoids task-switching stress.
                    </p>
                    <p className="text-stone-300 text-xs md:text-sm font-sans font-light leading-relaxed">
                      Evaluate your thoughts, assign them category energy weights, and elevate just <strong className="text-stone-200">one single focal objective</strong> into the Focus Chamber at a time.
                    </p>
                  </motion.div>
                )}

                {onboardingStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    <span className="text-xs font-mono text-stone-500 block">03 / COHERENCE</span>
                    <h2 className="font-serif text-2xl text-stone-100 font-light tracking-tight leading-snug">
                      Immersive Sensory Isolation
                    </h2>
                    <p className="text-stone-300 text-xs md:text-sm font-sans font-light leading-relaxed">
                      Enter <strong className="text-[#C5A85C]">Visual Calm Mode</strong> to hide the entire workspace interface, leaving only a gorgeous minimal countdown progress ring.
                    </p>
                    <p className="text-stone-300 text-xs md:text-sm font-sans font-light leading-relaxed">
                      Activate warm, synthesized acoustic waves directly in-browser to mask ambient room noises and maintain complete attention coherence.
                    </p>
                  </motion.div>
                )}

                {/* Progress bar dot indicator */}
                <div className="flex space-x-2 pt-2">
                  {[0, 1, 2].map((idx) => (
                    <div
                      key={idx}
                      className={`h-1 rounded-full transition-all duration-300 ${
                        idx === onboardingStep
                          ? "w-8 bg-[#C5A85C]"
                          : "w-2 bg-stone-900"
                      }`}
                    />
                  ))}
                </div>

                {/* Bottom Actions Row */}
                <div className="flex justify-between items-center pt-4 border-t border-stone-900/60">
                  <button
                    onClick={() => {
                      if (onboardingStep > 0) {
                        setOnboardingStep((prev) => prev - 1);
                      }
                    }}
                    disabled={onboardingStep === 0}
                    className={`text-[10px] font-mono tracking-wider uppercase px-4 py-2 border border-stone-850 rounded-sm transition-all focus:outline-none ${
                      onboardingStep === 0
                        ? "text-stone-700 border-transparent bg-transparent pointer-events-none"
                        : "text-stone-400 hover:text-stone-200 hover:bg-stone-900 cursor-pointer"
                    }`}
                  >
                    Back
                  </button>

                  {onboardingStep < 2 ? (
                    <button
                      onClick={() => setOnboardingStep((prev) => prev + 1)}
                      className="text-[10px] font-mono tracking-wider uppercase bg-[#C5A85C]/10 border border-[#C5A85C]/30 hover:border-[#C5A85C]/60 text-[#C5A85C] hover:text-stone-200 px-5 py-2.5 rounded-sm transition-all cursor-pointer flex items-center space-x-1"
                    >
                      <span>Continue</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        try {
                          localStorage.setItem("focus_planner_onboarding_completed", "true");
                        } catch (_) {}
                        setShowOnboarding(false);
                      }}
                      className="text-[10px] font-mono tracking-wider uppercase bg-[#C5A85C] text-[#0e0e11] font-semibold hover:bg-stone-100 transition-all px-5 py-2.5 rounded-sm shadow-md cursor-pointer flex items-[#0e0e11] space-x-1"
                    >
                      <span>Initialize Workspace</span>
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
