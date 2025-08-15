export type TaskStatus = 'active' | 'completed' | 'disputed' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  image: string;
  deadline: string;
  rewardInEth: number;
  rewardInUsd: number;
  isFlagged?: boolean;
  creator?: string;
  category: string;
}

export interface TaskCardProps {
  task: Task;
  onAction: (taskId: string) => void;
}

export interface RecommendedTask {
  id: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  image: string | null;
  createdAt: Date;
  updatedAt: Date | null;
  creatorUserId: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  rewardAmount: string;
  rewardTokenAddress: string;
  platformFee: string | null;
  approvedCompletions: number;
  inProgressCompletions: number;
  requiredCompletions: number;
  deadline: Date;
  fundingTxHash: string;
  maxCompletions: number;
}
