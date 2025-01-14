import { BlockContent, EmailReminder } from "../models/sanity.model";

interface EventUpdatedProps {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
  subject: string;
  message: BlockContent;
  reminder: EmailReminder;
}

export const sendEmailEventUpdate = async (props: EventUpdatedProps) => {
  if (process.env.MODE === "development") return;

  const url = process.env.SANITY_STUDIO_APP_BASE_URL;

  try {
    const response = await fetch(`${url}/api/send-event-update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SANITY_STUDIO_APP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

interface EventCanceledProps {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
  subject: string;
  message: BlockContent;
}

export const sendEmailEventCanceled = async (props: EventCanceledProps) => {
  if (process.env.MODE === "development") return true;

  const url = process.env.SANITY_STUDIO_APP_BASE_URL;

  try {
    const response = await fetch(`${url}/api/send-event-canceled`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SANITY_STUDIO_APP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
