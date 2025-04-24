import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { sendEmail } from "$lib/email/nodemailer";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

interface EmailConfirmDeclineProps {
  to: string;
  summary: string;
  organiser: string;
  token: string;
}

// TODO: Consider making this a function that takes a template from the Event Schema
export const sendEmailConfirmDecline = async (props: EmailConfirmDeclineProps) => {
  const url = `${PUBLIC_APP_BASE_URL}/event/unregistration/${props.token}`;

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'];
  const hello = dict?.email?.hello || "Hei,";
  const unregisterRequestReceived = (dict?.email?.unregisterRequestReceived || "Vi har mottatt en forespørsel om å melde deg av «{summary}».").replace("{summary}", props.summary);
  const confirmAction = dict?.email?.confirmAction || "For å bekrefte denne handlingen, vennligst klikk på følgende lenke:";
  const confirmUnregistration = dict?.email?.confirmUnregistration || "Bekreft avregistrering";
  const confirmUnregistrationSubject = (dict?.email?.confirmUnregistrationSubject || "Bekreft avregistrering: {summary}").replace("{summary}", props.summary);

  const html = `<span>
                <p>${hello}</p>
                <p>${unregisterRequestReceived}</p>
                <p>${confirmAction}</p>
                <p><a href="${url}">${confirmUnregistration}</a></p>
                </span>`;

  const emailTemplate = {
    to: props.to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject: confirmUnregistrationSubject,
    html,
  };

  const result = await sendEmail(emailTemplate);
  return result;
};
