import { type ReactNode } from 'react';

export type StatsCardProps = {
  icon: ReactNode;
  title: string;
  statsNumber: string;
  linkHref: string;
  linkName: string;
};
