import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import "~/styles/globals.css";
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
      <body className="bg-[#FAFAFA]">
        <SidebarWrapper>{children}</SidebarWrapper>
      </body>
    </html>
  );
}
