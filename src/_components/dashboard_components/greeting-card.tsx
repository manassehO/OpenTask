'use client'
import React from 'react'
import { motion } from 'framer-motion'

type GreetingCardProps = {
  name: string;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const getTimeOfDay = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone
  });

  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
const greetings = [
  {
    time: 'morning',
    icon: '☀️',
  },
  {
    time: 'afternoon',
    icon: '🌞',
  },
  {
    time: 'evening',
    icon: '🌔',
  },
  {
    time: 'night',
    icon: '✨',
  }
]

function GreetingCard({ name, ...props }: GreetingCardProps) {
  const timeOfDay = getTimeOfDay();
  const greeting = greetings.find(g => g.time === timeOfDay);
  const greetingText = `Good ${greeting?.time} ${greeting?.icon}`;
  return (
    <motion.div 
      className={`component-padding component-margin ${props.className}`}
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.1
      }}
    >
      <div className="space-y-2">
        <motion.span 
          className="text-body font-semibold capitalize"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {greetingText}
        </motion.span>
        <motion.h1 
          className="text-3xl font-bold text-gray-900 capitalize"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        >
          {name}
        </motion.h1>
      </div>
    </motion.div>
  )
}

export default GreetingCard