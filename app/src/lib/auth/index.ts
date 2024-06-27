import GoogleProvider from "@auth/core/providers/google";
import { SvelteKitAuth } from "@auth/sveltekit";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "$env/static/private";
import { validateDomain } from "$lib/utils/domain";

export const {
  signIn,
  signOut,
  handle: createAuthHandler,
} = SvelteKitAuth({
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    signIn({ user }) {
      if (!user.email) return false;

      return validateDomain(user.email);
    },
  },
});
