/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useTaskStore } from '~/store';
import { useToastContext } from '~/store/ToastProvider';
import { api } from '~/trpc/react';
// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: unknown }).message;
    return typeof message === 'string' ? message : 'An error occurred';
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// Helper function to safely handle context (loading ID)
function getLoadingId(context: unknown): string | null {
  return typeof context === 'string' ? context : null;
}

// Mutation hook for creating a task
export function useCreateTask() {
  const { removeToast, showError, showSuccess, showLoading } =
    useToastContext();
  const store = useTaskStore();
  const { resetStep, resetForm } = store;
  return api.task.createTask.useMutation({
    onMutate(_variables) {
      return showLoading('Creating Task', 'Processing your request...');
    },
    onSuccess(data, _variables, context) {
      if (context) removeToast(context);
      showSuccess(
        'Task Created Successfully!',
        `task ${data.task?.title} created successful`,
      );
      resetForm();
      resetStep(0);
    },
    onError(error, _variables, context) {
      if (context) removeToast(context);
      showError('Failed to create Task', getErrorMessage(error));
    },
  });
}
// Mutation hook for finding tasks with filters
export function useFindTasks({
  category,
  limit,
  currentPage,
  minReward,
  sortBy,
  sortOrder,
}: {
  category?: string;
  limit?: number;
  currentPage: number;
  minReward?: number;
  sortBy: 'created_at' | 'reward' | undefined;
  sortOrder: 'desc' | 'asc';
}) {
  return api.task.findTasks.useQuery({
    category,
    limit,
    page: currentPage,
    sort_by: sortBy,
    order: sortOrder,
    min_reward: minReward,
  });
}

// Mutation hook for claiming a task
export function useClaimTask() {
  const { showSuccess, showError, showLoading, removeToast } =
    useToastContext();

  return api.task.claimTask.useMutation({
    onMutate: (_variables) => {
      return showLoading('Claiming Task', 'Processing your request...');
    },
    onSuccess: (data, _variables, context) => {
      if (context) removeToast(context); // if you store loadingId in context
      showSuccess(
        'Task Claimed Successfully!',
        data.message || 'You can now start working on this task',
      );
    },
    onError: (error, _variables, context) => {
      if (context) removeToast(context); // if you store loadingId in context
      showError('Failed to Claim Task', getErrorMessage(error));
    },
  });
}

// Mutation hook for canceling a task
export function useCancelTask() {
  const { showSuccess, showError, showLoading, removeToast } =
    useToastContext();

  return api.task.cancelTask.useMutation({
    onMutate: (_variables) => {
      // return a loading toast id so you can remove it later
      return showLoading('Canceling Task', 'Canceling task...');
    },
    onSuccess: (data, _variables, context) => {
      if (context) removeToast(context); // removes loading toast
      showSuccess('Task canceled successfully!', 'Successfully canceled task.');
    },
    onError: (error, _variables, context) => {
      if (context) removeToast(context); // removes loading toast
      showError('Failed to cancel Task', getErrorMessage(error));
    },
  });
}

// Mutation hook for submitting a task
export function useSubmitTask() {
  const { showSuccess, showError, showLoading, removeToast } =
    useToastContext();

  return api.task.submitTask.useMutation({
    onMutate: (_variables) => {
      return showLoading('Submitting Task', 'Uploading your submission...');
    },
    onSuccess: (data, _variables, context) => {
      if (context) removeToast(context); // if you store loadingId in context
      showSuccess(
        'Task Submitted Successfully!',
        data.message || `Submission ID: ${data.submissionId}`,
      );
    },
    onError: (error, _variables, context) => {
      if (context) removeToast(context);
      showError('Failed to Submit Task', getErrorMessage(error));
    },
  });
}

// Query hook for getting a single task by ID (for task detail pages)
export function useGetTaskById(taskId: string | null) {
  return api.task.getTaskById.useQuery(
    { taskId: taskId! },
    {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
}

export function useTaskActions() {
  const [claimedTasks, setClaimedTasks] = useState<string[]>([]);

  // Load claimed tasks from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('claimedTasks');
        if (stored) {
          const parsed = JSON.parse(stored) as string[];
          setClaimedTasks(Array.isArray(parsed) ? parsed : []);
        }
      } catch (error) {
        console.warn('Failed to load claimed tasks:', error);
      }
    }
  }, []);

  const updateStorage = (taskIds: string[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('claimedTasks', JSON.stringify(taskIds));
      } catch (error) {
        console.warn('Failed to save claimed tasks:', error);
      }
    }
  };

  const markTaskAsClaimed = (taskId: string) => {
    setClaimedTasks((prev) => {
      if (prev.includes(taskId)) return prev;
      const updated = [...prev, taskId];
      updateStorage(updated);
      return updated;
    });
  };

  const markTaskAsUnclaimed = (taskId: string) => {
    setClaimedTasks((prev) => {
      const updated = prev.filter((id) => id !== taskId);
      updateStorage(updated);
      return updated;
    });
  };

  const isTaskClaimed = (taskId: string) => {
    return claimedTasks.includes(taskId);
  };

  return {
    isTaskClaimed,
    markTaskAsClaimed,
    markTaskAsUnclaimed,
    claimedTasks,
  };
}

// Hook for fetching multiple tasks by IDs (for active tasks)
export function useGetTasksByIds(taskIds: string[]) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskIds.length === 0) {
      setTasks([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Create a function to fetch tasks sequentially
    const fetchTasksSequentially = async () => {
      const fetchedTasks: any[] = [];

      for (const taskId of taskIds) {
        if (!taskId) {
          console.warn(`Invalid UUID: ${taskId}`);
          continue;
        }

        try {
          // Use the tRPC query method directly
          const task = api.task.getTaskById.useQuery({ taskId });
          if (task) {
            fetchedTasks.push(task);
          }
        } catch (err) {
          console.warn(`Failed to fetch task ${taskId}:`, getErrorMessage(err));
          // Continue with other tasks
        }
      }

      setTasks(fetchedTasks);
      setIsLoading(false);
    };

    fetchTasksSequentially().catch((err) => {
      setError(getErrorMessage(err));
      setIsLoading(false);
    });
  }, [taskIds.join(',')]);

  const refetch = () => {
    if (taskIds.length > 0) {
      setIsLoading(true);
      setError(null);

      const fetchTasksSequentially = async () => {
        const fetchedTasks: any[] = [];

        for (const taskId of taskIds) {
          if (taskId) continue;

          try {
            const task = api.task.getTaskById.useQuery({ taskId });
            if (task) {
              fetchedTasks.push(task);
            }
          } catch (err) {
            console.warn(
              `Failed to fetch task ${taskId}:`,
              getErrorMessage(err),
            );
          }
        }

        setTasks(fetchedTasks);
        setIsLoading(false);
      };

      fetchTasksSequentially().catch((err) => {
        setError(getErrorMessage(err));
        setIsLoading(false);
      });
    }
  };

  return {
    data: tasks,
    isLoading,
    error,
    refetch,
  };
}
// Hook for fetching user's draft tasks from backend (for task CREATORS)
export function useDraftTasks() {
  return api.task.getTasksByStatus.useQuery(
    {
      status: 'DRAFT',
    },
    {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
}

// Hook for fetching user's Active tasks from backend
export function useActiveTasks() {
  const { data: session } = useGetRoleBase();
  const userRole = session?.user?.role;

  // For creators: get their created tasks with ACTIVE status
  const creatorTasks = api.task.getTasksByStatus.useQuery(
    {
      status: 'ACTIVE',
    },
    {
      enabled: userRole === 'CREATOR',
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  // For completers: get their claimed tasks
  const completerTasks = api.task.getUserClaimedTasks.useQuery(
    {
      limit: 50,
      offset: 0,
    },
    {
      enabled: userRole === 'COMPLETER',
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  // Return the appropriate query based on user role
  if (userRole === 'CREATOR') {
    return creatorTasks;
  } else if (userRole === 'COMPLETER') {
    // Transform the completer tasks data to match the expected structure
    // Filter for only IN_PROGRESS claims to show truly active tasks
    return {
      ...completerTasks,
      data: completerTasks.data
        ? {
            ...completerTasks.data,
            data:
              completerTasks.data.data
                ?.filter(
                  (claimedTask: any) =>
                    claimedTask.claimStatus === 'IN_PROGRESS',
                )
                .map((claimedTask: any) => ({
                  id: claimedTask.taskId,
                  title: claimedTask.title,
                  description: claimedTask.description,
                  status: claimedTask.status,
                  rewardAmount: claimedTask.rewardAmount,
                  deadline: claimedTask.deadline,
                  image: claimedTask.image,
                  createdAt: claimedTask.createdAt,
                  // Add additional fields that might be needed
                  claimStatus: claimedTask.claimStatus,
                  claimCreatedAt: claimedTask.claimCreatedAt,
                })) || [],
          }
        : { data: [] },
    };
  } else {
    // Default behavior for unknown roles
    return {
      data: { data: [] },
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }
}

// hook for fetching role base
export function useGetRoleBase() {
  return api.auth.getSessionStatus.useQuery();
}
export function useGetUserClaimedTasks() {
  return api.task.getUserClaimedTasks.useQuery(
    {
      limit: 100,
      offset: 0,
    },
    {
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
}
