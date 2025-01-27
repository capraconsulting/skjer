import { SANITY_API_WRITE_TOKEN, SANITY_API_READ_TOKEN } from "$env/static/private";
import { assertEnvVar } from "$lib/sanity/api";

export const readToken = assertEnvVar(SANITY_API_READ_TOKEN, "SANITY_API_READ_TOKEN");
export const writeToken = assertEnvVar(SANITY_API_WRITE_TOKEN, "SANITY_API_WRITE_TOKEN");
