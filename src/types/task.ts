export type TaskStatus = 'active' | 'completed' | 'disputed' | 'cancelled';

export interface TaskFilters {
  limit?: number;
  page?: number;
  sort_by?: 'created_at';
  order?: 'asc' | 'desc';
  category?: string;
  min_reward?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  image: string;
  deadline: string;
  rewardInEth: string | number;
  rewardInUsd: string | number;
  isFlagged?: boolean;
  creator?: string;
  category?: string;
}

export interface TaskCardProps {
  task: Task;
  onAction?: (taskId: string) => void;
  isLoading?: boolean;
}

export type BasicInformationValues = {
  title: string;
  taskDescription: string;
  category: string;
  tags: string;
  thumbnail?: File | null; // Add this
};

export type RequirementsValues = {
  instruction: string;
  example?: string;
  submissionFormat: string;
  deadline: string;
  qualification: string;
};

export type RewardStructureValues = {
  rewardPerSubmission: number;
  currency: 'ETH' | 'USDC' | 'DAI';
  maxSubmission: number;
};

export type DistributionValues = {
  launchTime: string;
  visibilitySetting: string;
  userTargeting: string;
};

export type ReviewValues = {
  launchTime: string;
  visibilitySetting: string;
  userTargeting: string;
};

export interface TaskStore {
  // Navigation state
  currentStep: number;
  totalSteps: number;
  setCurrentStep: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canGoNext: () => boolean;
  canGoPrevious: () => boolean;

  // Form data for each step
  basicInformation: BasicInformationValues;
  requirements: RequirementsValues;
  rewardStructure: RewardStructureValues;
  distribution: DistributionValues;
  review: ReviewValues;

  // Setters for each step
  setBasicInformation: (data: BasicInformationValues) => void;
  setRequirements: (data: RequirementsValues) => void;
  setRewardStructure: (data: RewardStructureValues) => void;
  setDistribution: (data: DistributionValues) => void;
  setReview: (data: ReviewValues) => void;

  // Validation state
  stepValidation: Record<number, boolean>;
  setStepValid: (step: number, isValid: boolean) => void;
  isStepValid: (step: number) => boolean;

  // Utility functions
  getAllFormData: () => TaskFormData;
  resetForm: () => void;
  resetStep: (step: number) => void;
}

// Combined form data type
export type TaskFormData = {
  basicInformation: BasicInformationValues;
  requirements: RequirementsValues;
  rewardStructure: RewardStructureValues;
  distribution: DistributionValues;
  review: ReviewValues;
};

// Step-specific hook return types
export type StepHookReturn<T> = {
  data: T;
  setData: (data: T) => void;
  isValid: boolean;
  goNext?: () => void;
  goPrevious?: () => void;
  canGoNext?: boolean;
  canGoPrevious?: boolean;
};
