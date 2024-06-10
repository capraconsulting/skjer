import { type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { sendEventConfirmationEmail } from "$lib/email/confirmation";
import {
  getEvent,
  saveEventParticipantAllergy,
  saveEventParticipant,
  getEventParticipant,
  saveEventParticipantOptions,
  saveEventAllergies,
  deleteEventParticipant,
} from "$lib/server/supabase/queries";
import { getEventContent } from "$lib/server/sanity/queries";
import { sanitize } from "$lib/utils/sanitize.util";

export const submitRegistration: Actions["submitRegistration"] = async ({
  request,
  params: { id },
}) => {
  const registrationForm = await superValidate(request, zod(registrationSchema));

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

  if (eventParticipant.data?.attending) {
    return message(registrationForm, {
      text: "Denne e-postadressen er allerede registrert for deltagelse i arrangementet. Vennligst meld deg av dersom dette er en feil.",
      warning: true,
    });
  }

  if (eventParticipant.data) {
    const { error } = await deleteEventParticipant({ event_id, email });

    if (error) {
      console.error("Error: Could not delete participant information", error);

      return message(registrationForm, {
        text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
        error: true,
      });
    }
  }

  const participantData = {
    event_id,
    full_name: fullName,
    telephone,
    email,
    firm,
    attending_digital: attendingType === "Digitalt",
  };

  const { data: participant } = await saveEventParticipant(participantData);

  if (!participant) {
    console.error("Error: Could not save/update participant information");

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      error: true,
    });
  }

  if (customOptions.length && eventContent.customOptions?.length) {
    const chosenOptions = eventContent.customOptions.filter((field) =>
      customOptions.includes(sanitize(field))
    );

    const participantOptionsData = chosenOptions.map((option) => ({
      option,
      event_participant_id: participant.event_participant_id,
    }));

    const { error } = await saveEventParticipantOptions(participantOptionsData);

    if (error) {
      console.error("Error: Failed to save custom fields data", error);

      return message(registrationForm, {
        text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
        error: true,
      });
    }
  }
  const { data: participantAllergyData, error: participantAllergyError } =
    await saveEventParticipantAllergy();

  if (!participantAllergyData) {
    console.error("Error: Failed to save or get participant allergy", participantAllergyError);

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      warning: true,
    });
  }

  const { event_participant_allergy_id } = participantAllergyData;

  const allergyData = allergies.map((allergy_id) => ({
    allergy_id,
    event_id,
    event_participant_allergy_id,
  }));

  const { error: allergiesError } = await saveEventAllergies(allergyData);

  if (allergiesError) {
    console.error("Error: Failed to save allergy data", allergiesError);

    return message(registrationForm, {
      text: "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      error: true,
    });
  }

  const emailData = {
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

  const { error: emailError } = await sendEventConfirmationEmail(emailData);

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
