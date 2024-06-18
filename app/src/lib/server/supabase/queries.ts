import { validateDomain } from "$lib/utils/domain";
import type { Tables } from "$models/database.model";
import { supabase } from "$lib/server/supabase/client";

export const getEvent = async ({ document_id }: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase.from("event").select().eq("document_id", document_id).maybeSingle();
  return result;
};

export const getEventParticipant = async ({
  event_id,
  email,
}: Pick<Tables<"event_participant">, "event_id" | "email">) => {
  const result = await supabase
    .from("event_participant")
    .select("email, attending, event_id")
    .eq("event_id", event_id)
    .eq("email", email)
    .maybeSingle();

  return result;
};

export const deleteEventParticipant = async ({
  event_id,
  email,
}: Pick<Tables<"event_participant">, "event_id" | "email">) => {
  const result = await supabase
    .from("event_participant")
    .delete()
    .eq("event_id", event_id)
    .eq("email", email);

  return result;
};

export const updateEventParticipantAttending = async ({
  event_id,
  email,
}: Pick<Tables<"event_participant">, "event_id" | "email">) => {
  const result = await supabase
    .from("event_participant")
    .update({ attending: false })
    .eq("event_id", event_id)
    .eq("email", email);

  return result;
};

export const updateEventParticipant = async ({
  event_id,
  full_name,
  telephone,
  email,
  firm,
  attending_digital,
  attending = false,
}: Pick<
  Tables<"event_participant">,
  "event_id" | "full_name" | "telephone" | "email" | "firm" | "attending" | "attending_digital"
>) => {
  const result = await supabase
    .from("event_participant")
    .update({
      event_id,
      full_name,
      telephone,
      email,
      firm,
      attending,
      attending_digital,
    })
    .eq("event_id", event_id)
    .eq("email", email)
    .select()
    .maybeSingle();
  return result;
};

export const saveEventParticipant = async ({
  event_id,
  full_name,
  telephone,
  email,
  firm,
  attending_digital,
}: Pick<
  Tables<"event_participant">,
  "event_id" | "full_name" | "telephone" | "email" | "firm" | "attending_digital"
>) => {
  const result = await supabase
    .from("event_participant")
    .insert({
      event_id,
      full_name,
      telephone,
      email,
      firm,
      attending_digital,
    })
    .select()
    .maybeSingle();

  return result;
};
export const saveEventParticipantOptions = async (
  options: Tables<"event_participant_option">[]
) => {
  const result = await supabase.from("event_participant_option").insert(options);
  return result;
};

export const saveEventParticipantAllergy = async () => {
  const result = await supabase
    .from("event_participant_allergy")
    .insert({})
    .select("event_participant_allergy_id")
    .maybeSingle();

  return result;
};

export const saveEventAllergies = async (eventAllergy: Tables<"event_allergy">[]) => {
  const result = await supabase.from("event_allergy").insert(eventAllergy);
  return result;
};

export const getInternalEventParticipantNames = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase
    .from("event")
    .select("event_participant(full_name, email)")
    .eq("document_id", document_id)
    .eq("event_participant.attending", true)
    .maybeSingle();

  return result.data?.event_participant
    .filter(({ email }) => validateDomain(email))
    .map(({ full_name }) => full_name);
};

export const getNumberOfParticipants = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase
    .from("event")
    .select("event_participant(full_name)")
    .eq("document_id", document_id)
    .eq("event_participant.attending", true)
    .maybeSingle();

  return result.data?.event_participant.length || 0;
};

export const getAttendingEvent = async ({
  email,
  document_id,
}: {
  email: Tables<"event_participant">["email"];
  document_id: Tables<"event">["document_id"];
}) => {
  const result = await supabase
    .from("event")
    .select("event_participant(attending)")
    .eq("document_id", document_id)
    .eq("event_participant.attending", true)
    .eq("event_participant.email", email)
    .maybeSingle();

  if (result.data?.event_participant.length) {
    return true;
  }
  return false;
};

export const getAttendingEvents = async ({
  email,
}: {
  email: Tables<"event_participant">["email"];
}) => {
  const result = await supabase
    .from("event_participant")
    .select("event(document_id)")
    .eq("attending", true)
    .eq("email", email);

  if (result.data?.length) {
    return result.data.map((item) => item.event?.document_id);
  }
  return [];
};
