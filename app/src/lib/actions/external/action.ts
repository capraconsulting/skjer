import jwt from "jsonwebtoken";
import validator from "validator";
import { type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { sanitize } from "$lib/utils/sanitize.util";
import { getUnsubscribeSecret } from "$lib/auth/secret";
import { sendEventConfirmationEmail } from "$lib/email/confirmation";
import { getEventContent } from "$lib/server/sanity/queries";
import { getEvent, getEventParticipant } from "$lib/server/supabase/queries";
import {
  deleteEventParticipant,
  executeTransaction,
  insertAndGetEventParticipant,
  insertAndGetEventParticipantAllergy,
  insertEventParticipantAllergies,
  insertEventParticipantOptions,
} from "$lib/server/kysley/transactions";
import {
  registrationSchemaExternal,
  unregistrationSchemaExternal,
} from "$lib/schemas/external/schema";

export const submitRegistrationExternal: Actions["submitRegistrationExternal"] = async ({
  request,
  params: { id },
}) => {
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

  const { event_id } = event;

  const {
    data: { fullName, telephone, email, firm, attendingType, allergies, customOptions },
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

      if (customOptions.length && eventContent.customOptions?.length) {
        const participantOptionsPayload = eventContent.customOptions
          .filter((field) => customOptions.includes(sanitize(field)))
          .map((option) => ({
            option,
            event_participant_id,
          }));

        await insertEventParticipantOptions(transaction, participantOptionsPayload);
      }

      if (allergies.length) {
        const { event_participant_allergy_id } =
          await insertAndGetEventParticipantAllergy(transaction);

        const participantAllergyPayload = allergies.map((allergy_id) => ({
          allergy_id,
          event_id,
          event_participant_allergy_id,
        }));

        await insertEventParticipantAllergies(transaction, participantAllergyPayload);
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
    email,
    fullName,
    title: eventContent.title,
    description: eventContent.summary,
    start: eventContent.start,
    end: eventContent.end,
    location: eventContent.place,
    organisers: eventContent.organisers,
  };

  const { error: emailError } = await sendEventConfirmationEmail(emailPayload);

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

export const submitUnregistrationExternal: Actions["submitUnregistrationExternal"] = async ({
  request,
  params: { id },
}) => {
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
    data: { email },
  } = unregistrationForm;

  const data = { event_id, email };

  const eventParticipant = await getEventParticipant(data);

  if (!eventParticipant.data?.email || !eventParticipant.data?.attending) {
    return message(unregistrationForm, {
      text: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet. Vennligst sjekk at du har oppgitt riktig e-postadresse.",
      warning: true,
    });
  }

  const secret = getUnsubscribeSecret(data);
  const token = jwt.sign({ data }, secret, { expiresIn: "2h" });

  // send jwt token to email
  // returning for demo purpose
  return message(unregistrationForm, {
    token,
    text: "En e-post har blitt sendt til adressen du oppga. Vennligst følg instruksjonen i e-posten for å fullføre.",
    success: true,
  });
};
