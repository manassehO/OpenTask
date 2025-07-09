'use client';

import { useState } from 'react';

export const WithdrawCryptoForm = () => {
  const [currency, setCurrency] = useState('');
  const [amount, setAmount] = useState('');
  const [address, setAddress] = useState('');

  const available = 0.03;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({ currency, amount, address });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-black">
          Cryptocurrency
        </label>
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className={`w-full rounded-md border border-grey-50 px-4 py-2 text-sm outline-none ${
              currency === '' ? 'text-gray-400' : 'text-black'
            }`}
          >
            <option value="" disabled hidden>
              Select Currency
            </option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="USDT">Tether (USDT)</option>
          </select>
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
        <label
          htmlFor="address"
          className="mb-2 block text-sm font-medium text-black"
        >
          Enter Address
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter Address"
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
