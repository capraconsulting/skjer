import {
  PUBLIC_CAPRA_BASE_URL,
  PUBLIC_FRYDE_BASE_URL,
  PUBLIC_LIFLIG_BASE_URL,
  PUBLIC_SANITY_STUDIO_URL,
} from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

// Define allowed origins as an array to support multiple origins
const ALLOWED_ORIGINS = [
  PUBLIC_SANITY_STUDIO_URL,
  PUBLIC_CAPRA_BASE_URL,
  PUBLIC_FRYDE_BASE_URL,
  PUBLIC_LIFLIG_BASE_URL
].filter(Boolean); // Filter out any undefined or empty values

const ALLOWED_METHODS = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
const ALLOWED_HEADERS =
  "authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";

// Function to get CORS headers based on the origin of the request
function getCorsHeaders(requestOrigin: string | null): Record<string, string> {
  // Default to the first allowed origin if request origin is not in the allowed list
  const origin = requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)
    ? requestOrigin
    : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": ALLOWED_METHODS,
    "Access-Control-Allow-Headers": ALLOWED_HEADERS,
  };
}

function applyCustomHeaders(headers: Headers, pathname: string, requestOrigin: string | null): Headers {
  // Apply CORS headers
  const corsHeaders = getCorsHeaders(requestOrigin);
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  // Create a string of all allowed origins for Content-Security-Policy
  const originsString = ALLOWED_ORIGINS.join(' ');

  if (pathname === "/embed") {
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${originsString}`
    );
  } else {
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", `frame-ancestors 'self' ${corsHeaders["Access-Control-Allow-Origin"]}`);
  }
  return headers;
}

export const createCorsHandler: Handle = async ({ event, resolve }) => {
  // Get the origin from the request headers
  const requestOrigin = event.request.headers.get('origin');

  if (event.request.method === "OPTIONS") {
    // For preflight requests, return a simple response with CORS headers
    return new Response("OK", { headers: getCorsHeaders(requestOrigin) });
  }

  const response = await resolve(event);
  const headers = applyCustomHeaders(new Headers(response.headers), event.url.pathname, requestOrigin);

  // Create a new response with the same body, status, and statusText, but with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: headers
  });
};
