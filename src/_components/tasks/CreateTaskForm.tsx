'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskContract } from '~/hooks/useTaskContract';
import { useWallet } from '~/hooks/useWallet';
import Button from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface CreateTaskFormProps {
  onTaskCreated?: (taskId: string) => void;
  onCancel?: () => void;
}

export default function CreateTaskForm({ onTaskCreated, onCancel }: CreateTaskFormProps) {
  const { isConnected } = useWallet();
  const { createTask, isLoading, error } = useTaskContract();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    reward: '',
    deadline: '',
    requirements: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.reward || parseFloat(formData.reward) <= 0) {
      errors.reward = 'Valid reward amount is required';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      if (deadlineDate <= new Date()) {
        errors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (!formData.requirements.trim()) {
      errors.requirements = 'Requirements are required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    if (!validateForm()) {
      return;
    }

    const deadlineTimestamp = Math.floor(new Date(formData.deadline).getTime() / 1000);
    
    const taskId = await createTask({
      title: formData.title,
      description: formData.description,
      reward: formData.reward,
      deadline: deadlineTimestamp,
      requirements: formData.requirements
    });

    if (taskId && onTaskCreated) {
      onTaskCreated(taskId);
      // Reset form
      setFormData({
        title: '',
        description: '',
        reward: '',
        deadline: '',
        requirements: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Create New Task
          </CardTitle>
          {!isConnected && (
            <p className="text-center text-red-600 text-sm">
              Please connect your wallet to create tasks
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task title"
                disabled={isLoading}
              />
              {formErrors.title && (
                <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.description ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe what needs to be done"
                disabled={isLoading}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
            </div>

            {/* Reward */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reward (ETH) *
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={formData.reward}
                onChange={(e) => handleInputChange('reward', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.reward ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.05"
                disabled={isLoading}
              />
              {formErrors.reward && (
                <p className="text-red-500 text-sm mt-1">{formErrors.reward}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deadline *
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => handleInputChange('deadline', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.deadline ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {formErrors.deadline && (
                <p className="text-red-500 text-sm mt-1">{formErrors.deadline}</p>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements *
              </label>
              <textarea
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.requirements ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="List specific requirements and deliverables"
                disabled={isLoading}
              />
              {formErrors.requirements && (
                <p className="text-red-500 text-sm mt-1">{formErrors.requirements}</p>
              )}
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-md"
              >
                <p className="text-red-600 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                disabled={!isConnected || isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Task...
                  </div>
                ) : (
                  'Create Task'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}