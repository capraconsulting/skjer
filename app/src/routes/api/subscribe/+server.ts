import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { getFutureEvents } from "$lib/server/sanity/queries";
import type { RequestHandler } from "@sveltejs/kit";
import ical, { ICalCalendarMethod, type ICalEventData } from "ical-generator";

export const GET: RequestHandler = async () => {
  try {
    const events = await getFutureEvents();
    const calendar = ical({ name: "skjer", method: ICalCalendarMethod.REQUEST });

    events.forEach(
      ({ _id: id, title: summary, summary: description, start, end, place: location }) => {
        const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
        const eventData: ICalEventData = {
          id,
          summary,
          description,
          location,
          start,
          end,
          url,
        };
        calendar.createEvent(eventData);
      }
    );

    const icalFeed = calendar.toString();

    return new Response(icalFeed, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="skjer-calendar.ics"',
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
