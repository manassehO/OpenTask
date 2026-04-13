/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { useTaskStore } from '~/store';
import { useToastContext } from '~/store/ToastProvider';
import { api } from '~/trpc/react';
// Helper function to safely extract error message
function getErrorMessage(error: any): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return typeof error.message === 'string'
      ? error.message
      : 'An error occurred';
  }
  if (error && typeof error === 'object' && 'shape' in error) {
    return (error as any).shape?.message || 'An error occurred';
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
export function useGetTasksByIds(_taskIds: string[]) {
  // This hook was calling useQuery inside a loop (invalid hook usage)
  // Since it is currently unused, we're simplifying it to return placeholders
  // A proper implementation would use useQueries (plural) or a single query for multiple IDs
  return {
    data: [],
    isLoading: false,
    error: null,
    refetch: () => {
      /* no-op */
    },
  };
}

// Hook for fetching user's draft tasks from backend (for task CREATORS)
export function useDraftTasks() {
  const query = api.task.getTasksByStatus.useQuery(
    {
      status: 'DRAFT',
    },
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  return {
    ...query,
    draftTasks: query.data?.data ?? [],
    fetchDraftTasks: () => void query.refetch(),
    refetchDrafts: () => void query.refetch(),
    error: query.error ? getErrorMessage(query.error) : null,
    // Added placeholders to match DraftTask.tsx consumer
    publishDraft: async (_id: string) => {
      console.warn('publishDraft not implemented');
    },
    deleteDraft: async (_id: string) => {
      console.warn('deleteDraft not implemented');
    },
  };
}

// Hook for fetching user's Active tasks from backend
export function useActiveTasks() {
  return api.task.getTasksByStatus.useQuery(
    {
      status: 'ACTIVE',
    },
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );
}

export function useCompletedTasks() {
  const query = api.task.getTasksByStatus.useQuery(
    {
      status: 'COMPLETED',
    },
    {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 2,
    },
  );

  return {
    ...query,
    completedTasks: query.data?.data ?? [],
    fetchCompletedTasks: () => void query.refetch(),
    refetchCompletedTasks: () => void query.refetch(),
    error: query.error ? getErrorMessage(query.error) : null,
  };
}

// hook for fetching role base
export function useGetRoleBase() {
  return api.auth.getSessionStatus.useQuery();
}
