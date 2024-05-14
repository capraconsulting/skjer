import { supabase } from "./supabase.api";

export async function fetchEventAllergies({ documentId }: { documentId: string }) {
  try {
    const { data, error } = await supabase
      .from("event_allergies")
      .select("document_id, allergy, allergy.count()")
      .eq("document_id", documentId);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
