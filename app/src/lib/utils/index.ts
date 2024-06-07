export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("nb-NO", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(date: string) {
  // Note: The 'nb-NO' locale has a specific formatting behavior where it may remove and then re-add a leading zero.
  return new Date(date).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "numeric",
  });
}

export function endsOnDifferentDay(start: string, end: string) {
  return formatDate(start) !== formatDate(end);
}
