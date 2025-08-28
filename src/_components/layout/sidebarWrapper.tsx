'use client';

import { useAtom } from 'jotai';
import { sidebarAtom } from '~/hooks/sidebarAtom';
import Sidebar from '../dashboard_components/sidebar';

export default function SidebarWrapper({
  children,
  role,
}: {
  children: React.ReactNode;
  role: 'admin' | 'creator' | 'completer';
}) {
  const [isSidebarOpen] = useAtom(sidebarAtom);

  const sidebarWidth = isSidebarOpen ? 280 : 0;

  return (
    <div className="relative h-screen w-full bg-[#FAFAFA] pt-[100px]">
      <div
        className={`fixed left-0 top-[100px] h-[calc(100vh-100px)] overflow-hidden bg-white transition-all duration-300 ease-in-out`}
        style={{ width: sidebarWidth }}
      >
        <Sidebar role={role} />
      </div>

      <main
        className="h-[calc(100vh-100px)] overflow-y-auto px-6 transition-all duration-300 ease-in-out"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
}
