import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { sendEventConfirmationEmail } from "$lib/email/send";
import { saveEventAllergy, saveEventParticipant } from "$lib/server/supabase/queries";

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

    const {
      data: { fullName, telephone, email, firm, allergies },
    } = form;

    const participantData = {
      document_id: id,
      full_name: fullName,
      telephone,
      email,
      firm,
    };
    const { error: participantError } = await saveEventParticipant(participantData);

    if (participantError) {
      return fail(500);
    }

    const allergyData = allergies.map((allergy_id) => ({ document_id: id, allergy_id }));

    for (let allergy of allergyData) {
      const { error: allergyError } = await saveEventAllergy(allergy);

      if (allergyError) {
        return fail(500);
      }
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
