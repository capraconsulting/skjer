import jwt from "jsonwebtoken";
import type { PageServerLoad } from "./$types";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import type { DecodedToken } from "$models/jwt.model";
import { updateEventParticipantAttending } from "$lib/server/supabase/queries";

export const load: PageServerLoad = async ({ params: { token } }) => {
  const tokenDecoded = jwt.decode(token, { complete: true }) as {
    payload: DecodedToken | null;
  } | null;

  if (tokenDecoded?.payload?.data) {
    const secret = getUnsubscribeSecret(tokenDecoded.payload.data);

    try {
      if (jwt.verify(token, secret)) {
        await updateEventParticipantAttending(tokenDecoded.payload.data);
        return { success: true, message: "Du er nå meldt av arrangementet." };
      }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          error: true,
          message: "Lenken du brukte er ikke lenger gyldig. Vennligst forsøk igjen senere.",
        };
      }
    }
  }
  return {
    error: true,
    message: "Vi kunne dessverre ikke melde deg av arrangementet. Vennligst prøv igjen senere.",
  };
};
