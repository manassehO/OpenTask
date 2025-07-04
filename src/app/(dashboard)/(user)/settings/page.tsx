'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const tabs = ['Profile', 'Notifications'];

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const onTabChange = (tab: string): void => {
    setActiveTab(tab);
    console.log('Tab changed to:', tab);
  };
  return (
    <div>
      <h1 className="mb-4 font-bold capitalize md:text-[28px] md:text-xl">
        settings
      </h1>

      <div className="mb-4 flex w-full overflow-x-auto bg-white p-2 md:max-w-[274px]">
        {['Profile', 'Notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`w-full rounded-[4px] px-8 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#3B82F6] text-white' : 'text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="h-[680px] w-[680px] max-w-full rounded-lg border bg-white p-4 shadow-sm md:p-6">
        {activeTab === 'Profile' && (
          <div className="hidden py-4 text-sm font-medium capitalize">
            {/* Profile content goes here */}
            <div className="flex items-center gap-4">
              <Image
                className="h-20 w-20 rounded-full border"
                width={100}
                height={100}
                src="/icons/profileImg.svg"
                alt="Profile"
              />

              <div className="flex flex-col">
                <p>leonard victor</p>
                <p>leonardvictor694@gmail.com</p>
              </div>
            </div>

            <div className="">
              <p>Bio: Lorem ipsum dolor sit amet.</p>
              <p>Location: San Francisco, CA</p>
            </div>
          </div>
        )}

        <div className="mx-auto flex h-full w-full flex-col items-center justify-center text-center md:w-[440px]">
          <Image
            className="mb-4 h-[200px] w-[200px] rounded-full"
            width={200}
            height={200}
            src="/icons/profileImg.svg"
            alt="Profile"
          />

          <h1 className="text-xl font-bold capitalize md:text-[32px]">
            complete profile
          </h1>
          <p className="p-4 text-sm md:text-base">
            Finish setting up your profile—it only takes a minute and helps us
            match you with better tasks.
          </p>

          <div className="w-full pt-4 md:pt-8">
            <button className="w-full rounded bg-primary p-4 text-sm font-bold capitalize text-white">
              complete profile
            </button>
          </div>
        </div>

        {activeTab === 'Notifications' && (
          <div className="py-4 text-xl font-semibold capitalize">
            <h1 className="">notification settings</h1>
            {/* Notification settings content goes here */}
          </div>
        )}
      </div>
    </div>
  );
}
