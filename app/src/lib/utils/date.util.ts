import { parseISO, isSameDay, format, isToday, formatISO } from "date-fns";
import { nb } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";

/**
 * Converts a UTC date string to a local ISO string in the Europe/Oslo timezone
 * @param utcDateString - The UTC date string to convert
 * @returns The date string in ISO format with Europe/Oslo timezone
 * @throws Will throw an error if the date string is invalid
 */
export function toLocalIsoString(utcDateString: string): string {
  try {
    const date = parseISO(utcDateString);
    const osloDate = zonedTimeToUtc(date, "Europe/Oslo");
    return formatISO(osloDate);
  } catch (error) {
    console.error("Error converting date to local ISO string:", error);
    throw new Error(`Invalid date string: ${utcDateString}`);
  }
}

/**
 * Formats a date string to a human-readable format in Norwegian
 * @param date - The date string to format
 * @returns Formatted date string (e.g., "I dag" or "1. januar 2023")
 * @throws Will throw an error if the date string is invalid
 */
export function formatDate(date: string): string {
  try {
    const dateObj = parseISO(date);

    if (isToday(dateObj)) {
      return "I dag";
    }

    return dateObj.toLocaleDateString("nb-NO", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    throw new Error(`Invalid date string: ${date}`);
  }
}

/**
 * Formats a date string to a time format (HH:MM)
 * @param dateString - The date string to format
 * @returns Formatted time string (e.g., "14:30")
 * @throws Will throw an error if the date string is invalid
 */
export function formatTime(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, "HH:mm", { locale: nb });
  } catch (error) {
    console.error("Error formatting time:", error);
    throw new Error(`Invalid date string: ${dateString}`);
  }
}

/**
 * Checks if two dates are on different days
 * @param start - The start date string
 * @param end - The end date string
 * @returns True if the dates are on different days, false otherwise
 * @throws Will throw an error if either date string is invalid
 */
export function endsOnDifferentDay(start: string, end: string): boolean {
  try {
    return !isSameDay(parseISO(start), parseISO(end));
  } catch (error) {
    console.error("Error checking if dates are on different days:", error);
    throw new Error(`Invalid date string(s): ${start}, ${end}`);
  }
}

/**
 * Checks if a date has passed (is before the current date)
 * @param date - The date string to check
 * @returns True if the date has passed, false otherwise
 * @throws Will throw an error if the date string is invalid
 */
export function dateHasPassed(date: string): boolean {
  try {
    return parseISO(date) <= new Date();
  } catch (error) {
    console.error("Error checking if date has passed:", error);
    throw new Error(`Invalid date string: ${date}`);
  }
}
