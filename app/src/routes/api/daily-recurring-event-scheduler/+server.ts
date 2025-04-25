import { CRON_SECRET } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import {
  filterPublishedEvents,
  getExpiredRecurringEvents,
  updateAndPublishEvents,
} from "./services/content";
import {
  deleteEventsAndRelatedData,
  getDocumentIdsFromEvents,
  insertNewEvents,
} from "./services/queries";
import { sendSlackNotifications } from "./services/notification";
import { createStatusResponse } from "./utils";
import { executeTransaction } from "$lib/server/kysley/transactions";

export const GET: RequestHandler = async ({ request }): Promise<Response> => {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("No access", { status: 401 });
  }

  try {
    const events = await getExpiredRecurringEvents();
    if (!events.length) {
      return new Response("No recurring events found", { status: 200 });
    }

    const documentIds = getDocumentIdsFromEvents(events);

    try {
      await executeTransaction(async (transaction) => {
        await deleteEventsAndRelatedData(transaction, documentIds);
        await insertNewEvents(transaction, documentIds);
      });
    } catch (error: unknown) {
      return new Response("Transaction failed with delete or insert events in Supabase", {
        status: 500,
      });
    }

    const publishResult = await updateAndPublishEvents(events);

    const publishedEvents = filterPublishedEvents(publishResult.successes);
    const notifyResult = await sendSlackNotifications(publishedEvents);

    return createStatusResponse({
      total: events.length,
      published: publishResult.successes.length,
      publishFailed: publishResult.failures.length,
      publishFailedDetails: publishResult.failures.map(failure => (failure as { reason: unknown }).reason),
      notified: notifyResult.successes.length,
      notifiedFailed: notifyResult.failures.length,
      notifiedFailedDetails: notifyResult.failures.map(failure => (failure as { reason: unknown }).reason),
    });
  } catch (error: unknown) {
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
