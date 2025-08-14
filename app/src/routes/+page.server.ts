import type { PageServerLoad } from "./$types";
import {
  getFutureEvents,
  getPastEvents,
  getExternalPastEvents,
  getExternalFutureEvents,
} from "$lib/server/sanity/queries";
import { getParticipantAttendingEvents } from "$lib/server/supabase/queries";
import type { EventWithAttending } from "$models/databaseView.model";
import type { EventFilter, FilterData } from "$lib/types/filters.type";

/*
We define the list of filters and their display info here, and it will be sent to frontend.
*/
const participantTypeFilterList: EventFilter[] = [
  { displayName: "Kun interne", filterKey: "kun-interne" },
  { displayName: "Åpent for alle", filterKey: "for-alle" },
];
const eventCategoryFilterList: EventFilter[] = [
  { displayName: "#Fag", filterKey: "fag" },
  { displayName: "#Sosialt", filterKey: "sosialt" },
];

type AvailableFilterData = {
  participantFilters: FilterData;
  eventCategoryFilters: FilterData;
};

// Sent to frontend to ensure consistency on url search params
const filterGroups: AvailableFilterData = {
  participantFilters: {
    name: "participantType",
    valid_parameters: participantTypeFilterList,
  },
  eventCategoryFilters: {
    name: "eventCategory",
    valid_parameters: eventCategoryFilterList,
  },
};

export const load: PageServerLoad = async ({ locals }) => {
  const auth = await locals.auth();

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
      filterGroups,
    };
  }

  const futureEvents = await getExternalFutureEvents();
  const pastEvents = await getExternalPastEvents();

  return {
    futureEvents,
    pastEvents,
    filterGroups,
  };
};
