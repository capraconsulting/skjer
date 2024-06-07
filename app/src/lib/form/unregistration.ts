import { type Actions } from "@sveltejs/kit";
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
  const unregistrationForm = await superValidate(request, zod(unregistrationSchema));

  if (!unregistrationForm.valid) {
    console.error("Error: Invalid form submission detected");

    return message(unregistrationForm, {
      message: "Det har oppstått en feil. Det ufylte skjemaet er ikke gyldig.",
      error: true,
    });
  }

  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return message(unregistrationForm, {
      message: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist");

    return message(unregistrationForm, {
      message: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    });
  }

  const {
    data: { event_id },
  } = event;

  const {
    data: { email },
  } = unregistrationForm;

  const data = { event_id, email };

  const eventParticipant = await getEventParticipant(data);

  if (!eventParticipant.data?.email || !eventParticipant.data?.attending) {
    return message(unregistrationForm, {
      message:
        "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet. Vennligst sjekk at du har oppgitt riktig e-postadresse.",
      warning: true,
    });
  }

  const secret = getUnsubscribeSecret(data);
  const token = jwt.sign({ data }, secret, { expiresIn: "2h" });

  // send jwt token to email
  // returning for demo purpose
  return message(unregistrationForm, {
    token,
    message:
      "En e-post har blitt sendt til adressen du oppga. Vennligst følg instruksjonen i e-posten for å fullføre.",
    success: true,
  });
};
