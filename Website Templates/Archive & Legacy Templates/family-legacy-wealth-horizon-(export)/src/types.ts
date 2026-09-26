export type GoalCategory = 'education' | 'real_estate' | 'legacy_fund' | 'experiences';

export interface HorizonGoal {
  id: string;
  name: string;
  category: GoalCategory;
  targetDate: string;
  targetAmount: number;
  currentAmount: number;
}

export type ChoreStatus = 'pending' | 'completed' | 'approved';

export interface AllowanceChore {
  id: string;
  task: string;
  value: number;
  assignedTo: string;
  status: ChoreStatus;
  category: string;
}

export interface ProjectionParams {
  initialCapital: number;
  monthlyContribution: number;
  annualYield: number;
  years: number;
}

export interface SheetBlueprintSpec {
  title: string;
  columns: { name: string; type: string; formulaDescription?: string; relationTo?: string }[];
  formulas: { name: string; syntax: string; description: string }[];
}
