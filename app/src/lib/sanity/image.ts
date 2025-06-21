import imageUrlBuilder from "@sanity/image-url";
import { client } from "$lib/sanity/client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource | string) {
  return builder.image(source).auto("format");
}
