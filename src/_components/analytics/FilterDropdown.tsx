import { useState } from 'react';
import { PiFunnelLight } from 'react-icons/pi';
import { IoChevronDownOutline } from 'react-icons/io5';

const filters = ['All', 'Approved', 'Pending', 'Rejected'];

type FilterDropdownProps = {
  onSelect: (value: string) => void;
};

export const FilterDropdown = ({ onSelect }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect(option);
    setOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full min-w-40 items-center justify-between gap-2 rounded-[12px] border border-primary-20 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm hover:bg-gray-50"
      >
        <div className="flex items-center space-x-2">
          <PiFunnelLight className="size-8 text-black-100" />
          <span className={selected ? '' : 'text-black-100'}>
            {selected ?? 'Filter'}
          </span>
        </div>

        <IoChevronDownOutline className="size-6 text-black-100" />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-40 rounded-b-xl bg-white shadow-lg">
          <ul className="py-1 text-sm text-neutral-800">
            {filters.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                  selected === option ? 'font-medium text-primary' : ''
                }`}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
