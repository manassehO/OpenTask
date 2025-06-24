import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "~/styles/globals.css";
import { DashboardNavbar } from "../_components/layout/dashboardNavbar";
import SidebarWrapper from "../_components/layout/sidebarWrapper";

export const metadata: Metadata = {
  title: "OpenTask",
  description: "Micro-task Management on the Blockchain",
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-gray-50">
        <DashboardNavbar />
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
