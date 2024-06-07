import { type Actions } from "@sveltejs/kit";
import validator from "validator";
import { superValidate, message } from "sveltekit-superforms/server";
import {
  getEvent,
  getEventParticipant,
  updateEventParticipantAttending,
} from "$lib/server/supabase/queries";

export const submitUnregistration: Actions["submitUnregistration"] = async ({
  params: { id },
  locals,
}) => {
  if (!id || !validator.isUUID(id)) {
    console.error("Error: Invalid event id or uuid provided");

    return {
      message: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    };
  }

  const auth = await locals.auth();

  if (!auth?.user?.email) {
    console.error("Error: Could not retrieve user");

    return {
      message: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    };
  }

  const event = await getEvent({ document_id: id });

  if (!event.data?.event_id) {
    console.error("Error: The specified event does not exist");

    return {
      message: "Det har oppstått en feil. Du kan ikke melde deg av dette arrangementet.",
      error: true,
    };
  }

  const {
    data: { event_id },
  } = event;

  const {
    user: { email },
  } = auth;

  const data = { event_id, email };

  const eventParticipant = await getEventParticipant(data);

  if (eventParticipant.data?.attending) {
    await updateEventParticipantAttending(data);

    return {
      success: true,
      message: "Du er nå meldt av arrangementet.",
    };
  }

  if (!eventParticipant.data?.email) {
    return {
      warning: true,
      message: "Vi finner dessverre ingen opplysninger om din påmelding til arrangementet.",
    };
  }

  return {
    warning: true,
    message: "Du er allerede meldt av arrangementet. Takk for interessen din!",
  };
};
