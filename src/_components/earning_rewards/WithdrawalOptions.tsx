'use client';

import Image from 'next/image';
import React, { useState } from 'react';
import { withdrawalData } from '~/mocks/userEarning';
import { type WithdrawalProps } from '~/types/userEarning';
import { Modal } from './Modal';
import { WithdrawCryptoForm } from './WithdrawCryptoForm';
import { WithdrawBankAccountForm } from './WithdrawBankAccountForm';

const WithdrawalCard = ({ data }: { data: WithdrawalProps }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    if (data.status === 'Available') setOpen(true);
  };

  return (
    <>
      <div className="flex min-w-fit flex-col gap-2 rounded-lg border border-neutral-50 p-4 transition-all duration-200 hover:scale-105 hover:shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Image src={data.icon} alt={data.type} width={20} height={20} />
            <p className="font-bold">{data.type}</p>
          </div>
          <button
            className={`rounded-[12px] border px-4 text-sm ${data.status === 'Available' ? 'bg-neutral-50-100 border-success-600 bg-success-100 text-success-600' : 'border-neutral-400 bg-neutral-50 text-neutral-400'}`}
          >
            {data.status}
          </button>
        </div>
        <p className="my-2 text-grey">{data.description}</p>
        <button
          onClick={handleOpen}
          disabled={data.status !== 'Available'}
          className={`rounded-md py-3 ${data.status === 'Available' ? 'bg-primary hover:bg-primary/80' : 'bg-grey hover:bg-grey/80'} text-white transition-all duration-200`}
        >
          {data.action}
        </button>
      </div>
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={
          data.type === 'Crypto Wallet'
            ? 'Withdraw Crypto'
            : 'Withdraw to Account'
        }
      >
        {data.type === 'Crypto Wallet' && <WithdrawCryptoForm />}
        {data.type === 'Bank Account' && <WithdrawBankAccountForm />}
      </Modal>
    </>
  );
};

export const WithdrawalOptions = () => {
  return (
    <div className="flex flex-col gap-4">
      {withdrawalData.map((data, id) => (
        <WithdrawalCard data={data} key={id} />
      ))}
    </div>
  );
};
