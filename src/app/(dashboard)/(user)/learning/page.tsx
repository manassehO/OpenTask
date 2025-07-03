// src/app/(main)/learning/page.tsx
'use client';

import ContentCard from '~/_components/reusable_ui/Card';

const mockCourses = [
  {
    id: 1,
    title: 'Micro Tasks, Big Rewards: A Beginner’s Guide to Earning Online',
    description:
      'Learn how to start earning from online tasks without any experience, investment, or technical skills.',
    image: '/images/courseImg.png',
    modules: '4 modules',
    progress: 60, //
    rewardInUsd: 100,
    rewardInEth: 0.05,
    duration: '10 mins watch',
  },
];

const mockTutorials = [
  {
    id: 101,
    title: 'Git & GitHub Guide',
    description:
      'Learn Git basics, branching, and using GitHub for collaboration.',
    image: '/images/cyptoImg.png',
    modules: '4 modules',
    duration: '10 mins watch',
    progress: 80,
    rewardInUsd: 100,
    rewardInEth: 0.05,
  },
];

const tabs = ['Course', 'Tutorial'];

import React, { useState } from 'react';

export default function LearningPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onTabChange = (tab: string): void => {
    setActiveTab(tab);
  };

  const handleViewTask = (id: string | number): void => {
    console.log('continue learning:', id);
  };

  return (
    <div>
      <h1 className="mb-4 text-lg font-bold capitalize md:text-xl">
        learning center
      </h1>

      <div className="flex space-x-2">
        {['Course', 'Tutorial'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`rounded-[4px] px-8 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab
                ? 'bg-[#3B82F6] text-white'
                : 'bg-white text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="py-4 text-xl font-semibold capitalize">
        {activeTab === 'Course' && <h1 className="">your courses</h1>}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(activeTab === 'Course' ? mockCourses : mockTutorials).map((item) => (
          <ContentCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              description: item.description,
              image: item.image, // use actual image path
              ...(activeTab === 'Course' && { modules: item.modules }),
              ...(activeTab === 'Course' && { progress: item.progress }),
              ...(activeTab === 'Tutorial' && { duration: item.duration }),
              rewardInUsd: item.rewardInUsd,
              rewardInEth: String(item.rewardInEth),
            }}
            buttonLabel={`View ${(activeTab ?? '').toLowerCase()}`}
            onAction={handleViewTask}
          />
        ))}
      </div>
    </div>
  );
}
