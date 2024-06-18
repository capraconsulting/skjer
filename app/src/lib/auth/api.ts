import { PUBLIC_SANITY_STUDIO_URL } from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": PUBLIC_SANITY_STUDIO_URL,
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers":
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
};

export const createCorsHandler: Handle = async ({ event, resolve }) => {
  if (event.request.method !== "OPTIONS") {
    const response = await resolve(event);

    const headers = new Headers(response.headers);

    for (const [key, value] of Object.entries(corsHeaders)) {
      headers.set(key, value);
    }
    return response;
  }

  return new Response("OK", { headers: corsHeaders });
};
