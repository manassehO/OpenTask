'use client';
import Image from 'next/image';
import React, { useState } from 'react';

export default function SettingPage() {
  const [activeTab, setActiveTab] = useState<'Profile' | 'Notifications'>(
    'Profile',
  );
  const [profileStep, setProfileStep] = useState<
    'initial' | 'form' | 'summary'
  >('initial');

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    gender: '',
    niche: '',
  });

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  // loop of taks
  const tasks = [
    {
      id: 1,
      title: 'task approved',
      message: 'Your reward has been added to your account. Great job!',
      icon: '/icons/addTask.svg',
    },
    {
      id: 2,
      title: 'task approved',
      message: 'Your reward has been added to your account. Great job!',
      icon: '/icons/addTask.svg',
    },
    {
      id: 3,
      title: 'task approved',
      message: 'Your reward has been added to your account. Great job!',
      icon: '/icons/addTask.svg',
    },
    {
      id: 4,
      title: 'task approved',
      message: 'Your reward has been added to your account. Great job!',
      icon: '/icons/addTask.svg',
    },
  ];

  return (
    <div>
      <h1 className="mb-4 font-bold capitalize md:text-[28px] md:text-xl">
        settings
      </h1>

      <div className="mb-4 flex w-full overflow-x-auto bg-white p-2 md:max-w-[274px]">
        {['Profile', 'Notifications'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'Profile' | 'Notifications')}
            className={`w-full rounded-[4px] px-8 py-3 text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#3B82F6] text-white' : 'text-black'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="h-full w-[680px] max-w-full rounded-lg border bg-white p-4 shadow-sm md:p-6">
        {/* <ProfileForm /> */}
        {activeTab === 'Profile' && profileStep === 'initial' && (
          <div className="mx-auto h-full w-full items-center justify-center py-4 text-center md:w-[440px]">
            <div className="flex flex-col items-center justify-center">
              <Image
                className="mb-4 rounded-full bg-main pt-8 md:h-[200px] md:w-[200px]"
                width={100}
                height={100}
                src={profileImage ?? '/icons/emptyProfile.svg'}
                alt="Profile"
              />
            </div>

            <h1 className="text-xl font-bold capitalize md:text-[32px]">
              complete profile
            </h1>
            <p className="p-4 text-sm md:text-base">
              Finish setting up your profile—it only takes a minute and helps us
              match you with better tasks.
            </p>

            <div className="w-full pt-4 md:py-8">
              <button
                onClick={() => setProfileStep('form')}
                className="w-full rounded bg-primary p-4 text-sm font-bold capitalize text-white"
              >
                complete profile
              </button>
            </div>
          </div>
        )}

        {/* profile form deatils  */}
        {activeTab === 'Profile' && profileStep === 'form' && (
          <div className="py-4">
            <div className="flex flex-col items-center md:flex-row">
              {/* Profile Image */}
              <Image
                className="mb-4 h-[120px] w-[120px] rounded-full bg-main object-cover"
                width={120}
                height={120}
                src="/icons/emptyProfile.svg"
                alt="Profile"
              />

              {/* Upload Button */}
              <div className="mt-10 flex w-[123px] cursor-pointer items-center justify-center gap-2 rounded-full bg-white px-4 py-2 shadow-md md:-ml-8">
                <label htmlFor="file-upload" className="flex gap-1">
                  <Image
                    className="h-4 w-4"
                    width={16}
                    height={16}
                    src="/icons/uploadPhotoIcon.svg"
                    alt="Upload"
                  />
                  <span className="text-xs font-medium capitalize text-primary">
                    add photo
                  </span>
                </label>

                {/* Hidden File Input */}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div className="mt-4 space-y-4 md:space-y-6">
              <div className="flex flex-col gap-1 pt-4 text-sm md:text-base">
                <label htmlFor="" className="text-sm font-medium capitalize">
                  full name
                </label>
                <input
                  onChange={handleInput}
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
                  onChange={handleInput}
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
              <div className="flex w-full justify-end pt-4 md:pt-8">
                <button
                  className="w-[210px] rounded bg-primary p-4 text-sm font-bold capitalize text-white"
                  onClick={() => setProfileStep('summary')}
                >
                  submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* profile edit */}
        {activeTab === 'Profile' && profileStep === 'summary' && (
          <div className="py-4 text-sm font-medium capitalize">
            <div className="flex flex-col items-center gap-4 pt-4 md:flex-row">
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

            <div className="space-y-6 pt-10 capitalize">
              <div className="space-y-1 rounded bg-main p-5">
                <p className="text-sm">phone number</p>
                <p className="text-lg font-medium md:text-2xl">0801234567890</p>
              </div>
              <div className="space-y-1 rounded bg-main p-5">
                <p className="text-sm">gender</p>
                <p className="text-lg font-medium md:text-2xl">male</p>
              </div>
              <div className="space-y-1 rounded bg-main p-5">
                <p className="text-sm">preferred niche </p>
                <p className="text-lg font-medium md:text-2xl">de-fi</p>
              </div>
            </div>

            <div className="flex w-full justify-end pt-4 md:pt-8">
              <button
                className="w-[210px] rounded bg-primary p-4 text-sm font-bold capitalize text-white"
                onClick={() => setProfileStep('summary')}
              >
                edit profile
              </button>
            </div>
          </div>
        )}

        {/* notification settings */}
        {activeTab === 'Notifications' && (
          <div className="space-y-2 text-xl font-semibold capitalize">
            <div className="flex w-full justify-end">
              <button className="rounded text-sm font-bold capitalize text-error">
                <Image
                  className="mr-2 inline h-4 w-4"
                  width={16}
                  height={16}
                  src="/icons/delete.svg"
                  alt="delete icon"
                />
                clear all
              </button>
            </div>
            {tasks.map((task) => (
              <div key={task.id} className="space-y-4 capitalize">
                <div className="flex items-center space-x-4 rounded py-4 hover:scale-[1.02] hover:bg-main md:px-4 md:py-6">
                  <div className="flex items-center justify-center rounded bg-primary-50 p-2 md:h-14 md:w-14">
                    <Image
                      width={30}
                      height={30}
                      src={task.icon}
                      alt="Profile"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm font-bold capitalize md:text-xl">
                      {task.title}{' '}
                    </p>
                    <p className="text-xs font-normal md:text-sm">
                      {task.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
