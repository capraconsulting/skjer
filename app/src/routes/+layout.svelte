<script lang="ts">
  import { isPreviewing, VisualEditing } from "@sanity/visual-editing/svelte";
  import { page } from "$app/stores";
  import LiveMode from "$components/shared/LiveMode.svelte";
  import "../app.css";
  import Header from "$components/shared/Header.svelte";
  import Footer from "$components/shared/Footer.svelte";
  import { browser } from "$app/environment";
  import { initI18n } from "$lib/i18n";

  // Initialize i18n with user preferences on the client side
  // Note: i18n is already initialized with default locale when the module is imported
  if (browser) {
    initI18n();
  }

  let auth = $page.data.session;
</script>

{#if $page.url.pathname.endsWith("/embed")}
  <slot />
{:else}
  {#if $isPreviewing}
    <a
      href={`/preview/disable?redirect=${$page.url.pathname}`}
      class="box-shadow group fixed bottom-4 right-4 z-50 block rounded bg-white px-3 py-2 text-center text-xs font-medium leading-4 shadow hover:bg-red-500 hover:text-white dark:text-gray-800"
    >
      <span class="block group-hover:hidden">Forhåndsvisning på</span>
      <span class="hidden group-hover:block">Forhåndsvisning av</span>
    </a>
    <span
      class="box-shadow group fixed bottom-14 right-4 z-50 block rounded bg-black px-3 py-2 text-center text-xs font-medium leading-4 text-white shadow"
    >
      <span> For å se forhåndsvisning må arrangementet være publisert</span>
    </span>
  {/if}

  <Header {auth} />

  <div class="mx-auto min-h-[90vh] p-4 sm:max-w-[1200px] sm:px-12">
    <main class="mb-16 mt-8">
      <slot />
    </main>
  </div>

  <Footer />

  {#if $isPreviewing}
    <VisualEditing />
    <LiveMode />
  {/if}

  <style lang="postcss">
    :global(html) {
      &.dark {
        @apply bg-black;
      }
    }
  </style>
{/if}
