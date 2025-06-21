/**
 * Fjern usynlige tegn fra text
 */
export function sanitize(input: string | null | undefined): string {
  if (!input) return "";
  return input
    .replace(/[\u200B-\u200F\u2060\uFEFF\u00AD]/g, "") // Remove zero-width spaces, soft hyphens, etc.
    .replace(/\u00A0/g, " ") // Replace non-breaking spaces with regular spaces
    .trim();
}
