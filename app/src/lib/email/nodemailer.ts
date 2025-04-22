import { SMTP_AUTH_KEY, SMTP_AUTH_USER, SMTP_HOST } from "$env/static/private";
import type { BlockContent } from "$models/sanity.model";
import { toHTML } from "@portabletext/to-html";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

/**
 * Retry a function with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retries
 * @param initialDelay Initial delay in milliseconds
 * @param factor Exponential backoff factor
 * @returns The result of the function or throws an error after all retries fail
 */
async function retryWithExponentialBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 500,
  factor: number = 2
): Promise<T> {
  let lastError: Error | unknown;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries) {
        break;
      }

      console.log(`Email sending attempt ${attempt + 1} failed, retrying in ${delay}ms...`);

      // Wait for the specified delay before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase the delay for the next attempt
      delay *= factor;
    }
  }

  throw lastError;
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: SMTP_AUTH_USER,
    pass: SMTP_AUTH_KEY,
  },
});

/**
 * Send an email with retry mechanism
 * @param mailParams Email parameters
 * @returns Object indicating success or failure with error details
 */
export const sendEmail = async (mailParams: Mail.Options) => {
  try {
    // Validate required email parameters
    if (!mailParams.to) {
      throw new Error("Recipient (to) is required");
    }
    if (!mailParams.subject) {
      throw new Error("Subject is required");
    }
    if (!mailParams.html && !mailParams.text) {
      throw new Error("Email content (html or text) is required");
    }

    // Use retry mechanism for sending email
    await retryWithExponentialBackoff(
      async () => {
        const info = await transporter.sendMail(mailParams);
        return info;
      },
      3,  // Maximum 3 retries
      500, // Start with 500ms delay
      2    // Double the delay on each retry
    );

    return {
      success: true,
      error: false
    };
  } catch (error) {
    console.error("Error sending email:", error);

    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : String(error);
    const recipient = typeof mailParams.to === 'string' ? mailParams.to : Array.isArray(mailParams.to) ? mailParams.to.join(', ') : 'unknown';

    return {
      success: false,
      error: true,
      message: errorMessage,
      details: `Failed to send email to ${recipient}. Please try again or contact support if the issue persists.`
    };
  }
};

interface EmailTemplateProps {
  to: string;
  subject: string;
  message: BlockContent;
  icsFile: Buffer;
}

export const composeEmail = ({ to, subject, message, icsFile }: EmailTemplateProps) => {
  return {
    to,
    from: "Skjer <no-reply@capragruppen.no>",
    subject,
    html: wrapWithStyles(toHTML(message)),
    icalEvent: {
      method: "request",
      content: icsFile,
    },
  };
};

export const wrapWithStyles = (html: string) => {
  return `<div style="font-family: Roboto, sans-serif; font-style: normal; font-weight: 400; font-size: 14px; line-height: 20px; letter-spacing: 0.2px; color: #3c4043;">${html}</div>`;
};
