import { type ProgressBarProps } from '~/types/analytics';

export const Progress = ({ data }: { data: ProgressBarProps }) => {
  const MAX_HOURS = 24;

  const isTime = data.text.toLowerCase().includes('time');
  const normalizedWidth = isTime ? (data.value / MAX_HOURS) * 100 : data.value;

  return (
    <div>
      <div className="mb-2 flex justify-between text-sm font-medium text-grey">
        <span>{data.text}</span>
        <span className="text-primary">
          {isTime ? `${data.value} Hours` : `${data.value}%`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-main-50">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${normalizedWidth}%` }}
        />
      </div>
    </div>
  );
};
