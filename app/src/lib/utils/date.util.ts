import { parseISO, isSameDay, isToday } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { nb } from "date-fns/locale";

export function formatDate(date: string): string {
  const dateObj = new Date(date);

  if (isToday(dateObj)) {
    return "I dag";
  }

  return dateObj.toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateWithWeekDay(date: string): string {
  return new Date(date).toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
    weekday: "long",
  });
}

export function formatTime(dateString: string): string {
  const date = parseISO(dateString);
  return formatInTimeZone(date, "Europe/Oslo", "HH:mm", { locale: nb });
}

export function endsOnDifferentDay(start: string, end: string): boolean {
  return !isSameDay(parseISO(start), parseISO(end));
}

export function dateHasPassed(date: string): boolean {
  return new Date(date) <= new Date();
}
