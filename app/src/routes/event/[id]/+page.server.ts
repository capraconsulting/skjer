import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { sendEventConfirmationEmail } from "$lib/email/send";
import {
  getEvent,
  saveEventAllergy,
  saveAndGetEventParticipantAllergyId,
  saveEventParticipant,
} from "$lib/server/supabase/queries";

export const load: PageServerLoad = async (event) => {
  const {
    params: { id },
    locals: { loadQuery },
  } = event;

  const initial = await loadQuery<Event>(query, { id });

  const form = await superValidate(zod(registrationSchema));

  return {
    query,
    options: { initial },
    form,
  };
};

export const actions: Actions = {
  submitRegistration: async ({ request, params: { id } }) => {
    if (!validator.isUUID(id)) {
      return fail(500);
    }

    const form = await superValidate(request, zod(registrationSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const event = await getEvent(id);

    if (!event.data?.event_id) {
      return fail(500);
    }

    const {
      data: { event_id },
    } = event;

    const {
      data: { fullName, telephone, email, firm, allergies },
    } = form;

    const participantData = {
      event_id: event.data.event_id,
      full_name: fullName,
      telephone,
      email,
      firm,
    };

    const { error: participantError } = await saveEventParticipant(participantData);
    if (participantError) {
      return fail(500);
    }

    const eventParticipantAllergyId = await saveAndGetEventParticipantAllergyId();
    if (!eventParticipantAllergyId.data?.event_participant_allergy_id) {
      return fail(500);
    }

    const {
      data: { event_participant_allergy_id },
    } = eventParticipantAllergyId;

    const allergyData = allergies.map((allergy_id) => ({
      event_id,
      event_participant_allergy_id,
      allergy_id,
    }));

    const { error: allergyListError } = await saveEventAllergy(allergyData);
    if (allergyListError) {
      return fail(500);
    }

    /* const emailData = {
      eventName: "",
      fullName,
      email,
    };
    
    const { error: emailError } = await sendEventConfirmationEmail(emailData);

    if (emailError) {
      return fail(500);
    } */

    return message(form, { success: true, email });
  },
};
