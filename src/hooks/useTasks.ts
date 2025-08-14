import { api } from './queryClient';
import { useToast } from '~/hooks/useToast';
import type {
  FindTasksInput,
  FindTasksOutput,
  ClaimTaskInput,
  ClaimTaskOutput,
} from '~/types/api';

// Mutation hook for finding tasks with filters
export function useFindTasks() {
  const { showSuccess, showError, showLoading } = useToast();

  return api.task.findTasks.useMutation({
    onMutate: () => {
      return showLoading('Loading Tasks', 'Searching for tasks...');
    },
    onSuccess: (data, variables, context) => {
      const loadingId = context;
      showSuccess(
        'Tasks Loaded',
        `Found ${data.tasks.length} task${data.tasks.length !== 1 ? 's' : ''}`,
      );
    },
    onError: (error, variables, context) => {
      const loadingId = context;
      showError(
        'Failed to Load Tasks',
        error.message || 'Something went wrong while loading tasks',
      );
    },
  });
}

// Mutation hook for claiming a task
export function useClaimTask() {
  const { showSuccess, showError, showLoading, removeToast } = useToast();

  return api.task.claimTask.useMutation({
    onMutate: (variables) => {
      return showLoading('Claiming Task', 'Processing your request...');
    },
    onSuccess: (data, variables, context) => {
      const loadingId = context;
      removeToast(loadingId);

      showSuccess(
        'Task Claimed Successfully!',
        data.message || 'You can now start working on this task',
      );
    },
    onError: (error, variables, context) => {
      const loadingId = context;
      if (loadingId) {
        removeToast(loadingId);
      }

      showError(
        'Failed to Claim Task',
        error.message || 'Unable to claim this task. Please try again.',
      );
    },
  });
}
// export function useCancelTask() {
//   const { showSuccess, showError, showLoading, removeToast } = useToast();

//   return api.task.cancelTask.useMutation({
//     onMutate: (variables) => {
//       return showLoading('Canceling Task', 'Processing your cancellation...');
//     },
//     onSuccess: (data, variables, context) => {
//       const loadingId = context as string;
//       removeToast(loadingId);

//       showSuccess(
//         'Task Canceled Successfully!',
//         data.message || 'You have successfully canceled this task'
//       );
//     },
//     onError: (error, variables, context) => {
//       const loadingId = context as string;
//       removeToast(loadingId);

//       showError(
//         'Failed to Cancel Task',
//         error.message || 'Unable to cancel this task. Please try again.'
//       );
//     },
//   });
// }
