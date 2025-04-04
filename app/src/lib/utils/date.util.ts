import { parseISO, isSameDay, format, isToday } from "date-fns";
import { nb } from "date-fns/locale";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(utc);
dayjs.extend(timezone);

export function toLocalIsoString(utcDateString: string) {
  return dayjs(utcDateString).tz("Europe/Oslo").format("YYYY-MM-DDTHH:mm:ssZ");
}

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
  return format(date, "HH:mm", { locale: nb });
}

export function endsOnDifferentDay(start: string, end: string): boolean {
  return !isSameDay(parseISO(start), parseISO(end));
}

export function dateHasPassed(date: string): boolean {
  return new Date(date) <= new Date();
}
