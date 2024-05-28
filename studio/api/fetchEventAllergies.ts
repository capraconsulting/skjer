import { EventAllergySummary } from "./../../app/src/models/allergy-view.model";
import { supabase } from "./supabase.api";

export async function fetchEventAllergies({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event_allergy_summary")
      .select()
      .eq("document_id", documentId)
      .maybeSingle();

    return data as EventAllergySummary;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
