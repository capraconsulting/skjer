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
    subject: `Viktig beskjed: Arrangementet er dessverre avlyst`,
    html,
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

  const html = `<span style="font-family: Roboto, sans-serif;
                             font-style: normal;
                             font-weight: 400;
                             font-size: 14px;
                             line-height: 20px;
                             letter-spacing: 0.2px;
                             color: #3c4043;">
                <p>Ånei! Arrangementet er dessverre avlyst. Vi hadde gledet oss til å ta deg imot og beklager
                ulempene dette måtte medføre.</p>
                <p>Vi vet at mange hadde gledet seg til arrangementet, og vi deler deres skuffelse.</p>
                <p>Hvis du har noen spørsmål eller trenger ytterligere informasjon, er du hjertelig velkommen
                til å ta kontakt med oss.</p>
                <p>Vi setter stor pris på din forståelse.</p>
                <p>Vennlig hilsen,</p>
                <p>oss i Capra, Liflig og Fryde</p>
                <p>P.S. Vi lover å gjøre det neste arrangementet verdt ventetiden!</p>
                </span>`;

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

const createMailParams = ({ organiser, mailTo, subject, html, icsFile }: EmailParams) => {
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
