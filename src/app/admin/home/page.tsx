import { ChartBar } from '~/_components/dashboard_components/admin/dashboard/Chart';
import { StatsCard } from '~/_components/dashboard_components/admin/dashboard/statsCard';
import {
  CheckBoard,
  ClipBoard,
  CommentBankIcon,
  UserIcon,
} from '~/svg/generalSvg';

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
    <div className="space-y-6">
      <div className="w-6xl grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((sts, index) => (
          <StatsCard key={index} {...sts} />
        ))}
      </div>
      <ChartBar />
    </div>
  );
}

export default page;
