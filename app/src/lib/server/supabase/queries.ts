import type { Tables } from "$models/database.model";
import { supabase } from "./client";

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
    .select("email, event_id")
    .eq("event_id", event_id)
    .eq("attending", true)
    .eq("email", email)
    .maybeSingle();

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

export const saveEventParticipant = async ({
  event_id,
  full_name,
  telephone,
  email,
  firm,
}: Pick<
  Tables<"event_participant">,
  "event_id" | "full_name" | "telephone" | "email" | "firm"
>) => {
  const result = await supabase.from("event_participant").insert({
    event_id,
    full_name,
    telephone,
    email,
    firm,
  });

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

export const saveEventAllergyList = async (
  eventAllergy: Pick<
    Tables<"event_allergy">,
    "allergy_id" | "event_id" | "event_participant_allergy_id"
  >[]
) => {
  const result = await supabase.from("event_allergy").insert(eventAllergy);

  return result;
};

export const getEventParticipants = async (event_id: number) => {
  const result = await supabase
    .from("event_participant")
    .select("full_name")
    .eq("event_id", event_id);
  return result;
};
