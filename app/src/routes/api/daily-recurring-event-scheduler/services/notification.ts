import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { SLACK_HOOK } from "$env/static/private";
import { urlFor } from "$lib/sanity/image";
import type { Event } from "$models/sanity.model";
import { get } from "svelte/store";
import { dictionary } from "$lib/i18n";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

// Configure the language for Slack notifications
// This can be set to a specific language or use the app's current language
const SLACK_NOTIFICATION_LANGUAGE = "nb"; // Default to Norwegian

// Helper function to get translations for Slack
function getSlackTranslation(key: string): string {
  // Get the dictionary for the configured language
  const dict = get(dictionary)[SLACK_NOTIFICATION_LANGUAGE];
  if (!dict) return key; // Fallback if language not found

  // Parse the key path (e.g., "slack.registration")
  const parts = key.split(".");
  let value: DictionaryValue = dict;
  for (const part of parts) {
    if (typeof value !== 'object' || value === null || Array.isArray(value) || !(part in value)) return key; // Fallback if key not found
    value = value[part];
  }

  return String(value);
}

// Define types for Slack message blocks
interface SlackBlock {
  type: string;
  [key: string]: string | number | boolean | null | undefined | object | SlackBlock[] | SlackField[];
}

interface SlackField {
  type: string;
  text: string;
}

export const sendSlackNotification = async ({
  _id: id,
  title,
  category,
  place,
  start,
  summary,
  image,
}: Event): Promise<Response | undefined> => {
  if (process.env.NODE_ENV === "development") return undefined;

  const imageUrl = image ? urlFor(image).width(400).url() : null;
  const eventUrl = `${PUBLIC_APP_BASE_URL}/event/${id}`;

  // Use the configured language for date formatting
  const localeString = SLACK_NOTIFICATION_LANGUAGE === "nb" ? "nb-NO" : "en-US";
  const startDate = new Date(start).toLocaleDateString(localeString, {
    timeZone: "Europe/Oslo",
    hour: "2-digit",
    minute: "2-digit",
  });

  const blocks: SlackBlock[] = [];

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
      alt_text: getSlackTranslation("slack.image"),
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
    const fields: SlackField[] = [];
    if (eventUrl) {
      fields.push({
        type: "mrkdwn",
        text: `*${getSlackTranslation("slack.registration")}:*\n<${eventUrl}|${getSlackTranslation("slack.registerHere")}>`,
      });
    }
    if (category) {
      fields.push({
        type: "mrkdwn",
        text: `*${getSlackTranslation("slack.category")}:*\n${category}`,
      });
    }
    blocks.push({
      type: "section",
      fields,
    });
  }

  if (startDate || place) {
    const fields: SlackField[] = [];
    if (startDate) {
      fields.push({
        type: "mrkdwn",
        text: `*${getSlackTranslation("slack.when")}:*\n${startDate}`,
      });
    }
    if (place) {
      fields.push({
        type: "mrkdwn",
        text: `*${getSlackTranslation("slack.where")}:*\n${place}`,
      });
    }
    blocks.push({
      type: "section",
      fields,
    });
  }
  try {
    return await fetch(SLACK_HOOK, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
  } catch (error) {
    throw `Event id: ${id}, ${String(error)}`;
  }
};

// Define the return type for sendSlackNotifications
interface SlackNotificationResult {
  successes: PromiseSettledResult<Response | undefined>[];
  failures: PromiseSettledResult<Response | undefined>[];
}

export async function sendSlackNotifications(events: Event[]): Promise<SlackNotificationResult> {
  const slackNotificationPromises = events.map((event) => sendSlackNotification(event));

  const results: PromiseSettledResult<Response | undefined>[] = await Promise.allSettled(slackNotificationPromises);
  const successes = results.filter((result) => result.status === "fulfilled");
  const failures = results.filter((result) => result.status === "rejected");

  return { successes, failures };
}
