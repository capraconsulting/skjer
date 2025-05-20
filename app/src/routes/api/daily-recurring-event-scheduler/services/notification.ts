import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { SLACK_HOOK } from "$env/static/private";
import { urlFor } from "$lib/sanity/image";
import type { Event } from "$models/sanity.model";

export const sendSlackNotification = async ({
                                              _id: id,
                                              title,
                                              category,
                                              place,
                                              start,
                                              summary,
                                              image,
                                            }: Event) => {
  if (process.env.NODE_ENV === "development") return;

  const imageUrl = image ? urlFor(image).width(400).url() : null;
  const eventUrl = `${PUBLIC_APP_BASE_URL}/event/${id}`;

  const startDate = new Date(start).toLocaleDateString("nb-NO", {
    timeZone: "Europe/Oslo",
    hour: "2-digit",
    minute: "2-digit",
  });

  const blocks = [];

  if (title) {
    blocks.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: `*${title} | <!here> :repeat: *`,
      },
    });
  }

  if (imageUrl) {
    blocks.push({
      type: "image",
      image_url: imageUrl,
      alt_text: "Image",
    });
  }

  if (summary) {
    blocks.push({
      type: "context",
      elements: [
        {
          type: "mrkdwn",
          text: `_${summary}_`,
        },
      ],
    });
  }

  if (eventUrl || category) {
    const fields = [];
    if (eventUrl) {
      fields.push({
        type: "mrkdwn",
        text: `*Påmelding:*\n<${eventUrl}|Meld deg på her>`,
      });
    }
    if (category) {
      fields.push({
        type: "mrkdwn",
        text: `*Kategori:*\n${category}`,
      });
    }
    blocks.push({
      type: "section",
      fields,
    });
  }

  if (startDate || place) {
    const fields = [];
    if (startDate) {
      fields.push({
        type: "mrkdwn",
        text: `*Når:*\n${startDate}`,
      });
    }
    if (place) {
      fields.push({
        type: "mrkdwn",
        text: `*Hvor:*\n${place}`,
      });
    }
    blocks.push({
      type: "section",
      fields,
    });
  }
  try {
    const response = await fetch(SLACK_HOOK, {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ blocks }),
    });
    return response;
  } catch (error) {
    throw `Event id: ${id}, ${String(error)}`;
  }
};

export async function sendSlackNotifications(events: Event[]) {
  const slackNotificationPromises = events.map((event) => sendSlackNotification(event));

  const results = await Promise.allSettled(slackNotificationPromises);
  const successes = results.filter((result) => result.status === "fulfilled");
  const failures = results.filter((result) => result.status === "rejected");

  return { successes, failures };
}
