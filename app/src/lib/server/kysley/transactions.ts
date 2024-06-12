import { sql, type Transaction } from "kysely";
import { kysely } from "$lib/server/kysley/client";
import type { KyselyDatabase } from "$models/kysely.model";
import type { Tables } from "$models/database.model";

export async function executeTransaction<T>(
  callback: (transaction: Transaction<KyselyDatabase>) => Promise<T>
) {
  return await kysely.transaction().execute(async (transaction) => await callback(transaction));
}

export const deleteEventParticipant = async (
  transaction: Transaction<KyselyDatabase>,
  { event_id, email }: Pick<Tables<"event_participant">, "event_id" | "email">
) => {
  return await transaction
    .deleteFrom("event_participant")
    .where("event_id", "=", event_id)
    .where("email", "=", email)
    .execute();
};

export const insertAndGetEventParticipant = async (
  transaction: Transaction<KyselyDatabase>,
  participant: Pick<Tables<"event_participant">, "event_id" | "full_name" | "email"> &
    Partial<Pick<Tables<"event_participant">, "telephone" | "firm" | "attending_digital">>
) => {
  return await transaction
    .insertInto("event_participant")
    .values(participant)
    .returning("event_participant_id")
    .executeTakeFirstOrThrow();
};

export const insertEventParticipantOptions = async (
  transaction: Transaction<KyselyDatabase>,
  options: Tables<"event_participant_option">[]
) => {
  return await transaction.insertInto("event_participant_option").values(options).execute();
};

export const insertAndGetEventParticipantAllergy = async (
  transaction: Transaction<KyselyDatabase>
) => {
  return await transaction
    .insertInto("event_participant_allergy")
    .expression(sql`DEFAULT VALUES`)
    .returning("event_participant_allergy_id")
    .executeTakeFirstOrThrow();
};

export const insertEventParticipantAllergies = async (
  transaction: Transaction<KyselyDatabase>,
  allergies: Tables<"event_allergy">[]
) => {
  return await transaction.insertInto("event_allergy").values(allergies).execute();
};
