import type { Event } from "$models/sanity.model";
import type { FilterCategory, VALID_FILTERS, ActiveFilterFromURL } from "$lib/types/filters.type";

const FILTERING_LOGIC: FilteringFunction = {
  deltakerType: {
    "for-alle": (eventToFilter: Event) => eventToFilter.openForExternals,
    "kun-interne": (eventToFilter: Event) => !eventToFilter.openForExternals,
  },
  eventKategori: {
    fag: (eventToFilter: Event) => eventToFilter.category?.toLowerCase() === "fag",
    sosialt: (eventToFilter: Event) => eventToFilter.category?.toLowerCase() === "sosialt",
  },
} as const;

/**
Applies the filters in activeFilters to events. Internally uses a object containting filter functions for each valid key/value pair of the URL search params
**/
export const applyFilters = (events: Event[], activeFilters: ActiveFilterFromURL): Event[] => {
  return events.filter((event) => {
    if (activeFilters.deltakerType) {
      const filterFunction =
        FILTERING_LOGIC.deltakerType[
          activeFilters.deltakerType as keyof typeof FILTERING_LOGIC.deltakerType
        ];
      if (filterFunction && !filterFunction(event)) return false;
    }

    if (activeFilters.eventKategori) {
      const filterFunction =
        FILTERING_LOGIC.eventKategori[
          activeFilters.eventKategori as keyof typeof FILTERING_LOGIC.eventKategori
        ];
      if (filterFunction && !filterFunction(event)) return false;
    }

    return true;
  });
};

// Ensures correct implementation of the filter function object above.
type FilteringFunction = {
  [key in FilterCategory]: {
    [k in (typeof VALID_FILTERS)[key][number]]: (eventToFilter: Event) => boolean;
  };
};
