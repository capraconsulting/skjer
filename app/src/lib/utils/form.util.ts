import type { FormMessage } from "$models/form.model";

export function getAlertColor(message: FormMessage) {
  if (message.success) return "green";
  if (message.warning) return "yellow";
  return "red";
}
