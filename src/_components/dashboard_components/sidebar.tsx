"use client";

import React from "react";
import { motion } from 'framer-motion';
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

  const sidebarVariants = {
    hidden: {
      x: -300,
      opacity: 0
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  }

  return (
    <>
      {/* Sidebar */}
      <motion.div 
        className="w-[75%] md:w-[40%] lg:w-[300px] bg-white rounded-lg shadow-sm transition-all duration-300 ease-in-out"
        initial="hidden"
        animate="visible"
        variants={sidebarVariants}
      >
        <div className="component-padding">
          <motion.nav 
            className="space-y-2"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3
                }
              }
            }}
          >
            {sidebar_list.map((list, i) => {
              const isActive = pathname === list.route;

              return (
                <motion.div key={i} variants={navItemVariants}>
                  <Link
                    href={list.route}
                    onClick={handleLinkClick}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium capitalize transition-colors duration-200 ${
                      isActive
                        ? "bg-[#3B82F6] text-white"
                        : "text-[#414141] hover:bg-gray-50"
                    }`}
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image src={list.icon} alt="" height={20} width={20} />
                    </motion.div>
                    {list.title}
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          <motion.div 
            className="mt-12 pt-6 border-t border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.02,
                x: 5,
                backgroundColor: "rgba(239, 68, 68, 0.05)",
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/"
                onClick={handleLinkClick}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium capitalize text-[#FF3B30] hover:bg-red-50 transition-colors duration-200"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image src="/icons/logout.svg" alt="" height={20} width={20} />
                </motion.div>
                Log out
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

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
  { title: "Tasks", icon: "/icons/sidebar_task.svg", route: "/dashboard/task" },
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
