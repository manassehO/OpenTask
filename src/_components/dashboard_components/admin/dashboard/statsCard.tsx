import Link from 'next/link';
import { ArrowOutWard } from 'public/svg/generalSvg';
import { type FC } from 'react';
import { type StatsCardProps } from '~/types/statsCard';
export const StatsCard: FC<StatsCardProps> = ({
  title,
  icon,
  linkHref,
  linkName,
  statsNumber,
}) => {
  return (
    <div className="rounded-md bg-white px-5 pb-5 pt-5">
      <div className="space-y-4">
        <div className="size-8 rounded bg-[#D8E6FD66] p-2 text-[#3B82F6]">
          {icon}
        </div>
        <div className="space-y-1">
          <p className="text-xs font-semibold capitalize text-[#414141]">
            {title}
          </p>
          <p className="text-[1.75rem] font-bold text-black">{statsNumber}</p>
          <Link
            href={linkHref}
            className="flex items-center gap-1 text-base font-semibold capitalize text-[#3B82F6] transition duration-200 ease-in-out hover:text-[#3B82F6]/70"
          >
            {linkName}
            <ArrowOutWard />
          </Link>
        </div>
      </div>
    </div>
  );
};
