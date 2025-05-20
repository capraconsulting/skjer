import { _ } from "$lib/i18n";
import type { Category } from "$models/sanity.model";
import { derived } from "svelte/store";

/**
 * Creates a reactive store that translates a category value
 * This should be used in Svelte components with the $ prefix
 * @param category The category value from the Sanity model
 * @returns A derived store with the translated category value
 */
export function createCategoryTranslation(category: Category | undefined) {
  return derived(_, ($_, set) => {
    if (!category) {
      set("");
      return;
    }

    // Get the translation key for this category
    let translationKey = "filter.social";
    if (category.includes("Sosialt")) {
      translationKey = "filter.social";
    } else if (category.includes("Fag")) {
      translationKey = "filter.academic";
    }

    // If we have a translation key, use it with $_() similar to EventFilter.svelte
    // Otherwise, return the original category value
    set(translationKey ? $_(translationKey) : category);
  });
}
