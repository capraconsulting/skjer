import { SMTP_AUTH_KEY, SMTP_AUTH_USER, SMTP_HOST } from "$env/static/private";
import nodemailer from "nodemailer";

export const sendEventConfirmationEmail = async (params: {
  title: string;
  fullName: string;
  email: string;
}) => {
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

  const mailparams = {
    from: '"Capra Consulting AS" <no-reply@capraconsulting.no>',
    to: params.email,
    subject: `Vi har registrert din påmelding | ${params.title}`,
    text: `Hei ${params.fullName}`,
  };

  const { messageId } = await transporter.sendMail(mailparams);

  if (!messageId) {
    return { error: true };
  }

  return { messageId, error: false };
};
