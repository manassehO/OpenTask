import { mockTasks } from '~/mocks/tasks';
import TaskCard from './TaskCard';
import { useRouter } from 'next/navigation';
import { getTaskById } from '~/app/api/task';

export default function ActiveTask() {
  const router = useRouter();

  const onClick = (taskId: string) => {
    router.push(`/task/${taskId}`);
  };

  const { data, isLoading, error } = getTaskById(
    'e146ae52-0d8e-4760-b5d8-3d5b38b412d4',
  );
  console.log(data);
  console.log(error);
  console.log(isLoading);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {mockTasks.slice(0, 3).map((task) => (
        <TaskCard key={task.id} task={task} onAction={onClick} />
      ))}
    </div>
  );
}
