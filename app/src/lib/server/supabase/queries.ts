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

export const saveEventAllergies = async (
  allergies: Pick<Tables<"event_allergies">, "allergy" | "document_id">[]
) => {
  const result = await supabase.from("event_allergies").insert(allergies);

  return result;
};
