import groq from "groq";

export const eventQuery = groq`*[_type == "event" && _id == $id][0]`;

export const eventsQuery = groq`*[_type == "event" && defined(_id) && (!defined($category) || category == $category)] | order(start desc)`;
