
export interface DepositItem {
  id: number;
  value: number;
  completed: boolean;
  locked?: boolean;
  completedAt?: string;
}

export interface ValueRule {
  value: number;
  count: number;
}

export interface Challenge {
  id: string;
  name: string;
  createdAt: string;
  deposits: DepositItem[];
  rules: ValueRule[];
  photo: string | null;
}

export interface ChallengeStats {
  totalDeposited: number;
  totalGoal: number;
  completedCount: number;
  remainingCount: number;
  percentage: number;
}

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  photo: string | null;
}
