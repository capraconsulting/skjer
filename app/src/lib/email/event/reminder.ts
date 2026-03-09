import type { BlockContent, Event } from "$models/sanity.model";
import { composeEmail, sendEmail } from "../nodemailer";

interface EmailReminderProps {
  id: string;
  to: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: Event["organisers"];
  subject: string;
  message: BlockContent;
}

export const sendEmailReminder = async (props: EmailReminderProps) => {
  const emailTemplate = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
  });

  return await sendEmail(emailTemplate);
};