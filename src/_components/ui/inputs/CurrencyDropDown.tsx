import React, { useState, useRef, useEffect } from 'react';
import { type Dispatch, type SetStateAction, type FC } from 'react';
import { ChevronDown } from 'lucide-react';

type Currency = {
  symbol: string;
  name: string;
};
interface CurrencyDropdownProps {
  selectedCurrency: string;
  setSelectedCurrency: Dispatch<SetStateAction<string>>;
  currencies: Currency[];
}
const CurrencyDropdown: FC<CurrencyDropdownProps> = ({
  selectedCurrency,
  setSelectedCurrency,
  currencies,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = currencies.find((c) => c.symbol === selectedCurrency);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (currency: string) => {
    setSelectedCurrency(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between space-x-1 rounded-lg border bg-[#D8E6FD66] py-2 pl-4 pr-2.5 text-sm font-medium text-[#3B82F6] transition-all duration-200 hover:bg-[#D8E6FD66] focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span>{selectedOption?.symbol}</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 w-fit rounded-lg border border-gray-200 bg-white shadow-lg">
          {currencies.map((currency) => (
            <button
              key={currency.symbol}
              onClick={() => handleSelect(currency.symbol)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                selectedCurrency === currency.symbol ? 'bg-blue-50' : ''
              }`}
            >
              <div>
                <div className="font-medium text-gray-900">
                  {currency.symbol}
                </div>
                <div className="text-nowrap text-xs text-gray-500">
                  {currency.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrencyDropdown;
