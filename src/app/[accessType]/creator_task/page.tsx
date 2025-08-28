'use client';

import { useState } from 'react';
import TaskCard from '~/_components/dashboard_components/dashbodard-task/TaskCard';
import { ActiveTask } from '~/_components/tasks/ActiveTask';
import CompletedTask from '~/_components/tasks/CompletedTask';
import DraftTask from '~/_components/tasks/DraftTask';

export default function TasksPage() {
  const [tab, setTab] = useState('Active task');

  const renderContent = () => {
    switch (tab.toLowerCase()) {
      case 'active task'.toLowerCase():
        return <ActiveTask />;
      case 'Draft task'.toLowerCase():
        return <DraftTask />;
      case 'Completed task'.toLowerCase():
        return <CompletedTask />;
      default:
        break;
    }
  };
  return (
    <div className="mx-auto md:p-4">
      <h1 className="text-[28px] font-bold capitalize">task</h1>

      {/* Tab Navigation */}
      <div className="mb-4 flex w-full max-w-[464px] overflow-x-auto bg-white p-2">
        {['Active task', 'Draft task', 'Completed task'].map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`w-full whitespace-nowrap rounded px-2 py-2 text-sm font-medium md:px-4 ${
              tab === status
                ? 'bg-primary text-white'
                : 'border-gray-300 bg-white text-gray-700'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Task Cards */}
      <div className="flex flex-col gap-4 md:flex-row">{renderContent()}</div>
    </div>
  );
}
