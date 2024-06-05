import { serverClientWithoutStega } from "$lib/server/sanity/client";
import { eventQuery } from "$lib/sanity/queries";
import type { Event } from "$models/sanity.model";

export const getEventContent = async ({ id }: { id: string }) => {
  const result = await serverClientWithoutStega.fetch<Event>(eventQuery, { id });
  return result;
};

export const allFutureEventsQuery = `*[_type == "event" && start > now()] | order(start asc)`;
export const allPastEventsQuery = `*[_type == "event" && start <= now()] | order(start desc)`;

export const externalFutureEventsQuery = `*[_type == "event" && start > now() && visibleForExternals] | order(start asc) `;
export const externalPastEventsQuery = `*[_type == "event" && start <= now() && visibleForExternals] | order(start desc)`;
