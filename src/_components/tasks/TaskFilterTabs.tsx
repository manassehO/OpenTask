"use client"

import { cn } from "~/lib/utils"

export interface TaskFilterTab {
  id: string
  label: string
  active: boolean
}

interface TaskFilterTabsProps {
  tabs: TaskFilterTab[]
  onTabChange: (tabId: string) => void
  activeTab: string
}

export default function TaskFilterTabs({ tabs, onTabChange, activeTab }: TaskFilterTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex-shrink-0 px-4 py-1 rounded-full text-sm font-medium transition-colors duration-200 whitespace-nowrap",
            activeTab === tab.id
              ? "bg-blue-500 text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
} 