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
const deltakerTypeFilterList: EventFilter[] = [{ title: "Kun interne", keyword: "kun-interne" }, { title: "Åpent for alle", keyword: "for-alle" }];
const eventKategoriFilterList: EventFilter[] = [{ title: "#Fag", keyword: "fag"}, { title: "#Sosialt", keyword: 'sosialt'}];

type AvailableFilterData = {
  participantFilters: FilterData,
  eventCategoryFilters: FilterData
}

// Sent to frontend to ensure consistency on url search params
const filterGroups: AvailableFilterData = {
  participantFilters: {
    name: "deltakerType",
    list: deltakerTypeFilterList,
  },
  eventCategoryFilters: {
    name: "eventKategori",
    list: eventKategoriFilterList,
  }
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
