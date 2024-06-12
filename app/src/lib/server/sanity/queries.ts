import { client } from "$lib/sanity/client";
import { clientWithoutStega } from "$lib/server/sanity/client";
import type { Event } from "$models/sanity.model";
import groq from "groq";

export const eventQuery = groq`*[_type == "event" && _id == $id][0]{
  ...,
  'image': {
    ...image,
      'palette': image.asset->metadata.palette
  }
}`;

export const futureEventsQuery = groq`*[_type == "event" && start > now()] | order(start asc)`;
export const pastEventsQuery = groq`*[_type == "event" && start <= now()] | order(start desc)`;

export const externalFutureEventsQuery = groq`*[_type == "event" && start > now() && visibleForExternals] | order(start asc) `;
export const externalPastEventsQuery = groq`*[_type == "event" && start <= now() && visibleForExternals] | order(start desc)`;

export const getEventContent = async ({ id }: { id: string }) => {
  return await clientWithoutStega.fetch<Event>(eventQuery, { id });
};

export const getFutureEvents = async () => {
  return await client.fetch<Event[]>(futureEventsQuery);
};

export const getPastEvents = async () => {
  return await client.fetch<Event[]>(pastEventsQuery);
};

export const getExternalFutureEvents = async () => {
  return await client.fetch<Event[]>(externalFutureEventsQuery);
};

export const getExternalPastEvents = async () => {
  return await client.fetch<Event[]>(externalPastEventsQuery);
};
