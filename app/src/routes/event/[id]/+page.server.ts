import { eventQuery as query, type Event } from "$lib/sanity/queries";
import { supabase } from "$lib/supabase/client";
import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";

export const load: PageServerLoad = async (event) => {
	const { loadQuery } = event.locals;
	const { id } = event.params;

	const params = { id };
	const initial = await loadQuery<Event>(query, params);

	// We pass the data in a format that is easy for `useQuery` to consume in the
	// corresponding `+page.svelte` file, but you can return the data in any
	// format you like.
	return {
		query,
		params,
		options: { initial }
	};
};

export const actions: Actions = {
	submitRegistration: async ({ request, params }) => {
	  const formData = await request.formData();

	  const documentId = params.id;
	  const fullName = formData.get("name");
	  const email = formData.get("email");
	  const telephone = formData.get("telephone");
	  const firm = formData.get("firm");

	  const allergiesString = formData.get("allergies");
	  const allergies = allergiesString ? (allergiesString as string).split(",") : [];
  
 	  const participantResult = await supabase.from("event_participant").insert({
		document_id: documentId,
		full_name: fullName,
		telephone: telephone,
		email: email,
		firm: firm
	  });

 	  if (allergies) {
		for (const allergy of allergies) {
			const allergyResult = await supabase.from("event_allergies").insert({
			  document_id: documentId,
			  allergy: allergy
			});
	  
			if (allergyResult.error) {
			return fail(500, { documentId, allergies });
			}
		}
	  };
 
 	  if (participantResult.error) {
		return fail(500, {
		  documentId,
		  fullName,
		  telephone,
		  email,
		  firm,
		});
	  }; 
  
	  return;
	}
  }