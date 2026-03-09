export function createStatusResponse(stats: {
  total: number;
  reminded: number;
  remindedFailed: number;
  participantsReminded: number;
  remindedFailedDetails: unknown[];
}): Response {
  const { total, reminded, remindedFailed, participantsReminded, remindedFailedDetails } = stats;

  if (reminded === total) {
    return new Response(
      `Success: Sent event reminders for ${reminded} events to ${participantsReminded} participants.`,
      {
        status: 200,
      }
    );
  }

  const messages = [];
  if (reminded > 0) {
    messages.push(`Sent reminders for ${reminded}/${total} events`);
    messages.push(`Participants reminded: ${participantsReminded}`);
  }
  if (remindedFailed > 0) {
    messages.push(`Failed to send reminders for ${remindedFailed} events`);
    messages.push(JSON.stringify(remindedFailedDetails));
  }

  return new Response(messages.join(", "), { status: 207 });
}