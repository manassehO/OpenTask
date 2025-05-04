"use client";

import { useAtom } from "jotai";
import { sidebarAtom } from "~/hooks/sidebarAtom";
import Sidebar from "../dashboard_components/sidebar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen] = useAtom(sidebarAtom);

  return (
    <div className="flex h-full w-full flex-row items-start pb-[30px] pt-[120px] lg:px-[30px]">
      <Sidebar />
      <main
        className={`ml-0 min-h-[calc(100vh-120px)] px-6 transition-all duration-300 ease-in-out lg:ml-[30px]`}
      >
        {children}
      </main>
    </div>
  );
}
