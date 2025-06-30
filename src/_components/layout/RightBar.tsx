"use client";
import { useAtom } from "jotai";
import React from "react";
import { motion } from 'framer-motion';
import { sidebarAtom } from "~/hooks/sidebarAtom";
import Button from "~/_components/ui/button";

const RightBar = () => {
  const [isSidebarOpen] = useAtom(sidebarAtom);

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <motion.div 
      className="w-full max-lg:hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="card-container space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="text-center py-8">
          <h2 className="text-heading-lg text-gray-400">Right Panel</h2>
          <p className="text-body text-gray-500 mt-2">
            Additional content can be added here
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RightBar;
