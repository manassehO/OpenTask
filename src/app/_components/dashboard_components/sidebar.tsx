"use client";

import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarAtom } from "~/hooks/sidebarAtom";
function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useAtom(sidebarAtom);
  const handleLinkClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };
  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-[60px] z-40 h-full w-[75%] transform rounded-lg bg-white px-6 py-4 shadow-md transition-transform duration-300 ease-in-out sm:w-[60%] md:w-[40%] lg:left-[60px] lg:top-[100px] lg:h-auto lg:w-[300px] ${isOpen ? "translate-x-0" : "-translate-x-full lg:left-[-65px]"} `}
      >
        {/* Sidebar content */}
        {sidebar_list.map((list, i) => {
          const isActive = pathname === list.route;

          return (
            <div key={i}>
              <Link
                href={list.route}
                onClick={handleLinkClick}
                className={`flex w-full gap-3 px-6 py-4 text-base font-semibold capitalize ${
                  isActive
                    ? "rounded-md bg-[#3B82F6] text-white"
                    : "text-[#414141]"
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
          className="mt-20 flex w-full gap-3 px-6 py-4 text-base font-semibold capitalize text-[#FF3B30]"
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

const sidebar_list = [
  { title: "Home", icon: "/icons/sidebar_home.svg", route: "/dashboard" },
  { title: "Task", icon: "/icons/sidebar_task.svg", route: "/dashboard/task" },
  {
    title: "Earnings & Rewards",
    icon: "/icons/sidebar_earning.svg",
    route: "/dashboard/earnings",
  },
  {
    title: "Learning Center",
    icon: "/icons/sidebar_learning.svg",
    route: "/dashboard/learning",
  },
  {
    title: "Settings",
    icon: "/icons/sidebar_settings.svg",
    route: "/dashboard/settings",
  },
];
