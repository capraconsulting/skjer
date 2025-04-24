import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { composeEmail, sendEmail } from "$lib/email/nodemailer";
import ical, { ICalAttendeeRole, ICalAttendeeStatus, ICalCalendarMethod } from "ical-generator";
import type { EventCanceledProps } from "../../../routes/api/send-event-canceled/+server";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

interface EmailCanceledProps extends EventCanceledProps {
  to: string;
}

export const sendEmailCanceled = async (props: EmailCanceledProps) => {
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
}: EmailCanceledProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.CANCEL });

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'];

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
      name: organiser === dict?.common?.allOrganizers ? dict?.common?.capraGroup : organiser,
      email: "no-reply@capragruppen.no",
    },
  });

  return Buffer.from(calendar.toString());
};
