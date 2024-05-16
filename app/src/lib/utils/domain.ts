import { ALLOWED_DOMAINS } from "$models/allowedDomains.model";

export function validateDomain(email: string) {
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
}
