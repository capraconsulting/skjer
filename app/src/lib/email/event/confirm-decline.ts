import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { sendEmail } from "$lib/email/nodemailer";

interface EmailConfirmDeclineProps {
  to: string;
  summary: string;
  organiser: string;
  token: string;
}

// TODO: Consider making this a function that takes a template from the Event Schema
export const sendEmailConfirmDecline = async (props: EmailConfirmDeclineProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/unregistration/${props.token}`;
  const html = `<span>
                <p>Hei,</p>
                <p>Vi har mottatt en forespørsel om å melde deg av «${props.summary}».</p>
                <p>For å bekrefte denne handlingen, vennligst klikk på følgende lenke:</p>
                <p><a href="${url}">Bekreft avregistrering</a></p>
                </span>`;

  const emailTemplate = {
    to: props.to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject: `Bekreft avregistrering: ${props.summary}`,
    html,
  };

  const result = await sendEmail(emailTemplate);
  return result;
};
