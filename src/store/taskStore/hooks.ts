import { useTaskStore } from '..';
import type { StepHookReturn } from '../../types/task';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBasicInformationStep = (): StepHookReturn<any> => {
  const store = useTaskStore();
  return {
    data: store.basicInformation,
    setData: store.setBasicInformation,
    isValid: store.isStepValid(0),
    goNext: store.goToNextStep,
    canGoNext: store.canGoNext(),
  };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useRequirementsStep = (): StepHookReturn<any> => {
  const store = useTaskStore();
  return {
    data: store.requirements,
    setData: store.setRequirements,
    isValid: store.isStepValid(1),
    goNext: store.goToNextStep,
    goPrevious: store.goToPreviousStep,
    canGoNext: store.canGoNext(),
    canGoPrevious: store.canGoPrevious(),
  };
};
