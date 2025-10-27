'use client';

import { useState } from 'react';
import { cn } from '~/lib/utils';

export interface TaskFilterTab {
  id: string;
  label: string;
  active: boolean;
  count?: number;
}

interface TaskFilterTabsProps {
  tabs: TaskFilterTab[];
  onTabChange: (tabId: string) => void;
  activeTab: string;
  isLoading?: boolean;
  showCounts?: boolean;
}

interface AdvancedFiltersProps {
  minReward: number | undefined;
  onMinRewardChange: (value: number | undefined) => void;
  sortBy: 'reward' | 'created_at';
  onSortByChange: (value: 'reward' | 'created_at') => void;
  sortOrder: 'asc' | 'desc';
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  isLoading?: boolean;
}

function AdvancedFilters({
  minReward,
  onMinRewardChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  onResetFilters,
  hasActiveFilters,
  isLoading = false,
}: AdvancedFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-3">
      {/* Toggle Advanced Filters */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
        disabled={isLoading}
      >
        <span>Advanced Filters</span>
        <svg
          className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
        {hasActiveFilters && (
          <span className="rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
            Active
          </span>
        )}
      </button>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="space-y-4 rounded border border-gray-200 bg-gray-50 p-4">
          {/* Minimum Reward Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Minimum Reward (ETH)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.001"
                min="0"
                value={minReward ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  onMinRewardChange(value ? Number(value) : undefined);
                }}
                placeholder="0.001"
                className="w-32 rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isLoading}
              />
              <span className="text-sm text-gray-500">ETH or higher</span>
            </div>
          </div>

          {/* Sort Options */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) =>
                  onSortByChange(e.target.value as 'reward' | 'created_at')
                }
                className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isLoading}
              >
                <option value="created_at">Date Created</option>
                <option value="reward">Reward Amount</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Order
              </label>
              <select
                value={sortOrder}
                onChange={(e) =>
                  onSortOrderChange(e.target.value as 'asc' | 'desc')
                }
                className="w-full rounded border border-gray-300 px-3 py-1 text-sm focus:border-blue-500 focus:outline-none"
                disabled={isLoading}
              >
                <option value="desc">
                  {sortBy === 'reward' ? 'Highest First' : 'Newest First'}
                </option>
                <option value="asc">
                  {sortBy === 'reward' ? 'Lowest First' : 'Oldest First'}
                </option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-end">
            <button
              onClick={onResetFilters}
              disabled={!hasActiveFilters || isLoading}
              className="rounded bg-gray-500 px-4 py-2 text-sm text-white hover:bg-gray-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TaskFilterTabs({
  tabs,
  onTabChange,
  activeTab = '',
  isLoading = false,
  showCounts = false,
}: TaskFilterTabsProps) {
  return (
    <div className="space-y-4">
      {/* Category Tabs */}
      <div className="flex w-full gap-3 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.label)}
            disabled={isLoading}
            className={cn(
              'flex-shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 disabled:opacity-50',
              activeTab === tab.label
                ? 'bg-blue-500 text-white shadow-sm'
                : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-100',
            )}
          >
            <span>{tab.id}</span>
            {showCounts && tab.count !== undefined && (
              <span
                className={cn(
                  'ml-2 rounded-full px-2 py-0.5 text-xs',
                  activeTab === tab.id
                    ? 'bg-blue-400 text-blue-100'
                    : 'bg-gray-200 text-gray-600',
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading indicator for tabs */}
      {isLoading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
          <span>Filtering tasks...</span>
        </div>
      )}
    </div>
  );
}

// Enhanced version with advanced filters
interface EnhancedTaskFilterTabsProps extends TaskFilterTabsProps {
  minReward?: number | undefined;
  onMinRewardChange?: (value: number | undefined) => void;
  sortBy?: 'reward' | 'created_at';
  onSortByChange?: (value: 'reward' | 'created_at') => void;
  sortOrder?: 'asc' | 'desc';
  onSortOrderChange?: (value: 'asc' | 'desc') => void;
  onResetFilters?: () => void;
  hasActiveFilters?: boolean;
  showAdvancedFilters?: boolean;
}

export function EnhancedTaskFilterTabs({
  showAdvancedFilters = true,
  minReward,
  onMinRewardChange = () => {
    console.log('onMinRewardChange');
  },
  sortBy = 'created_at',
  onSortByChange = () => {
    console.log('onSortByChange');
  },
  sortOrder = 'desc',
  onSortOrderChange = () => {
    console.log('onSortOrderChange');
  },
  onResetFilters = () => {
    console.log('onResetFilters');
  },
  hasActiveFilters = false,
  ...props
}: EnhancedTaskFilterTabsProps) {
  return (
    <div className="space-y-4">
      <TaskFilterTabs {...props} />

      {showAdvancedFilters && (
        <AdvancedFilters
          minReward={minReward}
          onMinRewardChange={onMinRewardChange}
          sortBy={sortBy}
          onSortByChange={onSortByChange}
          sortOrder={sortOrder}
          onSortOrderChange={onSortOrderChange}
          onResetFilters={onResetFilters}
          hasActiveFilters={hasActiveFilters}
          isLoading={props.isLoading}
        />
      )}
    </div>
  );
}
