import * as Sentry from "@sentry/sveltekit";
import { createRequestHandler, setServerClient } from "@sanity/svelte-loader";
import { serverClient } from "$lib/server/sanity/client";
import { sequence } from "@sveltejs/kit/hooks";
import { createAuthHandler } from "$lib/auth";
import { createCorsHandler } from "$lib/auth/cors";

Sentry.init({
    dsn: "https://89a3c85a7dcebbb15812e9f467515450@o4507497115418624.ingest.de.sentry.io/4507497120923728",
    tracesSampleRate: 1
})

// Sets the client to be used by `loadQuery` when fetching data on the server.
// The loader will handle setting the correct fetch parameters, including
// perspective. This isn't a hook, but it's a good place to call this function
// as this file is executed once per app initialization.
setServerClient(serverClient);

// This convenience function sets up preview mode endpoints and attaches useful
// helpers to the `event.locals` Svelte object, such as a preconfigured
// `loadQuery` function and `preview` state.

export const handle = sequence(Sentry.sentryHandle(), sequence(createRequestHandler(), createAuthHandler, createCorsHandler));
export const handleError = Sentry.handleErrorWithSentry();