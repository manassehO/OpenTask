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
      className="fixed left-2 top-[100px] z-50 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md lg:hidden"
      aria-label="Open sidebar"
    >
      <FaBars className="text-lg" />
    </button>
  );
}
