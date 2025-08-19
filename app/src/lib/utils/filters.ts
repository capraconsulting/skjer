import type { Event } from "$models/sanity.model";
import type { FilterCategory, VALID_FILTERS, ActiveFilterFromURL } from "$lib/types/filters.type";

const FILTERING_LOGIC: FilteringFunction = {
  "participant-type": {
    "for-alle": (eventToFilter: Event) => eventToFilter.openForExternals,
    "kun-interne": (eventToFilter: Event) => !eventToFilter.openForExternals,
  },
  "event-category": {
    fag: (eventToFilter: Event) => eventToFilter.category?.toLowerCase() === "fag",
    sosialt: (eventToFilter: Event) => eventToFilter.category?.toLowerCase() === "sosialt",
  },
} as const;

/**
  Applies the filters in activeFilters to events. Internally uses a object containting filter functions for each valid key/value pair of the URL search params
**/
export const applyFilters = (events: Event[], activeFilters: ActiveFilterFromURL): Event[] => {
  return events.filter((event) => {
    if (activeFilters["participant-type"]) {
      const filterFunction =
        FILTERING_LOGIC["participant-type"][
          activeFilters["participant-type"] as keyof (typeof FILTERING_LOGIC)["participant-type"]
        ];
      if (filterFunction && !filterFunction(event)) return false;
    }

    if (activeFilters["event-category"]) {
      const filterFunction =
        FILTERING_LOGIC["event-category"][
          activeFilters["event-category"] as keyof (typeof FILTERING_LOGIC)["event-category"]
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
