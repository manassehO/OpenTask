'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecommendedTasks } from '~/app/api/task';
import { useRecommendedTasksStore } from '~/app/store/recommendedTaskStore';
import { useSession } from '~/lib/auth-client';
import { getKeyByValue } from '~/lib/fns';
import { UserType } from '~/lib/utils';
import { CustomPagination } from '../custom/CustomPagination';
import Button from '../ui/button';

const RecomendedTasks = () => {
  const { data, isLoading } = useRecommendedTasks();
  const { data: session } = useSession();
  const { nextPage, prevPage, offset, limit } = useRecommendedTasksStore();
  const router = useRouter();
  const recommendedTasks = data?.data ?? [];
  const rootRoute = getKeyByValue(UserType, session?.user?.role ?? '');
  return (
    <div>
      <div className="flex w-full items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold lg:text-2xl">
          Recommended For You
        </h1>

        <Button
          onClick={() => router.push('tasks')}
          backgroundColor="transparent"
          textColor="text-[#3B82F6]"
          className="mt-2 text-[#3B82F6]"
        >
          See All Tasks
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <TaskSkeleton count={6} />
        ) : (
          recommendedTasks.map((task, index) => (
            <div
              key={index}
              className="flex flex-col gap-2 rounded-lg bg-white p-1"
            >
              <Image
                src={task.image ?? ''}
                alt={task.title}
                width={300}
                height={200}
                className="h-full w-full rounded-md object-cover"
              />
              <h1 className="text-lg font-semibold">{task.title}</h1>
              <p className="line-clamp-2 text-sm text-gray-500">
                {task.description}
              </p>
              <div className="flex justify-between">
                <p className="text-gray-500">Deadline</p>
                <p className="text-sm text-black">{`${task.platformFee} ETH`}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-black">
                  {new Date(
                    task.deadline as unknown as string,
                  ).toLocaleDateString()}
                </p>
                <p className="text-sm font-bold text-[#3B82F6]">
                  {`$${task.rewardAmount}`}
                </p>
              </div>
              <Link href={`/${rootRoute}/tasks/${task.id}`}>
                <Button className="mt-2 w-full text-[#3B82F6]">
                  View Task
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
      {recommendedTasks.length > 0 && (
        <div className="my-8">
          <CustomPagination
            offset={offset}
            limit={limit}
            totalRecords={data?.totalRecords ?? 0}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </div>
      )}
    </div>
  );
};

export default RecomendedTasks;

export const TaskSkeleton = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse flex-col gap-2 rounded-lg bg-white p-1"
        >
          <div className="h-[200px] w-full rounded-md bg-gray-200" />

          <div className="h-5 w-3/4 rounded bg-gray-200" />

          <div className="space-y-1">
            <div className="h-4 w-full rounded bg-gray-200" />
            <div className="h-4 w-5/6 rounded bg-gray-200" />
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-16 rounded bg-gray-200" />
            <div className="h-4 w-12 rounded bg-gray-200" />
          </div>

          <div className="flex justify-between">
            <div className="h-4 w-20 rounded bg-gray-200" />
            <div className="h-4 w-14 rounded bg-gray-200" />
          </div>

          <div className="mt-2 h-8 w-full rounded bg-gray-200" />
        </div>
      ))}
    </>
  );
};
