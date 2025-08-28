'use client';
import { useMemo } from 'react';

// type Props = {
//   value: string; // Changed from number | undefined to string
//   onChange: (value: string) => void; // Changed to accept string
//   maxLength: number;
//   label: string;
//   placeholder?: string;
//   error?: boolean;
// } & React.InputHTMLAttributes<HTMLInputElement>;

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
  label: string;
  placeholder?: string;
  error?: boolean;
  className?: string;
}

export default function OTPInput({
  value,
  onChange,
  maxLength,
  label,
  placeholder,
  error,
  className,
  ...props
}: OTPInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, ''); // remove non-digits
    if (input.length > maxLength) return;
    onChange(input); // Directly pass the string
  };

  const errorText = useMemo(() => {
    if (value && value.length !== maxLength)
      return `OTP must be ${maxLength} digits`;
    return '-';
  }, [value, maxLength]);

  return (
    <label className="flex flex-col gap-2 text-base text-black">
      <span>{label}</span>
      <input
        {...props}
        type="text"
        inputMode="numeric"
        pattern="\d*"
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        placeholder={placeholder ?? 'Enter OTP'}
        required
        className={`w-full rounded border px-6 py-5 font-semibold ${error ? 'border-red-500' : ''} focus:outline-none focus:ring-2 focus:ring-black ${error ? 'focus:ring-red-500' : ''} ${className ?? ''}`} // Use the extracted className
        // className={`w-full rounded border px-6 py-5 font-semibold ${error && 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-black ${error && 'focus:ring-red-500'} ${className ?? ''}`}
      />
      <span
        className={`text-red-500 opacity-0 transition-opacity duration-300 ${error && 'opacity-100'}`}
      >
        {errorText}
      </span>
    </label>
  );
}
