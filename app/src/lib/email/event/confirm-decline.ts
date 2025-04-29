import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { sendEmail } from "$lib/email/nodemailer";
import { dictionary } from "$lib/i18n";
import { get } from "svelte/store";

// Define a type for dictionary values (can be a string, array, null, or a nested object)
type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

interface EmailConfirmDeclineProps {
  to: string;
  summary: string;
  organiser: string;
  token: string;
}

// Define the return type for the email function
interface EmailResult {
  error?: boolean;
  success?: boolean;
}

// TODO: Consider making this a function that takes a template from the Event Schema
export const sendEmailConfirmDecline = async (props: EmailConfirmDeclineProps): Promise<EmailResult> => {
  const url = `${PUBLIC_APP_BASE_URL}/event/unregistration/${props.token}`;

  // Get the dictionary for the default language (nb)
  const dict = get(dictionary)['nb'] as { [key: string]: DictionaryValue } | undefined;

  // Safely access dictionary values with proper type guards
  const hello = dict && typeof dict === 'object' && 'email' in dict &&
    dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
    'hello' in dict.email ? String(dict.email.hello) : "Hei,";

  const unregisterRequestReceived = (dict && typeof dict === 'object' && 'email' in dict &&
    dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
    'unregisterRequestReceived' in dict.email ?
    String(dict.email.unregisterRequestReceived) :
    "Vi har mottatt en forespørsel om å melde deg av «{summary}».").replace("{summary}", props.summary);

  const confirmAction = dict && typeof dict === 'object' && 'email' in dict &&
    dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
    'confirmAction' in dict.email ?
    String(dict.email.confirmAction) :
    "For å bekrefte denne handlingen, vennligst klikk på følgende lenke:";

  const confirmUnregistration = dict && typeof dict === 'object' && 'email' in dict &&
    dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
    'confirmUnregistration' in dict.email ?
    String(dict.email.confirmUnregistration) :
    "Bekreft avregistrering";

  const confirmUnregistrationSubject = (dict && typeof dict === 'object' && 'email' in dict &&
    dict.email && typeof dict.email === 'object' && !Array.isArray(dict.email) &&
    'confirmUnregistrationSubject' in dict.email ?
    String(dict.email.confirmUnregistrationSubject) :
    "Bekreft avregistrering: {summary}").replace("{summary}", props.summary);

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
