/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useTaskStore } from '~/store';
import { api } from '~/trpc/react';
// Helper function to safely extract error message
function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return typeof error.message === 'string'
      ? error.message
      : 'An error occurred';
  }
  if (error && typeof error === 'object' && 'shape' in error) {
    const shape = (error as { shape?: { message?: string } }).shape;
    return shape?.message ?? 'An error occurred';
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

// Helper function to safely handle context (loading ID)

// Mutation hook for creating a task
export function useCreateTask() {
  const store = useTaskStore();
  const { resetStep, resetForm } = store;
  return api.task.createTask.useMutation({
    onMutate(_variables) {
      return toast.loading('Creating Task...');
    },
    onSuccess(data, _variables, _context) {
      toast.success(`Task ${data.task?.title} created successfully!`);
      resetForm();
      resetStep(0);
    },
    onError(error, _variables, _context) {
      toast.error(`Failed to create Task: ${getErrorMessage(error)}`);
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
  return api.task.claimTask.useMutation({
    onMutate: (_variables) => {
      return toast.loading('Claiming Task...');
    },
    onSuccess: (data, _variables, _context) => {
      toast.success(data.message || 'Task claimed successfully!');
    },
    onError: (error, _variables, _context) => {
      toast.error(`Failed to claim Task: ${getErrorMessage(error)}`);
    },
  });
}

// Mutation hook for canceling a task
export function useCancelTask() {
  return api.task.cancelTask.useMutation({
    onMutate: (_variables) => {
      return toast.loading('Canceling task...');
    },
    onSuccess: (_data, _variables, _context) => {
      toast.success('Task canceled successfully!');
    },
    onError: (error, _variables, _context) => {
      toast.error(`Failed to cancel Task: ${getErrorMessage(error)}`);
    },
  });
}

// Mutation hook for submitting a task
export function useSubmitTask() {
  return api.task.submitTask.useMutation({
    onMutate: (_variables) => {
      return toast.loading('Submitting Task...');
    },
    onSuccess: (data, _variables, _context) => {
      toast.success(data.message || `Submission ID: ${data.submissionId}`);
    },
    onError: (error, _variables, _context) => {
      toast.error(`Failed to Submit Task: ${getErrorMessage(error)}`);
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
