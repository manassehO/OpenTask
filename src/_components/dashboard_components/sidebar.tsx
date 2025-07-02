'use client';

import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarAtom } from '~/hooks/sidebarAtom';

function Sidebar({ role }: { role: 'admin' | 'creator' | 'user' }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  const adminList = [
    {
      title: 'Dashboard',
      icon: '/icons/sidebar_home.svg',
      route: '/admin/home',
    },
    {
      title: 'Manage Users',
      icon: '/icons/users.svg',
      route: '/admin/users',
    },
    { title: 'Tasks', icon: '/icons/darkTask.svg', route: '/admin/tasks' },
    {
      title: 'Dispute',
      icon: '/icons/dispute.svg',
      route: '/admin/dispute',
    },
    {
      title: 'Settings',
      icon: '/icons/sidebar_settings.svg',
      route: '/admin/settings',
    },
    {
      title: 'Contents',
      icon: '/icons/content.svg',
      route: '/admin/contents',
    },
  ];

  const creatorList = [
    {
      title: 'Dashboard',
      icon: '/icons/sidebar_home.svg',
      route: '/creator/home',
    },
    {
      title: 'Tasks',
      icon: '/icons/darkTask.svg',
      route: '/creator/tasks',
    },
    {
      title: 'Analytics',
      icon: '/icons/analytics.svg',
      route: '/creator/analytics',
    },
  ];

  const userList = [
    { title: 'Home', icon: '/icons/sidebar_home.svg', route: '/home' },
    { title: 'Tasks', icon: '/icons/sidebar_task.svg', route: '/task' },
    {
      title: 'Earnings & Rewards',
      icon: '/icons/sidebar_earning.svg',
      route: '/earnings',
    },
    {
      title: 'Learning Center',
      icon: '/icons/sidebar_learning.svg',
      route: '/learning',
    },
    {
      title: 'Settings',
      icon: '/icons/sidebar_settings.svg',
      route: '/settings',
    },
  ];

  let sidebar_list;
  if (role === 'admin') sidebar_list = adminList;
  else if (role === 'creator') sidebar_list = creatorList;
  else sidebar_list = userList;

  return (
    <>
      {/* Sidebar */}
      <div
        className={`w-[75%] rounded-lg bg-white px-6 py-4 shadow-sm transition-all duration-300 ease-in-out md:w-[40%] lg:w-[300px]`}
      >
        {/* Sidebar content */}
        {sidebar_list.map((list, i) => {
          console.log(list);
          const isActive = pathname === list.route;

          return (
            <div key={i}>
              <Link
                href={list.route}
                onClick={handleLinkClick}
                className={`flex w-full gap-3 px-6 py-4 text-base font-semibold capitalize ${
                  isActive
                    ? 'rounded-md bg-[#3B82F6] text-white'
                    : 'text-[#414141]'
                }`}
              >
                <Image src={list.icon} alt="" height={20} width={20} />
                {list.title}
              </Link>
            </div>
          );
        })}

        <Link
          href="/"
          onClick={handleLinkClick}
          className="mt-20 flex w-full gap-3 bg-[#FFF3F2] px-6 py-4 text-base font-semibold capitalize text-[#FF3B30]"
        >
          <Image src="/icons/logout.svg" alt="" height={20} width={20} />
          Log out
        </Link>
      </div>

      {/* Backdrop for mobile only */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
