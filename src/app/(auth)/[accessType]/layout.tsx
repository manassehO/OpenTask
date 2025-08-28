import { UserType } from '@/lib/utils';
import { notFound } from 'next/navigation';

const validTypes = Object.keys(UserType);

export default async function AuthLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ accessType: string }>;
}>) {
  const { accessType } = await params;
  if (!validTypes.includes(accessType)) {
    notFound();
  }
  return <main>{children}</main>;
}
