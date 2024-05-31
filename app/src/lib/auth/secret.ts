import { APP_SECRET } from "$env/static/private";

export const getUnsubscribeSecret = ({ event_id, email }: { event_id: number; email: string }) => {
  const secret = `${event_id}-${email}-${APP_SECRET}`;
  return secret;
};
