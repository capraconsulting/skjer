import {
  SMTP_AUTH_KEY,
  SMTP_AUTH_USER,
  SMTP_HOST,
  ENABLE_EMAIL_SENDING,
} from "$env/static/private";
import type { BlockContent } from "$models/sanity.model";
import { toHTML } from "@portabletext/to-html";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_KEY,
  },
});

export const sendEmail = async (mailParams: Mail.Options) => {
  if (ENABLE_EMAIL_SENDING === "false") {
    console.warn("Email sending is disabled. Email NOT sent to:", mailParams.to);
    return { error: false };
  }

  try {
    await transporter.sendMail(mailParams);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};

interface EmailTemplateProps {
  to: string;
  subject: string;
  message: BlockContent;
  icsFile: Buffer;
}

export const composeEmail = ({ to, subject, message, icsFile }: EmailTemplateProps) => {
  return {
    to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject,
    html: wrapWithStyles(toHTML(message)),
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};

export const wrapWithStyles = (html: string) => {
  return `<div style="font-family: Roboto, sans-serif; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043;">${html}</div>`;
};
