import React from 'react';
import { type TabType } from './TransactionHistory';

type TaskTabProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabType[];
};

export const TransactionTab = ({
  activeTab,
  onTabChange,
  tabs,
}: TaskTabProps) => {
  return (
    <div className="flex max-sm:overflow-x-scroll">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`rounded-[12px] px-4 py-2 text-center text-xs transition-colors ${
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
