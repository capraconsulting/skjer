import { sanityClientWriteable } from "$lib/server/sanity/client";
import type { Event } from "$models/sanity.model";
import groq from "groq";

const reminderEventsQuery = groq`*[_type == "event"
  && defined(start)
  && dateTime(start) > dateTime(now())
  && !defined(cancelId)
] | order(start asc)`;

export async function getEventsForReminder(): Promise<Event[]> {
  const allEvents = await sanityClientWriteable.fetch<Event[]>(reminderEventsQuery);
  const tomorrowDateKey = getOsloDateKey(addDays(new Date(), 1));

  return allEvents.filter((event) => {
    if (!shouldSendReminderForEvent(event)) {
      return false;
    }

    return getOsloDateKey(new Date(event.start)) === tomorrowDateKey;
  });
}

export function shouldSendReminderForEvent(event: Event): boolean {
  const setting = event.reminderEmailSetting ?? "default";

  if (setting === "enabled") {
    return true;
  }

  if (setting === "disabled") {
    return false;
  }

  return event.openForExternals;
}

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

function getOsloDateKey(date: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Oslo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}