'use client';

import { useState } from 'react';
import { TransactionTab } from './TransactionTab';
import { type TransactionProps } from '~/types/userEarning';
import { HiOutlineArrowNarrowDown } from 'react-icons/hi';
import { useTransactionHistory } from '~/hooks/transactionController';

const TABS = ['All', 'Earnings', 'Withdrawals'];
export type TabType = (typeof TABS)[number];

const TransactionCard = ({ data }: { data: TransactionProps }) => {
  const statusColor =
    {
      pending: 'text-grey-300',
      processing: 'text-primary',
      processed: 'text-primary',
      completed: 'text-success-600',
      failed: 'text-red-500',
      cancelled: 'text-red-500',
    }[data.status] || 'text-grey-300';

  const ethDisplay =
    data.eth === null
      ? '-'
      : data.eth > 0
        ? `+${data.eth} ETH`
        : `${data.eth} ETH`;

  return (
    <div className="w-full rounded-lg border-b py-4 md:flex md:items-center md:justify-between md:gap-4 md:border-none md:p-4">
      <div className="mb-2 flex items-center gap-4 md:mb-0">
        <div className="shrink-0 rounded-lg border-4 border-grey-200 p-2">
          <HiOutlineArrowNarrowDown
            strokeWidth={3}
            className="size-6 text-[#61C277] md:size-8"
          />
        </div>
        <p className="max-w-[200px] overflow-hidden text-ellipsis text-sm font-medium md:ml-4 md:max-w-none">
          {data.taskName}
        </p>
      </div>

      <div className="flex flex-col gap-1 pl-12 text-sm md:flex-row md:items-center md:gap-8 md:pl-0">
        <p className="whitespace-nowrap text-black">
          {new Date(data.time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>

        <p className="whitespace-nowrap font-medium text-black">{ethDisplay}</p>

        <p
          className={`text-right text-sm font-semibold capitalize md:text-left ${statusColor}`}
        >
          {data.status}
        </p>
      </div>
    </div>
  );
};

export const TransactionHistory = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const { data: transactionData, isLoading } = useTransactionHistory();

  if (isLoading) {
    return (
      <div className="mt-6 md:px-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-base font-bold">Transaction History</h1>
          <TransactionTab
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={TABS}
          />
        </div>
        <div className="mt-4 space-y-6">
          <p className="text-center text-gray-500">Loading transactions...</p>
        </div>
      </div>
    );
  }

  if (!transactionData) {
    return (
      <div className="mt-6 md:px-10">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-base font-bold">Transaction History</h1>
          <TransactionTab
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={TABS}
          />
        </div>
        <div className="mt-4 space-y-6">
          <p className="text-center text-gray-500">No transactions found</p>
        </div>
      </div>
    );
  }

  // Combine earnings and withdrawals into a unified format
  const allTransactions: TransactionProps[] = [
    ...(transactionData.earnings || []).map((earning) => ({
      taskName: earning.eventType ?? 'Task Completion',
      status: 'completed' as const,
      time: earning.timestamp,
      eth: parseFloat(earning.amount ?? '0'),
    })),
    ...(transactionData.withdrawals || []).map((withdrawal) => ({
      taskName: `${withdrawal.method.replace('_', ' ')} Withdrawal`,
      status: withdrawal.status.toLowerCase() as TransactionProps['status'],
      time: withdrawal.createdAt,
      eth: -parseFloat(withdrawal.amount),
    })),
  ];

  // Sort by time (most recent first)
  const sortedTransactions = allTransactions.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  // Filter transactions based on active tab
  const filteredTasks = sortedTransactions.filter((transaction) => {
    if (activeTab === 'Earnings') return transaction.eth >= 0;
    if (activeTab === 'Withdrawals') return transaction.eth < 0;
    return true;
  });

  return (
    <div className="mt-6 md:px-10">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <h1 className="text-base font-bold">Transaction History</h1>
        <TransactionTab
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabs={TABS}
        />
      </div>

      <div className="mt-4 space-y-6">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task, id) => (
            <TransactionCard data={task} key={id} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No transactions found for this filter
          </p>
        )}
      </div>
    </div>
  );
};
