import { Event } from "../../app/src/models/sanity.model";
import { urlFor } from "../config/client";

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
    await fetch(process.env.SANITY_STUDIO_SLACK_HOOK!, {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: JSON.stringify({ blocks }),
    });
  } catch (error) {
    console.error("Error sending message to Slack:", error);
  }
};
