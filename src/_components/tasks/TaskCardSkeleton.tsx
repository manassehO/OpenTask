import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '~/_components/ui/card';

const TaskCardSkeleton = () => {
  return (
    <Card className="w-full shadow-sm hover:shadow-md bg-white transition-shadow duration-200">
      <div className="w-full h-48 bg-gray-200 animate-pulse rounded-t-lg" />
      <CardHeader className="flex flex-col items-start justify-between space-y-0 pb-2">
        <div className="space-y-1 w-full">
          <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
        <div className="h-4 bg-gray-200 rounded animate-pulse w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex gap-y-1 flex-col items-start justify-between">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-32 mt-2" />
          </div>
          <div className="flex gap-y-2 flex-col items-end justify-between">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24" />
            <div className="h-6 bg-gray-200 rounded animate-pulse w-32 mt-2" />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  );
};

export default TaskCardSkeleton; 