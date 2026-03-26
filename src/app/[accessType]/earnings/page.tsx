import { EarningChart } from '~/_components/earning_rewards/EarningChart';
import { TransactionHistory } from '~/_components/earning_rewards/TransactionHistory';
import { UserStats } from '~/_components/earning_rewards/UserStats';
import { WithdrawalOptions } from '~/_components/earning_rewards/WithdrawalOptions';

export default function EarningPage() {
  return (
    <div>
      <UserStats />
      <div className="mt-16 flex flex-col justify-between gap-4 md:flex-row">
        <div className="flex-1 flex-col gap-4">
          <EarningChart />
          <TransactionHistory />
        </div>
        <div className="min-w-[24.75rem]">
          <WithdrawalOptions />
        </div>
      </div>
    </div>
  );
}
