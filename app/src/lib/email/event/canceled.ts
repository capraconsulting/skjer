import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { composeEmail, sendEmail } from "$lib/email/nodemailer";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import type { EventCanceledProps } from "../../../routes/api/send-event-canceled/+server";

interface EmailCanceledProps extends EventCanceledProps {
  to: string;
}

// Define the return type for the email function
interface EmailResult {
  error?: unknown;
  success?: boolean;
}

export const sendEmailCanceled = async (props: EmailCanceledProps): Promise<EmailResult> => {
  const icsFile = createIcsFile(props);

  const email = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  const result = await sendEmail(email);
  return result;
};

const createIcsFile = ({
  id,
  to,
  summary,
  description,
  start,
  end,
  location,
  organiser,
}: EmailCanceledProps): Buffer => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser === "Alle" ? "Capra Gruppen" : organiser, method: ICalCalendarMethod.CANCEL });

  calendar.createEvent({
    id,
    summary,
    description,
    location,
    start,
    end,
    url,
    attendees: [
      {
        email: to,
        status: ICalAttendeeStatus.ACCEPTED,
        role: ICalAttendeeRole.REQ,
      },
    ],
    organizer: {
      name: organiser === "Alle" ? "Capra Gruppen" : organiser,
      email: "no-reply@capragruppen.no",
    },
  });

  return Buffer.from(calendar.toString());
};
