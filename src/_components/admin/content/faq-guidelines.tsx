'use client';
import { SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaqGuidelinesTable } from './FaqGuidelinesTable';

interface Entry {
  id: number;
  type: 'FAQs' | 'Guidelines';
  category?: string; // only for FAQ
  question: string;
  answer: string;
  time?: string; // only for Guidelines
}

type DataType = {
  FAQs: Entry[];
  Guidelines: Entry[];
};

const LOCAL_STORAGE_KEY = 'admin-faq-guidelines';

const allData = [
  {
    id: 1,
    category: 'General',
    type: 'FAQS',
    question: 'What is OpenTask?',
    answer:
      'OpenTask is an open-source platform designed to introduce non-crypto users to cryptocurrency through completing simple tasks.',
    time: '2025-07-01 12:00 PM',
  },

  {
    id: 2,
    category: 'Reward',
    type: 'FAQS',
    question: 'How do I earn cryptocurrency?',
    answer:
      'You can earn cryptocurrency by completing available tasks on the platform. Once a task is completed and approved.',
    time: '2025-06-30 03:45 PM',
  },
  {
    id: 3,
    category: 'Getting started',
    type: 'FAQS',
    question: 'Do I need to have cryptocurrency to start?',
    answer:
      "No, you don't need to have any cryptocurrency to start. OpenTask is designed for beginners and allows you to earn coins.",
    time: '2025-06-29 09:30 AM',
  },
  {
    id: 4,
    category: 'Reward',
    type: 'FAQS',
    question: 'How do I use the platform?',
    answer: 'You can start by signing up and exploring tasks.',
    time: '2025-07-01 12:00 PM',
  },
];

export default function FaqGuidelines() {
  const [activeTab, setActiveTab] = useState<'FAQs' | 'Guidelines'>('FAQs');

  const [data, setData] = useState<DataType>({
    FAQs: [],
    Guidelines: [],
  });

  // Load data from localStorage on first render
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setData(JSON.parse(saved) as DataType);
      } catch (err) {
        console.error('Failed to parse saved FAQ data', err);
      }
    }
  }, []);

  // Save to localStorage every time data changes
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const [open, setOpen] = useState(false);

  const filters = ['All', 'General', 'Reward', 'Getting started'];

  // filter table state
  // const [selectedFilter, setSelectedFilter] = useState('All');

  const [selectedFilter, setSelectedFilter] = useState<
    'All' | 'General' | 'Reward' | 'Getting started'
  >('All');

  const filteredData =
    selectedFilter === 'All'
      ? allData
      : allData.filter((item) => item.category === selectedFilter);

  // category color mapping
  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'General':
        return 'border-green-500 border text-green-500 bg-green-100';
      case 'Reward':
        return 'border-primary border text-primary bg-main-50';
      case 'Getting started':
        return 'border-warning-400 border text-warning-400 bg-warning-50';
      default:
        return 'bg-red-100 text-red-600';
    }
  };

  return (
    <div className="mx-auto">
      {/* Tabs */}
      <div className="mb-4 flex w-full gap-4 overflow-x-auto bg-white p-2 md:max-w-[258px]">
        {['FAQs', 'Guidelines'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as 'FAQs' | 'Guidelines')}
            className={`flex-1 py-2 font-medium ${
              activeTab === tab
                ? 'w-full rounded bg-primary px-4 text-white'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List of Entries */}
      <div className="w-full max-w-[1184px] rounded-lg border bg-white p-6 shadow-sm">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-sm font-semibold text-neutral-900 md:text-2xl">
              {activeTab === 'FAQs' ? 'Task Categories' : 'Platform Guidelines'}
            </h1>
            <p className="text-xs font-semibold text-black-50 md:text-sm">
              {activeTab === 'FAQs'
                ? 'Manage FAQs displayed to users'
                : 'Manage guidelines and policies for the platform'}
            </p>
          </div>
          {/* Add & Save Buttons */}
          <div className="mt-6 flex justify-between">
            <button className="rounded-full border border-primary px-4 py-1 text-xs font-normal text-primary disabled:opacity-50 md:text-sm">
              {activeTab === 'FAQs' ? ' + Add FAQ' : ' + Add Guideline'}
            </button>
          </div>
        </div>

        {activeTab === 'FAQs' && (
          <div className="flex w-full justify-between gap-4 py-4">
            <div className="relative md:w-full">
              <SearchIcon
                className="absolute left-3 top-1/2 -translate-y-1/2"
                size={20}
              />
              <input
                type="text"
                className="w-full rounded-md bg-neutral-100 p-2 pl-12 placeholder:text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                placeholder="search FAQS content...."
              />
            </div>

            {/* Filter Button */}

            <div className="relative inline-block w-full text-left md:w-52">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex w-full items-center justify-between gap-2 rounded-md border border-gray-300 bg-white px-1 py-2 text-sm shadow-sm hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/icons/filter.svg"
                    alt="Filter"
                    width={24}
                    height={24}
                    className="text-gray-600"
                  />
                  <span>{selectedFilter}</span>
                </div>
                <Image
                  src="/icons/dropdown.svg"
                  alt="Filter"
                  width={24}
                  height={24}
                  className="text-gray-600"
                />
              </button>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
                  <ul className="text-sm text-gray-700">
                    {filters.map((filter) => (
                      <li
                        key={filter}
                        onClick={() => {
                          setSelectedFilter(
                            filter as
                              | 'All'
                              | 'General'
                              | 'Reward'
                              | 'Getting started',
                          );
                          setOpen(false);
                        }}
                        className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                          selectedFilter === filter
                            ? 'bg-gray-100 text-xs font-semibold'
                            : ''
                        }`}
                      >
                        {filter}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Table */}
        <FaqGuidelinesTable
          activeTab={activeTab}
          filteredData={filteredData}
          getCategoryColor={getCategoryColor}
        />
      </div>
    </div>
  );
}

// export default FaqGuidelines;
