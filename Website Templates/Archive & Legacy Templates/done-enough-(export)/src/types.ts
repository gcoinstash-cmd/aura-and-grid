/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubStep {
  id: string;
  text: string;
  completed: boolean;
}

export interface FocusTask {
  id: string;
  sourceText: string;
  primaryStep: string;
  reassuringReason: string;
  subSteps: SubStep[];
  energyLevel: "Calm" | "Steady" | "High";
  doneEnoughMetric: number; // Percentage threshold of completeness that is "done enough", e.g., 70%
  doneEnoughReason: string; // Dynamic text explanation of what's enough
  category: "Creation" | "Work" | "Studying" | "Life" | "Unclutter";
}

export interface UserStats {
  xp: number;
  shippedCount: number;
  streakCount: number;
  historyLogs: {
    id: string;
    taskTitle: string;
    completedAt: string;
    wasDoneEnough: boolean;
    durationMinutes: number;
  }[];
}

export type ViewState = 
  | "landing"
  | "brain-dump"
  | "next-step"
  | "focus-sprint"
  | "completion"
  | "reset-dashboard";
