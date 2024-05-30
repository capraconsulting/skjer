import { supabase } from "./client";

export async function eventParticipantListQuery({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select(`event_participant(*)`)
      .eq("document_id", documentId)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function eventAllergyListQuery({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event_allergy_summary")
      .select()
      .eq("document_id", documentId)
      .maybeSingle();

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
