import React from 'react';

type OverviewItem = {
  title: string;
  value: string;
  review?: string;
  percentage?: string;
  approve?: string;
};

const overviewData: OverviewItem[] = [
  {
    title: 'Submissions',
    value: '0.05 eth',
    review: '3 pending reviews',
  },
  {
    title: 'Budget Used',
    value: '0.3/0.5 eth',
    percentage: '48%',
  },
  {
    title: 'Approval Rate',
    value: '100%',
    approve: '21 approved',
  },
  {
    title: 'Time Remaining',
    value: '10 days',
    percentage: 'ends on Apr 25, 2025',
  },
];

export const AnalyticsOverview = () => {
  return <div>AnalyticsOverview</div>;
};
