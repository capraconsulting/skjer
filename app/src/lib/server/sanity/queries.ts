import { serverClientWithoutStega } from "$lib/server/sanity/client";
import { eventQuery } from "$lib/sanity/queries";
import type { Event } from "$models/sanity.types";

export const getEventContent = async (id: string) => {
  const result = await serverClientWithoutStega.fetch<Event>(eventQuery, { id });
  return result;
};
