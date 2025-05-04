"use client";

import { useAtom } from "jotai";
import { sidebarAtom } from "~/hooks/sidebarAtom";
import { FaBars } from "react-icons/fa";

export default function SidebarToggleButton() {
  const [isSidebarOpen, setIsSidebarOpen] = useAtom(sidebarAtom);

  if (isSidebarOpen) return null;

  return (
    <button
      onClick={() => setIsSidebarOpen(true)}
      className="z-2 sticky left-1 top-[100px] flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md lg:hidden"
      aria-label="Open sidebar"
    >
      <FaBars className="text-sm" />
    </button>
  );
}
