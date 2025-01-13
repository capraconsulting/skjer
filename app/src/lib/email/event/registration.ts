import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import ical, {
  ICalAlarmType,
  ICalAttendeeRole,
  ICalAttendeeStatus,
  ICalCalendarMethod,
} from "ical-generator";
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

  const html = `<span style="font-family: Roboto, sans-serif;
                             font-style: normal;
                             font-weight: 400;
                             font-size: 14px;
                             line-height: 20px;
                             letter-spacing: 0.2px;
                             color: #3c4043;">
                <p>Du er påmeldt! 🎉 Velkommen til oss!</p>
                <p>Gode nyheter – du er offisielt påmeldt! 🎊 Vi gleder oss til å ha deg med! Har du noen
                spørsmål så håper vi at du tar kontakt. Forbered deg på spennende innhold, nye bekjentskaper og en god
                start på/avslutning på dagen. Dette vil du ikke gå glipp av!</p>
                <p>Vennlig hilsen oss i Capra, Fryde og Liflig</p>
                <p>P.S. Følg med på innboksen din for flere spennende oppdateringer og overraskelser før
                arrangementet! 🚀</p>
                </span>`;

  const mailParams = createMailParams({
    ...props,
    subject: `Påmelding bekreftet: ${props.summary}`,
    html,
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
    alarms: [
      {
        type: ICalAlarmType.display,
        description: "Arrangementet starter straks",
        relatesTo: "START", // -> 10 minutes before event starts
      },
      {
        type: ICalAlarmType.display,
        description: "Påminnelse om arrangement i morgen",
        trigger: 86400, // -> 24 hours before event starts
      },
    ],
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
