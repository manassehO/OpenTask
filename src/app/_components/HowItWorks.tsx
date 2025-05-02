'use client';

import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface Step {
  title: string;
  details: string[];
  image: string | null;
}

const DEFAULT_STEP = 0;
type StepIndex = 0 | 1 | 2 | 3;

const steps = [
  {
    title: 'Sign Up Simply',
    details: [
      'Use Your Existing Social Account',
      'No Wallet Setup Required',
      'Instant Access To Tasks'
    ],
    image: '/landing/sign-demo.png'
  },
  {
    title: 'Choose Your Tasks',
    details: [
      'Browse available projects and tasks',
      'Filter by skills and experience level',
      'Select tasks that match your interests'
    ],
    image: null
  },
  {
    title: 'Complete & Earn',
    details: [
      'Work on tasks at your own pace',
      'Submit your contributions',
      'Get rewarded upon completion',
      'Build your reputation in the community'
    ],
    image: null
  },
  {
    title: 'Track & Learn',
    details: [
      'Monitor your progress dashboard',
      'Learn from community feedback',
      'Improve your skills through practice',
      'Join our developer community'
    ],
    image: null
  }
] as const satisfies readonly [Step, Step, Step, Step];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<StepIndex>(DEFAULT_STEP);
  const currentStep = steps[activeStep];

  return (
    <section className="w-full max-w-7xl mx-auto py-8 sm:py-12 md:py-16 px-4 sm:px-6 md:px-8 lg:px-32 bg-white">
      <div className="mb-6 sm:mb-8 flex flex-col items-center text-center">
        <div className="inline-block px-4 sm:px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-3 sm:mb-4">
          How It Works
        </div>
        <h2 className="flex flex-col text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-3">
          <span>From start to finish — what to</span>
          <span>expect</span>
        </h2>
        <p className="text-gray-600 max-w-2xl text-sm sm:text-base">
          Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam imperdiet.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Left side - Accordion */}
        <div className="space-y-2 sm:space-y-3">
          {steps.map((s, index) => (
            <div 
              key={s.title} 
              className={`w-full rounded-xl transition-all duration-200 ${
                activeStep === index 
                  ? 'bg-blue-500 text-white shadow-lg' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <button
                onClick={() => setActiveStep(index as StepIndex)}
                className="w-full text-left p-3 sm:p-4 flex items-center justify-between"
              >
                <span className={`text-lg sm:text-xl md:text-2xl ${activeStep === index ? 'font-medium' : 'text-gray-900'}`}>
                  {s.title}
                </span>
                <div className={activeStep === index ? 'text-white/70' : 'text-gray-400'}>
                  {activeStep === index ? (
                    <FiChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <FiChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {activeStep === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 sm:px-4 pb-3 sm:pb-4">
                      <ul className="space-y-1 sm:space-y-2">
                        {s.details.map((detail, i) => (
                          <li key={i} className="text-sm sm:text-base text-white/90">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Right side - Demo Image */}
        <div className="hidden md:flex items-center justify-center bg-gray-50 rounded-xl p-4 sm:p-6 md:p-8">
          <AnimatePresence mode="wait">
            {currentStep.image ? (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
              >
                <Image
                  src={currentStep.image}
                  alt={`${currentStep.title} demonstration`}
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full aspect-[4/3] rounded-lg bg-gray-100 flex items-center justify-center"
              >
                <p className="text-gray-400 text-center px-4 text-sm sm:text-base">
                  {currentStep.title} visualization coming soon
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}; 