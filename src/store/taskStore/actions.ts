import type { StateCreator } from 'zustand';
import type { TaskStore } from '../../types/task';

export const createNavigationActions: StateCreator<
  TaskStore,
  [],
  [],
  Pick<
    TaskStore,
    | 'setCurrentStep'
    | 'goToNextStep'
    | 'goToPreviousStep'
    | 'canGoNext'
    | 'canGoPrevious'
  >
> = (set, get) => ({
  setCurrentStep: (step) => {
    const { totalSteps } = get();
    if (step >= 0 && step < totalSteps) {
      set({ currentStep: step });
    }
  },

  goToNextStep: () => {
    const { currentStep, totalSteps, canGoNext } = get();
    if (canGoNext()) {
      set({ currentStep: Math.min(currentStep + 1, totalSteps - 1) });
    }
  },

  goToPreviousStep: () => {
    const { currentStep, canGoPrevious } = get();
    if (canGoPrevious()) {
      set({ currentStep: Math.max(currentStep - 1, 0) });
    }
  },

  canGoNext: () => {
    const { currentStep, totalSteps, isStepValid } = get();
    return currentStep < totalSteps - 1 && isStepValid(currentStep);
  },

  canGoPrevious: () => {
    const { currentStep } = get();
    return currentStep > 0;
  },
});

export const createFormActions: StateCreator<
  TaskStore,
  [],
  [],
  Pick<
    TaskStore,
    | 'setBasicInformation'
    | 'setRequirements'
    | 'setRewardStructure'
    | 'setDistribution'
    | 'setReview'
  >
> = (set, get) => ({
  setBasicInformation: (data) => {
    set({ basicInformation: data });
    const isValid = Boolean(
      data.title && data.taskDescription && data.category && data.tags,
    );
    get().setStepValid(0, isValid);
  },

  setRequirements: (data) => {
    set({ requirements: data });
    const isValid = Boolean(
      data.instruction.length > 10 &&
        data.submissionFormat &&
        data.submissionFormat &&
        data.qualification,
    );
    get().setStepValid(1, isValid);
  },

  setRewardStructure: (data) => {
    set({ rewardStructure: data });
    const isValid = Boolean(
      data.rewardPerSubmission > 0 && data.maxSubmission > 0,
    );
    get().setStepValid(2, isValid);
  },

  setDistribution: (data) => {
    set({ distribution: data });
    const isValid = Boolean(
      data.launchTime && data.visibilitySetting && data.userTargeting,
    );
    get().setStepValid(3, isValid);
  },

  setReview: (data) => {
    set({ review: data });
    const isValid = Boolean(
      data.launchTime && data.userTargeting && data.visibilitySetting,
    );
    get().setStepValid(4, isValid);
  },
});
