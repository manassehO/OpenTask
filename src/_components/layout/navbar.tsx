"use client";

import clsx from "clsx";
import { useAtom } from "jotai";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { sidebarAtom } from "~/hooks/sidebarAtom";
const sections = ["home", "features", "contact us"];

export function Navbar() {
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
    <nav className="fixed left-0 right-0 top-0 z-50 h-auto w-full justify-between bg-white shadow">
      <div className="mx-auto flex w-full items-center justify-between px-5 lg:px-20 py-4 lg:max-w-7xl">
        <Link href="/" className="flex items-center">
          <Image
            width={50}
            height={50}
            src="/logo.svg"
            alt="OpenTask Logo"
            className="inline"
          />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden items-center gap-6 md:flex">
          {/* <button
            className=""
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <PanelLeft className="h-[20px] w-[20px] text-black" />
          </button> */}
          {sections.map((section) => (
            <li key={section}>
              <a
                href={`#${section}`}
                className={clsx(
                  "capitalize text-gray-700 transition hover:text-blue-600",
                  activeSection === section && "font-semibold text-blue-600",
                )}
              >
                {section}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/register"
              className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
            >
              Register
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="flex flex-col gap-1 md:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          <span className="h-0.5 w-6 bg-gray-700" />
          <span className="h-0.5 w-6 bg-gray-700" />
          <span className="h-0.5 w-6 bg-gray-700" />
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="bg-white px-4 pb-4 shadow md:hidden">
          <ul className="flex flex-col gap-3">
            {sections.map((section) => (
              <li key={section}>
                <a
                  href={`#${section}`}
                  className={clsx(
                    "block capitalize text-gray-700 transition hover:text-blue-600",
                    activeSection === section && "font-semibold text-blue-600",
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {section}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/register"
                className="inline-block w-full rounded bg-blue-600 px-4 py-2 text-center text-white transition hover:bg-blue-700"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
