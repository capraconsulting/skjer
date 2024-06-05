import type { PageServerLoad } from "./$types";
import type { Event } from "$models/sanity.model";
import {
  allFutureEventsQuery,
  allPastEventsQuery,
  externalFutureEventsQuery,
  externalPastEventsQuery,
} from "$lib/server/sanity/queries";
import { client } from "$lib/sanity/client";

export const load: PageServerLoad = async ({ url, locals }) => {
  const auth = await locals.auth();

  const selectedCategory = url.searchParams.get("category")?.toLowerCase() || "";

  const futureEvents: Event[] = await client.fetch(
    auth?.user ? allFutureEventsQuery : externalFutureEventsQuery
  );
  const pastEvents: Event[] = await client.fetch(
    auth?.user ? allPastEventsQuery : externalPastEventsQuery
  );

  return {
    futureEvents,
    pastEvents,
    selectedCategory,
  };
};
