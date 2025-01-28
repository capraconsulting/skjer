import type { PageServerLoad } from "./$types";
import {
  getFutureEvents,
  getPastEvents,
  getExternalPastEvents,
  getExternalFutureEvents,
} from "$lib/server/sanity/queries";
import { getParticipantAttendingEvents } from "$lib/server/supabase/queries";
import type { EventWithAttending } from "$models/databaseView.model";

export const load: PageServerLoad = async ({ url, locals }) => {
  const auth = await locals.auth();
  const selectedFilter = url.searchParams.get("filter")?.toLowerCase() || "";

  if (auth?.user?.email) {
    const futureEventsContent = await getFutureEvents();

    const futureEventsAttending = await getParticipantAttendingEvents({
      email: auth.user.email,
    });

    const futureEvents: EventWithAttending[] = futureEventsContent.map((event) => {
      return { ...event, attending: futureEventsAttending.includes(event._id) };
    });

    const pastEvents = await getPastEvents();

    return {
      futureEvents,
      pastEvents,
      selectedFilter,
    };
  }

  const futureEvents = await getExternalFutureEvents();
  const pastEvents = await getExternalPastEvents();

  return {
    futureEvents,
    pastEvents,
    selectedFilter,
  };
};
