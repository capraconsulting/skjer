import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { BlockContent } from "$models/sanity.model";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

interface EmailDeclinedProps {
  id: string;
  to: string;
  summary: string;
  description?: string;
  start: string;
  end: string;
  location: string;
  organiser: string;
  subject: string;
  message: BlockContent;
}

 // Define the return type for the email function
 interface EmailResult {
   error?: boolean;
   success?: boolean;
 }

export const sendEmailDeclined = async (props: EmailDeclinedProps): Promise<EmailResult> => {
  const icsFile = createIcsFile(props);

  const email = composeEmail({
    ...props,
    subject: `${props.subject} ${props.summary}`,
    icsFile,
  });

  return await sendEmail(email);
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
}: EmailDeclinedProps): Buffer => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)["nb"] as { [key: string]: DictionaryValue } | undefined;

  // Safely access dictionary values with proper type guards
  const registerOrUnregister =
    dict &&
    typeof dict === "object" &&
    "email" in dict &&
    dict.email &&
    typeof dict.email === "object" &&
    !Array.isArray(dict.email) &&
    "registerOrUnregister" in dict.email
      ? String(dict.email.registerOrUnregister)
      : "Meld deg på eller av arrangementet:";

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
        status: ICalAttendeeStatus.DECLINED,
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
