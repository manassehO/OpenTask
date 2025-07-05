import React from 'react';

type TaskTabProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const tabs = ['Overview', 'Submissions', 'Funding'];

export const AnalyticsTabs = ({ activeTab, onTabChange }: TaskTabProps) => {
  return (
    <div className="flex space-x-2">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-[4px] px-8 py-3 transition-colors ${
            activeTab === tab
              ? 'bg-[#3B82F6] text-white'
              : 'bg-white text-black'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
