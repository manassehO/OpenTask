'use client';

import { useState, useEffect } from 'react';
import { useSubmitTask } from '~/hooks/useTasks';
import { useToast } from '~/hooks/useToast';
import { X } from 'lucide-react';

interface TaskSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
  taskTitle: string;
}

export default function TaskSubmissionModal({
  isOpen,
  onClose,
  taskId,
  taskTitle,
}: TaskSubmissionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [submissionType, setSubmissionType] = useState<'text' | 'file' | 'url'>(
    'text',
  );
  const [textContent, setTextContent] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const submitTaskMutation = useSubmitTask();
  const { showError } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  const resetForm = () => {
    setSubmissionType('text');
    setTextContent('');
    setSubmissionUrl('');
    setAdditionalNotes('');
    setSelectedFile(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = () => {
    // Validation
    if (submissionType === 'text' && !textContent.trim()) {
      return showError(
        'Validation Error',
        'Please enter text content for your submission',
      );
    }
    if (submissionType === 'url' && !submissionUrl.trim()) {
      return showError(
        'Validation Error',
        'Please enter a valid URL for your submission',
      );
    }
    if (submissionType === 'file' && !selectedFile) {
      return showError(
        'Validation Error',
        'Please select a file for your submission',
      );
    }

    // Prepare submission data
    const submissionData: {
      taskId: string;
      submissionType: 'text' | 'file' | 'url' | 'mixed';
      textContent?: string;
      submissionUrl?: string;
      fileMetadata?: {
        fileName: string;
        fileSize: number;
        contentType: string;
        storageKey: string;
      };
      additionalNotes?: string;
    } = {
      taskId,
      submissionType,
      additionalNotes: additionalNotes.trim() || undefined,
    };

    if (submissionType === 'text') {
      submissionData.textContent = textContent.trim();
    }
    if (submissionType === 'url') {
      submissionData.submissionUrl = submissionUrl.trim();
    }
    if (submissionType === 'file' && selectedFile) {
      submissionData.fileMetadata = {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        contentType: selectedFile.type,
        storageKey: '', // backend will fill this
      };
    }

    submitTaskMutation.mutate(submissionData, {
      onSuccess: () => {
        handleClose();
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      return showError(
        'File Too Large',
        'Please select a file smaller than 5MB',
      );
    }

    setSelectedFile(file);
  };

  if (!mounted || !isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Submit Task</h2>
            <p className="text-sm text-gray-600">Task: {taskTitle}</p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-full bg-gray-100 p-2 text-gray-400 hover:text-gray-600"
            disabled={submitTaskMutation.isPending}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Submission Type Selector */}
        <div className="mb-6">
          <label className="mb-3 block text-sm font-medium text-gray-700">
            Submission Type
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { type: 'text' as const, label: 'Text Response', icon: '📝' },
              { type: 'url' as const, label: 'Link/URL', icon: '🔗' },
              { type: 'file' as const, label: 'File Upload', icon: '📎' },
            ].map(({ type, label, icon }) => (
              <button
                key={type}
                onClick={() => setSubmissionType(type)}
                className={`rounded-lg border-2 p-4 text-center transition-colors ${
                  submissionType === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                disabled={submitTaskMutation.isPending}
              >
                <div className="mb-2 text-2xl">{icon}</div>
                <div className="text-sm font-medium">{label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Content based on submission type */}
        <div className="mb-6">
          {submissionType === 'text' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Text Submission <span className="text-red-500">*</span>
              </label>
              <textarea
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Enter your detailed response here..."
                rows={6}
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                disabled={submitTaskMutation.isPending}
              />
            </div>
          )}

          {submissionType === 'url' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Submission URL <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                value={submissionUrl}
                onChange={(e) => setSubmissionUrl(e.target.value)}
                placeholder="https://example.com/your-submission"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
                disabled={submitTaskMutation.isPending}
              />
            </div>
          )}

          {submissionType === 'file' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                File Upload <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={submitTaskMutation.isPending}
                  accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {selectedFile ? (
                    <div>
                      <div className="mb-2 text-2xl">📎</div>
                      <div className="font-medium text-gray-900">
                        {selectedFile.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round(selectedFile.size / 1024)} KB
                      </div>
                      <div className="mt-2 text-sm text-blue-600">
                        Click to change file
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2 text-2xl">📁</div>
                      <div className="font-medium text-gray-900">
                        Choose a file
                      </div>
                      <div className="text-sm text-gray-500">
                        Max 5MB • PDF, DOC, ZIP, Images
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional comments or context for your submission..."
            rows={3}
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none"
            disabled={submitTaskMutation.isPending}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={submitTaskMutation.isPending}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-3 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitTaskMutation.isPending}
            className="flex-1 rounded-lg bg-blue-500 px-4 py-3 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {submitTaskMutation.isPending ? 'Submitting...' : 'proceed'}
          </button>
        </div>

        {/* Loading overlay */}
        {submitTaskMutation.isPending && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-white bg-opacity-75">
            <div className="text-center">
              <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-sm text-gray-600">Submitting your work...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
