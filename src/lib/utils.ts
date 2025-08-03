import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** This function is used to clamp progress values between 0 - 100.
 * It ensures that progress values do not exceed 100 or fall below 0.
 * This is useful for ensuring that progress values are always within a valid range
 * and prevents issues with displaying progress in the UI. */
export const clampProgress = (value: number) =>
  Math.min(100, Math.max(0, value));
