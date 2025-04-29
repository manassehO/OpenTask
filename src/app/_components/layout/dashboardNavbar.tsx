"use client";

import { useAtom } from "jotai";
import {
  Bell,
  CircleHelp,
  Search,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sidebarAtom } from "~/hooks/sidebarAtom";

const sections = ["home", "features", "contact us"];

export function DashboardNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");
  const [, setIsSidebarOpen] = useAtom(sidebarAtom);

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

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-auto w-full bg-white shadow">
      <div className="mx-auto flex items-center justify-between gap-4 px-3 py-4 lg:px-10">
        <Link href="/" className="flex items-center">
          <img src="/logo.svg" alt="OpenTask Logo" className="inline h-8" />
        </Link>

        <div className="relative hidden w-[40%] lg:flex">
          <Search className="absolute left-2 top-4 h-6 w-6 text-[#454543]" />
          <input
            className="h-[56px] w-full items-center rounded-lg border-none bg-[#F3F3F3] pl-12 pr-3 text-[#7E7E7E] outline-none placeholder:text-[#7E7E7E]"
            placeholder="search openTask"
          />
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <a href="">
            <button className="text-base font-bold capitalize text-[#3B82F6]">
              🗓️ create a task
            </button>
          </a>
          <CircleHelp />
          <Bell />
          <Image
            alt="Profile"
            height={40}
            width={40}
            className="rounded-full"
            src="/icons/profileImg.svg"
          />
        </div>

        {/* Mobile Hamburger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="p-1"
          >
            {menuOpen ? (
              <X className="h-6 w-6 text-black" />
            ) : (
              <Menu className="h-6 w-6 text-black" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu*/}
      {menuOpen && (
        <div className="absolute right-0 top-full z-50 w-1/2 bg-white shadow-lg p-4 flex flex-col gap-4 lg:hidden">
          <div className="flex gap-6">
            <CircleHelp />
            <Bell />
            <Image
              alt="Profile"
              height={36}
              width={36}
              className="rounded-full"
              src="/icons/profileImg.svg"
            />
          </div>
          <div className="relative w-full">
            <Search className="absolute left-2 top-3 h-5 w-5 text-[#454543]" />
            <input
              className="h-[44px] w-full rounded-lg border-none bg-[#F3F3F3] pl-10 pr-3 text-[#7E7E7E] outline-none placeholder:text-[#7E7E7E]"
              placeholder="search openTask"
            />
          </div>
          <a href="">
            <button className="text-left text-base font-bold capitalize text-[#3B82F6]">
              🗓️ create a task
            </button>
          </a>
        </div>
      )}
    </nav>
  );
}
