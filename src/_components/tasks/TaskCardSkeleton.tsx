import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '~/_components/ui/card';

const TaskCardSkeleton = () => {
  return (
    <Card className="w-full bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="h-48 w-full animate-pulse rounded-t-lg bg-gray-200" />
      <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
        <div className="w-full space-y-1">
          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-2 h-4 w-full animate-pulse rounded bg-gray-200" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-start justify-between gap-y-1">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="flex flex-col items-end justify-between gap-y-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-2 h-6 w-32 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
      </CardFooter>
    </Card>
  );
};

export default TaskCardSkeleton;
