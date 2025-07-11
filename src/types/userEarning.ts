export type StatsProps = {
  icon: string;
  iconBg: string;
  title: string;
  value: string;
  amount?: string;
  tasksRemaining?: string;
  completionRate?: string;
};

export type EarningDataProps = {
  date: string;
  eth: number;
};

export type TransactionProps = {
  taskName: string;
  status: string;
  time: string;
  eth: number | null;
};

export type WithdrawalProps = {
  type: string;
  description: string;
  action: string;
  status: string;
  icon: string;
};
