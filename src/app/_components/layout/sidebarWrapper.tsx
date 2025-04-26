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
    <div className="flex h-full w-full flex-row items-start pt-[100px] lg:px-[30px]">
      <Sidebar />
      <main
        className={`px-6 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "lg:ml-[330px]" : "lg:ml-0"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
