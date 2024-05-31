import { fail, type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { sendEventConfirmationEmail } from "$lib/email/send";
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
  if (!id || !validator.isUUID(id)) {
    return fail(500);
  }

  const registrationForm = await superValidate(request, zod(registrationSchema));

  if (!registrationForm.valid) {
    return fail(400, { registrationForm });
  }

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    return fail(500);
  }

  const eventContent = await getEventContent({ id });

  if (!eventContent.title) {
    return fail(500);
  }

  const {
    data: { event_id },
  } = event;

  const { title } = eventContent;

  const {
    data: { fullName, telephone, email, firm, allergies },
  } = registrationForm;

  const eventParticipant = await getEventParticipant({
    event_id,
    email,
  });

  if (eventParticipant.data?.attending) {
    return fail(500);
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
      return fail(500);
    }
  } else {
    const { error } = await saveEventParticipant(participantData);

    if (error) {
      return fail(500);
    }
  }

  const { data: participantAllergyData } = await saveEventParticipantAllergy();

  if (!participantAllergyData?.event_participant_allergy_id) {
    return fail(500);
  }

  const { event_participant_allergy_id } = participantAllergyData;

  const allergyData = allergies.map((allergy_id) => ({
    allergy_id,
    event_id,
    event_participant_allergy_id,
  }));

  const { error: allergyListError } = await saveEventAllergyList(allergyData);

  if (allergyListError) {
    return fail(500);
  }

  const emailData = {
    title,
    fullName,
    email,
  };

  const { error: emailError } = await sendEventConfirmationEmail(emailData);

  if (emailError) {
    return fail(500);
  }

  return message(registrationForm, { success: true, email });
};
