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
  method?: ICalCalendarMethod;
}

interface EmailParams extends Pick<EventProps, "mailTo" | "organiser" | "summary"> {
  subject: string;
  icsFile: Buffer;
}

export const sendEventRegistrationConfirmed = async (props: EventProps) => {
  const icsFile = createIcsFile(props);
  const mailParams = createMailParams({
    ...props,
    subject: `Registrert: ${props.summary}`,
    icsFile,
  });

  const result = await sendMail(mailParams);
  return result;
};

export const sendEventRegistrationUpdate = async (props: EventProps) => {
  const icsFile = createIcsFile(props);
  const mailParams = createMailParams({
    ...props,
    subject: `Oppdatert invitasjon: ${props.summary}`,
    icsFile,
  });

  const result = await sendMail(mailParams);
  return result;
};

export const sendEventCanceled = async (props: EventProps) => {
  const icsFile = createIcsFile({ ...props, method: ICalCalendarMethod.CANCEL });
  const mailParams = createMailParams({
    ...props,
    subject: `Avlyst: ${props.summary}`,
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
  method,
}: EventProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;

  const calendar = ical({ name: organiser, method: method ?? ICalCalendarMethod.REQUEST });
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
        rsvp: true,
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
