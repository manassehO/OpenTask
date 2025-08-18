import React, { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import { CloudUploader } from 'public/svg/generalSvg';
// Remove this line: import Image from 'next/image';

interface ThumbnailUploadProps {
  onFileSelect: (file: File | null) => void;
  currentFile?: File | null;
  error?: string;
  required?: boolean;
}

const ThumbnailUpload: React.FC<ThumbnailUploadProps> = ({
  onFileSelect,
  currentFile,
  error,
  required = false,
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      return 'File size must be less than 2MB';
    }

    // Check file type
    if (!['image/png', 'image/jpeg'].includes(file.type)) {
      return 'Only PNG and JPEG files are supported';
    }

    return null;
  };

  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setPreview(null);
      onFileSelect(null);
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      // Pass the error back to parent component
      onFileSelect(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileSelect(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.[0]) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const hasFile = currentFile ?? preview;
  const hasError = Boolean(error);

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-black sm:text-base">
        Upload Thumbnail
      </label>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleInputChange}
        className="hidden"
      />

      <div
        onClick={openFileDialog}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative flex h-40 cursor-pointer items-center justify-center rounded px-4 text-center transition-all duration-200 ${
          hasError
            ? 'border-red-500 bg-red-50'
            : dragActive
              ? 'border-primary bg-blue-50'
              : 'border-gray-300 bg-gray-50 hover:border-primary hover:bg-blue-50'
        } ${hasFile ? 'border-solid' : ''} `}
      >
        {hasFile ? (
          // File Preview
          <div className="relative h-full w-full">
            {preview ? (
              <img
                src={preview}
                alt="Thumbnail preview"
                className="h-full w-full rounded object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <div className="text-center">
                  <CloudUploader />
                  <p className="text-sm text-gray-600">
                    {currentFile?.name ?? 'File selected'}
                  </p>
                </div>
              </div>
            )}

            {/* Remove button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          // Upload Prompt
          <div className="flex flex-col items-center space-y-3">
            <CloudUploader />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-black">
                Upload File: Max Of 2mb
              </p>
              <p className="text-xs text-gray-500">
                Supported Format: PNG, JPEG
              </p>
              {dragActive && (
                <p className="mt-1 text-xs text-primary">
                  Drop the file here...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Messages */}
      {hasError && (
        <div className="text-xs font-medium text-red-500">{error}</div>
      )}
    </div>
  );
};

export default ThumbnailUpload;
