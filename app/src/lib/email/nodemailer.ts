import { SMTP_AUTH_KEY, SMTP_AUTH_USER, SMTP_HOST } from "$env/static/private";
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

export const sendMail = async (mailParams: Mail.Options) => {
  try {
    await transporter.sendMail(mailParams);
    return { error: false };
  } catch (error) {
    return { error: true };
  }
};
