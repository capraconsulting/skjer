import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { Event } from "$models/sanity.types";

const builder = imageUrlBuilder(client);

export function urlFor(source: Event["image"]) {
  return builder.image(source);
}
