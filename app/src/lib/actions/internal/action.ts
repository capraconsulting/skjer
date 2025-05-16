import { sendEmailAccepted } from "$lib/email/event/accepted";
import { sendEmailDeclined } from "$lib/email/event/declined";
import { dictionary, locale } from "$lib/i18n";
import {
  registrationSchemaInternal,
  unregistrationSchemaInternal,
} from "$lib/schemas/internal/schema";
import {
  deleteEventParticipant,
  executeTransaction,
  insertAndGetEventParticipant,
  insertEventFoodPreference,
  insertEventParticipantOptions,
} from "$lib/server/kysley/transactions";
import { getEventContent } from "$lib/server/sanity/queries";
import {
  getEventParticipant,
  getOrCreateEvent,
  setParticipantNotAttending,
} from "$lib/server/supabase/queries";
import { type Actions } from "@sveltejs/kit";
import { RateLimiter } from "sveltekit-rate-limiter/server";
import { zod } from "sveltekit-superforms/adapters";
import { message, superValidate } from "sveltekit-superforms/server";
import validator from "validator";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

/**
 ** IP: Allows 40 requests per hour from the same IP address.
 ** IPUA (IP and User-Agent): Allows 20 requests per 5 minutes when both the IP address and the User-Agent of the requester are considered.
 **/

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
const limiter = new RateLimiter({
  IP: [40, "h"],
  IPUA: [20, "m"],
});

export const submitRegistrationInternal: Actions["submitRegistrationInternal"] = async (
  requestEvent
) => {
  const {
    request,
    locals,
    params: { id },
  } = requestEvent;

  const registrationForm = await superValidate(request, zod(registrationSchemaInternal));

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  if (!registrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(registrationForm, {
      text: getTranslation("errors.invalidForm"),
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(registrationForm, {
      text: getTranslation("errors.rateLimitReached"),
      error: true,
    });
  }

  const auth = await locals.auth();

  if (!auth?.user?.email || !auth.user.name) {
    console.error("Error: Could not retrieve user");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  if (!eventContent) {
    console.error("Error: The specified event does not exist as content");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  const { data: event } = await getOrCreateEvent({ document_id: id });

  if (!event) {
    console.error("Error: The specified event does not exist or cannot be created");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  const {
    user: { email, name: fullName },
  } = auth;

  const { event_id } = event;

  const {
    data: { attendingType, foodPreference, customOptions },
  } = registrationForm;

  const eventParticipant = await getEventParticipant({
    event_id,
    email,
  });

  if (eventParticipant.error) {
    console.error("Error: Participant cannot be loaded");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  if (eventParticipant.data?.attending) {
    return message(registrationForm, {
      text: getTranslation("success.alreadyRegistered"),
      warning: true,
    });
  }

  try {
    await executeTransaction(async (transaction) => {
      if (eventParticipant.data) {
        await deleteEventParticipant(transaction, { event_id, email });
      }

      const participantPayload = {
        event_id,
        email,
        full_name: fullName,
        attending_digital: attendingType === "Digitalt",
      };

      const { event_participant_id } = await insertAndGetEventParticipant(
        transaction,
        participantPayload
      );

      if (customOptions.length) {
        const participantOptionsPayload = customOptions.map(({ option, value }) => ({
          event_participant_id,
          option,
          value,
        }));

        await insertEventParticipantOptions(transaction, participantOptionsPayload);
      }

      if (foodPreference) {
        await insertEventFoodPreference(transaction, { event_id, value: foodPreference });
      }
    });
  } catch (error) {
    console.error("Error: Transaction failed", JSON.stringify(error));

    return message(registrationForm, {
      text: getTranslation("errors.registrationFailed"),
      error: true,
    });
  }

  const emailPayload = {
    id,
    to: email,
    summary: eventContent.title,
    description: eventContent.summary,
    start: eventContent.start,
    end: eventContent.end,
    location: eventContent.place,
    organiser: eventContent.organisers,
    subject: eventContent.emailTemplate.registrationSubject,
    message: eventContent.emailTemplate.registrationMessage,
  };

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailAccepted(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(registrationForm, {
        text: getTranslation("errors.emailNotSent"),
        warning: true,
      });
    }
  }

  // Replace {email} placeholder with actual email
  const successMessage = getTranslation("success.registrationComplete").replace("{email}", email);

  return message(registrationForm, {
    text: successMessage,
    success: true,
  });
};

export const submitUnregistrationInternal: Actions["submitUnregistrationInternal"] = async (
  requestEvent
) => {
  const {
    request,
    locals,
    params: { id },
  } = requestEvent;
  const unregistrationForm = await superValidate(request, zod(unregistrationSchemaInternal));

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(unregistrationForm, {
      text: getTranslation("errors.rateLimitReached"),
      error: true,
    });
  }

  const auth = await locals.auth();

  if (!auth?.user?.email) {
    console.error("Error: Could not retrieve user");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  const event = await getOrCreateEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist and cannot be created");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  const {
    data: { event_id },
  } = event;

  const {
    user: { email },
  } = auth;

  const data = { event_id, email };

  const eventParticipant = await getEventParticipant(data);

  if (!eventParticipant.data?.attending) {
    return message(unregistrationForm, {
      text: getTranslation("success.alreadyUnregistered"),
      warning: true,
    });
  }

  if (!eventParticipant.data?.email) {
    return message(unregistrationForm, {
      text: getTranslation("errors.noRegistrationFound"),
      error: true,
    });
  }

  const attendingResult = await setParticipantNotAttending(data);
  if (!attendingResult) {
    console.error("Error: Failed to update participant attending");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  const emailPayload = {
    id,
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

      return message(unregistrationForm, {
        text: getTranslation("errors.unregistrationEmailNotSent"),
        warning: true,
      });
    }
  }

  return message(unregistrationForm, {
    text: getTranslation("success.unregistrationComplete"),
    success: true,
  });
};
