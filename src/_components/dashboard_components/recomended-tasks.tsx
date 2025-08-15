'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import { useCreateTask, useRecommendedTasks } from '~/app/api/task';
import { useRouter } from 'next/navigation';
import type { RecommendedTask } from '~/types/task';
import Link from 'next/link';

const RecomendedTasks = () => {
  const [recommendedTasks, setRecommendedTasks] = useState<RecommendedTask[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const getRecommendedTasks = useRecommendedTasks();
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const res = await getRecommendedTasks.mutateAsync({});
        if (res.success && res.tasks) {
          setRecommendedTasks(res.tasks);
        } else {
          throw new Error('Failed to fetch recommended tasks');
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    }
    void fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log('recommended', recommendedTasks);

  const createTask = useCreateTask();

  const handleCreate = async () => {
    const payload = {
      title: 'Translate a YouTube video',
      description: 'Translate a tech video from English to Spanish',
      instructions:
        'Use accurate technical terms. Submit a subtitle file in .srt format.',
      category: 'Translation',
      rewardAmount: '50',
      rewardTokenAddress: '0x123456789abcdef123456789abcdef123456789a',
      platformFee: '5',
      approvedCompletions: 0,
      inProgressCompletions: 0,
      requiredCompletions: 10,
      deadline: '2025-09-01T23:59:59Z',
      image:
        'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHRhc2t8ZW58MHx8MHx8fDA%3D',
      status: 'ACTIVE' as const,
      fundingTxHash:
        '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd',
      maxCompletions: 20,
    };

    try {
      const res = await createTask.mutateAsync(payload);
      if (res.success) {
        alert('Created Successfully!');
        router.refresh();
      } else {
        console.error('Something went wrong');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  return (
    <div>
      {!isLoading && (
        <div className="flex w-full items-center justify-between px-4 py-2">
          <h1 className="text-lg font-semibold lg:text-2xl">
            Recommended For You
          </h1>
          <div className="flex gap-2">
            <Button
              backgroundColor="transparent"
              textColor="text-[#3B82F6]"
              className="mt-2 text-[#3B82F6]"
            >
              See All Tasks
            </Button>
            <Button
              onClick={handleCreate}
              backgroundColor="transparent"
              textColor="text-[#3B82F6]"
              className="mt-2 text-[#3B82F6]"
            >
              Create Tasks
            </Button>
          </div>
        </div>
      )}

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
                  {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="text-sm font-bold text-[#3B82F6]">
                  {`$${task.rewardAmount}`}
                </p>
              </div>
              <Link href={`/task/${task.id}`}>
                <Button className="mt-2 w-full text-[#3B82F6]">
                  View Task
                </Button>
              </Link>
            </div>
          ))
        )}
      </div>
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
