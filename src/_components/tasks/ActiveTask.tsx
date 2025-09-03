'use client';

import { Task } from '@/types/task';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { getTaskById } from '~/app/api/task';
import { useActiveTasks, useTaskActions } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import { convertApiTaskToUITask } from './Task';
// import { handleRemoveFromActive } from './TaskActions';
import  TaskCard  from './TaskCard';

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

  const { data, isLoading: isLoadingTask, error: errorTask } = getTaskById(
    'e146ae52-0d8e-4760-b5d8-3d5b38b412d4',
  );
  console.log(data);
  console.log(errorTask);
  console.log(isLoadingTask);

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

      {/* <ToastContainer toasts={toasts} onClose={removeToast} /> */}
    </>
  );
};
