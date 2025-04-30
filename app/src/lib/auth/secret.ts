import { APP_SECRET } from "$env/static/private";
import type { TokenData } from "$models/jwt.model";

export const getUnsubscribeSecret = ({ document_id, event_id, email }: TokenData) => {
  return `${document_id}-${String(event_id)}-${email}-${APP_SECRET}`;
};
