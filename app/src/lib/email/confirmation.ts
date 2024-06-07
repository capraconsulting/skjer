import { SMTP_AUTH_KEY, SMTP_AUTH_USER, SMTP_HOST } from "$env/static/private";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import nodemailer from "nodemailer";
import ical from "ical-generator";

interface EmailProps {
  id: string;
  email: string;
  fullName: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organisers: string[];
}

export const sendEventConfirmationEmail = async ({
  id,
  email,
  fullName,
  title,
  description,
  start,
  end,
  location,
  organisers,
}: EmailProps) => {
  // Disabled for now, but works
  return { error: false };

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
      user: SMTP_AUTH_USER,
      pass: SMTP_AUTH_KEY,
    },
  });
  const name = organisers.join(" | ");
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name });

  calendar.createEvent({
    summary: title,
    description,
    location,
    start,
    end,
    url,
    organizer: {
      name,
      email: "no-reply@capraconsulting.no",
    },
  });

  const icsFileBuffer = Buffer.from(calendar.toString());

  const mailParams = {
    from: `${name} <no-reply@capraconsulting.no>`,
    to: email,
    subject: `Vi har registrert din påmelding | ${title}`,
    text: `Hei ${fullName}, lorem ipsum ..`,
    attachments: [
      {
        content: icsFileBuffer,
        filename: "arrangement.ics",
        contentType: "text/calendar",
      },
    ],
  };

  try {
    const { messageId } = await transporter.sendMail(mailParams);
    return { messageId, error: false };
  } catch (error) {
    console.error(error);
    return { error: true };
  }
};
