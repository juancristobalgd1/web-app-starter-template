import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | number,
  locale = "es-ES",
  options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit", year: "numeric" }
): string {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}

export function formatCurrency(amount: number, currency = "EUR", locale = "es-ES"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency, minimumFractionDigits: 2 }).format(amount);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function truncate(str: string, maxLength: number): string {
  return str.length <= maxLength ? str : `${str.slice(0, maxLength - 3)}...`;
}

export const isBrowser = typeof window !== "undefined";

export function isIOS():     boolean { return isBrowser && /iphone|ipad|ipod/i.test(navigator.userAgent); }
export function isAndroid():  boolean { return isBrowser && /android/i.test(navigator.userAgent); }
export function isPWA():      boolean {
  return isBrowser && (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
}
