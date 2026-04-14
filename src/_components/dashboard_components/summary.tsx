import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getUserStats } from '~/app/api/profile';
import { convertCurrency } from '~/lib/utils/coinGecko';

const Summary = () => {
  const { userStats, isLoading } = getUserStats();
  const [btcValue, setBtcValue] = useState<number | null>(null);

  useEffect(() => {
    if (userStats?.totalEarnings) {
      const fetchConversion = async () => {
        try {
          const btc = await convertCurrency(
            'usd',
            'bitcoin',
            +userStats.totalEarnings,
          );
          setBtcValue(btc);
        } catch (err) {
          console.error('Conversion failed', err);
        }
      };

      if (!btcValue) {
        void fetchConversion();
      }
    }
  }, [btcValue, userStats?.totalEarnings]);

  const summaryData = [
    {
      title: 'Total Earnings',
      amount: `$${userStats?.totalEarnings ?? 0}`,
      // cryptoAmount: '1,000 BTC',
      icon: '/icons/payments.svg',
      cryptoAmount: `${btcValue?.toFixed(5)} BTC`,
      bgColor: 'bg-[#F59E0B]/15',
    },
    {
      title: 'Total Tasks Completed',
      amount: userStats?.completedTasks ?? 0,
      // cryptoAmount: '2,500 ETH',
      icon: '/icons/task.svg',
      bgColor: 'bg-[#10B981]/15',
    },
    {
      title: 'Streak',
      amount: userStats?.currentStreak
        ? `${userStats.currentStreak} Days`
        : '0',
      // cryptoAmount: '0.5 BTC',
      icon: '/icons/streak.svg',
      bgColor: 'bg-[#06B6D41A]/15',
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 items-center justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {isLoading
        ? Array.from({ length: 3 }).map((_, index) => (
            <SummaryCardSkeleton key={index} />
          ))
        : summaryData.map((item, index) => (
            <div
              key={index}
              className="mb-4 flex h-[169px] w-full max-w-md flex-col items-center justify-between rounded-lg bg-white p-4 shadow-md lg:items-start"
            >
              <div className="flex flex-col items-center space-y-2 lg:items-start">
                <div
                  className={`flex items-center justify-center p-1 ${item.bgColor ?? ''} px-2`}
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

const SummaryCardSkeleton = () => {
  return (
    <div className="mb-4 flex h-[169px] w-full max-w-md animate-pulse flex-col items-center justify-between rounded-lg bg-white p-4 shadow-md lg:items-start">
      <div className="flex w-full flex-col items-center space-y-3 lg:items-start">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-200 p-2"></div>
        <div className="h-4 w-24 rounded bg-gray-200"></div>
        <div className="h-5 w-16 rounded bg-gray-200"></div>
      </div>
    </div>
  );
};
