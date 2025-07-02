'use client';
import { DropletIcon, Edit, SearchIcon, Trash } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Entry = {
  id: number;
  content: string;
};

type DataType = {
  FAQs: Entry[];
  Guidelines: Entry[];
};

const LOCAL_STORAGE_KEY = 'admin-faq-guidelines';

const FaqGuidelines = () => {
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

  const handleAdd = () => {
    const current = data[activeTab];
    const last = current[current.length - 1];
    if (last && last.content.trim() === '') {
      alert('Please fill the previous entry before adding a new one.');
      return;
    }

    const newItem: Entry = {
      id: Date.now(),
      content: '',
    };

    setData((prev) => ({
      ...prev,
      [activeTab]: [...prev[activeTab], newItem],
    }));
  };

  // Disable "Add New" if the last entry is empty
  // const isAddDisabled =
  //   data[activeTab].length > 0 &&
  //   data[activeTab][data[activeTab].length - 1]?.content.trim() === '';

  const handleEdit = (id: number, value: string) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((item) =>
        item.id === id ? { ...item, content: value } : item,
      ),
    }));
  };

  // const handleDelete = (id: number) => {
  //   setData((prev) => ({
  //     ...prev,
  //     [activeTab]: prev[activeTab].filter((item) => item.id !== id),
  //   }));
  // };

  // for table
  const [open, setOpen] = useState(false);

  const filters = ['All', 'General', 'Reward', 'Getting started'];
  const allData = [
    {
      id: 1,
      category: 'General',
      question: 'How do I use the platform?',
      answer: 'You can start by signing up and exploring tasks.',
      time: '2025-07-01 12:00 PM',
    },
    {
      id: 2,
      category: 'Reward',
      question: 'When do I get paid?',
      answer: 'Payments are processed every Friday.',
      time: '2025-06-30 03:45 PM',
    },
    {
      id: 3,
      category: 'Getting started',
      question: 'How to create an account?',
      answer: 'Click the sign-up button and fill out your info.',
      time: '2025-06-29 09:30 AM',
    },
  ];

  // filter table state
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredData =
    selectedFilter === 'All'
      ? allData
      : allData.filter((item) => item.category === selectedFilter);

  // category color mapping
  const getCategoryColor = (category: string) => {
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
            <h1 className="text-2xl font-semibold text-neutral-900">
              Task Categories
            </h1>
            <p className="text-sm font-semibold text-black-50">
              Manage FAQs displayed to users
            </p>
          </div>
          {/* Add & Save Buttons */}
          <div className="mt-6 flex justify-between">
            <button className="rounded-full border border-primary px-4 py-2 text-sm font-normal text-primary disabled:opacity-50">
              + Add FAQ
            </button>
          </div>
        </div>

        <div className="flex w-full justify-between gap-4 py-4">
          <div className="relative w-full">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2"
              size={20}
            />
            <input
              type="text"
              className="w-full rounded-md bg-neutral-100 p-3 pl-12 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              placeholder="search FAQS content...."
            />
          </div>

          {/* Filter Button */}
          <div className="relative inline-block w-40 text-left">
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
                <span>Filter</span>
              </div>
              <Image
                src="/icons/dropdown.svg"
                alt="Filter"
                width={24}
                height={24}
                className="text-gray-600"
              />
            </button>

            {open && (
              <div className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md border border-gray-200 bg-white shadow-lg">
                <ul className="py-2 text-sm text-gray-700">
                  {filters.map((item) => (
                    <li
                      key={item}
                      className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        console.log('Selected:', item);
                        setOpen(false);
                      }}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Answer</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Question Time</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item) => (
                <tr key={item.id} className="">
                  <td className="px-4 py-2">{item.question}</td>
                  <td className="px-4 py-2">{item.answer}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-block w-[132px] rounded-full px-4 py-1 text-center text-xs font-semibold ${getCategoryColor(
                        item.category,
                      )}`}
                    >
                      {item.category}
                    </span>
                  </td>
                  <td className="px-4 py-2">{item.time}</td>
                  <td className="flex items-center gap-3 px-4 py-2">
                    <button className="text-blue-600 hover:underline">
                      <Image
                        src="/icons/tableEditIcon.svg"
                        alt="Edit"
                        width={24}
                        height={24}
                      />
                    </button>
                    <button className="text-red-600 hover:underline">
                      <Image
                        src="/icons/tableDeleteIcon.svg"
                        alt="Delete"
                        width={24}
                        height={24}
                      />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-400">
                    No items in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FaqGuidelines;
