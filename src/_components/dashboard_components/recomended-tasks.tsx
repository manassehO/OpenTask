'use client'
import React from 'react'
import { motion } from 'framer-motion'
import Button from '../ui/button'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.3
    }
  }
}

const taskCardVariants = {
  hidden: { 
    opacity: 0, 
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
}

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
}

const buttonVariants = {
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.98
  }
}

const RecomendedTasks = () => {
  const task = {
    taskImg: '/task-img.png',
    taskName: 'Complete a short survey about defi',
    taskDescription: 'Lorem ipsum dolor sit amet consectetur. Ultricies ultricies mauris morbi aenean pellentesque',
    priceCrypto: '0.05 ETH',
    priceUSD: '$100',
    taskLink: '#',
    deadline: "Mon, 12th Oct, 2025"
  }
  const tasks = Array(8).fill(task)
  
  return (
    <motion.div 
      className='section-spacing'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className='flex-between component-margin'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1 className='text-heading-lg'>Recommended For You</h1>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button 
            backgroundColor='transparent' 
            textColor='text-[#3B82F6]' 
            className='text-[#3B82F6] hover:bg-blue-50 border-none'
          >
            See All Tasks
          </Button>
        </motion.div>
      </motion.div>

      <div className='card-grid-responsive'>
        {tasks.map((task, index) => (
          <motion.div 
            key={index} 
            className='card-container flex flex-col justify-between min-h-[320px] cursor-pointer'
            variants={taskCardVariants}
            whileHover={{ 
              y: -8,
              boxShadow: "0 15px 30px rgba(0,0,0,0.12)",
              transition: { duration: 0.3 }
            }}
          >
            <div className='space-y-4'>
              <motion.div 
                className='w-full h-48 overflow-hidden rounded-lg'
                whileHover="hover"
              >
                <motion.img 
                  src={task.taskImg} 
                  alt={task.taskName} 
                  className='w-full h-full object-cover'
                  variants={imageVariants}
                />
              </motion.div>
              
              <div className='space-y-3'>
                <motion.h2 
                  className='text-heading-sm line-clamp-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                >
                  {task.taskName}
                </motion.h2>
                <motion.p 
                  className='text-body line-clamp-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                >
                  {task.taskDescription}
                </motion.p>
                
                <motion.div 
                  className='space-y-2'
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                >
                  <div className='flex-between'>
                    <span className='text-caption'>Deadline</span>
                    <span className='text-sm font-medium text-gray-900'>{task.priceCrypto}</span>
                  </div>
                  <div className='flex-between'>
                    <span className='text-sm text-gray-900'>{task.deadline}</span>
                    <span className='text-lg font-bold text-[#3B82F6]'>{task.priceUSD}</span>
                  </div>
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className='mt-4'
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.05 }}
            >
              <Button className='w-full'>View Task</Button>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default RecomendedTasks
