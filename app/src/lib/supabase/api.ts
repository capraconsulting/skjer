import {
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_KEY
} from '$env/static/public';

export function assertEnvVar<T>(value: T | undefined, name: string): T {
	if (value === undefined) {
		throw new Error(`Missing environment variable: ${name}`);
	}
	return value;
}

export const supabaseUrl = assertEnvVar(PUBLIC_SUPABASE_URL, 'PUBLIC_SUPABASE_URL');

export const supabaseKey = assertEnvVar(PUBLIC_SUPABASE_KEY, 'PUBLIC_SUPABASE_KEY');