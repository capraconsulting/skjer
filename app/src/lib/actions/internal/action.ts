import validator from "validator";
import { type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sanitize } from "$lib/utils/sanitize.util";
import { getEventContent } from "$lib/server/sanity/queries";
import {
  getEvent,
  getEventParticipant,
  updateEventParticipantAttending,
} from "$lib/server/supabase/queries";
import {
  deleteEventParticipant,
  executeTransaction,
  insertAndGetEventParticipant,
  insertEventFoodPreference,
  insertEventParticipantOptions,
} from "$lib/server/kysley/transactions";
import {
  registrationSchemaInternal,
  unregistrationSchemaInternal,
} from "$lib/schemas/internal/schema";
import { sendEventRegistrationConfirmed } from "$lib/email/event-registration";

export const submitRegistrationInternal: Actions["submitRegistrationInternal"] = async ({
  request,
  locals,
  params: { id },
}) => {
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

  const auth = await locals.auth();

  if (!auth?.user?.email || !auth?.user?.name) {
    console.error("Error: Could not retrieve user");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const { data: event } = await getEvent({ document_id: id });

  if (!event) {
    console.error("Error: The specified event does not exist");

    return message(registrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const eventContent = await getEventContent({ id });

  if (!eventContent) {
    console.error("Error: The specified event does not exist as content");

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

      if (customOptions.length && eventContent.customOptions?.length) {
        const participantOptionsPayload = eventContent.customOptions
          .filter((field) => customOptions.includes(sanitize(field)))
          .map((option) => ({
            option,
            event_participant_id,
            value: true,
          }));

        await insertEventParticipantOptions(transaction, participantOptionsPayload);
      }

      if (foodPreference) {
        await insertEventFoodPreference(transaction, { event_id, text: foodPreference });
      }
    });
  } catch (error) {
    console.error("Error: Transaction failed", JSON.stringify(error));

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      error: true,
    });
  }

  const emailPayload = {
    id,
    mailTo: email,
    summary: eventContent.title,
    description: eventContent.summary,
    start: eventContent.start,
    end: eventContent.end,
    location: eventContent.place,
    organiser: eventContent.organisers.join(" | "),
  };

  if (process.env.NODE_ENV !== "development") {
    const { error: emailError } = await sendEventRegistrationConfirmed(emailPayload);

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

export const submitUnregistrationInternal: Actions["submitUnregistrationInternal"] = async ({
  request,
  locals,
  params: { id },
}) => {
  const unregistrationForm = await superValidate(request, zod(unregistrationSchemaInternal));

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(unregistrationForm, {
      text: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
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

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist");

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

  if (eventParticipant.data?.attending) {
    await updateEventParticipantAttending(data);

    return message(unregistrationForm, {
      success: true,
      text: "Du er nå meldt av arrangementet.",
    });
  }

  if (!eventParticipant.data?.email) {
    return message(unregistrationForm, {
      warning: true,
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet.",
    });
  }

  return message(unregistrationForm, {
    warning: true,
    text: "Du er allerede meldt av arrangementet. Takk for interessen din!",
  });
};
