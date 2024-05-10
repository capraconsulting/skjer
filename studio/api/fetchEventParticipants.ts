import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SANITY_STUDIO_SUPABASE_URL!,
  process.env.SANITY_STUDIO_SUPABASE_KEY!
);

export async function fetchEventParticipants({ documentId }: { documentId: string }) {
  try {
    const { data, error } = await supabase
      .from("event_participant")
      .select()
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
