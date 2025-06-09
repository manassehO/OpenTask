"use client";
import { useAtom } from 'jotai';
import React from 'react'
import { sidebarAtom } from '~/hooks/sidebarAtom';

const RightBar = () => {
  const [isSidebarOpen] = useAtom(sidebarAtom);

  return (
    <div className={`fixed right-0 top-30 bg-white bottom-0 h-screen w-[300px] p-4 max-lg:hidden ${isSidebarOpen ? 'hidden' : ''}`}>
      <h1> Right bar</h1>
    </div>
  )
}

export default RightBar
