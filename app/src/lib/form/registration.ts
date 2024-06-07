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
  saveEventAllergyList,
  getEventParticipant,
  updateEventParticipant,
} from "$lib/server/supabase/queries";
import { getEventContent } from "$lib/server/sanity/queries";

export const submitRegistration: Actions["submitRegistration"] = async ({
  request,
  params: { id },
}) => {
  const registrationForm = await superValidate(request, zod(registrationSchema));

  if (!registrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(registrationForm, {
      message: "Det har oppstått et problem. Det ufylte skjemaet er ikke gyldig.",
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(registrationForm, {
      message: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist");

    return message(registrationForm, {
      message: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const eventContent = await getEventContent({ id });

  if (!eventContent.title) {
    console.error("Error: The specified event does not exist as content");

    return message(registrationForm, {
      message: "Det har oppstått et problem. Du kan ikke melde deg på dette arrangementet.",
      error: true,
    });
  }

  const {
    data: { event_id },
  } = event;

  const {
    data: { fullName, telephone, email, firm, allergies },
  } = registrationForm;

  const eventParticipant = await getEventParticipant({
    event_id,
    email,
  });

  if (eventParticipant.data?.attending) {
    return message(registrationForm, {
      message:
        "Denne e-postadressen er allerede registrert for deltagelse i arrangementet. Vennligst meld deg av dersom dette er en feil.",
      warning: true,
    });
  }

  const participantData = {
    event_id,
    full_name: fullName,
    telephone,
    email,
    firm,
  };

  if (eventParticipant.data?.email && !eventParticipant.data?.attending) {
    const { error } = await updateEventParticipant({
      ...participantData,
      attending: true,
    });

    if (error) {
      console.error("Error: Could not update participant information");

      return message(registrationForm, {
        message:
          "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere",
        error: true,
      });
    }
  } else {
    const { error } = await saveEventParticipant(participantData);

    if (error) {
      console.error("Error: Could not save participant information");

      return message(registrationForm, {
        message:
          "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
        error: true,
      });
    }
  }

  const { error: participantAllergyError, data: participantAllergyData } =
    await saveEventParticipantAllergy();

  if (participantAllergyError || !participantAllergyData?.event_participant_allergy_id) {
    console.error("Error: Failed to save or get participant allergy");

    return message(registrationForm, {
      message:
        "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
      error: true,
    });
  }

  const { event_participant_allergy_id } = participantAllergyData;

  const allergyData = allergies.map((allergy_id) => ({
    allergy_id,
    event_id,
    event_participant_allergy_id,
  }));

  const { error: allergyListError } = await saveEventAllergyList(allergyData);

  if (allergyListError) {
    console.error("Error: Failed to save allergy data");

    return message(registrationForm, {
      message:
        "Det har oppstått en feil. Du har ikke blitt påmeldt arrangementet. Prøv igjen senere.",
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
      message:
        "Det har oppstått en feil. Du har blitt påmeldt arrangement, men e-post bekreftelse er ikke sendt.",
      warning: true,
    });
  }

  return message(registrationForm, {
    message: `Du har meldt deg på arrangementet! Du får en bekreftelse på ${email} hvert øyeblikk. Vi gleder oss til å se deg!`,
    success: true,
  });
};
