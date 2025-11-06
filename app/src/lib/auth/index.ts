import GoogleProvider from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, AUTH_SECRET } from "$env/static/private";
import { dev } from "$app/environment";
import { validateDomain } from "$lib/utils/domain";

// Validate required environment variables
if (!AUTH_SECRET || !GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("Missing auth environment variables:");
  throw new Error("Missing required environment variables for authentication");
}

// Add explicit configuration to avoid basePath issues
const authConfig = {
  secret: AUTH_SECRET,
  trustHost: true,
  debug: dev,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn({ user }: { user: { email?: string | null } }) {
      if (!user.email) return false;

      return validateDomain(user.email);
    },
  },
};

// Ensure we don't pass undefined basePath
if (dev) {
  console.log("Auth config in dev mode:", {
    hasSecret: !!authConfig.secret,
    trustHost: authConfig.trustHost,
  });
}

export const { signIn, signOut, handle: createAuthHandler } = SvelteKitAuth(authConfig);
