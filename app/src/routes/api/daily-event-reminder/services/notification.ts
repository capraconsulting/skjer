import { sendEmailReminder } from "$lib/email/event/reminder";
import { PUBLIC_APP_BASE_URL } from "$env/static/public";
import { getAttendingParticipants } from "$lib/server/supabase/queries";
import type { BlockContent, Event } from "$models/sanity.model";

export async function sendReminderEmails(events: Event[]) {
  const results = await Promise.allSettled(
    events.map((event) => sendReminderEmailsForEvent(event))
  );

  const remindedEvents = results
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<{ eventId: string; participantsReminded: number }> =>
        result.status === "fulfilled"
    )
    .map((result) => result.value.eventId);

  const participantsReminded = results
    .filter(
      (
        result
      ): result is PromiseFulfilledResult<{ eventId: string; participantsReminded: number }> =>
        result.status === "fulfilled"
    )
    .reduce((count, result) => count + result.value.participantsReminded, 0);

  const failures = results.filter((result) => result.status === "rejected");

  return {
    remindedEvents,
    participantsReminded,
    failures,
  };
}

async function sendReminderEmailsForEvent(event: Event) {
  const participants = await getAttendingParticipants({ document_id: event._id });

  if (!participants.length) {
    return { eventId: event._id, participantsReminded: 0 };
  }

  const reminderPayload = createReminderPayload(event);
  const results = await Promise.allSettled(
    participants.map(({ email }) => sendEmailReminder({ ...reminderPayload, to: email }))
  );

  const failures = results.filter((result) => result.status === "rejected" || result.value.error);
  if (failures.length) {
    throw new Error(`Reminder emails failed for event ${event._id}: ${failures.length}`);
  }

  return { eventId: event._id, participantsReminded: participants.length };
}

function createReminderPayload(event: Event) {
  return {
    id: event._id,
    summary: event.title,
    description: event.summary,
    start: event.start,
    end: event.end,
    location: event.place,
    organiser: event.organisers,
    subject: "Påminnelse: Vi sees i morgen på",
    message: createReminderMessage(event),
  };
}

function createReminderMessage(event: Event): BlockContent {
  const unregistrationUrl = `${PUBLIC_APP_BASE_URL}/event/${event._id}`;

  return [
    createParagraph(`Hei! Dette er en automatisk påminnelse om at ${event.title} skjer i morgen.`),
    createParagraph("For mer informasjon om arrangementet, se her.", unregistrationUrl),
    createParagraph("Vi gleder oss til å se deg."),
  ].filter((block): block is NonNullable<typeof block> => Boolean(block));
}

function createParagraph(text: string, href?: string) {
  if (!text) {
    return null;
  }

  const linkKey = href ? crypto.randomUUID() : undefined;

  return {
    _key: crypto.randomUUID(),
    _type: "block" as const,
    children: [
      {
        _key: crypto.randomUUID(),
        _type: "span" as const,
        marks: linkKey ? [linkKey] : [],
        text,
      },
    ],
    markDefs: linkKey
      ? [
          {
            _key: linkKey,
            _type: "link" as const,
            href,
          },
        ]
      : [],
    style: "normal" as const,
  };
}
