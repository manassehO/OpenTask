import type {
  BasicInformationValues,
  DistributionValues,
  RequirementsValues,
  ReviewValues,
  RewardStructureValues,
} from '../../types/task';

export const initialBasicInformation: BasicInformationValues = {
  title: '',
  taskDescription: '',
  category: '',
  tags: '',
  thumbnail: null,
};

export const initialRequirements: RequirementsValues = {
  instruction: '',
  example: '',
  qualification: '',
  deadline: '',
  submissionFormat: '',
};

export const initialRewardStructure: RewardStructureValues = {
  rewardPerSubmission: 0,
  currency: 'ETH',
  maxSubmission: 0,
};

export const initialDistribution: DistributionValues = {
  launchTime: '',
  visibilitySetting: '',
  userTargeting: '',
};

export const initialReview: ReviewValues = {
  launchTime: '',
  visibilitySetting: '',
  userTargeting: '',
  category: '',
  deadline: '',
  instructions: '',
  description: '',
  rewardAmount: '',
  maxSubmission: '',
};
