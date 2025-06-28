import React from 'react';
import type { TaskCardProps } from '@/types/task';
import { Card, CardContent, CardFooter, CardHeader, CardImage } from '@/components/ui/card';
import Button from '@/components/ui/button';

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {

  return (
    <Card className="w-full shadow-sm hover:shadow-md bg-white transition-shadow duration-200">
      <CardImage src={'/tasks/task_image.png'} alt={task.title} />
      <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold tracking-1 capitalize">{task.title}</h3>
        </div>
        <div className="text-base text-muted-foreground text-[#414141]">
          {task.description.length > 100 ? `${task.description.substring(0, 100)}...` : task.description}
        </div>  
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex gap-y-1 flex-col items-start justify-between">
            <div className="text-base">
              <span className="text-[#414141]">Deadline</span>
            </div>
            <div className="text-base">
              <span className="font-semibold">{task.deadline} </span>
            </div>
          </div>
          <div className="flex gap-y-2 flex-col items-end justify-between">
            <div className="text-sm">
              <span className="font-semibold text-base">{task.rewardInEth}ETH</span>
            </div>
            <div className="text-sm">
              <span className="font-semibold text-[24px] text-[#3B82F6]">${task.rewardInUsd.toLocaleString()} </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onAction(task.id)}
          className={`w-full text-[14px] ${task.status === 'active' ? 'bg-primary' : 'bg-secondary'}`}
        >
          View Task
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard; 