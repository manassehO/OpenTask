import React, { useEffect } from 'react';
import type { TaskCardProps } from '@/types/task';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
} from '~/_components/ui/card';
import Button from '~/_components/ui/button';

const TaskCard: React.FC<TaskCardProps> = ({ task, onAction }) => {
  useEffect(() => {
    console.log(task.deadline);
  }, []);
  return (
    <Card className="flex h-full w-full flex-col bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardImage src={'/tasks/task_image.png'} alt={task.title} />
      <div className="flex flex-1 flex-col">
        <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <h3 className="tracking-1 text-lg font-semibold capitalize">
              {task.title}
            </h3>
          </div>
          <div className="text-muted-foreground line-clamp-3 text-base text-[#414141]">
            {task.description}
          </div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="flex h-full flex-row items-center justify-between">
            <div className="flex flex-col items-start justify-between gap-y-1">
              <div className="text-base">
                <span className="text-[#414141]">Deadline</span>
              </div>
              <div className="text-base">
                <span className="font-semibold">
                  {task.deadline?.toString().slice(0, 15) ?? ''}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-y-2">
              <div className="text-sm">
                <span className="text-base font-semibold">
                  {task.rewardAmount ?? 0}ETH
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[24px] font-semibold text-[#3B82F6]">
                  ${task.rewardAmount?.toLocaleString()}{' '}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => onAction?.(task.id)}
            className={`flex w-full text-[14px] ${task.status === 'ACTIVE' ? 'bg-primary' : 'bg-secondary'}`}
          >
            View Task
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default TaskCard;
