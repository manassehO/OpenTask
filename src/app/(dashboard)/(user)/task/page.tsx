'use client';

import { useState } from 'react';
import ActiveTask from '~/_components/tasks/ActiveTask';
import Task from '~/_components/tasks/Task';

import { TaskTabs } from '~/_components/tasks/TaskTabs';

export default function TaskPage() {
  const [activeTab, setActiveTab] = useState<string>('Tasks');

  return (
    <div className="p-4">
      <h1 className="mb-4 text-lg font-bold md:text-xl">Tasks</h1>

      <TaskTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-6">
        {activeTab === 'Tasks' && <Task />}
        {activeTab === 'Active Task' && <ActiveTask />}
      </div>
    </div>
  );
}
