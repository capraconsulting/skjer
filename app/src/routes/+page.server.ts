import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.model";
import {
  allFutureEventsQuery,
  allPastEventsQuery,
  externalFutureEventsQuery,
  externalPastEventsQuery,
} from "$lib/server/sanity/queries";
import { client } from "$lib/sanity/client";
import { getAttendingEvent } from "$lib/server/supabase/queries";

export const load: PageServerLoad = async ({ url, locals }) => {
  const auth = await locals.auth();
  const selectedCategory = url.searchParams.get("category")?.toLowerCase() || "";

  if (auth?.user?.email) {
    const events: Event[] = await client.fetch(allFutureEventsQuery);

    const promises = events.map(async (event) => {
      const attending = await getAttendingEvent({
        document_id: event._id,
        email: auth.user?.email!,
      });

      return {
        ...event,
        attending,
      };
    });

    const futureEvents = await Promise.all(promises);

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
