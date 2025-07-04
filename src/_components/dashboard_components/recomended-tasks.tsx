import React from 'react';
import Image from 'next/image';
import Button from '../ui/button';

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
          backgroundColor="transparent"
          textColor="text-[#3B82F6]"
          className="mt-2 text-[#3B82F6]"
        >
          See All Tasks
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
