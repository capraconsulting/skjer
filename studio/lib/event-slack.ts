import { Event } from "../../app/src/models/sanity.model";
import { urlFor } from "../config/client";

// Define translations for Slack messages
// This is a simplified approach since we can't directly use svelte-i18n in the studio
const translations = {
  nb: {
    registration: "Påmelding",
    registerHere: "Meld deg på her",
    category: "Kategori",
    when: "Når",
    where: "Hvor"
  },
  en: {
    registration: "Registration",
    registerHere: "Register here",
    category: "Category",
    when: "When",
    where: "Where"
  }
};

// Define types for translations
type TranslationKey = keyof typeof translations.nb;
type LocaleKey = keyof typeof translations;

// Configure the language for Slack notifications
const SLACK_NOTIFICATION_LANGUAGE: LocaleKey = 'nb'; // Default to Norwegian

// Helper function to get translations
function getTranslation(key: TranslationKey): string {
  return translations[SLACK_NOTIFICATION_LANGUAGE]?.[key] || key;
}

export const createSlackMessage = async (
  id: string,
  { title, category, place, start, summary, image }: Event
) => {
  if (process.env.MODE === "development") return;

  const imageUrl = image ? urlFor(image).width(400).url() : null;
  const eventUrl = `${process.env.SANITY_STUDIO_APP_BASE_URL}/event/${id}`;

  // Use the configured language for date formatting
  const localeString = SLACK_NOTIFICATION_LANGUAGE === 'nb' ? 'nb-NO' : 'en-US';
  const startDate = new Date(start).toLocaleDateString(localeString, {
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
        text: `*${getTranslation('registration')}:*\n<${eventUrl}|${getTranslation('registerHere')}>`,
      });
    }
    if (category) {
      fields.push({
        type: "mrkdwn",
        text: `*${getTranslation('category')}:*\n${category}`,
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
        text: `*${getTranslation('when')}:*\n${startDate}`,
      });
    }
    if (place) {
      fields.push({
        type: "mrkdwn",
        text: `*${getTranslation('where')}:*\n${place}`,
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
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ blocks }),
    });
  } catch (error) {
    console.error("Error sending message to Slack:", error);
  }
};
