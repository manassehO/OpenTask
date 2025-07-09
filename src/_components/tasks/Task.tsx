import { useRouter } from 'next/navigation';
import { mockTasks } from '~/mocks/tasks';
import TaskCard from './TaskCard';
import TaskFilterTabs, { type TaskFilterTab } from './TaskFilterTabs';
import { useState } from 'react';

const tabLabels = [
  { id: 'defi', label: 'De-Fi' },
  { id: 'userTesting1', label: 'User Testing' },
  { id: 'userTesting2', label: 'User Testing' },
  { id: 'userTesting3', label: 'User Testing' },
  { id: 'userTesting4', label: 'User Testing' },
  { id: 'userTesting5', label: 'User Testing' },
  { id: 'userTesting6', label: 'User Testing' },
];

const AllTasks = () => {
  const [activeTab, setActiveTab] = useState<string>('defi');

  const router = useRouter();
  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const tabs: TaskFilterTab[] = tabLabels.map((tab) => ({
    ...tab,
    active: activeTab === tab.id,
  }));

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };
  return (
    <div className="mt-8">
      <h1 className="mb-4 font-bold">All Tasks</h1>
      <TaskFilterTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
      />

      {activeTab === 'defi' && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockTasks.map((task) => (
            <TaskCard key={task.id} task={task} onAction={onClick} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecommendedTasks = () => {
  const router = useRouter();

  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };
  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-bold">Recommended For You</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockTasks.map((task) => (
          <TaskCard key={task.id} task={task} onAction={onClick} />
        ))}
      </div>
    </div>
  );
};

export default function Task() {
  return (
    <div className="">
      <RecommendedTasks />
      <AllTasks />
    </div>
  );
}
