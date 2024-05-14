import { Database } from "../database.types";
import { supabase } from "./supabase.api";

export async function fetchEventParticipants({ documentId }: { documentId: string }) {
  try {
    const { data, error } = await supabase
      .from("event_participant")
      .select()
      .eq("document_id", documentId); // TODO: Only show attending

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
