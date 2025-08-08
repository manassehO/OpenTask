import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseAmountToBigInt(amount: string, decimals = 18): bigint {
  const [whole, fraction = ''] = amount.split('.');
  const paddedFraction = (fraction + '0'.repeat(decimals)).slice(0, decimals);
  const normalized = whole + paddedFraction;
  if (!/^\d+$/.test(normalized)) {
    throw new Error('Invalid amount');
  }
  return BigInt(normalized);
}
