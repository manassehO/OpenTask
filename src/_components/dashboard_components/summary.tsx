import React from 'react';
import Image from 'next/image';

const summaryData = [
  {
    title: 'Total Earnings',
    amount: '$200,000',
    cryptoAmount: '1,000 BTC',
    icon: '/icons/payments.svg',
    bgColor: 'bg-[#F59E0B]/15',
  },
  {
    title: 'Total Tasks Completed',
    amount: '1,500',
    cryptoAmount: '2,500 ETH',
    icon: '/icons/task.svg',
    bgColor: 'bg-[#10B981]/15',
  },
  {
    title: 'Streak',
    amount: '30 Days',
    cryptoAmount: '0.5 BTC',
    icon: '/icons/streak.svg',
    bgColor: 'bg-[#06B6D41A]/15',
  },
];

const Summary = () => {
  return (
    <div className="grid w-full grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {summaryData.map((item, index) => (
        <div
          key={index}
          className="mb-4 flex h-[169px] w-full max-w-md flex-col items-center justify-between rounded-lg bg-white p-4 shadow-md lg:items-start"
        >
          <div className="flex flex-col items-center space-y-2 lg:items-start">
            <div
              className={`flex items-center justify-center p-1 ${item.bgColor} px-2`}
            >
              <Image
                src={item.icon}
                alt={item.title}
                width={24}
                height={24}
                className="h-6 w-6"
              />
            </div>
            <h3 className="text-gray-600">{item.title}</h3>
            <p className="text-lg font-semibold">{item.amount}</p>
            <span className="text-sm font-semibold text-[#3B82F6]">
              {item.cryptoAmount}
            </span>
            <div></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Summary;
