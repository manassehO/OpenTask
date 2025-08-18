import { api } from '~/hooks/queryClient';

export const getTaskById = (taskId: string) => {
  return api.task.getTaskById.useQuery({ taskId });
};

export const createTask = () => {
  return api?.task?.createTask?.useMutation();
};

export const getAllTask = () => {
  return api?.task?.findTasks.useMutation();
};
