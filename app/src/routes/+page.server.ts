import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.model";
import {
  allFutureEventsQuery,
  allPastEventsQuery,
  externalFutureEventsQuery,
  externalPastEventsQuery,
} from "$lib/server/sanity/queries";
import { client } from "$lib/sanity/client";
import { getAllAttendingEvents } from "$lib/server/supabase/queries";
import type { EventWithAttending } from "$models/databaseView.model";

export const load: PageServerLoad = async ({ url, locals }) => {
  const auth = await locals.auth();
  const selectedCategory = url.searchParams.get("category")?.toLowerCase() || "";

  if (auth?.user?.email) {
    const futureEventsContent: Event[] = await client.fetch(allFutureEventsQuery);

    const futureEventsAttending = await getAllAttendingEvents({
      email: auth.user?.email,
    });

    const futureEvents: EventWithAttending[] = futureEventsContent.map((event) => {
      return { ...event, attending: futureEventsAttending.includes(event._id) };
    });

    const pastEvents: Event[] = await client.fetch(allPastEventsQuery);

    return {
      futureEvents,
      pastEvents,
      selectedCategory,
    };
  }

  const futureEvents: Event[] = await client.fetch(externalFutureEventsQuery);
  const pastEvents: Event[] = await client.fetch(externalPastEventsQuery);

  return {
    futureEvents,
    pastEvents,
    selectedCategory,
  };
};
