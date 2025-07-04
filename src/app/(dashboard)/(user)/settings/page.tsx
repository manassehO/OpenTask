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

      <div className="h-full w-[680px] max-w-full rounded-lg border bg-white p-4 shadow-sm md:p-6">
        {/* {activeTab === 'Profile' && (
        
        )} */}

        {/* <ProfileForm /> */}
        <div className="mx-auto hidden h-full w-full flex-col items-center justify-center text-center md:w-[440px]">
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

        {/* profile form deatils  */}
        <div className="hidden py-4">
          <div className="relative flex flex-col items-center justify-center md:block">
            {/* Profile Image */}
            <Image
              className="mb-4 h-[120px] w-[120px] rounded-full bg-main pt-5"
              width={200}
              height={200}
              src="/icons/emptyProfile.svg"
              alt="Profile"
            />

            {/* Upload Button */}
            <div className="absolute -bottom-5 md:bottom-3 md:left-20">
              <label
                htmlFor="file-upload"
                className="flex w-28 cursor-pointer items-center justify-center gap-2 rounded-full bg-white p-2 shadow"
              >
                <Image
                  className="h-4 w-4"
                  width={16}
                  height={16}
                  src="/icons/uploadPhotoIcon.svg"
                  alt="Upload Photo"
                />
                <h6 className="text-xs capitalize text-primary">add photo</h6>
              </label>

              {/* Hidden file input */}
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // You can handle the file upload logic here
                    console.log('Selected file:', file);
                  }
                }}
              />
            </div>
          </div>

          <div className="mt-4 space-y-4 md:space-y-6">
            <div className="flex flex-col gap-1 pt-4 text-sm md:text-base">
              <label htmlFor="" className="text-sm font-medium capitalize">
                full name
              </label>
              <input
                type="text"
                className="w-full rounded border p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="enter full name"
              />
            </div>
            <div className="flex flex-col gap-1 text-sm md:text-base">
              <label htmlFor="" className="text-sm font-medium capitalize">
                phone number
              </label>
              <input
                type="text"
                className="w-full rounded border p-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="enter phone number"
              />
            </div>
            <div className="flex flex-col gap-1 text-sm md:text-base">
              <label htmlFor="" className="text-sm font-medium capitalize">
                gender
              </label>

              <select
                name=""
                id=""
                className="rounded border bg-white p-3 capitalize"
              >
                <option value="">select gender</option>
                <option value="">male</option>
                <option value="">female</option>
              </select>
            </div>
            <div className="flex flex-col gap-1 text-sm md:text-base">
              <label htmlFor="" className="text-sm font-medium capitalize">
                preferred niche
              </label>

              <select
                name=""
                id=""
                className="rounded border bg-white p-3 capitalize"
              >
                <option value="">select niche</option>
                <option value="">...</option>
                <option value="">.....</option>
              </select>
            </div>

            <div className="w-full pt-4 md:pt-6">
              <button className="w-full rounded bg-primary p-4 text-sm font-bold capitalize text-white">
                submit
              </button>
            </div>
          </div>
        </div>

        {/* profile edit */}
        <div className="py-4 text-sm font-medium capitalize">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Image
              className="h-20 w-20 rounded-full border pt-4"
              width={100}
              height={100}
              src="/icons/emptyProfile.svg"
              alt="Profile"
            />

            <div className="flex flex-col text-center md:text-start">
              <p className="text-lg font-bold md:text-2xl">leonard victor</p>
              <p className="text-xs font-semibold text-primary md:text-sm">
                leonardvictor694@gmail.com
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-10 capitalize">
            <div className="space-y-1 rounded bg-main p-3">
              <p className="text-sm">phone number</p>
              <p className="text-lg font-medium md:text-2xl">0801234567890</p>
            </div>
            <div className="space-y-1 rounded bg-main p-3">
              <p className="text-sm">gender</p>
              <p className="text-lg font-medium md:text-2xl">male</p>
            </div>
            <div className="space-y-1 rounded bg-main p-3">
              <p className="text-sm">preferred niche </p>
              <p className="text-lg font-medium md:text-2xl">de-fi</p>
            </div>
          </div>
          <div className="flex w-full justify-end pt-4 md:w-[210px] md:pt-8">
            <button className="w-full rounded bg-primary p-4 text-sm font-bold capitalize text-white">
              edit profile
            </button>
          </div>
        </div>

        {/* notification settings */}
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
