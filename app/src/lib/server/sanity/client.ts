import { client } from "$lib/sanity/client";
import { readToken, writeToken } from "$lib/server/sanity/api";

// Read client and with stega
export const sanityClient = client.withConfig({
  token: readToken,
  useCdn: false,
  stega: true,
});

// Read client and without stega
export const sanityClientWithoutStega = client.withConfig({
  token: readToken,
  useCdn: false,
  stega: false,
});

// Writeable client and without stega
export const sanityClientWriteable = client.withConfig({
  token: writeToken,
  useCdn: false,
  stega: false,
  perspective: "published",
});

// Read client in preview and without stega
export const sanityClientPreviewDrafts = client.withConfig({
  token: readToken,
  stega: false,
  useCdn: false, // must be false, required for this perspective
  perspective: "previewDrafts",
});
