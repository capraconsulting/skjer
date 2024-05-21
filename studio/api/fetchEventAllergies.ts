import { supabase } from "./supabase.api";

export async function fetchEventAllergies({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select(
        `
        allergies: allergy(name, name.count()),
        total_participant: event_allergy(event_participant_allergy_id, event_participant_allergy_id.count())
      `
      )
      .eq("document_id", documentId)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
