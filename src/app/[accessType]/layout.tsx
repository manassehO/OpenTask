import { notFound } from 'next/navigation';
import AuthenticatedLayout from '~/_components/layout/AuthenticatedLayout';
import { TRPCProvider } from '~/hooks/queryClient';

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ accessType: string }>;
}
const validTypes = ['admin', 'creator', 'completer'];
export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { accessType } = await params;

  if (!validTypes.includes(accessType)) {
    notFound();
  }

  return (
    <TRPCProvider>
      <AuthenticatedLayout>
        {children}
      </AuthenticatedLayout>
    </TRPCProvider>
  );
}
