import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { DashboardNavbar } from '~/_components/layout/dashboardNavbar';
import { ProtectedDashboard } from '~/_components/layout/ProtectedDashboard';
import SidebarWrapper from '~/_components/layout/sidebarWrapper';
import { TRPCProvider } from '~/hooks/queryClient';
import '~/styles/globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: 'OpenTask',
  description: 'Micro-task Management on the Blockchain',
  icons: [{ rel: 'icon', url: '/logo.svg' }],
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <TRPCProvider>
          <ProtectedDashboard>
            <DashboardNavbar />
            <SidebarWrapper role="user">{children}</SidebarWrapper>
          </ProtectedDashboard>
        </TRPCProvider>
      </body>
    </html>
  );
}
