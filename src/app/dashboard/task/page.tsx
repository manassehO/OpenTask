'use client';

import React, { useState, useEffect } from 'react';
import type { Task } from '@/types/task';
import TaskCard from '@/app/_components/tasks/TaskCard';
import TaskCardSkeleton from '@/app/_components/tasks/TaskCardSkeleton';
import TaskFilterTabs, { type TaskFilterTab } from '@/app/_components/tasks/TaskFilterTabs';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter } from 'next/navigation';
import { mockTasks } from '@/mocks/tasks';

const filterTabs: TaskFilterTab[] = [
  { id: "all", label: "All Tasks", active: true },
  { id: "defi", label: "De-Fi", active: false },
  { id: "testing", label: "User Testing", active: false },
];

const TasksPage = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilterTab, setActiveFilterTab] = useState("all");

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadTasks();
  }, []);

  const handleTaskAction = (taskId: string) => {
    router.push(`/dashboard/task/${taskId}`);
  };

  const filteredTasks = tasks.filter(task => 
    activeFilterTab === "all" ? true : task.category === activeFilterTab
  );

  const renderTaskList = (tasksToRender: Task[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <TaskCardSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (tasksToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h3 className="text-lg font-semibold">No tasks available</h3>
          <p className="text-muted-foreground">Check back later for new tasks</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasksToRender.map((task) => (
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
      {/* First Section - Original Two-Tab System */}
      <h1 className="text-3xl font-bold mb-4">Tasks</h1>
      <Tabs defaultValue="all" className=" mx-auto">
        <TabsList className="grid bg-white rounded grid-cols-2">
          <TabsTrigger value="all">Tasks</TabsTrigger>
          <TabsTrigger value="active">Active Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {renderTaskList(tasks.filter(task => task.status === 'active'))}
        </TabsContent>

        <TabsContent value="all">
          <p className="text-black text-muted-foreground mb-4 font-semibold">Recommended For You</p>
          {renderTaskList(tasks)}
        </TabsContent>
      </Tabs>

      {/* Second Section - New Filter Tabs System */}
      <div className="w-full mx-auto mt-10">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">All Tasks</h2>
        </div>

        <TaskFilterTabs 
          tabs={filterTabs}
          activeTab={activeFilterTab}
          onTabChange={setActiveFilterTab}
        />

        <div className="mt-6">
          {renderTaskList(filteredTasks)}
        </div>
      </div>
    </div>
  );
};

export default TasksPage;