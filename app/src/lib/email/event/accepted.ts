import ical, { ICalAlarmType, ICalCalendarMethod } from "ical-generator";
import { composeEmail, sendEmail } from "../nodemailer";
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

const createIcsFile = ({ id, summary, description, start, end, location }: EmailAcceptedProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/${id}`;
  const calendar = ical({ name: "Capra Gruppen", method: ICalCalendarMethod.PUBLISH });

  calendar.createEvent({
    id,
    summary,
    description,
    location,
    alarms: [
      { type: ICalAlarmType.display, trigger: 60 },
      { type: ICalAlarmType.display, trigger: 10 },
    ],
    start,
    end,
    url,
  });

  return Buffer.from(calendar.toString());
};
