import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats currency in Egyptian Pounds (EGP / ج.م)
 */
export function formatCurrency(amount: number, locale: string = 'ar-EG'): string {
  if (locale.startsWith('ar')) {
    return `${amount.toLocaleString('ar-EG')} ج.م`;
  }
  return `${amount.toLocaleString('en-EG')} EGP`;
}

/**
 * Formats dates consistently according to the current locale
 */
export function formatDate(dateString: string | Date, locale: string = 'ar-EG'): string {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return '';

  return new Intl.DateTimeFormat(locale.startsWith('ar') ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Formats time (e.g. 10:30 AM / 10:30 ص)
 */
export function formatTime(timeString: string, locale: string = 'ar-EG'): string {
  // If timeString is "HH:mm"
  if (/^\d{2}:\d{2}$/.test(timeString)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat(locale.startsWith('ar') ? 'ar-EG' : 'en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;

  return new Intl.DateTimeFormat(locale.startsWith('ar') ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
