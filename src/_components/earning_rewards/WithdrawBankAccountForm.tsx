'use client';

import { useForm } from 'react-hook-form';
import { useBankWithdrawalMethod } from '~/hooks/transactionController';

interface BankWithdrawalFormData {
  amount: string;
  accountNumber: string;
  routingNumber: string;
  accountHolderName: string;
}

interface WithdrawBankAccountFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const WithdrawBankAccountForm = ({
  onSuccess,
  onClose,
}: WithdrawBankAccountFormProps) => {
  const bankWithdrawal = useBankWithdrawalMethod();

  const available = 0.03;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BankWithdrawalFormData>();

  const amount = watch('amount');

  const onSubmit = async (data: BankWithdrawalFormData) => {
    const withdrawalData = {
      amount: data.amount,
      bankAccountDetails: {
        accountNumber: data.accountNumber,
        routingNumber: data.routingNumber,
        accountHolderName: data.accountHolderName,
      },
    };

    try {
      await bankWithdrawal.mutateAsync(withdrawalData);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      // Error handling is done by the hook via toast notifications
      console.error('Bank withdrawal failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <div className="mb-1 flex items-center justify-between text-sm font-medium">
          <label htmlFor="amount" className="text-black">
            Enter Amount
          </label>
          <span className="text-xs text-primary">
            Available: {available} ETH
          </span>
        </div>
        <input
          id="amount"
          type="text"
          inputMode="decimal"
          {...register('amount', {
            required: 'Please enter an amount',
            pattern: {
              value: /^\d+(\.\d{1,2})?$/,
              message: 'Please enter a valid amount (up to 2 decimal places)',
            },
            validate: (value) => {
              const num = parseFloat(value);
              if (isNaN(num) || num <= 0) {
                return 'Amount must be greater than 0';
              }
              if (num > available) {
                return 'Amount exceeds available balance';
              }
              return true;
            },
          })}
          placeholder="enter amount"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.amount ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <p className="text-sm font-semibold">
        ≈ {amount ? parseFloat(amount || '0') * 2500 : 0} USD
      </p>

      <div>
        <label
          htmlFor="accountNumber"
          className="mb-1 block text-sm font-medium text-black"
        >
          Account Number
        </label>
        <input
          id="accountNumber"
          type="text"
          inputMode="numeric"
          {...register('accountNumber', {
            required: 'Please enter your account number',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Account number should only contain numbers',
            },
            minLength: {
              value: 8,
              message: 'Account number must be at least 8 digits',
            },
          })}
          placeholder="Enter Account Number"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.accountNumber ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.accountNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.accountNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="routingNumber"
          className="mb-1 block text-sm font-medium text-black"
        >
          Routing Number
        </label>
        <input
          id="routingNumber"
          type="text"
          inputMode="numeric"
          {...register('routingNumber', {
            required: 'Please enter your routing number',
            pattern: {
              value: /^[0-9]{9}$/,
              message: 'Routing number must be exactly 9 digits',
            },
          })}
          placeholder="Enter Routing Number"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.routingNumber ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.routingNumber && (
          <p className="mt-1 text-sm text-red-600">
            {errors.routingNumber.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="accountHolderName"
          className="mb-1 block text-sm font-medium text-black"
        >
          Account Holder Name
        </label>
        <input
          id="accountHolderName"
          type="text"
          {...register('accountHolderName', {
            required: 'Please enter the account holder name',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters',
            },
            pattern: {
              value: /^[a-zA-Z\s]+$/,
              message: 'Name should only contain letters and spaces',
            },
          })}
          placeholder="Enter account holder name"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.accountHolderName ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.accountHolderName && (
          <p className="mt-1 text-sm text-red-600">
            {errors.accountHolderName.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={bankWithdrawal.isPending}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {bankWithdrawal.isPending ? 'Processing...' : 'Proceed'}
      </button>
    </form>
  );
};
