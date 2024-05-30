import { client } from "$lib/sanity/client";
import { eventsQuery as query } from "$lib/sanity/queries";
import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.types";

export const load: PageServerLoad = async (event) => {
  const url = new URL(event.url);
  const category = url.searchParams.get("category");

  const events: Event[] = await client.fetch(query, { category });

  return {
    events,
    category,
  };
};
