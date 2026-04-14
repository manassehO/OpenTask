import React, { useState } from 'react';
import { api } from '~/trpc/react';

interface TaskSubmissionFormProps {
  taskId: string;
  onSuccess?: (submissionId: string) => void;
  onCancel?: () => void;
}

export const TaskSubmissionForm: React.FC<TaskSubmissionFormProps> = ({
  taskId,
  onSuccess,
  onCancel,
}) => {
  const [submissionType, setSubmissionType] = useState<
    'text' | 'file' | 'url' | 'mixed'
  >('text');
  const [textContent, setTextContent] = useState('');
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileMetadata, setFileMetadata] = useState<{
    fileName: string;
    fileSize: number;
    contentType: string;
    storageKey: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Submit task mutation
  const submitTaskMutation = api.task.submitTask.useMutation({
    onSuccess: (data) => {
      if (data.success && data.submissionId) {
        onSuccess?.(data.submissionId);
      }
    },
  });

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Upload file to storage
  const uploadFile = async (
    file: File,
  ): Promise<{
    fileName: string;
    fileSize: number;
    contentType: string;
    storageKey: string;
  }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('taskId', taskId);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = (await response.json()) as { error?: string };
      throw new Error(error.error ?? 'File upload failed');
    }

    const result = (await response.json()) as {
      fileMetadata: {
        fileName: string;
        fileSize: number;
        contentType: string;
        storageKey: string;
      };
    };
    return result.fileMetadata;
  };

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsUploading(true);

    try {
      let finalFileMetadata = fileMetadata;

      // Upload file if one is selected and not already uploaded
      if (selectedFile && !fileMetadata) {
        finalFileMetadata = await uploadFile(selectedFile);
        setFileMetadata(finalFileMetadata);
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
        additionalNotes: additionalNotes.trim() ?? undefined,
      };

      // Add content based on submission type
      if (submissionType === 'text' || submissionType === 'mixed') {
        submissionData.textContent = textContent.trim() || undefined;
      }

      if (submissionType === 'url' || submissionType === 'mixed') {
        submissionData.submissionUrl = submissionUrl.trim() || undefined;
      }

      if (
        (submissionType === 'file' || submissionType === 'mixed') &&
        finalFileMetadata
      ) {
        submissionData.fileMetadata = finalFileMetadata;
      }

      // Submit the task
      await submitTaskMutation.mutateAsync(submissionData);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-6 text-2xl font-bold">Submit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Submission Type */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Submission Type
          </label>
          <select
            value={submissionType}
            onChange={(e) =>
              setSubmissionType(
                e.target.value as 'text' | 'file' | 'url' | 'mixed',
              )
            }
            className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          >
            <option value="text">Text Only</option>
            <option value="file">File Only</option>
            <option value="url">URL Only</option>
            <option value="mixed">Mixed (Text + File + URL)</option>
          </select>
        </div>

        {/* Text Content */}
        {(submissionType === 'text' || submissionType === 'mixed') && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Text Content
            </label>
            <textarea
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              placeholder="Enter your submission text..."
              rows={4}
              className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required={submissionType === 'text'}
            />
          </div>
        )}

        {/* URL */}
        {(submissionType === 'url' || submissionType === 'mixed') && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Submission URL
            </label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://example.com/your-submission"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required={submissionType === 'url'}
            />
          </div>
        )}

        {/* File Upload */}
        {(submissionType === 'file' || submissionType === 'mixed') && (
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Upload File
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.zip"
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required={submissionType === 'file' && !fileMetadata}
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-600">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {fileMetadata && (
              <p className="mt-2 text-sm text-green-600">
                ✅ File uploaded: {fileMetadata.fileName}
              </p>
            )}
          </div>
        )}

        {/* Additional Notes */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Additional Notes (Optional)
          </label>
          <textarea
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            placeholder="Any additional information about your submission..."
            rows={3}
            maxLength={1000}
            className="w-full rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            {additionalNotes.length}/1000 characters
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isUploading || submitTaskMutation.isPending}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isUploading
              ? 'Uploading...'
              : submitTaskMutation.isPending
                ? 'Submitting...'
                : 'Submit Task'}
          </button>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-md border border-gray-300 px-6 py-2 text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Error Display */}
        {submitTaskMutation.error && (
          <div className="rounded-md border border-red-200 bg-red-50 p-3">
            <p className="text-sm text-red-600">
              Error: {submitTaskMutation.error.message}
            </p>
          </div>
        )}

        {/* Success Display */}
        {submitTaskMutation.isSuccess && (
          <div className="rounded-md border border-green-200 bg-green-50 p-3">
            <p className="text-sm text-green-600">
              ✅ Task submitted successfully! Your submission is now pending
              review.
            </p>
          </div>
        )}
      </form>
    </div>
  );
};
