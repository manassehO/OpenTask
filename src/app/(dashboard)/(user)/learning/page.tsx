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
    progress: 60,
    rewardInUsd: 100,
    rewardInEth: 0.05,
    duration: '10 mins watch',
  },
  {
    id: 2,
    title: 'Micro Tasks, Big Rewards: A Beginner’s Guide to Earning Online',
    description:
      'Learn how to start earning from online tasks without any experience, investment, or technical skills.',
    image: '/images/courseImg.png',
    modules: '4 modules',
    progress: 60,
    rewardInUsd: 100,
    rewardInEth: 0.05,
    duration: '10 mins watch',
  },
  {
    id: 3,
    title: 'Micro Tasks, Big Rewards: A Beginner’s Guide to Earning Online',
    description:
      'Learn how to start earning from online tasks without any experience, investment, or technical skills.',
    image: '/images/courseImg.png',
    modules: '4 modules',
    progress: 60,
    rewardInUsd: 100,
    rewardInEth: 0.05,
    duration: '10 mins watch',
  },
];

const mockTutorials = [
  {
    id: 101,
    title: 'how to set up a crypto wallet',
    description: 'Learn how to set up a crypto wallet.',
    image: '/images/cyptoImg.png',
    modules: '4 modules',
    duration: '10 mins watch',
    progress: 80,
    rewardInUsd: 100,
    rewardInEth: 0.05,
  },
  {
    id: 102,
    title: 'how to set up a crypto wallet',
    description: 'Learn how to set up a crypto wallet.',
    image: '/images/cyptoImg.png',
    modules: '4 modules',
    duration: '10 mins watch',
    progress: 80,
    rewardInUsd: 100,
    rewardInEth: 0.05,
  },
  {
    id: 103,
    title: 'how to set up a crypto wallet',
    description: 'Learn how to set up a crypto wallet.',
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
    console.log('start course:', id);
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

      {/* Your Courses */}
      <div className="py-4 text-xl font-semibold capitalize">
        {activeTab === 'Course' && <h1 className="">your courses</h1>}
      </div>

      {/* Main Card Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {(activeTab === 'Course' ? mockCourses : mockTutorials).map((item) => (
          <ContentCard
            key={item.id}
            item={{
              id: item.id,
              title: item.title,
              description: item.description,
              image: item.image,
              ...(activeTab === 'Course' && { modules: item.modules }),
              ...(activeTab === 'Course' && { progress: item.progress }),
              ...(activeTab === 'Tutorial' && { duration: item.duration }),
              rewardInUsd: item.rewardInUsd,
              rewardInEth: String(item.rewardInEth),
            }}
            buttonLabel={
              item.progress && item.progress > 0
                ? 'Continue learning'
                : 'Start Course'
            }
            onAction={() => handleViewTask(item.id)}
          />
        ))}
      </div>

      {/* Recommended Courses */}
      {activeTab === 'Course' && (
        <div>
          <div className="py-4 text-xl font-semibold capitalize">
            <h1 className="">courses for you</h1>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockCourses.map((item) => (
              <ContentCard
                key={`recommend-${item.id}`}
                item={{
                  id: item.id,
                  title: item.title,
                  description: item.description,
                  image: item.image,
                  modules: item.modules,
                  rewardInUsd: item.rewardInUsd,
                  rewardInEth: String(item.rewardInEth),
                }}
                buttonLabel={
                  item.progress && item.progress > 0
                    ? 'Start Course'
                    : 'Continue learning'
                }
                onAction={() => handleViewTask(item.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
