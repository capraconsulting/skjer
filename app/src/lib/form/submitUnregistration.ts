import { fail, type Actions } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { zod } from "sveltekit-superforms/adapters";
import { unregistrationSchema } from "$lib/schemas/registrationSchema";
import validator from "validator";
import { getEvent, getEventParticipant } from "$lib/server/supabase/queries";
import jwt from "jsonwebtoken";
import { getUnsubscribeSecret } from "$lib/auth/secret";

export const submitUnregistration: Actions["submitUnregistration"] = async ({
  request,
  params: { id },
}) => {
  if (!id || !validator.isUUID(id)) {
    return fail(500);
  }

  const unregistrationForm = await superValidate(request, zod(unregistrationSchema));

  if (!unregistrationForm.valid) {
    return fail(400, { unregistrationForm });
  }

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    return fail(500);
  }

  const {
    data: { event_id },
  } = event;

  const {
    data: { email },
  } = unregistrationForm;

  const data = { event_id, email };

  const eventParticipant = await getEventParticipant(data);

  if (!eventParticipant.data?.email) {
    return fail(400, { unregistrationForm }); // TODO: Should always return success?
  }

  const secret = getUnsubscribeSecret(data);
  const token = jwt.sign({ data }, secret, { expiresIn: "2h" });

  // send jwt token to email
  // returning for demo purpose
  return message(unregistrationForm, { success: true, token });
};
