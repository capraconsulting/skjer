export function createStatusResponse(stats: {
  total: number;
  published: number;
  publishFailed: number;
  publishFailedDetails: unknown[];
  notified: number;
  notifiedFailed: number;
  notifiedFailedDetails: unknown[];
}): Response {
  const {
    total,
    published,
    publishFailed,
    publishFailedDetails,
    notified,
    notifiedFailed,
    notifiedFailedDetails,
  } = stats;

  if (published === total && notified === published) {
    return new Response(`Success: Updated ${total} events and slack messages were sent successfully.`, {
      status: 200,
    });
  }

  const messages = [];
  if (published) {
    messages.push(`Published ${published}/${total} events`);
  }
  if (publishFailed > 0) {
    messages.push(`Failed to update ${publishFailed} events`);
    messages.push(JSON.stringify(publishFailedDetails));
  }
  if (notifiedFailed > 0) {
    messages.push(`Failed to send ${notifiedFailed} slack notifications`);
    messages.push(JSON.stringify(notifiedFailedDetails));
  }
  return new Response(messages.join(", "), { status: 207 });
}
