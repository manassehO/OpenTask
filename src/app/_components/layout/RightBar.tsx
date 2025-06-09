"use client";
import { useAtom } from 'jotai';
import React from 'react'
import { sidebarAtom } from '~/hooks/sidebarAtom';
import Button from '../ui/button';

const RightBar = () => {
  const [isSidebarOpen] = useAtom(sidebarAtom);
  const rightBarSummary = [
    {
      title: "Total Earned",
      amount: "10ETH",
      icon: "/icons/streak.svg",
    },
    {
      title: "Fiat Value",
      amount: "$200",
      icon: "/icons/streak.svg",
    },
    {
      title: "Task Completed",
      amount: "25",
      icon: "/icons/streak.svg",
    },
    {
      title: "Time Spent",
      amount: "12Hours",
      icon: "/icons/streak.svg",
    },

  ]
  return (
    <div className={`fixed right-0 top-30 pt-[100px] bg-white bottom-0 h-screen w-[330px] p-4 max-lg:hidden ${isSidebarOpen ? 'hidden' : ''} overflow-y-scroll spacey-y-4`}>
      <h1 className='text-2xl font-bold'> Earning Summary</h1>
      <p className='text-gray-500'>Lorem ipsum dolor sit amet consectetur. Sit morbi id.Lorem ipsum dolor</p>
      <div className='grid grid-cols-2 gap-4 mt-4 bg-white shadow-md rounded-lg p-4'>
        {rightBarSummary.map((item, index) => (
          <div key={index} className='flex items-center gap-2 bg-[#FAFAFA] rounded-lg p-4'>
            <div className='flex items-start gap-2 flex-col'>
              <div className={` flex items-center justify-center p-1 bg-[#06B6D41A]/15  px-2`}>
                <img src={item.icon} alt={item.title} className='w-6 h-6' />

              </div>
              <h1 className='text-sm '>{item.title}</h1>
              <h1 className='text-lg font-bold text-[#414141]'>{item.amount}</h1>
            </div>

          </div>
        ))}
      </div>
      <Button className='w-full mt-4 py-2   bg-transparent border-2 border-blue-400 text-blue-400'>
        view detailed earnings
      </Button>

      <div className='flex items-start mt-4 flex-col gap-4 bg-white shadow-md rounded-lg p-4'>
        <img src="/learning-img.png" alt="" className='w-full h-full' />
        <div className='flex flex-col'>
          <h1 className='text-xl font-bold'>learning center</h1>
          <p className=' text-gray-500'>Lorem ipsum dolor sit amet consectetur. Sit morbi id.Lorem ipsum dolor sit amet consectetur. Sit morbi</p>
        </div>
        <Button className='w-full mt-4 py-2   bg-transparent border-2 border-blue-400 text-blue-400'>
          view learning center
        </Button>
      </div>
    </div>
  )
}

export default RightBar
