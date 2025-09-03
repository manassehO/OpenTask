'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useFindTasks } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import { ToastContainer } from '~/_components/ui/Toast';
import TaskCard from './TaskCard';
import { EnhancedTaskFilterTabs, type TaskFilterTab } from './TaskFilterTabs';
import type { TaskSummary } from '~/types/api';
import type { Task, TaskFilters } from '~/types/task';
import TaskCardSkeleton from './TaskCardSkeleton';
function convertApiTaskToUITask(apiTask: TaskSummary): Task {
  // Mock ETH to USD conversion rate
  const ETH_TO_USD = 2400;

  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status,
    creator: `Creator ${apiTask.creatorUserId.slice(0, 8)}...`,
    image: apiTask.image ?? '',
    deadline: apiTask.deadline,
    category: apiTask.category ?? 'General',
    rewardInEth: apiTask.rewardAmount.toString() ?? '0',
    rewardInUsd: ETH_TO_USD,
  };
}

const tabLabels = [
  { id: 'all', label: 'All Tasks' },
  { id: 'web3', label: 'Web3' },
  { id: 'tech', label: 'Tech' },
  { id: 'web2', label: 'Web2' },
  { id: 'defi', label: 'DeFi' },
  { id: 'testing', label: 'User Testing' },
];

const AllTasks = () => {
  const [filterState, setFilterState] = useState<{
    activeTab: string;
    minReward?: number;
    sortBy: 'created_at';
    sortOrder: 'asc' | 'desc';
    currentPage: number;
  }>({
    activeTab: 'all',
    minReward: undefined,
    sortBy: 'created_at',
    sortOrder: 'desc',
    currentPage: 1,
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  const router = useRouter();
  const findTasksMutation = useFindTasks();

  const hasActiveFilters =
    filterState.minReward !== undefined ||
    filterState.sortBy !== 'created_at' ||
    filterState.sortOrder !== 'desc';

  useEffect(() => {
    const filters: TaskFilters = {
      limit: 9,
      page: filterState.currentPage,
      sort_by: filterState.sortBy,
      order: filterState.sortOrder,
    };

    findTasksMutation.mutate(filters);
  }, [filterState]);

  useEffect(() => {
    if (findTasksMutation.data?.success) {
      const fetchTask = findTasksMutation.data.tasks;
      const tasks: Task[] = fetchTask.map(convertApiTaskToUITask);

      setTasks(tasks);
      setTotalCount(findTasksMutation.data.totalCount);
    }
  }, [findTasksMutation.data]);

  const onClick = (taskId: string) => router.push(`/task/${taskId}`);

  const handleTabChange = (tabId: string) =>
    setFilterState((prev) => ({
      ...prev,
      activeTab: tabId,
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

  const tabs: TaskFilterTab[] = tabLabels.map((tab) => ({
    ...tab,
    active: filterState.activeTab === tab.id,
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
        activeTab={filterState.activeTab}
        onTabChange={handleTabChange}
        tabs={tabs}
        isLoading={findTasksMutation.isPending}
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
      {findTasksMutation.isPending && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* Error State */}
      {findTasksMutation.error && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">Error loading tasks</h3>
          <p className="text-red-600">
            {findTasksMutation.error.message || 'Failed to load tasks'}
          </p>
          <button
            // onClick={() => findTasksMutation.mutate(buildFilters())}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tasks Grid */}
      {!findTasksMutation.isPending &&
        !findTasksMutation.error &&
        tasks.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task, index) => (
                <TaskCard key={index} task={task} onAction={onClick} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    handlePageChange(Math.max(1, filterState.currentPage - 1))
                  }
                  disabled={
                    filterState.currentPage === 1 || findTasksMutation.isPending
                  }
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
                  disabled={
                    filterState.currentPage === totalPages ||
                    findTasksMutation.isPending
                  }
                  className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

      {/* Empty State */}
      {!findTasksMutation.isPending &&
        !findTasksMutation.error &&
        tasks.length === 0 && (
          <div className="mt-8 py-12 text-center">
            <h3 className="text-lg font-medium text-gray-900">
              No tasks found
            </h3>
            <p className="mt-2 text-gray-500">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more tasks.'
                : filterState.activeTab === 'all'
                  ? 'There are no tasks available at the moment.'
                  : `No tasks found in the ${filterState.activeTab} category.`}
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

const RecommendedTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter();
  const findTasksMutation = useFindTasks();

  useEffect(() => {
    const filters: TaskFilters = {
      limit: 3,
      sort_by: 'created_at',
      order: 'desc',
    };
    findTasksMutation.mutate(filters);
  }, []);

  useEffect(() => {
    if (findTasksMutation.data?.success) {
      setTasks(findTasksMutation.data.tasks.map(convertApiTaskToUITask));
    }
  }, [findTasksMutation.data]);

  const onClick = (taskId: string) => router.push(`/task/${taskId}`);

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 font-bold">Recommended For You</h1>

      {findTasksMutation.isPending ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <TaskCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
      ) : findTasksMutation.error ? (
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">
            Error loading recommendations
          </h3>
          <p className="text-red-600">Unable to load recommended tasks</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onAction={onClick} />
          ))}
        </div>
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>No recommended tasks available at the moment</p>
          <p className="mt-1 text-sm">Check back later for new opportunities</p>
        </div>
      )}
    </div>
  );
};

export default function Task() {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <div>
        <RecommendedTasks />
        <AllTasks />
      </div>
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
