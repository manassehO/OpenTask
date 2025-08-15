import React from 'react';
import { useForm } from 'react-hook-form';
import FormHeader from '~/_components/creator/formHeader';
import { type DistributionValues, useTaskStore } from '~/store';
import FormInput from '../../inputs/FormInput';

function Distribution() {
  const store = useTaskStore();
  const {
    setDistribution: setData,
    canGoNext,
    canGoPrevious,
    goToNextStep: goNext,
    goToPreviousStep: goPrevious,
  } = store;

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<DistributionValues>();

  const onSubmit = (formData: DistributionValues) => {
    setData(formData);
    if (canGoNext()) {
      goNext();
    }
  };
  return (
    <div className="max-w-2xl space-y-9 rounded-lg bg-white px-6 py-8">
      <FormHeader
        title="distribution"
        subtitle="Describe what users needs to complete your task"
      />
      <div>
        <form className="space-y-6">
          <FormInput
            id="launchTime"
            label="launch Time"
            register={register}
            error={errors.launchTime}
            placeholder="Select Timing"
            validationRules={{
              required: 'Launch Time is required',
              validate: (value) => {
                return value ? true : 'launch Time is required';
              },
            }}
          />
          <FormInput
            id="visibilitySetting"
            label="visibility Setting"
            error={errors.visibilitySetting}
            register={register}
            placeholder="enter deadline"
            type="date"
            validationRules={{
              required: 'Deadline is required',
            }}
          />
          <FormInput
            id="userTargeting"
            label="User Targeting"
            error={errors.userTargeting}
            placeholder="Enter requirement"
            validationRules={{
              required: 'User Targeting is required',
            }}
            register={register}
          />
        </form>
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
            onClick={handleSubmit(onSubmit)}
          >
            proceed
          </button>
        </div>
      </div>
    </div>
  );
}

export default Distribution;
