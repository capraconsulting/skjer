import { Tables } from "../models/database.model";
import { supabase } from "./client";

export async function getEventParticipantList({ documentId }: { documentId: string }) {
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

export async function getEventFoodPreferences({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select("event_food_preference(text)")
      .eq("document_id", documentId);

    if (data?.length) {
      return data.flatMap(({ event_food_preference }) => event_food_preference);
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const createEventIfNotExist = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const { data } = await supabase
    .from("event")
    .select()
    .eq("document_id", document_id)
    .maybeSingle();

  if (!data) {
    const { error } = await supabase.from("event").upsert({
      document_id,
    });

    if (error) {
      return false;
    }

    console.log("Event created in Postgres");
    return true;
  }
  return false;
};
