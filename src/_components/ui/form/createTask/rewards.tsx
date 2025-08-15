import { FinanceChipIcon, InfoIcon } from 'public/svg/generalSvg';
import React, { useEffect, useState } from 'react';
import FormHeader from '~/_components/creator/formHeader';
import { type RewardStructureValues, useTaskStore } from '~/store';
import { useForm } from 'react-hook-form';
import CurrencyDropdown from '../../inputs/CurrencyDropDown';
type Currency = 'ETH' | 'USDC' | 'DAI';

const currencies = [
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'USDC', name: 'USD Coin' },
  { symbol: 'DAI', name: 'Dai Stablecoin' },
];
function Rewards() {
  const store = useTaskStore();
  const [selectedCurrency, setSelectedCurrency] = useState('ETH');
  const [totalAmount, setTotalAmount] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const {
    rewardStructure: data,
    setRewardStructure: setData,
    canGoNext,
    canGoPrevious,
    goToNextStep: goNext,
    goToPreviousStep: goPrevious,
  } = store;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RewardStructureValues>({
    defaultValues: data,
    mode: 'onBlur',
  });
  const reward = watch('rewardPerSubmission');
  const maxSubmission = watch('maxSubmission');

  useEffect(() => {
    if (Number(reward) && Number(maxSubmission)) {
      setTotalAmount(reward * maxSubmission);
      setPlatformFee((totalAmount * 5) / 100);
    }
  }, [reward, maxSubmission]);
  const onSubmit = (formData: RewardStructureValues) => {
    setData({ ...formData, currency: selectedCurrency as Currency });
    if (canGoNext()) {
      goNext();
    }
  };
  return (
    <div className="max-w-2xl space-y-9 rounded-lg bg-white px-6 py-8">
      <div className="space-y-3">
        <FormHeader
          title="reward structure"
          subtitle="set up rewards and funding for your task"
        />
        <div className="space-y-4 bg-[#FDECCE4D] p-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <InfoIcon />
              <p className="text-sm font-semibold capitalize text-[#F59E0B]">
                funding information
              </p>
            </div>
            <p className="text-sm font-medium text-[#F59E0B]">
              you need to fund your task with cryptocurrency to pay rewards to
              your participants. the total budgetshould cover all expected
              submission plus platform fees
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#414141]">
            <FinanceChipIcon />
            <p className="text-sm font-semibold capitalize">
              Platform fee: 5% of total budget
            </p>
          </div>
        </div>
      </div>
      <form className="space-y-6">
        <div className="relative flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-medium capitalize text-black sm:text-base"
              htmlFor="rewardPerSubmission"
            >
              reward per submission
            </label>
            {errors.rewardPerSubmission && (
              <small className="break-words text-xs font-medium text-red-400 transition-opacity duration-200">
                {errors.rewardPerSubmission.message}
              </small>
            )}
          </div>
          <div className="relative flex flex-col">
            <input
              type="text"
              id="rewardPerSubmission"
              {...register('rewardPerSubmission', {
                required: 'Reward per submission is required',
                validate: (value) => {
                  const isValid = Number(value) > 0;
                  return isValid
                    ? true
                    : 'Reward per submission must be greater than 0';
                },
              })}
              placeholder="Enter Reward"
              className="h-14 rounded border border-[#D9D9D9] pl-6 outline-none focus:border-primary"
            />
            <div className="absolute right-3 top-1/2 w-fit -translate-y-1/2">
              <CurrencyDropdown
                setSelectedCurrency={setSelectedCurrency}
                selectedCurrency={selectedCurrency}
                currencies={currencies}
              />
            </div>
          </div>
          <p className="font-medium italic text-[#414141]">
            This is the amount each participant will recieve
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-medium capitalize text-black sm:text-base"
              htmlFor="maxSubmission"
            >
              maximum submissions
            </label>
            {errors.rewardPerSubmission && (
              <small className="break-words text-xs font-medium text-red-400 transition-opacity duration-200">
                {errors.maxSubmission?.message}
              </small>
            )}
          </div>
          <div className="flex flex-col">
            <input
              type="text"
              id="maxSubmission"
              {...register('maxSubmission', {
                required: 'maximum submissions is required',
                validate: (value) => {
                  const isValid = Number(value) > 0;
                  return isValid
                    ? true
                    : 'maximum submissions must be greater than 0';
                },
              })}
              placeholder="1000 "
              className="h-14 rounded border border-[#D9D9D9] pl-6 outline-none focus:border-primary"
            />
          </div>
          <p className="font-medium italic text-[#414141]">
            the task will automatically close after reaching number of
            participants{' '}
          </p>
        </div>
        <div className="space-y-3">
          <p className="text-sm font-medium capitalize text-black sm:text-base">
            budget calculation
          </p>
          <div className="space-y-5 rounded bg-[#FAFAFA] px-6 py-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium capitalize text-[#414141]">
                  reward per submission
                </p>
                <p className="text-sm font-medium capitalize text-[#414141]">
                  {reward} {' ' + selectedCurrency}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium capitalize text-[#414141]">
                  maximum submission
                </p>
                <p className="text-sm font-medium capitalize text-[#414141]">
                  {maxSubmission}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium capitalize text-[#414141]">
                  platform fee (5%)
                </p>
                <p className="text-sm font-medium capitalize text-[#414141]">
                  {platformFee} {' ' + selectedCurrency}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded bg-[#FFFFFF] px-6 py-4">
              <p className="text-sm font-medium capitalize text-black">
                total budget required
              </p>
              <p className="text-sm font-medium capitalize text-primary">
                {totalAmount} {selectedCurrency}
              </p>
            </div>
          </div>
        </div>
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
  );
}

export default Rewards;
