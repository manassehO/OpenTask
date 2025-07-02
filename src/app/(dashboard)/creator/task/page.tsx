'use client';

import { useState } from 'react';
import TaskCard from '~/_components/dashboard_components/dashbodard-task/TaskCard';

type Task = {
  id: string;
  title: string;
  status: 'Active task' | 'Draft task' | 'Completed task';
  type:
    | 'testing'
    | 'survey'
    | 'pending'
    | 'review'
    | 'draft'
    | 'research'
    | 'completed';
  progress: number;
  submissions: number;
  eth: string;
  deadline: string;
  substatus: 'testing' | 'survey';
};

const tasks: Task[] = [
  {
    id: '1',
    title: 'Test a new web3 wallet interface',
    status: 'Active task',
    type: 'testing',
    progress: 40,
    submissions: 24,
    eth: '0.08 / 0.1 ETH',
    deadline: 'Apr 25, 2025',
    substatus: 'testing',
  },
  {
    id: '2',
    title: 'Complete a short survey about DeFi',
    status: 'Active task',
    type: 'survey',
    progress: 80,
    submissions: 45,
    eth: '0.05 / 0.1 ETH',
    deadline: 'Apr 25, 2025',
    substatus: 'testing',
  },
  {
    id: '3',
    title: 'Test a new web3 wallet interface',
    status: 'Draft task',
    type: 'review',
    progress: 0,
    submissions: 0,
    eth: 'Planned Budget: 0.08/0.1 ETH',
    deadline: 'Last Edited: Apr 25,2025',
    substatus: 'testing',
  },
  {
    id: '4',
    title: 'Participate in a user study for a new dApp',
    status: 'Draft task',
    type: 'research',
    progress: 0,
    submissions: 0,
    eth: 'Planned Budget: 0.08/0.1 ETH',
    deadline: 'Last Edited: Apr 25,2025',
    substatus: 'testing',
  },
  {
    id: '5',
    title: 'Test a new web3 wallet interface',
    status: 'Completed task',
    type: 'testing',
    progress: 40,
    submissions: 24,
    eth: '0.08/0.1 ETH',
    deadline: 'Mar 20, 2025',
    substatus: 'testing',
  },
  {
    id: '6',
    title: 'Complete a short survey about DeFi',
    status: 'Completed task',
    type: 'survey',
    progress: 80,
    submissions: 24,
    eth: '0.08/0.1 ETH',
    deadline: 'Jan 10, 2025',
    substatus: 'survey',
  },
];

export default function TasksPage() {
  const [tab, setTab] = useState('Active task');

  const filteredTasks = tasks.filter((task) => task.status === tab);

  return (
    <div className="mx-auto md:p-4">
      <h1 className="text-[28px] font-bold capitalize">task</h1>
      {/* Tab Navigation */}
      <div className="mb-4 flex w-full max-w-[464px] overflow-x-auto bg-white p-2">
        {['Active task', 'Draft task', 'Completed task'].map((status) => (
          <button
            key={status}
            onClick={() => setTab(status)}
            className={`w-full whitespace-nowrap rounded px-4 py-2 text-sm font-medium ${
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
      <div className="flex gap-4">
        {filteredTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
