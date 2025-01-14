import ical, {
  ICalAlarmType,
  ICalAttendeeRole,
  ICalAttendeeStatus,
  ICalCalendarMethod,
} from "ical-generator";
import { toHTML } from "@portabletext/to-html";
import { sendMail as sendEmail } from "../nodemailer";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import type { EventUpdatedProps } from "../../../routes/api/send-event-update/+server";

interface EventUpdatedExtendedProps extends EventUpdatedProps {
  to: string;
}
export const sendEmailUpdated = async (props: EventUpdatedExtendedProps) => {
  const icsFile = createIcsFile(props);

  const emailTemplate = createEmailTemplate({
    ...props,
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
}: EventUpdatedExtendedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: organiser, method: ICalCalendarMethod.REQUEST });
  const alarms = [];

  if (reminder.hasThreeDaysBefore) {
    alarms.push({
      type: ICalAlarmType.email,
      summary: reminder.threeDaysSubject,
      description: reminder.threeDaysMessage ? toHTML(reminder.threeDaysMessage) : "",
      trigger: 259200, // ->3 days before event starts
    });
  }

  if (reminder.hasOneHourBefore) {
    alarms.push({
      type: ICalAlarmType.email,
      summary: reminder.oneHourSubject,
      description: reminder.oneHourMessage ? toHTML(reminder.oneHourMessage) : "",
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
      name: organiser,
      email: "no-reply@capragruppen.no",
    },
    alarms,
  });

  return Buffer.from(calendar.toString());
};

interface EmailProps
  extends Pick<EventUpdatedExtendedProps, "to" | "subject" | "message" | "summary"> {
  icsFile: Buffer;
}

const createEmailTemplate = ({ to, subject, message, summary, icsFile }: EmailProps) => {
  return {
    to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject: `${subject} ${summary}`,
    html: toHTML(message),
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};
