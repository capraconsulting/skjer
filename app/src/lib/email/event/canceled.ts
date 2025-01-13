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
  html: string;
  subject: string;
  icsFile: Buffer;
}

export const sendCanceled = async (props: EventProps) => {
  const icsFile = createIcsFile(props);

  const styles = {
    container: `
      font-family: Roboto, sans-serif;
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      letter-spacing: 0.2px;
      color: #3c4043;
    `,
    paragraph: "margin: 16px 0;",
  };

  const html = `
  <div style="${styles.container}">
    <p style="${styles.paragraph}">Ånei! Arrangementet er dessverre avlyst. Vi hadde gledet oss til å ta deg imot og beklager ulempene dette måtte medføre.</p>
    <p style="${styles.paragraph}">Vi vet at mange hadde gledet seg til arrangementet, og vi deler deres skuffelse.</p>
    <p style="${styles.paragraph}">Hvis du har noen spørsmål eller trenger ytterligere informasjon, er du hjertelig velkommen til å ta kontakt med oss.</p>
    <p style="${styles.paragraph}">Vi setter stor pris på din forståelse.</p>
    <p style="${styles.paragraph}">Vennlig hilsen,</p>
    <p style="${styles.paragraph}">oss i Capra, Liflig og Fryde</p>
    <p style="${styles.paragraph}">P.S. Vi lover å gjøre det neste arrangementet verdt ventetiden!</p>
  </div>`;

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
