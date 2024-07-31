import { SUPABASE_URL, SUPABASE_KEY } from "$env/static/private";

export function assertEnvVar<T>(value: T | undefined, name: string): T {
  if (value === undefined) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const supabaseUrl = assertEnvVar(SUPABASE_URL, "SUPABASE_URL");
export const supabaseKey = assertEnvVar(SUPABASE_KEY, "SUPABASE_KEY");
