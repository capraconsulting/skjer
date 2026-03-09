import {
  PUBLIC_CAPRA_BASE_URL,
  PUBLIC_FRYDE_BASE_URL,
  PUBLIC_LIFLIG_BASE_URL,
  PUBLIC_SANITY_STUDIO_URL,
} from "$env/static/public";
import type { Handle } from "@sveltejs/kit";

const ALLOWED_ORIGIN = PUBLIC_SANITY_STUDIO_URL ?? "";
const ALLOWED_METHODS = "GET,OPTIONS,PATCH,DELETE,POST,PUT";
const ALLOWED_HEADERS =
  "authorization, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version";

const PUBLIC_API_ALLOWED_ORIGINS = [
  PUBLIC_CAPRA_BASE_URL,
  PUBLIC_LIFLIG_BASE_URL,
  PUBLIC_FRYDE_BASE_URL,
].flatMap((url) => getOriginVariants(url));

const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": ALLOWED_METHODS,
  "Access-Control-Allow-Headers": ALLOWED_HEADERS,
};

export function getPublicApiOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;
  return PUBLIC_API_ALLOWED_ORIGINS.includes(requestOrigin) ? requestOrigin : null;
}

function applyCustomHeaders(
  headers: Headers,
  pathname: string,
  requestOrigin?: string | null
): Headers {
  for (const [key, value] of Object.entries(corsHeaders)) {
    headers.set(key, value);
  }

  // For public API routes, allow requests from brand websites
  if (pathname.startsWith("/api/public/")) {
    const allowedOrigin = getPublicApiOrigin(requestOrigin ?? null);
    if (allowedOrigin) {
      headers.set("Access-Control-Allow-Origin", allowedOrigin);
      headers.set("Vary", "Origin");
    }
  }

  if (pathname === "/embed") {
    headers.set("X-Frame-Options", "ALLOWALL");
    headers.set(
      "Content-Security-Policy",
      getContentSecurityPolicyForEmbed([
        PUBLIC_CAPRA_BASE_URL,
        PUBLIC_LIFLIG_BASE_URL,
        PUBLIC_FRYDE_BASE_URL,
        PUBLIC_SANITY_STUDIO_URL,
      ])
    );
  } else {
    headers.set("X-Frame-Options", "DENY");
    headers.set("Content-Security-Policy", `frame-ancestors 'self' ${ALLOWED_ORIGIN}`);
  }
  return headers;
}

export function getContentSecurityPolicyForEmbed(urls: string[]): string {
  let csp = "frame-ancestors 'self'";

  for (const url of urls) {
    if (!url) {
      continue;
    }

    csp += ` ${url}`;

    // If the URL starts with "www.", we want to allow embedding from the non-www version of it too
    if (url.includes("www.")) {
      const alternateUrl = url.replace("www.", "");
      csp += ` ${alternateUrl}`;
    }
  }

  return csp;
}

function getOriginVariants(url?: string | null): string[] {
  if (!url) {
    return [];
  }

  const origins = [url];
  if (url.includes("www.")) {
    origins.push(url.replace("www.", ""));
  }

  return origins;
}

export const createCorsHandler: Handle = async ({ event, resolve }) => {
  const requestOrigin = event.request.headers.get("Origin");

  if (event.request.method === "OPTIONS") {
    const optionsHeaders = new Headers(corsHeaders);

    // For public API preflight requests, use the dynamic origin
    if (event.url.pathname.startsWith("/api/public/")) {
      const allowedOrigin = getPublicApiOrigin(requestOrigin);
      if (allowedOrigin) {
        optionsHeaders.set("Access-Control-Allow-Origin", allowedOrigin);
        optionsHeaders.set("Vary", "Origin");
      }
    }

    return new Response("OK", { headers: optionsHeaders });
  }

  const response = await resolve(event);
  const headers = applyCustomHeaders(
    new Headers(response.headers),
    event.url.pathname,
    requestOrigin
  );

  return new Response(response.body, { ...response, headers });
};
