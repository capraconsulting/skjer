import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { sendMail as sendEmail } from "$lib/email/nodemailer";
import { toHTML } from "@portabletext/to-html";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import type { EventCanceledProps } from "../../../routes/api/send-event-canceled/+server";

interface EventCanceledExtendedProps extends EventCanceledProps {
  to: string;
}

export const sendEmailCanceled = async (props: EventCanceledExtendedProps) => {
  const icsFile = createIcsFile(props);

  const emailTemplate = createEmailTemplate({
    ...props,
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
}: EventCanceledExtendedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.CANCEL });
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
      name: organiser,
      email: "no-reply@capragruppen.no",
    },
  });

  return Buffer.from(calendar.toString());
};

interface EmailProps
  extends Pick<EventCanceledExtendedProps, "to" | "subject" | "message" | "summary"> {
  icsFile: Buffer;
}

const createEmailTemplate = ({ to, subject, message, summary, icsFile }: EmailProps) => {
  return {
    to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject: `${subject} ${summary}`,
    html: toHTML(message),
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};
