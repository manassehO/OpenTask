import { api } from '~/hooks/queryClient';

export function useRecommendedTasks() {
  return api.task.getRecommendedTasks.useMutation();
}

export function useCreateTask() {
  return api.task.createTask.useMutation();
}

export function getTasks() {
  return api.task.getActiveTasks.useQuery();
}
