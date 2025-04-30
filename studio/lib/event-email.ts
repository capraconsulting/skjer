import { BlockContent } from "../models/sanity.model";

interface EventProps {
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

export const sendEmailEventUpdated = async (props: EventProps) => {
  if (process.env.MODE === "development") return;

  const url = process.env.SANITY_STUDIO_APP_BASE_URL;

  try {
    const response = await fetch(`${url}/api/send-event-updated`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.SANITY_STUDIO_APP_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });
    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendEmailEventCanceled = async (props: EventProps) => {
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
    return await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
