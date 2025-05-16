<script lang="ts">
  import { locale } from '$lib/i18n';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { Button } from "flowbite-svelte";
  import { GlobeIcon } from "svelte-feather-icons";

  const languages = [
    { code: 'nb', name: 'Norwegian', flag: '🇳🇴' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ];

  function switchLanguage(langCode: string) {
    // Set the locale in the store
    // This will trigger reactivity in all components that use the $_ function
    void locale.set(langCode);

    // Store the language preference in localStorage for persistence
    if (browser) {
      localStorage.setItem('preferredLanguage', langCode);
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

  // Get current language flag
  $: currentLanguage = languages.find(lang => lang.code === $locale) || languages[0];
</script>

<div class="language-switcher relative">
  <Button
    color="alternative"
    class="h-9 border-[#999] rounded-2xl p-2.5 flex items-center"
  >
    <span class="mr-1.5">{currentLanguage.flag}</span>
    <GlobeIcon strokeWidth={1.5} class="w-[50px]" />
    <select
      value={$locale}
      on:change={(e) => switchLanguage(e.currentTarget.value)}
      class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      aria-label="Select language"
    >
      {#each languages as lang}
        <option value={lang.code} title={lang.name}>{lang.flag}</option>
      {/each}
    </select>
  </Button>
</div>

<style>
  .language-switcher {
    display: inline-block;
  }
</style>
