'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTaskContract } from '~/hooks/useTaskContract';
import { useWallet } from '~/hooks/useWallet';
import Button from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface TaskSubmissionFormProps {
  taskId: string;
  taskTitle: string;
  onSubmissionComplete?: (transactionHash: string) => void;
  onCancel?: () => void;
}

export default function TaskSubmissionForm({ 
  taskId, 
  taskTitle, 
  onSubmissionComplete, 
  onCancel 
}: TaskSubmissionFormProps) {
  const { isConnected } = useWallet();
  const { submitTask, isLoading, error } = useTaskContract();
  
  const [submissionData, setSubmissionData] = useState({
    workDescription: '',
    proofLinks: '',
    additionalNotes: ''
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!submissionData.workDescription.trim()) {
      errors.workDescription = 'Work description is required';
    }
    
    if (!submissionData.proofLinks.trim()) {
      errors.proofLinks = 'Proof links are required';
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

    // Combine all submission data into a single string
    const combinedSubmissionData = JSON.stringify({
      workDescription: submissionData.workDescription,
      proofLinks: submissionData.proofLinks,
      additionalNotes: submissionData.additionalNotes,
      timestamp: Date.now()
    });
    
    const transactionHash = await submitTask(taskId, combinedSubmissionData);

    if (transactionHash && onSubmissionComplete) {
      onSubmissionComplete(transactionHash);
      // Reset form
      setSubmissionData({
        workDescription: '',
        proofLinks: '',
        additionalNotes: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setSubmissionData(prev => ({ ...prev, [field]: value }));
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
          <CardTitle className="text-2xl font-bold">
            Submit Work
          </CardTitle>
          <p className="text-gray-600">
            Task: {taskTitle}
          </p>
          {!isConnected && (
            <p className="text-center text-red-600 text-sm">
              Please connect your wallet to submit work
            </p>
          )}
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Work Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description *
              </label>
              <textarea
                value={submissionData.workDescription}
                onChange={(e) => handleInputChange('workDescription', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.workDescription ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe the work you completed and how it meets the requirements"
                disabled={isLoading}
              />
              {formErrors.workDescription && (
                <p className="text-red-500 text-sm mt-1">{formErrors.workDescription}</p>
              )}
            </div>

            {/* Proof Links */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Proof Links *
              </label>
              <textarea
                value={submissionData.proofLinks}
                onChange={(e) => handleInputChange('proofLinks', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.proofLinks ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Provide links to your work (GitHub repos, deployed sites, documents, etc.)\nOne link per line"
                disabled={isLoading}
              />
              {formErrors.proofLinks && (
                <p className="text-red-500 text-sm mt-1">{formErrors.proofLinks}</p>
              )}
              <p className="text-gray-500 text-xs mt-1">
                Provide verifiable links to demonstrate your completed work
              </p>
            </div>

            {/* Additional Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={submissionData.additionalNotes}
                onChange={(e) => handleInputChange('additionalNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional information or context about your submission (optional)"
                disabled={isLoading}
              />
            </div>

            {/* Submission Guidelines */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <h4 className="font-medium text-blue-900 mb-2">Submission Guidelines:</h4>
              <ul className="text-blue-800 text-sm space-y-1">
                <li>• Ensure all work meets the specified requirements</li>
                <li>• Provide clear, accessible links to your deliverables</li>
                <li>• Include detailed descriptions of your approach</li>
                <li>• Test all links before submitting</li>
                <li>• Submissions are recorded on the blockchain and cannot be edited</li>
              </ul>
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
                    Submitting...
                  </div>
                ) : (
                  'Submit Work'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Success message component
export function SubmissionSuccess({ transactionHash }: { transactionHash: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md mx-auto"
    >
      <Card>
        <CardContent className="text-center p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Submission Successful!
          </h3>
          <p className="text-gray-600 mb-4">
            Your work has been submitted to the blockchain and is awaiting review.
          </p>
          <div className="bg-gray-50 rounded-md p-3">
            <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
            <p className="text-xs font-mono text-gray-700 break-all">
              {transactionHash}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}