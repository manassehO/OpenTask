import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '../../inputs/FormInput';
import FormTextArea from '../../inputs/FormTextArea';
import FormSelectInput from '../../inputs/FormSelectInput';
import { useTaskStore } from '~/store/taskStore';
import ThumbnailUpload from '../../inputs/ThumbnailUpload';

type BasicInformationValues = {
  title: string;
  taskDescription: string;
  category: string;
  tags: string;
  thumbnail?: File | null;
};

const categoryOptions = ['web3', 'tech', 'web2'];

function BasicInformation() {
  const { basicInformation, setBasicInformation, setCurrentStep } =
    useTaskStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileSelect = (file: File | null) => {
    setUploadError(''); // Clear previous errors

    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError('File size must be less than 2MB');
        return;
      }

      if (!['image/png', 'image/jpeg'].includes(file.type)) {
        setUploadError('Only PNG and JPEG files are supported');
        return;
      }
    }

    setSelectedFile(file);
  };

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<BasicInformationValues>({
    defaultValues: basicInformation,
    mode: 'onBlur',
  });

  const submit = (data: BasicInformationValues) => {
    if (!selectedFile) {
      setUploadError('Thumbnail is required');
      return;
    }

    const formDataWithThumbnail = {
      ...data,
      thumbnail: selectedFile,
    };

    console.log('Submitted Data:', formDataWithThumbnail);
    setBasicInformation(formDataWithThumbnail);

    setCurrentStep(1);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(submit)}>
      {/* Title Field */}
      <FormInput
        id="title"
        register={register}
        label="Title"
        error={errors.title}
        touched={touchedFields.title}
        extraDescription="Max 60 characters"
        placeholder="Enter title"
        validationRules={{
          required: 'Title is required',
        }}
      />

      {/* Task Description Field */}
      <FormTextArea
        id="taskDescription"
        register={register}
        label="Task Description"
        placeholder="Enter description"
        error={errors.taskDescription}
        touched={touchedFields.taskDescription}
        validationRules={{
          required: 'Task description is required',
        }}
      />

      {/* Thumbnail Upload */}
      <ThumbnailUpload
        onFileSelect={handleFileSelect}
        currentFile={selectedFile}
        error={uploadError}
        required={true}
      />

      {/* Category Select */}
      <FormSelectInput
        id="category"
        register={register}
        label="Category"
        options={categoryOptions}
        placeholder="Select category"
        error={errors.category}
        touched={touchedFields.category}
        validationRules={{
          required: 'Category is required',
        }}
      />

      {/* Tags Field */}
      <FormInput
        id="tags"
        register={register}
        label="Tags"
        error={errors.tags}
        touched={touchedFields.tags}
        placeholder="Enter tags (comma separated)"
        validationRules={{
          required: 'Tag is required',
        }}
      />

      {/* Submit Button */}
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="w-full max-w-44 rounded bg-primary p-2.5 capitalize text-white transition-colors hover:bg-primary/90"
        >
          Proceed
        </button>
      </div>
    </form>
  );
}

export default BasicInformation;
