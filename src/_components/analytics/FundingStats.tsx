import React from 'react';
import { type BudgetType, type PaymentDetailType } from '~/types/analytics';

const budgetData: BudgetType = {
  totalBudget: 0.5,
  spent: 0.24,
  remaining: 0.26,
  usage: 40,
};
const paymentDetails: PaymentDetailType = {
  rewardSubmission: 0.5,
  aprrovedSubmission: 21,
  totalPaid: 0.26,
  platformFee: 0.0011,
};
const BudgetOverview = ({ budget }: { budget: BudgetType }) => {
  return (
    <div className="flex flex-1 flex-col bg-white px-6 pt-4 text-black shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
      <h1 className="text-lg font-bold">Budget Overview</h1>
      <div className="mt-4 space-y-2 border-b border-neutral-50 pb-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Total Budget:</p>
          <p className="text-primary">{budget.totalBudget} ETH</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Spent So Far:</p>
          <p className="text-primary">{budget.spent} ETH</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Remaining:</p>
          <p className="text-primary">{budget.remaining} ETH</p>
        </div>
      </div>
      <div className="mt-4 pb-8">
        <div className="mb-2 flex justify-between text-sm font-medium text-grey">
          <span className="text-grey">Budget Usage:</span>
          <span className="text-primary">{`${budget.usage}%`}</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-main-50">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${budget.usage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentDetails = ({ payment }: { payment: PaymentDetailType }) => {
  return (
    <div className="flex flex-1 flex-col bg-white px-6 pt-4 text-black shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md">
      <h1 className="text-lg font-bold">Payment Details</h1>
      <div className="mt-4 space-y-2 border-b border-neutral-50 pb-4">
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Reward Per Submission:</p>
          <p className="text-primary">{payment.rewardSubmission} ETH</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Approved Submissions:</p>
          <p className="text-primary">{payment.aprrovedSubmission}</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p className="text-grey">Total Paid To Taskers</p>
          <p className="text-primary">{payment.totalPaid} ETH</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between pb-8 text-sm">
        <p className="text-xs text-grey">Platform Fee (5%)</p>
        <p className="text-primary">{payment.platformFee} ETH</p>
      </div>
    </div>
  );
};
export const FundingStats = () => {
  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <BudgetOverview budget={budgetData} />
        <PaymentDetails payment={paymentDetails} />
      </div>
    </div>
  );
};
