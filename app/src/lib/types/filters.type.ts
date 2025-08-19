// import type { Category } from "$models/sanity.model";
export const VALID_PARTICIPANT_FILTER_KEYS = ["kun-interne", "for-alle"] as const;

// WARNING: This is defined in Sanity! See "Category" model above.
export const VALID_EVENT_CATEGORY_FILTER_KEYS = ["fag", "sosialt"] as const;

export const VALID_FILTERS = {
  "participant-type": VALID_PARTICIPANT_FILTER_KEYS,
  "event-category": VALID_EVENT_CATEGORY_FILTER_KEYS,
} as const;

/// A Filter represents a set of filters (url search params) and their associated url parameter values
export type Filter = typeof VALID_FILTERS;
/// A FilterCategory represents the set of valid URL Search Params
export type FilterCategory = keyof typeof VALID_FILTERS;
export type FilterKey = ParticipantFilterKey | EventCategoryFilterKey;
export type ParticipantFilterKey = (typeof VALID_PARTICIPANT_FILTER_KEYS)[number];
export type EventCategoryFilterKey = (typeof VALID_EVENT_CATEGORY_FILTER_KEYS)[number];

export type EventFilter = { displayName: string; filterKey: FilterKey };

export type FilterData = {
  name: FilterCategory;
  valid_parameters: EventFilter[];
};

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const isFilterKey = (s: string | FilterKey): s is FilterKey => {
  return (
    VALID_EVENT_CATEGORY_FILTER_KEYS.includes(s as EventCategoryFilterKey) ||
    VALID_PARTICIPANT_FILTER_KEYS.includes(s as ParticipantFilterKey)
  );
};

// This seeks type safety of Active Filters, and consistency in naming of url search params across client and server.
// We cannot however guarantee that the values are set to a valid FilterKey (urls in browser can be edited directly of course), so we assume a string and work our way in from there.
export type ActiveFilterFromURL = {
  [k in FilterCategory]: string;
};
