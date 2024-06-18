import { APP_API_TOKEN } from "$env/static/private";
import { sendEventRegistrationUpdate } from "$lib/email/event-registration";
import { getAttendingParticipants } from "$lib/server/supabase/queries";
import { json, type RequestHandler } from "@sveltejs/kit";

interface EventProps {
  id: string;
  mailTo: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const authorization = request.headers.get("Authorization");
    if (!authorization) {
      return json({ error: "Authorization header missing" }, { status: 401 });
    }

    const token = authorization.split(" ")[1];
    if (token !== APP_API_TOKEN) {
      return json({ error: "Invalid API token" }, { status: 403 });
    }

    const props = (await request.json()) as EventProps;
    if (!props || !props.id) {
      return json({ error: "Event properties missing or incomplete" }, { status: 400 });
    }

    const participants = await getAttendingParticipants({ document_id: props.id });

    if (!participants.length) {
      return json({ OK: "No participants found for this event" }, { status: 200 });
    }

    const sendPromises = participants.map(({ email }) =>
      sendEventRegistrationUpdate({
        ...props,
        mailTo: email,
      })
    );

    const results = await Promise.allSettled(sendPromises);

    const failedSends = results.filter(({ status }) => status === "rejected");
    if (failedSends.length) {
      console.error("Failed email sends:", failedSends);

      return json(
        { error: "One or more emails failed to send", failedSends: failedSends.length },
        { status: 207 }
      );
    }
    return json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
