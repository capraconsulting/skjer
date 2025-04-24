<script lang="ts">
  import { locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const languages = [
    { code: 'nb', name: 'Norsk' },
    { code: 'en', name: 'English' }
  ];

  function switchLanguage(langCode: string) {
    // Set the locale in the store
    void locale.set(langCode);

    // Store the language preference in localStorage for persistence
    if (browser) {
      localStorage.setItem('preferredLanguage', langCode);

      // Force a page reload to ensure all components update with the new locale
      // This is a workaround for components that might not be reactive to locale changes
      window.location.reload();
    }
  }

  // Load the preferred language from localStorage when the component is initialized
  onMount(() => {
    if (browser) {
      const preferredLanguage = localStorage.getItem('preferredLanguage');
      if (preferredLanguage) {
        void locale.set(preferredLanguage);
      }
    }
  });
</script>

<div class="language-switcher">
  <select
    value={$locale}
    on:change={(e) => switchLanguage(e.currentTarget.value)}
    class="bg-transparent border border-gray-300 rounded px-2 py-1 text-sm"
  >
    {#each languages as lang}
      <option value={lang.code}>{lang.name}</option>
    {/each}
  </select>
</div>

<style>
  .language-switcher {
    display: inline-block;
  }
</style>
