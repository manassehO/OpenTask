'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFindTasks } from '~/hooks/useTasks';
import type { Task } from '~/types/task';
import RecomendedTasks from '../dashboard_components/recomended-tasks';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';
import { EnhancedTaskFilterTabs, type TaskFilterTab } from './TaskFilterTabs';
{
  /*
      tasks: {
    category: string;
    id: string;
    status: "ACTIVE" | "DRAFT" | "COMPLETED" | "CANCELLED" | "DISPUTED";
    image: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    creatorUserId: string;
    title: string;
    description: string;
    instructions: string;
    rewardAmount: string;
    rewardTokenAddress: string;
    platformFee: string | null;
    approvedCompletions: number;
    inProgressCompletions: number;
    requiredCompletions: number;
    deadline: Date;
    fundingTxHash: string;
    maxCompletions: number;
    tags: string;
    example: string | null;
    specialRequirements: string | null;
}[]

      */
}

const AllTasks = () => {
  const [filterState, setFilterState] = useState<{
    category?: string;
    minReward?: number;
    sortBy: 'created_at';
    sortOrder: 'asc' | 'desc';
    currentPage: number;
  }>({
    minReward: undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
    currentPage: 1,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<{ id: string; label: string }[]>(
    [],
  );

  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useFindTasks({
    ...filterState,
    limit: 9,
  });

  const hasActiveFilters =
    filterState.minReward !== undefined ||
    filterState.sortBy !== 'created_at' ||
    filterState.sortOrder !== 'desc';

  useEffect(() => {
    if (data?.success) {
      setCategories(() => {
        const uniqueCategories = [
          ...new Set(data.tasks.map((task) => task.category)),
        ];

        return [
          { id: 'All', label: '' },
          ...uniqueCategories.map((cat) => ({ id: cat, label: cat })),
        ];
      });
      setTasks(data.tasks);

      setTotalCount(data.totalCount);
    }
  }, [data]);

  const onClick = (taskId: string) => router.push(`tasks/${taskId}`);

  const handleTabChange = (tabId: string) =>
    setFilterState((prev) => ({
      ...prev,
      category: tabId,
      currentPage: 1,
    }));

  const handlePageChange = (page: number) =>
    setFilterState((prev) => ({ ...prev, currentPage: page }));

  const handleMinRewardChange = (minReward?: number) =>
    setFilterState((prev) => ({
      ...prev,
      minReward,
      currentPage: 1,
    }));

  const handleSortByChange = (_sortBy: 'created_at' | 'reward') =>
    setFilterState((prev) => ({
      ...prev,
      sortBy: 'created_at', // Always use created_at since that's what the API supports
      currentPage: 1,
    }));

  const handleSortOrderChange = (sortOrder: 'asc' | 'desc') =>
    setFilterState((prev) => ({
      ...prev,
      sortOrder,
      currentPage: 1,
    }));

  const handleResetFilters = () =>
    setFilterState((prev) => ({
      ...prev,
      minReward: undefined,
      sortBy: 'created_at',
      sortOrder: 'desc',
      currentPage: 1,
    }));

  const tabs: TaskFilterTab[] = categories.map((tab) => ({
    ...tab,
    active: filterState.category === tab.id,
  }));

  const totalPages = Math.ceil(totalCount / 9);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-bold">All Tasks</h1>
        {totalCount > 0 && (
          <span className="text-sm text-gray-500">
            {totalCount} task{totalCount !== 1 ? 's' : ''} found
          </span>
        )}
      </div>

      <EnhancedTaskFilterTabs
        activeTab={filterState.category!}
        onTabChange={handleTabChange}
        tabs={tabs}
        isLoading={isLoading}
        showCounts={false}
        showAdvancedFilters
        minReward={filterState.minReward}
        onMinRewardChange={handleMinRewardChange}
        sortBy={filterState.sortBy}
        onSortByChange={handleSortByChange}
        sortOrder={filterState.sortOrder}
        onSortOrderChange={handleSortOrderChange}
        onResetFilters={handleResetFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {hasActiveFilters && (
        <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="font-medium text-blue-800">Active Filters:</span>
              {filterState.minReward && (
                <span className="text-blue-700">
                  Min Reward: {filterState.minReward} ETH
                </span>
              )}
              {filterState.sortBy !== 'created_at' && (
                <span className="text-blue-700">
                  Sort: {filterState.sortBy}
                </span>
              )}
              {filterState.sortOrder !== 'desc' && (
                <span className="text-blue-700">
                  Order: {filterState.sortOrder}
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-blue-600 underline hover:text-blue-800"
            >
              Clear all
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">Error loading tasks</h3>
          <p className="text-red-600">
            {error.message ?? 'Failed to load tasks'}
          </p>
          <button
            onClick={() => refetch}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tasks Grid */}
      {!isLoading && !isError && tasks.length > 0 && (
        <>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task, index) => (
              <TaskCard key={index} task={{ ...task }} onAction={onClick} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() =>
                  handlePageChange(Math.max(1, filterState.currentPage - 1))
                }
                disabled={filterState.currentPage === 1 || isLoading}
                className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Previous
              </button>

              <span className="px-4 py-1">
                Page {filterState.currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  handlePageChange(
                    Math.min(totalPages, filterState.currentPage + 1),
                  )
                }
                disabled={filterState.currentPage === totalPages || isLoading}
                className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Empty State */}
      {!isLoading && !isError && tasks.length === 0 && (
        <div className="mt-8 py-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No tasks found</h3>
          <p className="mt-2 text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more tasks.'
              : filterState.category === 'all'
                ? 'There are no tasks available at the moment.'
                : `No tasks found in the ${filterState.category} category.`}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default function Task() {
  return (
    <>
      <div>
        <RecomendedTasks storeKey="recommended-tasks" showSeeAll={false} />
        <AllTasks />
      </div>
    </>
  );
}
