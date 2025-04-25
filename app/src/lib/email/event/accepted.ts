import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { EventUpdatedProps } from "../../../routes/api/send-event-updated/+server";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

interface EmailAcceptedProps extends EventUpdatedProps {
  to: string;
}

export const sendEmailAccepted = async (props: EmailAcceptedProps) => {
  const icsFile = createIcsFile(props);

  const emailTemplate = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  const result = await sendEmail(emailTemplate);
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
}: EmailAcceptedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'];

  // Safely access the registerOrUnregister property with type guards
  let registerOrUnregister = "Meld deg på eller av arrangementet:"; // Default fallback
  if (dict && typeof dict === 'object' && 'email' in dict &&
      dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
      'registerOrUnregister' in dict.email) {
    registerOrUnregister = String(dict.email.registerOrUnregister);
  }

  calendar.createEvent({
    id,
    summary,
    description: `${description}\n\n${registerOrUnregister} ${url}`,
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
