import React from 'react';
import Image from 'next/image';
import Button from '../ui/button';
import { getTasks, useCreateTask, useRecommendedTasks } from '~/app/api/task';

interface RecommendedTask {
  taskImg: string;
  taskName: string;
  taskDescription: string;
  priceCrypto: string;
  priceUSD: string;
  taskLink: string;
  deadline: string;
}

const RecomendedTasks = () => {
  const { data } = getTasks();
  console.log('active task', data);

  const recommendedTasks = useRecommendedTasks();

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
      image: 'https://example.com/task-thumbnail.png',
      status: 'ACTIVE' as const,
      fundingTxHash:
        '0xabcdef123456789abcdef123456789abcdef123456789abcdef123456789abcd',
      maxCompletions: 20,
    };

    try {
      const res = await createTask.mutateAsync(payload);
      if (res.success) {
        alert('Created Successfully!');
      } else {
        alert('Something went wrong');
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  };

  const handleGet = async () => {
    try {
      const res = await recommendedTasks.mutateAsync({});
      console.log(res.tasks);
    } catch (error) {
      console.error(error);
    }
  };
  const task: RecommendedTask = {
    taskImg: '/task-img.png',
    taskName: 'Complete a short survey about defi',
    taskDescription:
      'Lorem ipsum dolor sit amet consectetur. Ultricies ultricies mauris morbi aenean pellentesque',
    priceCrypto: '0.05 ETH',
    priceUSD: '$100',
    taskLink: '#',
    deadline: 'Mon, 12th Oct, 2025',
  };
  const tasks: RecommendedTask[] = Array(8).fill(task) as RecommendedTask[];
  return (
    <div>
      <div className="flex w-full items-center justify-between px-4 py-2">
        <h1 className="text-lg font-semibold lg:text-2xl">
          Recommended For You
        </h1>
        <Button
          onClick={handleGet}
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

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task, index) => (
          <div
            key={index}
            className="flex flex-col gap-2 space-y-2 rounded-lg bg-white p-1"
          >
            <Image
              src={task.taskImg}
              alt={task.taskName}
              width={300}
              height={200}
              className="h-full w-full object-cover"
            />

            <h1 className="text-lg font-semibold">{task.taskName}</h1>
            <p className="text-sm text-gray-500">
              {task.taskDescription.slice(0, 70)}...
            </p>
            <div className="flex justify-between">
              <p className="text-gray-500">Deadline</p>
              <p className="text-sm text-black">{task.priceCrypto}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm text-black">{task.deadline}</p>
              <p className="text-sm font-bold text-[#3B82F6]">
                {task.priceUSD}
              </p>
            </div>
            {/* <p className='text-sm text-gray-500'>{task.taskStatus}</p> */}
            <Button className="mt-2 text-[#3B82F6]">View Task</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecomendedTasks;
