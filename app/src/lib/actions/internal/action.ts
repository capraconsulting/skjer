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
import { toLocalIsoString } from "$lib/utils/date.util";

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

  const result = await getOrCreateEvent({ document_id: id });
  const event = result.data;

  if (!event) {
    console.error("Error: The specified event does not exist or cannot be created");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  // We've already checked auth.user exists above
  const email = auth.user.email;
  const fullName = auth.user.name;

  const { event_id } = event;

  // Extract form data with null checks
  const formData = registrationForm.data;
  if (!formData) {
    return message(registrationForm, {
      text: "Det har oppstått et problem. Skjemadata mangler.",
      error: true,
    });
  }

  const { attendingType, foodPreference, customOptions } = formData;

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

      if (customOptions && customOptions.length > 0) {
        const participantOptionsPayload = customOptions.map(({ option, value }) => ({
          event_participant_id,
          option,
          value: value || null,
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
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      error: true,
    });
  }

  // Ensure eventContent and its properties exist
  if (!eventContent || !eventContent.emailTemplate) {
    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har blitt påmeldt arrangement, men e-post bekreftelse kan ikke sendes.",
      warning: true,
    });
  }

  const emailPayload = {
    id,
    to: email,
    summary: eventContent.title || '',
    description: eventContent.summary || '',
    start: eventContent.start ? toLocalIsoString(eventContent.start) : '',
    end: eventContent.end ? toLocalIsoString(eventContent.end) : '',
    location: eventContent.place || '',
    organiser: eventContent.organisers || '',
    subject: eventContent.emailTemplate.registrationSubject || 'Bekreftelse på påmelding',
    message: eventContent.emailTemplate.registrationMessage || '',
  };

  //if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailAccepted(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(registrationForm, {
        text: "Det har oppstått en feil. Du har blitt påmeldt arrangement, men e-post bekreftelse er ikke sendt.",
        warning: true,
      });
    }
  //}

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

  const result = await getOrCreateEvent({ document_id: id });
  const eventData = result.data;

  if (!eventData || !eventData.event_id) {
    console.error("Error: The specified event does not exist and cannot be created");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const event_id = eventData.event_id;

  // We've already checked auth.user exists above
  const email = auth.user.email;

  const data = { event_id, email };

  const eventParticipantResult = await getEventParticipant(data);
  const participantData = eventParticipantResult.data;

  // Check if participant data exists and has valid properties
  if (!participantData) {
    return message(unregistrationForm, {
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet.",
      error: true,
    });
  }

  if (!participantData.attending) {
    return message(unregistrationForm, {
      text: "Du er allerede meldt av arrangementet. Takk for interessen din!",
      warning: true,
    });
  }

  if (!participantData.email) {
    return message(unregistrationForm, {
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet.",
      error: true,
    });
  }

  const attendingResult = await setParticipantNotAttending(data);
  if (!attendingResult || attendingResult.error) {
    console.error("Error: Failed to update participant attending");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  // Ensure eventContent and its properties exist
  if (!eventContent || !eventContent.emailTemplate) {
    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du har blitt avmeldt arrangementet, men e-post bekreftelse kan ikke sendes.",
      warning: true,
    });
  }

  const emailPayload = {
    id,
    to: email,
    summary: eventContent.title || '',
    description: eventContent.summary || '',
    start: eventContent.start ? toLocalIsoString(eventContent.start) : '',
    end: eventContent.end ? toLocalIsoString(eventContent.end) : '',
    location: eventContent.place || '',
    organiser: eventContent.organisers || '',
    subject: eventContent.emailTemplate.unregistrationSubject || 'Bekreftelse på avmelding',
    message: eventContent.emailTemplate.unregistrationMessage || '',
  };

 // if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailDeclined(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(unregistrationForm, {
        text: "Du er nå meldt av arrangementet 👋 Vi kunne dessverre ikke sende en e-post bekreftelse.",
        warning: true,
      });
    }
  // }

  return message(unregistrationForm, {
    text: "Du er nå meldt av arrangementet 👋 Vi har sendt deg en bekreftelse på e-post.",
    success: true,
  });
};
