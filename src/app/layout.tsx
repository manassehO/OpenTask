import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { Provider } from 'jotai';
import { type Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import { Toaster } from 'sonner';

import { TRPCReactProvider } from '~/trpc/react';

// import Footer from "./_components/layout/Footer";

export const metadata: Metadata = {
  title: 'OpenTask',
  description: 'Micro-task Management on the Blockchain',
  icons: [{ rel: 'icon', url: '/logo.svg' }],
};

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html className={`${GeistSans.variable} ${dmSans.variable}`}>
      <body className={dmSans.className}>
        <Provider>
          <Toaster richColors position="top-right" />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Provider>
      </body>
    </html>
  );
}
