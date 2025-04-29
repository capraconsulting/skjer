import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { EventUpdatedProps } from "../../../routes/api/send-event-updated/+server";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

interface EmailAcceptedProps extends EventUpdatedProps {
  to: string;
  language?: string; // Optional language parameter, defaults to 'nb'
}

export const sendEmailAccepted = async (props: EmailAcceptedProps) => {
  const icsFile = createIcsFile(props);

  const emailTemplate = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  return await sendEmail(emailTemplate);
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
  language = "nb", // Default to Norwegian if not specified
}: EmailAcceptedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });

  // Get the dictionary for the specified language or default to 'nb'
  const dict = get(dictionary)[language];

  // Safely access the registerOrUnregister property with type guards
  let registerOrUnregister = "Meld deg på eller av arrangementet:"; // Default fallback
  if (dict && typeof dict === "object" && "email" in dict &&
    dict.email && typeof dict.email === "object" && !Array.isArray(dict.email) &&
    "registerOrUnregister" in dict.email) {
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
