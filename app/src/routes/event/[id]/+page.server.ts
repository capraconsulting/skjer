import { eventQuery as query } from "$lib/sanity/queries";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
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
  getEventParticipants,
} from "$lib/server/supabase/queries";
import type { Event } from "$models/sanity.types";
import { getEventContent } from "$lib/server/sanity/queries";

export const load: PageServerLoad = async ({ params: { id }, locals: { loadQuery } }) => {
  const form = await superValidate(zod(registrationSchema));
  const initial = await loadQuery<Event>(query, { id });

  const eventId = (await getEvent(id)).data?.event_id;
  let eventParticipants: { full_name: string | null }[] = [];

  if (eventId) {
    eventParticipants = await getEventParticipants(eventId);
  }

  return {
    form,
    query,
    options: { initial },
    participants: eventParticipants,
  };
};

export const actions: Actions = {
  submitRegistration: async ({ request, params: { id } }) => {
    const form = await superValidate(request, zod(registrationSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    if (!validator.isUUID(id)) {
      return fail(500);
    }

    const event = await getEvent(id);

    if (!event.data?.event_id) {
      return fail(500);
    }

    const eventContent = await getEventContent(id);

    if (!eventContent.title) {
      return fail(500);
    }

    const {
      data: { event_id },
    } = event;

    const { title } = eventContent;

    const {
      data: { fullName, telephone, email, firm, allergies },
    } = form;

    const participantData = {
      event_id,
      full_name: fullName,
      telephone,
      email,
      firm,
    };

    const { error: participantError } = await saveEventParticipant(participantData);

    if (participantError) {
      return fail(500);
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

    return message(form, { success: true, email });
  },
};
