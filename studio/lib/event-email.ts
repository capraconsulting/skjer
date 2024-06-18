interface EventProps {
  id: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
}

export const sendEmailEventUpdate = async (props: EventProps) => {
  // Remove this if you wish to test email locally
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
    await response.json();
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
