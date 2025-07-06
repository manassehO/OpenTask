import Image from 'next/image';
import { type ActivityProp } from '~/types/analytics';

export const ActivityCard = ({ title, icon, text, time }: ActivityProp) => {
  return (
    <div className="w-full rounded-[12px] border border-grey-50 bg-white px-6 py-4 hover:shadow-sm">
      <div className="flex items-center gap-8">
        <div className="flex w-12 items-center justify-center rounded-full bg-secondary-50 p-3">
          <Image src={icon} alt={title} width={20} height={20} />
        </div>
        <div>
          <h2 className="mb-1 text-base font-bold md:text-lg">{title}</h2>
          <p className="text-grey max-sm:text-sm">{text}</p>
          <p className="text-grey max-sm:text-sm">{time}</p>
        </div>
      </div>
    </div>
  );
};
