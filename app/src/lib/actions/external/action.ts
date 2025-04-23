import jwt from "jsonwebtoken";
import validator from "validator";
import { type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import { getEventContent } from "$lib/server/sanity/queries";
import { getEventParticipant, getOrCreateEvent } from "$lib/server/supabase/queries";
import {
  deleteEventParticipant,
  executeTransaction,
  insertAndGetEventParticipant,
  insertEventFoodPreference,
  insertEventParticipantOptions,
} from "$lib/server/kysley/transactions";
import {
  registrationSchemaExternal,
  unregistrationSchemaExternal,
} from "$lib/schemas/external/schema";
import { RateLimiter } from "sveltekit-rate-limiter/server";
import { sendEmailAccepted } from "$lib/email/event/accepted";
import { sendEmailConfirmDecline } from "$lib/email/event/confirm-decline";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

// Helper function to get translations
function getTranslation(key: string): string {
  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'];
  if (!dict) return key; // Fallback if language not found

  // Parse the key path (e.g., "errors.cannotRegisterEvent")
  const parts = key.split('.');
  let value = dict;
  for (const part of parts) {
    if (!value[part]) return key; // Fallback if key not found
    value = value[part];
  }

  return value;
}

const limiter = new RateLimiter({
  IP: [20, "h"], // 20 rquests per hour from the same IP
  IPUA: [10, "m"], // 10 requests per 5 minutes when same IP and User-Agent
});

export const submitRegistrationExternal: Actions["submitRegistrationExternal"] = async (
  requestEvent
) => {
  const {
    request,
    params: { id },
  } = requestEvent;

  const registrationForm = await superValidate(request, zod(registrationSchemaExternal));

  if (!registrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(registrationForm, {
      text: getTranslation("errors.invalidForm"),
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(registrationForm, {
      text: getTranslation("errors.cannotRegisterEvent"),
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(registrationForm, {
      text: getTranslation("errors.rateLimitReached"),
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

  const { event_id } = event;

  const {
    data: { fullName, telephone, email, firm, attendingType, foodPreference, customOptions },
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
        full_name: fullName,
        telephone,
        email,
        firm,
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

export const submitUnregistrationExternal: Actions["submitUnregistrationExternal"] = async (
  requestEvent
) => {
  const {
    request,
    params: { id },
  } = requestEvent;

  const unregistrationForm = await superValidate(request, zod(unregistrationSchemaExternal));

  if (!unregistrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(unregistrationForm, {
      text: getTranslation("errors.invalidForm"),
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(unregistrationForm, {
      text: getTranslation("errors.rateLimitReached"),
      error: true,
    });
  }

  const event = await getOrCreateEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist or cannot be created");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  const {
    data: { event_id },
  } = event;

  const {
    data: { email },
  } = unregistrationForm;

  const eventParticipant = await getEventParticipant({ event_id, email });

  if (!eventParticipant.data?.email || !eventParticipant.data?.attending) {
    return message(unregistrationForm, {
      text: getTranslation("errors.noRegistrationFoundCheckEmail"),
      warning: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  if (!eventContent) {
    console.error("Error: The specified event does not exist as content");

    return message(unregistrationForm, {
      text: getTranslation("errors.cannotUnregisterEvent"),
      error: true,
    });
  }

  const data = { document_id: id, event_id, email };
  const secret = getUnsubscribeSecret(data);
  const token = jwt.sign({ data }, secret, { expiresIn: "2h" });

  const emailPayload = {
    id,
    to: email,
    summary: eventContent.title,
    organiser: eventContent.organisers,
    token,
  };

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailConfirmDecline(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(unregistrationForm, {
        text: getTranslation("errors.cannotUnregisterEvent"),
        warning: true,
      });
    }
  }

  return message(unregistrationForm, {
    text: getTranslation("success.unregistrationEmailSent"),
    success: true,
  });
};
