import { ALLOWED_DOMAINS } from "../../constants/allowedDomains";

export function validateDomain(email: string) {
  return ALLOWED_DOMAINS.some((domain) => email.endsWith(domain));
}
