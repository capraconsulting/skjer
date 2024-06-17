function toDate(dateString: string): Date {
  return new Date(dateString);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("nb-NO", {
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

export function formatTime(date: string): string {
  // Note: The 'nb-NO' locale has a specific formatting behavior where it may remove and then re-add a leading zero.
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  });
}

export function endsOnDifferentDay(start: string, end: string): boolean {
  return toDate(start) !== toDate(end);
}

export function dateHasPassed(date: string): boolean {
  return toDate(date) <= new Date();
}
