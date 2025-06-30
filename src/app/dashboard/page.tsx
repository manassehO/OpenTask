'use client'
import { motion } from 'framer-motion';
import GreetingCard from "~/_components/dashboard_components/greeting-card";
import RecomendedTasks from "~/_components/dashboard_components/recomended-tasks";
import Summary from "~/_components/dashboard_components/summary";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const contentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      staggerChildren: 0.2
    }
  }
}

function page() {
  const name = "Bartholomew Favour";

  return (
    <motion.div 
      className="min-h-screen w-full bg-[#FAFAFA] text-black"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div 
        className="w-full section-spacing"
        variants={contentVariants}
      >
        <GreetingCard name={name} />
        <Summary />
        <RecomendedTasks />
      </motion.div>
    </motion.div>
  );
}

export default page;
