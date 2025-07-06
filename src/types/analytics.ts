export type OverviewItem = {
  title: string;
  value: string;
  review?: string;
  percentage?: string;
  approve?: string;
};
export type TaskDetailType = {
  description: string;
  instructions: string[];
  requirements: string[];
};

export type ActivityProp = {
  title: string;
  text: string;
  time: string;
  icon: string;
};

export type ProgressBarProps = {
  value: number;
  text: string;
};

export type SubmissionProps = {
  name: string;
  submittedAt: string;
  status: string;
  quality: number;
  image?: string;
};

export type Column<T> = {
  label: string;
  key?: keyof T;
  render?: (row: T, index: number) => React.ReactNode;
  align?: 'start' | 'center' | 'end';
};

type TableProps = {
  className?: string;
  emptyText?: string;
};

export type ReusableTableProps<T> = TableProps & {
  data: T[];
  columns: Column<T>[];
  showSerialNumber?: boolean;
};
export type BudgetType = {
  totalBudget: number;
  spent: number;
  remaining: number;
  usage: number;
};

export type PaymentDetailType = {
  rewardSubmission: number;
  aprrovedSubmission: number;
  totalPaid: number;
  platformFee: number;
};

export type Transaction = {
  type: string;
  image: string;
  recipient: string;
  date: string;
  status: string;
  amount: string;
};
