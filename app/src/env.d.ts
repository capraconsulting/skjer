// Extend the environment variable types
declare module '$env/static/public' {
  export const PUBLIC_CAPRA_BASE_URL: string;
  export const PUBLIC_FRYDE_BASE_URL: string;
  export const PUBLIC_LIFLIG_BASE_URL: string;
}

declare module '$env/static/private' {
  export const SLACK_HOOK: string;
}
