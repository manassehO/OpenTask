import Image from 'next/image';
import { useFindTasks } from '~/hooks/useTasks';

type Task = {
  id: string;
  title: string;
  status: 'Active task' | 'Draft task' | 'Completed task';
  type:
    | 'testing'
    | 'survey'
    | 'pending'
    | 'review'
    | 'draft'
    | 'research'
    | 'completed';
  progress: number;
  submissions: number;
  eth: string;
  deadline: string;
  substatus: 'testing' | 'survey';
};

type Props = {
  task: Task;
};

export default function TaskCard({ task }: Props) {
  // top button
  const renderTopButtons = () => {
    //  Active top button
    if (task.status === 'Active task') {
      const typeLabel =
        task.type === 'testing'
          ? 'Testing'
          : task.type === 'survey'
            ? 'Survey'
            : 'Unknown';

      return (
        <div className="flex gap-2">
          {/* Type Label */}
          <button className="w-[112px] rounded-full border border-neutral-300 py-1 text-sm capitalize text-neutral-700">
            {typeLabel}
          </button>

          {/* Conditional Status Button */}
          {task.type === 'testing' && (
            <button className="w-[112px] rounded-full border border-yellow-400 bg-yellow-50 py-1 text-sm text-yellow-600">
              Pending
            </button>
          )}

          {task.type === 'survey' && (
            <button className="w-[112px] rounded-full border border-green-400 bg-green-100 py-1 text-sm text-green-700">
              Active
            </button>
          )}
        </div>
      );
    }

    //   draft top button
    if (task.status === 'Draft task') {
      const typeLabel =
        task.type === 'research'
          ? 'Research'
          : task.type === 'review'
            ? 'Review'
            : 'Draft';

      return (
        <div className="flex gap-2">
          <button className="w-[112px] rounded-full border border-neutral-300 py-1 text-sm text-neutral-700">
            {typeLabel}
          </button>
          <button className="w-[112px] rounded-full border border-warning-400 bg-warning-50 py-1 text-sm text-warning-400">
            Draft
          </button>
        </div>
      );
    }

    //   completed top button
    if (task.status === 'Completed task') {
      const typeLabel =
        task.type === 'testing'
          ? 'Testing'
          : task.type === 'review'
            ? 'Completed'
            : 'Review';

      return (
        <div className="flex gap-2">
          <button className="w-[112px] rounded-full border border-neutral-300 py-1 text-sm text-neutral-700">
            {typeLabel}
          </button>
          <button className="w-[112px] rounded-full border border-green-400 bg-green-100 py-1 text-sm text-green-700">
            Completed
          </button>
        </div>
      );
    }
  };

  // bottom button for the card
  const renderBottomButtons = () => {
    if (task.status === 'Draft task') {
      return (
        <div className="flex flex-col gap-2 py-4 md:flex-row">
          <button className="w-full rounded border border-primary py-2.5 text-sm font-bold text-primary transition">
            Edit
          </button>
          <button className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white transition">
            Publish
          </button>
        </div>
      );
    }

    if (task.status === 'Completed task') {
      return (
        <div className="flex flex-col gap-2 py-4 md:flex-row">
          <button className="w-full rounded border border-primary py-2.5 text-sm font-bold text-primary transition">
            Export Report
          </button>
          <button className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white transition">
            View Details
          </button>
        </div>
      );
    }

    return (
      <div className="py-4">
        <button className="w-full rounded bg-primary py-2.5 text-sm font-bold text-white transition">
          View Details
        </button>
      </div>
    );
  };

  return (
    <div className="h-full w-full space-y-4 rounded-lg border bg-white p-4 shadow md:w-[578px]">
      {/* Top Buttons */}
      <div className="flex items-center justify-between pt-2">
        {renderTopButtons()}
      </div>

      {/* Task Info */}
      <div className="pt-4">
        <h2 className="text-sm font-semibold md:text-xl">{task.title}</h2>
        <div
          className={`flex py-2 font-medium text-neutral-900 ${
            task.status === 'Active task' || task.status === 'Completed task'
              ? 'justify-between text-xs md:text-sm'
              : 'gap-4'
          }`}
        >
          {(task.status === 'Active task' ||
            task.status === 'Completed task') && (
            <div className="flex items-center gap-1 text-xs md:text-sm">
              <Image
                src="/icons/submitIcon.svg"
                alt="submission icon"
                width={20}
                height={20}
              />
              <p className="flex gap-1 text-xs md:text-base">
                {task.submissions}
                <span className="hidden md:block">submissions</span>
              </p>
            </div>
          )}

          <div className="flex items-center gap-1 text-xs md:text-sm">
            <Image
              src="/icons/etheriumIcon.svg"
              alt="eth"
              width={20}
              height={20}
            />
            <p className="text-xs md:text-base">{task.eth}</p>
          </div>

          <div className="flex items-center gap-1">
            <Image
              src="/icons/timeLineIcon.svg"
              alt="deadline"
              width={20}
              height={20}
            />
            <p className="text-xs md:text-base">Ends: {task.deadline}</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {(task.status === 'Active task' || task.status === 'Completed task') &&
        task.progress !== undefined && (
          <div className="space-y-2 md:py-4">
            <div className="flex items-center justify-between py-3 font-medium">
              <h1 className="text-sm text-grey">Progress</h1>
              <h1 className="text-sm text-primary">{task.progress}%</h1>
            </div>
            <div className="h-2.5 w-full rounded-full bg-main-50">
              <div
                className="h-2.5 rounded-full bg-primary"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

      {/* Bottom Buttons */}
      {renderBottomButtons()}
    </div>
  );
}
