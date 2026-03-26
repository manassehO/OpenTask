'use client';

import { useForm } from 'react-hook-form';
import { useCryptoWithdrawalMethod } from '~/hooks/transactionController';

interface WithdrawFormData {
  currency: 'ETH' | 'BTC' | 'USDT';
  amount: string;
  address: string;
  tokenAddress: string;
}

interface WithdrawCryptoFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

export const WithdrawCryptoForm = ({
  onSuccess,
  onClose,
}: WithdrawCryptoFormProps) => {
  const cryptoWithdrawal = useCryptoWithdrawalMethod();

  const available = 0.03;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<WithdrawFormData>();

  const amount = watch('amount');

  const onSubmit = async (data: WithdrawFormData) => {
    const withdrawalData = {
      amount: data.amount,
      tokenAddress: data.tokenAddress,
      destinationAddress: data.address,
      currency: data.currency,
    };

    try {
      await cryptoWithdrawal.mutateAsync(withdrawalData);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      // Error handling is done by the hook via toast notifications
      console.error('Withdrawal failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-black">
          Cryptocurrency
        </label>
        <div className="relative">
          <select
            {...register('currency', {
              required: 'Please select a cryptocurrency',
            })}
            className={`w-full rounded-md border px-4 py-2 text-sm outline-none ${
              errors.currency
                ? 'border-red-300 text-red-900'
                : 'border-grey-50 text-black'
            }`}
          >
            <option value="" disabled>
              Select Currency
            </option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="USDT">Tether (USDT)</option>
          </select>
          {errors.currency && (
            <p className="mt-1 text-sm text-red-600">
              {errors.currency.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm font-medium">
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
              value: /^\d*\.?\d*$/,
              message: 'Please enter a valid number',
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
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-black"
        >
          Enter Address
        </label>
        <input
          id="address"
          type="text"
          {...register('address', {
            required: 'Please enter a wallet address',
            minLength: {
              value: 10,
              message: 'Address must be at least 10 characters',
            },
          })}
          placeholder="Enter Address"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.address ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="tokenAddress"
          className="mb-2 block text-sm font-medium text-black"
        >
          Token Contract Address
        </label>
        <input
          id="tokenAddress"
          type="text"
          {...register('tokenAddress', {
            required: 'Please enter the token contract address',
            minLength: {
              value: 10,
              message: 'Token address must be at least 10 characters',
            },
          })}
          placeholder="Enter token contract address"
          className={`w-full rounded-md border px-4 py-2 text-sm outline-none placeholder:text-gray-400 ${
            errors.tokenAddress ? 'border-red-300' : 'border-grey-50'
          }`}
        />
        {errors.tokenAddress && (
          <p className="mt-1 text-sm text-red-600">
            {errors.tokenAddress.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={cryptoWithdrawal.isPending}
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {cryptoWithdrawal.isPending ? 'Processing...' : 'Proceed'}
      </button>
    </form>
  );
};
