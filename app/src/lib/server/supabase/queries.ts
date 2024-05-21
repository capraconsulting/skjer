import type { Tables } from "$models/database.model";
import { supabase } from "./client";

export const getEvent = async (document_id: string) => {
  const result = await supabase.from("event").select().eq("document_id", document_id).maybeSingle();

  return result;
};

export const createAndGetEvent = async (document_id: string) => {
  const result = await supabase
    .from("event")
    .insert({
      document_id,
    })
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

export const saveEventAllergy = async (
  eventAllergy: Pick<
    Tables<"event_allergy">,
    "allergy_id" | "event_id" | "event_participant_allergy_id"
  >[]
) => {
  const result = await supabase.from("event_allergy").insert(eventAllergy);

  return result;
};

export const saveAndGetEventParticipantAllergyId = async () => {
  const result = await supabase
    .from("event_participant_allergy")
    .insert({})
    .select("event_participant_allergy_id")
    .maybeSingle();

  return result;
};
