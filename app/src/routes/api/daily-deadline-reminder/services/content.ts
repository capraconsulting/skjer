import type { Event } from "$models/sanity.model";
import { sanityClientWriteable } from "$lib/server/sanity/client";
import groq from "groq";

export async function getEventsWithApproachingDeadlines(): Promise<Event[]> {
  const query = groq`*[_type == "event"
          && defined(deadline)
          && !defined(cancelId)
          && dateTime(deadline) > dateTime(now())
          && dateTime(start) > dateTime(now())  // Event hasn't started yet
          ] | order(deadline asc)`;

  const allEvents = await sanityClientWriteable.fetch<Event[]>(query);

  const now = new Date();
  const maxDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const result = allEvents.filter((event) => {
    const deadline = new Date(event.deadline);
    return deadline <= maxDeadline;
  });

  return result;
}
