import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { sendMail } from "$lib/email/nodemailer";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";

export const sendUnregistrationConfirmed = async (props: {
  id: string;
  mailTo: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
}) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${props.id}`;

  const html = `<span style="font-family: Roboto, sans-serif;
                             font-style: normal;
                             font-weight: 400;
                             font-size: 14px;
                             line-height: 20px;
                             letter-spacing: 0.2px;
                             color: #3c4043;">
                <p><b>Hei,</b></p>
                <p>Vi fikk nettopp beskjed om at du har meldt deg av vårt arrangement.</p>
                <p>Ingen bekymringer – det kommer flere muligheter til å få litt faglig eller sosialt påfyll hos oss.
                Følg med på her eller meld deg på vårt nyhetsbrev. </p>
                <p>Vi håper å se deg på et av våre fremtidige arrangementer!</p>
                <p>Med vennlig hilsen,</p>
                <p>oss i Capra, Liflig og Fryde</p>
                </span>`;

  const calendar = ical({ name: props.organiser, method: ICalCalendarMethod.REQUEST });
  calendar.createEvent({
    id: props.id,
    summary: props.summary,
    description: props.description,
    location: props.location,
    start: props.start,
    end: props.end,
    url,
    attendees: [
      {
        email: props.mailTo,
        status: ICalAttendeeStatus.DECLINED,
        role: ICalAttendeeRole.REQ,
      },
    ],
    organizer: {
      name: props.organiser,
      email: "no-reply@capraconsulting.no",
    },
  });

  const icsFile = Buffer.from(calendar.toString());

  const mailParams = {
    from: `${props.organiser} <no-reply@capraconsulting.no>`,
    to: props.mailTo,
    subject: `Avregistrering bekreftet: ${props.summary}`,
    html,
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };

  const result = await sendMail(mailParams);
  return result;
};

export const sendConfirmUnregistration = async (props: {
  mailTo: string;
  summary: string;
  organiser: string;
  token: string;
}) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/unregistration/${props.token}`;
  const html = `<span style="font-family: Roboto, sans-serif;
                             font-style: normal;
                             font-weight: 400;
                             font-size: 14px;
                             line-height: 20px;
                             letter-spacing: 0.2px;
                             color: #3c4043;">
                <p>Hei,</p>
                <p>Vi har mottatt din forespørsel om å avregistrere deg fra «${props.summary}».</p>
                <p>For å bekrefte denne handlingen, vennligst klikk på følgende lenke:</p>
                <p><a href="${url}">Bekreft avregistrering</a></p>
                </span>`;

  const mailParams = {
    from: `${props.organiser} <no-reply@capraconsulting.no>`,
    to: props.mailTo,
    subject: `Bekreft avregistrering: ${props.summary}`,
    html,
  };

  const result = await sendMail(mailParams);
  return result;
};
