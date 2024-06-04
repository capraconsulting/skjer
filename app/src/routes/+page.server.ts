import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.model";
import { futureEventsQuery, pastEventsQuery } from "$lib/server/sanity/queries";
import { client } from "$lib/sanity/client";

export const load: PageServerLoad = async (event) => {
  const url = new URL(event.url);
  const selectedCategory = url.searchParams.get("category")?.toLowerCase() || "";

  const futureEvents: Event[] = await client.fetch(futureEventsQuery);
  const pastEvents: Event[] = await client.fetch(pastEventsQuery);

  return {
    futureEvents,
    pastEvents,
    selectedCategory,
  };
};
