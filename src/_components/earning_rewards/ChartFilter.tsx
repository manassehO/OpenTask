'use client';

import { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa6';

interface Props {
  value: 'This Week' | 'Last Week';
  onChange: (val: 'This Week' | 'Last Week') => void;
}

const options: ('This Week' | 'Last Week')[] = ['This Week', 'Last Week'];

export default function ChartFilter({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1 rounded-full border px-4 py-3 text-sm font-medium text-black"
      >
        <p className="text-sm">{value}</p>
        <FaChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 z-10 mt-2 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <ul className="py-1 text-sm text-black">
            {options.map((option) => (
              <li
                key={option}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  option === value ? 'font-medium' : ''
                }`}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
