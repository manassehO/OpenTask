"use client";

import { useAtom } from "jotai";
import { Bell, CircleHelp, PanelLeft, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sidebarAtom } from "~/hooks/sidebarAtom";
const sections = ["home", "features", "contact us"];

export function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map((id) => {
        const element = document.getElementById(id);
        if (!element) return { id, top: Infinity };
        return { id, top: element.offsetTop - window.innerHeight / 3 };
      });

      const current = [...offsets]
        .reverse()
        .find((sec) => window.scrollY >= sec.top);
      setActiveSection(current?.id ?? "home");
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [, setIsSidebarOpen] = useAtom(sidebarAtom);
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-auto w-full bg-white shadow">
      <div className="mx-auto flex items-center justify-between gap-4 px-3 py-4 lg:px-10">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="OpenTask Logo" className="inline" />
        </Link>

        <div className="relative hidden w-[40%] lg:flex">
          <Search className="absolute left-2 top-4 h-6 w-6 text-[#454543]" />
          <input
            className="h-[56px] w-full items-center rounded-lg border-none bg-[#F3F3F3] pl-12 pr-3 text-[#7E7E7E] outline-none placeholder:text-[#7E7E7E] active:border-none"
            placeholder="search openTask"
          />
        </div>

        <div className="flex w-fit items-center gap-4">
          <button
            className=""
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <PanelLeft className="h-[20px] w-[20px] text-black" />
          </button>

          <div className="hidden flex-row items-center justify-between gap-4 lg:flex">
            <button className="text-base font-bold capitalize text-[#3B82F6]">
              🗓️ create a task
            </button>
            <CircleHelp />
            <Bell />
          </div>
          <Image
            alt=""
            height={40}
            width={40}
            className="rounded-full"
            src="/icons/profileImg.svg"
          />
        </div>
      </div>
    </nav>
  );
}
