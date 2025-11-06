import { createRequestHandler, setServerClient } from "@sanity/svelte-loader";
import { sanityClient } from "$lib/server/sanity/client";
import { sequence } from "@sveltejs/kit/hooks";
import { createAuthHandler } from "$lib/auth";
import { createCorsHandler } from "$lib/auth/cors";
import type { Handle } from "@sveltejs/kit";

// Sets the client to be used by `loadQuery` when fetching data on the server.
// The loader will handle setting the correct fetch parameters, including
// perspective. This isn't a hook, but it's a good place to call this function
// as this file is executed once per app initialization.
setServerClient(sanityClient);

// Wrap auth handler with error handling
const authHandlerWithErrorHandling: Handle = async ({ event, resolve }) => {
  try {
    return await createAuthHandler({ event, resolve });
  } catch (error) {
    console.error("Auth handler error:", error);
    // Continue without auth if it fails
    return await resolve(event);
  }
};

// This convenience function sets up preview mode endpoints and attaches useful
// helpers to the `event.locals` Svelte object, such as a preconfigured
// `loadQuery` function and `preview` state.

export const handle = sequence(
  createRequestHandler(),
  authHandlerWithErrorHandling,
  createCorsHandler
);
