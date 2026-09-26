/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Core Data Entities for MotionScale Creative OS
export interface ProjectMetrics {
  predictiveDelayRisk: "Low" | "Medium" | "High";
  renderTimeEstimate: string; // e.g. "45 hrs", "3 hrs"
}

export interface Project {
  id: string;
  name: string;
  status: 'Scripting' | 'Storyboarding' | 'Asset Generation' | 'Rendering' | 'Revision' | 'Approved';
  deliveryDate: string;
  budget: number;
  clientName: string;
  animatorId: string; // e.g. "Diana Prince", "Ada Lovelace", etc.
  progress: number; // 0 to 100
  metrics: ProjectMetrics;
}

export interface CreativeAsset {
  id: string;
  projectId: string; // foreign key to Project
  name: string;
  type: '3D Model' | 'Rig' | 'Audio' | 'Voiceover' | 'B-Roll' | 'Raw Footage';
  version: string; // e.g. "v1.2"
  status: 'Draft' | 'Approved';
  fileUrl: string;
}

export interface ClientPortal {
  id: string;
  companyName: string;
  activeProjectIds: string[]; // references of Projects
  totalContractValue: number;
  mfaEnabled: boolean;
  securityLogs: string[];
}

export interface FinancialInvoice {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  projectId: string; // reference to Project
  dueDate: string;
}

export interface SystemHealth {
  status: string;
  geminiKeyDetected: boolean;
  currentTime: string;
  backupStatus: string;
  dbConnection: string;
}

export interface PricingVariable {
  developerRate: number;
  designTimeHours: number;
  consultingPremium: number;
  gumroadPrice: number;
  customSetupFee: number;
}
