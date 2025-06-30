'use client'
import React from 'react'
import { motion } from 'framer-motion'

const summaryData = [
  {
    title: "Total Earnings",
    amount: "$200,000",
    cryptoAmount: "1,000 BTC",
    icon: "/icons/payments.svg",
    bgColor: "bg-[#F59E0B]/15"
  },
  {
    title: "Total Tasks Completed",
    amount: "1,500",
    cryptoAmount: "2,500 ETH",
    icon: "/icons/task.svg",
    bgColor: "bg-[#10B981]/15"
  },
  {
    title: "Streak",
    amount: "30 Days",
    cryptoAmount: "0.5 BTC",
    icon: "/icons/streak.svg",
    bgColor: "bg-[#06B6D41A]/15"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
}

const Summary = () => {
  return (
    <motion.div 
      className='section-spacing'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className='card-grid-responsive'>
        {summaryData.map((item, index) => (
          <motion.div 
            key={index} 
            className='card-container min-h-[180px] flex flex-col justify-between cursor-pointer'
            variants={cardVariants}
            whileHover={{ 
              y: -5,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className='flex flex-col space-y-4'>
              <motion.div 
                className={`flex-center w-12 h-12 rounded-lg ${item.bgColor}`}
                variants={iconVariants}
                whileHover="hover"
              >
                <img src={item.icon} alt={item.title} className='w-6 h-6' />
              </motion.div>
              <div className='space-y-2'>
                <h3 className='text-caption'>{item.title}</h3>
                <motion.p 
                  className='text-heading-md'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {item.amount}
                </motion.p>
                <motion.span 
                  className='text-sm text-[#3B82F6] font-semibold'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {item.cryptoAmount}
                </motion.span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default Summary
