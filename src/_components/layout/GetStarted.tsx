import { ReactNode } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import { useRouter } from 'next/navigation';
import { CIcons } from '../ui/CIcons';

const GetStarted = ({ component }: { component: ReactNode }) => {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{component}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 border border-gray-200 bg-white/95 shadow-lg backdrop-blur-md">
        {routes.map((route) => (
          <DropdownMenuItem
            key={route.name}
            onClick={() => router.push(route.url)}
            className="group border-none"
          >
            <route.icon className="flex-shrink-0 group-hover:hidden" />

            <span className="text-base group-hover:!text-gray-500">
              {route.name}
            </span>
            <CIcons.longArrowRight className="ml-auto hidden flex-shrink-0 group-hover:block" />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default GetStarted;

const routes = [
  {
    icon: CIcons.smeOutline,
    icon2: CIcons.smeSolid,
    name: 'Completer',
    url: '/completer/register',
  },
  {
    icon: CIcons.investorOutline,
    icon2: CIcons.investorSolid,
    name: 'Creator',
    url: '/creator/register',
  },
];
