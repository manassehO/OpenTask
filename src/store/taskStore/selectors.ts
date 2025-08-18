import type { TaskStore } from '../../types/task';

export const selectCurrentStepData = (state: TaskStore) => {
  const { currentStep } = state;
  switch (currentStep) {
    case 0:
      return state.basicInformation;
    case 1:
      return state.requirements;
    case 2:
      return state.rewardStructure;
    case 3:
      return state.distribution;
    case 4:
      return state.review;
    default:
      return null;
  }
};

export const selectStepProgress = (state: TaskStore) => ({
  current: state.currentStep + 1,
  total: state.totalSteps,
});

export const selectNavigationState = (state: TaskStore) => ({
  currentStep: state.currentStep,
  canGoNext: state.canGoNext(),
  canGoPrevious: state.canGoPrevious(),
});
