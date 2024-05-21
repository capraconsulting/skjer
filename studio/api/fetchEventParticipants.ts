import { Database } from "../database.types";
import { supabase } from "./supabase.api";

export async function fetchEventParticipants({ documentId }: { documentId: string }) {
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
