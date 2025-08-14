'use client';

import { useState, useEffect } from 'react';
import { useFindTasks } from '~/hooks/useTasks';
import type { FindTasksInput, TaskSummary } from '~/types/api';

export default function TaskListContainer() {
  // State to hold the fetched tasks
  const [tasks, setTasks] = useState<TaskSummary[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Get the mutation hook
  const findTasksMutation = useFindTasks();

  // Function to fetch tasks (called by user actions, not during render)
  const fetchTasks = (filters: FindTasksInput = {}) => {
    const defaultFilters: FindTasksInput = {
      limit: 10,
      page: 1,
      sort_by: 'created_at',
      order: 'desc',
      ...filters,
    };

    findTasksMutation.mutate(defaultFilters);
  };

  // Handle successful data fetch
  useEffect(() => {
    if (findTasksMutation.data?.success) {
      setTasks(findTasksMutation.data.tasks);
      setTotalCount(findTasksMutation.data.totalCount);
    }
  }, [findTasksMutation.data]);

  // Load initial tasks after component mounts (prevents hydration issues)
  useEffect(() => {
    if (!hasInitialLoad) {
      fetchTasks();
      setHasInitialLoad(true);
    }
  }, [hasInitialLoad]);

  // Handle filter changes
  const handleFilterChange = (filters: Partial<FindTasksInput>) => {
    fetchTasks(filters);
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    fetchTasks({ page });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tasks</h2>

      {/* Filter Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => handleFilterChange({ category: 'web3' })}
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          disabled={findTasksMutation.isPending}
        >
          Web3 Tasks
        </button>
        <button
          onClick={() => handleFilterChange({ category: 'tech' })}
          className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          disabled={findTasksMutation.isPending}
        >
          Tech Tasks
        </button>
        <button
          onClick={() => handleFilterChange({})}
          className="rounded bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
          disabled={findTasksMutation.isPending}
        >
          All Tasks
        </button>
      </div>

      {/* Loading State */}
      {findTasksMutation.isPending && (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading tasks...</div>
        </div>
      )}

      {/* Error State */}
      {findTasksMutation.error && (
        <div className="rounded border border-red-300 bg-red-50 p-4">
          <h3 className="font-medium text-red-800">Error loading tasks</h3>
          <p className="text-red-600">
            {findTasksMutation.error.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => fetchTasks()}
            className="mt-2 rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">
            Showing {tasks.length} of {totalCount} tasks
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded border border-gray-200 bg-white p-4 shadow-sm"
              >
                <h3 className="font-medium">{task.title}</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {task.description.length > 100
                    ? `${task.description.substring(0, 100)}...`
                    : task.description}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">
                    {task.rewardAmount} ETH
                  </span>
                  <span className="text-xs text-gray-500">{task.category}</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Status: {task.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!findTasksMutation.isPending &&
        !findTasksMutation.error &&
        tasks.length === 0 &&
        hasInitialLoad && (
          <div className="py-8 text-center text-gray-500">No tasks found</div>
        )}

      {/* Pagination */}
      {totalCount > 10 && (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => handlePageChange(1)}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            disabled={findTasksMutation.isPending}
          >
            First
          </button>
          <button
            onClick={() => handlePageChange(2)}
            className="rounded bg-gray-200 px-3 py-1 hover:bg-gray-300"
            disabled={findTasksMutation.isPending}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
