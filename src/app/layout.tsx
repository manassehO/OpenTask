import '~/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';

import { TRPCReactProvider } from '~/trpc/react';

import { Provider } from 'jotai';
import { ToastProvider } from '~/store/ToastProvider';
// import Footer from "./_components/layout/Footer";

export const metadata: Metadata = {
  title: 'OpenTask',
  description: 'Micro-task Management on the Blockchain',
  icons: [{ rel: 'icon', url: '/logo.svg' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ToastProvider>
          <Provider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </Provider>
        </ToastProvider>
      </body>
    </html>
  );
}
