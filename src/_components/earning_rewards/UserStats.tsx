'use client';
import Image from 'next/image';
import { getUserStats } from '~/app/api/profile';

import { type StatsProps } from '~/types/userEarning';

const StatsCard = ({ data }: { data: StatsProps }) => {
  return (
    <div className="space-y-2 px-6 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <Image
        src={data.icon}
        alt={data.title}
        width={20}
        height={20}
        style={{ background: data.iconBg }}
        className={`mb-2 size-8 rounded-md p-2`}
      />
      <p className="text-grey">{data.title}</p>
      <h2 className="text-2xl font-bold text-black">{data.value}</h2>
      {data.amount && <p className="font-bold text-primary">{data.amount}</p>}
      {data.tasksRemaining && (
        <p className="font-bold text-primary">{data.tasksRemaining}</p>
      )}
      {data.completionRate && (
        <p className="font-bold text-primary">{data.completionRate}</p>
      )}
    </div>
  );
};

export const UserStats = () => {
  const { userStats, isLoading } = getUserStats();

  if (isLoading) {
    return (
      <div className="mt-8">
        <h1 className="my-4 text-lg font-bold">Earnings and Reward</h1>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="animate-pulse space-y-2 px-6 py-4 shadow-sm"
            >
              <div className="mb-2 size-8 rounded-md bg-gray-200" />
              <div className="h-4 w-20 rounded bg-gray-200" />
              <div className="h-6 w-16 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const userStatsData: StatsProps[] = [
    {
      icon: '/icons/payments-cyan.svg',
      title: 'Total Earned',
      value:
        userStats?.totalEarnings !== undefined
          ? `${userStats.totalEarnings} ETH`
          : '0.00 ETH',
      amount:
        userStats?.earningSummary?.fiatValue !== undefined
          ? `$${userStats.earningSummary.fiatValue.toFixed(2)}`
          : '$0.00',
      iconBg: '#06B6D41A',
    },
    {
      icon: '/icons/account_balance_wallet.svg',
      title: 'Available Balance',
      value:
        userStats?.totalEarnings !== undefined
          ? `${userStats.totalEarnings} ETH`
          : '0.00 ETH',
      amount:
        userStats?.earningSummary?.fiatValue !== undefined
          ? `$${userStats.earningSummary.fiatValue.toFixed(2)}`
          : '$0.00',
      iconBg: '#CB00A31A',
    },
    {
      icon: '/icons/inactive_order.svg',
      title: 'Current Streak',
      value:
        userStats?.currentStreak !== undefined
          ? `${userStats.currentStreak} Days`
          : '0 Days',
      tasksRemaining:
        userStats?.longestStreak !== undefined
          ? `${userStats.longestStreak} Days Best`
          : '0 Days Best',
      iconBg: '#D47B061A',
    },
    {
      icon: '/icons/inventory.svg',
      title: 'Tasks Completed',
      value:
        userStats?.completedTasks !== undefined
          ? `${userStats.completedTasks}`
          : '0',
      completionRate:
        userStats?.earningSummary?.tasksCompleted !== undefined &&
        userStats?.completedTasks !== undefined
          ? `${userStats.earningSummary.tasksCompleted > 0 ? Math.round((userStats.completedTasks / userStats.earningSummary.tasksCompleted) * 100) : 0}% Success Rate`
          : '0% Success Rate',
      iconBg: '#D406061A',
    },
  ];

  return (
    <div className="mt-8">
      <h1 className="my-4 text-lg font-bold">Earnings and Reward</h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {userStatsData.map((data, idx) => (
          <StatsCard key={idx} data={data} />
        ))}
      </div>
    </div>
  );
};
