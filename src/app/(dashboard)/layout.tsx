import { type Metadata } from 'next';
import { DashboardNavbar } from '~/_components/layout/dashboardNavbar';
import { ProtectedDashboard } from '~/_components/layout/ProtectedDashboard';
import SidebarWrapper from '~/_components/layout/sidebarWrapper';
import { TRPCProvider } from '~/hooks/queryClient';
import '~/styles/globals.css';

export const metadata: Metadata = {
  title: 'OpenTask',
  description: 'Micro-task Management on the Blockchain',
  icons: [{ rel: 'icon', url: '/logo.svg' }],
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <TRPCProvider>
      <ProtectedDashboard>
        <DashboardNavbar />
        <SidebarWrapper role="user">{children}</SidebarWrapper>
      </ProtectedDashboard>
    </TRPCProvider>
  );
}
