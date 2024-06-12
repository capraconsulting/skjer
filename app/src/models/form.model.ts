export type FormMessage =
  | { text: string; success: boolean; warning?: never; error?: never }
  | { text: string; success?: never; warning: boolean; error?: never }
  | { text: string; success?: never; warning?: never; error: boolean };
