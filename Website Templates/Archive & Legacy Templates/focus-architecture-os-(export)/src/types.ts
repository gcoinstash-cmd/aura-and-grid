export enum EnergyLevel {
  HIGH_CHARGE = "⚡ High Charge",
  LOW_BATTERY = "🔋 Low Battery",
  BODY_DOUBLE = "👤 Body Double",
}

export enum Horizon {
  NOW = "Now",
  NEXT = "Next",
  LATER = "Later",
}

export enum TaskStatus {
  INBOX = "Inbox",
  BACKLOG = "Backlog",
  NEXT_UP = "Next up",
  IN_PROGRESS = "In Progress",
  COMPLETE = "Complete",
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  completed: boolean;
  energy: EnergyLevel;
  horizon: Horizon;
  paralyzed: boolean;
  parentWorkspaceId: string;
  subtasks: SubTask[];
  notes?: string;
  createdAt: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes: number; // e.g. 2, 3, 5 mins (strictly under 5)
}

export interface InboxItem {
  id: string;
  content: string;
  processed: boolean;
  createdAt: string;
  status?: TaskStatus;
  energy?: EnergyLevel;
  parentWorkspaceId?: string;
}

export interface Habit {
  id: string;
  title: string;
  completedDays: Record<string, boolean>; // date string key -> value
  category: "Ritual" | "Meds & Care" | "Nourish";
  timeOfDay: "Morning" | "Afternoon" | "Evening";
}

export interface AudioLayer {
  id: string;
  name: string;
  type: "Binaural" | "Zen Pad" | "Brown Noise" | "Cosmic Pulse";
  frequency: string;
  volume: number;
}
