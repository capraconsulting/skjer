import type { Event } from "$models/sanity.model";
import { sanityClientWriteable } from "$lib/server/sanity/client";
import groq from "groq";

export async function getEventsWithApproachingDeadlines(): Promise<Event[]> {
  // First get all upcoming events with deadlines, then filter in JavaScript
  const query = groq`*[_type == "event"
          && defined(deadline)
          && !defined(cancelId)
          && dateTime(deadline) > dateTime(now())
          && dateTime(start) > dateTime(now())  // Event hasn't started yet
          ] | order(deadline asc)`;

  const allEvents = await sanityClientWriteable.fetch<Event[]>(query);

  // Filter events with deadlines within next 24 hours
  const now = new Date();
  const maxDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const result = allEvents.filter((event) => {
    const deadline = new Date(event.deadline);
    return deadline <= maxDeadline;
  });

  // Debug logging for development
  if (process.env.NODE_ENV === "development") {
    console.log("🔍 Debug - Events query result:", result.length);
    console.log("🔍 Debug - Current time:", new Date().toISOString());
    console.log(
      "🔍 Debug - Current time Norwegian:",
      new Date().toLocaleString("nb-NO", { timeZone: "Europe/Oslo" })
    );
    result.forEach((event, i) => {
      console.log(`🔍 Debug - Event ${i + 1}:`, {
        title: event.title,
        deadline: event.deadline,
        deadlineFormatted: new Date(event.deadline).toLocaleString("nb-NO", {
          timeZone: "Europe/Oslo",
        }),
        start: event.start,
        startFormatted: new Date(event.start).toLocaleString("nb-NO", { timeZone: "Europe/Oslo" }),
        cancelled: !!event.cancelId,
      });
    });
  }

  return result;
}
