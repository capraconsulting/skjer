import { parseISO, isSameDay, format, isToday, isValid } from "date-fns";
import { nb, enUS, type Locale } from "date-fns/locale";
import { get } from "svelte/store";
import { locale, getTranslation } from "$lib/i18n";

// Map of locale codes to date-fns locales
const localeMap: Record<string, Locale> = {
  nb: nb,
  en: enUS
};

// Helper function to get the current date-fns locale based on the app's locale
function getCurrentLocale(currentLocale: string | null | undefined) {
  if (!currentLocale) {
    return nb; // Default to Norwegian if locale is null or undefined
  }
  return localeMap[currentLocale] || nb; // Default to Norwegian if locale not found
}

// Helper function to get the current locale string for toLocaleDateString
function getLocaleString(currentLocale: string | null | undefined) {
  if (!currentLocale) {
    return 'en-US'; // Default to English if locale is null or undefined
  }
  return currentLocale === 'nb' ? 'nb-NO' : 'en-US';
}

export function formatDate(date: string): string {
  try {
    const dateObj = parseISO(date);

    // Check if the date is valid
    if (!isValid(dateObj)) {
      console.error(`Invalid date string: ${date}`);
      return date; // Return the original string if invalid
    }

    const currentLocale = get(locale);

    if (isToday(dateObj)) {
      return getTranslation('common.today');
    }

    return dateObj.toLocaleDateString(getLocaleString(currentLocale), {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error(`Error formatting date: ${date}`, error);
    return date; // Return the original string in case of error
  }
}

export function formatDateWithWeekDay(date: string): string {
  try {
    const dateObj = parseISO(date);

    // Check if the date is valid
    if (!isValid(dateObj)) {
      console.error(`Invalid date string: ${date}`);
      return date; // Return the original string if invalid
    }

    const currentLocale = get(locale);
    return dateObj.toLocaleDateString(getLocaleString(currentLocale), {
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  } catch (error) {
    console.error(`Error formatting date with weekday: ${date}`, error);
    return date; // Return the original string in case of error
  }
}

export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);

    // Check if the date is valid
    if (!isValid(date)) {
      console.error(`Invalid date string: ${dateString}`);
      return dateString; // Return the original string if invalid
    }

    const currentLocale = get(locale);
    return format(date, "HH:mm", { locale: getCurrentLocale(currentLocale) });
  } catch (error) {
    console.error(`Error formatting time: ${dateString}`, error);
    return dateString; // Return the original string in case of error
  }
}

export function endsOnDifferentDay(start: string, end: string): boolean {
  try {
    const startDate = parseISO(start);
    const endDate = parseISO(end);

    // Check if both dates are valid
    if (!isValid(startDate) || !isValid(endDate)) {
      console.error(`Invalid date string(s): start=${start}, end=${end}`);
      return false; // Default to false if either date is invalid
    }

    return !isSameDay(startDate, endDate);
  } catch (error) {
    console.error(`Error comparing dates: start=${start}, end=${end}`, error);
    return false; // Default to false in case of error
  }
}

export function dateHasPassed(date: string): boolean {
  try {
    const dateObj = parseISO(date);

    // Check if the date is valid
    if (!isValid(dateObj)) {
      console.error(`Invalid date string: ${date}`);
      return false; // Default to false if the date is invalid
    }

    // Compare with current date, ensuring both are in the same timezone context
    const now = new Date();
    return dateObj.getTime() <= now.getTime();
  } catch (error) {
    console.error(`Error checking if date has passed: ${date}`, error);
    return false; // Default to false in case of error
  }
}
