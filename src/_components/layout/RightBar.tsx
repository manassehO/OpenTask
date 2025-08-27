'use client';
import { useAtom } from 'jotai';
import React from 'react';
import Image from 'next/image';
import { sidebarAtom } from '~/hooks/sidebarAtom';
// import Button from '../ui/button';
import { getUserStats } from '~/app/api/profile';

const RightBar = () => {
  const { userStats, isLoading } = getUserStats();
  console.log('stats', userStats);
  const [isSidebarOpen] = useAtom(sidebarAtom);

  const rightBarSummary = [
    {
      title: 'Total Earned',
      amount: userStats?.totalEarnings ?? '$0',
      icon: '/icons/streak.svg',
    },
    {
      title: 'Fiat Value',
      amount: userStats?.totalEarnings ?? '$0',
      icon: '/icons/streak.svg',
    },
    {
      title: 'Task Completed',
      amount: userStats?.completedTasks ?? 0,
      icon: '/icons/streak.svg',
    },
    {
      title: 'Time Spent',
      amount: userStats?.longestStreak ?? 0,
      icon: '/icons/streak.svg',
    },
  ];

  return (
    <div
      className={`w-full space-y-4 overflow-y-auto bg-white p-4 shadow-md transition-all duration-300 ease-in-out max-lg:hidden`}
      style={{
        right: isSidebarOpen ? '0px' : '0px',
      }}
    >
      <h1 className="text-2xl font-bold">Earning Summary</h1>

      {isLoading ? (
        <EarningSummarySkeleton />
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-4">
          {rightBarSummary.map((item, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-lg bg-[#FAFAFA] p-4"
            >
              <div className="flex items-center justify-center bg-[#06B6D41A]/15 p-1 px-2">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={24}
                  height={24}
                  className="h-6 w-6"
                />
              </div>
              <h1 className="text-sm">{item.title}</h1>
              <h1 className="text-lg font-bold text-[#414141]">
                {item.amount}
              </h1>
            </div>
          ))}
        </div>
      )}
      {/* <p className="text-gray-500">
        Lorem ipsum dolor sit amet consectetur. Sit morbi id.
      </p> */}

      {/* <Button className="mt-4 w-full border-2 border-blue-400 bg-transparent py-2 text-blue-400">
        View Detailed Earnings
      </Button>

      <div className="mt-4 flex flex-col gap-4 rounded-lg bg-white p-4">
        <Image
          src="/learning-img.png"
          alt="Learning"
          width={300}
          height={200}
          className="h-full w-full"
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">Learning Center</h1>
          <p className="text-gray-500">
            Lorem ipsum dolor sit amet consectetur. Sit morbi id.
          </p>
        </div>
        <Button className="mt-4 w-full border-2 border-blue-400 bg-transparent py-2 text-blue-400">
          View Learning Center
        </Button>
      </div> */}
    </div>
  );
};

export default RightBar;

const EarningSummarySkeleton = () => {
  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      {[...Array(4)].map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-2 rounded-lg bg-[#FAFAFA] p-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-200"></div>
          <div className="h-3 w-20 rounded bg-gray-200"></div>
          <div className="h-4 w-16 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
};
