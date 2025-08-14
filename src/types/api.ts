export type FindTasksInput = {
  category?: string;
  min_reward?: number;
  sort_by?: 'reward' | 'created_at';
  order?: 'asc' | 'desc';
  limit?: number;
  page?: number;
};

export type TaskSummary = {
  id: string;
  creatorUserId: string;
  title: string;
  description: string;
  instructions: string;
  category: string;
  rewardAmount: number;
  rewardTokenAddress: string;
  platformFee: number;
  approvedCompletions: number;
  inProgressCompletions: number;
  requiredCompletions: number;
  deadline: string;
  image: string | null;
  status: 'ACTIVE' | 'DRAFT' | 'PUBLISHED';
  fundingTxHash: string | null;
  createdAt: string;
  updatedAt: string | null;
  maxCompletions: number;
};

export type FindTasksOutput = {
  success: true;
  tasks: TaskSummary[];
  totalCount: number;
};

export type GetTaskByIdInput = {
  taskId: string;
};

export type TaskDetail = {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'DRAFT' | 'PUBLISHED';
  createdAt: string;
  updatedAt: string | null;
  creatorId: string;
  creatorDisplayName: string;
  instructions?: string;
  category?: string;
  rewardAmount?: number;
  rewardTokenAddress?: string;
  platformFee?: number;
  approvedCompletions?: number;
  inProgressCompletions?: number;
  requiredCompletions?: number;
  deadline?: string;
  image?: string | null;
  fundingTxHash?: string | null;
  maxCompletions?: number;
};

export type ClaimTaskInput = {
  taskId: string;
};

export type ClaimTaskOutput = {
  success: boolean;
  message: string;
};

export type CancelTaskInput = {
  taskId: string;
};

export type CancelTaskOutput = {
  success: boolean;
  message: string;
};

export type SubmitTaskInput = {
  taskId: string;
  submissionType: 'TEXT' | 'FILE' | 'URL';
  textContent?: string;
  submissionUrl?: string | null;
  fileMetadata?: unknown;
  additionalNotes?: string | null;
};

export type SubmitTaskOutput = {
  success: boolean;
  submissionId: string;
  message: string;
};
