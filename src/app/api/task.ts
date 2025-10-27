import { api } from '~/hooks/queryClient';

interface UseRecommendedTasksProps {
  limit: number;
  offset: number;
}

export function useRecommendedTasks({
  limit,
  offset,
}: UseRecommendedTasksProps) {
  return api.task.getRecommendedTasks.useQuery({ limit, offset });
}

export function useCreateTask() {
  return api.task.createTask.useMutation();
}

export const createTask = () => {
  return api?.task?.createTask?.useMutation();
};
