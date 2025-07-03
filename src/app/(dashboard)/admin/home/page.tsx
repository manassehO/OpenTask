import {
  CheckBoard,
  ClipBoard,
  CommentBankIcon,
  UserIcon,
} from 'public/svg/generalSvg';
import React from 'react';
import { StatsCard } from '~/_components/dashboard_components/admin/dashboard/statsCard';

function page() {
  const stats = [
    {
      title: 'total users',
      icon: <UserIcon />,
      linkName: 'view users',
      linkHref: '/admin/users',
      statsNumber: '2000',
    },
    {
      title: 'active tasks',
      icon: <ClipBoard />,
      linkName: 'view tasks',
      linkHref: '/admin/tasks',
      statsNumber: '3000',
    },
    {
      title: 'completed tasks',
      icon: <CheckBoard />,
      linkName: 'view tasks',
      linkHref: '/admin/tasks',
      statsNumber: '1,000',
    },
    {
      title: 'open disputes',
      icon: <CommentBankIcon />,
      linkName: 'view disputes',
      linkHref: '/admin/dispute',
      statsNumber: '12',
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-4 gap-2">
        {stats.map((sts, index) => (
          <StatsCard key={index} {...sts} />
        ))}
      </div>
    </div>
  );
}

export default page;
