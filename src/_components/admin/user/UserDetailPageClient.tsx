'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames';
import { FaPhone, FaEnvelope, FaUserCircle } from 'react-icons/fa';

interface UserDetailPageClientProps {
  userId: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  rewardETH: string;
  rewardUSD: string;
  type: 'active' | 'created';
}

export default function UserDetailPageClient({
  userId,
}: UserDetailPageClientProps) {
  const router = useRouter();

  // mock user data (replace later)
  const [user, setUser] = useState({
    id: userId,
    name: 'username',
    email: 'user123@gmail.com',
    phone: '+2348078868319',
    status: 'active',
    avatar: '',
    balanceUSD: 2000,
    disputes: 3,
    tasksCompleted: 2000,
    tasksCreated: 15,
    activeTasks: 3,
  });

  // mock tasks
  const [tasks] = useState<Task[]>(
    Array(16)
      .fill(null)
      .flatMap((_, i) => [
        {
          id: `a${i}`,
          title: 'Complete a Short Survey About DeFi',
          description:
            'Lorem ipsum dolor sit amet consectetur. Ultricies ultricies mauris morbi aenean pellentesque',
          rewardETH: '0.005 ETH',
          rewardUSD: '$2,000',
          type: 'active' as const,
        },
        {
          id: `c${i}`,
          title: 'Share a DeFi Article on Twitter',
          description:
            'Lorem ipsum dolor sit amet consectetur. Ultricies ultricies mauris morbi aenean pellentesque',
          rewardETH: '0.002 ETH',
          rewardUSD: '$800',
          type: 'created' as const,
        },
      ]),
  );

  // task tab logic
  const [taskTab, setTaskTab] = useState<'active' | 'created'>('active');
  const filteredTasks = tasks.filter((t) => t.type === taskTab);

  const handleDeactivate = () => {
    setUser((prev) => ({ ...prev, status: 'inactive' }));
    alert('User deactivated (mock)');
  };

  return (
    <div className="space-y-2 bg-gray-50">
      <button
        onClick={() => router.back()}
        className="text-xs text-blue-600 hover:underline"
      >
        ← Back to Users
      </button>

      {/* profile & deactivate */}
      <div className="flex w-full flex-col justify-between gap-6 sm:flex-row md:items-start">
        {/* profile */}
        <div className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user.avatar || '/noavatar.png'}
              alt={user.name}
              width={62}
              height={62}
              className="rounded-full object-cover"
            />
            <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
          </div>
          <div className="ml-5 rounded bg-white px-5 py-2">
            <p className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <FaPhone className="rotate-90 text-blue-500" /> {user.phone}
              <FaEnvelope className="ml-4 text-blue-500" /> {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleDeactivate}
          className="h-10 whitespace-nowrap rounded bg-red-600 px-8 py-2 text-sm text-white hover:bg-red-700"
        >
          Deactivate
        </button>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatCard
          label="Total Balance"
          value={`$${user.balanceUSD}`}
          icon={<FaUserCircle className="text-2xl text-blue-500" />}
        />
        <StatCard
          label="Tasks Completed"
          value={user.tasksCompleted.toString()}
          icon={<FaUserCircle className="text-2xl text-blue-500" />}
        />
        <StatCard
          label="Tasks Created"
          value={user.tasksCreated.toString()}
          icon={<FaUserCircle className="text-2xl text-blue-500" />}
        />
        <StatCard
          label="Active Tasks"
          value={user.activeTasks.toString()}
          icon={<FaUserCircle className="text-2xl text-blue-500" />}
        />
      </div>

      {/* tasks section */}
      <section>
        <h3 className="mb-4 text-xl font-bold text-gray-700">Tasks</h3>
        {/* tabs */}
        <div className="mb-6 flex space-x-4">
          {(
            [
              { label: `Active Tasks`, key: 'active' },
              { label: `Created Tasks `, key: 'created' },
            ] as { label: string; key: 'active' | 'created' }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setTaskTab(tab.key)}
              className={classNames('rounded px-6 py-2 transition-colors', {
                'bg-[#3b82f6] text-sm text-white': taskTab === tab.key,
                'text-sm text-gray-700 hover:bg-gray-100': taskTab !== tab.key,
              })}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* tasks grid (horizontal scroll) */}
        {filteredTasks.length === 0 ? (
          <div className="space-y-2 text-center text-sm text-gray-500">
            <Image
              src="/empty.svg"
              alt="No tasks"
              width={120}
              height={120}
              className="mx-auto"
            />
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="min-w-[240px] snap-start overflow-hidden rounded-lg bg-white sm:min-w-[280px] lg:min-w-[395px]"
              >
                <div className="relative h-36">
                  <Image
                    src="/task-img.png"
                    alt="Task illustration"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h4 className="line-clamp-2 text-sm font-semibold text-gray-800">
                    {task.title}
                  </h4>
                  <p className="line-clamp-2 text-xs text-gray-600">
                    {task.description}
                  </p>
                  <div className="flex justify-between py-5 text-xs font-medium text-gray-500">
                    <span className="font-semibold text-gray-700">
                      {task.rewardETH}
                    </span>
                    <span className="text-xl font-semibold text-[#5492f7]">
                      {task.rewardUSD}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-start gap-2 rounded bg-white p-4 text-center">
      <span className="text-2xl">{icon}</span>
      <p className="text-xs text-gray-600">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  );
}
