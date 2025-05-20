import jwt from "jsonwebtoken";
import type { PageServerLoad } from "./$types";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import type { DecodedToken } from "$models/jwt.model";
import { setParticipantNotAttending } from "$lib/server/supabase/queries";
import { getEventContent } from "$lib/server/sanity/queries";
import { sendEmailDeclined } from "$lib/email/event/declined";
import type { EmailDeclinedProps } from "$lib/email/event/declined";
import { getPreferredLanguageFromRequest, getTranslation } from "$lib/i18n";

// Define a consistent return type for the load function
interface LoadReturn {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  message?: string;
  messageKey?: string;
  text?: string;
}

const rateLimitMap: Map<string, number> = new Map();

export const load: PageServerLoad<LoadReturn> = async ({ params: { token }, request }) => {
  const preferredLanguage = getPreferredLanguageFromRequest(request);
  const now = Date.now();
  const lastAccess = rateLimitMap.get(token);

  if (lastAccess && now - lastAccess < 30000) {
    return {
      error: true,
      message: getTranslation("errors.rateLimitReached30Sec", preferredLanguage),
    };
  }

  rateLimitMap.set(token, now);

  const tokenDecoded = jwt.decode(token, { complete: true }) as {
    payload: DecodedToken | null;
  } | null;

  if (!tokenDecoded?.payload?.data) {
    return {
      error: true,
      message: getTranslation("errors.cannotUnregisterEvent", preferredLanguage),
    };
  }

  const { data } = tokenDecoded.payload;
  const secret = getUnsubscribeSecret(data);

  try {
    // Verify token and explicitly type the return value
    const verified = jwt.verify(token, secret) as DecodedToken;
    if (verified) {
      await setParticipantNotAttending(tokenDecoded.payload.data);
    }
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        error: true,
        message: getTranslation("errors.linkExpired", preferredLanguage),
      };
    }
    // Handle other JWT verification errors
    return {
      error: true,
      message: getTranslation("errors.cannotUnregisterEvent", preferredLanguage),
    };
  }

  const { document_id, email } = data;

  const eventContent = await getEventContent({ document_id });

  const emailPayload: EmailDeclinedProps = {
    id: document_id,
    to: email,
    summary: eventContent.title,
    description: eventContent.summary,
    start: eventContent.start,
    end: eventContent.end,
    location: eventContent.place,
    organiser: eventContent.organisers,
    subject: eventContent.emailTemplate.unregistrationSubject,
    message: eventContent.emailTemplate.unregistrationMessage,
  };

  const { error: emailError } = await sendEmailDeclined(emailPayload);

  if (emailError) {
    console.error("Error: Failed to send email");

    return {
      message: getTranslation("errors.unregistrationEmailNotSent", preferredLanguage),
      warning: true,
    };
  }

  return {
    success: true,
    message: getTranslation("success.unregistrationComplete", preferredLanguage),
  };
};
