import { Tables } from "../models/database.model";
import { supabase } from "./client";

export const getEvent = async ({ document_id }: Pick<Tables<"event">, "document_id">) => {
  return supabase.from("event").select().eq("document_id", document_id).maybeSingle();
};

export async function getEventParticipantList({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select(`event_participant(*, event_participant_option(*))`)
      .eq("document_id", documentId)
      .eq("event_participant.attending", true)
      .maybeSingle();
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getEventFoodPreferenceList({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select("event_food_preference(value)")
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

export async function getEventInvitationList({ documentId }: { documentId: string }) {
  try {
    const { data } = await supabase
      .from("event")
      .select("event_invitation(*)")
      .eq("document_id", documentId);

    if (data?.length) {
      return data.flatMap(({ event_invitation }) => event_invitation);
    }
    return [];
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const insertInvitation = async (
  { document_id }: Pick<Tables<"event">, "document_id">,
  payload: Pick<Tables<"event_invitation">, "email" | "full_name">
) => {
  const { data, error } = await supabase
    .from("event")
    .select()
    .eq("document_id", document_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (data) {
    const { error: insertError } = await supabase
      .from("event_invitation")
      .insert({ event_id: data.event_id, ...payload })
      .select("*");

    if (insertError) {
      throw new Error(`${payload.email} er allerede lagt til`);
    }
  }
};

export const createEventIfNotExist = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const { data, error } = await supabase
    .from("event")
    .select()
    .eq("document_id", document_id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    const { error: upsertError } = await supabase.from("event").upsert({
      document_id,
    });

    if (upsertError) {
      throw new Error(upsertError.message);
    }

    console.log("Event created in Postgres");
    return true;
  }
  return false;
};

export const deleteEvent = async ({ document_id }: Pick<Tables<"event">, "document_id">) => {
  const result = await supabase.from("event").delete().eq("document_id", document_id);

  if (result.error) {
    throw new Error(result.error.message);
  }
  console.log("Event cleaned up in Postgres");
};
