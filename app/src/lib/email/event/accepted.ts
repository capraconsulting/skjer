import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { EventUpdatedProps } from "../../../routes/api/send-event-updated/+server";

interface EmailAcceptedProps extends EventUpdatedProps {
  to: string;
}

export const sendEmailAccepted = async (props: EmailAcceptedProps) => {
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
}: EmailAcceptedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });

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
