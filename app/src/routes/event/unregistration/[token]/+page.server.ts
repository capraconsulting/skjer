import jwt from "jsonwebtoken";
import type { PageServerLoad } from "./$types";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import type { DecodedToken } from "$models/jwt.model";
import { setParticipantNotAttending } from "$lib/server/supabase/queries";
import { getEventContent } from "$lib/server/sanity/queries";
import { sendUnregistrationConfirmed } from "$lib/email/event/unregistration";

export const load: PageServerLoad = async ({ params: { token } }) => {
  const tokenDecoded = jwt.decode(token, { complete: true }) as {
    payload: DecodedToken | null;
  } | null;

  if (!tokenDecoded?.payload?.data) {
    return {
      error: true,
      message: "Vi kunne dessverre ikke melde deg av arrangementet. Vennligst prøv igjen senere.",
    };
  }

  const { data } = tokenDecoded.payload;
  const secret = getUnsubscribeSecret(data);

  try {
    if (jwt.verify(token, secret)) {
      await setParticipantNotAttending(tokenDecoded.payload.data);
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        error: true,
        message: "Lenken du brukte er ikke lenger gyldig. Vennligst forsøk igjen senere.",
      };
    }
  }

  const { document_id, email } = data;

  const eventContent = await getEventContent({ document_id });

  const emailPayload = {
    id: document_id,
    mailTo: email,
    summary: eventContent.title,
    description: eventContent.summary,
    start: eventContent.start,
    end: eventContent.end,
    location: eventContent.place,
    organiser: eventContent.organisers.join(" | "),
  };

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendUnregistrationConfirmed(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return {
        text: "Det har oppstått en feil. Du er meldt av arrangement 👋 men e-post bekreftelse er ikke sendt.",
        warning: true,
      };
    }
  }

  return {
    success: true,
    message: "Du er nå meldt av arrangementet 👋 Vi har sendt deg en bekreftelse på e-post.",
  };
};
