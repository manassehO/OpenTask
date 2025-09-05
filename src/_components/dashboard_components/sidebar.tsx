'use client';

import { useAtom } from 'jotai';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { sidebarAtom } from '~/hooks/sidebarAtom';
import { routes } from '~/lib/route';

function Sidebar({ role }: { role: 'admin' | 'creator' | 'completer' }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);

  const handleLinkClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // admin side bar list
  const adminList = [
    {
      title: 'Dashboard',
      icon: '/icons/sidebar_home.svg',
      route: routes.admin.root,
    },
    {
      title: 'Manage Users',
      icon: '/icons/users.svg',
      route: routes.admin.users,
    },
    { title: 'Tasks', icon: '/icons/darkTask.svg', route: routes.admin.tasks },
    {
      title: 'Dispute',
      icon: '/icons/dispute.svg',
      route: routes.admin.disputes,
    },
    {
      title: 'Settings',
      icon: '/icons/sidebar_settings.svg',
      route: routes.admin.settings,
    },
    {
      title: 'Contents',
      icon: '/icons/content.svg',
      route: routes.admin.content,
    },
  ];

  // creator side bar list
  const creatorList = [
    {
      title: 'Dashboard',
      icon: '/icons/sidebar_home.svg',
      route: routes.creator.root,
    },
    {
      title: 'Tasks',
      icon: '/icons/darkTask.svg',
      route: routes.creator.tasks,
    },
    {
      title: 'Analytics',
      icon: '/icons/analytics.svg',
      route: routes.creator.analytics,
    },
  ];

  // user side bar list
  const userList = [
    {
      title: 'Home',
      icon: '/icons/sidebar_home.svg',
      route: routes.completer.root,
    },
    {
      title: 'Tasks',
      icon: '/icons/sidebar_task.svg',
      route: routes.completer.tasks,
    },
    {
      title: 'Earnings & Rewards',
      icon: '/icons/sidebar_earning.svg',
      route: routes.completer.earnings,
    },
    {
      title: 'Learning Center',
      icon: '/icons/sidebar_learning.svg',
      route: routes.completer.learning,
    },
    {
      title: 'Settings',
      icon: '/icons/sidebar_settings.svg',
      route: routes.completer.settings,
    },
  ];

  let sidebar_list;
  if (role === 'admin') sidebar_list = adminList;
  else if (role === 'creator') sidebar_list = creatorList;
  else if (role === 'completer') sidebar_list = userList;
  else return;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`w-70 fixed left-0 top-0 z-40 h-full transform bg-white px-4 py-6 shadow-lg transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:static lg:w-full lg:translate-x-0 lg:rounded-lg lg:bg-white/40 lg:shadow-none`}
      >
        {/* Close button (mobile only) */}
        <div className="mb-4 flex items-center justify-between lg:hidden">
          <h2 className="text-lg font-bold">Menu</h2>
          <button
            className="rounded-md p-2 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Sidebar items */}
        {sidebar_list.map((item, index) => {
          const isActive = pathname === item.route;

          return (
            <Link
              key={index}
              href={item.route}
              onClick={handleLinkClick}
              className={`mb-2 flex items-center gap-3 rounded-md px-6 py-4 text-base font-semibold capitalize transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-[#414141] hover:bg-[#E5EFFF]'
              }`}
            >
              <Image src={item.icon} alt={item.title} height={20} width={20} />
              {item.title}
            </Link>
          );
        })}

        {/* Logout */}
        <Link
          href="/"
          onClick={handleLinkClick}
          className="mt-20 flex items-center gap-3 rounded-md bg-[#FFF3F2] px-6 py-4 text-base font-semibold capitalize text-[#FF3B30] hover:bg-[#FFE8E7]"
        >
          <Image src="/icons/logout.svg" alt="Log out" height={20} width={20} />
          Log out
        </Link>
      </aside>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default Sidebar;
