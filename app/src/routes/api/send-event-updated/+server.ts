import { APP_API_TOKEN } from "$env/static/private";
import { sendEmailAccepted } from "$lib/email/event/accepted";
import { getAttendingParticipants } from "$lib/server/supabase/queries";
import type { BlockContent, EmailReminder } from "$models/sanity.model";
import { json, type RequestHandler } from "@sveltejs/kit";

export interface EventUpdatedProps {
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

    const props = (await request.json()) as EventUpdatedProps | null;
    if (!props?.id) {
      return json({ error: "Event properties missing or incomplete" }, { status: 400 });
    }

    const participants = await getAttendingParticipants({ document_id: props.id });

    if (!participants.length) {
      return json({ message: "No participants found for this event" }, { status: 200 });
    }

    const sendEmailPromises = participants.map(({ email }) =>
      sendEmailAccepted({ ...props, to: email })
    );

    const results = await Promise.allSettled(sendEmailPromises);

    const failedEmailSends = results.filter(({ status }) => status === "rejected");

    if (failedEmailSends.length) {
      console.error("Failed email sends", failedEmailSends);

      return json(
        { error: "One or more emails failed to send", failedSends: failedEmailSends.length },
        { status: 207 }
      );
    }
    return json({ message: "Emails sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error handling POST request:", error);
    return json({ error: "Server error" }, { status: 500 });
  }
};
