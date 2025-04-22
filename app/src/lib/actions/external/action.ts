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
import { toLocalIsoString } from "$lib/utils/date.util";

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
      text: "Det har oppstått et problem. Det ufylte skjemaet er ikke gyldig.",
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(registrationForm, {
      text: "Du har nådd grensen for antall forsøk. Vennligst vent en stund før du prøver igjen.",
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

  const { event_id } = event;

  // Extract form data with null checks
  const formData = registrationForm.data;
  if (!formData) {
    return message(registrationForm, {
      text: "Det har oppstått et problem. Skjemadata mangler.",
      error: true,
    });
  }

  const { fullName, telephone, email, firm, attendingType, foodPreference, customOptions } = formData;

  const eventParticipantResult = await getEventParticipant({
    event_id,
    email,
  });

  if (!eventParticipantResult || eventParticipantResult.error) {
    console.error("Error: Participant cannot be loaded");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const participantData = eventParticipantResult.data;

  if (participantData && participantData.attending) {
    return message(registrationForm, {
      text: "Denne e-postadressen er allerede registrert for deltagelse i arrangementet. Vennligst meld deg av dersom dette er en feil.",
      warning: true,
    });
  }

  try {
    await executeTransaction(async (transaction) => {
      if (eventParticipantResult.data) {
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

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailAccepted(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(registrationForm, {
        text: "Det har oppstått en feil. Du har blitt påmeldt arrangement, men e-post bekreftelse er ikke sendt.",
        warning: true,
      });
    }
  }

  return message(registrationForm, {
    text: `Du har meldt deg på arrangementet! Du får en bekreftelse på ${email} hvert øyeblikk. Vi gleder oss til å se deg!`,
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
      text: "Det har oppstått en feil. Det ufylte skjemaet er ikke gyldig.",
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  if (await limiter.isLimited(requestEvent)) {
    return message(unregistrationForm, {
      text: "Du har nådd grensen for antall forsøk. Vennligst vent en stund før du prøver igjen.",
      error: true,
    });
  }

  const result = await getOrCreateEvent({ document_id: id });
  const eventData = result.data;

  if (!eventData || !eventData.event_id) {
    console.error("Error: The specified event does not exist or cannot be created");

    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const event_id = eventData.event_id;

  // Extract form data with null checks
  const formData = unregistrationForm.data;
  if (!formData) {
    return message(unregistrationForm, {
      text: "Det har oppstått et problem. Skjemadata mangler.",
      error: true,
    });
  }

  const { email } = formData;

  const eventParticipantResult = await getEventParticipant({ event_id, email });
  const participantData = eventParticipantResult.data;

  // Check if participant data exists and has valid properties
  if (!participantData || !participantData.email || !participantData.attending) {
    return message(unregistrationForm, {
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet. Vennligst sjekk at du har oppgitt riktig e-postadresse.",
      warning: true,
    });
  }

  const eventContent = await getEventContent({ document_id: id });

  if (!eventContent) {
    console.error("Error: The specified event does not exist as content");

    return message(unregistrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const data = { document_id: id, event_id, email };
  const secret = getUnsubscribeSecret(data);
  const token = jwt.sign({ data }, secret, { expiresIn: "2h" });

  // Ensure eventContent properties exist
  if (!eventContent) {
    return message(unregistrationForm, {
      text: "Det har oppstått en feil. Vi kunne ikke sende bekreftelse på avmelding.",
      warning: true,
    });
  }

  const emailPayload = {
    id,
    to: email,
    summary: eventContent.title || '',
    organiser: eventContent.organisers || '',
    token,
  };

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEmailConfirmDecline(emailPayload);

    if (emailError) {
      console.error("Error: Failed to send email");

      return message(unregistrationForm, {
        text: "Det har oppstått et problem. Du kan ikke melde deg av dette arrangementet.",
        warning: true,
      });
    }
  }

  return message(unregistrationForm, {
    text: "En e-post har blitt sendt til adressen du oppga. Vennligst følg instruksjonen i e-posten for å fullføre.",
    success: true,
  });
};
