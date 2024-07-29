import { client } from "$lib/sanity/client";
import { token } from "$lib/server/sanity/api";

export const serverClient = client.withConfig({
  token,
  useCdn: false,
  stega: true,
});

export const clientWithoutStega = client.withConfig({
  token,
  useCdn: false,
  stega: false,
});

export const previewDraftsClient = client.withConfig({
  token,
  stega: false,
  useCdn: false, // must be false, required for this perspective
  perspective: "previewDrafts",
});
