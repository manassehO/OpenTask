import React from "react";

function Header() {
  return (
    <div className="w-full space-y-1 pb-4">
      <div className="max-w-lg">
        <h1 className="text-xl font-bold capitalize text-[#212121] sm:text-2xl md:text-3xl">
          disputes
        </h1>
        <p className="text-sm font-medium text-black sm:text-base">
          review and resolve issues between task creators and submitters
        </p>
      </div>
    </div>
  );
}

export default Header;
