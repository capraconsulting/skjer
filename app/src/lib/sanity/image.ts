import imageUrlBuilder from "@sanity/image-url";
import { client } from "$lib/sanity/client";

const builder = imageUrlBuilder(client);

export function urlFor(source: string) {
  return builder.image(source).auto("format");
}
