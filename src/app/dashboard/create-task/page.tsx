'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import CreateTaskForm from '~/_components/tasks/CreateTaskForm';
import { WalletStatus } from '~/_components/wallet/WalletConnect';
import { useWallet } from '~/hooks/useWallet';

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

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
};

export default function CreateTaskPage() {
  const router = useRouter();
  const { isConnected } = useWallet();
  const [createdTaskId, setCreatedTaskId] = useState<string | null>(null);

  const handleTaskCreated = (taskId: string) => {
    setCreatedTaskId(taskId);
    // Optionally redirect to task details or dashboard after a delay
    setTimeout(() => {
      router.push('/dashboard');
    }, 3000);
  };

  const handleCancel = () => {
    router.push('/dashboard');
  };

  if (createdTaskId) {
    return (
      <motion.div 
        className="min-h-screen w-full bg-[#FAFAFA] flex items-center justify-center text-black"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg p-6 text-center"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Task Created Successfully!
            </h3>
            <p className="text-gray-600 mb-4">
              Your task has been created and deployed to the blockchain.
            </p>
            <div className="bg-gray-50 rounded-md p-3 mb-4">
              <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
              <p className="text-xs font-mono text-gray-700 break-all">
                {createdTaskId}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              Redirecting to dashboard...
            </p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen w-full bg-[#FAFAFA] text-black"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <motion.div 
        className="w-full section-spacing py-8"
        variants={contentVariants}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={contentVariants}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Create a New Task
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create blockchain-powered micro-tasks with transparent rewards and automatic payments.
            Connect your wallet to get started.
          </p>
          
          {/* Wallet Status */}
          <div className="mt-4 flex justify-center">
            <WalletStatus />
          </div>
        </motion.div>

        {/* Task Creation Form */}
        <motion.div variants={contentVariants}>
          <CreateTaskForm 
            onTaskCreated={handleTaskCreated}
            onCancel={handleCancel}
          />
        </motion.div>

        {/* Information Cards */}
        <motion.div 
          className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
          variants={contentVariants}
        >
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Escrow</h3>
            <p className="text-gray-600 text-sm">
              Funds are held securely in smart contracts until work is completed and approved.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Payments</h3>
            <p className="text-gray-600 text-sm">
              Automatic payment release upon task approval with no delays or intermediaries.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Transparent Process</h3>
            <p className="text-gray-600 text-sm">
              All task details, submissions, and payments are recorded on the blockchain.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}