import { parseISO, isSameDay, format, isToday } from "date-fns";
import { nb, enUS } from "date-fns/locale";
import { get } from "svelte/store";
import { locale, _ } from "$lib/i18n";

// Map of locale codes to date-fns locales
const localeMap: Record<string, Locale> = {
  nb: nb,
  en: enUS
};

// Helper function to get the current date-fns locale based on the app's locale
function getCurrentLocale(currentLocale: string) {
  return localeMap[currentLocale] || nb; // Default to Norwegian if locale not found
}

// Helper function to get the current locale string for toLocaleDateString
function getLocaleString(currentLocale: string) {
  return currentLocale === 'nb' ? 'nb-NO' : 'en-US';
}

export function formatDate(date: string): string {
  const dateObj = new Date(date);
  const currentLocale = get(locale);

  if (isToday(dateObj)) {
    return get(_)('common.today');
  }

  return dateObj.toLocaleDateString(getLocaleString(currentLocale), {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateWithWeekDay(date: string): string {
  const currentLocale = get(locale);
  return new Date(date).toLocaleDateString(getLocaleString(currentLocale), {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatTime(dateString: string): string {
  const date = parseISO(dateString);
  const currentLocale = get(locale);
  return format(date, "HH:mm", { locale: getCurrentLocale(currentLocale) });
}

export function endsOnDifferentDay(start: string, end: string): boolean {
  return !isSameDay(parseISO(start), parseISO(end));
}

export function dateHasPassed(date: string): boolean {
  return new Date(date) <= new Date();
}
