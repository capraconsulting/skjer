import type { Event } from "$models/sanity.model";

export interface EventWithAttending extends Event {
  attending: boolean;
}
