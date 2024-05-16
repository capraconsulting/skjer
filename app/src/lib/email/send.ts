import { fail } from "@sveltejs/kit";
import nodemailer from "nodemailer";

export const sendEventConfirmationEmail = async (options: {
  event: string;
  fullName: string;
  email: string;
}) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 0,
      secure: true,
      auth: {
        user: "",
        pass: "",
      },
    });

    const mailOptions = {
      from: `"Capra" <no-reply@capraconsulting.no>`,
      to: options.email,
      subject: `Vi har registrert din påmelding | ${options.event}`,
      text: "",
    };

    const { messageId } = await transporter.sendMail(mailOptions);

    if (messageId) {
      return { error: false };
    }
    return { error: true };
  } catch (error) {
    console.error(error);
    return { error: true };
  }
};
