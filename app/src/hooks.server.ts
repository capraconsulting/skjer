import { createRequestHandler, setServerClient } from "@sanity/svelte-loader";
import { sanityClient } from "$lib/server/sanity/client";
import { sequence } from "@sveltejs/kit/hooks";
import { createAuthHandler } from "$lib/auth";
import { createCorsHandler } from "$lib/auth/cors";
// Import i18n but don't call initI18n() - it's already initialized with default locale when imported
import "$lib/i18n";

// Sets the client to be used by `loadQuery` when fetching data on the server.
// The loader will handle setting the correct fetch parameters, including
// perspective. This isn't a hook, but it's a good place to call this function
// as this file is executed once per app initialization.
setServerClient(sanityClient);

// This convenience function sets up preview mode endpoints and attaches useful
// helpers to the `event.locals` Svelte object, such as a preconfigured
// `loadQuery` function and `preview` state.

export const handle = sequence(createRequestHandler(), createAuthHandler, createCorsHandler);
