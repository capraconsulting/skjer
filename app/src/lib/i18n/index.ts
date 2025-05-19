import { browser } from '$app/environment';
import { init, register, locale, dictionary, _ } from 'svelte-i18n';
import { get } from 'svelte/store';

// Register locales
register('en', () => import('./locales/en.json'));
register('nb', () => import('./locales/nb.json'));

// Initialize with the default locale immediately to prevent a "Cannot format a message without first setting the initial locale" error
void init({
  fallbackLocale: 'nb',
  initialLocale: 'nb',
});

// Set the locale synchronously to ensure it's available immediately
void locale.set('nb');

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

/**
 * Helper function to get translations
 * @param key The translation key
 * @param lang Optional language code to force a specific language. This is used in server-side contexts
 * where we need to generate content in the user's preferred language (determined from request headers)
 * regardless of the application's current locale setting. Particularly useful for emails and API responses.
 *
 * For example, in internal/action.ts, the server extracts the user's preferred language from the
 * 'accept-language' HTTP header (requestEvent.request.headers.get('accept-language')) and passes
 * it to this function to ensure all messages and emails are in the user's preferred language.
 * This is only possible in a server-side context where HTTP request headers are accessible.
 * @returns The translated string
 */
export function getTranslation(key: string, lang?: string): string {
  // Use the _ function from svelte-i18n which is reactive
  // We need to use get() to access the value of the store

  // If a specific language is requested, temporarily set it
  if (lang && ['en', 'nb'].includes(lang)) {
    const currentLocale = get(locale);
    void locale.set(lang);
    const translation = get(_)(key);
    void locale.set(currentLocale); // Restore the original locale
    return translation;
  }

  return get(_)(key);
}

/**
 * Extracts the preferred language from request
 * @param request The request object containing headers and cookies
 * @returns The preferred language code ('en' or 'nb')
 */
export function getPreferredLanguageFromRequest(request: Request): string {
  // First check if there's a preferredLanguage cookie
  const cookies = request.headers.get('cookie') || '';
  const preferredLanguageCookie = cookies.split(';')
    .map(cookie => cookie.trim())
    .find(cookie => cookie.startsWith('preferredLanguage='));

  if (preferredLanguageCookie) {
    const preferredLanguage = preferredLanguageCookie.split('=')[1];
    if (['en', 'nb'].includes(preferredLanguage)) {
      return preferredLanguage;
    }
  }

  // Default to Norwegian if no cookie is found
  return 'nb';
}

export { _, locale, dictionary };
