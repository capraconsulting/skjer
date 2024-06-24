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
  html?: string;
}

export const sendRegistrationConfirmed = async (props: EventProps) => {
  const icsFile = createIcsFile(props);

  const url = `${PUBLIC_APP_BASE_URL}/event/${props.id}`;
  const mailParams = createMailParams({
    ...props,
    subject: `Påmelding bekreftet: ${props.summary}`,
    html: `Ønsker du å melde deg av arrangementet, kan du gjøre det via vår <a href="${url}">nettside</a>.`,
    icsFile,
  });

  const result = await sendMail(mailParams);
  return result;
};

export const sendInviteUpdate = async (props: EventProps) => {
  const icsFile = createIcsFile(props);
  const mailParams = createMailParams({
    ...props,
    subject: `Oppdatert invitasjon: ${props.summary}`,
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

const createMailParams = ({ organiser, mailTo, subject, icsFile, html = "" }: EmailParams) => {
  return {
    from: `${organiser} <no-reply@capraconsulting.no>`,
    to: mailTo,
    subject,
    html,
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};
