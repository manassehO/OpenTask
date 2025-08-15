'use client';

import { useProfile } from '~/app/api/profile';

const getTimeOfDay = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone,
  });

  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
};

const greetings = [
  { time: 'morning', icon: '☀️' },
  { time: 'afternoon', icon: '🌞' },
  { time: 'evening', icon: '🌔' },
  { time: 'night', icon: '✨' },
];

function GreetingCard() {
  const { user, isLoading } = useProfile();

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="h-2 w-56 animate-pulse rounded-full bg-gray-400"></div>
          <div className="size-4 animate-pulse rounded-full bg-gray-400"></div>
        </div>
        <div className="h-2 w-52 animate-pulse rounded-full bg-gray-400"></div>
      </div>
    );
  }

  const userName = user?.name
    ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
    : '';

  const timeOfDay = getTimeOfDay();
  const greeting = greetings.find((g) => g.time === timeOfDay);
  const greetingText = `Good ${greeting?.time} ${greeting?.icon}`;

  return (
    <div className="flex flex-col capitalize">
      <span className="text-base font-semibold text-[#414141]">
        {greetingText}
      </span>
      <span className="text-[28px] font-bold">{userName}</span>
    </div>
  );
}

export default GreetingCard;
