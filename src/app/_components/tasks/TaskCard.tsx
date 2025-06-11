import React from 'react';
import type { TaskCardProps } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader, CardImage } from '@/components/ui/card';
import Button from '@/components/ui/button';

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'completed':
        return 'bg-blue-500';
      case 'disputed':
        return 'bg-red-500';
      case 'cancelled':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getActionButtonText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Continue';
      case 'completed':
        return 'View';
      default:
        return 'View';
    }
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow duration-200">
      <CardImage src={'/tasks/task_image.png'} alt={task.title} />
      <CardHeader className="flex flex-col items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{task.title}</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          {task.description}
        </div>  
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="mt-4 flex  flex-col items-start justify-between">
            <div className="text-sm">
              <span className="font-medium">Deadline</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">$ {task.deadline} </span>
            </div>
          </div>
          <div className="mt-4 flex  flex-col items-end justify-between">
            <div className="text-sm">
              <span className="font-medium">{task.rewardInEth} ETH</span>
            </div>
            <div className="text-sm">
              <span className="font-medium">$ {task.rewardInUsd} </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onAction(task.id)}
          className={`w-full ${task.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}
        >
          {getActionButtonText(task.status)}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard; 