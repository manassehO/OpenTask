import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TaskStore } from '../../types/task';
import {
  initialBasicInformation,
  initialRequirements,
  initialRewardStructure,
  initialDistribution,
  initialReview,
} from './initialValues';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // ===== INITIAL STATE =====
      currentStep: 0,
      totalSteps: 5,
      basicInformation: initialBasicInformation,
      requirements: initialRequirements,
      rewardStructure: initialRewardStructure,
      distribution: initialDistribution,
      review: initialReview,
      stepValidation: {},

      // ===== NAVIGATION ACTIONS =====
      setCurrentStep: (step: number) => {
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

      // ===== FORM ACTIONS =====
      setBasicInformation: (data) => {
        set({ basicInformation: data });
        const isValid = Boolean(
          data.title?.trim() &&
            data.taskDescription?.trim() &&
            data.category?.trim() &&
            data.tags?.trim(),
        );
        get().setStepValid(0, isValid);
      },

      setRequirements: (data) => {
        set({ requirements: data });
        const isValid = Boolean(
          data.instruction?.trim() &&
            data.submissionFormat?.trim() &&
            data.deadline?.trim() &&
            data.qualification?.trim(),
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
          data.launchTime.trim() &&
            data.userTargeting.trim() &&
            data.visibilitySetting.trim(),
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

      // ===== VALIDATION ACTIONS =====
      setStepValid: (step, isValid) => {
        set((state) => ({
          stepValidation: {
            ...state.stepValidation,
            [step]: isValid,
          },
        }));
      },

      isStepValid: (step) => {
        const { stepValidation } = get();
        return Boolean(stepValidation[step]);
      },

      // ===== UTILITY ACTIONS =====
      getAllFormData: () => {
        const state = get();
        return {
          basicInformation: state.basicInformation,
          requirements: state.requirements,
          rewardStructure: state.rewardStructure,
          distribution: state.distribution,
          review: state.review,
        };
      },

      resetForm: () => {
        set({
          currentStep: 0,
          basicInformation: initialBasicInformation,
          requirements: initialRequirements,
          rewardStructure: initialRewardStructure,
          distribution: initialDistribution,
          review: initialReview,
          stepValidation: {},
        });
      },

      resetStep: (step) => {
        const updates: Partial<TaskStore> = {};

        switch (step) {
          case 0:
            updates.basicInformation = initialBasicInformation;
            break;
          case 1:
            updates.requirements = initialRequirements;
            break;
          case 2:
            updates.rewardStructure = initialRewardStructure;
            break;
          case 3:
            updates.distribution = initialDistribution;
            break;
          case 4:
            updates.review = initialReview;
            break;
        }
      },
    }),
    {
      name: 'task-form-storage',
      partialize: (state) => ({
        currentStep: state.currentStep,
        basicInformation: state.basicInformation,
        requirements: state.requirements,
        rewardStructure: state.rewardStructure,
        distribution: state.distribution,
        review: state.review,
        stepValidation: state.stepValidation,
      }),
    },
  ),
);
