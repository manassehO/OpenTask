'use client';
import React from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import { useCreateTask, useRecommendedTasks } from '~/app/api/task';
import Link from 'next/link';
import { useRecommendedTasksStore } from '~/app/store/recommendedTaskStore';
import { CustomPagination } from '../custom/CustomPagination';

const RecomendedTasks = () => {
  const { data, isLoading } = useRecommendedTasks();
  const { nextPage, prevPage, offset, limit } = useRecommendedTasksStore();

  const recommendedTasks = data?.data ?? [];
  console.log('rec', recommendedTasks);

  const createTask = useCreateTask();

  const handleCreateTask = async () => {
    try {
      const dummyTask = {
        title: 'Share our new product on Twitter',
        description:
          'Help spread the word about our product by tweeting about it.',
        instructions:
          '1. Write a tweet about our product.\n2. Include the hashtag #MyProduct.\n3. Share a screenshot as proof.',
        category: 'Social Media',
        maxCompletions: 100,
        rewardAmount: '10',
        rewardTokenAddress: '0x1234567890abcdef1234567890abcdef12345678',
        requiredCompletions: 50,
        deadline: '2025-12-31T23:59:59Z',
        status: 'ACTIVE' as const,
        fundingTxHash:
          '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        tags: ['twitter', 'marketing', 'awareness'],
        platformFee: '5',
        image:
          'https://plus.unsplash.com/premium_photo-1682436362503-c2097e4ddb9b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fHw%3D',
        example: 'https://twitter.com/example/status/1234567890',
        specialRequirements: 'Must have at least 100 followers on Twitter.',
      };

      const res = await createTask.mutateAsync(dummyTask);
      if (res.success) {
        alert('Task created successfully!');
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div>
      <div className="flex w-full items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold lg:text-2xl">
          Recommended For You
        </h1>

        <Button
          backgroundColor="transparent"
          textColor="text-[#3B82F6]"
          className="mt-2 text-[#3B82F6]"
          onClick={handleCreateTask}
        >
          Create Task
        </Button>
        <Button
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
