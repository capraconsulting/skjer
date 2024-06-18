import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

export const createAPISecurityPolicy: Handle = async ({ resolve, event }) => {
  if (event.url.pathname.startsWith("/api")) {
    if (event.request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Origin": PUBLIC_SANITY_STUDIO_URL,
          "Access-Control-Allow-Headers": "*",
        },
      });
    }
  }

  const response = await resolve(event);
  if (event.url.pathname.startsWith("/api")) {
    response.headers.append("Access-Control-Allow-Origin", PUBLIC_SANITY_STUDIO_URL);
  }
  return response;
};
