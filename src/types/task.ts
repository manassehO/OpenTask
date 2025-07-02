export type TaskStatus = "active" | "completed" | "disputed" | "cancelled";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  image: string;
  deadline: string;
  rewardInEth: number;
  rewardInUsd: number;
  isFlagged?: boolean;
  creator?: string;
  category: string;
}

export interface TaskCardProps {
  task: Task;
  onAction: (taskId: string) => void;
}
