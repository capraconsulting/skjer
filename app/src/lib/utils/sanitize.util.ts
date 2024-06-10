export function sanitize(input: string) {
  return input.toLowerCase().replace(/[^a-z]/g, "");
}
