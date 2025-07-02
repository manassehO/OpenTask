'use client';
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
  const isAddDisabled =
    data[activeTab].length > 0 &&
    data[activeTab][data[activeTab].length - 1]?.content.trim() === '';
  const handleEdit = (id: number, value: string) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].map((item) =>
        item.id === id ? { ...item, content: value } : item,
      ),
    }));
  };

  const handleDelete = (id: number) => {
    setData((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab].filter((item) => item.id !== id),
    }));
  };

  const handleSave = () => {
    alert(`Changes to ${activeTab} have been saved!`);
  };

  return (
    <div className="mx-auto px-4">
      {/* Tabs */}
      <div className="mb-4 flex w-full gap-4 overflow-x-auto bg-white p-2 md:max-w-52">
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
      <div className="space-y-4">
        <h1>Task Categories</h1>
        {data[activeTab].map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between gap-2 rounded-lg border bg-white p-3 shadow-sm sm:flex-row sm:items-center"
          >
            <input
              type="text"
              className="flex-1 rounded border p-2"
              value={item.content}
              onChange={(e) => handleEdit(item.id, e.target.value)}
            />
            <button
              onClick={() => handleDelete(item.id)}
              className="text-sm font-medium text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {/* Add & Save Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={handleAdd}
          className="rounded border border-primary px-4 py-2 text-sm font-normal text-primary disabled:opacity-50"
          disabled={isAddDisabled}
        >
          + Add FAQ
        </button>
      </div>
    </div>
  );
};

export default FaqGuidelines;
