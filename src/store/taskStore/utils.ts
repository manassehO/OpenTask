import type { TaskFormData } from '../../types/task';

export const validateStep = (
  stepIndex: number,
  data: TaskFormData,
): boolean => {
  switch (stepIndex) {
    case 0: // Basic Information
      return Boolean(
        data.basicInformation.title &&
          data.basicInformation.taskDescription &&
          data.basicInformation.category &&
          data.basicInformation.tags,
      );
    case 1: // Requirements
      return Boolean(
        data.requirements.instruction?.trim() &&
          data.requirements.submissionFormat?.trim() &&
          data.requirements.deadline?.trim() &&
          data.requirements.qualification?.trim(),
      );
    case 2: // Reward Structure
      return Boolean(
        data.rewardStructure.rewardPerSubmission > 0 &&
          data.rewardStructure.maxSubmission > 0,
      );
    case 3: // Distribution
      return Boolean(
        data.distribution.launchTime.trim() &&
          data.distribution.visibilitySetting.trim() &&
          data.distribution.userTargeting.trim(),
      );
    case 4: // Review
      return Boolean(
        data.review.launchTime &&
          data.review.userTargeting &&
          data.review.visibilitySetting,
      );
    default:
      return false;
  }
};

export const getStepName = (stepIndex: number): string => {
  const stepNames = [
    'Basic Information',
    'Requirements',
    'Reward Structure',
    'Distribution',
    'Review',
  ];
  return stepNames[stepIndex] ?? 'Unknown Step';
};
