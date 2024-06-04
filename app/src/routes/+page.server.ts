import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.model";
import { futureEventsQuery, pastEventsQuery } from "$lib/server/sanity/queries";
import { client } from "$lib/sanity/client";

export const load: PageServerLoad = async (event) => {
  const url = new URL(event.url);
  const category = url.searchParams.get("category");

  const futureEvents: Event[] = await client.fetch(futureEventsQuery, {
    category,
  });
  const pastEvents: Event[] = await client.fetch(pastEventsQuery);

  return {
    futureEvents,
    pastEvents,
    category,
  };
};
