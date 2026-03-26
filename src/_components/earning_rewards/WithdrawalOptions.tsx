'use client';

import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { type WithdrawalProps } from '~/types/userEarning';
import { Modal } from './Modal';
import { WithdrawCryptoForm } from './WithdrawCryptoForm';
import { WithdrawBankAccountForm } from './WithdrawBankAccountForm';
import { useGetWithdrawalMethods } from '~/hooks/transactionController';
import { FaSpinner } from 'react-icons/fa6';

const WithdrawalCard = ({ data }: { data: WithdrawalProps }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (data.status) setOpen(true);
  };

  return (
    <>
      <div className="flex w-full max-w-sm flex-col gap-2 rounded-lg border border-neutral-50 p-4 transition-all duration-200 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Image src={data.icon} alt={data.method} width={20} height={20} />
            <p className="font-bold capitalize">{data.method}</p>
          </div>
          <button
            className={`rounded-[12px] border px-4 text-sm ${data.status ? 'border-success-600 bg-success-100 text-success-600' : 'border-neutral-400 bg-neutral-50 text-neutral-400'}`}
          >
            {data.status ? 'Available' : 'Not Available'}
          </button>
        </div>
        <p className="my-2 text-grey">{data.description}</p>
        <button
          onClick={handleOpen}
          disabled={data.status}
          className={`rounded-md py-3 ${data.status ? 'cursor-pointer bg-primary hover:bg-primary/80' : 'cursor-not-allowed bg-grey hover:bg-grey/80'} text-white transition-all duration-200`}
        >
          {data.action}
        </button>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          data.method.toLowerCase() === 'CRYPTO WALLET'.toLowerCase()
            ? 'Withdraw Crypto'
            : 'Withdraw to Account'
        }
      >
        {data.method.toLowerCase() === 'Crypto Wallet'.toLowerCase() && (
          <WithdrawCryptoForm />
        )}
        {data.method.toLowerCase() === 'Bank Account'.toLowerCase() && (
          <WithdrawBankAccountForm />
        )}
      </Modal>
    </>
  );
};

export const WithdrawalOptions = () => {
  const [withDrawalMethods, setWithDrawalMethods] = useState<WithdrawalProps[]>(
    [],
  );
  const { methods, isLoading } = useGetWithdrawalMethods();
  useEffect(() => {
    console.log('methods updated', methods);
    console.log('isLoading', isLoading);
    if (!isLoading && methods) {
      const withdrawalMethod = methods.map((method) => {
        return {
          method: method.method.replace('_', ' ').toLowerCase(),
          status: method.isActive,
          description: method.details
            ? `Withdraw via ${method.name}`
            : 'Coming Soon',
          action:
            method.method.toLowerCase() === 'BANK_ACCOUNT'.toLowerCase()
              ? 'Withdraw to Account'
              : 'Withdraw to Wallet',
          icon:
            method.method.toLowerCase() === 'BANK_ACCOUNT'.toLowerCase()
              ? '/icons/wallet-2.svg'
              : '/icons/dollar.svg',
        };
      });
      setWithDrawalMethods(withdrawalMethod);
      console.log(methods, isLoading);
    }
  }, [isLoading, methods]);

  return (
    <div className="flex flex-col gap-4">
      {isLoading ? (
        <div className="absolute">
          <FaSpinner />
        </div>
      ) : (
        withDrawalMethods.map((data, id) => (
          <WithdrawalCard data={data} key={id} />
        ))
      )}
    </div>
  );
};
