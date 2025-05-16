import { _ } from "$lib/i18n";
import { get } from "svelte/store";
import type { Category } from "$models/sanity.model";

/**
 * Translates a category value from the Sanity model to the user's language
 * @param category The category value from the Sanity model
 * @returns The translated category value
 */
export function translateCategory(category: Category | undefined): string {
  if (!category) return "";

  // Map Sanity category values to translation keys
  const categoryMap: Record<Category, string> = {
    "Sosialt": "filter.social",
    "Fag": "filter.academic"
  };

  // Get the translation key for this category
  const translationKey = categoryMap[category];

  // If we have a translation key, use it; otherwise, return the original value
  return translationKey ? get(_)(translationKey) : category;
}
