import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { DashboardNavbar } from '~/_components/layout/dashboardNavbar';
import SidebarWrapper from '~/_components/layout/sidebarWrapper';
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // switch between user roles for testing purposes and development
  // const userRole = 'creator';
  // const userRole = 'admin';
  const userRole = 'admin';

  return (
    <html lang="en" className={`${GeistSans.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <DashboardNavbar />
        <SidebarWrapper role={userRole}>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
