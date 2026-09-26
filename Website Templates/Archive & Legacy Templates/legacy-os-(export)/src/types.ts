/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DailyFocusBlock {
  id: string;
  hour: number; // 1 to 5
  priorityTitle: string;
  category: "Revenue" | "Operations & Systems" | "Product Delivery" | "Wealth Planning" | "Zen Break";
  status: "pending" | "active" | "completed";
  durationMinutes: number;
}

export type PipelineStage = 
  | "Inquiry" 
  | "Proposal Sent" 
  | "Contract Signed" 
  | "Onboarding" 
  | "Active Execution" 
  | "Account Review";

export interface PremiumClient {
  id: string;
  name: string;
  companyName: string;
  email: string;
  retainerTier: string;
  retainerAmount: number;
  stage: PipelineStage;
  contractStatus: "Draft" | "Sent" | "Signed" | "Secured";
  contractText: string; // Used for AI Summarization
  onboardingChecklist: { id: string; label: string; done: boolean }[];
  milestones: { id: string; label: string; status: "Pending" | "Active" | "Delivered" }[];
  notes: string;
  dateBoarded?: string;
}

export interface BusinessValuationMetric {
  id: string;
  assetName: string;
  category: "High-Yield Treasury" | "Strategic Growth Fund" | "Real Estate Holdings" | "Liquid Operational Reserves" | "Business Equity" | "Holding Company Reserve" | "Real Estate Ledger" | "Liquid Trusts";
  currentValue: number;
  appreciationRate: number; // e.g. 8 for 8%
  beneficiaryName: string;
  status: "Fully Managed" | "Active Funding" | "Planned Legacy";
}

export interface LegacyMilestone {
  id: string;
  milestoneTitle: string;
  category: "Succession Planning" | "Trust Setup" | "Generational Education" | "Asset Protection";
  targetDate: string;
  status: "Planned" | "In Progress" | "Protected";
  notes: string;
}

export interface AISummarizeResult {
  clientName: string;
  summaryText: string;
  summarizedAt: string;
}

export interface AICopywriteResult {
  pitchName: string;
  campaignType: string;
  targetAudience: string;
  pitchText: string;
  generatedAt: string;
}
