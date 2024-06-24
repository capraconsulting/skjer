import { APP_SECRET } from "$env/static/private";
import type { TokenData } from "$models/jwt.model";

export const getUnsubscribeSecret = ({ document_id, event_id, email }: TokenData) => {
  const secret = `${document_id}-${event_id}-${email}-${APP_SECRET}`;
  return secret;
};
