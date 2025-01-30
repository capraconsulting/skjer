import {
  PUBLIC_CAPRA_BASE_URL,
  PUBLIC_FRYDE_BASE_URL,
  PUBLIC_LIFLIG_BASE_URL,
  PUBLIC_SANITY_STUDIO_URL,
} from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

const ALLOWED_ORIGIN = PUBLIC_SANITY_STUDIO_URL;
const ALLOWED_METHODS = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
const ALLOWED_HEADERS =
  "authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": ALLOWED_METHODS,
  "Access-Control-Allow-Headers": ALLOWED_HEADERS,
};

function applyCustomHeaders(headers: Headers, pathname: string): Headers {
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  if (pathname === "/embed") {
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${PUBLIC_CAPRA_BASE_URL} ${PUBLIC_LIFLIG_BASE_URL} ${PUBLIC_FRYDE_BASE_URL} ${PUBLIC_SANITY_STUDIO_URL}`
    );
  } else {
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", `frame-ancestors 'self' ${ALLOWED_ORIGIN}`);
  }
  return headers;
}

export const createCorsHandler: Handle = async ({ event, resolve }) => {
  if (event.request.method === "OPTIONS") {
    return new Response("OK", { headers: corsHeaders });
  }

  const response = await resolve(event);
  const headers = applyCustomHeaders(new Headers(response.headers), event.url.pathname);

  return new Response(response.body, { ...response, headers });
};
