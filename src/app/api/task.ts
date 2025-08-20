import { api } from '~/hooks/queryClient';

export function useRecommendedTasks() {
  return api.task.getRecommendedTasks.useMutation();
}

export function useCreateTask() {
  return api.task.createTask.useMutation();
}

export function getTasks() {
  return api?.task?.getActiveTasks?.useQuery();
}
export const getTaskById = (taskId: string) => {
  return api.task.getTaskById.useQuery({ taskId });
};

export const createTask = () => {
  return api?.task?.createTask?.useMutation();
};

export const getAllTask = () => {
  return api?.task?.findTasks.useMutation();
};
