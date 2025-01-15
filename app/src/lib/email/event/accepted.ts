import ical, {
  ICalAlarmType,
  ICalAttendeeRole,
  ICalAttendeeStatus,
  ICalCalendarMethod,
} from "ical-generator";
import { toHTML } from "@portabletext/to-html";
import { composeEmail, sendEmail, wrapWithStyles } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { EventUpdatedProps } from "../../../routes/api/send-event-updated/+server";

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
  reminder,
}: EmailAcceptedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });
  const alarms = [];

  if (reminder.hasThreeDaysBefore) {
    alarms.push({
      type: ICalAlarmType.email,
      summary: reminder.threeDaysSubject,
      description: reminder.threeDaysMessage
        ? wrapWithStyles(toHTML(reminder.threeDaysMessage))
        : "",
      trigger: 259200, // ->3 days before event starts
    });
  }

  if (reminder.hasOneHourBefore) {
    alarms.push({
      type: ICalAlarmType.email,
      summary: reminder.oneHourSubject,
      description: reminder.oneHourMessage ? wrapWithStyles(toHTML(reminder.oneHourMessage)) : "",
      trigger: 3600, // -> 1 hour before event starts
    });
  }

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
      name: organiser === "Alle" ? "Capra Gruppen" : organiser,
      email: "no-reply@capragruppen.no",
    },
    alarms,
  });

  return Buffer.from(calendar.toString());
};
