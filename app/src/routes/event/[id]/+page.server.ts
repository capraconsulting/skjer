import { eventQuery as query } from "$lib/sanity/queries";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema";
import type { Event } from "$models/sanity.types";
import { submitRegistration } from "$lib/form/submitRegistration";
import { submitUnregistration } from "$lib/form/submitUnregistration";

export const load: PageServerLoad = async ({ params: { id }, locals: { loadQuery } }) => {
  const initial = await loadQuery<Event>(query, { id });

  const registrationForm = await superValidate(zod(registrationSchema));
  const unregistrationForm = await superValidate(zod(unregistrationSchema));

  return {
    registrationForm,
    unregistrationForm,
    query,
    options: { initial },
  };
};

export const actions: Actions = {
  submitRegistration,
  submitUnregistration,
};
