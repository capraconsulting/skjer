import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { getFutureEvents } from "$lib/server/sanity/queries";
import type { RequestHandler } from "@sveltejs/kit";
import ical, {
  ICalCalendarMethod,
  ICalEventTransparency,
  type ICalEventData,
} from "ical-generator";

export const GET: RequestHandler = async () => {
  try {
    const events = await getFutureEvents();
    const calendar = ical({ name: "Skjer", method: ICalCalendarMethod.PUBLISH });

    events.forEach(
      ({
        _id: id,
        title: summary,
        summary: description = "",
        place: location = "",
        start,
        end,
      }) => {
        const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
        const eventData: ICalEventData = {
          id,
          summary,
          description: `${description}\n\nMeld deg på eller av arrangementet: ${url}`,
          location,
          start,
          end,
          url,
          transparency: ICalEventTransparency.TRANSPARENT,
        };
        calendar.createEvent(eventData);
      }
    );

    const icalFeed = calendar.toString();

    return new Response(icalFeed, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="invite.ics"',
      },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
