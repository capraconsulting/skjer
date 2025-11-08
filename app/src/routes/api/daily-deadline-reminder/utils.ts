export function createStatusResponse(stats: {
  total: number;
  notified: number;
  notifiedFailed: number;
  notifiedFailedDetails: unknown[];
}): Response {
  const { total, notified, notifiedFailed, notifiedFailedDetails } = stats;

  if (notified === total) {
    return new Response(`Success: Sent deadline reminders for ${total} events to Slack channel.`, {
      status: 200,
    });
  }

  const messages = [];
  if (notified > 0) {
    messages.push(`Sent ${notified}/${total} deadline reminders`);
  }
  if (notifiedFailed > 0) {
    messages.push(`Failed to send ${notifiedFailed} deadline reminders`);
    messages.push(JSON.stringify(notifiedFailedDetails));
  }

  return new Response(messages.join(", "), { status: 207 });
}
