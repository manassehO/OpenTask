'use client';

import { useState } from 'react';
import { ActiveTask } from '~/_components/tasks/ActiveTask';
import Task from '~/_components/tasks/Task';

import { TaskTabs } from '~/_components/tasks/TaskTabs';

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<string>('Tasks');
  const handleSwitchTab = (tab: string) => {
    setActiveTab(tab);
  };
  const renderContent = () => {
    switch (activeTab.toLowerCase()) {
      case 'tasks':
        return <Task />;
      case 'active task':
        return <ActiveTask />;

      default:
        return <Task />;
    }
  };
  return (
    <section className="space-y-6 pt-10">
      <div className="space-y-3">
        <p className="text-xl font-bold text-black sm:text-[24px] md:text-[28px]">
          Tasks
        </p>
        <div className="w-fit rounded bg-white p-2">
          <TaskTabs activeTab={activeTab} onTabChange={handleSwitchTab} />
        </div>
      </div>
      {renderContent()}
    </section>
  );
}
