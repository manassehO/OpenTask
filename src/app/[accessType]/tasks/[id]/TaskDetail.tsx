'use client';

import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import CancelTaskModal from '~/_components/tasks/CancelTaskModal';
import TaskSubmissionModal from '~/_components/tasks/TaskSubmissionModal';
import Button from '~/_components/ui/button';
import {
  useClaimTask,
  useGetRoleBase,
  useGetTaskById,
  useTaskActions,
} from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
interface TaskDetailProps {
  taskId: string;
}

export default function TaskDetail({ taskId }: TaskDetailProps) {
  const router = useRouter();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { data: task, isLoading, error, refetch } = useGetTaskById(taskId);
  const { isTaskClaimed, markTaskAsClaimed } = useTaskActions();
  const { data: role, isLoading: loadingRole } = useGetRoleBase();
  const steps = task?.instructions?.split(/\d+\.\s*/).filter(Boolean);
  const claimMutation = useClaimTask();
  const { toasts } = useToast();

  const claimed = task ? isTaskClaimed(taskId) : false;

  const handleTakeTask = useCallback(() => {
    if (!task) return;
    claimMutation.mutate(
      { taskId },
      {
        onSuccess: () => markTaskAsClaimed(taskId),
      },
    );
  }, [task, taskId, claimMutation, markTaskAsClaimed]);

  const handleSubmitTask = () => setShowSubmitModal(true);

  const BackButton = () => (
    <button
      onClick={() => router.back()}
      className="mb-6 flex items-center gap-2 text-blue-500 hover:text-blue-600"
    >
      <ArrowLeft className="h-4 w-4" /> Back
    </button>
  );

  if (isLoading && loadingRole) {
    return (
      <>
        <div className="mx-auto max-w-4xl py-8">
          <BackButton />
          <div className="space-y-6">
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-64 w-full animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="mx-auto max-w-4xl py-8">
          <BackButton />
          <div className="rounded-lg border border-red-300 bg-red-50 p-8 text-center">
            <h1 className="mb-4 text-2xl font-bold text-red-800">
              Task Not Found
            </h1>
            <p className="mb-6 text-red-600">
              {error
                ? 'Failed to load task details.'
                : "The task you're looking for doesn't exist."}
            </p>
            <div className="space-x-4">
              <button
                onClick={() => router.push('/tasks')}
                className="rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
              >
                Browse Tasks
              </button>
              <button
                onClick={() => refetch()}
                className="rounded bg-gray-500 px-6 py-2 text-white hover:bg-gray-600"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
        {toast.success(toasts.map((toast) => toast.message).join('\n'))}
      </>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl py-8">
        <BackButton />
        <h1 className="p-6 pb-0 text-4xl font-bold capitalize">
          {task?.title}
        </h1>

        <div className="relative mt-6 h-[300px] w-full max-w-6xl md:h-[500px]">
          <Image
            src={'/images/banner.webp'}
            alt={task?.title ?? 'Task Banner'}
            fill
            className="object-cover opacity-70"
          />
        </div>

        <div className="grid max-w-6xl grid-cols-1 gap-y-8 p-6">
          {/* Sections like Description, Instructions, Reward, Deadline */}
          {/* ... */}
          <div className="grid w-full max-w-6xl grid-cols-1 gap-y-8 p-6">
            <div className="rounded-md bg-white p-6">
              <h2 className="mb-3 text-xl font-bold">Description</h2>
              <p className="mb-6 text-[#414141]">{task?.description}</p>
              <div className="flex items-center gap-4 rounded-lg p-4">
                <Image
                  src="/icons/spot.svg"
                  alt="Task icon"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px] object-cover"
                />
              </div>
              <div>
                <span className="text-sm font-semibold">Task Spots Left</span>
                <p className="font-bold">99 spots left of 100</p>
              </div>
            </div>
          </div>

          <div className="max-w-6xl rounded-md bg-white p-6">
            <h2 className="mb-3 text-xl font-bold">Instructions</h2>{' '}
            <ul className="mb-6 list-disc space-y-4 pl-6 marker:text-[#414141]">
              {steps?.map((step, index) => (
                <li key={index} className="pl-2 font-semibold">
                  {step}
                </li>
              ))}
            </ul>
          </div>

          <div className="max-w-6xl rounded-md bg-white p-2">
            <h2 className="mb-3 text-xl font-bold">Reward & Deadline</h2>{' '}
            <p className="mb-4 leading-[32px] text-[#414141]">
              Lorem ipsum dolor sit amet consectetur. Dolor justo diam amet
              tincidunt ut nunc, dictum non fermentum proin sed etiam. Ipsum
              turpis neque eros quisque aliquot vulputate sed venenatis lectus,
              malesuada in aliquam interdum pellentesque.{' '}
            </p>
            <div className="mb-8 flex flex-wrap gap-8">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/calendar.svg"
                  alt="Task icon"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px]"
                />{' '}
                <div>
                  {' '}
                  <div className="text-sm font-semibold">DEADLINE</div>{' '}
                  <div className="text-xl font-bold">
                    {task?.deadline?.toDateString()}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
              <div className="flex items-center gap-2">
                {' '}
                <Image
                  src="/icons/diamond.svg"
                  alt="Task icon"
                  width={60}
                  height={60}
                  className="h-[60px] w-[60px]"
                />
                <div>
                  {' '}
                  <div className="text-sm font-semibold">PRICE</div>{' '}
                  <div className="text-xl font-bold">
                    $ {task?.rewardAmount}
                  </div>{' '}
                </div>{' '}
              </div>{' '}
            </div>{' '}
          </div>

          {/* Actions */}
          {role?.user?.role === 'COMPLETER' && (
            <div className="space-y-3">
              {!claimed && task?.status === 'ACTIVE' && (
                <div className="flex w-full items-end justify-end gap-4">
                  <Button
                    onClick={handleTakeTask}
                    disabled={claimMutation.isPending}
                    className="h-12 min-w-[13.8rem] rounded bg-[#3B82F6] p-[10px] text-sm font-bold text-white hover:bg-[#3B82F6]/90 disabled:opacity-50"
                  >
                    {claimMutation.isPending ? 'Taking Task...' : 'Take Task'}
                  </Button>
                </div>
              )}
              {claimed && task?.status === 'ACTIVE' && (
                <div className="flex w-full items-center justify-between gap-4">
                  {/* <Button
                    onClick={() => setShowCancelModal(true)}
                    className="hover:bg-[#ffffff]/98 h-12 w-full bg-white text-lg !text-[#ed1004] hover:!text-[#ed1004]/90"
                  >
                    Cancel Task
                  </Button> */}
                  <Button
                    onClick={handleSubmitTask}
                    className="hover:[#3B82F6]/99 h-12 w-full bg-[#3B82F6] text-lg"
                  >
                    Submit Task
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <TaskSubmissionModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        taskId={taskId}
        taskTitle={task?.title}
      />
      <CancelTaskModal
        taskId={taskId}
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        setIsOpen={setShowCancelModal}
      />

      {toast.success(toasts.map((toast) => toast.message).join('\n'))}
    </>
  );
}
