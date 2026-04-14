'use client';

import type { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useCompletedTasks } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';

// Interface for actual API response structure
interface CompletedTaskResponse {
  id: string;
  title: string;
  description: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
  rewardAmount: string;
  deadline: Date;
  image: string | null;
  createdAt: Date;
  creatorUserId: string;
  category?: string;
}

// Helper function to convert API task to UI task format
function convertApiTaskToUITask(apiTask: CompletedTaskResponse): Task {
  // Mock ETH to USD conversion rate

  return {
    id: apiTask.id,
    title: apiTask.title,
    description: apiTask.description,
    status: 'COMPLETED' as const, // Override status for completed tasks
    image: apiTask.image ?? '',
    deadline: apiTask.deadline,
    creator: `Creator ${apiTask.creatorUserId.slice(0, 8)}...`,
    category: apiTask.category ?? 'general',
    rewardInEth: 303,
    rewardInUsd: 70,
    createdAt: apiTask.createdAt,
  };
}

export default function CompletedTask() {
  const router = useRouter();
  const {
    completedTasks,
    isLoading,
    error,
    fetchCompletedTasks,
    refetchCompletedTasks,
  } = useCompletedTasks();
  const { toasts } = useToast();

  // Fetch completed tasks on component mount
  useEffect(() => {
    fetchCompletedTasks();
  }, [fetchCompletedTasks]);

  // Convert API tasks to UI format
  const tasks: Task[] = completedTasks.map(convertApiTaskToUITask);

  const handleRefresh = () => {
    refetchCompletedTasks();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Completed Tasks</h2>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
              <span className="text-sm text-gray-500">
                Loading completed tasks...
              </span>
            </div>
          </div>
          <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </div>
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
            <h2 className="text-lg font-semibold">Your Completed Tasks</h2>
            <span className="text-sm text-red-500">
              Error loading completed tasks
            </span>
          </div>
          <div className="rounded border border-red-300 bg-red-50 p-6 text-center">
            <h3 className="font-medium text-red-800">
              Failed to load completed tasks
            </h3>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={handleRefresh}
                className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Retry
              </button>
              <button
                onClick={() => router.push('/tasks')}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Browse Tasks
              </button>
            </div>
          </div>
        </div>
        {toast.success(toasts.map((toast) => toast.message).join('\n'))}
      </>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Completed Tasks</h2>
            <span className="text-sm text-gray-500">0 completed tasks</span>
          </div>
          <div className="rounded border border-gray-200 bg-gray-50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No completed tasks yet
            </h3>
            <p className="mt-2 text-gray-500">
              Complete some tasks to see your achievements here. Your completed
              tasks will be permanently tracked in the backend.
            </p>
            <button
              onClick={() => router.push('/tasks')}
              className="mt-4 rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
            >
              Browse Available Tasks
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
          <h2 className="text-lg font-semibold">Your Completed Tasks</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {tasks.length} completed task{tasks.length !== 1 ? 's' : ''} from
              backend
            </span>
            <button
              onClick={handleRefresh}
              className="text-sm text-blue-600 underline hover:text-blue-800"
              title="Refresh completed tasks"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* User achievement banner */}
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                <strong>Backend Records:</strong> These are tasks you&apos;ve
                successfully completed and submitted, stored permanently in our
                database. This is your official achievement record and work
                history.
              </p>
            </div>
          </div>
        </div>
        <div>
          {tasks.map((task) => (
            <TaskCard task={task} key={task.id} />
          ))}
        </div>

        {/* Backend sync info */}
        <div className="rounded border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-700">
            🔒 Completed tasks are official records stored in the backend
            database. They represent verified work completion and earned rewards
            that are tracked permanently.
          </p>
        </div>
      </div>

      {toast.success(toasts.map((toast) => toast.message).join('\n'))}
    </>
  );
}
