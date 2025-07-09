import Image from 'next/image';
import { userStatsData } from '~/mocks/userEarning';
import { type StatsProps } from '~/types/userEarning';

const StatsCard = ({ data }: { data: StatsProps }) => {
  return (
    <div className="space-y-2 px-6 py-4 shadow-sm transition-all duration-200 hover:shadow-md">
      <Image
        src={data.icon}
        alt={data.title}
        width={20}
        height={20}
        style={{ background: data.iconBg }}
        className={`mb-2 size-8 rounded-md p-2`}
      />
      <p className="text-grey">{data.title}</p>
      <h2 className="text-2xl font-bold text-black">{data.value}</h2>
      {data.amount && <p className="font-bold text-primary">{data.amount}</p>}
      {data.tasksRemaining && (
        <p className="font-bold text-primary">{data.tasksRemaining}</p>
      )}
      {data.completionRate && (
        <p className="font-bold text-primary">{data.completionRate}</p>
      )}
    </div>
  );
};

export const UserStats = () => {
  return (
    <div className="mt-8">
      <h1 className="my-4 text-lg font-bold">Earnings and Reward</h1>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
        {userStatsData.map((data, idx) => (
          <StatsCard key={idx} data={data} />
        ))}
      </div>
    </div>
  );
};
