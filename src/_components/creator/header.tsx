'use client';

import { useEffect, useMemo, useState } from 'react';
import Stepper from '../creator/stepper';

interface HeaderProps {
  activeStepper: number;
}

function Header({ activeStepper }: HeaderProps) {
  const tabs = useMemo(
    () => [
      'basic info',
      'requirements',
      'reward structure',
      'distribution',
      'review',
    ],
    [],
  );

  const [activeTab, setActiveTab] = useState<string | undefined>(
    tabs[activeStepper],
  );

  // Update activeTab when activeStepper changes
  useEffect(() => {
    setActiveTab(tabs[activeStepper]);
  }, [activeStepper, tabs]);

  return (
    <div className="">
      <h1 className="text-2xl font-bold text-black sm:text-[1.75rem]">
        create task
      </h1>
      <Stepper
        tabs={tabs}
        activeStepper={activeTab}
        setActiveStepper={setActiveTab}
      />
    </div>
  );
}

export default Header;
