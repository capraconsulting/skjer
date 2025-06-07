import { superValidate } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import type { Event } from "$models/sanity.model";
import type { Actions, PageServerLoad } from "./$types";
import {
  getNumberOfParticipants,
  getIsParticipantAttendingEvent,
  getInternalParticipantNames,
} from "$lib/server/supabase/queries";
import {
  submitRegistrationInternal,
  submitUnregistrationInternal,
} from "$lib/actions/internal/action";
import {
  registrationSchemaInternal,
  unregistrationSchemaInternal,
} from "$lib/schemas/internal/schema";
import {
  registrationSchemaExternal,
  unregistrationSchemaExternal,
} from "$lib/schemas/external/schema";
import {
  submitRegistrationExternal,
  submitUnregistrationExternal,
} from "$lib/actions/external/action";
import { eventQuery as query } from "$lib/server/sanity/queries";
import { sanityClientWithoutStega } from "$lib/server/sanity/client";

export const load: PageServerLoad = async ({ params: { id }, locals }) => {
  const params = { id };
  const auth = await locals.auth();

  const initial = { data: await sanityClientWithoutStega.fetch<Event>(query, params) };
  const numberOfParticipants = await getNumberOfParticipants({ document_id: id });

  if (auth?.user?.name && auth.user.email) {
    const registrationForm = await superValidate(zod(registrationSchemaInternal));
    const unregistrationForm = await superValidate(zod(unregistrationSchemaInternal));

    const isAttending = await getIsParticipantAttendingEvent({
      document_id: id,
      email: auth.user.email,
    });
    const internalParticipantNames = await getInternalParticipantNames({ document_id: id });

    return {
      query,
      params,
      options: { initial },
      registrationForm,
      unregistrationForm,
      isAttending,
      internalParticipantNames,
      numberOfParticipants,
    };
  }

  const registrationForm = await superValidate(zod(registrationSchemaExternal));
  const unregistrationForm = await superValidate(zod(unregistrationSchemaExternal));

  return {
    query,
    params,
    options: { initial },
    registrationForm,
    unregistrationForm,
    numberOfParticipants,
  };
};

export const actions: Actions = {
  submitRegistrationInternal,
  submitUnregistrationInternal,
  submitRegistrationExternal,
  submitUnregistrationExternal,
};
