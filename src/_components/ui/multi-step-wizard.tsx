'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isValid?: boolean;
}

interface MultiStepWizardProps {
  steps: Step[];
  onComplete: () => void;
  onStepChange?: (stepIndex: number) => void;
  className?: string;
  showProgress?: boolean;
  allowSkip?: boolean;
}

const MultiStepWizard: React.FC<MultiStepWizardProps> = ({
  steps,
  onComplete,
  onStepChange,
  className = '',
  showProgress = true,
  allowSkip = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const currentStepData = steps[currentStep];

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      const nextStep = currentStep + 1;
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    }
  };

  const handleSkip = () => {
    if (allowSkip && !isLastStep) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  };

  const goToStep = (stepIndex: number) => {
    if (stepIndex <= currentStep || completedSteps.has(stepIndex - 1)) {
      setCurrentStep(stepIndex);
      onStepChange?.(stepIndex);
    }
  };

  const getStepStatus = (stepIndex: number) => {
    if (completedSteps.has(stepIndex)) return 'completed';
    if (stepIndex === currentStep) return 'current';
    if (stepIndex < currentStep) return 'completed';
    return 'upcoming';
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Progress Indicator */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index);
              return (
                <div key={step.id} className="flex items-center">
                  <motion.div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 cursor-pointer transition-all duration-300 ${
                      status === 'completed'
                        ? 'bg-green-500 border-green-500 text-white'
                        : status === 'current'
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }`}
                    onClick={() => goToStep(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {status === 'completed' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${
                      completedSteps.has(index) ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Step titles */}
          <div className="flex justify-between mt-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex-1 text-center">
                <p className={`text-sm font-medium ${
                  getStepStatus(index) === 'current' ? 'text-blue-600' : 'text-gray-600'
                }`}>
                  {step.title}
                </p>
                {step.description && (
                  <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStepData?.title}
              </h2>
              {currentStepData?.description && (
                <p className="text-gray-600">{currentStepData.description}</p>
              )}
            </div>
            
            <div className="flex-1">
              {currentStepData?.component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        
        <div className="flex space-x-3">
          {allowSkip && !isLastStep && (
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Skip
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={currentStepData?.isValid === false}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLastStep ? 'Complete' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiStepWizard;
export type { Step, MultiStepWizardProps };