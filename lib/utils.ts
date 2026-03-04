import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format number with consistent locale to avoid hydration mismatch
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

// Format price with consistent locale
export function formatPrice(price: number): string {
  return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}
