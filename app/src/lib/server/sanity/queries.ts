export const futureEventsQuery = `*[_type == "event" && start > now() && (!defined($category) || category match $category)] | order(start desc)`;
export const pastEventsQuery = `*[_type == "event" && start <= now()] | order(start desc)`;
