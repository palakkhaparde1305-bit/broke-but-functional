export type TransactionCategory = 
  | 'food' 
  | 'transport' 
  | 'entertainment' 
  | 'shopping' 
  | 'utilities' 
  | 'health' 
  | 'commitments' 
  | 'income' 
  | 'savings' 
  | 'emergency';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  category: TransactionCategory;
  type: 'expense' | 'income';
  day: number;
  timestamp: string;
  tags?: string[];
  vibeNote?: string;
  isSimulated?: boolean;
}

export interface Commitment {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  dueDay: number;
  status: 'pending' | 'paid' | 'skipped';
  autoDeduct: boolean;
  iconName: string;
  isEssential: boolean;
  notes?: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentSaved: number;
  isLocked: boolean;
  deadlineDay: number;
  emoji: string;
  color: string;
}

export interface LifeEventChoice {
  id: string;
  label: string;
  amountDelta: number; // negative for expense, positive for gain
  healthDelta: number;
  description: string;
  tag: string;
}

export interface LifeEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  triggerDay?: number;
  choices: LifeEventChoice[];
  resolvedChoiceId?: string;
  resolvedAtDay?: number;
}

export interface SimulationDraft {
  title: string;
  amount: number;
  category: TransactionCategory;
  type: 'expense' | 'income';
  isRecurring?: boolean;
  frequencyDays?: number;
  notes?: string;
}

export type RiskTier = 'SAFE' | 'CAUTION' | 'DANGER' | 'CRITICAL';

export interface SimulationResult {
  currentBalance: number;
  projectedBalance: number;
  balanceDelta: number;
  currentDailyAllowance: number;
  projectedDailyAllowance: number;
  dailyAllowanceDelta: number;
  currentHealthScore: number;
  projectedHealthScore: number;
  healthScoreDelta: number;
  currentRiskTier: RiskTier;
  projectedRiskTier: RiskTier;
  brokeDayForecast?: number;
  severity: 'safe' | 'warning' | 'danger';
  advice: string;
  survivalProbability: number;
}

export interface PillarScore {
  name: string;
  score: number; // 0 to 100
  weight: number; // percentage
  status: 'optimal' | 'moderate' | 'critical';
  insight: string;
}

export interface HealthScoreAnalysis {
  overallScore: number; // 0 to 100
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  riskTier: RiskTier;
  pillars: PillarScore[];
  headline: string;
  topRecommendation: string;
}

export interface UserProfile {
  id: string;
  name: string;
  tagline: string;
  initialBudget: number;
  initialCommitments: Commitment[];
  initialSavingsGoals: SavingsGoal[];
  avatar: string;
}

export interface BudgetBreakdown {
  fixedNeeds: number;
  discretionaryWants: number;
  lockedSavings: number;
  liquidAvailable: number;
  totalAllocated: number;
}

