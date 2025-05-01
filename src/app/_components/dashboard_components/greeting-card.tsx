type GreetingCardProps = {
  name: string;
  className?: string;
} & React.HTMLProps<HTMLDivElement>;

const getTimeOfDay = () => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    hour12: false,
    timeZone
  });

  const hour = parseInt(formatter.format(new Date()), 10);

  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}
const greetings = [
  {
    time: 'morning',
    icon: '☀️',
  },
  {
    time: 'afternoon',
    icon: '🌞',
  },
  {
    time: 'evening',
    icon: '🌔',
  },
  {
    time: 'night',
    icon: '✨',
  }
]

function GreetingCard({ name, ...props }: GreetingCardProps) {
  const timeOfDay = getTimeOfDay();
  const greeting = greetings.find(g => g.time === timeOfDay);
  const greetingText = `Good ${greeting?.time} ${greeting?.icon}`;
  return (
    <div className={`flex flex-col capitalize ${props.className}`}>
      <span className="text-[#414141] font-semibold text-base">{greetingText}</span>
      <span className="text-[28px] font-bold">{name}</span>
    </div>
  )
}

export default GreetingCard