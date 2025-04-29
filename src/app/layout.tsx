import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";

import { TRPCReactProvider } from "~/trpc/react";

import { Provider } from "jotai";
import { DashboardNavbar } from "./_components/layout/dashboardNavbar";
import Footer from "./_components/layout/Footer";

export const metadata: Metadata = {
  title: "OpenTask",
  description: "Micro-task Management on the Blockchain",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} h-full`}>
      <body className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Provider>
          <DashboardNavbar />
          <main className="flex-1">
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
