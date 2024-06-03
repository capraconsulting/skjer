import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.types";
import { serverClientWithoutStega } from "$lib/server/sanity/client";
import { futureEventsQuery, pastEventsQuery } from "$lib/server/sanity/queries";

export const load: PageServerLoad = async (event) => {
  const url = new URL(event.url);
  const category = url.searchParams.get("category");

  const futureEvents: Event[] = await serverClientWithoutStega.fetch(futureEventsQuery, {
    category,
  });
  const pastEvents: Event[] = await serverClientWithoutStega.fetch(pastEventsQuery);

  return {
    futureEvents,
    pastEvents,
    category,
  };
};
