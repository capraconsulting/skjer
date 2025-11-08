import type { Event } from "$models/sanity.model";
import { formatTime } from "$lib/utils/date.util";
import { SLACK_HOOK } from "$env/static/private";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";

export async function sendDeadlineSlackNotifications(events: Event[]) {
  if (events.length === 0) {
    return { successes: [], failures: [] };
  }

  // Create one consolidated message with all events
  const message = createDeadlineMessage(events);

  try {
    const response = await sendSlackMessage(message);
    return { successes: [{ status: "fulfilled" as const, value: response }], failures: [] };
  } catch (error) {
    return { successes: [], failures: [{ status: "rejected" as const, reason: error }] };
  }
}

async function sendSlackMessage(text: string): Promise<Response> {
  if (process.env.NODE_ENV === "development") {
    console.log("Development mode - Slack message:", text);
    return new Response("OK");
  }

  const blocks = [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: text,
      },
    },
  ];

  const response = await fetch(SLACK_HOOK, {
    method: "POST",
    headers: { "Content-type": "application/x-www-form-urlencoded" },
    body: JSON.stringify({ blocks }),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status}`);
  }

  return response;
}

function createDeadlineMessage(events: Event[]) {
  const eventList = events
    .map((event) => {
      const deadlineTime = event.deadline ? formatTime(event.deadline) : "";
      const eventDeadlineDate = new Date(event.deadline).toLocaleDateString("nb-NO", {
        timeZone: "Europe/Oslo",
      });
      return `<${PUBLIC_APP_BASE_URL}/event/${event._id}|${event.title}> - ${eventDeadlineDate} kl. ${deadlineTime}`;
    })
    .join("\n");

  return `*Påmeldingsfrist nærmer seg | <!channel> ⏰*

${eventList}`;
}
