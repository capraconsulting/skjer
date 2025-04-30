import jwt from "jsonwebtoken";
import type { PageServerLoad } from "./$types";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import type { DecodedToken } from "$models/jwt.model";
import { setParticipantNotAttending } from "$lib/server/supabase/queries";
import { getEventContent } from "$lib/server/sanity/queries";
import { sendEmailDeclined } from "$lib/email/event/declined";
import { dictionary, locale } from "$lib/i18n";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

// Define a consistent return type for the load function
interface LoadReturn {
  success?: boolean;
  error?: boolean;
  warning?: boolean;
  message?: string;
  text?: string;
}

// Helper function to get translations
function getTranslation(key: string): string {
  // Get the dictionary for the current language
  const currentLocale = get(locale) || 'nb';
  const dict = get(dictionary)[currentLocale];
  if (!dict) return key; // Fallback if language not found

  // Parse the key path (e.g., "errors.cannotRegisterEvent")
  const parts = key.split('.');
  let value: DictionaryValue = dict;
  for (const part of parts) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !(part in value)) return key; // Fallback if key not found
    value = value[part];
  }

  return String(value);
}

const rateLimitMap: Map<string, number> = new Map();

export const load: PageServerLoad<LoadReturn> = async ({ params: { token } }) => {
  const now = Date.now();
  const lastAccess = rateLimitMap.get(token);

  if (lastAccess && now - lastAccess < 30000) {
    return {
      error: true,
      message: getTranslation("errors.rateLimitReached30Sec"),
    };
  }

  rateLimitMap.set(token, now);

  const tokenDecoded = jwt.decode(token, { complete: true }) as {
    payload: DecodedToken | null;
  } | null;

  if (!tokenDecoded?.payload?.data) {
    return {
      error: true,
      message: getTranslation("errors.cannotUnregisterEvent"),
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
        message: getTranslation("errors.linkExpired"),
      };
    }
    // Handle other JWT verification errors
    return {
      error: true,
      message: getTranslation("errors.cannotUnregisterEvent"),
    };
  }

  const { document_id, email } = data;

  const eventContent = await getEventContent({ document_id });

  const emailPayload = {
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

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailDeclined(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return {
        text: getTranslation("errors.unregistrationEmailNotSent"),
        warning: true,
      };
    }
  }

  return {
    success: true,
    message: getTranslation("success.unregistrationComplete"),
  };
};
