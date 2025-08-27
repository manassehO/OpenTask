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

/** This function is used to clamp progress values between 0 - 100.
 * It ensures that progress values do not exceed 100 or fall below 0.
 * This is useful for ensuring that progress values are always within a valid range
 * and prevents issues with displaying progress in the UI. */
export const clampProgress = (value: number) =>
  Math.min(100, Math.max(0, value));

export const UserType = {
  admin: 'ADMIN',
  completer: 'COMPLETER',
  creator: 'CREATOR',
};
