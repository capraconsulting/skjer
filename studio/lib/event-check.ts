import { Event } from "../../app/src/models/sanity.model";

export const eventChangeRequiresUpdate = (draft: Event, published: Event) => {
  const placeHasChanged = draft.place !== published.place;
  const timeHasChanged = draft.start !== published.start || draft.end !== published.end;

  return placeHasChanged || timeHasChanged;
};
