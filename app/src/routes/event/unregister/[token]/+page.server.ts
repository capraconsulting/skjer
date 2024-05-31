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

    if (jwt.verify(token, secret)) {
      await updateEventParticipantAttending(tokenDecoded.payload.data);
      return { success: true };
    }
  }
  return { success: false };
};
