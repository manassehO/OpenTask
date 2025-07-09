// components/WithdrawForm.tsx
'use client';

import { useState } from 'react';

export const WithdrawBankAccountForm = () => {
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountName, setAccountName] = useState('');

  const available = 0.03;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ amount, selectedBank, accountNumber, accountName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
          pattern="^\d*\.?\d*$"
          value={amount}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*\.?\d*$/.test(val)) {
              setAmount(val);
            }
          }}
          placeholder="enter amount"
          className="w-full rounded-md border border-grey-50 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <p className="text-sm font-semibold">≈ 0</p>

      <div>
        <label className="mb-1 block text-sm font-medium text-black">
          Bank
        </label>
        <div className="relative">
          <select
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            className={`w-full rounded-md border border-grey-50 px-4 py-2 text-sm outline-none ${
              selectedBank === '' ? 'text-gray-400' : 'text-black'
            }`}
          >
            <option value="" disabled hidden>
              Select Bank
            </option>
            <option value="bank1">Bank One</option>
            <option value="bank2">Bank Two</option>
            <option value="bank3">Bank Three</option>
          </select>
        </div>
      </div>

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
          pattern="[0-9]*"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter Account Number"
          className="w-full rounded-md border border-grey-50 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <div>
        <label
          htmlFor="Account Name"
          className="mb-1 block text-sm font-medium text-black"
        >
          Account Name
        </label>
        <input
          id="Account Name"
          type="text"
          value={accountName}
          onChange={(e) => setAccountName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-md border border-grey-50 px-4 py-2 text-sm outline-none placeholder:text-gray-400"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-primary/80"
      >
        Proceed
      </button>
    </form>
  );
};
