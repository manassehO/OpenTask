"use client";

import { cn } from "~/lib/utils";

export interface TaskFilterTab {
  id: string;
  label: string;
  active: boolean;
}

interface TaskFilterTabsProps {
  tabs: TaskFilterTab[];
  onTabChange: (tabId: string) => void;
  activeTab: string;
}

export default function TaskFilterTabs({
  tabs,
  onTabChange,
  activeTab,
}: TaskFilterTabsProps) {
  return (
    <div className="flex w-full gap-3 overflow-x-auto pb-2">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-shrink-0 whitespace-nowrap rounded-full px-4 py-1 text-sm font-medium transition-colors duration-200",
            activeTab === tab.id
              ? "bg-blue-500 text-white shadow-sm"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-100",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
