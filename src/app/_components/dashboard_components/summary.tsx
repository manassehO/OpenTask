import React from 'react'

const summaryData =[
  {
    title: "Total Earnings",
    amount: "$200,000",
    cryptoAmount: "1,000 BTC",
    icon: "/icons/payments.svg",
        bgColor: "bg-[#F59E0B]/15"

  },
  {
    title: "Total Tasks Completed",
    amount: "1,500",
    cryptoAmount: "2,500 ETH",
    icon: "/icons/task.svg",
    bgColor: "bg-[#10B981]/15"
  },
  {
    title: "Streak",
    amount: "30 Days",
    cryptoAmount: "0.5 BTC",
    icon: "/icons/streak.svg",
    bgColor: "bg-[#3B82F6]/15"    
  }
]

const Summary = () => {
  return (
    <div className='w-full grid lg:grid-cols-3 grid-cols-1 sm:grid-cols-2 gap-4 items-center justify-center '>
     {summaryData.map((item, index) => (
      <div key={index} className='bg-white shadow-md rounded-lg p-4 mb-4 w-full max-w-md flex flex-col items-center lg:items-start justify-between h-[169px] '>
        <div className='flex items-center lg:items-start flex-col  space-y-2'>
          <div className={` flex items-center justify-center p-1 ${item.bgColor}   px-2`}>
            <img src={item.icon} alt={item.title} className='w-6 h-6' />
          </div>
                <h3 className='text-gray-600 '>{item.title}</h3>
            <p className=' text-lg font-semibold'>{item.amount}</p>
             <span className='text-sm text-[#3B82F6] font-semibold'>{item.cryptoAmount}</span>
          <div>
      
          </div>
        </div>
       
      </div>
     ))}
    </div>
  )
}

export default Summary
