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
      'Instant Access To Tasks',
    ],
    image: '/landing/sign-demo.png',
  },
  {
    title: 'Choose Your Tasks',
    details: [
      'Browse available projects and tasks',
      'Filter by skills and experience level',
      'Select tasks that match your interests',
    ],
    image: null,
  },
  {
    title: 'Complete & Earn',
    details: [
      'Work on tasks at your own pace',
      'Submit your contributions',
      'Get rewarded upon completion',
      'Build your reputation in the community',
    ],
    image: null,
  },
  {
    title: 'Track & Learn',
    details: [
      'Monitor your progress dashboard',
      'Learn from community feedback',
      'Improve your skills through practice',
      'Join our developer community',
    ],
    image: null,
  },
] as const satisfies readonly [Step, Step, Step, Step];

export const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState<StepIndex>(DEFAULT_STEP);
  const currentStep = steps[activeStep];

  return (
    <section className="mx-auto w-full max-w-7xl bg-white px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-32">
      <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
        <div className="mb-3 inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 sm:mb-4 sm:px-6">
          How It Works
        </div>
        <h2 className="mb-2 flex flex-col text-2xl font-bold sm:mb-3 sm:text-3xl md:text-4xl">
          <span>From start to finish — what to</span>
          <span>expect</span>
        </h2>
        <p className="max-w-2xl text-sm text-gray-600 sm:text-base">
          Lorem ipsum dolor sit amet consectetur. Non tortor diam vel nullam
          imperdiet.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
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
                className="flex w-full items-center justify-between p-3 text-left sm:p-4"
              >
                <span
                  className={`text-lg sm:text-xl md:text-2xl ${activeStep === index ? 'font-medium' : 'text-gray-900'}`}
                >
                  {s.title}
                </span>
                <div
                  className={
                    activeStep === index ? 'text-white/70' : 'text-gray-400'
                  }
                >
                  {activeStep === index ? (
                    <FiChevronUp className="h-4 w-4 sm:h-5 sm:w-5" />
                  ) : (
                    <FiChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
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
                    <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                      <ul className="space-y-1 sm:space-y-2">
                        {s.details.map((detail, i) => (
                          <li
                            key={i}
                            className="text-sm text-white/90 sm:text-base"
                          >
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
        <div className="hidden items-center justify-center rounded-xl bg-gray-50 p-4 sm:p-6 md:flex md:p-8">
          <AnimatePresence mode="wait">
            {currentStep.image ? (
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-lg"
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
                className="flex aspect-[4/3] w-full items-center justify-center rounded-lg bg-gray-100"
              >
                <p className="px-4 text-center text-sm text-gray-400 sm:text-base">
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
