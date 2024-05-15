import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { supabase } from "$lib/supabase/client";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { z } from "zod";
import validator from "validator";
import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { Allergy } from "$models/allergy.model";

const registrationSchema = z.object({
	name: z.string().min(2),
	email: z.string().email(),
	telephone: z.string().refine(validator.isMobilePhone),
	firm: z.string().min(2),
	allergies: z.array(z.nativeEnum(Allergy))
});

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
		form
	};
};

export const actions: Actions = {
	submitRegistration: async ({ request, params }) => {

	const form = await superValidate(request, zod(registrationSchema));
	const documentId = params.id;

	const participantResult = await supabase.from("event_participant").insert({
		document_id: documentId,
		full_name: form.data.name,
		telephone: form.data.telephone,
		email: form.data.email,
		firm: form.data.firm
	});

	let allergies = form.data.allergies;

	if (allergies) {
		for (const allergy of allergies) {
			const allergyResult = await supabase.from("event_allergies").insert({
				document_id: documentId,
				allergy: allergy
			});
		
			if (allergyResult.error) {
				return fail(500);
			}
		}
	}
	if (participantResult.error) {
		return fail(500);
	  };
	return;
	}
  }