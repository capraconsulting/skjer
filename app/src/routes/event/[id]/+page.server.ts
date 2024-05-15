import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema } from "$lib/schemas/registrationSchema";
import { supabase } from "$lib/supabase/client";

export const load: PageServerLoad = async (event) => {
  const { loadQuery } = event.locals;
  const { id } = event.params;

  const params = { id };
  const initial = await loadQuery<Event>(query, params);

  const form = await superValidate(zod(registrationSchema));

  return {
    query,
    params,
    options: { initial },
    form,
  };
};

export const actions: Actions = {
  submitRegistration: async ({ request, params }) => {
    const form = await superValidate(request, zod(registrationSchema));

    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    const documentId = params.id;

    const participantResult = await supabase.from("event_participant").insert({
      document_id: documentId,
      full_name: form.data.name,
      telephone: form.data.telephone,
      email: form.data.email,
      firm: form.data.firm,
    });

    let allergies = form.data.allergies;

    if (allergies.length) {
		const allergyResult = await supabase.from("event_allergies").insert({
			document_id: documentId,
			allergy: allergies,
		});

		if (allergyResult.error) {
			return fail(500);
      }
    }
    if (participantResult.error) {
      return fail(500);
    }
    return;
  },
};
