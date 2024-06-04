import { serverClientWithoutStega } from "$lib/server/sanity/client";
import { eventQuery } from "$lib/sanity/queries";
import type { Event } from "$models/sanity.model";

export const getEventContent = async ({ id }: { id: string }) => {
  const result = await serverClientWithoutStega.fetch<Event>(eventQuery, { id });
  return result;
};

export const futureEventsQuery = `*[_type == "event" && start > now()] | order(start asc)`;
export const pastEventsQuery = `*[_type == "event" && start <= now()] | order(start desc)`;
