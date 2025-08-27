import { api } from '~/hooks/queryClient';
import { useRecommendedTasksStore } from '../store/recommendedTaskStore';

export function useRecommendedTasks() {
  const { limit, offset } = useRecommendedTasksStore();

  const query = api.task.getRecommendedTasks.useQuery({ limit, offset });

  return query;
}

export function useCreateTask() {
  return api.task.createTask.useMutation();
}

export const createTask = () => {
  return api?.task?.createTask?.useMutation();
};
