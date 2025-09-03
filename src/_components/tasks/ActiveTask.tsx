'use client';

import type { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useActiveTasks, useTaskActions } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import type { TaskDetail } from '~/types/api';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';

// Helper function to convert API task detail to UI task format
function convertApiTaskToUITask(apiTask: TaskDetail): Task {
  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: apiTask.status,
    image: apiTask.image ?? '',
    deadline: apiTask.deadline ?? '',
    category: apiTask.category ?? 'General',
    rewardInEth: 2300,
    rewardInUsd: 500,
    creator: apiTask.creatorDisplayName,
  };
}

export const ActiveTask = () => {
  const router = useRouter();

  const { claimedTasks: claimedTaskIds, markTaskAsUnclaimed } =
    useTaskActions();

  const { activeTasks, isLoading, error, refetchActiveTask } = useActiveTasks();
  const { toasts, removeToast } = useToast();
  useEffect(() => {
    // fetchActiveTasks();
    refetchActiveTask();
  }, []);
  // Convert API tasks to UI format
  const tasks: Task[] = (activeTasks ?? []).map(convertApiTaskToUITask);

  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleRemoveFromActive = (taskId: string) => {
    const confirmed = window.confirm(
      'Remove this task from your active tasks?',
    );
    if (confirmed) {
      markTaskAsUnclaimed(taskId);
    }
  };

  // Loading state
  if (isLoading && claimedTaskIds.length > 0) {
    return (
      <>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={`loading-${index}`} />
          ))}
        </div>
        {toast.success(toasts.map((toast) => toast.message).join('\n'))}
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Active Tasks</h2>
            <span className="text-sm text-red-500">Error loading tasks</span>
          </div>
          <div className="rounded border border-red-300 bg-red-50 p-6 text-center">
            <h3 className="font-medium text-red-800">
              Failed to load active tasks
            </h3>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => refetchActiveTask()}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        {toast.success(toasts.map((toast) => toast.message).join('\n'))}
      </>
    );
  }

  // Empty state
  if (claimedTaskIds.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Active Tasks</h2>
            <span className="text-sm text-gray-500">0 active tasks</span>
          </div>
          <div className="rounded border border-gray-200 bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No active tasks
            </h3>
            <p className="mt-2 text-gray-500">
              Claim some tasks to see them here. Browse available tasks and
              click &quot;Take Task&quot; to get started.
            </p>
            <button
              onClick={() => router.push('/task')}
              className="mt-4 rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Browse Tasks
            </button>
          </div>
        </div>
        {toast.success(toasts.map((toast) => toast.message).join('\n'))}
      </>
    );
  }

  // Success state with tasks
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Active Tasks</h2>
          <span className="text-sm text-gray-500">
            {tasks.length} active task{tasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Info banner */}
        <div className="rounded border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-blue-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                These are tasks you&apos;ve claimed and are working on. Click on
                a task to view details, submit your work, or cancel if needed.
              </p>
            </div>
          </div>
        </div>

        {/* Tasks grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              <TaskCard task={task} onAction={onClick} />

              {/* Quick action buttons overlay */}
              <div className="absolute right-2 top-2 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick(task.id);
                  }}
                  className="rounded bg-blue-500 p-1 text-white shadow-lg hover:bg-blue-600"
                  title="View Details"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // handleRemoveFromActive(task.id);
                  }}
                  className="rounded bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                  title="Remove from Active"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {toast.success(toasts.map((toast) => toast.message).join('\n'))}
    </>
  );
};
