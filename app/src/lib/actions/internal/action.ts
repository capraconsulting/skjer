import { sendEmailAccepted } from "$lib/email/event/accepted";
import { sendEmailDeclined } from "$lib/email/event/declined";
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

/**
 ** IP: Allows 40 requests per hour from the same IP address.
 ** IPUA (IP and User-Agent): Allows 20 requests per 5 minutes when both the IP address and the User-Agent of the requester are considered.
 **/
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
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  if (!registrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Det ufylte skjemaet er ikke gyldig.",
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(registrationForm, {
      text: "Du har nådd grensen for antall forsøk. Vennligst vent en stund før du prøver igjen.",
      error: true,
    });
  }

  const auth = await locals.auth();

  if (!auth?.user?.email || !auth.user.name) {
    console.error("Error: Could not retrieve user");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  if (!eventContent) {
    console.error("Error: The specified event does not exist as content");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const { data: event } = await getOrCreateEvent({ document_id: id });

  if (!event) {
    console.error("Error: The specified event does not exist or cannot be created");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
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
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  if (eventParticipant.data?.attending) {
    return message(registrationForm, {
      text: "Denne e-postadressen er allerede registrert for deltagelse i arrangementet. Vennligst meld deg av dersom dette er en feil.",
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
    console.error(
      "Error: Transaction failed",
      error instanceof Error ? error.message : String(error)
    );

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
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

  const { error: emailError } = await sendEmailAccepted(emailPayload);

  if (emailError) {
    console.error("Error: Failed to send email");

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har blitt påmeldt arrangement, men e-post bekreftelse er ikke sendt.",
      warning: true,
    });
  }

  return message(registrationForm, {
    text: `Du har meldt deg på arrangementet! Du får en bekreftelse på ${email} hvert øyeblikk. Vi gleder oss til å se deg!`,
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
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(unregistrationForm, {
      text: "Du har nådd grensen for antall forsøk. Vennligst vent en stund før du prøver igjen.",
      error: true,
    });
  }

  const auth = await locals.auth();

  if (!auth?.user?.email) {
    console.error("Error: Could not retrieve user");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const event = await getOrCreateEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist and cannot be created");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
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
      text: "Du er allerede meldt av arrangementet. Takk for interessen din!",
      warning: true,
    });
  }

  if (!eventParticipant.data?.email) {
    return message(unregistrationForm, {
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet.",
      error: true,
    });
  }

  const attendingResult = await setParticipantNotAttending(data);
  if (!attendingResult) {
    console.error("Error: Failed to update participant attending");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
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

  const { error: emailError } = await sendEmailDeclined(emailPayload);

  if (emailError) {
    console.error("Error: Failed to send email");

    return message(unregistrationForm, {
      text: "Du er nå meldt av arrangementet 👋 Vi kunne dessverre ikke sende en e-post bekreftelse.",
      warning: true,
    });
  }

  return message(unregistrationForm, {
    text: "Du er nå meldt av arrangementet 👋 Vi har sendt deg en bekreftelse på e-post.",
    success: true,
  });
};
