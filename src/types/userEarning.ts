export type StatsProps = {
  icon: string;
  iconBg: string;
  title: string;
  value: string;
  amount?: string | number;
  tasksRemaining?: string;
  completionRate?: string;
};

export type EarningDataProps = {
  date: string;
  eth: number;
};

export type TransactionProps = {
  taskName: string;
  status:
    | 'pending'
    | 'processing'
    | 'processed'
    | 'completed'
    | 'failed'
    | 'cancelled';
  time: string;
  eth: number | null;
};

export type WithdrawalProps = {
  method: string;
  description: string;
  action: string;
  status: boolean;
  icon: string;
  accountNumber?: string;
  walletAddress?: string;
};

export type CryptoWithdrawalParams = {
  amount: string;
  tokenAddress: string;
  destinationAddress: string;
  currency: 'ETH' | 'BTC' | 'USDT';
};

export type BankWithdrawalParams = {
  amount: string;
  bankAccountDetails: {
    accountNumber: string;
    routingNumber: string;
    accountHolderName: string;
  };
};
