'use client';

import React, { useState } from 'react';
import type { Task } from '@/types/task';
import TaskCard from '@/app/_components/tasks/TaskCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';

// Mock data - Replace with actual data fetching
const mockTasks: Task[] = [ 
  {
    id: '1',
    title: 'Complete a short survey about Defi',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    status: 'completed', 
    deadline: 'Monday, 12th June, 2025',
    image: 'https://via.placeholder.com/150',
    rewardInEth: 0.005,
    rewardInUsd: 20000,
  },
  {
    id: '2',
    title: 'Complete a short survey about Defi',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    status: 'completed', 
    deadline: 'Monday, 12th June, 2025',
    image: 'https://via.placeholder.com/150',
    rewardInEth: 0.005,
    rewardInUsd: 20000,
  },
  {
    id: '3',
    title: 'Complete a short survey about Defi',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    status: 'active', 
    deadline: 'Monday, 12th June, 2025',
    image: 'https://via.placeholder.com/150',
    rewardInEth: 0.005,
    rewardInUsd: 20000,
  },
  {
    id: '4',
    title: 'Complete a short survey about Defi',
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.',
    status: 'active', 
    deadline: 'Monday, 12th June, 2025',
    image: 'https://via.placeholder.com/150',
    rewardInEth: 0.005,
    rewardInUsd: 20000,
  },
];

const TasksPage = () => {
  const router = useRouter();
  const [tasks] = useState<Task[]>(mockTasks);

  const handleTaskAction = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
  };

  const renderTaskList = (filteredTasks: Task[]) => {
    if (filteredTasks.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">No tasks available</h3>
          <p className="text-muted-foreground">Check back later for new tasks</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onAction={handleTaskAction}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Tasks</h1>
      
      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid bg-white rounded w-full grid-cols-3">
          <TabsTrigger value="all">Tasks</TabsTrigger>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderTaskList(tasks.filter(task => task.status === 'active'))}
        </TabsContent>

        <TabsContent value="all">
          <p className="text-black text-muted-foreground mb-4 font-bold">Recommended For You</p>
          {renderTaskList(tasks)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TasksPage;