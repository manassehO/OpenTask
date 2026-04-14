'use client';

import type { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ToastContainer } from '~/_components/ui/toast';
import { useDraftTasks } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import type { TaskSummary } from '~/types/api';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';

// Helper function to convert API task summary to UI task format
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
    rewardInEth: Number(apiTask.rewardAmount) ?? 0,
    rewardInUsd: Math.round((Number(apiTask.rewardAmount) ?? 0) * ETH_TO_USD),
  };
}

export default function DraftTask() {
  const router = useRouter();
  const {
    draftTasks,
    isLoading,
    error,
    fetchDraftTasks,
    refetchDrafts,
    publishDraft,
    deleteDraft,
  } = useDraftTasks();
  const { toasts, removeToast } = useToast();

  // Fetch draft tasks on component mount
  useEffect(() => {
    fetchDraftTasks();
  }, []);

  // Convert API tasks to UI format
  const tasks: Task[] = draftTasks.map(convertApiTaskToUITask);

  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const handleEditDraft = (taskId: string) => {
    // Navigate to edit page
    router.push(`/create-task/edit/${taskId}`);
  };

  const handlePublishDraft = async (taskId: string) => {
    const confirmed = window.confirm(
      'Publish this draft task? Once published, it will be available to users and cannot be easily modified.',
    );
    if (confirmed) {
      await publishDraft(taskId);
    }
  };

  const handleDeleteDraft = async (taskId: string) => {
    const confirmed = window.confirm(
      'Delete this draft permanently? This action cannot be undone.',
    );
    if (confirmed) {
      await deleteDraft(taskId);
    }
  };

  const handleDuplicateDraft = (taskId: string) => {
    // Navigate to create task page with pre-filled data
    router.push(`/create-task/duplicate/${taskId}`);
  };

  const handleRefresh = () => {
    refetchDrafts();
  };

  // Loading state
  if (isLoading) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Draft Tasks</h2>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
              <span className="text-sm text-gray-500">Loading drafts...</span>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <TaskCardSkeleton key={index} />
            ))}
          </div>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Draft Tasks</h2>
            <span className="text-sm text-red-500">Error loading drafts</span>
          </div>
          <div className="rounded border border-red-300 bg-red-50 p-6 text-center">
            <h3 className="font-medium text-red-800">
              Failed to load draft tasks
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
                onClick={() => router.push('/create-task')}
                className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Create New Task
              </button>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Your Draft Tasks</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">0 draft tasks</span>
              <button
                onClick={handleRefresh}
                className="text-sm text-blue-600 underline hover:text-blue-800"
                title="Refresh"
              >
                Refresh
              </button>
            </div>
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
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No draft tasks found
            </h3>
            <p className="mt-2 text-gray-500">
              You haven&apos;t created any draft tasks yet. Tasks saved as
              drafts during creation will appear here.
            </p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => router.push('/create-task')}
                className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                Create New Task
              </button>
              <button
                onClick={handleRefresh}
                className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
              >
                Refresh List
              </button>
            </div>
          </div>
        </div>
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </>
    );
  }

  // Success state with tasks
  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Draft Tasks</h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {tasks.length} draft task{tasks.length !== 1 ? 's' : ''} from
              backend
            </span>
            <button
              onClick={handleRefresh}
              className="text-sm text-blue-600 underline hover:text-blue-800"
              title="Refresh drafts"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Creator info banner */}
        <div className="rounded border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-amber-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>Backend Drafts:</strong> These are your unpublished
                tasks stored in the database. You can edit, publish, or delete
                them. Once published, they&apos;ll be available to users on the
                platform.
              </p>
            </div>
          </div>
        </div>

        {/* Tasks grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <div key={task.id} className="relative">
              <TaskCard task={task} onAction={onClick} />

              {/* Draft label */}
              <div className="absolute left-2 top-2">
                <span className="rounded-full bg-amber-500 px-2 py-1 text-xs font-medium text-white shadow-lg">
                  📝 Draft
                </span>
              </div>

              {/* Creator action buttons overlay */}
              <div className="absolute right-2 top-2 flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditDraft(task.id);
                  }}
                  className="rounded bg-blue-500 p-1 text-white shadow-lg hover:bg-blue-600"
                  title="Edit Draft"
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDuplicateDraft(task.id);
                  }}
                  className="rounded bg-purple-500 p-1 text-white shadow-lg hover:bg-purple-600"
                  title="Duplicate Draft"
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handlePublishDraft(task.id);
                  }}
                  className="rounded bg-green-500 p-1 text-white shadow-lg hover:bg-green-600"
                  title="Publish Draft"
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
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </button>

                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    await handleDeleteDraft(task.id);
                  }}
                  className="rounded bg-red-500 p-1 text-white shadow-lg hover:bg-red-600"
                  title="Delete Draft"
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Backend sync info */}
        <div className="rounded border border-blue-200 bg-blue-50 p-3">
          <p className="text-sm text-blue-700">
            💾 Draft tasks are automatically synced with the backend. Changes
            made in the task creation form are saved as drafts in the database.
          </p>
        </div>
      </div>

      <ToastContainer toasts={toasts} onClose={removeToast} />
    </>
  );
}
