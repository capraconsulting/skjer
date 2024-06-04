import { Event } from "../../app/src/models/sanity.model";
import { useDocumentOperation, DocumentActionProps } from "sanity";
import { supabase } from "../supabase/client";
import { urlFor } from "../config/client";
import { Tables } from "../models/database.model";

export function eventPublishAction({ id, type, onComplete, draft }: DocumentActionProps) {
  const {
    publish: { execute },
  } = useDocumentOperation(id, type);

  // The published version exists only after publishing, so we use the draft version here.
  const draftEvent = draft as Event | null;

  return {
    label: "Publish",
    onHandle: () => {
      execute();
      onComplete();

      if (draftEvent) {
        afterPublish(id, draftEvent);
      }
    },
  };
}

const afterPublish = async (id: string, event: Event) => {
  try {
    const created = await createEventIfNotExist({ document_id: id });
    if (created) {
      createSlackMessage(event);
    }
  } catch (error) {
    console.error("Error handling event and Slack message:", error);
  }
};

export const createEventIfNotExist = async ({
  document_id,
}: Pick<Tables<"event">, "document_id">) => {
  const { error } = await supabase.from("event").upsert({
    document_id,
  });

  if (!error) {
    console.log("Event created in Postgres");
    return true;
  }
  return false;
};

export const createSlackMessage = async ({
  title,
  category,
  place,
  start,
  summary,
  image,
}: Event) => {
  const imageUrl = urlFor(image).width(400).url();

  const startDate = new Date(start).toLocaleDateString("nb-NO", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const slackMessage = {
    text: `*${title}*`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${title} | <!here> :loudspeaker:*`,
        },
      },
      {
        type: "image",
        image_url: imageUrl,
        alt_text: "Image",
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: summary ? `_${summary}_` : "",
          },
        ],
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*Start:* ${startDate}\n*Kategori:* ${category}\n*Sted:* ${place}\n*Lenke:* (?)`,
        },
      },
    ],
  };

  try {
    await fetch(process.env.SANITY_STUDIO_SLACK_HOOK!, {
      method: "POST",
      headers: { "Content-type": "application/x-www-form-urlencoded" },
      body: JSON.stringify(slackMessage),
    });
  } catch (error) {
    console.error("Error sending message to Slack:", error);
  }
};
