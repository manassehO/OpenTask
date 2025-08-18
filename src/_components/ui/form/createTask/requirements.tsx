import React from 'react';
import { useForm } from 'react-hook-form';
import type { RequirementsValues } from '../../../../types/task';
import { useTaskStore } from '~/store/taskStore';
import FormTextArea from '../../inputs/FormTextArea';
import FormSelectInput from '../../inputs/FormSelectInput';
import FormInput from '../../inputs/FormInput';
import FormHeader from '~/_components/creator/formHeader';

function RequirementsComponent() {
  const store = useTaskStore();
  const submissionFormat = [
    'Select format',
    'Document',
    'code',
    'Design',
    'video',
    'Link/UR',
    'Other',
  ];

  const {
    requirements: data,
    setRequirements: setData,
    canGoNext,
    canGoPrevious,
    goToNextStep: goNext,
    goToPreviousStep: goPrevious,
  } = store;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequirementsValues>({
    defaultValues: data,
    mode: 'onBlur',
  });

  const onSubmit = (formData: RequirementsValues) => {
    setData(formData);
    if (canGoNext()) {
      goNext();
    }
  };

  return (
    <div className="max-w-2xl space-y-9 rounded-lg bg-white px-6 py-8">
      <FormHeader
        title="requirements"
        subtitle="Describe what users needs to complete your task"
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Task Instructions */}
        <div className="relative flex flex-col gap-3">
          <FormTextArea
            id="instruction"
            register={register}
            label="step by step instruction"
            placeholder="enter instruction"
            validationRules={{
              required: 'Instructions are required',
              minLength: {
                value: 10,
                message: 'Instructions must be at least 10 characters',
              },
            }}
            error={errors.instruction}
          />
        </div>

        {/* Example (Optional) */}
        <div className="relative flex flex-col gap-3">
          <FormTextArea
            label="example (optional)"
            register={register}
            id="example"
            placeholder="Provide an example if helpful..."
            className="h-36 border-0 bg-[#FAFAFA] focus:border focus:border-primary"
          />
        </div>

        {/* Submission Format */}
        <div className="relative flex flex-col gap-3">
          <FormSelectInput
            id="submissionFormat"
            validationRules={{
              required: 'Submission format is required',
              validate: (value) => {
                const isValid =
                  value?.toLowerCase() !== submissionFormat[0]?.toLowerCase();
                return isValid ? true : 'Submission format is required';
              },
            }}
            register={register}
            label="Submission Format"
            options={submissionFormat}
            error={errors.submissionFormat}
          />
        </div>

        {/* Deadline */}
        <div className="relative flex flex-col gap-3">
          <FormInput
            type="date"
            id="deadline"
            label="Deadline"
            register={register}
            error={errors.deadline}
            validationRules={{
              required: 'Deadline is required',
            }}
            placeholder="enter deadline"
          />
        </div>

        {/* Qualification Requirements */}
        <div className="relative flex flex-col gap-3">
          <FormInput
            placeholder="enter requirement"
            id="qualification"
            label="Qualification Requirements"
            register={register}
            error={errors.qualification}
            validationRules={{
              required: 'Qualification requirements are required',
              minLength: {
                value: 5,
                message: 'Qualification must be at least 5 characters',
              },
            }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex w-full items-start justify-between gap-4 pt-4">
          <button
            type="button"
            onClick={() => {
              if (canGoPrevious()) {
                goPrevious();
              }
            }}
            disabled={!canGoPrevious()}
            className="w-full max-w-44 rounded bg-gray-500 px-6 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <button
            type="submit"
            className="w-full max-w-44 rounded bg-primary p-2.5 capitalize text-white"
          >
            proceed
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequirementsComponent;
