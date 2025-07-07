import React from 'react';
import { OverviewCard } from './OverviewCard';
import { type TaskDetailType } from '~/types/analytics';
import {
  activityData,
  overviewData,
  performaceData,
  taskDetail,
} from '~/mocks/analytics';
import { ActivityCard } from './ActivityCard';
import { Progress } from './Progress';

const Overview = () => {
  return (
    <div className="mt-8 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
      {overviewData.map((overview, id) => (
        <OverviewCard {...overview} key={id} />
      ))}
    </div>
  );
};

const Task = ({ description, instructions, requirements }: TaskDetailType) => {
  return (
    <div className="w-full md:w-[60%]">
      <h1 className="text-xl font-bold">Task Description</h1>
      <p className="my-4">{description}</p>

      <div className="mb-2 mt-6">
        <p className="my-2 font-bold">Instructions:</p>
        <ul className="list-decimal space-y-2 pl-4 text-sm">
          {instructions.map((instruction, id) => (
            <li key={id}>{instruction} </li>
          ))}
        </ul>
      </div>
      <div className="mb-2 mt-6">
        <p className="my-2 font-bold">Requirements:</p>
        <ul className="list-disc space-y-2 pl-4 text-sm">
          {requirements.map((requirement, id) => (
            <li key={id}>{requirement} </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const TaskPerformance = () => {
  return (
    <div className="w-full space-y-4 md:w-[30%]">
      <h1 className="mb-6 text-lg font-bold">Task Performance</h1>
      {performaceData.map((data, id) => (
        <Progress data={data} key={id} />
      ))}
    </div>
  );
};

const Activity = () => {
  return (
    <div className="mt-16">
      <h1 className="mb-2 text-lg font-bold">Recent Activity</h1>
      <div className="space-y-4">
        {activityData.map((activity, id) => (
          <ActivityCard {...activity} key={id} />
        ))}
      </div>
    </div>
  );
};
export const AnalyticsOverview = () => {
  return (
    <div>
      <Overview />
      <div className="mt-20 flex flex-col justify-between gap-4 md:flex-row">
        <Task {...taskDetail} />
        <TaskPerformance />
      </div>
      <Activity />
    </div>
  );
};
