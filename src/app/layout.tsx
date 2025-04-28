import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { Provider } from "jotai";
import { DashboardNavbar } from "./_components/layout/dashboardNavbar";

export const metadata: Metadata = {
  title: "OpenTask",
  description: "Micro-task Management on the Blockchain",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="flex h-full w-full flex-col bg-[#FAFAFA]">
        <Provider>
          <DashboardNavbar />
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </Provider>
      </body>
    </html>
  );
}
