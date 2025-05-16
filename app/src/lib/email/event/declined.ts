import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { BlockContent } from "$models/sanity.model";
import { getTranslation } from "$lib/i18n";

interface EmailDeclinedProps {
  id: string;
  to: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
  subject: string;
  message: BlockContent;
}

// Define the return type for the email function
interface EmailResult {
  error?: any;
  success?: boolean;
}

export const sendEmailDeclined = async (props: EmailDeclinedProps): Promise<EmailResult> => {
  const icsFile = createIcsFile(props);

  const emailTemplate = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  const result = await sendEmail(emailTemplate);
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
}: EmailDeclinedProps): Buffer => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser === "Alle" ? "Capra Gruppen" : organiser, method: ICalCalendarMethod.REQUEST });

  // Get the translation using the reusable function
  const registerOrUnregister = getTranslation("email.registerOrUnregister");

  calendar.createEvent({
    id,
    summary,
    description: `${description}\n\n${registerOrUnregister} ${url}`,
    location,
    start,
    end,
    url,
    attendees: [
      {
        email: to,
        status: ICalAttendeeStatus.DECLINED,
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
