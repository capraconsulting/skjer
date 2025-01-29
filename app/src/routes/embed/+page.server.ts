import { getEmbedExternalFutureEvents } from "$lib/server/sanity/queries";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const futureEvents = await getEmbedExternalFutureEvents();

  return {
    futureEvents,
  };
};
