import type { Tables } from "$models/database.model";
import { supabase } from "./client";

export const saveEventParticipant = async ({
  document_id,
  full_name,
  telephone,
  email,
  firm,
}: Pick<
  Tables<"event_participant">,
  "document_id" | "full_name" | "telephone" | "email" | "firm"
>) => {
  const result = await supabase.from("event_participant").insert({
    document_id,
    full_name,
    telephone,
    email,
    firm,
  });

  return result;
};

export const saveEventAllergy = async (
  allergy: Pick<Tables<"event_allergy">, "allergy_id" | "document_id">
) => {
  const result = await supabase.from("event_allergy").insert(allergy);

  return result;
};
