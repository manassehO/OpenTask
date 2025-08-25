'use client';
import React, { useState } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';
import Image from 'next/image';
import editIcon from '../../../../../public/icons/edit.png';
import deleteIcon from '../../../../../public/icons/material-symbols_delete-outline.png';
import { ReusableTable } from '@/_components/ui/table';

type CounterProps = {
  value: number;
  setValue: (v: number) => void;
  min?: number;
  max?: number;
};

const Counter: React.FC<CounterProps> = ({
  value,
  setValue,
  min = 0,
  max = 100,
}) => (
  <div className="mt-4 flex h-[50px] w-[250px] items-center justify-between rounded border border-[#C0C0C0] bg-transparent px-4 md:w-[347px]">
    <span className="font-semibold text-[#202020]">{value}</span>
    <div className="ml-2 flex flex-col">
      <button
        className="text-xs text-[#616161] disabled:opacity-30"
        style={{ lineHeight: 1 }}
        onClick={() => setValue(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
      >
        ▲
      </button>
      <button
        className="text-xs text-[#616161] disabled:opacity-30"
        style={{ lineHeight: 1 }}
        onClick={() => setValue(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
      >
        ▼
      </button>
    </div>
  </div>
);

const Page = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [autoCloseDays, setAutoCloseDays] = useState(7);
  const [disputeDays, setDisputeDays] = useState(3);
  const [emailVerification, setEmailVerification] = useState(1);
  const [maxReward, setMaxReward] = useState(100);
  const [platformFee, setPlatformFee] = useState(10);

  // Manually define your rows
  const [rows, setRows] = useState([
    {
      name: 'Content',
      description: 'Content creation and writing tasks',
      status: true,
    },
    {
      name: 'Testing',
      description: 'software and website testing tasks',
      status: true,
    },
    {
      name: 'research',
      description: 'Market and user research tasks',
      status: true,
    },
    {
      name: 'Design',
      description: 'UI/UX and graphic design tasks',
      status: true,
    },
    { name: 'Survey', description: 'A short survey about Defi', status: false },
    { name: 'Support', description: 'Customer Support', status: true },
  ]);

  const handleToggle = (idx: number) => {
    setRows((prev) =>
      prev.map((row, i) => (i === idx ? { ...row, status: !row.status } : row)),
    );
  };

  const tabs = [
    {
      label: 'Categories',
      content: (
        <div>
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:gap-0">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Task Categories</h1>
              <p className="font-semibold text-[#7E7E7E]">
                Manage The categories available for Tasks
              </p>
            </div>
            <div className="cursor-pointer rounded-xl border-2 border-t-4 border-[#7CBAFD] px-3 py-2 font-[400] text-[#3B82F6]">
              {/* <Image/> */}
              <h2>+ Add Category</h2>
            </div>
          </div>
          <ReusableTable
            columns={[
              {
                header: 'Name',
                accessor: 'name',
              },
              {
                header: 'Description',
                accessor: 'description',
              },
              {
                header: 'Status',
                accessor: (row) => (
                  <div className="flex items-center">
                    <RadixSwitch.Root
                      checked={row.status}
                      onCheckedChange={() =>
                        handleToggle(rows.findIndex((r) => r === row))
                      }
                      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-blue-600"
                    >
                      <RadixSwitch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5" />
                    </RadixSwitch.Root>
                    <span className="ml-3 text-sm font-medium">
                      {row.status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ),
              },
              {
                header: 'Action',
                accessor: () => (
                  <div className="flex gap-4">
                    <Image
                      src={editIcon}
                      width={20}
                      height={20}
                      alt="Edit"
                      className="cursor-pointer"
                    />
                    <Image
                      src={deleteIcon}
                      width={20}
                      height={20}
                      alt="Delete"
                      className="cursor-pointer"
                    />
                  </div>
                ),
              },
            ]}
            data={rows}
            className="mt-6"
          />
        </div>
      ),
    },
    {
      label: 'Platform',
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="font-semibold text-[#7E7E7E]">
              Configure General Platform Settings
            </p>
          </div>
          <h2 className="text-xl font-bold">Task Settings</h2>
          <div className="flex flex-col gap-10 font-bold text-[#161616] lg:flex-row">
            <div className="flex flex-col items-start">
              <h2>Auto-Close Tasks After (Days)</h2>
              <Counter
                value={autoCloseDays}
                setValue={setAutoCloseDays}
                min={1}
                max={30}
              />
            </div>
            <div className="flex flex-col items-start">
              <h2>Allow Disputes Within(days)</h2>
              <Counter
                value={disputeDays}
                setValue={setDisputeDays}
                min={1}
                max={30}
              />
            </div>
          </div>
          <div className="mt-6 flex max-w-[734px] gap-6 border-b-2 border-[#C0C0C0] pb-6 font-bold">
            <RadixSwitch.Root className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-blue-600">
              <RadixSwitch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5" />
            </RadixSwitch.Root>
            <span>Require Admin Approval For New Tasks</span>
          </div>
          <h2 className="mt-2 text-xl font-bold">Task Settings</h2>
          <div className="flex flex-col gap-6 font-bold">
            <div className="flex items-center gap-6">
              <RadixSwitch.Root className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-blue-600">
                <RadixSwitch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5" />
              </RadixSwitch.Root>
              <span>Enable User Ratings</span>
            </div>
            <div className="flex gap-6">
              <RadixSwitch.Root className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors data-[state=checked]:bg-blue-600">
                <RadixSwitch.Thumb className="block h-5 w-5 rounded-full bg-white shadow-lg transition-transform data-[state=checked]:translate-x-5" />
              </RadixSwitch.Root>
              <span>Require Email Verification</span>
            </div>
          </div>
          <button className="mt-4 w-[147px] self-end rounded-xl border-2 border-[#7CBAFD] px-3 py-2 font-[400] text-[#3B82F6]">
            Save Changes
          </button>
        </div>
      ),
    },
    {
      label: 'Payments',
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold">Platform Settings</h1>
            <p className="font-semibold text-[#7E7E7E]">
              Configure General Platform Settings
            </p>
          </div>
          <h2 className="text-xl font-bold">Task Rewards Limits</h2>
          <div className="flex flex-col gap-10 font-bold text-[#161616] lg:flex-row">
            <div className="flex flex-col items-start">
              <h2>Require Email Verification</h2>
              <Counter
                value={emailVerification}
                setValue={setEmailVerification}
                min={1}
                max={30}
              />
            </div>
            <div className="flex flex-col items-start">
              <h2>Maximum task Reward ($)</h2>
              <Counter
                value={maxReward}
                setValue={setMaxReward}
                min={1}
                max={1000}
              />
            </div>
          </div>
          <div>
            <h1 className="mb-3 mt-6 text-xl font-bold">Platform Fee</h1>
            <h2>Platform Fee Percentage (%)</h2>
            <Counter
              value={platformFee}
              setValue={setPlatformFee}
              min={0}
              max={100}
            />
          </div>
          <button className="mt-4 w-[147px] self-end rounded-xl border-2 border-[#7CBAFD] px-3 py-2 font-[400] text-[#3B82F6]">
            Save Changes
          </button>
        </div>
      ),
    },
    {
      label: 'Notifications',
      content: (
        <div>
          <div>
            <h1 className="text-2xl font-bold">Notification Settings</h1>
            <p className="mt-2 font-semibold text-[#7E7E7E]">
              Configure General Platform Settings
            </p>
          </div>
          <div className="mt-8 flex min-h-[500px] flex-col items-center justify-center rounded-md border-2 border-[#C0C0C0]">
            <p className="font-semibold text-[#7E7E7E]">
              Notification settings Would Appear Here
            </p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <main>
      <h1 className="my-6 text-3xl font-bold text-black">Settings</h1>
      {/* <div className="flex max-w-[560px] gap-2 md:gap-6 rounded-md bg-white px-2 py-2 md:px-4 md:py-6 text-black"> */}
      <div className="scrollbar-hide flex w-full gap-3 overflow-x-auto rounded-md bg-white px-4 py-4 text-black">
        {tabs.map((tab, idx) => (
          <h2
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`cursor-pointer whitespace-nowrap rounded px-4 py-2 text-sm transition ${
              activeTab === idx ? 'bg-blue-600 font-bold text-white' : ''
            }`}
          >
            {tab.label}
          </h2>
        ))}
      </div>
      <div className="mt-6 rounded-md bg-white px-4 py-6 text-black lg:mr-10">
        {tabs[activeTab]?.content}
      </div>
    </main>
  );
};

export default Page;
