import { Event } from "../../app/src/models/sanity.model";
import { urlFor } from "../config/client";

/**
 * Retry a function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @param factor Exponential backoff factor
 * @returns The result of the function or throws an error after all retries fail
 */
async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 500,
  factor: number = 2
): Promise<T> {
  let lastError: Error | unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      // Wait for the specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase the delay for the next attempt
      delay *= factor;
    }
  }

  throw lastError;
}

export const createSlackMessage = async (
  id: string,
  { title, category, place, start, summary, image }: Event
) => {
  if (process.env.MODE === "development") return;

  const imageUrl = image ? urlFor(image).width(400).url() : null;
  const eventUrl = `${process.env.SANITY_STUDIO_APP_BASE_URL}/event/${id}`;

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
        text: `*${title} | <!here> :loudspeaker:*`,
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
    if (!process.env.SANITY_STUDIO_SLACK_HOOK) {
      throw new Error("Slack webhook URL is not configured");
    }

    // Format the body as x-www-form-urlencoded
    const payload = `payload=${encodeURIComponent(JSON.stringify({ blocks }))}`;

    // Use retry mechanism for the Slack API call
    const response = await retryWithExponentialBackoff(
      async () => {
        const res = await fetch(process.env.SANITY_STUDIO_SLACK_HOOK!, {
          method: "POST",
          headers: { "Content-type": "application/x-www-form-urlencoded" },
          body: payload,
        });

        if (!res.ok) {
          const responseText = await res.text();
          throw new Error(`Slack API responded with status ${res.status}: ${responseText}`);
        }

        return res;
      },
      3,  // Maximum 3 retries
      500, // Start with 500ms delay
      2    // Double the delay on each retry
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending message to Slack:", error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Return structured error for better handling by calling code
    return {
      success: false,
      error: errorMessage,
      details: `Failed to send notification to Slack for event "${title}". Please try again or contact support if the issue persists.`
    };
  }
};
