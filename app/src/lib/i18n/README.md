# Internationalization (i18n) Guide

This document provides instructions on how to use and extend the internationalization (i18n) system in the Skjer application.

## Overview

The application uses [svelte-i18n](https://github.com/kaisermann/svelte-i18n) for internationalization. The current implementation supports:

- Norwegian (nb) - Default language
- English (en)

## Directory Structure

```
app/src/lib/i18n/
├── index.ts         # Main configuration file
├── locales/         # Translation files
│   ├── nb.json      # Norwegian translations
│   ├── en.json      # English translations
│   └── ...          # Add more languages here
└── README.md        # This file
```

## How to Use Translations in Components

1. Import the translation function in your Svelte component:

```svelte
<script>
  import { _ } from '$lib/i18n';
</script>
```

2. Use the translation function in your component:

```svelte
<p>{$_('common.today')}</p>
```

## How to Add a New Language

1. Create a new JSON file in the `locales` directory with the language code as the filename (e.g., `de.json` for German).

2. Copy the structure from an existing locale file (e.g., `en.json`) and translate all values.

3. Register the new language in `index.ts`:

```typescript
// Register locales
register('en', () => import('./locales/en.json'));
register('nb', () => import('./locales/nb.json'));
register('de', () => import('./locales/de.json')); // Add this line
```

4. Update the language switcher component to include the new language:

```typescript
// In LanguageSwitcher.svelte
const languages = [
  { code: 'nb', name: 'Norsk' },
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' } // Add this line
];
```

5. If you're adding support for Slack notifications in the new language, update the translations in:
   - `app/src/routes/api/daily-recurring-event-scheduler/services/notification.ts`
   - `studio/lib/event-slack.ts`

## Date Formatting

Date formatting is handled in `app/src/lib/utils/date.util.ts`. When adding a new language, you may need to:

1. Import the appropriate locale from date-fns:

```typescript
import { nb, enUS, de } from "date-fns/locale";
```

2. Add the locale to the localeMap:

```typescript
const localeMap: Record<string, Locale> = {
  nb: nb,
  en: enUS,
  de: de // Add this line
};
```

3. Update the getLocaleString function to include the new language:

```typescript
function getLocaleString() {
  const currentLocale = get(locale);
  if (currentLocale === 'nb') return 'nb-NO';
  if (currentLocale === 'de') return 'de-DE'; // Add this line
  return 'en-US';
}
```

## Slack Notifications

Slack notifications are configured to use a specific language, which can be changed by updating:

- `SLACK_NOTIFICATION_LANGUAGE` in `app/src/routes/api/daily-recurring-event-scheduler/services/notification.ts`
- `SLACK_NOTIFICATION_LANGUAGE` in `studio/lib/event-slack.ts`

If you want to support multiple languages for Slack notifications, you'll need to implement a mechanism to determine which language to use for each notification.
