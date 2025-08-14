// In your test page:
import ClaimTaskTest from '~/_components/tasks/ClaimTaskTest';
import TaskListContainer from '~/_components/tasks/TaskListContainerTest';

export default function TestPage() {
  return (
    <div className="container mx-auto space-y-8 p-4">
      <TaskListContainer />
      <ClaimTaskTest />
    </div>
  );
}
