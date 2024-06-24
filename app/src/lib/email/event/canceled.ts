import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { sendMail } from "$lib/email/nodemailer";

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

interface EmailParams extends Pick<EventProps, "mailTo" | "organiser" | "summary"> {
  subject: string;
  icsFile: Buffer;
}

export const sendCanceled = async (props: EventProps) => {
  const icsFile = createIcsFile(props);
  const mailParams = createMailParams({
    ...props,
    subject: `Avlyst arrangement: ${props.summary}`,
    icsFile,
  });

  const result = await sendMail(mailParams);
  return result;
};

const createIcsFile = ({
  id,
  summary,
  description,
  start,
  end,
  location,
  organiser,
  mailTo,
}: EventProps) => {
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
        email: mailTo,
        status: ICalAttendeeStatus.ACCEPTED,
        role: ICalAttendeeRole.REQ,
      },
    ],
    organizer: {
      name: organiser,
      email: "no-reply@capraconsulting.no",
    },
  });

  return Buffer.from(calendar.toString());
};

const createMailParams = ({ organiser, mailTo, subject, icsFile }: EmailParams) => {
  return {
    from: `${organiser} <no-reply@capraconsulting.no>`,
    to: mailTo,
    subject,
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};
