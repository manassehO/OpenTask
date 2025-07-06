import { type OverviewItem } from '~/types/analytics';

export const OverviewCard = ({
  title,
  value,
  approve,
  percentage,
  review,
}: OverviewItem) => {
  return (
    <div className="rounded-sm bg-white p-4 shadow-sm transition-all duration-200 hover:scale-105">
      <p className="text-sm text-grey">{title}</p>

      <h3 className="mt-1 text-2xl font-semibold">{value}</h3>

      <div className="mt-2 space-y-1">
        {approve && (
          <p className="text-sm font-medium text-primary">{approve}</p>
        )}
        {percentage && (
          <p className="text-sm font-medium text-primary">{percentage}</p>
        )}
        {review && <p className="text-sm font-medium text-primary">{review}</p>}
      </div>
    </div>
  );
};
