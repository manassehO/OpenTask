'use client';

import type { TaskCardProps } from '@/types/task';
import React from 'react';
import Button from '~/_components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardImage,
} from '~/_components/ui/card';
import { ClientDate } from '~/_components/ui/ClientDate';

// Helper function to convert reward amount to USD (mock conversion)
function convertToUSD(ethAmount: number): number {
  // Mock ETH to USD conversion rate (in real app, this would come from an API)
  const ETH_TO_USD = 2400;
  return Math.round(ethAmount * ETH_TO_USD);
}

// Helper function to get status badge styling
function getStatusBadge(status: string) {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800';
    case 'PUBLISHED':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

// Helper function to format reward amount for display
// function formatRewardAmount(task: any): { eth: number; usd: number } {
//   // Use rewardAmount from API as primary source
//   const ethAmount = task.rewardAmount ?? task.rewardInEth ?? 0;
//   const usdAmount = task.rewardInUsd ?? convertToUSD(ethAmount);

//   return {
//     eth: ethAmount,
//     usd: usdAmount,
//   };
// }

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onAction,
  isLoading = false,
}) => {
  // Handle loading state
  if (isLoading) {
    return (
      <Card className="flex h-full w-full flex-col bg-white shadow-sm">
        <div className="h-48 w-full animate-pulse bg-gray-200" />
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="mb-4 h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-200" />
        </div>
      </Card>
    );
  }

  // Use fallback image if none provided
  const taskImage = task.image ?? '/tasks/task_image.png';

  // Get formatted reward amounts
  // const { eth: rewardInEth, usd: rewardInUsd } = formatRewardAmount(task);

  return (
    <Card className="flex h-full w-full flex-col bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <CardImage src={taskImage} alt={task.title} />
      <div className="flex flex-1 flex-col">
        <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
          <div className="flex w-full items-start justify-between">
            <div className="flex-1 space-y-1">
              <h3 className="tracking-1 line-clamp-2 text-lg font-semibold capitalize">
                {task.title}
              </h3>
            </div>
            <span
              className={`ml-2 rounded px-2 py-1 text-xs font-medium ${getStatusBadge(task.status)}`}
            >
              {task.status}
            </span>
          </div>
          <div className="text-muted-foreground mt-2 text-base text-[#414141]">
            {task.description.length > 100
              ? `${task.description.substring(0, 100)}...`
              : task.description}
          </div>
          {task.category && (
            <div className="mt-1 text-xs font-medium text-blue-600">
              {task.category.toUpperCase()}
            </div>
          )}
        </CardHeader>

        <CardContent className="flex-1">
          <div className="flex h-full flex-row items-center justify-between">
            <div className="flex flex-col items-start justify-between gap-y-1">
              <div className="text-base">
                <span className="text-[#414141]">Deadline</span>
              </div>
              <div className="text-base">
                {task.deadline ? (
                  <ClientDate
                    isoString={task.deadline.toISOString()}
                    format="date"
                    className="font-semibold"
                    fallback="Loading..."
                  />
                ) : (
                  <span className="font-semibold text-gray-500">
                    No deadline
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end justify-between gap-y-2">
              <div className="text-sm">
                <span className="text-base font-semibold">
                  {/* {rewardInEth.toFixed(3)}ETH */}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-[24px] font-semibold text-[#3B82F6]">
                  {/* ${rewardInUsd.toLocaleString()} */}
                </span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Button
            onClick={() => onAction?.(task.id)}
            className={`flex w-full text-[14px] ${
              task.status === 'ACTIVE' ? 'bg-primary' : 'bg-secondary'
            }`}
            disabled={task.status !== 'ACTIVE'}
          >
            {task.status === 'ACTIVE'
              ? 'View Task'
              : `View Task (${task.status})`}
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
};

export default TaskCard;
