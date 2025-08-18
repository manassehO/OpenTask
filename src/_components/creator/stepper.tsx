'use client';
import { type Dispatch, useRef, useEffect } from 'react';
import { type SetStateAction } from 'jotai';
import { motion } from 'framer-motion';

interface StepperProps {
  tabs: string[];
  activeStepper?: string;
  setActiveStepper?: Dispatch<SetStateAction<string | undefined>>;
}

function Stepper({ tabs, setActiveStepper, activeStepper }: StepperProps) {
  const stepperRefs = useRef<(HTMLLIElement | null)[]>([]);

  // Auto-scroll active step into view on small screens
  useEffect(() => {
    const index = tabs.findIndex((tab) => tab === activeStepper);
    if (index !== -1 && stepperRefs.current[index]) {
      stepperRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'end',
        block: 'nearest',
      });
    }
  }, [activeStepper, tabs]);

  return (
    <div className="overflow-x-auto">
      <ul className="relative flex w-fit space-x-4 rounded bg-white p-2">
        {tabs.map((tab, i) => {
          const isActive = tab.toLowerCase() === activeStepper?.toLowerCase();

          return (
            <motion.li
              ref={(el) => {
                stepperRefs.current[i] = el;
              }}
              key={i}
              className={`relative z-10 rounded px-4 py-3 text-[0.875rem] font-semibold capitalize transition-colors lg:px-8 ${
                isActive ? 'text-white' : 'text-[#414141]'
              }`}
              style={{ cursor: 'default', pointerEvents: 'none' }}
            >
              <span className="relative z-10 whitespace-nowrap">{tab}</span>

              {isActive && (
                <motion.div
                  layoutId="activeStepper"
                  className="absolute inset-0 -z-10 rounded bg-primary"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              )}
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}

export default Stepper;
