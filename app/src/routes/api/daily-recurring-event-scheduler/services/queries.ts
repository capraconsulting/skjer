import type { KyselyDatabase } from "$models/kysely.model";
import type { Event } from "$models/sanity.model";
import type { Transaction } from "kysely";

export function getDocumentIdsFromEvents(events: Event[]): string[] {
  return events.map((event) => event._id);
}

export async function deleteEventsAndRelatedData(
  transaction: Transaction<KyselyDatabase>,
  documentIds: string[]
) {
  return await transaction.deleteFrom("event").where("document_id", "in", documentIds).execute();
}

export async function insertNewEvents(
  transaction: Transaction<KyselyDatabase>,
  documentIds: string[]
) {
  const newEvents = documentIds.map((id) => ({ document_id: id }));
  return await transaction.insertInto("event").values(newEvents).execute();
}
