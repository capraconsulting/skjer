import { browser } from '$app/environment';
import { init, register, locale, dictionary, _ } from 'svelte-i18n';

// Define a type for dictionary values (can be a string, array, null, or a nested object)
export type DictionaryValue = string | null | DictionaryValue[] | { [key: string]: DictionaryValue };

// Register locales
register('en', () => import('./locales/en.json'));
register('nb', () => import('./locales/nb.json'));

// Initialize with the default locale immediately to prevent a "Cannot format a message without first setting the initial locale" error
void init({
  fallbackLocale: 'nb',
  initialLocale: 'nb',
});

// Initialize the i18n library with user preferences
export function initI18n() {
  // Only run this in the browser
  if (browser) {
    // Determine the initial locale
    let initialLocale = 'nb'; // Default to Norwegian

    // First check if there's a preferred language in localStorage
    const preferredLanguage = localStorage.getItem('preferredLanguage');
    if (preferredLanguage) {
      initialLocale = preferredLanguage;
    } else {
      // If no preferred language, use the browser's language
      const browserLang = window.navigator.language.split('-')[0];
      // Only use the browser language if it's one of our supported languages
      if (['nb', 'en'].includes(browserLang)) {
        initialLocale = browserLang;
      }
    }

    // Update the locale if it's different from the default
    if (initialLocale !== 'nb') {
      void locale.set(initialLocale);
    }
  }
}

export { _, locale, dictionary };
