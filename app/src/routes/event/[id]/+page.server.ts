import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { sendEventConfirmationEmail } from "$lib/email/send";
import {
  createAndGetEvent,
  getEvent,
  saveAndGetEventAllergy,
  saveEventAllergyList,
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

    let event = await getEvent(id);

    if (!event.data) {
      event = await createAndGetEvent(id);
    }

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

    const eventAllergy = await saveAndGetEventAllergy({ event_id });
    if (!eventAllergy.data?.event_allergy_id) {
      return fail(500);
    }

    const {
      data: { event_allergy_id },
    } = eventAllergy;

    const allergyData = allergies.map((allergy_id) => ({ event_allergy_id, allergy_id }));

    const { error: allergyListError } = await saveEventAllergyList(allergyData);
    if (allergyListError) {
      return fail(500);
    }

    /* const emailData = {
      event: "",
      fullName,
      email,
    };
    const { error: emailError } = await sendEventConfirmationEmail(emailData);

    if (emailError) {
      return fail(500);
    } */

    return;
  },
};
