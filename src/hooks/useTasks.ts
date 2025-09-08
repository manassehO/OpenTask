/* eslint-disable @typescript-eslint/no-explicit-any */
import { api } from '~/trpc/react';
import { useToast } from '~/hooks/useToast';
import { useEffect, useState } from 'react';
import { useToastContext } from '~/store/ToastProvider';
import { useTaskStore } from '~/store';


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
    const {
    resetStep,
    resetForm,
  } = store;
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
      resetForm()
      resetStep(0)
    },
    onError(error, _variables, context) {
      if (context) removeToast(context);
      showError('Failed to create Task', getErrorMessage(error));
    },
  });
}
// Mutation hook for finding tasks with filters
export function useFindTasks() {
  const { showSuccess, showError, showLoading, removeToast } = useToast();

  return api.task.findTasks.useMutation({
    onMutate: () => {
      return showLoading('Loading Tasks', 'Searching for tasks...');
    },
    onSuccess: (data, _variables, context) => {
      if (context) removeToast(context);
      showSuccess(
        'Tasks Loaded',
        `Found ${data.tasks.length} task${data.tasks.length !== 1 ? 's' : ''}`,
      );
    },
    onError: (error, _variables, context) => {
      if (context) removeToast(context); // if you store loadingId in context
      showError('Failed to Load Tasks', getErrorMessage(error));
    },
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
  const [isLoading, setIsLoading] = useState(false);
  const [draftTasks, setDraftTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showInfo, showSuccess } = useToast();
  const findTasksMutation = useFindTasks();
  // Fetch draft tasks from backend
  const fetchDraftTasks = () => {
    setIsLoading(true);
    setError(null);
    console.log('hello world');

    // Fetch tasks with DRAFT status for current user
    const filters = {
      limit: 50, // Get more drafts
      page: 1,
      order: 'desc' as const,
    };

    findTasksMutation.mutate(filters);
  };

  // Handle API response
  useEffect(() => {
    if (findTasksMutation.data?.success) {
      // Filter for draft tasks (status === 'DRAFT')
      console.log(findTasksMutation.data.tasks);

      const drafts = findTasksMutation.data.tasks.filter(
        (task) => task.status === 'DRAFT',
      );
      setDraftTasks(drafts);
      setIsLoading(false);
    }
  }, [findTasksMutation.data]);

  // Handle API errors
  useEffect(() => {
    if (findTasksMutation.error) {
      setError(getErrorMessage(findTasksMutation.error));
      setIsLoading(false);
    }
  }, [findTasksMutation.error]);

  // Handle loading state
  useEffect(() => {
    if (findTasksMutation.isPending) {
      setIsLoading(true);
    }
  }, [findTasksMutation.isPending]);

  const refetchDrafts = () => {
    fetchDraftTasks();
  };

  const publishDraft = async (taskId: string) => {
    try {
      showInfo('Publishing Task', 'Your task is being published...');
      // Here you would call the actual publish API
      // await api.task.publishTask.mutate({ taskId });

      // For now, simulate success and refetch
      setTimeout(() => {
        showSuccess(
          'Task Published',
          'Your task is now live and available to users!',
        );
        refetchDrafts(); // Refresh the draft list
      }, 2000);
    } catch (error) {
      console.error('Failed to publish task:', error);
    }
  };

  const deleteDraft = async (taskId: string) => {
    try {
      showInfo('Deleting Draft', 'Draft task is being deleted...');
      // Here you would call the actual delete API
      // await api.task.deleteTask.mutate({ taskId });

      // For now, simulate success and refetch
      setTimeout(() => {
        showSuccess('Draft Deleted', 'Draft task has been permanently deleted');
        refetchDrafts(); // Refresh the draft list
      }, 1000);
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  };

  return {
    draftTasks,
    isLoading,
    error,
    fetchDraftTasks,
    refetchDrafts,
    publishDraft,
    deleteDraft,
  };
}

// Hook for fetching user's completed tasks from backend (for task USERS)
export function useCompletedTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { showInfo } = useToast();
  const findTasksMutation = useFindTasks();

  // Fetch completed tasks from backend
  const fetchCompletedTasks = () => {
    setIsLoading(true);
    setError(null);

    // Fetch tasks that the current user has completed
    // Note: This would ideally be a separate API endpoint like getUserCompletedTasks
    // For now, we'll use findTasks and filter (you might need to modify the API)
    const filters = {
      limit: 100, // Get more completed tasks
      page: 1,
      sort_by: 'created_at' as const,
      order: 'desc' as const,
    };

    findTasksMutation.mutate(filters);
  };

  // Handle API response
  useEffect(() => {
    if (findTasksMutation.data?.success) {
      // For now, we'll simulate by filtering some tasks
      // This would be replaced with actual user completion data from backend
      const completed = findTasksMutation.data.tasks.filter((task, index) => {
        // Simulate some tasks being completed (this is just for demo)
        // In real implementation, the API would return actual user completions
        return false;
      });
      setCompletedTasks(completed);
      setIsLoading(false);
    }
  }, [findTasksMutation.data]);

  // Handle API errors
  useEffect(() => {
    if (findTasksMutation.error) {
      setError(getErrorMessage(findTasksMutation.error));
      setIsLoading(false);
    }
  }, [findTasksMutation.error]);

  // Handle loading state
  useEffect(() => {
    if (findTasksMutation.isPending) {
      setIsLoading(true);
    }
  }, [findTasksMutation.isPending]);

  const refetchCompletedTasks = () => {
    fetchCompletedTasks();
  };

  const markTaskAsCompleted = async (taskId: string) => {
    try {
      showInfo('Marking as Completed', 'Updating your completion record...');
      // Here you would call the actual completion API
      // await api.task.markCompleted.mutate({ taskId });

      // For now, simulate success and refetch
      setTimeout(() => {
        showInfo(
          'Task Marked Complete',
          'Task added to your completion record',
        );
        refetchCompletedTasks(); // Refresh the completed list
      }, 1000);
    } catch (error) {
      console.error('Failed to mark task as completed:', error);
    }
  };

  return {
    completedTasks,
    isLoading,
    error,
    fetchCompletedTasks,
    refetchCompletedTasks,
    markTaskAsCompleted,
    // Note: No remove functions - completed tasks are permanent backend records
  };
}

// Hook for fetching user's Active tasks from backend
export function useActiveTasks() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const findTasksMutation = useFindTasks();

  // Fetch draft tasks from backend
  const fetchActiveTasks = () => {
    setIsLoading(true);
    setError(null);

    // Fetch tasks with DRAFT status for current user
    const filters = {
      limit: 50, // Get more drafts
      page: 1,
      order: 'desc' as const,
    };

    findTasksMutation.mutate(filters);
  };

  // Handle API response
  useEffect(() => {
    if (findTasksMutation.data?.success) {
      // Filter for draft tasks (status === 'DRAFT')

      const active = findTasksMutation.data.tasks.filter(
        (task) => task.status === 'ACTIVE',
      );
      setActiveTasks(active);
      setIsLoading(false);
    }
  }, [findTasksMutation.data]);

  // Handle API errors
  useEffect(() => {
    if (findTasksMutation.error) {
      setError(getErrorMessage(findTasksMutation.error));
      setIsLoading(false);
    }
  }, [findTasksMutation.error]);

  // Handle loading state
  useEffect(() => {
    if (findTasksMutation.isPending) {
      setIsLoading(true);
    }
  }, [findTasksMutation.isPending]);

  const refetchActiveTask = () => {
    fetchActiveTasks();
  };

  return {
    activeTasks,
    isLoading,
    error,
    fetchActiveTasks,
    refetchActiveTask,
  };
}

// hook for fetching role base
export function useGetRoleBase() {
  return api.auth.getSessionStatus.useQuery();
}
