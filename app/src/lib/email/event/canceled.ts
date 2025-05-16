import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { composeEmail, sendEmail } from "$lib/email/nodemailer";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import type { EventCanceledProps } from "../../../routes/api/send-event-canceled/+server";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

interface EmailCanceledProps extends EventCanceledProps {
  to: string;
}

// Define the return type for the email function
interface EmailResult {
  error?: any;
  success?: boolean;
}

export const sendEmailCanceled = async (props: EmailCanceledProps): Promise<EmailResult> => {
  const icsFile = createIcsFile(props);

  const email = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  const result = await sendEmail(email);
  return result;
};

const createIcsFile = ({
  id,
  to,
  summary,
  description,
  start,
  end,
  location,
  organiser,
}: EmailCanceledProps): Buffer => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.CANCEL });

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'] as { [key: string]: DictionaryValue } | undefined;

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
        email: to,
        status: ICalAttendeeStatus.ACCEPTED,
        role: ICalAttendeeRole.REQ,
      },
    ],
    organizer: {
      name: organiser,
      email: "no-reply@capragruppen.no",
    },
  });

  return Buffer.from(calendar.toString());
};
