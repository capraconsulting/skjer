import { eventQuery as query } from "$lib/sanity/queries";
import type { Actions, PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { registrationSchema, unregistrationSchema } from "$lib/schemas/registrationSchema";
import type { Event } from "$models/sanity.model";
import { submitRegistration } from "$lib/form/registration";
import { submitUnregistration } from "$lib/form/unregistration";
import { submitUnregistration as submitUnregistrationInternal } from "$lib/form/internal/unregistration";
import { getAttendingEvent, getInternalEventParticipantNames } from "$lib/server/supabase/queries";

export const load: PageServerLoad = async ({ params: { id }, locals }) => {
  const auth = await locals.auth();

  if (auth?.user?.name && auth.user.email) {
    const initial = await locals.loadQuery<Event>(query, { id });

    const prefilledRegistration = {
      fullName: auth.user.name,
      email: auth.user.email,
    };

    const registrationForm = await superValidate(prefilledRegistration, zod(registrationSchema));
    const unregistrationForm = await superValidate(zod(unregistrationSchema));

    const isAttending = await getAttendingEvent({ document_id: id, email: auth.user.email });
    const internalParticipantNames = await getInternalEventParticipantNames({ document_id: id });

    return {
      registrationForm,
      unregistrationForm,
      query,
      options: { initial },
      isAttending,
      internalParticipantNames,
    };
  }

  const initial = await locals.loadQuery<Event>(query, { id });
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
  submitUnregistrationInternal,
};
