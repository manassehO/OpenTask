import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "~/styles/globals.css";
import { DashboardNavbar } from "../_components/layout/dashboardNavbar";
import SidebarWrapper from "../_components/layout/sidebarWrapper";
import RightBar from "../_components/layout/RightBar";


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
      <body>
        <DashboardNavbar />
        <SidebarWrapper>{children}</SidebarWrapper>
       <RightBar />
      </body>
    </html>
  );
}
