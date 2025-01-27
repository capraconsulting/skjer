import type { Event } from "$models/sanity.model";
import { sanityClientWriteable } from "$lib/server/sanity/client";
import groq from "groq";
import type { MultipleMutationResult } from "@sanity/client";

export async function getExpiredRecurringEvents(): Promise<Event[]> {
  const query = groq`*[_type == "event"
          && isRecurring == true
          && dateTime(end) < dateTime(now())
          && !defined(cancelId)
          && frequence in ["day", "week", "month", "year"]
          && interval >= 1]`;

  const result = await sanityClientWriteable.fetch<Event[]>(query);
  return result;
}

export function filterPublishedEvents(
  events: Event[],
  successes: PromiseFulfilledResult<MultipleMutationResult>[]
) {
  const publishedDocumentIds = successes.flatMap(({ value: { documentIds } }) => documentIds);
  return events.filter(({ _id: id }) => publishedDocumentIds.includes(id));
}

export async function updateAndPublishEvents(events: Event[]) {
  const updateAndPublishPromises = events.map((event) => {
    const updatedEventSchedule = computeNextEventSchedule(event);
    return sanityClientWriteable
      .transaction()
      .patch(event._id, {
        set: updatedEventSchedule,
      })
      .commit();
  });

  const results = await Promise.allSettled(updateAndPublishPromises);
  const successes = results.filter((result) => result.status === "fulfilled");
  const failures = results.filter((result) => result.status === "rejected");

  return { successes, failures };
}

const computeNextEventSchedule = ({ frequence, interval, start, end, deadline }: Event) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const deadlineDate = new Date(deadline);

  switch (frequence) {
    case "day":
      startDate.setDate(startDate.getDate() + interval);
      endDate.setDate(endDate.getDate() + interval);
      deadlineDate.setDate(deadlineDate.getDate() + interval);
      break;
    case "week":
      startDate.setDate(startDate.getDate() + interval * 7);
      endDate.setDate(endDate.getDate() + interval * 7);
      deadlineDate.setDate(deadlineDate.getDate() + interval * 7);
      break;
    case "month":
      startDate.setMonth(startDate.getMonth() + interval);
      endDate.setMonth(endDate.getMonth() + interval);
      deadlineDate.setMonth(deadlineDate.getMonth() + interval);
      break;
    case "year":
      startDate.setFullYear(startDate.getFullYear() + interval);
      endDate.setFullYear(endDate.getFullYear() + interval);
      deadlineDate.setFullYear(deadlineDate.getFullYear() + interval);
      break;
  }

  return {
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    deadline: deadlineDate.toISOString(),
  };
};
