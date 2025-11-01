import {
  type EarningDataProps,
  type StatsProps,
  type TransactionProps,
  type WithdrawalProps,
} from '~/types/userEarning';

export const userStatsData: StatsProps[] = [
  {
    icon: '/icons/payments-cyan.svg',
    title: 'Total Earned',
    value: '0.00 ETH',
    amount: '$0.00',
    iconBg: '#06B6D41A',
  },
  {
    icon: '/icons/account_balance_wallet.svg',
    title: 'Available Balance',
    value: '0.00 ETH',
    amount: '$0.00',
    iconBg: '#CB00A31A',
  },
  {
    icon: '/icons/inactive_order.svg',
    title: 'Pending Rewards',
    value: '20 Days',
    tasksRemaining: '0 Tasks In Review',
    iconBg: '#D47B061A',
  },
  {
    icon: '/icons/inventory.svg',
    title: 'Task Completed',
    value: '0',
    completionRate: '0% Success Rate',
    iconBg: '#D406061A',
  },
];

export const earningData: EarningDataProps[] = [
  { date: '2025-10-31', eth: 0.11 },
  { date: '2025-10-29', eth: 0.14 },
  { date: '2025-10-28', eth: 0.16 },
  { date: '2025-10-29', eth: 0.05 },
  { date: '2025-10-22', eth: 0.08 },
  { date: '2025-10-25', eth: 0.1 },
  { date: '2025-10-24', eth: 0.1 },
  { date: '2025-10-23', eth: 0.09 },
  { date: '2025-10-29', eth: 0.13 },
  { date: '2025-10-21', eth: 0.05 },
  { date: '2025-10-30', eth: 0.04 },
  { date: '2025-10-29', eth: 0.1 },
  { date: '2025-10-28', eth: 0.1 },
  { date: '2025-10-27', eth: 0.03 },
  { date: '2025-10-26', eth: 0.05 },
  { date: '2025-10-25', eth: 0.02 },
  { date: '2025-10-24', eth: 0.01 },
  { date: '2025-10-23', eth: 0.04 },
  { date: '2025-10-22', eth: 0.03 },
  { date: '2025-10-21', eth: 0.02 },
  { date: '2025-10-20', eth: 0.04 },
  { date: '2025-10-19', eth: 0.05 },
  { date: '2025-10-18', eth: 0.02 },
  { date: '2025-11-1', eth: 0.03 },
];

export const transactionData: TransactionProps[] = [];

// export const withdrawalData: WithdrawalProps[] = [
//   {
//     type: 'Crypto Wallet',
//     description: 'Withdraw directly to your connected wallet',
//     icon: '/icons/wallet-2.svg',
//     action: 'Withdraw to Wallet',
//     status: 'Available',
//   },
//   {
//     type: 'Bank Account',
//     description: 'Withdraw directly to your bank account',
//     icon: '/icons/dollar.svg',
//     action: 'Withdraw To Account',
//     status: 'Available',
//   },

//   {
//     type: 'Gift Cards',
//     description: 'Convert your earnings to popular gift cards',
//     icon: '/icons/card.svg',
//     action: 'Browse Gift Cards',
//     status: 'Not Available',
//   },
// ];
