import React from 'react';
interface AdminHeaderProps {
  title: string;
  subText: string;
}

function Header({ title, subText }: AdminHeaderProps) {
  return (
    <div className="w-full space-y-1 pb-4">
      <div className="max-w-lg">
        <h1 className="text-xl font-bold capitalize text-[#212121] sm:text-2xl md:text-3xl">
          {title}
        </h1>
        <p className="text-sm font-medium text-black sm:text-base">{subText}</p>
      </div>
    </div>
  );
}

export default Header;
