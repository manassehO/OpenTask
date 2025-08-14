import { mockTasks } from '~/mocks/tasks';
import TaskCard from './TaskCard';
import { useRouter } from 'next/navigation';
import { useFindTasks } from '~/hooks/useTasks';

export default function ActiveTask() {
  const router = useRouter();

  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockTasks.slice(0, 3).map((task) => (
        <TaskCard key={task.id} task={task} onAction={onClick} />
      ))}
    </div>
  );
}
