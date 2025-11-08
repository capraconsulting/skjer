import { CRON_SECRET } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";
import { getEventsWithApproachingDeadlines } from "./services/content.js";
import { sendDeadlineSlackNotifications } from "./services/notification.js";
import { createStatusResponse } from "./utils.js";

export const GET: RequestHandler = async ({ request }) => {
  const authHeader = request.headers.get("authorization");
  if (!CRON_SECRET || authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("No access", { status: 401 });
  }

  try {
    const events = await getEventsWithApproachingDeadlines();
    if (!events.length) {
      return new Response("No events with approaching deadlines found", { status: 200 });
    }

    const notifyResult = await sendDeadlineSlackNotifications(events);

    return createStatusResponse({
      total: events.length,
      notified: notifyResult.successes.length,
      notifiedFailed: notifyResult.failures.length,
      notifiedFailedDetails: notifyResult.failures.map((failure) =>
        failure.status === "rejected" ? failure.reason : "Unknown error"
      ),
    });
  } catch (error) {
    return new Response("An unexpected error occurred", { status: 500 });
  }
};
